import { useState, useEffect, useRef } from "react";
import { get_purchase_orders_with_out_drafts_api } from "../../services/purchaseApi";
import {
  post_grn_master_api,
  post_grn_detail_api,
  get_grn_masters_by_purchase_order_id_api,
} from "../../services/purchaseApi";
import { get_item_masters_by_company_id_with_query_api } from "../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const useGrn = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    grnDate: "",
    receivedBy: "",
    receivedDate: "",
    itemDetails: [],
    status: "",
    purchaseOrderId: "",
    grnType: "goodsReceivedNote",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const statusOptions = [
    { id: "4", label: "In Progress" },
    { id: "5", label: "Completed" },
  ];
  const alertRef = useRef(null);
  const [purchaseOrderSearchTerm, setPurchaseOrderSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const grnTypeOptions = [
    { id: "goodsReceivedNote", label: "Goods Received Note" },
    { id: "finishedGoodsIn", label: "Finished Goods In" },
  ];
  const [searchTerm, setSearchTerm] = useState("");

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
      fetchItems(sessionStorage.getItem("companyId"), searchTerm, "All"),
  });

  const fetchPurchaseOrders = async () => {
    try {
      const response = await get_purchase_orders_with_out_drafts_api(
        sessionStorage?.getItem("companyId")
      );
      const filteredPurchaseOrders = response.data.result?.filter(
        (po) => po.status === 2
      );
      return filteredPurchaseOrders || [];
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    }
  };

  const {
    data: purchaseOrders,
    isLoading,
    isError,
    error,
    refetch: refetchPurchaseOrders,
  } = useQuery({
    queryKey: ["purchaseOrders"],
    queryFn: fetchPurchaseOrders,
  });

  const fetchGrnsBypurchaseOrderId = async (purchaseOrderId) => {
    try {
      const response = await get_grn_masters_by_purchase_order_id_api(
        purchaseOrderId
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching grns:", error);
    }
  };

  const {
    data: grns,
    isLoading: isGrnsLoading,
    isError: isGrnsError,
    error: grnError,
    refetch: refetchGrns,
  } = useQuery({
    queryKey: ["grns", selectedPurchaseOrder?.purchaseOrderId],
    queryFn: () =>
      fetchGrnsBypurchaseOrderId(selectedPurchaseOrder.purchaseOrderId),
  });

  useEffect(() => {
    if (grns && selectedPurchaseOrder) {
      const updatedItemDetails = selectedPurchaseOrder.purchaseOrderDetails
        .map((poItem) => {
          const receivedQuantity = grns.reduce((total, grn) => {
            const grnDetail = grn.grnDetails.find(
              (detail) => detail.itemId === poItem.itemMaster?.itemMasterId
            );
            return total + (grnDetail ? grnDetail.receivedQuantity : 0);
          }, 0);

          const remainingQuantity = poItem.quantity - receivedQuantity;

          return {
            id: poItem.itemMaster?.itemMasterId,
            name: poItem.itemMaster?.itemName,
            unit: poItem.itemMaster?.unit.unitName,
            quantity: poItem.quantity,
            remainingQuantity: Math.max(0, remainingQuantity),
            receivedQuantity: 0,
            rejectedQuantity: 0,
            freeQuantity: 0,
            expiryDate: "",
            unitPrice: poItem.unitPrice,
          };
        })
        .filter((item) => item.remainingQuantity > 0);

      // Update form data with filtered items
      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: updatedItemDetails,
      }));
    } else if (selectedPurchaseOrder) {
      // If there are no existing GRNs, show all items from the selected purchase order
      const allItemDetails = selectedPurchaseOrder.purchaseOrderDetails.map(
        (poItem) => ({
          id: poItem.itemMaster?.itemMasterId,
          name: poItem.itemMaster?.itemName,
          unit: poItem.itemMaster?.unit.unitName,
          quantity: poItem.quantity,
          remainingQuantity: poItem.quantity, // Set remaining quantity same as ordered quantity
          receivedQuantity: 0,
          rejectedQuantity: 0,
          freeQuantity: 0,
          expiryDate: "",
          unitPrice: poItem.unitPrice,
          // Other item properties...
        })
      );

      // Update form data with all items
      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: allItemDetails,
      }));
    }
  }, [grns, selectedPurchaseOrder]);

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
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

  const validateForm = () => {
    setValidFields({});
    setValidationErrors({});

    const isGrnDateValid = validateField(
      "grnDate",
      "GRN date",
      formData.grnDate
    );

    const isReceivedByValid = validateField(
      "receivedBy",
      "Received By",
      formData.receivedBy
    );

    const isReceivedDateValid = validateField(
      "receivedDate",
      "Received date",
      formData.receivedDate
    );

    const isStatusValid = validateField("status", "Status", formData.status);

    let isPurchaseOrderIdValid = true;
    if (formData.grnType !== "finishedGoodsIn") {
      isPurchaseOrderIdValid = validateField(
        "purchaseOrderId",
        "Purchase order reference number",
        formData.purchaseOrderId
      );
    }

    let isItemQuantityValid = true;
    // Validate item details
    formData.itemDetails.forEach((item, index) => {
      const fieldName = `receivedQuantity_${index}`;
      const fieldDisplayName = `Received Quantity for ${item.name}`;

      let additionalRules = {};

      if (formData.grnType === "finishedGoodsIn") {
        // Rule for finishedGoodsIn
        additionalRules = {
          validationFunction: (value) => parseFloat(value) > 0,
          errorMessage: `${fieldDisplayName} must be greater than 0`,
        };
      } else {
        // Default rule
        additionalRules = {
          validationFunction: (value) =>
            parseFloat(value) > 0 &&
            parseFloat(value) <= item.remainingQuantity,
          errorMessage: `${fieldDisplayName} must be greater than 0 and less than or equal to remaining quantity ${item.remainingQuantity}`,
        };
      }

      const isValidQuantity = validateField(
        fieldName,
        fieldDisplayName,
        item.receivedQuantity,
        additionalRules
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    let isRejectedQuantityValid = true;
    // Validate rejected quantity
    formData.itemDetails.forEach((item, index) => {
      const rejectedFieldName = `rejectedQuantity_${index}`;
      const rejectedFieldDisplayName = `Rejected Quantity for ${item.name}`;

      const additionalRejectedRules = {
        validationFunction: (value) =>
          parseFloat(value) <= item.receivedQuantity,
        errorMessage: `${rejectedFieldDisplayName} must be less than or equal to received quantity ${item.receivedQuantity}`,
      };

      const isValidRejectedQuantity = validateField(
        rejectedFieldName,
        rejectedFieldDisplayName,
        item.rejectedQuantity,
        additionalRejectedRules
      );

      isRejectedQuantityValid =
        isRejectedQuantityValid && isValidRejectedQuantity;
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

    let isItemExpiryDateValid = true;

    // Validate item details
    formData.itemDetails.forEach((item, index) => {
      // Validation for expiry date
      const expiryDateFieldName = `expiryDate_${index}`;
      const expiryDateFieldDisplayName = `Expiry Date for ${item.name}`;

      const isValidExpiryDate = validateField(
        expiryDateFieldName,
        expiryDateFieldDisplayName,
        item.expiryDate
      );

      isItemExpiryDateValid = isItemExpiryDateValid && isValidExpiryDate;
    });

    const isGrnTypeValid = validateField(
      "grnType",
      "GRN type",
      formData.grnType
    );

    return (
      isGrnDateValid &&
      isReceivedByValid &&
      isReceivedDateValid &&
      isStatusValid &&
      isPurchaseOrderIdValid &&
      isItemQuantityValid &&
      isItemUnitPriceValid &&
      isItemExpiryDateValid &&
      isRejectedQuantityValid &&
      isGrnTypeValid
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;

      const combinedStatus = parseInt(`${formData.status}${status}`, 10);

      const currentDate = new Date().toISOString();

      const purchaseOrderId =
        formData.grnType === "finishedGoodsIn"
          ? null
          : formData.purchaseOrderId;

      const isFormValid = validateForm();
      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const grnData = {
          purchaseOrderId: purchaseOrderId,
          grnDate: formData.grnDate,
          receivedBy: formData.receivedBy,
          receivedDate: formData.receivedDate,
          status: combinedStatus,
          companyId: sessionStorage?.getItem("companyId") ?? null,
          receivedUserId: sessionStorage?.getItem("userId") ?? null,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          createdDate: currentDate,
          lastUpdatedDate: currentDate,
          grnType: formData.grnType,
          permissionId: 20,
        };

        const response = await post_grn_master_api(grnData);

        const grnMasterId = response.data.result.grnMasterId;

        // Extract itemDetails from formData
        const itemDetailsData = formData.itemDetails.map(async (item) => {
          const detailsData = {
            grnMasterId,
            receivedQuantity: item.receivedQuantity,
            acceptedQuantity: item.receivedQuantity - item.rejectedQuantity,
            rejectedQuantity: item.rejectedQuantity,
            unitPrice: item.unitPrice,
            itemId: item.id,
            freeQuantity: item.freeQuantity,
            expiryDate: item.expiryDate,
            permissionId: 20,
          };

          // Call post_purchase_requisition_detail_api for each item
          const detailsApiResponse = await post_grn_detail_api(detailsData);

          return detailsApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetailsData);

        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201
        );

        if (allDetailsSuccessful) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("GRN saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("GRN submitted successfully!", formData);
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));

    if (field === "grnType") {
      handleResetPurchaseOrder();
    }
  };

  const handleItemDetailsChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails[index][field] = value;

      // Ensure positive values for Quantities
      updatedItemDetails[index].receivedQuantity = Math.max(
        0,
        updatedItemDetails[index].receivedQuantity
      );

      updatedItemDetails[index].rejectedQuantity = Math.max(
        0,
        updatedItemDetails[index].rejectedQuantity
      );

      updatedItemDetails[index].freeQuantity = Math.max(
        0,
        updatedItemDetails[index].freeQuantity
      );

      updatedItemDetails[index].unitPrice = !isNaN(
        parseFloat(updatedItemDetails[index].unitPrice)
      )
        ? Math.max(0, parseFloat(updatedItemDetails[index].unitPrice))
        : 0;

      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
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
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePurchaseOrderChange = (referenceId) => {
    const selectedPurchaseOrder = purchaseOrders.find(
      (purchaseOrder) => purchaseOrder.referenceNo === referenceId
    );

    setSelectedPurchaseOrder(selectedPurchaseOrder);

    setFormData((prevFormData) => ({
      ...prevFormData,
      purchaseOrderId: selectedPurchaseOrder?.purchaseOrderId ?? "",
    }));
    // Refetch GRNs for the selected PO
    refetchGrns();
    setPurchaseOrderSearchTerm("");
  };

  const handleStatusChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      status: selectedOption?.id,
    }));
  };

  const handleResetPurchaseOrder = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      purchaseOrderId: "",
      itemDetails: [],
    }));

    setSelectedPurchaseOrder(null);

    setValidFields({});
    setValidationErrors({});
  };

  const handleSelectItem = (item) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemDetails: [
        ...prevFormData.itemDetails,
        {
          id: item.itemMasterId,
          name: item.itemName,
          unit: item.unit.unitName,
          quantity: 0,
          remainingQuantity: 0,
          receivedQuantity: 0,
          rejectedQuantity: 0,
          freeQuantity: 0,
          expiryDate: "",
          unitPrice: 0.0,
        },
      ],
    }));
    setSearchTerm(""); // Clear the search term
  };

  return {
    formData,
    validFields,
    validationErrors,
    selectedPurchaseOrder,
    purchaseOrders,
    statusOptions,
    submissionStatus,
    alertRef,
    isLoading,
    isError,
    purchaseOrderSearchTerm,
    loading,
    loadingDraft,
    grnTypeOptions,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    handleInputChange,
    handleItemDetailsChange,
    handleRemoveItem,
    handlePrint,
    handleSubmit,
    handlePurchaseOrderChange,
    handleStatusChange,
    setPurchaseOrderSearchTerm,
    setSelectedPurchaseOrder,
    handleResetPurchaseOrder,
    setSearchTerm,
    handleSelectItem,
  };
};

export default useGrn;
