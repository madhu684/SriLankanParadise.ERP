import { useState, useEffect, useRef } from "react";
import {
  put_company_api,
  get_subscriptions_api,
} from "../../../../services/userManagementApi";

const useUpdateCompanyForm = ({ onFormSubmit, companyData }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    subscriptionPlan: "",
    subscriptionExpiredDate: "",
    logoPath: "",
    maxUserCount: 0,
    status: false,
    logo: null,
  });
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const successAlertRef = useRef(null);
  const [updateCompanySuccessfull, setUpdateCompanySuccessfull] =
    useState(false);
  const [validFields, setValidFields] = useState({
    companyName: null,
    logo: null,
  });
  const [validationErrors, setValidationErrors] = useState({
    companyName: "",
    logo: "",
  });

  useEffect(() => {
    setFormData({
      companyName: companyData?.companyName,
      subscriptionPlan: companyData?.subscriptionPlanId,
      subscriptionExpiredDate: companyData?.subscriptionExpiredDate,
      maxUserCount: companyData?.maxUserCount,
      status: companyData?.status,
      logoPath: companyData?.logoPath,
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

  const handleFormSubmit = async () => {
    try {
      const updateCompanyData = {
        companyName: formData.companyName,
        subscriptionPlanId: formData.subscriptionPlan,
        subscriptionExpiredDate: formData.subscriptionExpiredDate,
        permissionId: 7,
        logoPath: formData.logoPath,
        maxUserCount: formData.maxUserCount,
        status: formData.status,
      };

      const companyResponse = await put_company_api(
        companyData.companyId,
        updateCompanyData
      );
      setUpdateCompanySuccessfull(true);
      console.log("Company updated successfully:", companyResponse);
    } catch (error) {
      console.error("Error updating company details:", error);
      // Handle error if needed
    }
  };

  return {
    formData,
    subscriptionPlans,
    showSuccessAlert,
    validFields,
    validationErrors,
    successAlertRef,
    setFormData,
    handleChange,
    setShowSuccessAlert,
    handleFormSubmit,
  };
};

export default useUpdateCompanyForm;
