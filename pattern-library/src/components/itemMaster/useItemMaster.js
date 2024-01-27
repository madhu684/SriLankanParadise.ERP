import { useState } from "react";

const useItemMaster = () => {
  const [formData, setFormData] = useState({
    itemMasterId: "",
    unitId: "",
    categoryId: "",
    itemName: "",
    stockQuantity: "",
    sellingPrice: "",
    costPrice: "",
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const categoryOptions = [
    { id: "1", name: "Category 1" },
    { id: "2", name: "Category 2" },
    { id: "3", name: "Category 3" },
  ];
  const unitOptions = [
    { id: "1", name: "Unit 1" },
    { id: "2", name: "Unit 2" },
    { id: "3", name: "Unit 3" },
  ];

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {};

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

  return {
    formData,
    validFields,
    validationErrors,
    categoryOptions,
    unitOptions,
    formatDateTime,
    handleInputChange,
    handleSubmit,
  };
};

export default useItemMaster;
