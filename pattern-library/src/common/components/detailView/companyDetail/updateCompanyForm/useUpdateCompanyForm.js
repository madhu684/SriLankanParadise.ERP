import { useState, useEffect, useRef } from "react";
import {
  put_company_api,
  get_subscriptions_api,
  post_company_logo_api,
} from "common/services/userManagementApi";
import { API_BASE_URL } from "common/services/userManagementApi";

const useUpdateCompanyForm = ({ onFormSubmit, companyData }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    subscriptionPlan: "",
    subscriptionExpiredDate: "",
    logoPath: "",
    maxUserCount: 0,
    status: "",
    logo: null,
    batchStockType: "",
  });
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const successAlertRef = useRef(null);
  const [updateCompanySuccessfull, setUpdateCompanySuccessfull] =
    useState(null);
  const [validFields, setValidFields] = useState({
    companyName: null,
    logo: null,
  });
  const [validationErrors, setValidationErrors] = useState({
    companyName: "",
    logo: "",
  });
  const [batchStockType, setBatchStockType] = useState("");
  const [companyLogoUrl, setCompanyLogoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      companyName: companyData?.companyName ?? "",
      subscriptionPlan: companyData?.subscriptionPlanId ?? "Not Subscribed",
      subscriptionExpiredDate:
        companyData?.subscriptionExpiredDate?.split("T")[0],
      maxUserCount: companyData?.maxUserCount,
      status: companyData?.status ?? "",
      logoPath: companyData?.logoPath ?? "",
      logo: null,
      batchStockType: companyData?.batchStockType ?? "",
    });
  }, [companyData]);

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        const response = await get_subscriptions_api();
        setSubscriptionPlans(response.data.result);
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      }
    };

    fetchSubscriptionPlans();
  }, [companyData.companyId]);

  useEffect(() => {
    if (updateCompanySuccessfull) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        setUpdateCompanySuccessfull(false);
        setLoading(false);
        onFormSubmit();
      }, 2000);
    }
  }, [updateCompanySuccessfull, onFormSubmit]);

  useEffect(() => {
    if (showSuccessAlert) {
      // Scroll to the success alert when it becomes visible
      successAlertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showSuccessAlert]);

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

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
    //setValidFields({});
    //setValidationErrors({});

    const isCompanyNameValid = validateField(
      "companyName",
      "Company name",
      formData.companyName
    );

    const isStatusValid = validateField("status", "Status", formData.status);

    const isBatchStockTypeValid = validateField(
      "batchStockType",
      "Batch Stock Type",
      formData.batchStockType
    );

    const isSubscriptionPlanValid = validateField(
      "subscriptionPlan",
      "Subscription plan",
      formData.subscriptionPlan
    );

    const isLogoValid = validFields?.logo ?? true;

    return (
      isCompanyNameValid &&
      isStatusValid &&
      isSubscriptionPlanValid &&
      isBatchStockTypeValid &&
      isLogoValid
    );
  };

  const handleFormSubmit = async () => {
    try {
      const isFormValid = validateForm();
      let logoPath = formData?.logoPath;

      if (isFormValid) {
        setLoading(true);

        if (formData.logo !== null) {
          const uploadData = {
            permissionId: 6,
            logoFile: formData.logo,
          };

          const logoResponse = await post_company_logo_api(uploadData);

          logoPath = logoResponse.data.result;
        }

        const updateCompanyData = {
          companyName: formData.companyName,
          subscriptionPlanId:
            formData?.subscriptionPlan === "Not Subscribed"
              ? null
              : formData.subscriptionPlan,
          subscriptionExpiredDate:
            formData?.subscriptionExpiredDate === ""
              ? null
              : formData?.subscriptionExpiredDate,
          permissionId: 7,
          logoPath: logoPath,
          maxUserCount: formData.maxUserCount,
          status: formData.status,
          batchStockType: formData.batchStockType,
        };

        const companyResponse = await put_company_api(
          companyData.companyId,
          updateCompanyData
        );
        setUpdateCompanySuccessfull(true);
        console.log("Company updated successfully:", companyResponse);
      }
    } catch (error) {
      console.error("Error updating company details:", error);
      // Handle error if needed
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, logo: file }));
      setValidFields((prev) => ({ ...prev, logo: true }));
      setValidationErrors((prev) => ({
        ...prev,
        logo: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, logo: null }));
      setValidFields((prev) => ({ ...prev, logo: false }));
      setValidationErrors((prev) => ({
        ...prev,
        logo: "Please select a valid image file",
      }));
    }
  };

  useEffect(() => {
    const generateCompanyLogoUrl = () => {
      try {
        const baseApiUrl = API_BASE_URL.replace(/\/api(?!.*\/api)/, "");

        const companyLogoPath = companyData?.logoPath;

        if (companyLogoPath) {
          const adjustedRelativePath = companyLogoPath
            .replace(/\\/g, "/")
            .replace("wwwroot/", "");

          const url = `${baseApiUrl}/${adjustedRelativePath}`;
          setCompanyLogoUrl(url);
          console.log(url);
        } else {
          setCompanyLogoUrl(null);
        }
      } catch (error) {
        console.error("Error generating company logo url:", error);
        setCompanyLogoUrl(null);
      }
    };

    generateCompanyLogoUrl();
  }, [companyData]);

  return {
    formData,
    subscriptionPlans,
    showSuccessAlert,
    validFields,
    validationErrors,
    successAlertRef,
    batchStockType,
    companyLogoUrl,
    loading,
    updateCompanySuccessfull,
    setFormData,
    handleChange,
    setShowSuccessAlert,
    handleFormSubmit,
    setBatchStockType,
    handleLogoChange,
  };
};

export default useUpdateCompanyForm;














