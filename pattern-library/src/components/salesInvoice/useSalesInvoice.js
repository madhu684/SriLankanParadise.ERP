import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  post_sales_invoice_api,
  post_sales_invoice_detail_api,
  get_company_api,
  search_customer_api,
} from "../../services/salesApi";
import {
  get_charges_and_deductions_by_company_id_api,
  post_charges_and_deductions_applied_api,
  get_charges_and_deductions_applied_api,
  get_transaction_types_api,
  get_user_locations_by_user_id_api,
  get_locations_inventories_by_location_id_api,
  get_sum_location_inventories_by_locationId_itemMasterId_api,
} from "../../services/purchaseApi";
import {
  get_item_masters_by_company_id_with_query_api,
  get_item_price_list_by_locationId,
} from "../../services/inventoryApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useSalesInvoice = ({ onFormSubmit, salesOrder }) => {
  const [formData, setFormData] = useState({
    selectedCustomer: null,
    customerDeliveryAddressId: null,
    driverName: null,
    vehicleNo: null,
    totalLitres: 0,
    storeLocation: null,
    invoiceDate: "",
    dueDate: "",
    referenceNumber: "",
    itemDetails: [],
    attachments: [],
    totalAmount: 0,
    salesOrderId: "",
    subTotal: 0,
    commonChargesAndDeductions: [],
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  const [referenceNo, setReferenceNo] = useState(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const queryClient = useQueryClient();
  const userId = sessionStorage.getItem("userId");
  const companyId = sessionStorage.getItem("companyId");
  const username = sessionStorage.getItem("username");

  // ==================== QUERIES ====================
  const {
    data: userLocations,
    isLoading: isUserLocationsLoading,
    isError: isUserLocationsError,
    error: userLocationsError,
  } = useQuery({
    queryKey: ["userLocations", userId],
    queryFn: async () => {
      const response = await get_user_locations_by_user_id_api(userId);
      return response.data.result.filter(
        (location) => location.location.locationTypeId === 2
      );
    },
  });

  const {
    data: availableItems = [],
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", searchTerm],
    queryFn: async () => {
      const response = await get_item_masters_by_company_id_with_query_api(
        companyId,
        searchTerm,
        true
      );
      return response.data.result;
    },
    enabled: !!formData.storeLocation && !!searchTerm,
  });

  const {
    data: locationInventories,
    isLoading: isLocationInventoriesLoading,
    isError: isLocationInventoriesError,
    refetch: refetchLocationInventories,
  } = useQuery({
    queryKey: ["locationInventories", formData.storeLocation],
    queryFn: async () => {
      if (!formData.storeLocation) return [];
      const response = await get_locations_inventories_by_location_id_api(
        formData.storeLocation
      );
      return response.data.result || [];
    },
    enabled: !!formData.storeLocation,
  });

  const {
    data: customers = [],
    isLoading: isCustomersLoading,
    isError: isCustomersError,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["customers", customerSearchTerm],
    queryFn: async () => {
      const response = await search_customer_api(customerSearchTerm);
      return response.data.result || [];
    },
    enabled: !!customerSearchTerm,
  });

  const {
    data: chargesAndDeductions,
    isLoading: isLoadingchargesAndDeductions,
    isError: ischargesAndDeductionsError,
    error: chargesAndDeductionsError,
    refetch: refetchChargesAndDeductions,
  } = useQuery({
    queryKey: ["chargesAndDeductions"],
    queryFn: async () => {
      const response = await get_charges_and_deductions_by_company_id_api(
        companyId
      );
      return response.data.result;
    },
  });

  const {
    data: transactionTypes,
    isLoading: isLoadingTransactionTypes,
    isError: isTransactionTypesError,
    error: transactionTypesError,
  } = useQuery({
    queryKey: ["transactionTypes"],
    queryFn: async () => {
      const response = await get_transaction_types_api(companyId);
      return response.data.result;
    },
  });

  const {
    data: chargesAndDeductionsApplied,
    isLoading: isChargesAndDeductionsAppliedLoading,
    isError: isChargesAndDeductionsAppliedError,
    error: chargesAndDeductionsAppliedError,
  } = useQuery({
    queryKey: ["chargesAndDeductionsApplied", salesOrder?.salesOrderId],
    queryFn: async () => {
      const response = await get_charges_and_deductions_applied_api(
        1,
        salesOrder?.salesOrderId ?? 0,
        companyId
      );
      return response.data.result;
    },
  });

  const {
    data: company,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
    error: companyError,
  } = useQuery({
    queryKey: ["company"],
    queryFn: async () => {
      const response = await get_company_api(companyId);
      return response.data.result;
    },
  });

  const {
    data: itemPriceListByLocation,
    isLoading: isItemPriceListByLocationLoading,
    isError: isItemPriceListByLocationError,
    error: itemPriceListByLocationError,
  } = useQuery({
    queryKey: ["itemPriceListByLocation", formData.storeLocation],
    queryFn: async () => {
      const response = await get_item_price_list_by_locationId(
        formData.storeLocation
      );
      return response.data.result;
    },
    enabled: !!formData.storeLocation,
  });

  // ==================== MEMOIZED VALUES ====================
  const priceListMap = useMemo(() => {
    if (!itemPriceListByLocation?.itemPriceDetails) {
      return new Map();
    }
    return new Map(
      itemPriceListByLocation.itemPriceDetails.map((detail) => [
        detail.itemMasterId,
        detail.price,
      ])
    );
  }, [itemPriceListByLocation]);

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

  const lineItemChargesLookup = useMemo(() => {
    return (
      chargesAndDeductions?.filter(
        (charge) => charge.isApplicableForLineItem === true
      ) || []
    );
  }, [chargesAndDeductions]);

  // ==================== CALLBACKS ====================
  const getPriceFromPriceList = useCallback(
    (itemMasterId) => {
      return priceListMap.get(itemMasterId) || 0;
    },
    [priceListMap]
  );

  const calculateSubTotal = useCallback(() => {
    return formData.itemDetails.reduce(
      (total, item) => total + (item.totalPrice || 0),
      0
    );
  }, [formData.itemDetails]);

  const calculateTotalAmount = useCallback(() => {
    const subtotal = calculateSubTotal();
    let totalAmount = subtotal;

    formData.commonChargesAndDeductions.forEach((charge) => {
      const value = parseFloat(charge.value) || 0;
      const amount = charge.isPercentage ? (subtotal * value) / 100 : value;
      totalAmount += charge.sign === "+" ? amount : -amount;
    });

    return totalAmount;
  }, [formData.commonChargesAndDeductions, calculateSubTotal]);

  const calculateTotalLites = useCallback(() => {
    if (!Array.isArray(formData?.itemDetails)) return 0;

    const totalLitres = formData.itemDetails.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const packSize = Number(item.packSize) || 0;
      return sum + quantity * packSize;
    }, 0);

    return totalLitres / 1000;
  }, [formData.itemDetails]);

  const getTransactionTypeIdByName = useCallback(
    (name) => {
      const transactionType = transactionTypes?.find(
        (type) => type.name === name
      );
      return transactionType?.transactionTypeId || null;
    },
    [transactionTypes]
  );

  // ==================== VALIDATION ====================
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
      isAttachmentsValid = true;
      errorMessage = "";
    }

    for (const file of files) {
      if (file.size > maxSizeInBytes) {
        isAttachmentsValid = false;
        errorMessage = "Attachment size exceeds the limit (10MB)";
      }

      if (!allowedTypes.includes(file.type)) {
        isAttachmentsValid = false;
        errorMessage =
          "Invalid file type. Allowed types: JPEG, PNG, PDF, Word documents";
      }
    }

    setValidFields((prev) => ({ ...prev, attachments: isAttachmentsValid }));
    setValidationErrors((prev) => ({ ...prev, attachments: errorMessage }));

    return isAttachmentsValid;
  }, []);

  const validateForm = useCallback(() => {
    const isInvoiceDateValid = validateField(
      "invoiceDate",
      "Invoice date",
      formData.invoiceDate
    );

    const isDueDateValid = validateField(
      "dueDate",
      "Due date",
      formData.dueDate
    );

    const isReferenceNumberValid = validateField(
      "referenceNumber",
      "Reference Number",
      formData.referenceNumber
    );

    const isCustomerValid = validateField(
      "customer",
      "Customer",
      formData.selectedCustomer
    );

    const isCustomerDeliveryAddressValid = validateField(
      "customerDeliveryAddress",
      "Customer Delivery Address",
      formData.customerDeliveryAddressId
    );

    const isAttachmentsValid = validateAttachments(formData.attachments);

    let isItemQuantityValid = true;
    formData.itemDetails.forEach((item, index) => {
      if (item.isInventoryItem === false) return;
      const fieldName = `quantity_${index}`;
      const fieldDisplayName = `Quantity for ${item.name}`;

      const additionalRules = {
        validationFunction: (value) =>
          parseFloat(value) > 0 && parseFloat(value) <= item.stockInHand,
        errorMessage: `${fieldDisplayName} must be greater than 0 and less than or equal to temporary quantity ${item.stockInHand}`,
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
      isInvoiceDateValid &&
      isDueDateValid &&
      isReferenceNumberValid &&
      isCustomerValid &&
      isCustomerDeliveryAddressValid &&
      isAttachmentsValid &&
      isItemQuantityValid
    );
  }, [formData, validateField, validateAttachments]);

  // ==================== HANDLERS ====================
  const handleInputChange = useCallback((field, value) => {
    setFormData((prevFormData) => {
      if (field.startsWith("commonChargesAndDeductions")) {
        const chargeIndex = parseInt(field.split("_")[1]);
        const updatedChargesAndDeductions = [
          ...prevFormData.commonChargesAndDeductions,
        ];
        updatedChargesAndDeductions[chargeIndex].value = value;

        return {
          ...prevFormData,
          commonChargesAndDeductions: updatedChargesAndDeductions,
        };
      }

      return {
        ...prevFormData,
        [field]: value,
      };
    });
  }, []);

  const handleItemDetailsChange = useCallback((index, field, value) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = prevFormData.itemDetails.map((item, idx) => {
        if (idx !== index) {
          return {
            ...item,
            chargesAndDeductions: item.chargesAndDeductions.map((charge) => ({
              ...charge,
            })),
          };
        }

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

        // Ensure positive values
        updatedItem.quantity = Math.max(0, updatedItem.quantity || 0);
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

        updatedItem.totalPrice = isNaN(totalPrice) ? 0 : totalPrice;
        return updatedItem;
      });

      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });
  }, []);

  const handleSelectItem = useCallback(
    async (item) => {
      let availableStock = 0;
      let unitPrice = item.unitPrice || 0;

      try {
        if (item.isInventoryItem === true) {
          const inventory =
            await get_sum_location_inventories_by_locationId_itemMasterId_api(
              item.itemMasterId,
              formData.storeLocation
            );
          availableStock = inventory?.data?.result?.totalStockInHand || 0;

          if (availableStock <= 0) {
            toast.error(
              `No stock available for "${item.itemName}" in selected Location`
            );
            setSearchTerm("");
            return;
          }

          unitPrice = getPriceFromPriceList(item.itemMasterId);
        }

        setFormData((prevFormData) => ({
          ...prevFormData,
          itemDetails: [
            ...prevFormData.itemDetails,
            {
              id: item?.itemMasterId,
              name: item?.itemName,
              unit: item?.unit?.unitName,
              batchId: null,
              stockInHand: availableStock,
              quantity: 0,
              unitPrice: unitPrice,
              totalPrice: item.isInventoryItem === false ? unitPrice : 0.0,
              isInventoryItem: item?.isInventoryItem,
              packSize: item?.conversionRate || 1,
              chargesAndDeductions: getInitializedCharges,
            },
          ],
        }));
      } catch (error) {
        console.error("Error processing item:", error);
      }

      setSearchTerm("");
      setSelectedBatch(null);
    },
    [getPriceFromPriceList, getInitializedCharges, formData.storeLocation]
  );

  const handleCustomerSelect = useCallback((customer) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedCustomer: customer,
    }));
    setCustomerSearchTerm("");
  }, []);

  const handleResetCustomer = useCallback(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedCustomer: null,
      customerDeliveryAddressId: null,
    }));
    setCustomerSearchTerm("");
    setValidFields({});
    setValidationErrors({});
  }, []);

  const handleAddItem = useCallback(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemDetails: [
        ...prevFormData.itemDetails,
        {
          itemMasterId: "",
          itemBatchId: "",
          quantity: 0,
          unitPrice: 0.0,
          totalPrice: 0.0,
        },
      ],
    }));
  }, []);

  const handleRemoveItem = useCallback((index) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails.splice(index, 1);
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });
    setValidFields({});
    setValidationErrors({});
  }, []);

  const handleAttachmentChange = useCallback((files) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      attachments: files,
    }));
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // ==================== SUBMISSION ====================
  const postChargesAndDeductionsApplied = useCallback(
    async (transactionId) => {
      try {
        const transactionTypeId = getTransactionTypeIdByName("SalesInvoice");
        const currentDate = new Date().toISOString();

        const chargesAndDeductionsAppliedData = await Promise.all(
          formData.itemDetails.map(async (item) => {
            const appliedCharges = await Promise.all(
              item.chargesAndDeductions.map(async (charge) => {
                let appliedValue = 0;
                const baseAmount =
                  item.isInventoryItem === true
                    ? item.quantity * item.unitPrice
                    : item.unitPrice;

                if (charge.name === "SSL") {
                  const amount =
                    (baseAmount / (100 - charge.value)) * charge.value;
                  appliedValue = charge.sign === "+" ? amount : -amount;
                } else if (charge.isPercentage) {
                  const amount = (baseAmount * charge.value) / 100;
                  appliedValue = charge.sign === "+" ? amount : -amount;
                } else {
                  appliedValue =
                    charge.sign === "+" ? charge.value : -charge.value;
                }

                const chargesAndDeductionAppliedData = {
                  chargesAndDeductionId: charge.id,
                  transactionId: transactionId,
                  transactionTypeId,
                  lineItemId: item.id,
                  appliedValue,
                  dateApplied: currentDate,
                  createdBy: userId,
                  createdDate: currentDate,
                  modifiedBy: userId,
                  modifiedDate: currentDate,
                  status: true,
                  companyId: companyId,
                  permissionId: 1056,
                };

                return await post_charges_and_deductions_applied_api(
                  chargesAndDeductionAppliedData
                );
              })
            );
            return appliedCharges;
          })
        );

        const commonChargesAndDeductions = await Promise.all(
          formData.commonChargesAndDeductions.map(async (charge) => {
            let appliedValue = charge.isPercentage
              ? (formData.subTotal * charge.value) / 100
              : charge.value;

            appliedValue *= charge.sign === "+" ? 1 : -1;

            const chargesAndDeductionAppliedData = {
              chargesAndDeductionId: charge.id,
              transactionId: transactionId,
              transactionTypeId,
              lineItemId: null,
              appliedValue,
              dateApplied: currentDate,
              createdBy: userId,
              createdDate: currentDate,
              modifiedBy: userId,
              modifiedDate: currentDate,
              status: true,
              companyId: companyId,
              permissionId: 1056,
            };

            return await post_charges_and_deductions_applied_api(
              chargesAndDeductionAppliedData
            );
          })
        );

        return [
          ...chargesAndDeductionsAppliedData.flat(),
          ...commonChargesAndDeductions.flat(),
        ];
      } catch (error) {
        console.error("Error while posting data:", error);
        throw error;
      }
    },
    [formData, getTransactionTypeIdByName, userId, companyId]
  );

  const handleSubmit = useCallback(
    async (isSaveAsDraft) => {
      try {
        const status = isSaveAsDraft ? 0 : 1;
        const isFormValid = validateForm();
        const currentDate = new Date().toISOString();

        if (!isFormValid) return;

        isSaveAsDraft ? setLoadingDraft(true) : setLoading(true);

        const salesInvoiceData = {
          invoiceDate: formData.invoiceDate,
          dueDate: formData.dueDate,
          totalAmount: formData.totalAmount,
          status: status,
          createdBy: username,
          createdUserId: userId,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          companyId: companyId,
          salesOrderId: salesOrder?.salesOrderId ?? null,
          amountDue: formData.totalAmount,
          createdDate: currentDate,
          lastUpdatedDate: currentDate,
          referenceNumber: formData.referenceNumber,
          permissionId: 29,
          locationId: formData.storeLocation,
          customerId: formData.selectedCustomer.customerId,
          customerDeliveryAddressId: parseInt(
            formData.customerDeliveryAddressId
          ),
          driverName: formData.driverName,
          vehicleNumber: formData.vehicleNo,
          totalLitres: formData.totalLitres,
        };

        const response = await post_sales_invoice_api(salesInvoiceData);
        setReferenceNo(response.data.result.referenceNo);

        const salesInvoiceId = response.data.result.salesInvoiceId;

        const itemDetailsData = formData.itemDetails.map(async (item) => {
          const detailsData = {
            salesInvoiceId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            itemBatchItemMasterId: item.id,
            itemBatchBatchId: item.batchId,
            permissionId: 25,
          };

          return await post_sales_invoice_detail_api(detailsData);
        });

        const detailsResponses = await Promise.all(itemDetailsData);
        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201
        );

        const postChargesAndDeductionsAppliedResponse =
          await postChargesAndDeductionsApplied(salesInvoiceId);

        const allAppliedSuccessful =
          postChargesAndDeductionsAppliedResponse.every(
            (detailsResponse) => detailsResponse.status === 201
          );

        if (allDetailsSuccessful && allAppliedSuccessful) {
          setSubmissionStatus(
            isSaveAsDraft ? "successSavedAsDraft" : "successSubmitted"
          );

          toast.success(
            isSaveAsDraft
              ? "Sales invoice saved as draft!"
              : "Sales invoice submitted successfully!"
          );

          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            setLoadingDraft(false);
            onFormSubmit();
          }, 3000);
        } else {
          setSubmissionStatus("error");
          toast.error("Failed to submit sales invoice.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmissionStatus("error");
        setTimeout(() => {
          setSubmissionStatus(null);
          setLoading(false);
          setLoadingDraft(false);
        }, 3000);

        toast.error("Failed to submit sales invoice.");
      }
    },
    [
      formData,
      validateForm,
      salesOrder,
      username,
      userId,
      companyId,
      postChargesAndDeductionsApplied,
      onFormSubmit,
    ]
  );

  // ==================== RENDER HELPERS ====================
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
    return formData.commonChargesAndDeductions.map((charge, chargeIndex) => {
      if (charge.name === "SSL") return null;

      const colSpan =
        6 +
        (formData.itemDetails[0]?.chargesAndDeductions?.length || 0) -
        (company?.batchStockType === "FIFO" ? 1 : 0);

      return (
        <tr key={chargeIndex}>
          <td colSpan={colSpan}></td>
          <th>
            {charge.sign + " "}
            {charge.name}
            {charge.isPercentage === true && " (%)"}
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

  // ==================== EFFECTS ====================
  useEffect(() => {
    if (submissionStatus != null) {
      alertRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  // Update totals when itemDetails or commonChargesAndDeductions change
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      subTotal: calculateSubTotal(),
      totalAmount: calculateTotalAmount(),
      totalLitres: calculateTotalLites(),
    }));
  }, [
    formData.itemDetails,
    formData.commonChargesAndDeductions,
    calculateSubTotal,
    calculateTotalAmount,
    calculateTotalLites,
  ]);

  // Set default dates
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      invoiceDate: today,
      dueDate: today,
    }));
  }, []);

  // Set default warehouse location
  useEffect(() => {
    if (userLocations && userLocations.length > 0) {
      const filteredLocations = userLocations.filter(
        (location) => location.location.locationType.name === "Warehouse"
      );
      if (filteredLocations.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          storeLocation: filteredLocations[0].location.locationId,
        }));
      }
    }
  }, [userLocations]);

  // Initialize common charges and deductions
  useEffect(() => {
    if (!chargesAndDeductions) return;

    const initializedChargesArray = chargesAndDeductions
      .filter((charge) => charge.isDisableFromSubTotal === false)
      .map((charge) => ({
        id: charge.chargesAndDeductionId,
        name: charge.displayName,
        value: charge.amount || charge.percentage,
        sign: charge.sign,
        isPercentage: charge.percentage !== null,
      }));

    setFormData((prevFormData) => ({
      ...prevFormData,
      commonChargesAndDeductions: initializedChargesArray,
    }));
  }, [chargesAndDeductions]);

  // OPTIMIZED: Initialize sales order data
  useEffect(() => {
    if (
      !salesOrder ||
      isChargesAndDeductionsAppliedLoading ||
      !chargesAndDeductionsApplied ||
      isLoadingchargesAndDeductions ||
      !chargesAndDeductions
    ) {
      return;
    }

    // Process line items
    const initializedLineItemCharges = salesOrder.salesOrderDetails.map(
      (item) => {
        const itemId = item.itemMaster.itemMasterId;
        const itemTotal = item.unitPrice * item.quantity;

        // Get charges for this specific line item
        const appliedCharges = chargesAndDeductionsApplied.filter(
          (charge) => charge.lineItemId === itemId
        );

        // Build charges lookup map for O(1) access
        const appliedChargesMap = new Map(
          appliedCharges.map((charge) => {
            let value;
            const appliedVal = charge.appliedValue;
            const chargeDef = charge.chargesAndDeduction;

            if (chargeDef.displayName === "SSL") {
              value = (appliedVal / (itemTotal + appliedVal)) * 100;
            } else if (chargeDef.percentage !== null) {
              value = (Math.abs(appliedVal) / itemTotal) * 100;
            } else {
              value = Math.abs(appliedVal);
            }

            return [
              chargeDef.displayName,
              {
                id: chargeDef.chargesAndDeductionId,
                name: chargeDef.displayName,
                value: value.toFixed(2),
                sign: chargeDef.sign,
                isPercentage: chargeDef.percentage !== null,
                chargesAndDeductionAppliedId:
                  charge.chargesAndDeductionAppliedId,
              },
            ];
          })
        );

        // Map applicable charges, using applied values where they exist
        const sortedLineItemCharges = lineItemChargesLookup.map(
          (charge) => appliedChargesMap.get(charge.displayName) || null
        );

        // Fetch inventory
        const inventory =
          get_sum_location_inventories_by_locationId_itemMasterId_api(
            itemId,
            salesOrder.inventoryLocationId
          );
        const availableStock = inventory?.data?.result?.totalStockInHand || 0;

        return {
          id: itemId,
          name: item.itemMaster.itemName,
          unit: item.itemMaster.unit.unitName,
          batchId: null,
          stockInHand: availableStock,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          isInventoryItem: item?.itemMaster?.isInventoryItem,
          packSize: item?.itemMaster?.conversionRate || 1,
          chargesAndDeductions: sortedLineItemCharges,
        };
      }
    );

    // Calculate subtotal once
    const subTotal = salesOrder.salesOrderDetails.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    // Process common charges (those without line item association)
    const initializedCommonCharges = chargesAndDeductionsApplied
      .filter((charge) => !charge.lineItemId)
      .map((charge) => {
        const chargeDef = charge.chargesAndDeduction;
        const value =
          chargeDef.percentage !== null
            ? (Math.abs(charge.appliedValue) / subTotal) * 100
            : Math.abs(charge.appliedValue);

        return {
          id: chargeDef.chargesAndDeductionId,
          name: chargeDef.displayName,
          value: value.toFixed(2),
          sign: chargeDef.sign,
          isPercentage: chargeDef.percentage !== null,
          chargesAndDeductionAppliedId: charge.chargesAndDeductionAppliedId,
        };
      });

    // Single state update at the end
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedCustomer: salesOrder.customer,
      itemDetails: initializedLineItemCharges,
      salesOrderId: salesOrder.salesOrderId,
      commonChargesAndDeductions: initializedCommonCharges,
    }));
  }, [
    salesOrder,
    isChargesAndDeductionsAppliedLoading,
    chargesAndDeductionsApplied,
    isLoadingchargesAndDeductions,
    chargesAndDeductions,
    lineItemChargesLookup,
  ]);

  console.log("Form data: ", formData);

  return {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    referenceNo,
    alertRef,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    selectedBatch,
    isLoadingchargesAndDeductions,
    ischargesAndDeductionsError,
    chargesAndDeductionsError,
    chargesAndDeductions,
    isLoadingTransactionTypes,
    isTransactionTypesError,
    transactionTypesError,
    loading,
    loadingDraft,
    isCompanyLoading,
    isCompanyError,
    company,
    userLocations,
    locationInventories,
    customers,
    customerSearchTerm,
    isCustomersLoading,
    isCustomersError,
    handleCustomerSelect,
    handleResetCustomer,
    refetchCustomers,
    handleInputChange,
    handleItemDetailsChange,
    handleAttachmentChange,
    handleSubmit,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    calculateTotalAmount,
    setCustomerSearchTerm,
    setSearchTerm,
    handleSelectItem,
    calculateSubTotal,
    calculateTotalLites,
    renderColumns,
    renderSubColumns,
  };
};

export default useSalesInvoice;
