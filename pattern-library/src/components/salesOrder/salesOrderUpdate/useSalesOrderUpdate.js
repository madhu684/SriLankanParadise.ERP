import { useState, useEffect, useRef } from "react";
import {
  get_customers_by_company_id_api,
  put_sales_order_api,
  put_sales_order_detail_api,
  post_sales_order_detail_api,
  delete_sales_order_detail_api,
  get_company_api,
  get_sales_persons_by_company_id_api,
  get_sales_persons_by_user_id_api,
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
  get_sum_location_inventories_by_locationId_itemMasterId_api,
} from "../../../services/purchaseApi";
import { get_item_masters_by_company_id_with_query_api } from "../../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const useSalesOrderUpdate = ({ salesOrder, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    customerId: "",
    orderDate: "",
    deliveryDate: "",
    itemDetails: [],
    status: 0,
    attachments: [],
    totalAmount: 0,
    subTotal: 0,
    selectedCustomer: "",
    salesPersonId: "",
    selectedSalesPerson: "",
    commonChargesAndDeductions: [],
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [itemIdsToBeDeleted, setItemIdsToBeDeleted] = useState([]);
  const alertRef = useRef(null);
  const [directOrder, setDirectOrder] = useState(false);
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [showCreateCustomerMoalInParent, setShowCreateCustomerModalInParent] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [salesPersonSearchTerm, setSalesPersonSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [
    chargesAndDeductionsAppliedIdsToBeDeleted,
    setChargesAndDeductionsAppliedIdsToBeDeleted,
  ] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // const fetchItemBatches = async (itemMasterId) => {
  //   try {
  //     const response = await get_item_batches_by_item_master_id_api(
  //       itemMasterId,
  //       sessionStorage.getItem("companyId")
  //     );
  //     return response.data.result;
  //   } catch (error) {
  //     console.error("Error fetching item batches:", error);
  //   }
  // };

  // const {
  //   data: itemBatches,
  //   isLoading,
  //   isError,
  //   error,
  //   refetch: refetchItemBatches,
  // } = useQuery({
  //   queryKey: ["itemBatches", formData.itemMasterId],
  //   queryFn: () => fetchItemBatches(formData.itemMasterId),
  // });

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
      fetchItems(sessionStorage.getItem("companyId"), searchTerm, "All"), //Sellable
  });

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  const fetchCustomers = async () => {
    try {
      const response = await get_customers_by_company_id_api(
        sessionStorage?.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const {
    data: customers,
    isLoading: isCustomersLoading,
    isError: isCustomersError,
    error: customersError,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  const fetchSalesPersons = async () => {
    try {
      const response = await get_sales_persons_by_company_id_api(
        sessionStorage?.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching sales persons:", error);
    }
  };

  const {
    data: salesPersons,
    isLoading: isSalesPersonsLoading,
    isError: isSalesPersonsError,
    error: salesPersonsError,
  } = useQuery({
    queryKey: ["salesPersons"],
    queryFn: fetchSalesPersons,
  });

  const fetchSalesPersonByUserId = async () => {
    try {
      const response = await get_sales_persons_by_user_id_api(
        salesOrder.salesPersonId
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching sales person by user id:", error);
    }
  };

  const {
    data: salesPersonDetails,
    isLoading: isSalesPersonDetailsLoading,
    isError: isSalesPersonDetailsError,
    error: salesPersonDetailsError,
  } = useQuery({
    queryKey: ["salesPersonsByUserId"],
    queryFn: fetchSalesPersonByUserId,
  });

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
        salesOrder.salesOrderId,
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
    queryKey: ["chargesAndDeductionsApplied", salesOrder.salesOrderId],
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

  useEffect(() => {
    if (
      !isChargesAndDeductionsAppliedLoading &&
      chargesAndDeductionsApplied &&
      !isLoadingchargesAndDeductions &&
      chargesAndDeductions &&
      !isCompanyLoading &&
      company
    ) {
      const fetchData = async () => {
        const deepCopySalesOrder = JSON.parse(JSON.stringify(salesOrder));
        let salesOrderDetails = salesOrder.salesOrderDetails;

        // Fetch inventory data for all items in parallel
        const inventoryPromises = salesOrderDetails.map((item) =>
          get_sum_location_inventories_by_locationId_itemMasterId_api(
            item.itemBatchItemMasterId,
            salesOrder.inventoryLocationId
          )
        );
        const inventoryResults = await Promise.all(inventoryPromises);

        // Initialize line item charges and deductions
        const initializedLineItemCharges = salesOrderDetails.map(
          (item, index) => {
            const inventory = inventoryResults[index];
            const availableStock =
              inventory?.data?.result?.totalStockInHand || 0;

            const initializedCharges = chargesAndDeductionsApplied
              ?.filter(
                (charge) => charge.lineItemId === item.itemBatch.itemMasterId
              )
              .map((charge) => {
                let value;
                if (charge.chargesAndDeduction.percentage) {
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
              .filter((charge) => charge.isApplicableForLineItem)
              .map((charge) => {
                const displayName = charge.displayName;
                const matchedCharge = initializedCharges.find(
                  (c) => c.name === displayName
                );
                return matchedCharge || null;
              });

            return {
              salesOrderDetailId: item.salesOrderDetailId,
              itemMasterId: item.itemBatchItemMasterId,
              name: item.itemBatch.itemMaster.itemName,
              unit: item.itemBatch.itemMaster.unit.unitName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              chargesAndDeductions: sortedLineItemCharges,
              batchId: item.itemBatchBatchId,
              tempQuantity: availableStock,
            };
          }
        );

        const subTotal = deepCopySalesOrder.salesOrderDetails.reduce(
          (total, item) => total + item.totalPrice,
          0
        );

        const initializedCommonCharges = chargesAndDeductionsApplied
          ?.filter((charge) => !charge.lineItemId)
          .map((charge) => {
            let value;
            if (charge.chargesAndDeduction.percentage) {
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
          salesOrderId: deepCopySalesOrder?.salesOrderId ?? "",
          customerId: deepCopySalesOrder?.customerId ?? "",
          salesPersonId: deepCopySalesOrder?.salesPersonId ?? "",
          orderDate: deepCopySalesOrder?.orderDate?.split("T")[0] ?? "",
          deliveryDate: deepCopySalesOrder?.deliveryDate?.split("T")[0] ?? "",
          itemDetails: initializedLineItemCharges,
          attachments: deepCopySalesOrder?.attachments ?? [],
          totalAmount: deepCopySalesOrder?.totalAmount ?? "",
          selectedCustomer: deepCopySalesOrder?.customer ?? "",
          selectedSalesPerson: salesPersonDetails,
          itemMasterId: deepCopySalesOrder?.itemMasterId ?? "",
          itemMaster: deepCopySalesOrder?.itemMaster ?? "",
          subTotal: deepCopySalesOrder?.totalAmount ?? "",
          commonChargesAndDeductions: initializedCommonCharges,
        });
      };

      fetchData();
    }
  }, [
    salesOrder,
    isChargesAndDeductionsAppliedLoading,
    chargesAndDeductionsApplied,
    isLoadingchargesAndDeductions,
    chargesAndDeductions,
    isCompanyLoading,
    company,
  ]);

  const getTransactionTypeIdByName = (name) => {
    const transactionType = transactionTypes.find((type) => type.name === name);
    return transactionType ? transactionType.transactionTypeId : null;
  };

  const updateChargesAndDeductionsApplied = async (transactionId) => {
    try {
      const transactionTypeId = getTransactionTypeIdByName("SaleOrder");

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
    let isCustomerValid = true;

    // Check customer validation only if it's not a direct order
    if (!directOrder) {
      isCustomerValid = validateField(
        "customerId",
        "Customer",
        formData.customerId
      );
    }

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

    const isAttachmentsValid = validateAttachments(formData.attachments);

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

    return (
      isCustomerValid &&
      isSalesPersonValid &&
      isOrderDateValid &&
      isDeliveryDateValid &&
      isAttachmentsValid &&
      isItemQuantityValid
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const customerId = directOrder ? null : formData.customerId;
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

        const salesOrderData = {
          customerId: customerId,
          orderDate: formData.orderDate,
          deliveryDate: formData.deliveryDate,
          totalAmount: formData.totalAmount,
          status: status,
          createdBy: sessionStorage?.getItem("username") ?? null,
          createdUserId: sessionStorage?.getItem("userId") ?? null,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          companyId: sessionStorage?.getItem("companyId") ?? null,
          createdDate: salesOrder.createdDate,
          lastUpdatedDate: currentDate,
          permissionId: 27,
          salesPersonId: formData.salesPersonId,
        };

        console.log("Sales order data", salesOrderData);
        const response = await put_sales_order_api(
          salesOrder.salesOrderId,
          salesOrderData
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
                  if (item.salesOrderDetailId != null) {
                    detailsPromises.push(
                      put_sales_order_detail_api(item.salesOrderDetailId, {
                        itemBatchItemMasterId: batch.itemMasterId,
                        itemBatchBatchId: batch.batchId,
                        salesOrderId: salesOrder.salesOrderId,
                        quantity: quantityToConsume,
                        unitPrice: item.unitPrice,
                        totalPrice:
                          (item.totalPrice / item.quantity) * quantityToConsume,
                        permissionId: 25,
                      })
                    );
                  } else {
                    detailsPromises.push(
                      post_sales_order_detail_api({
                        itemBatchItemMasterId: batch.itemMasterId,
                        itemBatchBatchId: batch.batchId,
                        salesOrderId: salesOrder.salesOrderId,
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

          // Define an array to store the salesOrderDetailIds to be deleted
          const salesOrderDetailIdsToBeDeleted = [];

          // Loop through each item in itemIdsToBeDeleted
          for (const itemIdToBeDeleted of itemIdsToBeDeleted) {
            const matchingSalesOrderDetails =
              salesOrder.salesOrderDetails.filter(
                (detail) =>
                  detail.itemBatchItemMasterId ===
                  itemIdToBeDeleted.itemBatchItemMasterId
              );

            // If matching salesOrderDetails are found, add their salesOrderDetailIds to the array
            if (matchingSalesOrderDetails.length > 0) {
              matchingSalesOrderDetails.forEach((detail) => {
                salesOrderDetailIdsToBeDeleted.push(detail.salesOrderDetailId);
              });
            }
          }

          for (const salesOrderDetailId of salesOrderDetailIdsToBeDeleted) {
            const response = await delete_sales_order_detail_api(
              salesOrderDetailId
            );
            console.log(
              `Successfully deleted item with ID: ${salesOrderDetailId}`
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
              salesOrderId: salesOrder.salesOrderId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              permissionId: 25,
            };

            if (item.salesOrderDetailId != null) {
              // Call put_slaes_Order_detail_api for each item
              detailsApiResponse = await put_sales_order_detail_api(
                item.salesOrderDetailId,
                detailsData
              );
            } else {
              // Call post_slaes_Order_detail_api for each item
              detailsApiResponse = await post_sales_order_detail_api(
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
            const response = await delete_sales_order_detail_api(
              itemIdToBeDeleted.salesOrderDetailId
            );
            console.log(
              `Successfully deleted item with ID: ${itemIdToBeDeleted.salesOrderDetailId}`
            );
          }
          // Clear the itmeIdsToBeDeleted array after deletion
          setItemIdsToBeDeleted([]);
        }

        const updateChargesAndDeductionsAppliedResponse =
          await updateChargesAndDeductionsApplied(salesOrder.salesOrderId);

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
            console.log("Sales order updated and saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Sales order submitted successfully!", formData);
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

  const handleCustomerChange = (customerId) => {
    const selectedCustomerId = parseInt(customerId, 10);

    const selectedCustomer = customers.find(
      (customer) => customer.customerId === selectedCustomerId
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      customerId,
      selectedCustomer,
    }));
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
          name: "",
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
      item.salesOrderDetailId !== null &&
      item.salesOrderDetailId !== undefined
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

  const handleShowCreateCustomerModal = () => {
    setShowCreateCustomerModal(true);
    setShowCreateCustomerModalInParent(true);
  };

  const handleCloseCreateCustomerModal = () => {
    setShowCreateCustomerModal(false);
    handleCloseCreateCustomerModalInParent();
  };

  const handleCloseCreateCustomerModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowCreateCustomerModalInParent(false);
    }, delay);
  };

  const handleAddCustomer = (responseData) => {
    // setCustomers([...customers, responseData]);

    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedCustomer: responseData,
      customerId: responseData.customerId,
    }));
  };

  const handleResetCustomer = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedCustomer: "",
      customerId: "",
    }));
  };

  const handleResetSalesPerson = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedSalesPerson: "",
      salesPersonId: "",
    }));
  };

  const handleSelectCustomer = (selectedCustomer) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      customerId: selectedCustomer.customerId,
      selectedCustomer: selectedCustomer,
    }));

    setCustomerSearchTerm("");
    setValidFields({});
    setValidationErrors({});
  };

  const handleSelectSalesPerson = (selectedSalesPerson) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      salesPersonId: selectedSalesPerson.userId,
      selectedSalesPerson: selectedSalesPerson,
    }));

    setSalesPersonSearchTerm("");
    setValidFields({});
    setValidationErrors({});
  };

  // Handler to add the selected item to itemDetails
  const handleSelectItem = async (item) => {
    setSearchTerm("");

    // setSelectedBatch(null);
    // setValidFields({});
    // setValidationErrors({});

    if (company.batchStockType === "FIFO") {
      // For FIFO, directly add the item without batch selection
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

      // Get available stock for this item
      try {
        const inventory =
          await get_sum_location_inventories_by_locationId_itemMasterId_api(
            item.itemMasterId,
            salesOrder.inventoryLocationId
          );
        const availableStock = inventory?.data?.result?.totalStockInHand || 0;

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
        const highestSellingPrice =
          batchesResponse?.data?.result?.reduce(
            (maxPrice, batch) =>
              batch.sellingPrice > maxPrice ? batch.sellingPrice : maxPrice,
            0
          ) || 0;

        setFormData((prevFormData) => ({
          ...prevFormData,
          itemDetails: [
            ...prevFormData.itemDetails,
            {
              salesOrderDetailId: null,
              itemMasterId: item.itemMasterId,
              name: item.itemName || "",
              unit: item.unit?.unitName || "",
              quantity: 0,
              unitPrice: highestSellingPrice,
              totalPrice: 0.0,
              chargesAndDeductions: initializedCharges,
              batchId: batchesResponse?.data?.result[0]?.batchId,
              tempQuantity: availableStock,
            },
          ],
        }));
      } catch (error) {
        console.error("Error processing FIFO item:", error);
        alert("Error processing item. Please try again.");
      }
    } else {
      openModal();
    }
  };

  // const handleBatchSelection = (batchId) => {
  //   const selectedBatchId = batchId;
  //   console.log(selectedBatchId);
  //   const batch = itemBatches.find(
  //     (batch) => batch.batchId === parseInt(selectedBatchId, 10)
  //   );

  //   // Generate chargesAndDeductions array for the newly added item
  //   const initializedCharges = chargesAndDeductions
  //     .filter((charge) => charge.isApplicableForLineItem)
  //     .map((charge) => ({
  //       id: charge.chargesAndDeductionId,
  //       name: charge.displayName,
  //       value: charge.amount || charge.percentage,
  //       sign: charge.sign,
  //       isPercentage: charge.percentage !== null,
  //     }));

  //   // Ensure batch exists
  //   if (batch) {
  //     setSelectedBatch(batch);

  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       itemDetails: [
  //         ...prevFormData.itemDetails,
  //         {
  //           itemMasterId: batch.itemMasterId,
  //           itemBatchId: batch.batchId,
  //           name: formData.itemMaster.itemName,
  //           unit: formData.itemMaster.unit.unitName,
  //           batchRef: batch.batch.batchRef,
  //           quantity: 0,
  //           unitPrice: batch.sellingPrice,
  //           totalPrice: 0.0,
  //           chargesAndDeductions: initializedCharges,
  //           batch: batch,
  //           tempQuantity: batch.tempQuantity,
  //         },
  //       ],
  //     }));
  //   } else {
  //     setSelectedBatch(null);
  //   }
  //   closeModal();
  // };

  // const handleBatchSelectionFIFO = () => {
  //   const sortedBatches = itemBatches?.sort((a, b) => {
  //     return new Date(a.batch.date) - new Date(b.batch.date);
  //   });

  //   // Select the oldest batch
  //   const selectedBatch = sortedBatches[0];

  //   // Calculate total temporary quantity
  //   const totalTempQuantity = sortedBatches.reduce(
  //     (accumulator, currentBatch) => accumulator + currentBatch.tempQuantity,
  //     0
  //   );

  //   // Find the highest selling price among the batches
  //   const highestSellingPrice = sortedBatches.reduce(
  //     (maxPrice, currentBatch) =>
  //       currentBatch.sellingPrice > maxPrice
  //         ? currentBatch.sellingPrice
  //         : maxPrice,
  //     0
  //   );

  //   // Generate chargesAndDeductions array for the newly added item
  //   const initializedCharges = chargesAndDeductions
  //     .filter((charge) => charge.isApplicableForLineItem)
  //     .map((charge) => ({
  //       id: charge.chargesAndDeductionId,
  //       name: charge.displayName,
  //       value: charge.amount || charge.percentage,
  //       sign: charge.sign,
  //       isPercentage: charge.percentage !== null,
  //     }));

  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     itemDetails: [
  //       ...prevFormData.itemDetails,
  //       {
  //         itemMasterId: formData.itemMasterId,
  //         itemBatchId: null,
  //         name: formData.itemMaster.itemName,
  //         unit: formData.itemMaster.unit.unitName,
  //         batchRef: null,
  //         quantity: 0,
  //         unitPrice: highestSellingPrice,
  //         totalPrice: 0.0,
  //         chargesAndDeductions: initializedCharges,
  //         batches: sortedBatches,
  //         tempQuantity: totalTempQuantity,
  //       },
  //     ],
  //   }));
  // };

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

  // Function to open modal
  const openModal = () => {
    setShowModal(true);
  };

  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
  };

  console.log("formData", formData);

  return {
    formData,
    customers,
    salesPersons,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    showCreateCustomerModal,
    showCreateCustomerMoalInParent,
    directOrder,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    selectedBatch,
    //itemBatches,
    customerSearchTerm,
    salesPersonSearchTerm,
    isCustomersLoading,
    isSalesPersonsLoading,
    isCustomersError,
    isSalesPersonsError,
    customersError,
    salesPersonsError,
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
    handleShowCreateCustomerModal,
    handleCloseCreateCustomerModal,
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    calculateTotalAmount,
    handleCustomerChange,
    handleAddCustomer,
    setDirectOrder,
    setCustomerSearchTerm,
    setSalesPersonSearchTerm,
    setSearchTerm,
    handleSelectCustomer,
    handleSelectSalesPerson,
    handleResetCustomer,
    handleResetSalesPerson,
    //handleBatchSelection,
    handleSelectItem,
    renderColumns,
    calculateSubTotal,
    renderSubColumns,
  };
};

export default useSalesOrderUpdate;
