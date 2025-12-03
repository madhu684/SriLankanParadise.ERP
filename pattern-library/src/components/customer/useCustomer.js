import { useState, useRef, useEffect } from "react";
import {
  get_regions_api,
  get_sales_persons_api,
  post_customer_api,
  post_customer_delivery_address_api,
} from "../../services/salesApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useCustomer = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerCode: "",
    contactPerson: "",
    phone: "",
    email: "",
    status: 1,
    billingAddress1: "",
    billingAddress2: "",
    lisenNumber: "",
    lisenStartDate: "",
    lisenEndDate: "",
    creditLimit: 0.0,
    creditDuration: 0,
    businessRegNo: "",
    isVatRegistered: "0",
    vatRegistrationNo: null,
    deliveryAddresses: [{ addressLine1: "", addressLine2: "" }],
    selectedSalesPerson: null,
    salesPersonId: null,
    regionId: null,
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [salesPersonSearchTerm, setSalesPersonSearchTerm] = useState("");
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  // Fetch data
  const { data: regions = [], isLoading: isRegionsLoading } = useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const response = await get_regions_api();
      return response.data.result || [];
    },
  });

  const {
    data: salesPersons,
    isLoading: isSalesPersonsLoading,
    isError: isSalesPersonsError,
    error: salesPersonsError,
  } = useQuery({
    queryKey: ["salesPersons"],
    queryFn: async () => {
      const response = await get_sales_persons_api();
      return response.data.result || [];
    },
  });

  // Sync billing address with first delivery address
  useEffect(() => {
    if (formData.deliveryAddresses.length > 0) {
      const firstAddress = formData.deliveryAddresses[0];
      setFormData((prevData) => ({
        ...prevData,
        billingAddress1: firstAddress.addressLine1,
        billingAddress2: firstAddress.addressLine2,
      }));
    }
  }, [formData.deliveryAddresses]);

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current?.scrollIntoView({ behavior: "smooth" });
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

    const isCustomerNameValid = validateField(
      "customerName",
      "Customer Name",
      formData.customerName
    );

    const isPhoneValid = validateField(
      "phone",
      "Phone number",
      formData.phone,
      {
        validationFunction: (phone) => /^\d+$/.test(phone),
        errorMessage: "Invalid phone number. Please enter only digits.",
      }
    );

    const isEmailValid = validateField("email", "Email", formData.email, {
      validationFunction: (value) => /\S+@\S+\.\S+/.test(value),
      errorMessage: "Please enter a valid email address",
    });

    const isCustomerCodeValid = validateField(
      "customerCode",
      "Customer Code",
      formData.customerCode
    );

    const isContactPersonValid = validateField(
      "contactPerson",
      "Contact Person",
      formData.contactPerson
    );

    const isCreditLimitValid = validateField(
      "creditLimit",
      "Credit Limit",
      formData.creditLimit,
      {
        validationFunction: (value) => /^\d+(\.\d+)?$/.test(value),
        errorMessage: "Please enter a valid credit limit",
      }
    );

    const isCreditDurationValid = validateField(
      "creditDuration",
      "Credit Duration",
      formData.creditDuration,
      {
        validationFunction: (value) => /^\d+$/.test(value),
        errorMessage: "Please enter a valid credit duration",
      }
    );

    const isBusinessRegNoValid = validateField(
      "businessRegNo",
      "Business Registration Number",
      formData.businessRegNo
    );

    const isVatRegistrationNoValid =
      formData.isVatRegistered === "1"
        ? validateField(
            "vatRegistrationNo",
            "VAT Registration Number",
            formData.vatRegistrationNo
          )
        : true;

    const isLisenStartDateValid = validateField(
      "lisenStartDate",
      "License Start Date",
      formData.lisenStartDate
    );

    const isLisenEndDateValid = validateField(
      "lisenEndDate",
      "License End Date",
      formData.lisenEndDate
    );

    const isLisenNumberValid = validateField(
      "lisenNumber",
      "License Number",
      formData.lisenNumber
    );

    const isVatRegisteredValid = validateField(
      "isVatRegistered",
      "VAT Registered",
      formData.isVatRegistered
    );

    const isRegionValid = validateField(
      "regionId",
      "Region",
      formData.regionId
    );

    const isSalesPErsonValid = validateField(
      "salesPersonId",
      "Sales Person",
      formData.salesPersonId
    );

    // Validate delivery addresses (billing address is auto-synced from first delivery address)
    let areDeliveryAddressesValid = true;
    formData.deliveryAddresses.forEach((address, index) => {
      const isLine1Valid = validateField(
        `deliveryAddress${index}Line1`,
        `Delivery Address ${index + 1} Line 1`,
        address.addressLine1
      );
      const isLine2Valid = validateField(
        `deliveryAddress${index}Line2`,
        `Delivery Address ${index + 1} Line 2`,
        address.addressLine2
      );

      if (!isLine1Valid || !isLine2Valid) {
        areDeliveryAddressesValid = false;
      }
    });

    return (
      isCustomerNameValid &&
      isPhoneValid &&
      isEmailValid &&
      isCustomerCodeValid &&
      isContactPersonValid &&
      isCreditLimitValid &&
      isCreditDurationValid &&
      isBusinessRegNoValid &&
      isVatRegistrationNoValid &&
      isLisenStartDateValid &&
      isLisenEndDateValid &&
      isLisenNumberValid &&
      isVatRegisteredValid &&
      isRegionValid &&
      isSalesPErsonValid &&
      areDeliveryAddressesValid
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSelectSalesPerson = (selectedSalesPerson) => {
    setFormData((prev) => ({
      ...prev,
      salesPersonId: selectedSalesPerson.salesPersonId,
      selectedSalesPerson,
    }));
    setSalesPersonSearchTerm("");
    setValidFields({});
    setValidationErrors({});
  };

  const handleResetSalesPerson = () => {
    setFormData((prev) => ({
      ...prev,
      selectedSalesPerson: null,
      salesPersonId: null,
    }));
  };

  // Add a new delivery address
  const addDeliveryAddress = () => {
    setFormData((prevData) => ({
      ...prevData,
      deliveryAddresses: [
        ...prevData.deliveryAddresses,
        { addressLine1: "", addressLine2: "" },
      ],
    }));
  };

  // Remove a delivery address (prevent removing the first one)
  const removeDeliveryAddress = (index) => {
    if (index === 0) {
      console.warn(
        "Cannot remove the first delivery address as it serves as the billing address"
      );
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      deliveryAddresses: prevData.deliveryAddresses.filter(
        (_, i) => i !== index
      ),
    }));

    // Clear validation errors for this address
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`deliveryAddress${index}Line1`];
      delete newErrors[`deliveryAddress${index}Line2`];
      return newErrors;
    });
  };

  // Handle delivery address field changes
  const handleDeliveryAddressChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedAddresses = [...prevData.deliveryAddresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        [field]: value,
      };
      return {
        ...prevData,
        deliveryAddresses: updatedAddresses,
      };
    });
  };

  // Post delivery addresses after customer creation
  const postDeliveryAddresses = async (customerId) => {
    const promises = formData.deliveryAddresses.map((address) => {
      const deliveryAddressData = {
        customerId: customerId,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
      };
      return post_customer_delivery_address_api(deliveryAddressData);
    });

    try {
      await Promise.all(promises);
      console.log("All delivery addresses posted successfully");
      return true;
    } catch (error) {
      console.error("Error posting delivery addresses:", error);
      return false;
    }
  };

  const handleFormSubmit = async () => {
    try {
      const isFormValid = validateForm();

      if (isFormValid) {
        setLoading(true);

        const customerData = {
          customerName: formData.customerName,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
          email: formData.email,
          companyId: sessionStorage.getItem("companyId"),
          customerCode: formData.customerCode,
          status: formData.status,
          billingAddressLine1: formData.billingAddress1,
          billingAddressLine2: formData.billingAddress2,
          lisenNumber: formData.lisenNumber,
          lisenStartDate: formData.lisenStartDate.split("T")[0],
          lisenEndDate: formData.lisenEndDate.split("T")[0],
          creditLimit: parseFloat(formData.creditLimit),
          creditDuration: parseInt(formData.creditDuration),
          outstandingBalance: 0,
          businessRegistrationNo: formData.businessRegNo,
          isVatRegistered: formData.isVatRegistered === "1" ? true : false,
          vatRegistrationNo: formData.vatRegistrationNo,
          salesPersonId: formData.salesPersonId,
          regionId: formData.regionId,
        };

        const response = await post_customer_api(customerData);

        if (response.status === 201) {
          const customerId =
            response.data.result.customerId || response.data.result.id;

          // Post delivery addresses if any exist
          if (formData.deliveryAddresses.length > 0) {
            const deliveryAddressSuccess = await postDeliveryAddresses(
              customerId
            );

            if (!deliveryAddressSuccess) {
              console.warn(
                "Customer created but some delivery addresses failed to save"
              );
            }
          }

          setSubmissionStatus("success");
          console.log("Customer added successfully", customerData);

          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            onFormSubmit(response.data.result);
            queryClient.invalidateQueries([
              "customers",
              sessionStorage.getItem("companyId"),
            ]);
          }, 3000);
        } else {
          setSubmissionStatus("error");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
      setTimeout(() => {
        setSubmissionStatus(null);
        setLoading(false);
      }, 3000);
    }
  };

  console.log("Form Data: ", formData);

  return {
    regions,
    salesPersons,
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    alertRef,
    loading,
    salesPersonSearchTerm,
    setSalesPersonSearchTerm,
    validateForm,
    handleInputChange,
    handleFormSubmit,
    addDeliveryAddress,
    removeDeliveryAddress,
    handleDeliveryAddressChange,
    handleSelectSalesPerson,
    handleResetSalesPerson,
  };
};

export default useCustomer;
