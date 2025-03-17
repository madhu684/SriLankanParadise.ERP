import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { get_company_suppliers_api } from "../../services/purchaseApi";

const useSupplierReturn = () => {
  const [formData, setFormData] = useState({
    supplierId: 0,
    supplier: "",
    returnDate: "",
    returnItemDetails: [],
    status: 0,
    selectedSupplier: "",
  });
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const fetchSuppliers = async () => {
    try {
      const response = await get_company_suppliers_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const {
    data: suppliers,
    isLoading: isLoadingSuppliers,
    isError: isErrorSuppliers,
    error: errorSuppliers,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  const handleSelectSupplier = (selectedSupplier) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      supplierId: selectedSupplier.supplierId,
      selectedSupplier: selectedSupplier,
    }));
    console.log("selectedSupplier", selectedSupplier);
    setSupplierSearchTerm(""); // Clear the supplier search term
    // setValidFields({})
    // setValidationErrors({})
  };

  const handleResetSupplier = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedSupplier: "",
      supplierId: "",
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  console.log("formData", formData);

  return {
    formData,
    suppliers,
    isLoadingSuppliers,
    isErrorSuppliers,
    errorSuppliers,
    supplierSearchTerm,
    setSupplierSearchTerm,
    handleSelectSupplier,
    handleResetSupplier,
    handleInputChange,
  };
};

export default useSupplierReturn;
