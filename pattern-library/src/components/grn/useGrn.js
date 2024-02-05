import { useState, useEffect, useRef } from "react";
import { get_purchase_orders_with_out_drafts_api } from "../../services/purchaseApi";
import {
  post_grn_master_api,
  post_grn_detail_api,
} from "../../services/purchaseApi";

const useGrn = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    grnDate: "",
    receivedBy: "",
    receivedDate: "",
    itemDetails: [],
    status: "",
    purchaseOrderId: "",
    totalAmount: 0,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const [purchaseOrderOptions, setPurchaseOrders] = useState([]);
  const statusOptions = [
    { id: "4", label: "In Progress" },
    { id: "5", label: "Completed" },
  ];
  const alertRef = useRef(null);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const response = await get_purchase_orders_with_out_drafts_api(1);
        const filteredPurchaseOrders = response.data.result.filter(
          (po) => po.status === 2
        );
        setPurchaseOrders(filteredPurchaseOrders);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchPurchaseOrders();
  }, []);

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

    const isPurchaseOrderIdValid = validateField(
      "purchaseOrderId",
      "Purchase Order Reference Number",
      formData.purchaseOrderId
    );

    return (
      isGrnDateValid &&
      isReceivedByValid &&
      isReceivedDateValid &&
      isStatusValid &&
      isPurchaseOrderIdValid
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;

      const combinedStatus = parseInt(`${formData.status}${status}`, 10);

      const isFormValid = validateForm();
      if (isFormValid) {
        const grnData = {
          purchaseOrderId: formData.purchaseOrderId,
          grnDate: formData.grnDate,
          receivedBy: formData.receivedBy,
          receivedDate: formData.receivedDate,
          status: combinedStatus,
          companyId: sessionStorage?.getItem("companyId") ?? null,
          receivedUserId: sessionStorage?.getItem("userId") ?? null,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          totalAmount: formData.totalAmount,
          permissionId: 20,
        };

        const response = await post_grn_master_api(grnData);

        const grnMasterId = response.data.result.grnMasterId;

        // Extract itemDetails from formData
        const itemDetailsData = formData.itemDetails.map(async (item) => {
          const detailsData = {
            grnMasterId,
            receivedQuantity: item.receivedQuantity,
            acceptedQuantity: item.acceptedQuantity,
            rejectedQuantity: item.rejectedQuantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            itemId: item.id,
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
      }, 3000);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
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

      updatedItemDetails[index].acceptedQuantity = Math.max(
        0,
        updatedItemDetails[index].acceptedQuantity
      );

      updatedItemDetails[index].unitPrice = !isNaN(
        parseFloat(updatedItemDetails[index].unitPrice)
      )
        ? Math.max(0, parseFloat(updatedItemDetails[index].unitPrice))
        : 0;

      updatedItemDetails[index].totalPrice =
        updatedItemDetails[index].acceptedQuantity *
        updatedItemDetails[index].unitPrice;

      updatedItemDetails[index].rejectedQuantity =
        updatedItemDetails[index].receivedQuantity -
        updatedItemDetails[index].acceptedQuantity;

      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
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
          id: "",
          receivedQuantity: 0,
          acceptedQuantity: 0,
          rejectedQuantity: 0,
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
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateTotalAmount = () => {
    return formData.itemDetails.reduce(
      (total, item) => total + item.acceptedQuantity * item.unitPrice,
      0
    );
  };

  const handlePurchaseOrderChange = (referenceId) => {
    const selectedPurchaseOrder = purchaseOrderOptions.find(
      (purchaseOrder) => purchaseOrder.referenceNo === referenceId
    );

    setSelectedPurchaseOrder(selectedPurchaseOrder);

    setFormData((prevFormData) => ({
      ...prevFormData,
      purchaseOrderId: selectedPurchaseOrder?.purchaseOrderId ?? "",
    }));
  };

  const handleStatusChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      status: selectedOption.id,
    }));
  };

  return {
    formData,
    validFields,
    validationErrors,
    selectedPurchaseOrder,
    purchaseOrderOptions,
    statusOptions,
    submissionStatus,
    alertRef,
    handleInputChange,
    handleItemDetailsChange,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    handleSubmit,
    calculateTotalAmount,
    handlePurchaseOrderChange,
    handleStatusChange,
  };
};

export default useGrn;
