import { useState, useEffect, useRef } from "react";
import {
  post_sales_invoice_api,
  post_sales_invoice_detail_api,
  get_company_api,
} from "common/services/salesApi";
import {
  get_charges_and_deductions_by_company_id_api,
  post_charges_and_deductions_applied_api,
  get_charges_and_deductions_applied_api,
  get_transaction_types_api,
  get_user_locations_by_user_id_api,
  get_locations_inventories_by_location_id_api,
  get_sum_location_inventories_by_locationId_itemMasterId_api,
  get_item_batches_by_item_master_id_api,
  get_sum_location_inventories_by_locationId_itemCode_api,
} from "common/services/purchaseApi";
import { get_item_masters_by_company_id_with_query_api } from "common/services/inventoryApi";
import { get_appointment_tokens_by_date_api } from "common/services/ayuOMSApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useSalesInvoice = ({ onFormSubmit, salesOrder }) => {
  const [useAppointment, setUseAppointment] = useState(false);
  const [appointmentSearchTerm, setAppointmentSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    storeLocation: null,
    invoiceDate: "",
    dueDate: "",
    referenceNumber: "",
    patientName: "",
    patientNo: "",
    appointmentId: null,
    tokenNo: null,
    itemDetails: [],
    attachments: [],
    totalAmount: 0,
    salesOrderId: "",
    subTotal: 0,
    commonChargesAndDeductions: [],
    deductionAmount: 0,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  const [referenceNo, setReferenceNo] = useState(null);
  const [salesOrderSearchTerm, setSalesOrderSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const isSubmitting = useRef(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const queryClient = useQueryClient();

  const fetchUserLocations = async () => {
    try {
      const response = await get_user_locations_by_user_id_api(
        sessionStorage.getItem("userId"),
      );
      return response.data.result.filter(
        (location) => location.location.locationTypeId === 2,
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
        true,
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
      const response =
        await get_locations_inventories_by_location_id_api(locationId);
      console.log("Location inventories:", response.data.result);
      return response.data.result || [];
    } catch (error) {
      console.error(
        "Error fetching location inventories for location",
        locationId,
        ":",
        error,
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

  useEffect(() => {
    if (submissionStatus != null) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  const fetchchargesAndDeductions = async () => {
    try {
      const response = await get_charges_and_deductions_by_company_id_api(
        sessionStorage.getItem("companyId"),
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
        sessionStorage.getItem("companyId"),
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
        sessionStorage.getItem("companyId"),
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
        sessionStorage?.getItem("companyId"),
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

  const {
    data: appointments = [],
    isLoading: isAppointmentsLoading,
    error: appointmentsError,
    refetch: refetchAppointments,
  } = useQuery({
    queryKey: ["appointments", formData.invoiceDate],
    queryFn: async () => {
      const response = await get_appointment_tokens_by_date_api(
        sessionStorage.getItem("companyId"),
        formData.invoiceDate,
      );
      return response.data.result || [];
    },
    enabled: !!formData.invoiceDate,
  });

  // Effects
  useEffect(() => {
    if (!useAppointment) {
      setSelectedAppointment(null);
      setAppointmentSearchTerm("");
      setFormData((prevFormData) => ({
        ...prevFormData,
        patientName: "",
        patientNo: "",
        appointmentId: null,
        tokenNo: null,
      }));
    }
  }, [useAppointment]);

  useEffect(() => {
    setFormData((prevFormData) => {
      const subTotal = calculateSubTotal(prevFormData.itemDetails);
      const totalAmount = calculateTotalAmount(
        subTotal,
        prevFormData.commonChargesAndDeductions,
        prevFormData.deductionAmount,
      );
      return {
        ...prevFormData,
        subTotal,
        totalAmount,
      };
    });
  }, [
    formData.itemDetails,
    formData.commonChargesAndDeductions,
    formData.deductionAmount,
    chargesAndDeductions, // Add this just in case
  ]);

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
        (location) => location.location.locationType.name === "Warehouse",
      );
      if (filteredLocations.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          storeLocation: filteredLocations[0].location.locationId,
        }));
      }
    }
  }, [userLocations]);

  // useEffect(() => {
  //   if (
  //     salesOrder !== null &&
  //     !isChargesAndDeductionsAppliedLoading &&
  //     chargesAndDeductionsApplied &&
  //     !isLoadingchargesAndDeductions &&
  //     chargesAndDeductions
  //   ) {
  //     const deepCopySalesOrder = JSON.parse(JSON.stringify(salesOrder));

  //     // Initialize line item charges and deductions
  //     const initializedLineItemCharges =
  //       deepCopySalesOrder.salesOrderDetails.map((item) => {
  //         const initializedCharges = chargesAndDeductionsApplied
  //           ?.filter(
  //             (charge) => charge.lineItemId === item.itemBatch.itemMasterId
  //           )
  //           .map((charge) => {
  //             let value;
  //             if (charge.chargesAndDeduction.percentage !== null) {
  //               // Calculate percentage value
  //               value =
  //                 (Math.abs(charge.appliedValue) /
  //                   (item.unitPrice * item.quantity)) *
  //                 100;
  //             } else {
  //               value = Math.abs(charge.appliedValue);
  //             }
  //             return {
  //               id: charge.chargesAndDeduction.chargesAndDeductionId,
  //               name: charge.chargesAndDeduction.displayName,
  //               value: value.toFixed(2),
  //               sign: charge.chargesAndDeduction.sign,
  //               isPercentage: charge.chargesAndDeduction.percentage !== null,
  //               chargesAndDeductionAppliedId:
  //                 charge.chargesAndDeductionAppliedId,
  //             };
  //           });

  //         // Sort the charges and deductions according to the order of display names
  //         const sortedLineItemCharges = chargesAndDeductions
  //           .filter((charge) => charge.isApplicableForLineItem)
  //           .map((charge) => {
  //             const displayName = charge.displayName; // Extract display name from charge
  //             const matchedCharge = initializedCharges.find(
  //               (c) => c.name === displayName
  //             );
  //             return matchedCharge || null; // Return null if no matching charge is found
  //           });

  //         return {
  //           ...item,
  //           itemMasterId: item.itemBatch.itemMasterId,
  //           itemBatchId: item.itemBatch.batchId,
  //           name: item.itemBatch.itemMaster.itemName,
  //           unit: item.itemBatch.itemMaster.unit.unitName,
  //           batchRef: item.itemBatch.batch.batchRef,
  //           tempQuantity: item.itemBatch.tempQuantity + item.quantity,
  //           chargesAndDeductions: sortedLineItemCharges,
  //           batch: item.itemBatch,
  //           isInventoryItem: item.isInventoryItem,
  //         };
  //       });

  //     const subTotal = deepCopySalesOrder.salesOrderDetails.reduce(
  //       (total, item) => total + item.totalPrice,
  //       0
  //     );

  //     // Initialize common charges and deductions
  //     const initializedCommonCharges = chargesAndDeductionsApplied
  //       ?.filter((charge) => !charge.lineItemId)
  //       .map((charge) => {
  //         let value;
  //         if (charge.chargesAndDeduction.percentage !== null) {
  //           // Calculate percentage value based on subtotal
  //           value = (Math.abs(charge.appliedValue) / subTotal) * 100;
  //         } else {
  //           value = Math.abs(charge.appliedValue);
  //         }
  //         return {
  //           id: charge.chargesAndDeduction.chargesAndDeductionId,
  //           name: charge.chargesAndDeduction.displayName,
  //           value: value.toFixed(2),
  //           sign: charge.chargesAndDeduction.sign,
  //           isPercentage: charge.chargesAndDeduction.percentage !== null,
  //           chargesAndDeductionAppliedId: charge.chargesAndDeductionAppliedId,
  //         };
  //       });

  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       patientName: salesOrder?.customer?.customerName || "",
  //       patientNo: salesOrder?.customer?.phone || "",
  //       itemDetails: initializedLineItemCharges,
  //       salesOrderId: salesOrder.salesOrderId,
  //       commonChargesAndDeductions: initializedCommonCharges,
  //     }));
  //   }
  // }, [
  //   salesOrder,
  //   isChargesAndDeductionsAppliedLoading,
  //   chargesAndDeductionsApplied,
  //   isLoadingchargesAndDeductions,
  //   chargesAndDeductions,
  // ]);

  useEffect(() => {
    if (
      salesOrder !== null &&
      !isChargesAndDeductionsAppliedLoading &&
      chargesAndDeductionsApplied &&
      !isLoadingchargesAndDeductions &&
      chargesAndDeductions
    ) {
      const deepCopySalesOrder = JSON.parse(JSON.stringify(salesOrder));

      // Initialize line item charges and deductions
      const initializedLineItemCharges =
        deepCopySalesOrder.salesOrderDetails.map((item) => {
          const initializedCharges = chargesAndDeductionsApplied
            ?.filter(
              (charge) => charge.lineItemId === item.itemBatch.itemMasterId,
            )
            .map((charge) => {
              let value;
              if (charge.chargesAndDeduction.percentage !== null) {
                // Calculate percentage value - Fixed calculation
                const baseAmount = item.unitPrice * item.quantity;
                value = (Math.abs(charge.appliedValue) / baseAmount) * 100;
              } else {
                value = Math.abs(charge.appliedValue);
              }
              return {
                id: charge.chargesAndDeduction.chargesAndDeductionId,
                name: charge.chargesAndDeduction.displayName,
                value: parseFloat(value.toFixed(2)),
                sign: charge.chargesAndDeduction.sign,
                isPercentage: charge.chargesAndDeduction.percentage !== null,
                chargesAndDeductionAppliedId:
                  charge.chargesAndDeductionAppliedId,
              };
            });

          // Sort the charges and deductions according to the order of display names
          const sortedLineItemCharges = chargesAndDeductions
            .filter((charge) => charge.isApplicableForLineItem)
            .map((charge) => {
              const displayName = charge.displayName;
              const matchedCharge = initializedCharges.find(
                (c) => c.name === displayName,
              );
              return matchedCharge || null;
            });

          // Calculate the correct totalPrice for this item
          const basePrice =
            (parseFloat(item.quantity) || 0) *
            (parseFloat(item.unitPrice) || 0);
          let totalPrice = basePrice;
          initializedCharges.forEach((charge) => {
            const chargeValue = parseFloat(charge.value) || 0;
            if (charge.isPercentage) {
              const amount = (basePrice * chargeValue) / 100;
              totalPrice += charge.sign === "+" ? amount : -amount;
            } else {
              totalPrice += charge.sign === "+" ? chargeValue : -chargeValue;
            }
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
            totalPrice: isNaN(totalPrice) ? 0 : totalPrice,
          };
        });

      const subTotal = calculateSubTotal(initializedLineItemCharges);

      // Initialize common charges and deductions
      const initializedCommonCharges = chargesAndDeductionsApplied
        ?.filter((charge) => !charge.lineItemId)
        .map((charge) => {
          let value;
          if (charge.chargesAndDeduction.percentage !== null) {
            // Calculate percentage value based on subtotal - Fixed calculation
            value = subTotal
              ? (Math.abs(charge.appliedValue) / subTotal) * 100
              : 0;
          } else {
            value = Math.abs(charge.appliedValue);
          }
          return {
            id: charge.chargesAndDeduction.chargesAndDeductionId,
            name: charge.chargesAndDeduction.displayName,
            value: parseFloat(value.toFixed(2)),
            sign: charge.chargesAndDeduction.sign,
            isPercentage: charge.chargesAndDeduction.percentage !== null,
            chargesAndDeductionAppliedId: charge.chargesAndDeductionAppliedId,
            isDisableFromSubTotal:
              charge.chargesAndDeduction.isDisableFromSubTotal,
          };
        });

      const totalAmount = calculateTotalAmount(
        subTotal,
        initializedCommonCharges,
        formData.deductionAmount,
      );

      setFormData((prevFormData) => ({
        ...prevFormData,
        patientName: salesOrder?.customer?.customerName || "",
        patientNo: salesOrder?.customer?.phone || "",
        itemDetails: initializedLineItemCharges,
        salesOrderId: salesOrder.salesOrderId,
        commonChargesAndDeductions: initializedCommonCharges,
        subTotal,
        totalAmount,
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
    additionalRules = {},
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
      formData.invoiceDate,
    );

    const isDueDateValid = validateField(
      "dueDate",
      "Due date",
      formData.dueDate,
    );

    const isReferenceNumberValid = validateField(
      "referenceNumber",
      "Reference Number",
      formData.referenceNumber,
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
        additionalRules,
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    return (
      isInvoiceDateValid &&
      isDueDateValid &&
      isAttachmentsValid &&
      isReferenceNumberValid &&
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

              if (charge.isPercentage) {
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
                chargesAndDeductionAppliedData,
              );
            }),
          );
          return appliedCharges;
        }),
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
            chargesAndDeductionAppliedData,
          );
        }),
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
    if (isSubmitting.current) return;
    try {
      const status = isSaveAsDraft ? 0 : 1;
      const isFormValid = validateForm();
      const currentDate = new Date().toISOString();
      let allDetailsSuccessful;

      if (isFormValid) {
        isSubmitting.current = true;
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
          inVoicedPersonName: formData.patientName,
          inVoicedPersonMobileNo: formData.patientNo,
          appointmentId: formData.appointmentId,
          tokenNo: formData.tokenNo,
          discountAmount: formData.deductionAmount,
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

          const detailsApiResponse =
            await post_sales_invoice_detail_api(detailsData);

          return detailsApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetailsData);

        allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201,
        );

        const postChargesAndDeductionsAppliedResponse =
          await postChargesAndDeductionsApplied(salesInvoiceId);

        const allAppliedSuccessful =
          postChargesAndDeductionsAppliedResponse.every(
            (detailsResponse) => detailsResponse.status === 201,
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
            isSubmitting.current = false;

            // queryClient.invalidateQueries([
            //   "appointments",
            //   formData.invoiceDate,
            // ]);
          }, 3000);
        } else {
          setSubmissionStatus("error");
          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            setLoadingDraft(false);
            isSubmitting.current = false;
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
      setTimeout(() => {
        setSubmissionStatus(null);
        setLoading(false);
        setLoadingDraft(false);
        isSubmitting.current = false;
      }, 3000);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => {
      if (field.startsWith("commonChargesAndDeductions")) {
        // Get the charge or deduction index
        const chargeIndex = parseInt(field.split("_")[1]);

        // Update the value of the corresponding charge or deduction
        const updatedChargesAndDeductions =
          prevFormData.commonChargesAndDeductions.map((charge, index) =>
            index === chargeIndex
              ? { ...charge, value: parseFloat(value) || 0 }
              : charge,
          );

        const subTotal = calculateSubTotal(prevFormData.itemDetails);
        const totalAmount = calculateTotalAmount(
          subTotal,
          updatedChargesAndDeductions,
          prevFormData.deductionAmount,
        );

        return {
          ...prevFormData,
          commonChargesAndDeductions: updatedChargesAndDeductions,
          subTotal,
          totalAmount,
        };
      } else {
        const newValue =
          field === "deductionAmount" ? parseFloat(value) || 0 : value;
        const subTotal = calculateSubTotal(prevFormData.itemDetails);
        const totalAmount = calculateTotalAmount(
          subTotal,
          prevFormData.commonChargesAndDeductions,
          field === "deductionAmount" ? newValue : prevFormData.deductionAmount,
        );

        return {
          ...prevFormData,
          [field]: newValue,
          subTotal,
          totalAmount,
        };
      }
    });
  };

  const handleItemDetailsChange = async (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = prevFormData.itemDetails.map((item, i) => {
        if (i !== index) return item;

        let updatedItem = { ...item };
        if (field.startsWith("chargesAndDeductions")) {
          const chargeIndex = parseInt(field.split("_")[1]);
          const updatedCharges = item.chargesAndDeductions.map(
            (charge, cIdx) =>
              cIdx === chargeIndex
                ? { ...charge, value: parseFloat(value) || 0 }
                : charge,
          );
          updatedItem.chargesAndDeductions = updatedCharges;
        } else {
          updatedItem[field] =
            field === "quantity" || field === "unitPrice"
              ? parseFloat(value) || 0
              : value;
        }

        // Ensure positive values for Quantities and Unit Prices
        updatedItem.quantity = Math.max(0, updatedItem.quantity);
        updatedItem.unitPrice = Math.max(0, updatedItem.unitPrice);

        // Calculate total price based on charges and deductions
        const basePrice = updatedItem.quantity * updatedItem.unitPrice;
        let totalPrice = basePrice;

        updatedItem.chargesAndDeductions.forEach((charge) => {
          if (charge.isPercentage) {
            const amount = (basePrice * (parseFloat(charge.value) || 0)) / 100;
            totalPrice += charge.sign === "+" ? amount : -amount;
          } else {
            totalPrice +=
              charge.sign === "+"
                ? parseFloat(charge.value) || 0
                : -(parseFloat(charge.value) || 0);
          }
        });

        updatedItem.totalPrice = isNaN(totalPrice) ? 0 : totalPrice;
        return updatedItem;
      });

      const subTotal = calculateSubTotal(updatedItemDetails);
      const totalAmount = calculateTotalAmount(
        subTotal,
        prevFormData.commonChargesAndDeductions,
        prevFormData.deductionAmount,
      );

      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
        subTotal,
        totalAmount,
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
      const updatedItemDetails = prevFormData.itemDetails.filter(
        (_, i) => i !== index,
      );
      const subTotal = calculateSubTotal(updatedItemDetails);
      const totalAmount = calculateTotalAmount(
        subTotal,
        prevFormData.commonChargesAndDeductions,
        prevFormData.deductionAmount,
      );

      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
        subTotal,
        totalAmount,
      };
    });
    setValidFields({});
    setValidationErrors({});
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

  const handleSelectAppointment = async (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentSearchTerm("");

    // Set patient details and appointment ID
    setFormData((prevFormData) => ({
      ...prevFormData,
      appointmentId: appointment.id,
      tokenNo: appointment.tokenNo,
      patientName: appointment.customerName,
      patientNo: appointment.contactNo,
    }));

    // Process appointment treatments
    // if (
    //   appointment.appointmentTreatments &&
    //   appointment.appointmentTreatments.length > 0
    // ) {
    //   try {
    //     const itemDetailsPromises = appointment.appointmentTreatments.map(
    //       async (treatment) => {
    //         const itemCode = treatment.treatmentType.treatmentShortCode;

    //         try {
    //           // Fetch inventory by item code
    //           const inventoryResponse =
    //             await get_sum_location_inventories_by_locationId_itemCode_api(
    //               itemCode,
    //               formData.storeLocation || userLocations[0]?.locationId
    //             );

    //           const inventoryData = inventoryResponse?.data?.result;

    //           if (!inventoryData || !inventoryData.itemMaster) {
    //             console.warn(
    //               `No inventory found for treatment: ${treatment.treatmentType.name}`
    //             );
    //             return null;
    //           }

    //           const itemMaster = inventoryData.itemMaster;
    //           const isInventoryItem = itemMaster.isInventoryItem;

    //           // Initialize charges and deductions
    //           const initializedCharges =
    //             chargesAndDeductions
    //               ?.filter((charge) => charge.isApplicableForLineItem)
    //               ?.map((charge) => ({
    //                 id: charge.chargesAndDeductionId,
    //                 name: charge.displayName,
    //                 value: charge.amount || charge.percentage,
    //                 sign: charge.sign,
    //                 isPercentage: charge.percentage !== null,
    //               })) || [];

    //           // Handle inventory items
    //           if (isInventoryItem) {
    //             const availableStock = inventoryData.totalStockInHand || 0;

    //             if (availableStock <= 0) {
    //               console.warn(
    //                 `No stock available for treatment: ${treatment.treatmentType.name}`
    //               );
    //               alert(
    //                 `No stock available for treatment: ${treatment.treatmentType.name}`
    //               );
    //               return null;
    //             }

    //             // Get highest selling price from available batches
    //             let highestSellingPrice = 0;
    //             const batchesResponse =
    //               await get_item_batches_by_item_master_id_api(
    //                 itemMaster.itemMasterId,
    //                 sessionStorage.getItem("companyId")
    //               );
    //             highestSellingPrice =
    //               batchesResponse?.data?.result?.reduce(
    //                 (maxPrice, batch) =>
    //                   batch.sellingPrice > maxPrice
    //                     ? batch.sellingPrice
    //                     : maxPrice,
    //                 0
    //               ) || 0;

    //             return {
    //               name: treatment.treatmentType.name,
    //               id: itemMaster.itemMasterId,
    //               unit: itemMaster.unit?.unitName || "Unit",
    //               batchId: null,
    //               stockInHand: availableStock,
    //               quantity: 1, // Default quantity to 1
    //               unitPrice: highestSellingPrice,
    //               totalPrice: highestSellingPrice,
    //               isInventoryItem: true,
    //               chargesAndDeductions: initializedCharges,
    //             };
    //           }
    //           // Handle non-inventory items (services)
    //           else {
    //             return {
    //               name: treatment.treatmentType.name,
    //               id: itemMaster.itemMasterId,
    //               unit: itemMaster.unit?.unitName || "Service",
    //               batchId: null,
    //               stockInHand: 0,
    //               quantity: 1, // Services don't have quantity restrictions
    //               unitPrice:
    //                 itemMaster.unitPrice || itemMaster.sellingPrice || 0,
    //               totalPrice:
    //                 itemMaster.unitPrice || itemMaster.sellingPrice || 0,
    //               isInventoryItem: false,
    //               chargesAndDeductions: initializedCharges,
    //             };
    //           }
    //         } catch (error) {
    //           console.error(
    //             `Error processing treatment ${treatment.treatmentType.name}:`,
    //             error
    //           );
    //           return null;
    //         }
    //       }
    //     );

    //     // Wait for all items to be processed
    //     const itemDetails = await Promise.all(itemDetailsPromises);

    //     // Filter out null values (items that couldn't be processed)
    //     const validItemDetails = itemDetails.filter((item) => item !== null);

    //     if (validItemDetails.length === 0) {
    //       alert("No valid items could be added from this appointment.");
    //       return;
    //     }

    //     // Update form data with the new item details
    //     setFormData((prevFormData) => ({
    //       ...prevFormData,
    //       itemDetails: [...prevFormData.itemDetails, ...validItemDetails],
    //     }));
    //   } catch (error) {
    //     console.error("Error processing appointment treatments:", error);
    //     alert("Error processing appointment treatments. Please try again.");
    //   }
    // }
  };

  const handleResetAppointment = () => {
    setSelectedAppointment(null);
    setAppointmentSearchTerm("");

    // Clear appointment-related data and item details
    setFormData((prevFormData) => ({
      ...prevFormData,
      appointmentId: null,
      tokenNo: null,
      patientName: "",
      patientNo: "",
      itemDetails: [], // Clear all item details when resetting appointment
    }));
  };

  const handleRefreshAppointments = async () => {
    setIsRefreshing(true);
    await refetchAppointments();
    // Keep spinning for a bit even after data is fetched for better UX
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const calculateSubTotal = (itemDetails = formData.itemDetails) => {
    return itemDetails.reduce(
      (total, item) => total + (parseFloat(item.totalPrice) || 0),
      0,
    );
  };

  const calculateTotalAmount = (
    subtotal = calculateSubTotal(),
    commonChargesAndDeductions = formData.commonChargesAndDeductions,
    deductionAmount = formData.deductionAmount,
  ) => {
    let totalAmount = subtotal;
    commonChargesAndDeductions.forEach((charge) => {
      const chargeValue = parseFloat(charge.value) || 0;
      if (charge.isPercentage) {
        const amount = (subtotal * chargeValue) / 100;
        if (charge.sign === "+") {
          totalAmount += amount;
        } else if (charge.sign === "-") {
          totalAmount -= amount;
        }
      } else {
        if (charge.sign === "+") {
          totalAmount += chargeValue;
        } else if (charge.sign === "-") {
          totalAmount -= chargeValue;
        }
      }
    });

    // Subtract deduction amount from total
    totalAmount -= parseFloat(deductionAmount) || 0;

    return totalAmount;
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

    try {
      if (item.isInventoryItem === true) {
        const inventory =
          await get_sum_location_inventories_by_locationId_itemMasterId_api(
            item.itemMasterId,
            userLocations[0]?.locationId,
          );
        availableStock = inventory?.data?.result?.totalStockInHand || 0;

        if (availableStock <= 0) {
          console.warn("No stock available for this item");
          toast.error(`No stock available for ${item.itemName}`);
          return;
        }
      }

      // Calculate initial totalPrice for the new item
      const initialQuantity = item.isInventoryItem === false ? 1 : 0;
      const initialUnitPrice = parseFloat(item.unitPrice) || 0;
      const basePrice = initialQuantity * initialUnitPrice;
      let initialTotalPrice = basePrice;

      initializedCharges.forEach((charge) => {
        const chargeValue = parseFloat(charge.value) || 0;
        if (charge.isPercentage) {
          const amount = (basePrice * chargeValue) / 100;
          initialTotalPrice += charge.sign === "+" ? amount : -amount;
        } else {
          initialTotalPrice += charge.sign === "+" ? chargeValue : -chargeValue;
        }
      });

      const newItem = {
        name: item?.itemName,
        id: item?.itemMasterId,
        unit: item?.unit?.unitName,
        batchId: null,
        stockInHand: availableStock,
        quantity: initialQuantity,
        unitPrice: initialUnitPrice,
        totalPrice: isNaN(initialTotalPrice) ? 0 : initialTotalPrice,
        isInventoryItem: item?.isInventoryItem,
        chargesAndDeductions: initializedCharges,
      };

      // Update form data
      setFormData((prevFormData) => {
        const updatedItemDetails = [...prevFormData.itemDetails, newItem];
        const subTotal = calculateSubTotal(updatedItemDetails);
        const totalAmount = calculateTotalAmount(
          subTotal,
          prevFormData.commonChargesAndDeductions,
          prevFormData.deductionAmount,
        );

        return {
          ...prevFormData,
          itemDetails: updatedItemDetails,
          subTotal,
          totalAmount,
        };
      });
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

  // const handleAddCommonChargesAndDeductions = () => {
  //   const initializedCharges = chargesAndDeductions.reduce((acc, charge) => {
  //     if (charge.isDisableFromSubTotal === false) {
  //       // Initialize additional properties for the common on charges and deductions
  //       acc[charge.displayName] = charge.amount || charge.percentage;
  //     }
  //     return acc;
  //   }, {});

  //   // Generate chargesAndDeductions array for the newly added item
  //   const initializedChargesArray = chargesAndDeductions
  //     .filter((charge) => charge.isDisableFromSubTotal === false)
  //     .map((charge) => ({
  //       id: charge.chargesAndDeductionId,
  //       name: charge.displayName,
  //       value: charge.amount || charge.percentage,
  //       sign: charge.sign,
  //       isPercentage: charge.percentage !== null,
  //       isDisableFromSubTotal: charge.isDisableFromSubTotal,
  //     }));

  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     ...initializedCharges,
  //     commonChargesAndDeductions: initializedChargesArray,
  //   }));
  // };

  const handleAddCommonChargesAndDeductions = () => {
    const initializedCharges = chargesAndDeductions.reduce((acc, charge) => {
      if (charge.isDisableFromSubTotal === false) {
        acc[charge.displayName] = charge.amount || charge.percentage;
      }
      return acc;
    }, {});

    const initializedChargesArray = chargesAndDeductions
      .filter((charge) => charge.isDisableFromSubTotal === false)
      .map((charge) => ({
        id: charge.chargesAndDeductionId,
        name: charge.displayName,
        value: parseFloat(charge.amount || charge.percentage), // Ensure it's a number
        sign: charge.sign,
        isPercentage: charge.percentage !== null,
        isDisableFromSubTotal: charge.isDisableFromSubTotal,
      }));

    setFormData((prevFormData) => ({
      ...prevFormData,
      ...initializedCharges,
      // Only set commonChargesAndDeductions if there's no sales order
      // or if it hasn't been set yet
      commonChargesAndDeductions: prevFormData.salesOrderId
        ? prevFormData.commonChargesAndDeductions
        : initializedChargesArray,
    }));
  };

  // useEffect(() => {
  //   chargesAndDeductions && handleAddCommonChargesAndDeductions();
  // }, [isLoadingchargesAndDeductions]);

  useEffect(() => {
    // Only initialize common charges if there's no sales order
    if (chargesAndDeductions && !formData.salesOrderId) {
      handleAddCommonChargesAndDeductions();
    }
  }, [isLoadingchargesAndDeductions, formData.salesOrderId]);

  const renderSubColumns = () => {
    return formData.commonChargesAndDeductions.map((charge, chargeIndex) => {
      if (charge.isDisableFromSubTotal === false) {
        return (
          <tr key={chargeIndex}>
            <td
              colSpan={
                5 +
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
                    newValue,
                  );
                }}
              />
            </td>
            <td></td>
          </tr>
        );
      }
      return null;
    });
  };

  console.log("formData", formData);
  console.log("SO", salesOrder);

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
    appointments,
    appointmentsError,
    isAppointmentsLoading,
    useAppointment,
    appointmentSearchTerm,
    selectedAppointment,
    isRefreshing,
    handleRefreshAppointments,
    setUseAppointment,
    setAppointmentSearchTerm,
    handleSelectAppointment,
    handleResetAppointment,
    handleInputChange,
    handleItemDetailsChange,
    handleAttachmentChange,
    handleSubmit,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    calculateTotalAmount,
    setSalesOrderSearchTerm,
    setSearchTerm,
    handleSelectItem,
    calculateSubTotal,
    renderColumns,
    renderSubColumns,
    refetchAppointments,
  };
};

export default useSalesInvoice;
