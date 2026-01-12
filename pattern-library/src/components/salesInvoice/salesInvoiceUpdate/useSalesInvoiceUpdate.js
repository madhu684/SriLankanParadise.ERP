import { useState, useEffect, useRef } from "react";
import {
  put_sales_invoice_api,
  put_sales_invoice_detail_api,
  post_sales_invoice_detail_api,
  delete_sales_invoice_detail_api,
  get_company_api,
} from "../../../services/salesApi";
import {
  get_item_batches_by_item_master_id_api,
  get_charges_and_deductions_by_company_id_api,
  post_charges_and_deductions_applied_api,
  get_transaction_types_api,
  get_charges_and_deductions_applied_api,
  put_charges_and_deductions_applied_api,
  delete_charges_and_deductions_applied_api,
  get_locations_inventories_by_location_id_api,
  get_item_batch_by_itemMasterId_batchId_api,
  get_sum_location_inventories_by_locationId_itemMasterId_api,
  get_sum_location_inventories_by_locationId_itemCode_api,
} from "../../../services/purchaseApi";
import { get_item_masters_by_company_id_with_query_api } from "../../../services/inventoryApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  get_appointment_by_id_api,
  get_appointment_tokens_by_date_api,
} from "../../../services/ayuOMSApi";
import toast from "react-hot-toast";

