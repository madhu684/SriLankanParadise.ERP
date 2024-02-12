import { useState } from "react";

const useCategory = () => {
  const [formData, setFormData] = useState({
    categoryId: "",
    categoryName: "",
    status: "",
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

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
    formatDateTime,
    handleInputChange,
    handleSubmit,
  };
};

export default useCategory;
