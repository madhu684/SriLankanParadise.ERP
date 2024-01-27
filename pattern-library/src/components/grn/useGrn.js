import { useState } from "react";

const useGrn = () => {
  const [formData, setFormData] = useState({
    grnDate: "",
    receivedBy: "",
    receivedDate: "",
    itemDetails: [],
    totalAmount: 0,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

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

    // Additional validations for itemDetails as needed
    return isGrnDateValid && isReceivedByValid && isReceivedDateValid;
  };

  const handleSubmit = async () => {
    try {
      const isFormValid = validateForm();
      if (isFormValid) {
        console.log("Inside the API call for GRN");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
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

      updatedItemDetails[index].unitPrice = !isNaN(parseFloat(value))
        ? Math.max(0, parseFloat(updatedItemDetails[index].unitPrice))
        : 0;

      updatedItemDetails[index].totalPrice = (
        updatedItemDetails[index].acceptedQuantity *
        updatedItemDetails[index].unitPrice
      ).toFixed(2);
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
        totalAmount: calculateTotalAmount().toFixed(2),
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

  const formatDateTime = () => {
    const currentDateTime = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return currentDateTime.toLocaleDateString("en-US", options);
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

  return {
    formData,
    validFields,
    validationErrors,
    handleInputChange,
    handleItemDetailsChange,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    handleSubmit,
    calculateTotalAmount,
    formatDateTime,
  };
};

export default useGrn;
