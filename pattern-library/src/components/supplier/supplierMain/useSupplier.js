import { useState, useEffect, useRef } from "react";
import {
  get_company_types_api,
  get_business_types_api,
  post_supplier_api,
  post_supplier_logo_api,
  post_supplier_category_api,
  post_supplier_attachment_api,
  post_supplier_attachment_info_api,
} from "../../../services/purchaseApi";
import { get_categories_by_company_id_api } from "../../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const useSupplier = ({ onFormSubmit }) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    supplierName: "",
    addressLine1: "",
    addressLine2: "",
    contactPerson: "",
    phone: "",
    contactNumber: "",
    email: "",
    categories: [],
    businessRegistrationNo: "",
    vatRegistrationNo: "",
    companyTypeId: "",
    businessTypeId: "",
    supplierLogo: null,
    rating: 0,
    remarks: "",
    status: "",
    attachments: [],
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await get_categories_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const fetchCompanyTypes = async () => {
    try {
      const response = await get_company_types_api();
      return response.data.result;
    } catch (error) {
      console.error("Error fetching company types:", error);
    }
  };

  const {
    data: companyTypes,
    isLoading: isCompanyTypesLoading,
    isError: isCompanyTypesError,
    error: CompanyTypesError,
  } = useQuery({
    queryKey: ["companyTypes"],
    queryFn: fetchCompanyTypes,
  });

  const fetchBusinessTypes = async () => {
    try {
      const response = await get_business_types_api();
      return response.data.result;
    } catch (error) {
      console.error("Error fetching business types:", error);
    }
  };

  const {
    data: businessTypes,
    isLoading: isBusinessTypesLoading,
    isError: isBusinessTypesError,
    error: businessTypesError,
  } = useQuery({
    queryKey: ["businessTypes"],
    queryFn: fetchBusinessTypes,
  });

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
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

  const validateAttachments = (files) => {
    let isAttachmentsValid = true;
    let errorMessage = "";
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!files || files.length === 0) {
      isAttachmentsValid = true; // Attachments are optional, so it's considered valid if there are none.
      errorMessage = "";
    }

    for (const file of files) {
      if (file.size > maxSizeInBytes) {
        isAttachmentsValid = false;
        errorMessage = "Attachment size exceeds the limit (10MB)";
      }

      if (!allowedTypes.includes(file.type)) {
        isAttachmentsValid = false;
        errorMessage =
          "Invalid file type. Allowed types: JPEG, PNG, PDF, Word documents";
      }
    }

    setValidFields((prev) => ({ ...prev, attachments: isAttachmentsValid }));
    setValidationErrors((prev) => ({ ...prev, attachments: errorMessage }));

    return isAttachmentsValid;
  };

  const validateSupplierLogo = (file) => {
    if (!file) {
      // Logo is optional, so it's considered valid if there is none.
      setValidFields((prev) => ({ ...prev, supplierLogo: true }));
      setValidationErrors((prev) => ({ ...prev, supplierLogo: "" }));
      return true;
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];

    if (file.size > maxSizeInBytes) {
      setValidFields((prev) => ({ ...prev, supplierLogo: false }));
      setValidationErrors((prev) => ({
        ...prev,
        supplierLogo: "Logo size exceeds the limit (1MB)",
      }));
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      setValidFields((prev) => ({ ...prev, supplierLogo: false }));
      setValidationErrors((prev) => ({
        ...prev,
        supplierLogo: "Invalid file type. Allowed types: JPEG, PNG",
      }));
      return false;
    }

    setValidFields((prev) => ({ ...prev, supplierLogo: true }));
    setValidationErrors((prev) => ({ ...prev, supplierLogo: "" }));
    return true;
  };

  const validateForm = () => {
    setValidFields({});
    setValidationErrors({});

    const isSupplierNameValid = validateField(
      "supplierName",
      "Supplier name",
      formData.supplierName
    );

    const isAddressLine1Valid = validateField(
      "addressLine1",
      "Address line 1",
      formData.addressLine1
    );

    const isBusinessRegistrationNoValid = validateField(
      "businessRegistrationNo",
      "Business registration number",
      formData.businessRegistrationNo
    );

    const isCompanyTypeIdValid = validateField(
      "companyTypeId",
      "Company type",
      formData.companyTypeId
    );

    const isBusinessTypeIdValid = validateField(
      "businessTypeId",
      "Business type",
      formData.businessTypeId
    );

    const isStatusValid = validateField("status", "Status", formData.status);

    const isAttachmentsValid = validateAttachments(formData.attachments);

    const isSupplierLogoValid = validateSupplierLogo(formData.supplierLogo);

    const isEmailValid = formData.email
      ? validateField("email", "Email", formData.email, {
          validationFunction: (value) => /\S+@\S+\.\S+/.test(value),
          errorMessage: "Please enter a valid email address",
        })
      : true;

    const isPhoneValid = formData.phone
      ? validateField("phone", "Mobile number", formData.phone, {
          validationFunction: (value) => /^\d+$/.test(value),
          errorMessage: "Please enter a valid mobile number",
        })
      : true;

    const isContactNumberValid = validateField(
      "contactNumber",
      "Office contact number",
      formData.contactNumber,
      {
        validationFunction: (value) => /^\d+$/.test(value),
        errorMessage: "Please enter a valid contact number",
      }
    );

    return (
      isSupplierNameValid &&
      isAddressLine1Valid &&
      isEmailValid &&
      isPhoneValid &&
      isContactNumberValid &&
      isBusinessRegistrationNoValid &&
      isCompanyTypeIdValid &&
      isBusinessTypeIdValid &&
      isStatusValid &&
      isAttachmentsValid &&
      isSupplierLogoValid
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;
      let logoPath = null;
      let allDetailsSuccessful = true;
      let allAttachmentsSuccessful = true;

      // Get the current date and time in UTC timezone in the specified format
      const currentDate = new Date().toISOString();

      const isFormValid = validateForm(isSaveAsDraft);
      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        if (formData.supplierLogo !== null) {
          const uploadData = {
            permissionId: 1054,
            logoFile: formData.supplierLogo,
          };

          const logoResponse = await post_supplier_logo_api(uploadData);

          logoPath = logoResponse.data.result;
        }

        const supplierData = {
          supplierName: formData.supplierName,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
          email: formData.email,
          companyId: sessionStorage.getItem("companyId"),
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          officeContactNo: formData.contactNumber,
          businessRegistrationNo: formData.businessRegistrationNo,
          vatregistrationNo: formData.vatRegistrationNo,
          companyTypeId: formData.companyTypeId,
          businessTypeId: formData.businessTypeId,
          supplierLogoPath: logoPath,
          status: formData.status,
          rating: formData.rating,
          remarks: formData.remarks,
          createdDate: currentDate,
          lastUpdatedDate: currentDate,
          deletedDate: null,
          deletedUserId: null,
          createdUserId: sessionStorage.getItem("userId"),
          permissionId: 1054,
        };

        const response = await post_supplier_api(supplierData);

        const supplierId = response.data.result.supplierId;

        if (categories.length > 0) {
          // Extract supplier categories from formData
          const supplierCategoriesData = formData.categories.map(
            async (category) => {
              const categoryData = {
                supplierId,
                categoryId: parseInt(category),
                permissionId: 1073,
              };

              const categoriesApiResponse = await post_supplier_category_api(
                categoryData
              );

              return categoriesApiResponse;
            }
          );

          const categoriesResponses = await Promise.all(supplierCategoriesData);

          const allCategoryDetailsSuccessful = categoriesResponses.every(
            (categoryResponse) => categoryResponse.status === 201
          );

          allDetailsSuccessful = allCategoryDetailsSuccessful;
        } else {
          allDetailsSuccessful = true;
        }

        if (formData.attachments.length > 0) {
          // Iterate over each attachment and upload
          for (const attachment of formData.attachments) {
            const uploadData = {
              permissionId: 1075,
              attachmentFile: attachment,
            };

            const attachmentResponse = await post_supplier_attachment_api(
              uploadData
            );
            const attachmentPath = attachmentResponse.data.result;

            // Post attachment info to API
            const attachmentInfo = {
              supplierId: supplierId,
              attachmentPath: attachmentPath,
              status: 1,
              permissionId: 1075,
            };

            const attachmentInfoResponse =
              await post_supplier_attachment_info_api(attachmentInfo);

            if (
              attachmentResponse.status !== 201 ||
              attachmentInfoResponse.status !== 201
            ) {
              allAttachmentsSuccessful = false;
            }
          }
        }

        if (allDetailsSuccessful && allAttachmentsSuccessful) {
          setSubmissionStatus("successSubmitted");
          console.log("Supplier created successfully!", formData);

          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            setLoadingDraft(false);
            onFormSubmit();
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

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleAttachmentChange = (files) => {
    setValidFields({});
    setValidationErrors({});
    setFormData((prevFormData) => ({
      ...prevFormData,
      attachments: files,
    }));
  };

  const handleLogoUpload = (file) => {
    setValidFields({});
    setValidationErrors({});
    // Logic to handle the file upload
    setFormData({
      ...formData,
      supplierLogo: file,
    });
  };

  const handleRemoveCategory = (categoryIdToRemove) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(
        (categoryId) => categoryId !== categoryIdToRemove
      ),
    });
  };

  return {
    formData,
    categories,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    isError,
    isLoading,
    error,
    loading,
    loadingDraft,
    companyTypes,
    isCompanyTypesLoading,
    isCompanyTypesError,
    businessTypes,
    isBusinessTypesLoading,
    isBusinessTypesError,
    handleInputChange,
    handleSubmit,
    handleAttachmentChange,
    handleLogoUpload,
    handleRemoveCategory,
  };
};

export default useSupplier;
