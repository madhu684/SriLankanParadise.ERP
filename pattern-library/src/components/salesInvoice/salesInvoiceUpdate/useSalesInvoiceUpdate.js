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
  put_item_batch_api,
  get_charges_and_deductions_by_company_id_api,
  post_charges_and_deductions_applied_api,
  get_transaction_types_api,
  get_charges_and_deductions_applied_api,
  put_charges_and_deductions_applied_api,
  delete_charges_and_deductions_applied_api,
} from "../../../services/purchaseApi";
import { get_item_masters_by_company_id_with_query_api } from "../../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const useSalesInvoiceUpdate = ({ salesInvoice, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    itemMasterId: 0,
    itemMaster: "",
    invoiceDate: "",
    dueDate: "",
    referenceNumber: "",
    itemDetails: [],
    attachments: [],
    totalAmount: 0,
    salesOrderId: "",
    referenceNo: "",
    subTotal: 0,
    selectedCustomer: "",
    commonChargesAndDeductions: [],
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
  const [showModal, setShowModal] = useState(false);
  const [processedItems, setProcessedItems] = useState(false);

  const fetchItemBatches = async (itemMasterId) => {
    try {
      const response = await get_item_batches_by_item_master_id_api(
        itemMasterId,
        sessionStorage.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching item batches:", error);
    }
  };

  const {
    data: itemBatches,
    isLoading,
    isError,
    error,
    refetch: refetchItemBatches,
  } = useQuery({
    queryKey: ["itemBatches", formData.itemMasterId],
    queryFn: () => fetchItemBatches(formData.itemMasterId),
  });

  const fetchItems = async (companyId, searchQuery, itemType) => {
    try {
      const response = await get_item_masters_by_company_id_with_query_api(
        companyId,
        searchQuery,
        itemType
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const {
    data: availableItems,
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", searchTerm],
    queryFn: () =>
      fetchItems(sessionStorage.getItem("companyId"), searchTerm, "Sellable"), //Sellable
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

  // Group sales order details by item master ID
  const groupedSalesInvoiceDetails = salesInvoice.salesInvoiceDetails.reduce(
    (acc, item) => {
      const itemMasterId = item.itemBatch?.itemMaster?.itemMasterId;
      if (!acc[itemMasterId]) {
        acc[itemMasterId] = { ...item, quantity: 0, totalPrice: 0 };
      }
      acc[itemMasterId].quantity += item.quantity;
      acc[itemMasterId].totalPrice += item.totalPrice;
      return acc;
    },
    {}
  );

  useEffect(() => {
    if (!isCompanyLoading && company && company.batchStockType === "FIFO") {
      const promises = Object.values(groupedSalesInvoiceDetails).map(
        async (item) => {
          try {
            // Fetch batches for the current itemMasterId
            const response = await get_item_batches_by_item_master_id_api(
              item.itemBatchItemMasterId,
              sessionStorage.getItem("companyId")
            );

            // Calculate total temporary quantity from batches
            const tempQuantity = response.data.result.reduce(
              (total, batch) => total + (batch.tempQuantity || 0),
              0
            );

            // Update quantity and totalPrice
            item.itemBatch.tempQuantity = tempQuantity;

            // Update tempQuantity of fetched batches based on salesOrderDetails
            const updatedBatches = response.data.result.map((batch) => {
              const correspondingDetail = salesInvoice.salesInvoiceDetails.find(
                (detail) => detail.itemBatchBatchId === batch.batchId
              );
              if (correspondingDetail) {
                batch.tempQuantity += correspondingDetail.quantity;
              }
              return batch;
            });

            // Update item.batches with the updated batches
            item.batches = updatedBatches;

            return item;
          } catch (error) {
            console.error("Error processing item:", error);
            throw error; // Propagate the error
          }
        }
      );

      Promise.all(promises)
        .then((processedItems) => {
          // Handle processed items here
          setProcessedItems(processedItems);
        })
        .catch((error) => {
          // Handle error if any
          console.error("Error processing items:", error);
        });
    }
  }, [isCompanyLoading, company]);

  useEffect(() => {
    if (
      !isChargesAndDeductionsAppliedLoading &&
      chargesAndDeductionsApplied &&
      !isLoadingchargesAndDeductions &&
      chargesAndDeductions &&
      !isCompanyLoading &&
      company
    ) {
      const deepCopySalesInvoice = JSON.parse(JSON.stringify(salesInvoice));

      let salesInvoiceDetails;

      if (processedItems && company.batchStockType === "FIFO") {
        salesInvoiceDetails = processedItems;
      } else {
        salesInvoiceDetails = salesInvoice.salesInvoiceDetails;
      }

      // Initialize line item charges and deductions
      const initializedLineItemCharges = salesInvoiceDetails.map((item) => {
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
              chargesAndDeductionAppliedId: charge.chargesAndDeductionAppliedId,
            };
          });

        // Sort the charges and deductions according to the order of display names
        const sortedLineItemCharges = chargesAndDeductions
          .filter((charge) => charge.isApplicableForLineItem)
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
        };
      });

      const subTotal = deepCopySalesInvoice.salesInvoiceDetails.reduce(
        (total, item) => total + item.totalPrice,
        0
      );

      // Initialize common charges and deductions
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

      setFormData({
        salesInvoiceId: deepCopySalesInvoice?.salesInvoiceId ?? "",
        invoiceDate: deepCopySalesInvoice?.invoiceDate?.split("T")[0] ?? "",
        dueDate: deepCopySalesInvoice?.dueDate?.split("T")[0] ?? "",
        referenceNumber: deepCopySalesInvoice?.referenceNumber ?? "",
        itemDetails: initializedLineItemCharges,
        attachments: deepCopySalesInvoice?.attachments ?? [],
        totalAmount: deepCopySalesInvoice?.totalAmount ?? "",
        itemMasterId: 0,
        itemMaster: "",
        subTotal: 0,
        commonChargesAndDeductions: initializedCommonCharges,
        salesOrderId: deepCopySalesInvoice?.salesOrderId ?? null,
      });
    }
  }, [
    salesInvoice,
    isChargesAndDeductionsAppliedLoading,
    chargesAndDeductionsApplied,
    isLoadingchargesAndDeductions,
    chargesAndDeductions,
    isCompanyLoading,
    company,
    processedItems,
  ]);

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

              if (charge.isPercentage) {
                // Calculate the amount based on percentage and sign
                const amount =
                  (item.quantity * item.unitPrice * charge.value) / 100;
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
  }, [formData.itemDetails, formData.commonChargesAndDeductions]);

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
      const fieldName = `quantity_${index}`;
      const fieldDisplayName = `Quantity for ${item.name}`;

      const additionalRules = {
        validationFunction: (value) =>
          parseFloat(value) > 0 && parseFloat(value) <= item.tempQuantity,
        errorMessage: `${fieldDisplayName} must be greater than 0 and less than or equal to temporary quantity ${item.tempQuantity}`,
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
      let allDetailsBatchSuccessful;
      let allDetailsSuccessful;
      let allDetailsDeleteBatchSuccessful;

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
          createdBy: sessionStorage?.getItem("username") ?? null,
          createdUserId: sessionStorage?.getItem("userId") ?? null,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          companyId: sessionStorage?.getItem("companyId") ?? null,
          salesOrderId: formData?.salesOrderId,
          amountDue: formData.totalAmount,
          createdDate: salesInvoice.createdDate,
          lastUpdatedDate: currentDate,
          referenceNumber: formData.referenceNumber,
          permissionId: 31,
        };

        const response = await put_sales_invoice_api(
          salesInvoice.salesInvoiceId,
          salesInvoiceData
        );

        if (company.batchStockType === "FIFO") {
          const batchUpdates = [];
          const detailsPromises = [];

          const itemDetailsBatchData = formData.itemDetails.map(
            async (item) => {
              let remainingQuantity = item.quantity;

              for (const batch of item.batches) {
                const quantityToConsume = Math.min(
                  remainingQuantity,
                  batch.tempQuantity
                );

                const itemBatchUpdateData = {
                  batchId: batch.batchId,
                  itemMasterId: batch.itemMasterId,
                  costPrice: batch.costPrice,
                  sellingPrice: batch.sellingPrice,
                  status: batch.status,
                  companyId: batch.companyId,
                  createdBy: batch.createdBy,
                  createdUserId: batch.createdUserId,
                  tempQuantity: batch.tempQuantity - quantityToConsume,
                  locationId: batch.locationId,
                  expiryDate: batch.expiryDate,
                  permissionId: 1065,
                };

                batchUpdates.push(
                  put_item_batch_api(
                    batch.batchId,
                    batch.itemMasterId,
                    itemBatchUpdateData
                  )
                );

                if (quantityToConsume > 0) {
                  if (item.salesInvoiceDetailId != null) {
                    detailsPromises.push(
                      put_sales_invoice_detail_api(item.salesInvoiceDetailId, {
                        itemBatchItemMasterId: batch.itemMasterId,
                        itemBatchBatchId: batch.batchId,
                        salesInvoiceId: salesInvoice.salesInvoiceId,
                        quantity: quantityToConsume,
                        unitPrice: item.unitPrice,
                        totalPrice:
                          (item.totalPrice / item.quantity) * quantityToConsume,
                        permissionId: 25,
                      })
                    );
                  } else {
                    detailsPromises.push(
                      post_sales_invoice_detail_api({
                        itemBatchItemMasterId: batch.itemMasterId,
                        itemBatchBatchId: batch.batchId,
                        salesInvoiceId: salesInvoice.salesInvoiceId,
                        quantity: quantityToConsume,
                        unitPrice: item.unitPrice,
                        totalPrice:
                          (item.totalPrice / item.quantity) * quantityToConsume,
                        permissionId: 25,
                      })
                    );
                  }
                }

                remainingQuantity -= quantityToConsume;

                if (remainingQuantity <= 0) break; // Stop iterating if all quantity consumed
              }
            }
          );

          await Promise.all(itemDetailsBatchData);

          // Check if all details were successful
          allDetailsBatchSuccessful = (await Promise.all(batchUpdates)).every(
            (response) => response.status === 200
          );

          allDetailsSuccessful = (await Promise.all(detailsPromises)).every(
            (response) => response.status === 201 || 200
          );

          const itemDetailsDeletedBatchData = itemIdsToBeDeleted.map(
            async (item) => {
              const batchUpdatePromises = item.batches.map(async (batch) => {
                const itemBatchUpdateData = {
                  batchId: batch.batchId,
                  itemMasterId: batch.itemMasterId,
                  costPrice: batch.costPrice,
                  sellingPrice: batch.sellingPrice,
                  status: batch.status,
                  companyId: batch.companyId,
                  createdBy: batch.createdBy,
                  createdUserId: batch.createdUserId,
                  tempQuantity: batch.tempQuantity,
                  locationId: batch.locationId,
                  expiryDate: batch.expiryDate,
                  permissionId: 1065,
                };

                const detailsBatchApiResponse = await put_item_batch_api(
                  batch.batchId,
                  batch.itemMasterId,
                  itemBatchUpdateData
                );

                return detailsBatchApiResponse;
              });

              // Wait for all batch update promises to resolve
              const batchResponses = await Promise.all(batchUpdatePromises);

              // Check if all batch updates were successful
              const allBatchUpdatesSuccessful = batchResponses.every(
                (detailsResponse) => detailsResponse.status === 200
              );

              return allBatchUpdatesSuccessful;
            }
          );

          const detailsDeleteBatchResponse = await Promise.all(
            itemDetailsDeletedBatchData
          );

          // Check if all batch updates for all items were successful
          allDetailsDeleteBatchSuccessful = detailsDeleteBatchResponse.every(
            (response) => response
          );

          // Define an array to store the salesInvoiceDetailIds to be deleted
          const salesInvoiceDetailIdsToBeDeleted = [];

          // Loop through each item in itemIdsToBeDeleted
          for (const itemIdToBeDeleted of itemIdsToBeDeleted) {
            const matchingSalesInvoiceDetails =
              salesInvoice.salesInvoiceDetails.filter(
                (detail) =>
                  detail.itemBatchItemMasterId ===
                  itemIdToBeDeleted.itemBatchItemMasterId
              );

            // If matching salesInvoiceDetails are found, add their salesInvoiceDetailIds to the array
            if (matchingSalesInvoiceDetails.length > 0) {
              matchingSalesInvoiceDetails.forEach((detail) => {
                salesInvoiceDetailIdsToBeDeleted.push(
                  detail.salesInvoiceDetailId
                );
              });
            }
          }

          for (const salesInvoiceDetailId of salesInvoiceDetailIdsToBeDeleted) {
            const response = await delete_sales_invoice_detail_api(
              salesInvoiceDetailId
            );
            console.log(
              `Successfully deleted item with ID: ${salesInvoiceDetailId}`
            );
          }

          // Clear the itemIdsToBeDeleted array after deletion
          setItemIdsToBeDeleted([]);
        } else {
          const itemDetailsBatchData = formData.itemDetails.map(
            async (item) => {
              const itemBatchUpdateData = {
                batchId: item.batch.batchId,
                itemMasterId: item.batch.itemMasterId,
                costPrice: item.batch.costPrice,
                sellingPrice: item.batch.sellingPrice,
                status: item.batch.status,
                companyId: item.batch.companyId,
                createdBy: item.batch.createdBy,
                createdUserId: item.batch.createdUserId,
                tempQuantity: item.tempQuantity - item.quantity,
                locationId: item.batch.locationId,
                expiryDate: item.batch.expiryDate,
                permissionId: 1065,
              };

              const detailsBatchApiResponse = await put_item_batch_api(
                item.batch.batchId,
                item.batch.itemMasterId,
                itemBatchUpdateData
              );

              return detailsBatchApiResponse;
            }
          );

          const detailsBatchResponse = await Promise.all(itemDetailsBatchData);

          allDetailsBatchSuccessful = detailsBatchResponse.every(
            (detailsResponse) => detailsResponse.status === 200
          );

          const itemDetailsData = formData.itemDetails.map(async (item) => {
            let detailsApiResponse;
            const detailsData = {
              itemBatchItemMasterId: item.itemMasterId,
              itemBatchBatchId: item.itemBatchId,
              salesInvoiceId: salesInvoice.salesInvoiceId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              permissionId: 25,
            };

            if (item.salesInvoiceDetailId != null) {
              // Call put_slaes_invoice_detail_api for each item
              detailsApiResponse = await put_sales_invoice_detail_api(
                item.salesInvoiceDetailId,
                detailsData
              );
            } else {
              // Call post_slaes_invoice_detail_api for each item
              detailsApiResponse = await post_sales_invoice_detail_api(
                detailsData
              );
            }

            return detailsApiResponse;
          });

          const detailsResponses = await Promise.all(itemDetailsData);

          allDetailsSuccessful = detailsResponses.every(
            (detailsResponse) => detailsResponse.status === 201 || 200
          );

          const itemDetailsDeletedBatchData = itemIdsToBeDeleted.map(
            async (item) => {
              const itemBatchUpdateData = {
                batchId: item.batch.batchId,
                itemMasterId: item.batch.itemMasterId,
                costPrice: item.batch.costPrice,
                sellingPrice: item.batch.sellingPrice,
                status: item.batch.status,
                companyId: item.batch.companyId,
                createdBy: item.batch.createdBy,
                createdUserId: item.batch.createdUserId,
                tempQuantity: item.tempQuantity,
                locationId: item.batch.locationId,
                expiryDate: item.batch.expiryDate,
                permissionId: 1065,
              };

              const detailsBatchApiResponse = await put_item_batch_api(
                item.batch.batchId,
                item.batch.itemMasterId,
                itemBatchUpdateData
              );

              return detailsBatchApiResponse;
            }
          );

          const detailsDeleteBatchResponse = await Promise.all(
            itemDetailsDeletedBatchData
          );

          allDetailsDeleteBatchSuccessful = detailsDeleteBatchResponse.every(
            (detailsResponse) => detailsResponse.status === 200
          );

          for (const itemIdToBeDeleted of itemIdsToBeDeleted) {
            const response = await delete_sales_invoice_detail_api(
              itemIdToBeDeleted.salesInvoiceDetailId
            );
            console.log(
              `Successfully deleted item with ID: ${itemIdToBeDeleted.salesInvoiceDetailId}`
            );
          }
          // Clear the itmeIdsToBeDeleted array after deletion
          setItemIdsToBeDeleted([]);
        }

        // // Extract itemDetails from formData
        // const itemDetailsData = formData.itemDetails.map(async (item) => {
        //   let detailsApiResponse;
        //   const detailsData = {
        //     salesInvoiceId: salesInvoice.salesInvoiceId,
        //     itemBatchItemMasterId: item.itemMasterId,
        //     itemBatchBatchId: item.itemBatchId,
        //     quantity: item.quantity,
        //     unitPrice: item.unitPrice,
        //     totalPrice: item.totalPrice,
        //     permissionId: 31,
        //   };

        //   if (item.salesInvoiceDetailId != null) {
        //     // Call put_sales_invoice_detail_api for each item
        //     detailsApiResponse = await put_sales_invoice_detail_api(
        //       item.salesInvoiceDetailId,
        //       detailsData
        //     );
        //   } else {
        //     // Call post_slaes_invocie_detail_api for each item
        //     detailsApiResponse = await post_sales_invoice_detail_api(
        //       detailsData
        //     );
        //   }
        //   return detailsApiResponse;
        // });

        // const detailsResponses = await Promise.all(itemDetailsData);

        // const allDetailsSuccessful = detailsResponses.every(
        //   (detailsResponse) => detailsResponse.status === 201 || 200
        // );

        // const itemDetailsBatchData = formData.itemDetails.map(async (item) => {
        //   const itemBatchUpdateData = {
        //     batchId: item.batch.batchId,
        //     itemMasterId: item.batch.itemMasterId,
        //     costPrice: item.batch.costPrice,
        //     sellingPrice: item.batch.sellingPrice,
        //     status: item.batch.status,
        //     companyId: item.batch.companyId,
        //     createdBy: item.batch.createdBy,
        //     createdUserId: item.batch.createdUserId,
        //     tempQuantity: item.tempQuantity - item.quantity,
        //     locationId: item.batch.locationId,
        //     expiryDate: item.batch.expiryDate,
        //     permissionId: 1065,
        //   };

        //   const detailsBatchApiResponse = await put_item_batch_api(
        //     item.batch.batchId,
        //     item.batch.itemMasterId,
        //     itemBatchUpdateData
        //   );

        //   return detailsBatchApiResponse;
        // });

        // const detailsBatchResponse = await Promise.all(itemDetailsBatchData);

        // const allDetailsBatchSuccessful = detailsBatchResponse.every(
        //   (detailsResponse) => detailsResponse.status === 200
        // );

        // const itemDetailsDeletedBatchData = itemIdsToBeDeleted.map(
        //   async (item) => {
        //     const itemBatchUpdateData = {
        //       batchId: item.batch.batchId,
        //       itemMasterId: item.batch.itemMasterId,
        //       costPrice: item.batch.costPrice,
        //       sellingPrice: item.batch.sellingPrice,
        //       status: item.batch.status,
        //       companyId: item.batch.companyId,
        //       createdBy: item.batch.createdBy,
        //       createdUserId: item.batch.createdUserId,
        //       tempQuantity: item.tempQuantity,
        //       locationId: item.batch.locationId,
        //       expiryDate: item.batch.expiryDate,
        //       permissionId: 1065,
        //     };

        //     const detailsBatchApiResponse = await put_item_batch_api(
        //       item.batch.batchId,
        //       item.batch.itemMasterId,
        //       itemBatchUpdateData
        //     );

        //     return detailsBatchApiResponse;
        //   }
        // );

        // const detailsDeleteBatchResponse = await Promise.all(
        //   itemDetailsDeletedBatchData
        // );

        // const allDetailsDeleteBatchSuccessful =
        //   detailsDeleteBatchResponse.every(
        //     (detailsResponse) => detailsResponse.status === 200
        //   );

        // for (const itemIdToBeDeleted of itemIdsToBeDeleted) {
        //   const response = await delete_sales_invoice_detail_api(
        //     itemIdToBeDeleted.salesInvoiceId
        //   );
        //   console.log(
        //     `Successfully deleted item with ID: ${itemIdToBeDeleted.salesInvoiceId}`
        //   );
        // }
        // // Clear the itmeIdsToBeDeleted array after deletion
        // setItemIdsToBeDeleted([]);

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
        // Clear the itmeIdsToBeDeleted array after deletion
        setChargesAndDeductionsAppliedIdsToBeDeleted([]);

        if (
          allDetailsSuccessful &&
          allAppliedSuccessful &&
          allDetailsBatchSuccessful &&
          allDetailsDeleteBatchSuccessful
        ) {
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
        updatedItemDetails[index].quantity *
        updatedItemDetails[index].unitPrice;

      let totalPrice =
        updatedItemDetails[index].quantity *
        updatedItemDetails[index].unitPrice;

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

    return totalAmount;
  };

  // Handler to add the selected item to itemDetails
  const handleSelectItem = (item) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemMasterId: item.itemMasterId,
      itemMaster: item,
    }));
    setSearchTerm(""); // Clear the search term

    setSelectedBatch(null);
    refetchItemBatches();
    setValidFields({});
    setValidationErrors({});

    if (company.batchStockType === "FIFO") {
    } else {
      openModal();
    }
  };

  const handleBatchSelection = (batchId) => {
    const selectedBatchId = batchId;
    const batch = itemBatches.find(
      (batch) => batch.batchId === parseInt(selectedBatchId, 10)
    );

    // Generate chargesAndDeductions array for the newly added item
    const initializedCharges = chargesAndDeductions
      .filter((charge) => charge.isApplicableForLineItem)
      .map((charge) => ({
        id: charge.chargesAndDeductionId,
        name: charge.displayName,
        value: charge.amount || charge.percentage,
        sign: charge.sign,
        isPercentage: charge.percentage !== null,
      }));

    // Ensure batch exists
    if (batch) {
      setSelectedBatch(batch);

      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: [
          ...prevFormData.itemDetails,
          {
            itemMasterId: batch.itemMasterId,
            itemBatchId: batch.batchId,
            name: formData.itemMaster.itemName,
            unit: formData.itemMaster.unit.unitName,
            batchRef: batch.batch.batchRef,
            quantity: 0,
            unitPrice: batch.sellingPrice,
            totalPrice: 0.0,
            chargesAndDeductions: initializedCharges,
            batch: batch,
            tempQuantity: batch.tempQuantity,
          },
        ],
      }));
    } else {
      setSelectedBatch(null);
    }
    closeModal();
  };

  const handleBatchSelectionFIFO = () => {
    const sortedBatches = itemBatches?.sort((a, b) => {
      return new Date(a.batch.date) - new Date(b.batch.date);
    });

    // Select the oldest batch
    const selectedBatch = sortedBatches[0];

    // Calculate total temporary quantity
    const totalTempQuantity = sortedBatches.reduce(
      (accumulator, currentBatch) => accumulator + currentBatch.tempQuantity,
      0
    );

    // Find the highest selling price among the batches
    const highestSellingPrice = sortedBatches.reduce(
      (maxPrice, currentBatch) =>
        currentBatch.sellingPrice > maxPrice
          ? currentBatch.sellingPrice
          : maxPrice,
      0
    );

    // Generate chargesAndDeductions array for the newly added item
    const initializedCharges = chargesAndDeductions
      .filter((charge) => charge.isApplicableForLineItem)
      .map((charge) => ({
        id: charge.chargesAndDeductionId,
        name: charge.displayName,
        value: charge.amount || charge.percentage,
        sign: charge.sign,
        isPercentage: charge.percentage !== null,
      }));

    setFormData((prevFormData) => ({
      ...prevFormData,
      itemDetails: [
        ...prevFormData.itemDetails,
        {
          itemMasterId: formData.itemMasterId,
          itemBatchId: null,
          name: formData.itemMaster.itemName,
          unit: formData.itemMaster.unit.unitName,
          batchRef: null,
          quantity: 0,
          unitPrice: highestSellingPrice,
          totalPrice: 0.0,
          chargesAndDeductions: initializedCharges,
          batches: sortedBatches,
          tempQuantity: totalTempQuantity,
        },
      ],
    }));
  };

  useEffect(() => {
    // Check if itemBatches is defined and not empty
    if (
      itemBatches &&
      itemBatches.length > 0 &&
      company.batchStockType === "FIFO"
    ) {
      handleBatchSelectionFIFO();
    }
  }, [itemBatches]);

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
    {
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
    }
  };

  // Function to open modal
  const openModal = () => {
    setShowModal(true);
  };

  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
  };

  return {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    isError,
    isLoading,
    error,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    selectedBatch,
    itemBatches,
    isLoadingchargesAndDeductions,
    ischargesAndDeductionsError,
    isLoadingTransactionTypes,
    isTransactionTypesError,
    transactionTypesError,
    loading,
    loadingDraft,
    isCompanyLoading,
    isCompanyError,
    showModal,
    company,
    itemIdsToBeDeleted,
    closeModal,
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    calculateTotalAmount,
    setSearchTerm,
    handleBatchSelection,
    handleSelectItem,
    renderColumns,
    calculateSubTotal,
    renderSubColumns,
  };
};

export default useSalesInvoiceUpdate;
