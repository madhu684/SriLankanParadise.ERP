import { useState, useEffect, useRef } from "react";
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
  get_item_batches_by_item_master_id_api,
} from "../../services/purchaseApi";
import {
  get_item_masters_by_company_id_with_query_api,
  get_item_price_list_by_locationId,
} from "../../services/inventoryApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const [initialized, setInitialized] = useState(false);

  const queryClient = useQueryClient();

  const fetchUserLocations = async () => {
    try {
      const response = await get_user_locations_by_user_id_api(
        sessionStorage.getItem("userId")
      );
      return response.data.result.filter(
        (location) => location.location.locationTypeId === 2
      );
    } catch (error) {
      console.error("Error fetching user locations:", error);
    }
  };
  const {
    data: userLocations,
    isLoading: isUserLocationsLoading,
    isError: isUserLocationsError,
    error: userLocationsError,
  } = useQuery({
    queryKey: ["userLocations", sessionStorage.getItem("userId")],
    queryFn: fetchUserLocations,
  });

  const fetchItems = async (companyId, searchQuery) => {
    try {
      const response = await get_item_masters_by_company_id_with_query_api(
        companyId,
        searchQuery,
        true
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const {
    data: availableItems = [],
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", searchTerm],
    queryFn: () => fetchItems(sessionStorage.getItem("companyId"), searchTerm),
    enabled: !!formData.storeLocation && !!searchTerm,
  });

  const fetchLocationInventories = async (locationId) => {
    try {
      if (!locationId) return [];
      const response = await get_locations_inventories_by_location_id_api(
        locationId
      );
      console.log("Location inventories:", response.data.result);
      return response.data.result || [];
    } catch (error) {
      console.error(
        "Error fetching location inventories for location",
        locationId,
        ":",
        error
      );
      return [];
    }
  };

  const {
    data: locationInventories,
    isLoading: isLocationInventoriesLoading,
    isError: isLocationInventoriesError,
    refetch: refetchLocationInventories,
  } = useQuery({
    queryKey: ["locationInventories", formData.storeLocation],
    queryFn: () => fetchLocationInventories(formData.storeLocation),
    enabled: !!formData.storeLocation,
  });

  const fetchCustomers = async (searchQuery) => {
    try {
      const response = await search_customer_api(searchQuery);
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const {
    data: customers = [],
    isLoading: isCustomersLoading,
    isError: isCustomersError,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["customers", customerSearchTerm],
    queryFn: () => fetchCustomers(customerSearchTerm),
    enabled: !!customerSearchTerm,
  });

  useEffect(() => {
    if (submissionStatus != null) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  const fetchchargesAndDeductions = async () => {
    try {
      const response = await get_charges_and_deductions_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching chargesAndDeductions:", error);
    }
  };

  const {
    data: chargesAndDeductions,
    isLoading: isLoadingchargesAndDeductions,
    isError: ischargesAndDeductionsError,
    error: chargesAndDeductionsError,
    refetch: refetchChargesAndDeductions,
  } = useQuery({
    queryKey: ["chargesAndDeductions"],
    queryFn: fetchchargesAndDeductions,
  });

  const fetchTransactionTypes = async () => {
    try {
      const response = await get_transaction_types_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching transaction types:", error);
    }
  };

  const {
    data: transactionTypes,
    isLoading: isLoadingTransactionTypes,
    isError: isTransactionTypesError,
    error: transactionTypesError,
  } = useQuery({
    queryKey: ["transactionTypes"],
    queryFn: fetchTransactionTypes,
  });

  const fetchChargesAndDeductionsApplied = async () => {
    try {
      const response = await get_charges_and_deductions_applied_api(
        1,
        salesOrder?.salesOrderId ?? 0,
        sessionStorage.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching charges and deductions applied:", error);
    }
  };

  const {
    data: chargesAndDeductionsApplied,
    isLoading: isChargesAndDeductionsAppliedLoading,
    isError: isChargesAndDeductionsAppliedError,
    error: chargesAndDeductionsAppliedError,
  } = useQuery({
    queryKey: ["chargesAndDeductionsApplied", salesOrder?.salesOrderId],
    queryFn: fetchChargesAndDeductionsApplied,
  });

  const fetchCompany = async () => {
    try {
      const response = await get_company_api(
        sessionStorage?.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const {
    data: company,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
    error: companyError,
  } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
  });

  const fetchItemPriceListByLocation = async () => {
    try {
      const response = await get_item_price_list_by_locationId(
        formData.storeLocation
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching item price list by location:", error);
    }
  };

  const {
    data: itemPriceListByLocation,
    isLoading: isItemPriceListByLocationLoading,
    isError: isItemPriceListByLocationError,
    error: itemPriceListByLocationError,
  } = useQuery({
    queryKey: ["itemPriceListByLocation", formData.storeLocation],
    queryFn: fetchItemPriceListByLocation,
    enabled: !!formData.storeLocation,
  });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      subTotal: calculateSubTotal(),
      totalAmount: calculateTotalAmount(),
    }));
  }, [formData.itemDetails, formData.commonChargesAndDeductions]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format
    setFormData((prevFormData) => ({
      ...prevFormData,
      invoiceDate: today,
      dueDate: today,
    }));
  }, []);

  // Set the first available warehouse location as the default value
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

  useEffect(() => {
    if (
      salesOrder !== null &&
      !isChargesAndDeductionsAppliedLoading &&
      chargesAndDeductionsApplied &&
      !isLoadingchargesAndDeductions &&
      chargesAndDeductions
    ) {
      console.log("Trigger effect");
      const deepCopySalesOrder = JSON.parse(JSON.stringify(salesOrder));

      // Initialize line item charges and deductions
      const initializedLineItemCharges =
        deepCopySalesOrder.salesOrderDetails.map((item) => {
          const initializedCharges = chargesAndDeductionsApplied
            ?.filter(
              (charge) => charge.lineItemId === item.itemBatch.itemMasterId
            )
            .map((charge) => {
              let value;
              if (charge.chargesAndDeduction.percentage) {
                // Calculate percentage value
                value =
                  (Math.abs(charge.appliedValue) /
                    (item.unitPrice * item.quantity)) *
                  100;
              } else {
                value = Math.abs(charge.appliedValue);
              }
              return {
                id: charge.chargesAndDeduction.chargesAndDeductionId,
                name: charge.chargesAndDeduction.displayName,
                value: value.toFixed(2),
                sign: charge.chargesAndDeduction.sign,
                isPercentage: charge.chargesAndDeduction.percentage !== null,
                chargesAndDeductionAppliedId:
                  charge.chargesAndDeductionAppliedId,
              };
            });

          // Sort the charges and deductions according to the order of display names
          const sortedLineItemCharges = chargesAndDeductions
            .filter(
              (charge) =>
                charge.isDisableFromSubTotal === false && charge.status === true
            )
            .map((charge) => {
              const displayName = charge.displayName; // Extract display name from charge
              const matchedCharge = initializedCharges.find(
                (c) => c.name === displayName
              );
              return matchedCharge || null; // Return null if no matching charge is found
            });

          return {
            ...item,
            itemMasterId: item.itemBatch.itemMasterId,
            itemBatchId: item.itemBatch.batchId,
            name: item.itemBatch.itemMaster.itemName,
            unit: item.itemBatch.itemMaster.unit.unitName,
            batchRef: item.itemBatch.batch.batchRef,
            tempQuantity: item.itemBatch.tempQuantity + item.quantity,
            chargesAndDeductions: sortedLineItemCharges,
            batch: item.itemBatch,
            isInventoryItem: item.isInventoryItem,
          };
        });

      const subTotal = deepCopySalesOrder.salesOrderDetails.reduce(
        (total, item) => total + item.totalPrice,
        0
      );

      // Initialize common charges and deductions
      console.log(
        "chargesAndDeductionsApplied 347: ",
        chargesAndDeductionsApplied
      );
      const initializedCommonCharges = chargesAndDeductionsApplied
        ?.filter((charge) => !charge.lineItemId)
        .map((charge) => {
          let value;
          if (charge.chargesAndDeduction.percentage) {
            // Calculate percentage value based on subtotal
            value = (Math.abs(charge.appliedValue) / subTotal) * 100;
          } else {
            value = Math.abs(charge.appliedValue);
          }
          return {
            id: charge.chargesAndDeduction.chargesAndDeductionId,
            name: charge.chargesAndDeduction.displayName,
            value: value.toFixed(2),
            sign: charge.chargesAndDeduction.sign,
            isPercentage: charge.chargesAndDeduction.percentage !== null,
            chargesAndDeductionAppliedId: charge.chargesAndDeductionAppliedId,
          };
        });
      console.log("initializedCommonCharges 370: ", initializedCommonCharges);

      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: initializedLineItemCharges,
        salesOrderId: salesOrder.salesOrderId,
        commonChargesAndDeductions: initializedCommonCharges,
      }));
    }
  }, [
    salesOrder,
    isChargesAndDeductionsAppliedLoading,
    chargesAndDeductionsApplied,
    isLoadingchargesAndDeductions,
    chargesAndDeductions,
  ]);

  const validateField = (
    fieldName,
    fieldDisplayName,
    value,
    additionalRules = {}
  ) => {
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
  };

  const validateAttachments = (files) => {
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
      isAttachmentsValid = true; // Attachments are optional, so it's considered valid if there are none.
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
  };

  const validateForm = () => {
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

    const isAttachmentsValid = validateAttachments(formData.attachments);

    let isItemQuantityValid = true;
    // Validate item details
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

      isItemQuantityValid =
        isItemQuantityValid && isValidQuantity && isReferenceNumberValid;
    });

    return (
      isInvoiceDateValid &&
      isDueDateValid &&
      isAttachmentsValid &&
      isItemQuantityValid
    );
  };

  const getTransactionTypeIdByName = (name) => {
    const transactionType = transactionTypes.find((type) => type.name === name);
    return transactionType ? transactionType.transactionTypeId : null;
  };

  const postChargesAndDeductionsApplied = async (transactionId) => {
    try {
      const transactionTypeId = getTransactionTypeIdByName("SalesInvoice");

      const chargesAndDeductionsAppliedData = await Promise.all(
        formData.itemDetails.map(async (item) => {
          const appliedCharges = await Promise.all(
            item.chargesAndDeductions.map(async (charge) => {
              let appliedValue = 0;

              if (charge.name === "SSL") {
                // Calculate the amount based on percentage and sign
                const amount =
                  item.isInventoryItem === true
                    ? ((item.quantity * item.unitPrice) /
                        (100 - charge.value)) *
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
                appliedValue =
                  charge.sign === "+" ? charge.value : -charge.value;
              }

              const chargesAndDeductionAppliedData = {
                chargesAndDeductionId: charge.id,
                transactionId: transactionId,
                transactionTypeId,
                lineItemId: item.id,
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
          return appliedCharges;
        })
      );

      const commonChargesAndDeductions = await Promise.all(
        formData.commonChargesAndDeductions.map(async (charge) => {
          let appliedValue = 0;
          if (charge.isPercentage) {
            // If the charge is a percentage, calculate based on percentage of total amount
            appliedValue = (formData.subTotal * charge.value) / 100;
          } else {
            // If the charge is not a percentage, use the fixed value
            appliedValue = charge.value;
          }

          // Apply the sign (+ or -)
          appliedValue *= charge.sign === "+" ? 1 : -1;

          const chargesAndDeductionAppliedData = {
            chargesAndDeductionId: charge.id,
            transactionId: transactionId,
            transactionTypeId,
            lineItemId: null,
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

      // Concatenate chargesAndDeductionsAppliedData and commonChargesAndDeductions
      const allAppliedData = [
        ...(Array.isArray(chargesAndDeductionsAppliedData)
          ? chargesAndDeductionsAppliedData.flat()
          : [chargesAndDeductionsAppliedData]),
        ...(Array.isArray(commonChargesAndDeductions)
          ? commonChargesAndDeductions.flat()
          : [commonChargesAndDeductions]),
      ];

      return allAppliedData;
    } catch (error) {
      console.error("Error while posting data:", error);
      throw error;
    }
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;
      const isFormValid = validateForm();
      const currentDate = new Date().toISOString();
      let allDetailsSuccessful;

      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        // Create sales invoice
        const salesInvoiceData = {
          invoiceDate: formData.invoiceDate,
          dueDate: formData.dueDate,
          totalAmount: formData.totalAmount,
          status: status,
          createdBy: sessionStorage?.getItem("username") ?? null,
          createdUserId: sessionStorage?.getItem("userId") ?? null,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          companyId: sessionStorage?.getItem("companyId") ?? null,
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

        // Create sales invoice details
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

          const detailsApiResponse = await post_sales_invoice_detail_api(
            detailsData
          );

          return detailsApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetailsData);

        allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201
        );

        const postChargesAndDeductionsAppliedResponse =
          await postChargesAndDeductionsApplied(salesInvoiceId);

        const allAppliedSuccessful =
          postChargesAndDeductionsAppliedResponse.every(
            (detailsResponse) => detailsResponse.status === 201
          );

        if (allDetailsSuccessful && allAppliedSuccessful) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Sales invoice saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Sales invoice submitted successfully!", formData);
          }

          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            setLoadingDraft(false);
            onFormSubmit();
          }, 3000);
        } else {
          setSubmissionStatus("error");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
      setTimeout(() => {
        setSubmissionStatus(null);
        setLoading(false);
        setLoadingDraft(false);
      }, 3000);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => {
      // Check if the field belongs to commonChargesAndDeductions
      if (field.startsWith("commonChargesAndDeductions")) {
        // Get the charge or deduction index
        const chargeIndex = parseInt(field.split("_")[1]);

        // Update the value of the corresponding charge or deduction
        const updatedChargesAndDeductions = [
          ...prevFormData.commonChargesAndDeductions,
        ];

        updatedChargesAndDeductions[chargeIndex].value = value;

        // Return updated form data with the updated commonChargesAndDeductions array
        return {
          ...prevFormData,
          commonChargesAndDeductions: updatedChargesAndDeductions,
        };
      } else {
        return {
          ...prevFormData,
          [field]: value,
        };
      }
    });
  };

  const handleItemDetailsChange = async (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];

      if (field.startsWith("chargesAndDeductions")) {
        // Handle charges and deductions
        const chargeIndex = parseInt(field.split("_")[1]);
        updatedItemDetails[index].chargesAndDeductions[chargeIndex].value =
          value;
      } else {
        // Handle other fields
        updatedItemDetails[index][field] = value;
      }

      // Ensure positive values for Quantities and Unit Prices
      updatedItemDetails[index].quantity = Math.max(
        0,
        updatedItemDetails[index].quantity
      );
      updatedItemDetails[index].unitPrice = !isNaN(
        parseFloat(updatedItemDetails[index].unitPrice)
      )
        ? Math.max(0, parseFloat(updatedItemDetails[index].unitPrice))
        : 0;

      // Calculate total price based on charges and deductions
      const grandTotalPrice =
        updatedItemDetails[index].quantity *
        updatedItemDetails[index].unitPrice;
      let totalPrice =
        updatedItemDetails[index].quantity *
        updatedItemDetails[index].unitPrice;

      updatedItemDetails[index].chargesAndDeductions.forEach((charge) => {
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

      totalPrice = isNaN(totalPrice) ? 0 : totalPrice;
      updatedItemDetails[index].totalPrice = totalPrice;

      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
        subTotal: calculateSubTotal(),
        totalAmount: calculateTotalAmount(),
        totalLitres: calculateTotalLites(),
      };
    });
  };

  const handleAddItem = () => {
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
  };

  const handleRemoveItem = (index) => {
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemMasterId: 0,
      itemMaster: "",
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAttachmentChange = (files) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      attachments: files,
    }));
  };

  const calculateSubTotal = () => {
    return formData.itemDetails.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
  };

  const calculateTotalAmount = () => {
    // Calculate total price based on item details
    const subtotal = calculateSubTotal();

    // Calculate total amount based on subtotal and common charges and deductions
    let totalAmount = subtotal.toFixed(2);
    formData.commonChargesAndDeductions.forEach((charge) => {
      if (charge.isPercentage) {
        const amount = (subtotal * charge.value) / 100;
        if (charge.sign === "+") {
          totalAmount += amount;
        } else if (charge.sign === "-") {
          totalAmount -= amount;
        }
      } else {
        if (charge.sign === "+") {
          totalAmount += charge.value;
        } else if (charge.sign === "-") {
          totalAmount -= charge.value;
        }
      }
    });

    return totalAmount;
  };

  const calculateTotalLites = () => {
    let totalLitres = 0;
    if (Array.isArray(formData?.itemDetails)) {
      formData.itemDetails.forEach((item) => {
        const quantity = Number(item.quantity) || 0;
        const packSize = Number(item.packSize) || 0;
        totalLitres += quantity * packSize;
      });
    }
    return totalLitres / 1000;
  };

  // Handler to add the selected item to itemDetails
  const handleSelectItem = async (item) => {
    // Initialize charges and deductions (this remains unchanged)
    const initializedCharges =
      chargesAndDeductions
        ?.filter((charge) => charge.isApplicableForLineItem)
        ?.map((charge) => ({
          id: charge.chargesAndDeductionId,
          name: charge.displayName,
          value: charge.amount || charge.percentage,
          sign: charge.sign,
          isPercentage: charge.percentage !== null,
        })) || [];

    let availableStock = 0;
    let highestSellingPrice = 0;

    try {
      if (item.isInventoryItem === true) {
        const inventory =
          await get_sum_location_inventories_by_locationId_itemMasterId_api(
            item.itemMasterId,
            userLocations[0]?.locationId
          );
        availableStock = inventory?.data?.result?.totalStockInHand || 0;

        if (availableStock <= 0) {
          console.warn("No stock available for this item");
          alert("No stock available for this item");
          return;
        }

        // Get highest selling price from available batches
        const batchesResponse = await get_item_batches_by_item_master_id_api(
          item.itemMasterId,
          sessionStorage.getItem("companyId")
        );
        highestSellingPrice =
          batchesResponse?.data?.result?.reduce(
            (maxPrice, batch) =>
              batch.sellingPrice > maxPrice ? batch.sellingPrice : maxPrice,
            0
          ) || 0;
      }

      // Update form data
      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: [
          ...prevFormData.itemDetails,
          {
            name: item?.itemName,
            id: item?.itemMasterId,
            unit: item?.unit?.unitName,
            batchId: null,
            stockInHand: availableStock,
            quantity: 0,
            unitPrice:
              item.isInventoryItem === true
                ? highestSellingPrice
                : item.unitPrice,
            totalPrice: item.isInventoryItem === false ? item.unitPrice : 0.0,
            isInventoryItem: item?.isInventoryItem,
            packSize: item?.conversionRate || 1,
            chargesAndDeductions: initializedCharges,
          },
        ],
      }));
    } catch (error) {
      console.error("Error processing item:", error);
      alert("Error processing item. Please try again.");
    }

    // Reset search and batch selection
    setSearchTerm("");
    setSelectedBatch(null);
    // refetchItemBatches();
    // refetchLocationInventory();
  };

  const handleCustomerSelect = (customer) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedCustomer: customer,
    }));
    setCustomerSearchTerm("");
  };

  const handleResetCustomer = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedCustomer: null,
      customerDeliveryAddressId: null,
    }));
    setCustomerSearchTerm("");
    setValidFields({});
    setValidationErrors({});
    // Explicitly reset selectedTrn to null to disable dependent queries
    //queryClient.resetQueries(["customers", customerSearchTerm]);
  };

  const renderColumns = () => {
    return chargesAndDeductions.map((charge) => {
      if (charge.isApplicableForLineItem) {
        // Render columns for charges/deductions applicable for line items
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
  };

  const handleAddCommonChargesAndDeductions = () => {
    const initializedCharges = chargesAndDeductions.reduce((acc, charge) => {
      if (charge.isDisableFromSubTotal === false) {
        // Initialize additional properties for the common on charges and deductions
        acc[charge.displayName] = charge.amount || charge.percentage;
      }
      return acc;
    }, {});

    // Generate chargesAndDeductions array for the newly added item
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
      ...initializedCharges,
      commonChargesAndDeductions: initializedChargesArray,
    }));
  };

  useEffect(() => {
    chargesAndDeductions && handleAddCommonChargesAndDeductions();
  }, [isLoadingchargesAndDeductions]);

  const renderSubColumns = () => {
    return formData.commonChargesAndDeductions.map((charge, chargeIndex) => {
      if (charge.name !== "SSL") {
        return (
          <tr key={chargeIndex}>
            <td
              colSpan={
                6 +
                formData.itemDetails[0].chargesAndDeductions.length -
                (company.batchStockType === "FIFO" ? 1 : 0)
              }
            ></td>
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
                  let newValue = parseFloat(e.target.value);

                  // If the entered value is not a valid number, set it to 0
                  if (isNaN(newValue)) {
                    newValue = 0;
                  } else {
                    // If the charge is a percentage, ensure the value is between 0 and 100
                    if (charge.isPercentage) {
                      newValue = Math.min(100, Math.max(0, newValue)); // Clamp the value between 0 and 100
                    } else {
                      // For non-percentage charges, ensure the value is positive
                      newValue = Math.max(0, newValue);
                    }
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
      }
      return null;
    });
  };

  console.log("formData", formData);

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
