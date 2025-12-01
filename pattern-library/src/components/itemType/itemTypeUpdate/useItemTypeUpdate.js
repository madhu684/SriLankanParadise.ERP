import React, { useCallback, useEffect, useMemo, useState } from "react";
import { put_item_type_api } from "../../../services/inventoryApi";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useItemTypeUpdate = ({ itemType, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    companyId: "",
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  useEffect(() => {
    if (!itemType) return;
    setFormData((prevData) => ({
      name: itemType.name,
      status: itemType.status === true ? "1" : "0",
      companyId: itemType.companyId,
    }));
  }, [itemType]);

  // Validators
  const validateField = useCallback(
    (fieldName, fieldDisplayName, value, additionalRules = {}) => {
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
    },
    []
  );

  const validateForm = useCallback(() => {
    const isNameValid = validateField("name", "Name", formData.name);
    const isStatusValid = validateField("status", "Status", formData.status);

    return isNameValid && isStatusValid;
  }, [formData, validateField]);

  // Handlers
  const handleInputChange = useCallback((field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  }, []);

  //Submission
  const handleSubmit = useCallback(async () => {
    try {
      const status = formData.status === "1" ? true : false;
      const isFormValid = validateForm();
      if (isFormValid) {
        setLoading(true);

        const itemTypeData = {
          name: formData.name,
          status: status,
          companyId: formData.companyId,
          permissionId: 1039,
        };

        const response = await put_item_type_api(
          itemType.itemTypeId,
          itemTypeData
        );

        if (response.status === 200) {
          queryClient.invalidateQueries(["itemTypes", companyId]);

          setTimeout(() => {
            onFormSubmit();
            setLoading(false);
          }, 3000);

          toast.success("Item type updated successfully!");
        } else {
          setLoading(false);
          toast.error("Failed to update item type!");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, companyId, onFormSubmit]);

  return {
    formData,
    validFields,
    validationErrors,
    loading,
    handleInputChange,
    handleSubmit,
  };
};

export default useItemTypeUpdate;
