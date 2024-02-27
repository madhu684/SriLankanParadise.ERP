import { useState, useEffect, useRef } from "react";
import {
  get_units_by_company_id_api,
  get_categories_by_company_id_api,
  post_item_master_api,
} from "../../services/inventoryApi";

const useItemMaster = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    unitId: "",
    categoryId: "",
    itemName: "",
    stockQuantity: "",
    sellingPrice: "",
    costPrice: "",
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [unitOptions, setUnitOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await get_units_by_company_id_api(1);
        setUnitOptions(response.data.result);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    fetchUnits();
  }, []);

  useEffect(() => {
    const fetchcategories = async () => {
      try {
        const response = await get_categories_by_company_id_api(1);
        setCategoryOptions(response.data.result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchcategories();
  }, []);

  useEffect(() => {
    if (submissionStatus != null) {
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
    const isUnitValid = validateField("unitId", "Unit", formData.unitId);

    const isCategoryValid = validateField(
      "categoryId",
      "Category",
      formData.categoryId
    );

    const isItemNameValid = validateField(
      "itemName",
      "Item name",
      formData.itemName
    );

    const isStockQuantityValid = validateField(
      "stockQuantity",
      "Stock quantity",
      formData.stockQuantity,
      {
        validationFunction: (quantity) =>
          /^\d*\.?\d+$/.test(quantity) && parseFloat(quantity) > 0,
        errorMessage: "Quantity must be a positive numeric value",
      }
    );

    const isSellingPriceValid = validateField(
      "sellingPrice",
      "Selling price",
      formData.sellingPrice,
      {
        validationFunction: (sellingPrice) =>
          /^\d*\.?\d+$/.test(sellingPrice) && parseFloat(sellingPrice) >= 0,
        errorMessage: "Selling price must be a positive numeric value",
      }
    );

    const isCostPriceValid = validateField(
      "costPrice",
      "Cost price",
      formData.costPrice,
      {
        validationFunction: (costPrice) =>
          /^\d*\.?\d+$/.test(costPrice) && parseFloat(costPrice) >= 0,
        errorMessage: "Cost price must be a positive numeric value",
      }
    );
    return (
      isUnitValid &&
      isCategoryValid &&
      isItemNameValid &&
      isStockQuantityValid &&
      isSellingPriceValid &&
      isCostPriceValid
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? false : true;

      const isFormValid = validateForm();
      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const itemMasterData = {
          unitId: formData.unitId,
          categoryId: formData.categoryId,
          itemName: formData.itemName,
          stockQuantity: formData.stockQuantity,
          sellingPrice: formData.sellingPrice,
          costPrice: formData.costPrice,
          status: status,
          companyId: sessionStorage.getItem("companyId"),
          createdBy: sessionStorage.getItem("username"),
          createdUserId: sessionStorage.getItem("userId"),
          permissionId: 1039,
        };

        const response = await post_item_master_api(itemMasterData);

        if (response.status === 201) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Item master saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Item master created successfully!", formData);
          }

          setTimeout(() => {
            setSubmissionStatus(null);
            onFormSubmit();
            setLoading(false);
            setLoadingDraft(false);
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

  return {
    formData,
    validFields,
    validationErrors,
    categoryOptions,
    unitOptions,
    submissionStatus,
    alertRef,
    loading,
    loadingDraft,
    handleInputChange,
    handleSubmit,
  };
};

export default useItemMaster;
