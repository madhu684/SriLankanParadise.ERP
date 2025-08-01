import { useState, useEffect, useRef } from "react";
import {
  get_customers_by_company_id_api,
  post_sales_order_api,
  post_sales_order_detail_api,
  get_company_api,
  get_sales_persons_by_company_id_api,
} from "../../services/salesApi";
import {
  get_item_batches_by_item_master_id_api,
  put_item_batch_api,
  get_charges_and_deductions_by_company_id_api,
  post_charges_and_deductions_applied_api,
  get_transaction_types_api,
  patch_location_inventory_api,
  post_location_inventory_movement_api,
  get_sum_location_inventories_by_locationId_itemMasterId_api,
  get_user_locations_by_user_id_api,
} from "../../services/purchaseApi";
import { get_item_masters_by_company_id_with_query_api } from "../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const useSalesOrder = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    itemMasterId: 0,
    itemMaster: "",
    customerId: "",
    orderDate: "",
    deliveryDate: "",
    itemDetails: [],
    status: 0,
    attachments: [],
    totalAmount: 0,
    subTotal: 0,
    selectedCustomer: "",
    customerId: "",
    salesPersonId: "",
    selectedSalesPerson: "",
    commonChargesAndDeductions: [],
    fifoBatchDetails: [],
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [referenceNo, setReferenceNo] = useState(null);
  const alertRef = useRef(null);
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [showCreateCustomerMoalInParent, setShowCreateCustomerModalInParent] =
    useState(false);
  const [directOrder, setDirectOrder] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [salesPersonSearchTerm, setSalesPersonSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [warehouseLocationId, setWarehouseLocationId] = useState(null);

  const fetchWarehouseLocation = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      const response = await get_user_locations_by_user_id_api(userId);
      const warehouseLocations = response.data.result.filter(
        (userLocation) => userLocation.location.locationTypeId === 2
      );

      if (warehouseLocations.length > 0) {
        const locationId = warehouseLocations[0].locationId;
        setWarehouseLocationId(locationId);
        return locationId;
      }

      return null;
    } catch (error) {
      console.error("Error fetching warehouse location:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchWarehouseLocation();
  }, []);

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
  const fetchLocationInventory = async (itemMasterId) => {
    try {
      let locationId = warehouseLocationId;

      // If warehouseLocationId is not set, fetch it first
      if (!locationId) {
        locationId = await fetchWarehouseLocation();
      }

      if (!locationId || !itemMasterId) return null;

      const response =
        await get_sum_location_inventories_by_locationId_itemMasterId_api(
          locationId,
          itemMasterId
        );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching location inventory:", error);
      return null;
    }
  };

  const {
    data: itemBatches,
    isLoading: isBatchesLoading,
    isError: isBatchesError,
    error: batchesError,
    refetch: refetchItemBatches,
  } = useQuery({
    queryKey: ["itemBatches", formData.itemMasterId],
    queryFn: () => fetchItemBatches(formData.itemMasterId),
  });

  const {
    data: locationInventory,
    isLoading,
    isError,
    error,
    refetch: refetchLocationInventory,
  } = useQuery({
    queryKey: ["locationInventory", formData.itemMasterId, warehouseLocationId], // Add warehouseLocationId
    queryFn: () => fetchLocationInventory(formData.itemMasterId),
    enabled: !!warehouseLocationId && !!formData.itemMasterId, // Only run when both are available
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

  const getTransactionTypeIdByName = (name) => {
    const transactionType = transactionTypes.find((type) => type.name === name);
    return transactionType ? transactionType.transactionTypeId : null;
  };

  const postChargesAndDeductionsApplied = async (transactionId) => {
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
      console.log("handleSubmit triggered");
      const customerId = directOrder ? null : formData.customerId;
      const status = isSaveAsDraft ? 0 : 1;
      const isFormValid = validateForm();
      const currentDate = new Date().toISOString();
      let allDetailsBatchSuccessful;
      let allDetailsSuccessful;

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
          createdDate: currentDate,
          lastUpdatedDate: currentDate,
          permissionId: 25,
          salesPersonId: formData.salesPersonId,
        };

        console.log("Sale order data", salesOrderData);
        const response = await post_sales_order_api(salesOrderData);
        setReferenceNo(response.data.result.referenceNo);

        const salesOrderId = response.data.result.salesOrderId;
        const locationId = warehouseLocationId;

        if (company.batchStockType === "FIFO") {
          const batchUpdates = [];
          const detailsPromises = [];
          const locationInventoryUpdates = [];
          const locationInventoryMovements = [];

          const itemDetailsBatchData = formData.itemDetails.map(
            async (item) => {
              let remainingQuantity = item.quantity;

              // Create a copy of fifoBatchDetails to track updates
              let updatedBatches = [...formData.fifoBatchDetails]
                .filter(
                  (batch) =>
                    batch.itemMasterId === item.itemMasterId &&
                    batch.tempQuantity > 0
                )
                .sort((a, b) => {
                  return (
                    new Date(a.batch?.date || a.createdDate) -
                    new Date(b.batch?.date || b.createdDate)
                  );
                });

              console.log(
                `Processing FIFO for item ${item.name}, total quantity needed: ${remainingQuantity}`
              );
              console.log(
                `Available batches for item ${item.itemMasterId}:`,
                updatedBatches
              );

              if (updatedBatches.length === 0) {
                console.error(`No batches available for item ${item.name}`);
                throw new Error(`No stock available for item ${item.name}`);
              }

              for (
                let i = 0;
                i < updatedBatches.length && remainingQuantity > 0;
                i++
              ) {
                const batch = updatedBatches[i];
                const availableQuantity = Math.max(0, batch.tempQuantity || 0);

                console.log(
                  `Batch ${batch.batchId}: Available quantity = ${availableQuantity}, Remaining needed = ${remainingQuantity}`
                );

                if (availableQuantity <= 0) {
                  console.log(
                    `Skipping batch ${batch.batchId} - no stock available`
                  );
                  continue;
                }

                const quantityToConsume = Math.min(
                  remainingQuantity,
                  availableQuantity
                );

                if (quantityToConsume > 0) {
                  const newTempQuantity = Math.max(
                    0,
                    availableQuantity - quantityToConsume
                  );

                  console.log(
                    `Consuming ${quantityToConsume} from batch ${batch.batchId}, new temp quantity will be: ${newTempQuantity}`
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
                    tempQuantity: newTempQuantity,
                    locationId: batch.locationId,
                    expiryDate: batch.expiryDate,
                    qty: batch.qty,
                    permissionId: 1065,
                  };

                  console.log("Item Batch Update Data", itemBatchUpdateData);
                  batchUpdates.push(
                    put_item_batch_api(
                      batch.batchId,
                      batch.itemMasterId,
                      itemBatchUpdateData
                    )
                  );

                  detailsPromises.push(
                    post_sales_order_detail_api({
                      itemBatchItemMasterId: batch.itemMasterId,
                      itemBatchBatchId: batch.batchId,
                      salesOrderId,
                      quantity: quantityToConsume,
                      unitPrice: item.unitPrice,
                      totalPrice:
                        (item.totalPrice / item.quantity) * quantityToConsume,
                      permissionId: 25,
                    })
                  );

                  locationInventoryUpdates.push(
                    patch_location_inventory_api(
                      locationId,
                      batch.itemMasterId,
                      batch.batchId,
                      "subtract",
                      {
                        stockInHand: quantityToConsume,
                        permissionId: 1089,
                      }
                    )
                  );

                  locationInventoryMovements.push(
                    post_location_inventory_movement_api({
                      movementTypeId: 2, // outgoing
                      transactionTypeId: 1, // sales order
                      itemMasterId: batch.itemMasterId,
                      batchId: batch.batchId,
                      locationId: locationId,
                      date: new Date().toISOString(),
                      qty: quantityToConsume,
                      permissionId: 1090,
                    })
                  );

                  remainingQuantity -= quantityToConsume;
                  console.log(
                    `Remaining quantity after consuming from batch ${batch.batchId}: ${remainingQuantity}`
                  );

                  // Update the batch in the local copy
                  updatedBatches = updatedBatches.map((b) =>
                    b.batchId === batch.batchId
                      ? { ...b, tempQuantity: newTempQuantity }
                      : b
                  );

                  // Sync with formData.fifoBatchDetails
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    fifoBatchDetails: prevFormData.fifoBatchDetails.map((b) =>
                      b.batchId === batch.batchId
                        ? { ...b, tempQuantity: newTempQuantity }
                        : b
                    ),
                  }));
                }
              }

              if (remainingQuantity > 0) {
                console.error(
                  `Could not fulfill ${remainingQuantity} units for item ${item.name} due to insufficient stock across all batches`
                );
                throw new Error(`Insufficient stock for item ${item.name}`);
              }
            }
          );

          await Promise.all(itemDetailsBatchData);

          allDetailsBatchSuccessful = (await Promise.all(batchUpdates)).every(
            (response) => response.status === 200
          );

          allDetailsSuccessful = (await Promise.all(detailsPromises)).every(
            (response) => response.status === 201
          );

          const allLocationUpdatesSuccessful = (
            await Promise.all(locationInventoryUpdates)
          ).every((response) => response.status === 200);

          const allLocationMovementsSuccessful = (
            await Promise.all(locationInventoryMovements)
          ).every((response) => response.status === 201);

          allDetailsSuccessful =
            allDetailsSuccessful &&
            allLocationUpdatesSuccessful &&
            allLocationMovementsSuccessful;
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
                tempQuantity: Math.max(
                  0,
                  item.batch.tempQuantity - item.quantity
                ),
                locationId: item.batch.locationId,
                expiryDate: item.batch.expiryDate,
                permissionId: 1065,
              };

              const detailsBatchApiResponse = await put_item_batch_api(
                item.batch.batchId,
                item.batch.itemMasterId,
                itemBatchUpdateData
              );

              const locationUpdateResponse = await patch_location_inventory_api(
                locationId,
                item.itemMasterId,
                item.batch.batchId,
                "subtract",
                {
                  stockInHand: item.quantity,
                  permissionId: 1089,
                }
              );

              const locationMovementResponse =
                await post_location_inventory_movement_api({
                  movementTypeId: 2, // outgoing
                  transactionTypeId: 1, // sales order
                  itemMasterId: item.itemMasterId,
                  batchId: item.batch.batchId,
                  locationId: locationId,
                  date: new Date().toISOString(),
                  qty: item.quantity,
                  permissionId: 1090,
                });

              return {
                detailsBatchApiResponse,
                locationUpdateResponse,
                locationMovementResponse,
              };
            }
          );

          const detailsBatchResponse = await Promise.all(itemDetailsBatchData);

          allDetailsBatchSuccessful = detailsBatchResponse.every(
            (response) => response.detailsBatchApiResponse.status === 200
          );

          const allLocationUpdatesSuccessful = detailsBatchResponse.every(
            (response) => response.locationUpdateResponse.status === 200
          );

          const allLocationMovementsSuccessful = detailsBatchResponse.every(
            (response) => response.locationMovementResponse.status === 201
          );

          const itemDetailsData = formData.itemDetails.map(async (item) => {
            const detailsData = {
              itemBatchItemMasterId: item.itemMasterId,
              itemBatchBatchId: item.itemBatchId,
              salesOrderId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              permissionId: 25,
            };

            const detailsApiResponse = await post_sales_order_detail_api(
              detailsData
            );

            return detailsApiResponse;
          });

          const detailsResponses = await Promise.all(itemDetailsData);

          allDetailsSuccessful =
            detailsResponses.every(
              (detailsResponse) => detailsResponse.status === 201
            ) &&
            allLocationUpdatesSuccessful &&
            allLocationMovementsSuccessful;
        }

        const postChargesAndDeductionsAppliedResponse =
          await postChargesAndDeductionsApplied(salesOrderId);

        const allAppliedSuccessful =
          postChargesAndDeductionsAppliedResponse.every(
            (detailsResponse) => detailsResponse.status === 201
          );

        if (
          allDetailsSuccessful &&
          allAppliedSuccessful &&
          allDetailsBatchSuccessful
        ) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Sales order saved as draft!", formData);
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
    handleSelectCustomer(responseData);
    refetchCustomers();
  };

  // Handler to add the selected item to itemDetails
  const handleSelectItem = async (item) => {
    // Only set the current item selection, don't clear itemDetails
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemMasterId: item.itemMasterId,
      itemMaster: item,
      // Remove these lines that were clearing the arrays:
      // itemDetails: [], // Don't clear previous items
      // fifoBatchDetails: [], // Don't clear previous batch details
    }));

    setSearchTerm("");
    setSelectedBatch(null);
    // Don't clear validation when adding new items
    // setValidFields({});
    // setValidationErrors({});

    if (company?.batchStockType === "FIFO") {
      // Fetch batch details for FIFO processing
      try {
        const batchResponse = await get_item_batches_by_item_master_id_api(
          item.itemMasterId,
          sessionStorage.getItem("companyId")
        );

        // Store batch details for FIFO processing during submission
        setFormData((prev) => ({
          ...prev,
          fifoBatchDetails: batchResponse.data.result,
        }));

        // Trigger location inventory refetch
        refetchLocationInventory();
      } catch (error) {
        console.error("Error fetching batch details for FIFO:", error);
      }
    } else {
      openModal();
    }
  };

  const handleBatchSelection = (batchId) => {
    const selectedBatchId = parseInt(batchId, 10);

    if (!formData.fifoBatchDetails || formData.fifoBatchDetails.length === 0) {
      console.error("No batch details available");
      return;
    }

    const batch = formData.fifoBatchDetails.find(
      (batch) => batch.batchId === selectedBatchId
    );

    if (!batch) {
      console.error("Batch not found");
      return;
    }

    // Generate chargesAndDeductions array for the newly added item
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

    setSelectedBatch(batch);

    setFormData((prevFormData) => ({
      ...prevFormData,
      itemDetails: [
        ...prevFormData.itemDetails,
        {
          itemMasterId: batch.itemMasterId,
          itemBatchId: batch.batchId,
          name: formData.itemMaster?.itemName || "",
          unit: formData.itemMaster?.unit?.unitName || "",
          batchRef: batch.batch?.batchRef || "",
          quantity: 0,
          unitPrice: batch.sellingPrice,
          totalPrice: 0.0,
          chargesAndDeductions: initializedCharges,
          batch: batch,
          tempQuantity: batch.tempQuantity,
        },
      ],
    }));

    closeModal();
  };

  const handleBatchSelectionFIFO = () => {
    if (
      !locationInventory ||
      !formData.fifoBatchDetails ||
      !chargesAndDeductions ||
      !formData.itemMasterId
    )
      return;

    const sortedBatches = formData.fifoBatchDetails?.sort((a, b) => {
      return new Date(a.batch.date) - new Date(b.batch.date);
    });

    const totalTempQuantity = locationInventory.totalStockInHand;

    if (totalTempQuantity <= 0) {
      console.warn("No stock available for this item");
      return;
    }

    const highestSellingPrice = sortedBatches.reduce(
      (maxPrice, currentBatch) =>
        currentBatch.sellingPrice > maxPrice
          ? currentBatch.sellingPrice
          : maxPrice,
      0
    );

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
          name: formData.itemMaster?.itemName || "",
          unit: formData.itemMaster?.unit?.unitName || "",
          batchRef: null,
          quantity: 0,
          unitPrice: highestSellingPrice,
          totalPrice: 0.0,
          chargesAndDeductions: initializedCharges,
          batch: sortedBatches,
          tempQuantity: totalTempQuantity,
        },
      ],
    }));
  };

  useEffect(() => {
    if (
      locationInventory &&
      locationInventory.totalStockInHand > 0 &&
      formData.fifoBatchDetails &&
      formData.fifoBatchDetails.length > 0 &&
      company?.batchStockType === "FIFO" &&
      warehouseLocationId &&
      chargesAndDeductions &&
      formData.itemMasterId
      // Remove this condition: formData.itemDetails.length === 0
    ) {
      handleBatchSelectionFIFO();
    }
  }, [
    locationInventory,
    formData.fifoBatchDetails,
    warehouseLocationId,
    company,
    chargesAndDeductions,
    formData.itemMasterId,
  ]);

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

    setCustomerSearchTerm(""); // Clear the supplier search term
    setValidFields({});
    setValidationErrors({});
  };

  const handleSelectSalesPerson = (selectedSalesPerson) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      salesPersonId: selectedSalesPerson.userId,
      selectedSalesPerson: selectedSalesPerson,
    }));

    setSalesPersonSearchTerm(""); // Clear the supplier search term
    setValidFields({});
    setValidationErrors({});
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
      if (!charge.isApplicableForLineItem) {
        // Initialize additional properties for the common on charges and deductions
        acc[charge.displayName] = charge.amount || charge.percentage;
      }
      return acc;
    }, {});

    // Generate chargesAndDeductions array for the newly added item
    const initializedChargesArray = chargesAndDeductions
      .filter((charge) => !charge.isApplicableForLineItem)
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

  console.log("formData", formData);

  return {
    formData,
    customers,
    salesPersons,
    submissionStatus,
    validFields,
    validationErrors,
    referenceNo,
    alertRef,
    showCreateCustomerModal,
    showCreateCustomerMoalInParent,
    directOrder,
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
    locationInventory,
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
    chargesAndDeductionsError,
    chargesAndDeductions,
    isLoadingTransactionTypes,
    isTransactionTypesError,
    transactionTypesError,
    loading,
    loadingDraft,
    isCompanyLoading,
    isCompanyError,
    showModal,
    company,
    closeModal,
    handleShowCreateCustomerModal,
    handleCloseCreateCustomerModal,
    handleInputChange,
    handleCustomerChange,
    handleItemDetailsChange,
    handleAttachmentChange,
    handleSubmit,
    handleRemoveItem,
    handlePrint,
    calculateTotalAmount,
    handleAddCustomer,
    setDirectOrder,
    setSearchTerm,
    handleSelectItem,
    handleBatchSelection,
    handleSelectCustomer,
    handleSelectSalesPerson,
    handleResetCustomer,
    handleResetSalesPerson,
    setCustomerSearchTerm,
    setSalesPersonSearchTerm,
    calculateSubTotal,
    renderColumns,
    renderSubColumns,
    warehouseLocationId,
    isWarehouseLocationLoading: !warehouseLocationId,
  };
};

export default useSalesOrder;
