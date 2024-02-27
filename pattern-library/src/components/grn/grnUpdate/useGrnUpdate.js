import { useState, useEffect, useRef } from "react";
import { get_purchase_orders_with_out_drafts_api } from "../../../services/purchaseApi";
import {
  put_grn_master_api,
  put_grn_detail_api,
  post_grn_detail_api,
  delete_grn_detail_api,
} from "../../../services/purchaseApi";

const useGrnUpdate = ({ grn, onFormSubmit }) => {
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
  const [itemIdsToBeDeleted, setItemIdsToBeDeleted] = useState([]);
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
    const deepCopyGrn = JSON.parse(JSON.stringify(grn));
    setFormData({
      grnDate: deepCopyGrn?.grnDate?.split("T")[0] ?? "",
      receivedBy: deepCopyGrn?.receivedBy ?? "",
      receivedDate: deepCopyGrn?.receivedDate?.split("T")[0] ?? "",
      itemDetails: deepCopyGrn?.grnDetails ?? [],
      status: deepCopyGrn?.status?.toString().charAt(0) ?? "",
      purchaseOrderId: deepCopyGrn?.purchaseOrderId ?? "",
      totalAmount: deepCopyGrn?.totalAmount ?? "",
      attachments: deepCopyGrn?.attachments ?? [],
    });
  }, [grn]);

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalAmount: calculateTotalAmount(),
    }));
  }, [formData.itemDetails]);

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

      console.log(combinedStatus);
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
          permissionId: 22,
        };

        const response = await put_grn_master_api(grn.grnMasterId, grnData);

        // Extract itemDetails from formData
        const itemDetailsData = formData.itemDetails.map(async (item) => {
          let detailsApiResponse;
          const detailsData = {
            grnMasterId: grn.grnMasterId,
            receivedQuantity: item.receivedQuantity,
            acceptedQuantity: item.acceptedQuantity,
            rejectedQuantity: item.rejectedQuantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            itemId: item.itemId,
            permissionId: 22,
          };

          if (item.grnDetailId != null) {
            // Call put_grn_detail_api for each item
            detailsApiResponse = await put_grn_detail_api(
              item.grnDetailId,
              detailsData
            );
          } else {
            // Call post_grn_detail_api for each item
            detailsApiResponse = await post_grn_detail_api(detailsData);
          }
          return detailsApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetailsData);

        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201 || 200
        );

        for (const itemIdToBeDeleted of itemIdsToBeDeleted) {
          const response = await delete_grn_detail_api(itemIdToBeDeleted);
          console.log(
            `Successfully deleted item with ID: ${itemIdToBeDeleted}`
          );
        }
        // Clear the itmeIdsToBeDeleted array after deletion
        setItemIdsToBeDeleted([]);

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
          itemId: "",
          receivedQuantity: 0,
          acceptedQuantity: 0,
          rejectedQuantity: 0,
          unitPrice: 0.0,
          totalPrice: 0.0,
        },
      ],
    }));
  };

  const handleRemoveItem = (index, grnDetailId) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails.splice(index, 1);
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });

    if (grnDetailId !== null && grnDetailId !== undefined) {
      setItemIdsToBeDeleted((prevIds) => [...prevIds, grnDetailId]);
    }
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

export default useGrnUpdate;
