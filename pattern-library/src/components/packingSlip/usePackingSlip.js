import { useEffect, useRef, useState } from "react";
import {
  get_user_locations_by_user_id_api,
  get_item_batches_by_item_master_id_api,
  get_charges_and_deductions_by_company_id_api,
  put_item_batch_api,
  get_transaction_types_api,
  post_charges_and_deductions_applied_api,
} from "../../services/purchaseApi";
import { useQuery } from "@tanstack/react-query";
import { get_item_masters_by_company_id_with_query_api } from "../../services/inventoryApi";
import {
  get_company_api,
  get_all_customers_api,
  post_packing_slip_api,
  post_packing_slip_detail_api,
} from "../../services/salesApi";

const usePackingSlip = ({ onFormSubmit, handleRefetchSlip }) => {
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const alertRef = useRef(null);
  const [referenceNo, setReferenceNo] = useState(null);
  const [searchByBatch, setSearchByBatch] = useState(false);
  const [searchByBarcode, setSearchByBarcode] = useState(true);

  const [formData, setFormData] = useState({
    itemMasterId: 0,
    itemMaster: "",
    customerId: "",
    packingSlipDate: "",
    selectedCustomer: "",
    invoiceReferenceNumber: "",
    storeLocation: "",
    status: 0,
    itemDetails: [],
    commonChargesAndDeductions: [],
    attachments: [],
    totalAmount: 0,
    subTotal: 0,
  });

  const fetchCustomers = async () => {
    try {
      const response = await get_all_customers_api();
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

  const fetchUserLocations = async () => {
    try {
      const response = await get_user_locations_by_user_id_api(
        sessionStorage.getItem("userId")
      );
      return response.data.result;
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
        false
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
    queryFn: () => fetchItems(sessionStorage.getItem("companyId"), searchTerm),
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

  useEffect(() => {
    if (submissionStatus != null) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

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
    const isPackingSlipDateValid = validateField(
      "packingSlipDate",
      "Packing Slip Date",
      formData.packingSlipDate
    );

    const isInvoiceReferenceNumberValid = validateField(
      "invoiceReferenceNumber",
      "Invoice Reference Number",
      formData.invoiceReferenceNumber
    );

    const isStoreLocationValid = validateField(
      "storeLocation",
      "Store Location",
      formData.storeLocation
    );

    const isCustomerValid = validateField(
      "customerId",
      "Customer Id",
      formData.customerId
    );

    const isAttachmentsValid = validateAttachments(formData.attachments);

    console.log("isPackingSlipDateValid", isPackingSlipDateValid);
    console.log("isInvoiceReferenceNumberValid", isInvoiceReferenceNumberValid);
    console.log("isStoreLocationValid", isStoreLocationValid);
    console.log("isCustomerValid", isCustomerValid);
    console.log("isAttachmentsValid", isAttachmentsValid);
    return (
      isPackingSlipDateValid &&
      isInvoiceReferenceNumberValid &&
      isStoreLocationValid &&
      isCustomerValid &&
      isAttachmentsValid
    );
  };

  const getTransactionTypeIdByName = (name) => {
    const transactionType = transactionTypes.find((type) => type.name === name);
    return transactionType ? transactionType.transactionTypeId : null;
  };

  const postChargesAndDeductionsApplied = async (transactionId) => {
    try {
      const transactionTypeId = getTransactionTypeIdByName("PackingSlip");

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
      const customerId = formData.customerId;
      const status = isSaveAsDraft ? 0 : 1;
      const isFormValid = validateForm();
      const currentDate = new Date().toISOString();
      let allDetailsBatchSuccessful;
      let allDetailsSuccessful;

      console.log("Is form valid", isFormValid);
      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const packingSlipData = {
          customerId: customerId,
          packingSlipDate: formData.packingSlipDate,
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
          invoiceReferenceNumber: formData.invoiceReferenceNumber,
          locationId: formData.storeLocation,
          permissionId: 1085,
        };

        console.log("Packing slip data", packingSlipData);
        const response = await post_packing_slip_api(packingSlipData);
        console.log("Packing slip create resposnse", response);
        setReferenceNo(response.data.result.referenceNo);
        console.log("Packing slip reference no : ", referenceNo);

        const packingSlipId = response.data.result.packingSlipId;

        if (company.batchStockType === "FIFO") {
          const batchUpdates = [];
          const detailsPromises = [];

          const itemDetailsBatchData = formData.itemDetails.map(
            async (item) => {
              let remainingQuantity = item.quantity;

              for (const batch of item.batch) {
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

                if (quantityToConsume > 0) {
                  detailsPromises.push(
                    post_packing_slip_detail_api({
                      itemBatchItemMasterId: batch.itemMasterId,
                      itemBatchBatchId: batch.batchId,
                      packingSlipId,
                      quantity: quantityToConsume,
                      unitPrice: item.unitPrice,
                      totalPrice:
                        (item.totalPrice / item.quantity) * quantityToConsume,
                      permissionId: 25,
                    })
                  );
                }

                remainingQuantity -= quantityToConsume;

                if (remainingQuantity <= 0) break;
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
        } else {
          console.log(formData.itemDetails);
          const itemDetailsBatchData = formData.itemDetails.map(
            async (item) => {
              const itemBatchUpdateData = {
                batchId: item.batch.batchId,
                itemMasterId: item.batch.itemMasterId,
                costPrice: item.batch.itemBatch.costPrice,
                sellingPrice: item.batch.itemBatch.sellingPrice,
                status: item.batch.itemBatch.status,
                companyId: item.batch.itemBatch.companyId,
                createdBy: item.batch.itemBatch.createdBy,
                createdUserId: item.batch.itemBatch.createdUserId,
                tempQuantity: item.batch.itemBatch.tempQuantity - item.quantity,
                locationId: item.batch.itemBatch.locationId,
                expiryDate: item.batch.itemBatch.expiryDate,
                qty: item.batch.itemBatch.qty,
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
            const detailsData = {
              itemBatchItemMasterId: item.itemMasterId,
              itemBatchBatchId: item.itemBatchId,
              packingSlipId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              permissionId: 25,
            };

            const detailsApiResponse = await post_packing_slip_detail_api(
              detailsData
            );

            return detailsApiResponse;
          });

          const detailsResponses = await Promise.all(itemDetailsData);

          allDetailsSuccessful = detailsResponses.every(
            (detailsResponse) => detailsResponse.status === 201
          );
        }

        const postChargesAndDeductionsAppliedResponse =
          await postChargesAndDeductionsApplied(packingSlipId);

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
            console.log("Packing Slip saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Packing Slip submitted successfully!", formData);
          }
          handleRefetchSlip(true);
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

  const handleAttachmentChange = (files) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      attachments: files,
    }));
  };

  //Add the selected item to item details
  const handleSelectItem = (item) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemMasterId: item.itemMasterId,
      itemMaster: item,
    }));
    setSearchTerm("");

    setSelectedBatch(null);
    refetchItemBatches();
    setValidFields({});
    setValidationErrors({});

    if (company.batchStockType === "FIFO") {
    } else {
      openModal();
    }
  };

  const handlePrint = () => {
    window.print();
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

  const renderColumns = () => {
    return chargesAndDeductions.map((charge) => {
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
  };

  const handleResetCustomer = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedCustomer: "",
      customerId: "",
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

  const handleBatchSelection = (batchId) => {
    const selectedBatchId = batchId;
    console.log(selectedBatchId);
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
          batch: sortedBatches,
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

  const handleItemDetailsChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];

      //Check if the field belongs to chargesAndDeductions
      if (field.startsWith("chargesAndDeductions")) {
        //Get the charge or deduction index
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

  return {
    validFields,
    validationErrors,
    referenceNo,
    formData,
    userLocations,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    company,
    isCompanyLoading,
    isCompanyError,
    companyError,
    itemBatches,
    customerSearchTerm,
    customers,
    isCustomersLoading,
    isCustomersError,
    customersError,
    isLoadingchargesAndDeductions,
    ischargesAndDeductionsError,
    chargesAndDeductionsError,
    chargesAndDeductions,
    loading,
    loadingDraft,
    submissionStatus,
    alertRef,
    isLoadingTransactionTypes,
    isTransactionTypesError,
    transactionTypesError,
    searchByBatch,
    searchByBarcode,
    setSearchByBarcode,
    setSearchByBatch,
    handleSubmit,
    calculateSubTotal,
    closeModal,
    handleBatchSelection,
    calculateTotalAmount,
    handleItemDetailsChange,
    handleRemoveItem,
    renderSubColumns,
    renderColumns,
    setCustomerSearchTerm,
    handlePrint,
    setValidFields,
    setSearchTerm,
    handleInputChange,
    handleSelectItem,
    handleAttachmentChange,
    handleSelectCustomer,
    handleResetCustomer,
  };
};

export default usePackingSlip;
