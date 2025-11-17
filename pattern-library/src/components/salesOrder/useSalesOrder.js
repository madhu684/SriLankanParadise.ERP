import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  get_customers_by_company_id_api,
  post_sales_order_api,
  post_sales_order_detail_api,
  get_company_api,
  get_sales_persons_by_company_id_api,
} from "../../services/salesApi";
import {
  get_charges_and_deductions_by_company_id_api,
  post_charges_and_deductions_applied_api,
  get_transaction_types_api,
  get_sum_location_inventories_by_locationId_itemMasterId_api,
  get_user_locations_by_user_id_api,
} from "../../services/purchaseApi";
import { get_item_masters_by_company_id_with_query_api } from "../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useSalesOrder = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    customerPoNumber: "",
    customerId: "",
    orderDate: new Date().toISOString().split("T")[0],
    deliveryDate: "",
    itemDetails: [],
    status: 0,
    attachments: [],
    totalAmount: 0,
    subTotal: 0,
    selectedCustomer: "",
    salesPersonId: null,
    selectedSalesPerson: null,
    commonChargesAndDeductions: [],
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [referenceNo, setReferenceNo] = useState(null);
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [showCreateCustomerMoalInParent, setShowCreateCustomerModalInParent] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [salesPersonSearchTerm, setSalesPersonSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [warehouseLocationId, setWarehouseLocationId] = useState(null);

  const alertRef = useRef(null);

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================
  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);
  const userId = useMemo(() => sessionStorage.getItem("userId"), []);
  const username = useMemo(() => sessionStorage.getItem("username"), []);

  // ============================================================================
  // DATA FETCHING - REACT QUERY
  // ============================================================================

  // Fetch user locations - FIX: Pass function reference, not function call
  const {
    data: userLocations = [],
    isLoading: isUserLocationsLoading,
    isError: isUserLocationsError,
    error: userLocationsError,
  } = useQuery({
    queryKey: ["userLocations", formData.salesPersonId],
    queryFn: async () => {
      const response = await get_user_locations_by_user_id_api(
        parseInt(formData.salesPersonId)
      );
      const locations = response.data.result.filter(
        (location) => location.location.locationTypeId === 2
      );

      // Set warehouse location from first result
      if (locations.length > 0) {
        setWarehouseLocationId(locations[0].locationId);
      }

      return locations;
    },
    enabled: !!formData.salesPersonId,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch items
  const {
    data: availableItems,
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", companyId, searchTerm],
    queryFn: async () => {
      const response = await get_item_masters_by_company_id_with_query_api(
        companyId,
        searchTerm,
        false
      );
      return response.data.result;
    },
    enabled: searchTerm.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch customers
  const {
    data: customers,
    isLoading: isCustomersLoading,
    isError: isCustomersError,
    error: customersError,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["customers", companyId],
    queryFn: async () => {
      const response = await get_customers_by_company_id_api(companyId);
      return response.data.result || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch sales persons
  const {
    data: salesPersons,
    isLoading: isSalesPersonsLoading,
    isError: isSalesPersonsError,
    error: salesPersonsError,
  } = useQuery({
    queryKey: ["salesPersons", companyId],
    queryFn: async () => {
      const response = await get_sales_persons_by_company_id_api(companyId);
      return response.data.result || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch company
  const {
    data: company,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
    error: companyError,
  } = useQuery({
    queryKey: ["company", companyId],
    queryFn: async () => {
      const response = await get_company_api(companyId);
      return response.data.result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - company data rarely changes
  });

  // Fetch charges and deductions
  const {
    data: chargesAndDeductions,
    isLoading: isLoadingchargesAndDeductions,
    isError: ischargesAndDeductionsError,
    error: chargesAndDeductionsError,
    refetch: refetchChargesAndDeductions,
  } = useQuery({
    queryKey: ["chargesAndDeductions", companyId],
    queryFn: async () => {
      const response = await get_charges_and_deductions_by_company_id_api(
        companyId
      );
      return response.data.result;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch transaction types
  const {
    data: transactionTypes,
    isLoading: isLoadingTransactionTypes,
    isError: isTransactionTypesError,
    error: transactionTypesError,
  } = useQuery({
    queryKey: ["transactionTypes", companyId],
    queryFn: async () => {
      const response = await get_transaction_types_api(companyId);
      return response.data.result;
    },
    staleTime: 10 * 60 * 1000,
  });

  // ============================================================================
  // MEMOIZED CALCULATIONS
  // ============================================================================

  // Memoized charges initialization
  const getInitializedCharges = useMemo(() => {
    return (
      chargesAndDeductions
        ?.filter((charge) => charge.isApplicableForLineItem)
        ?.map((charge) => ({
          id: charge.chargesAndDeductionId,
          name: charge.displayName,
          value: charge.amount || charge.percentage,
          sign: charge.sign,
          isPercentage: charge.percentage !== null,
        })) || []
    );
  }, [chargesAndDeductions]);

  // Memoized subtotal calculation
  const subTotal = useMemo(() => {
    return formData.itemDetails.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
  }, [formData.itemDetails]);

  // Memoized total amount calculation
  const totalAmount = useMemo(() => {
    let total = subTotal;
    formData.commonChargesAndDeductions.forEach((charge) => {
      const amount = charge.isPercentage
        ? (subTotal * charge.value) / 100
        : charge.value;
      total += charge.sign === "+" ? amount : -amount;
    });
    return total;
  }, [subTotal, formData.commonChargesAndDeductions]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Update totals when relevant data changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      subTotal,
      totalAmount,
    }));
  }, [subTotal, totalAmount]);

  // Scroll to alert when submission status changes
  useEffect(() => {
    if (submissionStatus !== null && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  // Initialize common charges when charges data loads
  useEffect(() => {
    if (
      chargesAndDeductions &&
      formData.commonChargesAndDeductions.length === 0
    ) {
      const initializedChargesArray = chargesAndDeductions
        .filter((charge) => charge.isDisableFromSubTotal === false)
        .map((charge) => ({
          id: charge.chargesAndDeductionId,
          name: charge.displayName,
          value: charge.amount || charge.percentage,
          sign: charge.sign,
          isPercentage: charge.percentage !== null,
        }));

      setFormData((prev) => ({
        ...prev,
        commonChargesAndDeductions: initializedChargesArray,
      }));
    }
  }, [chargesAndDeductions]);

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validateField = useCallback(
    (fieldName, fieldDisplayName, value, additionalRules = {}) => {
      let isFieldValid = true;
      let errorMessage = "";

      if (value === null || value === undefined || `${value}`.trim() === "") {
        isFieldValid = false;
        errorMessage = `${fieldDisplayName} is required`;
      }

      if (
        isFieldValid &&
        additionalRules.validationFunction &&
        !additionalRules.validationFunction(value)
      ) {
        isFieldValid = false;
        errorMessage = additionalRules.errorMessage;
      }

      setValidFields((prev) => ({ ...prev, [fieldName]: isFieldValid }));
      setValidationErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));

      return isFieldValid;
    },
    []
  );

  const validateAttachments = useCallback((files) => {
    let isAttachmentsValid = true;
    let errorMessage = "";
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!files || files.length === 0) {
      return true;
    }

    for (const file of files) {
      if (file.size > maxSizeInBytes) {
        isAttachmentsValid = false;
        errorMessage = "Attachment size exceeds the limit (10MB)";
        break;
      }

      if (!allowedTypes.includes(file.type)) {
        isAttachmentsValid = false;
        errorMessage =
          "Invalid file type. Allowed types: JPEG, PNG, PDF, Word documents";
        break;
      }
    }

    setValidFields((prev) => ({ ...prev, attachments: isAttachmentsValid }));
    setValidationErrors((prev) => ({ ...prev, attachments: errorMessage }));

    return isAttachmentsValid;
  }, []);

  const validateForm = useCallback(() => {
    let isCustomerValid = true;

    isCustomerValid = validateField(
      "customerId",
      "Customer",
      formData.customerId
    );

    const isSalesPersonValid = validateField(
      "salesPersonId",
      "Sales Person",
      formData.salesPersonId
    );

    const isOrderDateValid = validateField(
      "orderDate",
      "Order date",
      formData.orderDate
    );

    const isDeliveryDateValid = validateField(
      "deliveryDate",
      "Delivery date",
      formData.deliveryDate
    );

    const isCustomerPoNovalid = validateField(
      "customerPoNumber",
      "Customer PO Number",
      formData.customerPoNumber
    );

    const isAttachmentsValid = validateAttachments(formData.attachments);

    let isItemQuantityValid = true;
    formData.itemDetails.forEach((item, index) => {
      const fieldName = `quantity_${index}`;
      const fieldDisplayName = `Quantity for ${item.name}`;

      const additionalRules = {
        validationFunction: (value) =>
          parseFloat(value) > 0 && parseFloat(value) <= item.tempQuantity,
        errorMessage: `${fieldDisplayName} must be greater than 0 and less than or equal to ${item.tempQuantity}`,
      };

      const isValidQuantity = validateField(
        fieldName,
        fieldDisplayName,
        item.quantity,
        additionalRules
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    return (
      isCustomerValid &&
      isSalesPersonValid &&
      isOrderDateValid &&
      isDeliveryDateValid &&
      isCustomerPoNovalid &&
      isAttachmentsValid &&
      isItemQuantityValid
    );
  }, [formData, validateField, validateAttachments]);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const getTransactionTypeIdByName = useCallback(
    (name) => {
      const transactionType = transactionTypes?.find(
        (type) => type.name === name
      );
      return transactionType ? transactionType.transactionTypeId : null;
    },
    [transactionTypes]
  );

  const postChargesAndDeductionsApplied = useCallback(
    async (transactionId) => {
      const transactionTypeId = getTransactionTypeIdByName("SaleOrder");

      // Process item-level charges
      const itemChargesPromises = formData.itemDetails.flatMap((item) =>
        item.chargesAndDeductions.map(async (charge) => {
          let appliedValue = 0;

          if (charge.name === "SSL") {
            // Calculate the amount based on percentage and sign
            const amount =
              item.isInventoryItem === true
                ? ((item.quantity * item.unitPrice) / (100 - charge.value)) *
                  charge.value
                : (item.unitPrice / (100 - charge.value)) * charge.value;
            appliedValue = charge.sign === "+" ? amount : -amount;
          } else if (charge.isPercentage) {
            // Calculate the amount based on percentage and sign
            const amount =
              item.isInventoryItem === true
                ? (item.quantity * item.unitPrice * charge.value) / 100
                : (item.unitPrice * charge.value) / 100;
            appliedValue = charge.sign === "+" ? amount : -amount;
          } else {
            // Use the value directly based on the sign
            appliedValue = charge.sign === "+" ? charge.value : -charge.value;
          }

          const chargesAndDeductionAppliedData = {
            chargesAndDeductionId: charge.id,
            transactionId: transactionId,
            transactionTypeId,
            lineItemId: item.itemMasterId,
            appliedValue,
            dateApplied: new Date().toISOString(),
            createdBy: sessionStorage?.getItem("userId"),
            createdDate: new Date().toISOString(),
            modifiedBy: sessionStorage?.getItem("userId"),
            modifiedDate: new Date().toISOString(),
            status: true,
            companyId: sessionStorage?.getItem("companyId"),
            permissionId: 1056,
          };

          return await post_charges_and_deductions_applied_api(
            chargesAndDeductionAppliedData
          );
        })
      );

      // Process common charges
      const commonChargesPromises = formData.commonChargesAndDeductions.map(
        async (charge) => {
          const appliedValue = charge.isPercentage
            ? ((formData.subTotal * charge.value) / 100) *
              (charge.sign === "+" ? 1 : -1)
            : charge.value * (charge.sign === "+" ? 1 : -1);

          return await post_charges_and_deductions_applied_api({
            chargesAndDeductionId: charge.id,
            transactionId,
            transactionTypeId,
            lineItemId: null,
            appliedValue,
            dateApplied: new Date().toISOString(),
            createdBy: userId,
            createdDate: new Date().toISOString(),
            modifiedBy: userId,
            modifiedDate: new Date().toISOString(),
            status: true,
            companyId,
            permissionId: 1056,
          });
        }
      );

      return await Promise.all([
        ...itemChargesPromises,
        ...commonChargesPromises,
      ]);
    },
    [formData, getTransactionTypeIdByName, userId, companyId]
  );

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSubmit = useCallback(
    async (isSaveAsDraft) => {
      try {
        const isFormValid = validateForm();
        if (!isFormValid) return;

        isSaveAsDraft ? setLoadingDraft(true) : setLoading(true);

        const currentDate = new Date().toISOString();
        const salesOrderData = {
          customerId: formData.customerId,
          orderDate: formData.orderDate,
          deliveryDate: formData.deliveryDate,
          totalAmount: formData.totalAmount,
          status: isSaveAsDraft ? 0 : 1,
          createdBy: username,
          createdUserId: userId,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          companyId,
          createdDate: currentDate,
          lastUpdatedDate: currentDate,
          permissionId: 25,
          salesPersonId: formData.salesPersonId,
          inventoryLocationId: warehouseLocationId,
          customerPoNumber: formData.customerPoNumber,
        };

        const response = await post_sales_order_api(salesOrderData);
        if (response.status !== 201)
          throw new Error("Sales order creation failed");

        setReferenceNo(response.data.result.referenceNo);
        const salesOrderId = response.data.result.salesOrderId;

        // Post sales order details
        const detailResponses = await Promise.all(
          formData.itemDetails.map((item) =>
            post_sales_order_detail_api({
              itemBatchItemMasterId: item.itemMasterId,
              itemBatchBatchId: item.batchId,
              salesOrderId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              permissionId: 25,
            })
          )
        );

        // Post charges and deductions
        const chargesResponses = await postChargesAndDeductionsApplied(
          salesOrderId
        );

        const allSuccessful =
          detailResponses.every((r) => r.status === 201) &&
          chargesResponses.every((r) => r.status === 201);

        if (allSuccessful) {
          setSubmissionStatus(
            isSaveAsDraft ? "successSavedAsDraft" : "successSubmitted"
          );
          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            setLoadingDraft(false);
            onFormSubmit();
          }, 3000);

          toast.success("Sales order submitted successfully");
        } else {
          throw new Error("Some operations failed during submission");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmissionStatus("error");
        setTimeout(() => {
          setSubmissionStatus(null);
          setLoading(false);
          setLoadingDraft(false);
        }, 3000);

        toast.error(
          error.response?.data?.message || "Failed to submit sales order"
        );
      }
    },
    [
      validateForm,
      formData,
      username,
      userId,
      companyId,
      warehouseLocationId,
      postChargesAndDeductionsApplied,
      onFormSubmit,
    ]
  );

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => {
      if (field.startsWith("commonChargesAndDeductions")) {
        const chargeIndex = parseInt(field.split("_")[1]);
        const updatedCharges = [...prev.commonChargesAndDeductions];
        updatedCharges[chargeIndex].value = value;
        return { ...prev, commonChargesAndDeductions: updatedCharges };
      }
      return { ...prev, [field]: value };
    });
  }, []);

  const handleCustomerChange = useCallback(
    (customerId) => {
      const selectedCustomer = customers?.find(
        (customer) => customer.customerId === parseInt(customerId, 10)
      );
      setFormData((prev) => ({ ...prev, customerId, selectedCustomer }));
    },
    [customers]
  );

  const handleItemDetailsChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedItemDetails = prev.itemDetails.map((item, idx) => {
        if (idx !== index) return item;

        const updatedItem = {
          ...item,
          chargesAndDeductions: item.chargesAndDeductions.map((charge) => ({
            ...charge,
          })),
        };

        if (field.startsWith("chargesAndDeductions")) {
          const chargeIndex = parseInt(field.split("_")[1]);
          updatedItem.chargesAndDeductions[chargeIndex].value = value;
        } else {
          updatedItem[field] = value;
        }

        updatedItem.quantity = Math.max(0, updatedItem.quantity);
        updatedItem.unitPrice = Math.max(
          0,
          parseFloat(updatedItem.unitPrice) || 0
        );

        // Calculate total price
        const grandTotalPrice = updatedItem.quantity * updatedItem.unitPrice;
        let totalPrice = grandTotalPrice;

        updatedItem.chargesAndDeductions.forEach((charge) => {
          if (charge.name === "SSL") {
            const amount =
              (grandTotalPrice / (100 - charge.value)) * charge.value;
            totalPrice += charge.sign === "+" ? amount : -amount;
          } else if (charge.isPercentage) {
            const amount = (grandTotalPrice * charge.value) / 100;
            totalPrice += charge.sign === "+" ? amount : -amount;
          } else {
            totalPrice += charge.sign === "+" ? charge.value : -charge.value;
          }
        });

        updatedItem.totalPrice = Math.max(0, totalPrice);
        return updatedItem;
      });

      return { ...prev, itemDetails: updatedItemDetails };
    });
  }, []);

  const handleRemoveItem = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      itemDetails: prev.itemDetails.filter((_, idx) => idx !== index),
    }));
    setValidFields({});
    setValidationErrors({});
  }, []);

  const handleAttachmentChange = useCallback((files) => {
    setFormData((prev) => ({ ...prev, attachments: files }));
  }, []);

  const handleSelectItem = useCallback(
    async (item) => {
      if (!userLocations?.[0]?.locationId) {
        toast.error("No user location available");
        return;
      }

      try {
        const inventory =
          await get_sum_location_inventories_by_locationId_itemMasterId_api(
            item.itemMasterId,
            userLocations[0].locationId
          );
        const availableStock = inventory?.data?.result?.totalStockInHand || 0;

        if (availableStock <= 0) {
          toast.error(
            `No stock available for "${item.itemName}" in user location`
          );
          setSearchTerm("");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          itemDetails: [
            ...prev.itemDetails,
            {
              itemMasterId: item.itemMasterId,
              name: item.itemName || "",
              unit: item.unit?.unitName || "",
              quantity: 0,
              unitPrice: item.unitPrice || 0,
              totalPrice: 0,
              batchId: null,
              tempQuantity: availableStock,
              packSize: item?.conversionRate || 1,
              isInventoryItem: item?.isInventoryItem,
              chargesAndDeductions: getInitializedCharges,
            },
          ],
        }));

        setSearchTerm("");
      } catch (error) {
        console.error("Error processing item:", error);
        toast.error("Failed to add item");
        setSearchTerm("");
      }
    },
    [userLocations, getInitializedCharges]
  );

  const handleSelectCustomer = useCallback((selectedCustomer) => {
    setFormData((prev) => ({
      ...prev,
      customerId: selectedCustomer.customerId,
      selectedCustomer,
    }));
    setCustomerSearchTerm("");
    setValidFields({});
    setValidationErrors({});
  }, []);

  const handleSelectSalesPerson = useCallback((selectedSalesPerson) => {
    setFormData((prev) => ({
      ...prev,
      salesPersonId: selectedSalesPerson.userId,
      selectedSalesPerson,
    }));
    setSalesPersonSearchTerm("");
    setValidFields({});
    setValidationErrors({});
  }, []);

  const handleResetCustomer = useCallback(() => {
    setFormData((prev) => ({ ...prev, selectedCustomer: "", customerId: "" }));
  }, []);

  const handleResetSalesPerson = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      selectedSalesPerson: null,
      salesPersonId: null,
      itemDetails: [],
    }));
  }, []);

  const handleBatchSelection = useCallback(
    (batchId) => {
      const selectedBatchId = parseInt(batchId, 10);
      const batch = formData.fifoBatchDetails?.find(
        (b) => b.batchId === selectedBatchId
      );

      if (!batch) {
        console.error("Batch not found");
        return;
      }

      setSelectedBatch(batch);
      setFormData((prev) => ({
        ...prev,
        itemDetails: [
          ...prev.itemDetails,
          {
            itemMasterId: batch.itemMasterId,
            itemBatchId: batch.batchId,
            name: formData.itemMaster?.itemName || "",
            unit: formData.itemMaster?.unit?.unitName || "",
            batchRef: batch.batch?.batchRef || "",
            quantity: 0,
            unitPrice: batch.sellingPrice,
            totalPrice: 0,
            chargesAndDeductions: getInitializedCharges,
            batch,
            tempQuantity: batch.tempQuantity,
          },
        ],
      }));

      setShowModal(false);
    },
    [formData.fifoBatchDetails, formData.itemMaster, getInitializedCharges]
  );

  const handleAddCustomer = useCallback(
    (responseData) => {
      handleSelectCustomer(responseData);
      refetchCustomers();
    },
    [handleSelectCustomer, refetchCustomers]
  );

  const renderColumns = useCallback(() => {
    return chargesAndDeductions?.map((charge) => {
      if (charge.isApplicableForLineItem) {
        return (
          <th key={charge.chargesAndDeductionId}>
            {charge.sign + " "}
            {charge.displayName}
            {charge.percentage !== null && " (%)"}
          </th>
        );
      }
      return null;
    });
  }, [chargesAndDeductions]);

  const renderSubColumns = useCallback(() => {
    if (!formData.itemDetails[0]) return null;

    return formData.commonChargesAndDeductions.map((charge, chargeIndex) => {
      if (charge.name === "SSL") return null;

      const colSpan =
        6 +
        formData.itemDetails[0].chargesAndDeductions.length -
        (company?.batchStockType === "FIFO" ? 1 : 0);

      return (
        <tr key={chargeIndex}>
          <td colSpan={colSpan}></td>
          <th>
            {charge.sign + " "}
            {charge.name}
            {charge.isPercentage && " (%)"}
          </th>
          <td>
            <input
              className="form-control"
              type="number"
              value={charge.value}
              onChange={(e) => {
                let newValue = parseFloat(e.target.value) || 0;
                if (charge.isPercentage) {
                  newValue = Math.min(100, Math.max(0, newValue));
                } else {
                  newValue = Math.max(0, newValue);
                }
                handleInputChange(
                  `commonChargesAndDeductions_${chargeIndex}_value`,
                  newValue
                );
              }}
            />
          </td>
        </tr>
      );
    });
  }, [formData, company, handleInputChange]);

  console.log("Sales Order form data: ", formData);

  return {
    // State
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    referenceNo,
    showCreateCustomerModal,
    showCreateCustomerMoalInParent,
    searchTerm,
    selectedBatch,
    customerSearchTerm,
    salesPersonSearchTerm,
    loading,
    loadingDraft,
    showModal,
    warehouseLocationId,

    // Refs
    alertRef,

    // Query data
    customers,
    salesPersons,
    availableItems,
    chargesAndDeductions,
    company,
    userLocations,

    // Loading states
    isItemsLoading,
    isCustomersLoading,
    isSalesPersonsLoading,
    isLoadingchargesAndDeductions,
    isLoadingTransactionTypes,
    isCompanyLoading,
    isWarehouseLocationLoading: isUserLocationsLoading,

    // Error states
    isItemsError,
    isCustomersError,
    isSalesPersonsError,
    ischargesAndDeductionsError,
    isTransactionTypesError,
    itemsError,
    customersError,
    salesPersonsError,
    chargesAndDeductionsError,

    // Setters
    setSearchTerm,
    setCustomerSearchTerm,
    setSalesPersonSearchTerm,
    setShowCreateCustomerModal,
    setShowCreateCustomerModalInParent,

    // Handlers
    handleInputChange,
    handleCustomerChange,
    handleItemDetailsChange,
    handleAttachmentChange,
    handleSubmit,
    handleRemoveItem,
    handlePrint: () => window.print(),
    handleAddCustomer,
    handleSelectItem,
    handleBatchSelection,
    handleSelectCustomer,
    handleSelectSalesPerson,
    handleResetCustomer,
    handleResetSalesPerson,
    handleShowCreateCustomerModal: () => {
      setShowCreateCustomerModal(true);
      setShowCreateCustomerModalInParent(true);
    },
    handleCloseCreateCustomerModal: () => {
      setShowCreateCustomerModal(false);
      setTimeout(() => setShowCreateCustomerModalInParent(false), 300);
    },

    // Calculations
    calculateSubTotal: () => subTotal,
    calculateTotalAmount: () => totalAmount,

    // Render helpers
    renderColumns,
    renderSubColumns,

    // Modal controls
    openModal: () => setShowModal(true),
    closeModal: () => setShowModal(false),
  };
};

export default useSalesOrder;
