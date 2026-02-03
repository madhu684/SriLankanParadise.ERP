import { useState, useEffect, useRef } from "react";
import {
  get_company_suppliers_api,
  put_purchase_order_api,
  put_purchase_order_detail_api,
  post_purchase_order_detail_api,
  delete_purchase_order_detail_api,
  get_charges_and_deductions_by_company_id_api,
  get_transaction_types_api,
  get_charges_and_deductions_applied_api,
  post_charges_and_deductions_applied_api,
  put_charges_and_deductions_applied_api,
  delete_charges_and_deductions_applied_api,
} from "common/services/purchaseApi";
import { get_item_masters_by_company_id_with_query_api } from "common/services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const usePurchaseOrderUpdate = ({ purchaseOrder, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    supplierId: "",
    orderDate: "",
    itemDetails: [],
    status: 0,
    remark: "",
    attachments: [],
    totalAmount: 0,
    selectedSupplier: "",
    subTotal: 0,
    commonChargesAndDeductions: [],
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [itemIdsToBeDeleted, setItemIdsToBeDeleted] = useState([]);
  const [
    chargesAndDeductionsAppliedIdsToBeDeleted,
    setChargesAndDeductionsAppliedIdsToBeDeleted,
  ] = useState([]);
  const alertRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [showCreateSupplierModal, setShowCreateSupplierModal] = useState(false);
  const [showCreateSupplierMoalInParent, setShowCreateSupplierModalInParent] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

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

  const fetchChargesAndDeductionsApplied = async () => {
    try {
      const response = await get_charges_and_deductions_applied_api(
        2,
        purchaseOrder.purchaseOrderId,
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
    queryKey: ["chargesAndDeductionsApplied", purchaseOrder.purchaseOrderId],
    queryFn: fetchChargesAndDeductionsApplied,
  });

  useEffect(() => {
    if (
      !isChargesAndDeductionsAppliedLoading &&
      chargesAndDeductionsApplied &&
      !isLoadingchargesAndDeductions &&
      chargesAndDeductions
    ) {
      const deepCopyPurchaseOrder = JSON.parse(JSON.stringify(purchaseOrder));
      let purchaseOrderDetails = purchaseOrder.purchaseOrderDetails;

      // Initialize line item charges and deductions
      const initializedLineItemCharges = purchaseOrderDetails.map((item) => {
        const initializedCharges = chargesAndDeductionsApplied
          ?.filter(
            (charge) => charge.lineItemId === item.itemMaster.itemMasterId
          )
          .map((charge) => {
            let value;
            if (charge.chargesAndDeduction.percentage !== null) {
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
          .filter((charge) => charge.isApplicableForLineItem === true)
          .map((charge) => {
            const displayName = charge.displayName;
            const matchedCharge = initializedCharges.find(
              (c) => c.name === displayName
            );
            return matchedCharge || null;
          });

        return {
          ...item,
          id: item.itemMasterId,
          name: item.itemMaster.itemName,
          unit: item.itemMaster.unit.unitName,
          chargesAndDeductions: sortedLineItemCharges,
        };
      });

      const subTotal = deepCopyPurchaseOrder.purchaseOrderDetails.reduce(
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
          console.log(value);
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
        purchaseOrderId: deepCopyPurchaseOrder?.purchaseOrderId ?? "",
        supplierId: deepCopyPurchaseOrder?.supplierId ?? "",
        orderDate: deepCopyPurchaseOrder?.orderDate?.split("T")[0] ?? "",
        itemDetails: initializedLineItemCharges,
        remark: deepCopyPurchaseOrder?.remark ?? "",
        attachments: deepCopyPurchaseOrder?.attachments ?? [],
        totalAmount: deepCopyPurchaseOrder?.totalAmount ?? "",
        selectedSupplier: deepCopyPurchaseOrder?.supplier ?? "",
        subTotal: 0,
        commonChargesAndDeductions: initializedCommonCharges,
      });
    }
  }, [
    purchaseOrder,
    isChargesAndDeductionsAppliedLoading,
    chargesAndDeductionsApplied,
    isLoadingchargesAndDeductions,
    chargesAndDeductions,
  ]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      subTotal: calculateSubTotal(),
      totalAmount: calculateTotalAmount(),
    }));
  }, [formData.itemDetails, formData.commonChargesAndDeductions]);

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  // useEffect(() => {
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     totalAmount: calculateTotalAmount(),
  //   }));
  // }, [formData.itemDetails]);

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

  const updateChargesAndDeductionsApplied = async (transactionId) => {
    try {
      const transactionTypeId = getTransactionTypeIdByName("PurchaseOrder");

      const chargesAndDeductionsAppliedData = await Promise.all(
        formData.itemDetails.map(async (item) => {
          const appliedCharges = await Promise.all(
            item.chargesAndDeductions.map(async (charge) => {
              let appliedValue = 0;

              // IMPORTANT: Parse the charge value as a float
              const chargeValue = parseFloat(charge.value) || 0;

              if (charge.isPercentage) {
                // Calculate the amount based on percentage and sign
                const grandTotalPrice =
                  (item.quantity *
                    item.unitPrice *
                    (100 - (item.discount || 0))) /
                  100;

                const amount = (grandTotalPrice * chargeValue) / 100;
                appliedValue = charge.sign === "+" ? amount : -amount;
              } else {
                // Use the value directly based on the sign
                appliedValue = charge.sign === "+" ? chargeValue : -chargeValue;
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

          // IMPORTANT: Parse the charge value as a float
          const chargeValue = parseFloat(charge.value) || 0;

          if (charge.isPercentage) {
            // If the charge is a percentage, calculate based on percentage of total amount
            appliedValue = (formData.subTotal * chargeValue) / 100;
          } else {
            // If the charge is not a percentage, use the fixed value
            appliedValue = chargeValue;
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

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;
      const currentDate = new Date().toISOString();

      const isFormValid = validateForm(isSaveAsDraft);
      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const purchaseOrderData = {
          supplierId: formData.supplierId,
          orderDate: formData.orderDate,
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
          permissionId: 18,
        };

        const response = await put_purchase_order_api(
          purchaseOrder.purchaseOrderId,
          purchaseOrderData
        );

        // Extract itemDetails from formData
        const itemDetailsData = formData.itemDetails.map(async (item) => {
          let detailsApiResponse;
          const detailsData = {
            purchaseOrderId: purchaseOrder.purchaseOrderId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            itemMasterId: item.id,
            permissionId: 18,
          };

          if (item.purchaseOrderDetailId != null) {
            // Call put_purchase_Order_detail_api for each item
            detailsApiResponse = await put_purchase_order_detail_api(
              item.purchaseOrderDetailId,
              detailsData
            );
          } else {
            // Call post_purchase_Order_detail_api for each item
            detailsApiResponse = await post_purchase_order_detail_api(
              detailsData
            );
          }
          return detailsApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetailsData);

        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201 || 200
        );

        for (const itemIdToBeDeleted of itemIdsToBeDeleted) {
          const response = await delete_purchase_order_detail_api(
            itemIdToBeDeleted
          );
          console.log(
            `Successfully deleted item with ID: ${itemIdToBeDeleted}`
          );
        }
        // Clear the itmeIdsToBeDeleted array after deletion
        setItemIdsToBeDeleted([]);

        const updateChargesAndDeductionsAppliedResponse =
          await updateChargesAndDeductionsApplied(
            purchaseOrder.purchaseOrderId
          );

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

        if (allDetailsSuccessful && allAppliedSuccessful) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Purchase order updated and saved as draft!", formData);
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

  // const handleItemDetailsChange = (index, field, value) => {
  //   setFormData((prevFormData) => {
  //     const updatedItemDetails = [...prevFormData.itemDetails];

  //     // Check if the field belongs to chargesAndDeductions
  //     if (field.startsWith("chargesAndDeductions")) {
  //       // Get the charge or deduction index
  //       const chargeIndex = parseInt(field.split("_")[1]);

  //       // Update the value of the corresponding charge or deduction
  //       updatedItemDetails[index].chargesAndDeductions[chargeIndex].value =
  //         value;
  //     } else {
  //       // If the field is not part of chargesAndDeductions, update other fields
  //       updatedItemDetails[index][field] =
  //         field === "discount" ? parseFloat(value) : value;
  //     }

  //     // Ensure positive values for Quantities, Unit Prices and discounts
  //     updatedItemDetails[index].quantity = Math.max(
  //       0,
  //       updatedItemDetails[index].quantity
  //     );

  //     updatedItemDetails[index].unitPrice = !isNaN(
  //       parseFloat(updatedItemDetails[index].unitPrice)
  //     )
  //       ? Math.max(0, parseFloat(updatedItemDetails[index].unitPrice))
  //       : 0;

  //     updatedItemDetails[index].discount = Math.max(
  //       0,
  //       updatedItemDetails[index].discount
  //     );

  //     // Calculate total price based on charges and deductions
  //     const grandTotalPrice =
  //       (updatedItemDetails[index].quantity *
  //         updatedItemDetails[index].unitPrice *
  //         (100 - updatedItemDetails[index].discount)) /
  //       100;

  //     let totalPrice =
  //       (updatedItemDetails[index].quantity *
  //         updatedItemDetails[index].unitPrice *
  //         (100 - updatedItemDetails[index].discount)) /
  //       100;

  //     // Add or subtract charges and deductions from total price
  //     updatedItemDetails[index].chargesAndDeductions.forEach((charge) => {
  //       if (charge.isPercentage) {
  //         // If charge is a percentage, calculate the amount and add/subtract it
  //         const amount = (grandTotalPrice * charge.value) / 100;
  //         if (charge.sign === "+") {
  //           totalPrice += amount;
  //         } else if (charge.sign === "-") {
  //           totalPrice -= amount;
  //         }
  //       } else {
  //         // If charge is not a percentage, directly add/subtract the value
  //         if (charge.sign === "+") {
  //           totalPrice += charge.value;
  //         } else if (charge.sign === "-") {
  //           totalPrice -= charge.value;
  //         }
  //       }
  //     });

  //     // Ensure totalPrice is initialized and is a numerical value
  //     totalPrice = isNaN(totalPrice) ? 0 : totalPrice;

  //     updatedItemDetails[index].totalPrice = totalPrice;

  //     return {
  //       ...prevFormData,
  //       itemDetails: updatedItemDetails,
  //       subTotal: calculateSubTotal(),
  //       totalAmount: calculateTotalAmount(),
  //     };
  //   });
  // };

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

      // Ensure positive values for Quantities, Unit Prices and discounts
      updatedItemDetails[index].quantity = Math.max(
        0,
        parseFloat(updatedItemDetails[index].quantity) || 0
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
        const chargeValue = parseFloat(charge.value) || 0;

        if (charge.isPercentage) {
          // If charge is a percentage, calculate the amount and add/subtract it
          const amount = (grandTotalPrice * chargeValue) / 100;
          if (charge.sign === "+") {
            totalPrice += amount;
          } else if (charge.sign === "-") {
            totalPrice -= amount;
          }
        } else {
          // If charge is not a percentage, directly add/subtract the value
          if (charge.sign === "+") {
            totalPrice += chargeValue;
          } else if (charge.sign === "-") {
            totalPrice -= chargeValue;
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

  const handleRemoveItem = (
    index,
    purchaseOrderDetailId,
    chargesAndDeductions
  ) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails.splice(index, 1);
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });

    if (purchaseOrderDetailId !== null && purchaseOrderDetailId !== undefined) {
      setItemIdsToBeDeleted((prevIds) => [...prevIds, purchaseOrderDetailId]);
    }

    console.log(chargesAndDeductions);
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
    formData.commonChargesAndDeductions?.forEach((charge) => {
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

  const handleSelectItem = (item) => {
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
          id: item.itemMasterId,
          name: item.itemName,
          unit: item.unit.unitName,
          quantity: 0,
          unitPrice: 0.0,
          discount: 0.0,
          totalPrice: 0.0,
          chargesAndDeductions: initializedCharges, // Add the generated array to itemDetails
        },
      ],
    }));
    setSearchTerm(""); // Clear the search term
  };

  const handleResetSupplier = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedSupplier: "",
      supplierId: "",
    }));
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

  const renderSubColumns = () => {
    return formData.commonChargesAndDeductions?.map((charge, chargeIndex) => {
      if (!charge.isApplicableForLineItem) {
        return (
          <tr key={chargeIndex}>
            <td
              colSpan={
                5 + formData.itemDetails[0].chargesAndDeductions.length - 1
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

  return {
    formData,
    suppliers,
    submissionStatus,
    validFields,
    validationErrors,
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
    isChargesAndDeductionsAppliedLoading,
    isChargesAndDeductionsAppliedError,
    chargesAndDeductionsAppliedError,
    loading,
    loadingDraft,
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    calculateTotalAmount,
    handleSupplierChange,
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
  };
};

export default usePurchaseOrderUpdate;