const useSalesInvoiceUpdate = ({ salesInvoice, onFormSubmit }) => {
  const [useAppointment, setUseAppointment] = useState(
    !!salesInvoice?.appointmentId
  );
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
    referenceNo: "",
    subTotal: 0,
    commonChargesAndDeductions: [],
    deductionAmount: 0,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [itemIdsToBeDeleted, setItemIdsToBeDeleted] = useState([]);
  const alertRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [
    chargesAndDeductionsAppliedIdsToBeDeleted,
    setChargesAndDeductionsAppliedIdsToBeDeleted,
  ] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: appointmentDetails,
    isLoading: isAppointmentLoading,
    isError: isAppointmentError,
  } = useQuery({
    queryKey: ["appointmentDetails", salesInvoice?.appointmentId],
    queryFn: async () => {
      if (!salesInvoice?.appointmentId) return null;
      const response = await get_appointment_by_id_api(
        sessionStorage.getItem("companyId"),
        salesInvoice.appointmentId
      );
      return response.data.result;
    },
    enabled: !!salesInvoice?.appointmentId,
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
        formData.invoiceDate
      );
      return response.data.result || [];
    },
    enabled: !!formData.invoiceDate && useAppointment,
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
    data: locationInventories = [],
    isLoading: isLocationInventoriesLoading,
    isError: isLocationInventoriesError,
    refetch: refetchLocationInventories,
  } = useQuery({
    queryKey: ["locationInventories", formData.storeLocation],
    queryFn: () => fetchLocationInventories(parseInt(salesInvoice.locationId)),
    enabled: !!salesInvoice.locationId,
  });

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
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
        3,
        salesInvoice.salesInvoiceId,
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
    queryKey: ["chargesAndDeductionsApplied", salesInvoice.salesInvoiceId],
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

  // Effects
  useEffect(() => {
    if (
      !isChargesAndDeductionsAppliedLoading &&
      chargesAndDeductionsApplied &&
      !isLoadingchargesAndDeductions &&
      chargesAndDeductions &&
      !isCompanyLoading &&
      company &&
      locationInventories.length > 0
    ) {
      const fetchData = async () => {
        const deepCopySalesInvoice = JSON.parse(JSON.stringify(salesInvoice));
        let salesInvoiceDetails = salesInvoice.salesInvoiceDetails;

        // Fetch inventory data for all items in parallel
        const inventoryPromises = salesInvoiceDetails.map((item) =>
          get_sum_location_inventories_by_locationId_itemMasterId_api(
            item.itemBatchItemMasterId,
            salesInvoice.locationId
          )
        );
        const inventoryResults = await Promise.all(inventoryPromises);

        // Initialize line item charges and deductions
        const initializedLineItemCharges = salesInvoiceDetails.map(
          (item, index) => {
            const inventory = inventoryResults[index];
            const availableStock =
              inventory?.data?.result?.totalStockInHand || 0;

            const initializedCharges = chargesAndDeductionsApplied
              ?.filter(
                (charge) => charge.lineItemId === item.itemBatchItemMasterId
              )
              .map((charge) => {
                let value;
                if (charge.chargesAndDeduction.percentage !== null) {
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

            const sortedLineItemCharges = chargesAndDeductions
              .filter((charge) => charge.isApplicableForLineItem === true)
              .map((charge) => {
                const displayName = charge.displayName;
                const matchedCharge = initializedCharges.find(
                  (c) => c.name === displayName
                );
                return matchedCharge || null;
              });

            return {
              salesInvoiceDetailId: item?.salesInvoiceDetailId,
              salesInvoiceId: item?.salesInvoiceId,
              itemMasterId: item?.itemMaster?.itemMasterId,
              isInventoryItem: item?.itemMaster?.isInventoryItem,
              name: item?.itemMaster?.itemName,
              unit: item?.itemMaster?.unit.unitName,
              stockInHand: availableStock,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              chargesAndDeductions: sortedLineItemCharges,
            };
          }
        );

        const subTotal = deepCopySalesInvoice.salesInvoiceDetails.reduce(
          (total, item) => total + item.totalPrice,
          0
        );

        // Initialize common charges and deductions
        const initializedCommonCharges = chargesAndDeductionsApplied
          ?.filter((charge) => !charge.lineItemId)
          .map((charge) => {
            let value;
            if (charge.chargesAndDeduction.percentage !== null) {
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

        setFormData({
          salesInvoiceId: deepCopySalesInvoice?.salesInvoiceId ?? "",
          invoiceDate: deepCopySalesInvoice?.invoiceDate?.split("T")[0] ?? "",
          dueDate: deepCopySalesInvoice?.dueDate?.split("T")[0] ?? "",
          referenceNumber: deepCopySalesInvoice?.referenceNo ?? "",
          patientName: deepCopySalesInvoice?.inVoicedPersonName ?? "",
          patientNo: deepCopySalesInvoice?.inVoicedPersonMobileNo ?? "",
          appointmentId: deepCopySalesInvoice?.appointmentId ?? null,
          tokenNo: deepCopySalesInvoice?.tokenNo ?? null,
          itemDetails: initializedLineItemCharges,
          attachments: deepCopySalesInvoice?.attachments ?? [],
          totalAmount: deepCopySalesInvoice?.totalAmount ?? "",
          subTotal: 0,
          commonChargesAndDeductions: initializedCommonCharges,
          salesOrderId: deepCopySalesInvoice?.salesOrderId ?? null,
          storeLocation: deepCopySalesInvoice?.locationId ?? null,
          deductionAmount: deepCopySalesInvoice?.discountAmount ?? 0,
        });
      };

      fetchData();
    }
  }, [
    salesInvoice,
    isChargesAndDeductionsAppliedLoading,
    chargesAndDeductionsApplied,
    isLoadingchargesAndDeductions,
    chargesAndDeductions,
    isCompanyLoading,
    company,
    locationInventories,
  ]);

  useEffect(() => {
    if (appointmentDetails && !selectedAppointment) {
      setSelectedAppointment(appointmentDetails);
    }
  }, [appointmentDetails]);

  useEffect(() => {
    if (!useAppointment && selectedAppointment) {
      handleResetAppointment();
    }
  }, [useAppointment]);

  const getTransactionTypeIdByName = (name) => {
    const transactionType = transactionTypes.find((type) => type.name === name);
    return transactionType ? transactionType.transactionTypeId : null;
  };

  const updateChargesAndDeductionsApplied = async (transactionId) => {
    try {
      const transactionTypeId = getTransactionTypeIdByName("SalesInvoice");

      const chargesAndDeductionsAppliedData = await Promise.all(
        formData.itemDetails.map(async (item) => {
          const appliedCharges = await Promise.all(
            item.chargesAndDeductions.map(async (charge) => {
              let appliedValue = 0;

              const chargeValue = parseFloat(charge.value) || 0;

              if (charge.isPercentage) {
                // Calculate the amount based on percentage
                const baseAmount =
                  item.isInventoryItem === true
                    ? item.quantity * item.unitPrice
                    : item.unitPrice;

                const amount = (baseAmount * chargeValue) / 100;
                appliedValue = charge.sign === "+" ? amount : -amount;
              } else {
                // Use the value directly based on the sign
                appliedValue = charge.sign === "+" ? chargeValue : -chargeValue;
              }

              console.log(
                `Applied charge for ${item.itemMasterId}: `,
                appliedValue
              );

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
                permissionId: 1057,
              };

              if (charge.chargesAndDeductionAppliedId) {
                return await put_charges_and_deductions_applied_api(
                  charge.chargesAndDeductionAppliedId,
                  chargesAndDeductionAppliedData
                );
              } else {
                return await post_charges_and_deductions_applied_api(
                  chargesAndDeductionAppliedData
                );
              }
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
            permissionId: 1057,
          };

          return await put_charges_and_deductions_applied_api(
            charge.chargesAndDeductionAppliedId,
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

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      subTotal: calculateSubTotal(),
      totalAmount: calculateTotalAmount(),
    }));
  }, [
    formData.itemDetails,
    formData.commonChargesAndDeductions,
    formData.deductionAmount,
  ]);

  const validateField = (
    fieldName,
    fieldDisplayName,
    value,
    additionalRules = {}
  ) => {
    let isFieldValid = true;
    let errorMessage = "";

    // Required validation
    if (value === null || value === undefined || `${value}`.trim() === "") {
      isFieldValid = false;
      errorMessage = `${fieldDisplayName} is required`;
    }

    // Additional validation
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

    let isItemQuantityValid = true;
    // Validate item details
    formData.itemDetails.forEach((item, index) => {
      if (item.isInventoryItem === false) return;
      const fieldName = `quantity_${index}`;
      const fieldDisplayName = `Quantity for ${item.name}`;

      const additionalRules = {
        validationFunction: (value) =>
          parseFloat(value) > 0 && parseFloat(value) <= item.stockInHand,
        errorMessage: `${fieldDisplayName} must be greater than 0 and less than or equal to stock in hand ${item.stockInHand}`,
      };

      const isValidQuantity = validateField(
        fieldName,
        fieldDisplayName,
        item.quantity,
        additionalRules
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });
    const isAttachmentsValid = validateAttachments(formData.attachments);

    return (
      isInvoiceDateValid &&
      isDueDateValid &&
      isItemQuantityValid &&
      isAttachmentsValid &&
      isReferenceNumberValid
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;
      const currentDate = new Date().toISOString();
      let putSalesInvoiceSuccessful;

      const isFormValid = validateForm(isSaveAsDraft);
      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const salesInvoiceData = {
          invoiceDate: formData.invoiceDate,
          dueDate: formData.dueDate,
          totalAmount: formData.totalAmount,
          status: status,
          createdBy: salesInvoice.createdBy,
          createdUserId: salesInvoice.createdUserId,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          companyId: salesInvoice.companyId,
          salesOrderId: formData?.salesOrderId,
          amountDue: formData.totalAmount,
          createdDate: salesInvoice.createdDate,
          lastUpdatedDate: currentDate,
          referenceNumber: salesInvoice.referenceNumber,
          permissionId: 31,
          locationId: salesInvoice.locationId,
          inVoicedPersonName: formData.patientName,
          inVoicedPersonMobileNo: formData.patientNo,
          appointmentId: formData.appointmentId,
          tokenNo: formData.tokenNo,
          discountAmount: formData.deductionAmount,
        };

        const response = await put_sales_invoice_api(
          salesInvoice.salesInvoiceId,
          salesInvoiceData
        );

        putSalesInvoiceSuccessful =
          response.status === 201 || response.status === 200;

        for (const itemDetail of formData.itemDetails) {
          if (itemDetail.salesInvoiceDetailId === null) {
            const itemDetailData = {
              salesInvoiceId: salesInvoice.salesInvoiceId,
              quantity: itemDetail.quantity,
              unitPrice: itemDetail.unitPrice,
              totalPrice: itemDetail.totalPrice,
              itemBatchItemMasterId: itemDetail.itemMasterId,
              itemBatchBatchId: null,
              permissionId: 31,
            };
            await post_sales_invoice_detail_api(itemDetailData);
          } else {
            const itemDetailData = {
              salesInvoiceId: itemDetail.salesInvoiceId,
              quantity: itemDetail.quantity,
              unitPrice: itemDetail.unitPrice,
              totalPrice: itemDetail.totalPrice,
              itemBatchItemMasterId: itemDetail.itemMasterId,
              itemBatchBatchId: null,
              permissionId: 31,
            };

            await put_sales_invoice_detail_api(
              itemDetail.salesInvoiceDetailId,
              itemDetailData
            );
          }
        }

        const updateChargesAndDeductionsAppliedResponse =
          await updateChargesAndDeductionsApplied(salesInvoice.salesInvoiceId);

        const allAppliedSuccessful =
          updateChargesAndDeductionsAppliedResponse.every(
            (detailsResponse) => detailsResponse.status === 201 || 200
          );

        for (const chargesAndDeductionsAppliedIdToBeDeleted of chargesAndDeductionsAppliedIdsToBeDeleted) {
          const response = await delete_charges_and_deductions_applied_api(
            chargesAndDeductionsAppliedIdToBeDeleted
          );
          console.log(
            `Successfully deleted item with ID: ${chargesAndDeductionsAppliedIdToBeDeleted}`
          );
        }
        setChargesAndDeductionsAppliedIdsToBeDeleted([]);

        if (itemIdsToBeDeleted.length > 0) {
          for (const itemIdToBeDeleted of itemIdsToBeDeleted) {
            await delete_sales_invoice_detail_api(
              itemIdToBeDeleted.salesInvoiceDetailId
            );
            console.log(
              `Successfully deleted item with ID: ${itemIdToBeDeleted.salesInvoiceDetailId}`
            );
          }
          setItemIdsToBeDeleted([]);
        }

        if (putSalesInvoiceSuccessful && allAppliedSuccessful) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Sales invoice updated and saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Sales invoice submitted successfully!", formData);
          }

          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            setLoadingDraft(false);
            onFormSubmit();

            queryClient.invalidateQueries([
              "salesInvoiceOptions",
              sessionStorage.getItem("companyId"),
            ]);
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

  const handleItemDetailsChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];

      // Check if the field belongs to chargesAndDeductions
      if (field.startsWith("chargesAndDeductions")) {
        // Get the charge or deduction index
        const chargeIndex = parseInt(field.split("_")[1]);

        // Update the value of the corresponding charge or deduction
        updatedItemDetails[index].chargesAndDeductions[chargeIndex].value =
          value;
      } else {
        // If the field is not part of chargesAndDeductions, update other fields
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
        updatedItemDetails[index].isInventoryItem === true
          ? updatedItemDetails[index].quantity *
            updatedItemDetails[index].unitPrice
          : updatedItemDetails[index].unitPrice;

      let totalPrice =
        updatedItemDetails[index].isInventoryItem === true
          ? updatedItemDetails[index].quantity *
            updatedItemDetails[index].unitPrice
          : updatedItemDetails[index].unitPrice;

      // Add or subtract charges and deductions from total price
      updatedItemDetails[index].chargesAndDeductions.forEach((charge) => {
        if (charge.isPercentage) {
          // If charge is a percentage, calculate the amount and add/subtract it
          const amount = (grandTotalPrice * charge.value) / 100;
          if (charge.sign === "+") {
            totalPrice += amount;
          } else if (charge.sign === "-") {
            totalPrice -= amount;
          }
        } else {
          // If charge is not a percentage, directly add/subtract the value
          if (charge.sign === "+") {
            totalPrice += charge.value;
          } else if (charge.sign === "-") {
            totalPrice -= charge.value;
          }
        }
      });

      // Ensure totalPrice is initialized and is a numerical value
      totalPrice = isNaN(totalPrice) ? 0 : totalPrice;

      updatedItemDetails[index].totalPrice = totalPrice;

      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
        subTotal: calculateSubTotal(),
        totalAmount: calculateTotalAmount(),
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

  const handleRemoveItem = (index, item, chargesAndDeductions) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails.splice(index, 1);
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });

    if (
      item.salesInvoiceDetailId !== null &&
      item.salesInvoiceDetailId !== undefined
    ) {
      setItemIdsToBeDeleted((prevIds) => [...prevIds, item]);
    }

    chargesAndDeductions.map((charge) => {
      if (
        charge.chargesAndDeductionAppliedId !== null &&
        charge.chargesAndDeductionAppliedId !== undefined
      ) {
        setChargesAndDeductionsAppliedIdsToBeDeleted((prevIds) => [
          ...prevIds,
          charge.chargesAndDeductionAppliedId,
        ]);
      }
    });
    // setFormData((prevFormData) => ({
    //   ...prevFormData,
    //   itemMasterId: 0,
    //   itemMaster: "",
    // }));
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

    // Process appointment treatments and replace item details
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
    //               formData.storeLocation || salesInvoice.locationId
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
    //               salesInvoiceDetailId: null,
    //               salesInvoiceId: salesInvoice.salesInvoiceId,
    //               itemMasterId: itemMaster.itemMasterId,
    //               isInventoryItem: true,
    //               name: treatment.treatmentType.name,
    //               unit: itemMaster.unit?.unitName || "Unit",
    //               stockInHand: availableStock,
    //               quantity: 1,
    //               unitPrice: highestSellingPrice,
    //               totalPrice: highestSellingPrice,
    //               chargesAndDeductions: initializedCharges,
    //             };
    //           }
    //           // Handle non-inventory items (services)
    //           else {
    //             return {
    //               salesInvoiceDetailId: null,
    //               salesInvoiceId: salesInvoice.salesInvoiceId,
    //               itemMasterId: itemMaster.itemMasterId,
    //               isInventoryItem: false,
    //               name: treatment.treatmentType.name,
    //               unit: itemMaster.unit?.unitName || "Service",
    //               stockInHand: 0,
    //               quantity: 1,
    //               unitPrice:
    //                 itemMaster.unitPrice || itemMaster.sellingPrice || 0,
    //               totalPrice:
    //                 itemMaster.unitPrice || itemMaster.sellingPrice || 0,
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

    //     // Mark existing items for deletion
    //     const existingItemsToDelete = formData.itemDetails.filter(
    //       (item) => item.salesInvoiceDetailId !== null
    //     );

    //     if (existingItemsToDelete.length > 0) {
    //       setItemIdsToBeDeleted((prevIds) => [
    //         ...prevIds,
    //         ...existingItemsToDelete,
    //       ]);

    //       // Mark charges and deductions for deletion
    //       existingItemsToDelete.forEach((item) => {
    //         item.chargesAndDeductions.forEach((charge) => {
    //           if (charge.chargesAndDeductionAppliedId !== null) {
    //             setChargesAndDeductionsAppliedIdsToBeDeleted((prevIds) => [
    //               ...prevIds,
    //               charge.chargesAndDeductionAppliedId,
    //             ]);
    //           }
    //         });
    //       });
    //     }

    //     // Replace item details with new appointment items
    //     setFormData((prevFormData) => ({
    //       ...prevFormData,
    //       itemDetails: validItemDetails,
    //     }));
    //   } catch (error) {
    //     console.error("Error processing appointment treatments:", error);
    //     alert("Error processing appointment treatments. Please try again.");
    //   }
    // }
  };

  // Add handler for resetting appointment
  const handleResetAppointment = () => {
    setSelectedAppointment(null);
    setAppointmentSearchTerm("");

    // Mark all existing items for deletion
    const existingItemsToDelete = formData.itemDetails.filter(
      (item) => item.salesInvoiceDetailId !== null
    );

    if (existingItemsToDelete.length > 0) {
      setItemIdsToBeDeleted((prevIds) => [
        ...prevIds,
        ...existingItemsToDelete,
      ]);

      // Mark charges and deductions for deletion
      existingItemsToDelete.forEach((item) => {
        item.chargesAndDeductions.forEach((charge) => {
          if (charge.chargesAndDeductionAppliedId !== null) {
            setChargesAndDeductionsAppliedIdsToBeDeleted((prevIds) => [
              ...prevIds,
              charge.chargesAndDeductionAppliedId,
            ]);
          }
        });
      });
    }

    // Clear form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      appointmentId: null,
      tokenNo: null,
      patientName: "",
      patientNo: "",
      itemDetails: [],
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
    let totalAmount = subtotal;
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

    // Subtract deduction amount from total
    totalAmount -= parseFloat(formData.deductionAmount) || 0;

    return totalAmount;
  };

  // Handler to add the selected item to itemDetails
  const handleSelectItem = async (item) => {
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
            formData.storeLocation
          );
        availableStock = inventory?.data?.result?.totalStockInHand || 0;

        if (availableStock <= 0) {
          console.warn("No stock available for this item");
          toast.error(`No stock available for ${item.itemName}`);
          return;
        }
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: [
          ...prevFormData.itemDetails,
          {
            salesInvoiceDetailId: null,
            salesInvoiceId: salesInvoice.salesInvoiceId,
            itemMasterId: item?.itemMasterId,
            isInventoryItem: item?.isInventoryItem,
            name: item?.itemName,
            unit: item?.unit?.unitName,
            stockInHand: item.isInventoryItem === true ? availableStock : 0,
            quantity: item.isInventoryItem === false ? 1 : 0,
            unitPrice: item.unitPrice,
            totalPrice:
              item.isInventoryItem === false ? item.unitPrice : item.unitPrice,
            chargesAndDeductions: initializedCharges,
          },
        ],
      }));

      setSearchTerm("");
      setSelectedBatch(null);
    } catch (error) {
      console.error("Error processing item:", error);
      alert("Error processing item. Please try again.");
    }
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

  const renderSubColumns = () => {
    return formData.commonChargesAndDeductions.map((charge, chargeIndex) => {
      if (!charge.isApplicableForLineItem) {
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
                    newValue
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
  // console.log(
  //   "chargesAndDeductionsAppliedIdsToBeDeleted: ",
  //   chargesAndDeductionsAppliedIdsToBeDeleted
  // );
  console.log("itemIdsToBeDeleted: ", itemIdsToBeDeleted);

  return {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    selectedBatch,
    isLoadingchargesAndDeductions,
    ischargesAndDeductionsError,
    isLoadingTransactionTypes,
    isTransactionTypesError,
    transactionTypesError,
    loading,
    loadingDraft,
    isCompanyLoading,
    isCompanyError,
    company,
    itemIdsToBeDeleted,
    locationInventories,
    useAppointment,
    appointmentSearchTerm,
    selectedAppointment,
    isAppointmentLoading,
    appointments,
    isAppointmentsLoading,
    appointmentsError,
    isRefreshing,
    handleRefreshAppointments,
    setUseAppointment,
    setAppointmentSearchTerm,
    handleSelectAppointment,
    handleResetAppointment,
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    calculateTotalAmount,
    setSearchTerm,
    handleSelectItem,
    renderColumns,
    calculateSubTotal,
    renderSubColumns,
    refetchAppointments,
  };
};

export default useSalesInvoiceUpdate;
