import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { put_sales_person_api } from "../../../services/salesApi";

const SalesPersonUpdate = ({ salesPerson, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    salesPersonCode: "",
    firstName: "",
    lastName: "",
    contactNo: "",
    email: "",
    isActive: true,
    createdBy: "",
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  // Initial data binding
  useEffect(() => {
    if (salesPerson) {
      setFormData({
        salesPersonCode: salesPerson.salesPersonCode,
        firstName: salesPerson.firstName,
        lastName: salesPerson.lastName,
        contactNo: salesPerson.contactNo,
        email: salesPerson.email,
        isActive: salesPerson.isActive,
        createdBy: salesPerson.createdBy,
      });
    }
  }, [salesPerson]);

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
          createdBy: formData.createdBy,
        };

        const response = await put_sales_person_api(
          salesPerson.salesPersonId,
          salesPersonData
        );

        if (response.status === 200) {
          toast.success("Sales person updated successfully!");
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
          toast.error("Failed to update sales person!");
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

  return {
    formData,
    validFields,
    validationErrors,
    loading,
    handleInputChange,
    handleSubmit,
  };
};

export default SalesPersonUpdate;
