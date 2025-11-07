import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  put_customer_api,
  post_customer_delivery_address_api,
  delete_customer_delivery_address_api,
  update_customer_delivery_address_api,
} from "../../../services/salesApi";

const useCustomerUpdate = ({ customer, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    customerCode: "",
    contactPerson: "",
    phone: "",
    email: "",
    status: 1,
    billingAddress1: "",
    billingAddress2: "",
    reigonId: 1,
    lisenNumber: "",
    lisenStartDate: "",
    lisenEndDate: "",
    creditLimit: 0.0,
    creditDuration: 0,
    outstandingBalance: 0.0,
    businessRegNo: "",
    isVatRegistered: "0",
    vatRegistrationNo: null,
    deliveryAddresses: [{ addressLine1: "", addressLine2: "" }],
  });
  const [addressIdsToDelete, setAddressIdsToDelete] = useState([]);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (customer) {
      setFormData({
        customerId: parseInt(customer.customerId),
        customerName: customer.customerName,
        customerCode: customer.customerCode,
        contactPerson: customer.contactPerson,
        phone: customer.phone,
        email: customer.email,
        companyId: customer.companyId,
        status: customer.status,
        billingAddress1: customer.billingAddressLine1,
        billingAddress2: customer.billingAddressLine2,
        reigonId: customer.reigonId,
        lisenNumber: customer.lisenNumber,
        lisenStartDate: customer.lisenStartDate.split("T")[0],
        lisenEndDate: customer.lisenEndDate.split("T")[0],
        creditLimit: customer.creditLimit,
        creditDuration: customer.creditDuration,
        outstandingBalance: customer.outstandingAmount,
        businessRegNo: customer.businessRegistrationNo,
        isVatRegistered: customer.isVATRegistered === true ? "1" : "0",
        vatRegistrationNo: customer.vatRegistrationNo || null,
        deliveryAddresses: customer.customerDeliveryAddress.map((address) => ({
          id: address.id,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          isNew: false, // Mark existing addresses
        })),
      });
    }
  }, [customer]);

  useEffect(() => {
    if (submissionStatus != null) {
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
      areDeliveryAddressesValid
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const addDeliveryAddress = () => {
    setFormData((prevData) => ({
      ...prevData,
      deliveryAddresses: [
        ...prevData.deliveryAddresses,
        { addressLine1: "", addressLine2: "", isNew: true },
      ],
    }));
  };

  const removeDeliveryAddress = (index, id) => {
    setFormData((prevData) => ({
      ...prevData,
      deliveryAddresses: prevData.deliveryAddresses.filter(
        (_, i) => i !== index
      ),
    }));

    // Only add to delete list if it has an ID (existing address)
    if (id) {
      setAddressIdsToDelete((prevIds) => [...prevIds, id]);
    }

    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`deliveryAddress${index}Line1`];
      delete newErrors[`deliveryAddress${index}Line2`];
      return newErrors;
    });
  };

  const handleDeliveryAddressChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedAddresses = [...prevData.deliveryAddresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        [field]: value,
      };

      const updatedData = {
        ...prevData,
        deliveryAddresses: updatedAddresses,
      };

      // If editing the Primary Billing Address, sync to billing fields
      if (index === 0) {
        if (field === "addressLine1") {
          updatedData.billingAddress1 = value;
        } else if (field === "addressLine2") {
          updatedData.billingAddress2 = value;
        }
      }

      return updatedData;
    });
  };

  // Post NEW delivery addresses
  const postDeliveryAddresses = async () => {
    const newAddresses = formData.deliveryAddresses.filter(
      (address) => address.isNew === true
    );

    if (newAddresses.length === 0) return true;

    const promises = newAddresses.map((address) => {
      const deliveryAddressData = {
        customerId: formData.customerId,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
      };
      return post_customer_delivery_address_api(deliveryAddressData);
    });

    try {
      await Promise.all(promises);
      console.log("All new delivery addresses posted successfully");
      return true;
    } catch (error) {
      console.error("Error posting delivery addresses:", error);
      return false;
    }
  };

  // Update EXISTING delivery addresses
  const updateDeliveryAddresses = async () => {
    const existingAddresses = formData.deliveryAddresses.filter(
      (address) => address.id && address.isNew !== true
    );

    if (existingAddresses.length === 0) return true;

    const promises = existingAddresses.map((address) => {
      const deliveryAddressData = {
        customerId: formData.customerId,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
      };
      return update_customer_delivery_address_api(
        address.id,
        deliveryAddressData
      );
    });

    try {
      await Promise.all(promises);
      console.log("All delivery addresses updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating delivery addresses:", error);
      return false;
    }
  };

  // Delete delivery addresses
  const deleteDeliveryAddresses = async (idArray) => {
    if (!idArray || idArray.length === 0) return true;

    const promises = idArray.map((addressId) => {
      return delete_customer_delivery_address_api(parseInt(addressId));
    });

    try {
      await Promise.all(promises);
      console.log("Delivery addresses deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting delivery addresses:", error);
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
          companyId: formData.companyId,
          customerCode: formData.customerCode,
          status: formData.status,
          billingAddressLine1: formData.billingAddress1,
          billingAddressLine2: formData.billingAddress2,
          reigonId: 1,
          lisenNumber: formData.lisenNumber,
          lisenStartDate: formData.lisenStartDate,
          lisenEndDate: formData.lisenEndDate,
          creditLimit: parseFloat(formData.creditLimit),
          creditDuration: parseInt(formData.creditDuration),
          outstandingAmount: formData.outstandingBalance,
          businessRegistrationNo: formData.businessRegNo,
          isVatRegistered: formData.isVatRegistered === "1" ? true : false,
          vatRegistrationNo: formData.vatRegistrationNo,
        };

        const response = await put_customer_api(
          formData.customerId,
          customerData
        );

        if (response.status === 200) {
          // Handle delivery addresses in parallel
          const [postSuccess, updateSuccess, deleteSuccess] = await Promise.all(
            [
              postDeliveryAddresses(), // Post new addresses
              updateDeliveryAddresses(), // Update existing addresses
              deleteDeliveryAddresses(addressIdsToDelete), // Delete removed addresses
            ]
          );

          if (!postSuccess || !updateSuccess || !deleteSuccess) {
            console.warn(
              "Customer updated but some delivery address operations failed"
            );
          }

          setSubmissionStatus("success");
          console.log("Customer updated successfully", customerData);

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
  console.log("Address Ids To Delete: ", addressIdsToDelete);

  return {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    alertRef,
    loading,
    validateForm,
    handleInputChange,
    handleFormSubmit,
    addDeliveryAddress,
    removeDeliveryAddress,
    handleDeliveryAddressChange,
  };
};

export default useCustomerUpdate;
