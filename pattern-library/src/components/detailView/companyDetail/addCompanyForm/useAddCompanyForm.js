import { useState, useEffect } from "react";
import {
  post_company_api,
  post_company_logo_api,
} from "../../../../services/userManagementApi";

const useAddCompanyForm = (onFormSubmit) => {
  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState(null);
  const [addCompanySuccessfull, setAddCompanySuccessfull] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [validFields, setValidFields] = useState({
    companyName: null,
    logo: null,
  });

  const [validationErrors, setValidationErrors] = useState({
    companyName: "",
    logo: "",
  });

  const validateForm = () => {
    // Validate companyName
    const isCompanyNameValid = companyName.trim() !== "";
    setValidFields((prev) => ({ ...prev, companyName: isCompanyNameValid }));
    setValidationErrors((prev) => ({
      ...prev,
      companyName: isCompanyNameValid ? "" : "Company name is required",
    }));

    //Validate logo
    const isLogoValid = !!logo && logo.type.startsWith("image/");
    setValidFields((prev) => ({ ...prev, logo: isLogoValid }));
    setValidationErrors((prev) => ({
      ...prev,
      logo: isLogoValid ? "" : "Please select a valid image file",
    }));

    return isCompanyNameValid && isLogoValid;
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setLogo(file);
    } else {
      setLogo(null);
    }
  };

  useEffect(() => {
    if (addCompanySuccessfull) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        setAddCompanySuccessfull(false);
        onFormSubmit();
      }, 3000);
    }
  }, [addCompanySuccessfull, onFormSubmit]);

  const handleFormSubmit = async () => {
    try {
      const isFormValid = validateForm();

      if (isFormValid) {
        const uploadData = {
          permissionId: 6,
          logoFile: logo,
        };

        const logoResponse = await post_company_logo_api(uploadData);

        const logoPath = logoResponse.data.result;

        const companyData = {
          companyName: companyName,
          subscriptionPlanId: null,
          subscriptionExpiredDate: null,
          permissionId: 6,
          logoPath: logoPath,
          maxUserCount: null,
        };

        const companyResponse = await post_company_api(companyData);

        setCompanyName("");
        setLogo(null);
        setAddCompanySuccessfull(true);
        console.log("Company added successfully:", companyResponse);
      }
    } catch (error) {
      console.error("Error adding company:", error);
      // Handle error if needed
    }
  };

  return {
    setCompanyName,
    handleLogoChange,
    handleFormSubmit,
    setShowSuccessAlert,
    showSuccessAlert,
    companyName,
    addCompanySuccessfull,
    validFields,
    validationErrors,
  };
};

export default useAddCompanyForm;
