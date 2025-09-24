import { useState, useEffect, useRef } from "react";
import {
  get_company_suppliers_api,
  post_purchase_order_api,
  post_purchase_order_detail_api,
  get_charges_and_deductions_by_company_id_api,
  post_charges_and_deductions_applied_api,
  get_transaction_types_api,
  get_Low_Stock_Items_api,
  get_Location_Inventory_Summary_By_Item_Name_api,
  get_user_locations_by_user_id_api,
  get_locations_inventories_by_location_id_item_master_id_api,
  approve_purchase_requisition_api,
  get_item_batches_by_item_master_id_api,
} from "../../services/purchaseApi";
import { get_supplier_items_by_type_category_api } from "../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const usePurchaseOrder = ({ onFormSubmit, purchaseRequisition }) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    supplierId: null,
    orderDate: currentDate,
    itemDetails: [],
    status: 0,
    remark: "",
    attachments: [],
    totalAmount: 0,
    subTotal: 0,
    selectedSupplier: null,
    commonChargesAndDeductions: [],
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [referenceNo, setReferenceNo] = useState(null);
  const alertRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [showCreateSupplierModal, setShowCreateSupplierModal] = useState(false);
  const [showCreateSupplierMoalInParent, setShowCreateSupplierModalInParent] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isPOGenerated, setIsPOGenerated] = useState(false);
  const [poGenerating, setPOGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fetchUserLocation = async () => {
    try {
      const response = await get_user_locations_by_user_id_api(
        sessionStorage.getItem("userId")
      );
      return response.data.result.filter(
        (location) => location.location.locationTypeId === 2
      );
    } catch (error) {
      console.error("Error fetching user location:", error);
    }
  };

  const { data: userLocation } = useQuery({
    queryKey: ["userLocation"],
    queryFn: fetchUserLocation,
  });

  const fetchSuppliers = async () => {
    try {
      const response = await get_company_suppliers_api(
        sessionStorage.getItem("companyId")
      );
      const filteredSuppliers = response.data.result?.filter(
        (supplier) => supplier.status === 1
      );
      return filteredSuppliers || [];
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const {
    data: suppliers,
    isLoading,
    isError,
    error,
    refetch: refetchSuppliers,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
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
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  // const fetchItems = async (searchQuery) => {
  //   try {
  //     const response = await get_Location_Inventory_Summary_By_Item_Name_api(
  //       userLocation[0]?.locationId,
  //       searchQuery
  //     );

  //     const companyId = sessionStorage.getItem("companyId");

  //     const items = await Promise.all(
  //       response.data?.result?.map(async (summary) => {
  //         const supplierItemResponse =
  //           await get_supplier_items_by_type_category_api(
  //             companyId,
  //             parseInt(summary.itemMaster?.itemType?.itemTypeId),
  //             parseInt(summary.itemMaster?.category?.categoryId),
  //             userLocation[0]?.locationId
  //           );

  //         const supplierItems = supplierItemResponse.data.result
  //           ? supplierItemResponse.data.result.filter(
  //               (si) =>
  //                 si.itemMasterId !== summary.itemMasterId &&
  //                 si.supplierName !== formData?.selectedSupplier?.supplierName
  //             )
  //           : [];

  //         return {
  //           itemMasterId: summary.itemMasterId,
  //           itemName: summary.itemMaster?.itemName || "",
  //           unit: summary.itemMaster?.unit || { unitName: "" },
  //           categoryId: summary.itemMaster?.category?.categoryId || "",
  //           itemTypeId: summary.itemMaster?.itemType?.itemTypeId || "",
  //           supplierId: summary.itemMaster?.supplierId || null,
  //           totalStockInHand: summary.totalStockInHand,
  //           minReOrderLevel: summary.minReOrderLevel,
  //           maxStockLevel: summary.maxStockLevel,
  //           supplierItems: supplierItems,
  //         };
  //       }) || []
  //     );

  //     return items.filter(
  //       (item) =>
  //         !formData.supplierId || item.supplierId === formData.supplierId
  //     );
  //   } catch (error) {
  //     console.error("Error fetching items:", error);
  //     return [];
  //   }
  // };

  const fetchItems = async (searchQuery) => {
    try {
      const response = await get_Location_Inventory_Summary_By_Item_Name_api(
        userLocation[0]?.locationId,
        searchQuery
      );

      const items =
        response.data?.result?.map((summary) => ({
          itemMasterId: summary.itemMasterId,
          itemName: summary.itemMaster?.itemName || "",
          itemCode: summary.itemMaster?.itemCode || "",
          unit: summary.itemMaster?.unit || { unitName: "" },
          categoryId: summary.itemMaster?.category?.categoryId || "",
          itemTypeId: summary.itemMaster?.itemType?.itemTypeId || "",
          supplierId: summary.itemMaster?.supplierId || null,
          totalStockInHand: summary.totalStockInHand,
          minReOrderLevel: summary.minReOrderLevel,
          maxStockLevel: summary.maxStockLevel,
          supplierItems: [],
        })) || [];

      return items.filter(
        (item) =>
          !formData.supplierId || item.supplierId === formData.supplierId
      );
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };

  const {
    data: availableItems = [],
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", searchTerm],
    queryFn: () => fetchItems(searchTerm),
    enabled: !!formData.supplierId && !!searchTerm,
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
    const isSupplierValid = validateField(
      "supplierId",
      "Supplier",
      formData.supplierId
    );

    const isOrderDateValid = validateField(
      "orderDate",
      "Order date",
      formData.orderDate
    );

    const isAttachmentsValid = validateAttachments(formData.attachments);

    let isItemQuantityValid = true;
    // Validate item details
    formData.itemDetails.forEach((item, index) => {
      const fieldName = `quantity_${index}`;
      const fieldDisplayName = `Quantity for ${item.name}`;

      const additionalRules = {
        validationFunction: (value) => parseFloat(value) > 0,
        errorMessage: `${fieldDisplayName} must be greater than 0`,
      };

      const isValidQuantity = validateField(
        fieldName,
        fieldDisplayName,
        item.quantity,
        additionalRules
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    let isItemUnitPriceValid = true;

    // Validate item details
    formData.itemDetails.forEach((item, index) => {
      // Validation for unit price
      const unitPriceFieldName = `unitPrice_${index}`;
      const unitPriceFieldDisplayName = `Unit Price for ${item.name}`;

      const unitPriceAdditionalRules = {
        validationFunction: (value) => parseFloat(value) > 0,
        errorMessage: `${unitPriceFieldDisplayName} is required`,
      };

      const isValidUnitPrice = validateField(
        unitPriceFieldName,
        unitPriceFieldDisplayName,
        item.unitPrice,
        unitPriceAdditionalRules
      );

      isItemUnitPriceValid = isItemUnitPriceValid && isValidUnitPrice;
    });

    return (
      isSupplierValid &&
      isOrderDateValid &&
      isAttachmentsValid &&
      isItemQuantityValid &&
      isItemUnitPriceValid
    );
  };

  const getTransactionTypeIdByName = (name) => {
    const transactionType = transactionTypes.find((type) => type.name === name);
    return transactionType ? transactionType.transactionTypeId : null;
  };

  const postChargesAndDeductionsApplied = async (transactionId) => {
    try {
      const transactionTypeId = getTransactionTypeIdByName("PurchaseOrder");

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
      const currentDate = new Date().toISOString();
      const status = isSaveAsDraft ? 0 : 1;
      const isFormValid = validateForm();

      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const purchaseOrderData = {
          supplierId: formData.supplierId,
          orderDate: currentDate,
          totalAmount: formData.totalAmount,
          status: status,
          remark: formData.remark,
          orderedBy: sessionStorage?.getItem("username") ?? null,
          approvedBy: null,
          approvedDate: null,
          orderedUserId: sessionStorage?.getItem("userId") ?? null,
          approvedUserId: null,
          companyId: sessionStorage?.getItem("companyId") ?? null,
          lastUpdatedDate: currentDate,
          purchaseRequisitionId: purchaseRequisition
            ? purchaseRequisition.purchaseRequisitionId
            : null,
          permissionId: 11,
        };

        const response = await post_purchase_order_api(purchaseOrderData);

        setReferenceNo(response.data.result.referenceNo);

        const purchaseOrderId = response.data.result.purchaseOrderId;

        // Extract itemDetails from formData
        const itemDetailsData = formData.itemDetails.map(async (item) => {
          const detailsData = {
            purchaseOrderId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            itemMasterId: item.id,
            permissionId: 11,
          };

          // Call post_purchase_requisition_detail_api for each item
          const detailsApiResponse = await post_purchase_order_detail_api(
            detailsData
          );

          return detailsApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetailsData);

        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201
        );

        const postChargesAndDeductionsAppliedResponse =
          await postChargesAndDeductionsApplied(purchaseOrderId);

        const allAppliedSuccessful =
          postChargesAndDeductionsAppliedResponse.every(
            (detailsResponse) => detailsResponse.status === 201
          );

        if (allDetailsSuccessful && allAppliedSuccessful) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Purchase order saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Purchase order submitted successfully!", formData);
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

  const handleSupplierChange = (supplierId) => {
    const SelectedSupplierId = parseInt(supplierId, 10);

    const selectedSupplier = suppliers.find(
      (supplier) => supplier.supplierId === SelectedSupplierId
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      supplierId,
      selectedSupplier,
    }));
  };

  const handleSelectSupplier = (selectedSupplier) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      supplierId: selectedSupplier.supplierId,
      selectedSupplier: selectedSupplier,
    }));
    setSupplierSearchTerm(""); // Clear the supplier search term
    setValidFields({});
    setValidationErrors({});
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
          category: "",
          id: "",
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

  const handleSelectItem = async (item) => {
    const initializedCharges = chargesAndDeductions
      .filter((charge) => charge.isApplicableForLineItem)
      .map((charge) => ({
        id: charge.chargesAndDeductionId,
        name: charge.displayName,
        value: charge.amount || charge.percentage,
        sign: charge.sign,
        isPercentage: charge.percentage !== null,
      }));

    const itemBatch = await get_item_batches_by_item_master_id_api(
      item.itemMasterId,
      sessionStorage.getItem("companyId")
    );

    const latestBatch = itemBatch.data.result
      ? itemBatch.data.result.sort((a, b) => b.batchId - a.batchId)[0]
      : null;

    const supplierItemResponse = await get_supplier_items_by_type_category_api(
      sessionStorage.getItem("companyId"),
      parseInt(item?.itemTypeId),
      parseInt(item?.categoryId),
      userLocation[0]?.locationId
    );

    const supplierItems = supplierItemResponse.data.result
      ? supplierItemResponse.data.result.filter(
          (si) =>
            si.itemMasterId !== item.itemMasterId &&
            si.supplierName !== formData?.selectedSupplier?.supplierName
        )
      : [];

    setFormData((prevFormData) => ({
      ...prevFormData,
      itemDetails: [
        ...prevFormData.itemDetails,
        {
          id: item.itemMasterId,
          name: item.itemName,
          unit: item.unit.unitName,
          categoryId: item.categoryId,
          itemTypeId: item.itemTypeId,
          quantity:
            item.maxStockLevel - item.totalStockInHand >= 0
              ? item.maxStockLevel - item.totalStockInHand
              : 0,
          unitPrice: latestBatch?.costPrice || 0.0,
          totalPrice: 0.0,
          totalStockInHand: item.totalStockInHand,
          minReOrderLevel: item.minReOrderLevel,
          maxStockLevel: item.maxStockLevel,
          chargesAndDeductions: initializedCharges,
          supplierItems: supplierItems,
        },
      ],
    }));
    setSearchTerm("");
  };

  // Helper function to create an initialized item
  const createInitializedItem = async (item, purchaseRequisition) => {
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

    // Calculate total price based on initial values and charges and deductions
    let grandTotalPrice = item.quantity * item.unitPrice;
    let totalPrice = grandTotalPrice;
    initializedCharges.forEach((charge) => {
      if (charge.isPercentage) {
        const amount = (grandTotalPrice * charge.value) / 100;
        if (charge.sign === "+") {
          totalPrice += amount;
        } else if (charge.sign === "-") {
          totalPrice -= amount;
        }
      } else {
        if (charge.sign === "+") {
          totalPrice += charge.value;
        } else if (charge.sign === "-") {
          totalPrice -= charge.value;
        }
      }
    });

    // Ensure totalPrice is initialized and is a numerical value
    totalPrice = isNaN(totalPrice) ? 0 : totalPrice;

    // Bind supplier items
    const supplierItemResponse = await get_supplier_items_by_type_category_api(
      sessionStorage.getItem("companyId"),
      parseInt(item.itemMaster?.itemTypeId),
      parseInt(item.itemMaster?.categoryId),
      parseInt(purchaseRequisition?.expectedDeliveryLocation)
    );

    const itemInventoryResponse =
      await get_locations_inventories_by_location_id_item_master_id_api(
        parseInt(purchaseRequisition?.expectedDeliveryLocation),
        item.itemMasterId
      );

    const itemInventory = itemInventoryResponse?.data?.result;
    const totalStockInHand = itemInventory?.reduce(
      (total, inventory) => total + (inventory.stockInHand || 0),
      0
    );
    const minReOrderLevel =
      itemInventory?.reduce(
        (min, inventory) =>
          min === null || inventory.reOrderLevel < min
            ? inventory.reOrderLevel
            : min,
        null
      ) || 0;
    const maxStockLevel =
      itemInventory?.reduce(
        (max, inventory) =>
          max === null || inventory.maxStockLevel > max
            ? inventory.maxStockLevel
            : max,
        null
      ) || 0;

    const supplierItems = supplierItemResponse?.data?.result
      ? supplierItemResponse?.data?.result?.filter(
          (si) =>
            si.itemMasterId !== item.itemMasterId &&
            si.supplierName !== formData?.selectedSupplier?.supplierName
        )
      : [];

    // Return the new item object
    return {
      id: item?.itemMasterId,
      name: item?.itemMaster?.itemName,
      unit: item?.itemMaster?.unit.unitName,
      quantity: item?.quantity,
      unitPrice: item?.unitPrice,
      totalPrice: totalPrice,
      supplierItems: supplierItems,
      totalStockInHand: totalStockInHand,
      minReOrderLevel: minReOrderLevel,
      maxStockLevel: maxStockLevel,
      chargesAndDeductions: initializedCharges,
    };
  };

  // Initialize items from purchase requisition (FIXED VERSION)
  useEffect(() => {
    const initializeAllItems = async () => {
      if (
        !initialized &&
        !isLoadingchargesAndDeductions &&
        chargesAndDeductions &&
        purchaseRequisition !== null &&
        purchaseRequisition.purchaseRequisitionDetails?.length > 0
      ) {
        try {
          console.log(
            "Initializing all items from purchase requisition...",
            purchaseRequisition
          );

          // Process all items in parallel
          const newItemDetails = await Promise.all(
            purchaseRequisition.purchaseRequisitionDetails.map(async (item) => {
              return await createInitializedItem(item, purchaseRequisition);
            })
          );

          // Set all items at once, replacing any existing items
          setFormData((prevFormData) => ({
            ...prevFormData,
            supplierId: purchaseRequisition?.supplierId,
            selectedSupplier: purchaseRequisition?.supplier,
            itemDetails: newItemDetails, // Replace, don't append
          }));

          setInitialized(true);
          console.log(
            "Initialization completed. Items count:",
            newItemDetails.length
          );
        } catch (error) {
          console.error("Error initializing items:", error);
        }
      }
    };

    initializeAllItems();
  }, [
    isLoadingchargesAndDeductions,
    chargesAndDeductions,
    purchaseRequisition,
    initialized,
  ]);

  const handleResetSupplier = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedSupplier: null,
      supplierId: null,
      itemDetails: [],
    }));
    // Reset initialization flag to allow re-initialization if needed
    setInitialized(false);
  };

  const handleShowCreateSupplierModal = () => {
    setShowCreateSupplierModal(true);
    setShowCreateSupplierModalInParent(true);
  };

  const handleCloseCreateSupplierModal = () => {
    setShowCreateSupplierModal(false);
    handleCloseCreateSupplierModalInParent();
  };

  const handleCloseCreateSupplierModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setShowCreateSupplierModalInParent(false);
    }, delay);
  };

  const handleAddSupplier = (responseData) => {
    handleSelectSupplier(responseData);
    refetchSuppliers();
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
    if (chargesAndDeductions && !isLoadingchargesAndDeductions) {
      handleAddCommonChargesAndDeductions();
    }
  }, [chargesAndDeductions, isLoadingchargesAndDeductions]);

  const renderSubColumns = () => {
    return formData.commonChargesAndDeductions.map((charge, chargeIndex) => {
      if (!charge.isApplicableForLineItem) {
        return (
          <tr key={chargeIndex}>
            <td
              colSpan={
                7 +
                (formData.itemDetails[0]?.chargesAndDeductions?.length || 0) -
                1
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

  const handleGeneratePurchaseOrder = async () => {
    try {
      setPOGenerating(true);
      setIsPOGenerated(true);
      const response = await get_Low_Stock_Items_api(
        formData.supplierId,
        userLocation[0]?.locationId
      );
      const lowStockItems = response.data.result || [];

      if (lowStockItems.length === 0) {
        setShowToast(true);
        setTimeout(() => {
          setIsPOGenerated(false);
          setShowToast(false);
        }, 5000);
        setPOGenerating(false);
        return;
      }

      if (lowStockItems.length > 0) {
        // Generate chargesAndDeductions array for each low-stock item
        const initializedCharges =
          chargesAndDeductions
            ?.filter((charge) => charge.isApplicableForLineItem)
            .map((charge) => ({
              id: charge.chargesAndDeductionId,
              name: charge.displayName,
              value: charge.amount || charge.percentage,
              sign: charge.sign,
              isPercentage: charge.percentage !== null,
            })) || [];

        const companyId = sessionStorage.getItem("companyId");

        // Transform low-stock items into itemDetails format with API calls
        const newItemDetails = await Promise.all(
          lowStockItems.map(async (item) => {
            const itemBatch = await get_item_batches_by_item_master_id_api(
              item.itemMasterId,
              sessionStorage.getItem("companyId")
            );

            const latestBatch = itemBatch.data.result
              ? itemBatch.data.result.sort((a, b) => b.batchId - a.batchId)[0]
              : null;

            const supplierItemResponse =
              await get_supplier_items_by_type_category_api(
                companyId,
                parseInt(item.itemMaster?.itemType?.itemTypeId),
                parseInt(item.itemMaster?.category?.categoryId),
                userLocation[0]?.locationId
              );

            const supplierItems = supplierItemResponse.data.result
              ? supplierItemResponse.data.result.filter(
                  (si) =>
                    si.itemMasterId !== item.itemMasterId &&
                    si.supplierName !== formData?.selectedSupplier?.supplierName
                )
              : [];

            return {
              id: item.itemMasterId,
              name: item.itemMaster.itemName,
              unit: item.itemMaster.unit?.unitName || "",
              categoryId: item.itemMaster?.category?.categoryId || "",
              itemTypeId: item.itemMaster?.itemType?.itemTypeId || "",
              quantity:
                item.maxStockLevel - item.totalStockInHand >= 0
                  ? item.maxStockLevel - item.totalStockInHand
                  : 0,
              unitPrice: latestBatch?.costPrice || 0.0,
              totalPrice: 0.0,
              supplierItems: supplierItems,
              totalStockInHand: item.totalStockInHand,
              minReOrderLevel: item.minReOrderLevel,
              maxStockLevel: item.maxStockLevel,
              chargesAndDeductions: initializedCharges,
            };
          })
        );

        // Update formData with new itemDetails
        setFormData((prevFormData) => ({
          ...prevFormData,
          itemDetails: newItemDetails,
          subTotal: calculateSubTotal(),
          totalAmount: calculateTotalAmount(),
        }));
      } else {
        console.log("No low-stock items found.");
      }
    } catch (error) {
      console.error("Error generating purchase order:", error);
    } finally {
      setPOGenerating(false);
    }
  };

  return {
    formData,
    suppliers,
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
    isLoading,
    isError,
    error,
    supplierSearchTerm,
    showCreateSupplierMoalInParent,
    showCreateSupplierModal,
    isLoadingchargesAndDeductions,
    ischargesAndDeductionsError,
    chargesAndDeductionsError,
    chargesAndDeductions,
    isLoadingTransactionTypes,
    isTransactionTypesError,
    transactionTypesError,
    isPOGenerated,
    loading,
    loadingDraft,
    showToast,
    poGenerating,
    handleInputChange,
    handleSupplierChange,
    handleItemDetailsChange,
    handleAttachmentChange,
    handleSubmit,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    calculateSubTotal,
    setSearchTerm,
    handleSelectItem,
    handleSelectSupplier,
    setSupplierSearchTerm,
    handleResetSupplier,
    handleCloseCreateSupplierModal,
    handleAddSupplier,
    handleShowCreateSupplierModal,
    renderColumns,
    renderSubColumns,
    calculateTotalAmount,
    handleGeneratePurchaseOrder,
    setShowToast,
  };
};

export default usePurchaseOrder;
