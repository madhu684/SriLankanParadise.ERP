import { useState } from "react";
import { post_sales_person_api } from "../../services/salesApi";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const useSalesPerson = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    salesPersonCode: "",
    firstName: "",
    lastName: "",
    contactNo: "",
    email: "",
    isActive: true,
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  // Validators
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
    setValidFields({});
    setValidationErrors({});

    const salesPersonCodeValid = validateField(
      "salesPersonCode",
      "Sales person code",
      formData.salesPersonCode
    );
    const firstNameValid = validateField(
      "firstName",
      "First name",
      formData.firstName
    );
    const lastNameValid = validateField(
      "lastName",
      "Last name",
      formData.lastName
    );
    const contactNoValid = validateField(
      "contactNo",
      "Contact number",
      formData.contactNo
    );
    const emailValid = validateField("email", "Email", formData.email, {
      validationFunction: (value) => /\S+@\S+\.\S+/.test(value),
      errorMessage: "Please enter a valid email address",
    });

    return (
      salesPersonCodeValid &&
      firstNameValid &&
      lastNameValid &&
      contactNoValid &&
      emailValid
    );
  };

  //Handlers
  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  //Submission
  const handleSubmit = async () => {
    const isFormValid = validateForm();

    if (isFormValid) {
      setLoading(true);

      try {
        const salesPersonData = {
          salesPersonCode: formData.salesPersonCode,
          firstName: formData.firstName,
          lastName: formData.lastName,
          contactNo: formData.contactNo,
          email: formData.email,
          isActive: formData.isActive,
          createdBy: sessionStorage.getItem("userId"),
        };

        const response = await post_sales_person_api(salesPersonData);

        if (response.status === 409) {
          toast.error(response.message);
          setLoading(false);
          return;
        }

        if (response.status === 201) {
          toast.success("Sales person created successfully!");
          queryClient.invalidateQueries(["salesPersons"]);
          setTimeout(() => {
            setLoading(false);
            onFormSubmit();
            setFormData({
              salesPersonCode: "",
              firstName: "",
              lastName: "",
              contactNo: "",
              email: "",
              isActive: true,
            });
          }, 3000);
        } else {
          toast.error("Failed to create sales person!");
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  console.log("formData: ", formData);

  return {
    formData,
    validFields,
    validationErrors,
    loading,
    handleInputChange,
    handleSubmit,
  };
};

export default useSalesPerson;
