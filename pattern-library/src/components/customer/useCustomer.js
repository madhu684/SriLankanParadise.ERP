import { useState } from "react";
import { post_customer_api } from "../../services/salesApi";

const useCustomer = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    contactPerson: "",
    phone: "",
    email: "",
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);

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

  const validateForm = () => {
    const isCustomerNameValid = validateField(
      "customerName",
      "Customer name",
      formData.customerName
    );

    const isContactPersonValid = validateField(
      "contactPerson",
      "Contact person",
      formData.contactPerson
    );

    const isPhoneValid = validateField(
      "phone",
      "Phone number",
      formData.phone,
      {
        validationFunction: (phone) => /^\d+$/.test(phone),
        errorMessage: "Invalid phone number. Please enter only digits.",
      }
    );

    const isEmailValid = validateField("email", "Email", formData.email, {
      validationFunction: (email) => /\S+@\S+\.\S+/.test(email),
      errorMessage: "Invalid email address.",
    });

    return (
      isCustomerNameValid &&
      isContactPersonValid &&
      isPhoneValid &&
      isEmailValid
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const isFormValid = validateForm();

      if (isFormValid) {
        const customerData = {
          customerName: formData.customerName,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
          email: formData.email,
          companyId: 1, //sessionStorage.getItem("companyId")
          permissionId: 24,
        };

        const response = await post_customer_api(customerData);

        if (response.status === 201) {
          setSubmissionStatus("success");
          console.log("Custermer added successfully", customerData);
          setTimeout(() => {
            setSubmissionStatus(null);
            onFormSubmit(response.data.result);
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

  return {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    handleInputChange,
    handleSubmit,
  };
};

export default useCustomer;
