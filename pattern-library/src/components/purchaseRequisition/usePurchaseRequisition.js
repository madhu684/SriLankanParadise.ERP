import { useState, useEffect, useRef } from "react";
import {
  get_company_locations_api,
  post_purchase_requisition_api,
  post_purchase_requisition_detail_api,
  get_user_locations_by_user_id_api,
  get_company_suppliers_api,
  get_Location_Inventory_Summary_By_Item_Name_api,
  get_Low_Stock_Items_api,
} from "../../services/purchaseApi";
import { get_supplier_items_by_type_category_api } from "../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const usePurchaseRequisition = ({ onFormSubmit }) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    requestorName: "",
    department: "",
    departmentLocation: "",
    email: "",
    contactNumber: "",
    expectedDeliveryLocation: null,
    requisitionDate: currentDate,
    purposeOfRequest: "",
    expectedDeliveryDate: "",
    // referenceNumber: "",
    itemDetails: [],
    attachments: [],
    totalAmount: 0,
    selectedSupplier: "",
    supplierId: null,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [isPRGenerated, setIsPRGenerated] = useState(false);
  const [prGenerating, setPRGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fetchUserLocations = async () => {
    try {
      const response = await get_user_locations_by_user_id_api(
        parseInt(sessionStorage.getItem("userId"))
      );
      console.log("User locations 66:", response.data.result);
      return response.data.result;
    } catch (error) {
      console.error("Error fetching user locations:", error);
    }
  };

  const {
    data: userLocations = [],
    isLoading: isUserLocationsLoading,
    isError: isUserLocationsError,
    error: userLocationsError,
  } = useQuery({
    queryKey: ["userLocations", sessionStorage.getItem("userId")],
    queryFn: fetchUserLocations,
  });

  const fetchItems = async (searchQuery) => {
    try {
      const response = await get_Location_Inventory_Summary_By_Item_Name_api(
        formData.expectedDeliveryLocation,
        searchQuery
      );

      const items =
        response.data?.result?.map((summary) => ({
          itemMasterId: summary.itemMasterId,
          itemName: summary.itemMaster?.itemName || "",
          itemCode: summary.itemMaster?.itemCode || "",
          unit: summary.itemMaster?.unit || { unitName: "" },
          categoryId: summary.itemMaster?.category?.categoryId || "",
          itemTypeId: summary.itemMaster?.itemType?.itemTypeId || "",
          supplierId: summary.itemMaster?.supplierId || null,
          totalStockInHand: summary.totalStockInHand,
          minReOrderLevel: summary.minReOrderLevel,
          maxStockLevel: summary.maxStockLevel,
          supplierItems: [],
        })) || [];

      const filterItems = formData.supplierId
        ? items.filter(
            (item) =>
              !formData.supplierId || item.supplierId === formData.supplierId
          )
        : items;
      return filterItems;
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };

  const {
    data: availableItems = [],
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", searchTerm],
    queryFn: () => fetchItems(searchTerm),
    enabled: !!formData.expectedDeliveryLocation && !!searchTerm,
  });

  const fetchSuppliers = async () => {
    try {
      const response = await get_company_suppliers_api(
        sessionStorage.getItem("companyId")
      );
      const filteredSuppliers = response.data.result?.filter(
        (supplier) => supplier.status === 1
      );
      return filteredSuppliers || [];
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const { data: suppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalAmount: calculateTotalPrice(),
    }));
  }, [formData.itemDetails]);

  // Get user departments (locations with locationTypeId === 3)
  const userDepartments =
    userLocations?.filter(
      (location) => location?.location?.locationTypeId === 3
    ) || [];

  useEffect(() => {
    if (!isUserLocationsLoading && userLocations) {
      const departments = userLocations?.filter(
        (location) => location?.location?.locationTypeId === 3
      );

      console.log("User departments: ", departments);

      // If there's only one department, auto-select it
      if (departments && departments.length === 1) {
        const department = departments[0];
        setFormData((prevFormData) => ({
          ...prevFormData,
          department: department?.location.locationName,
          departmentLocation: department?.locationId,
        }));
      }
      // If there are multiple departments, clear the selection to allow user to choose
      else if (departments && departments.length > 1) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          department: "",
          departmentLocation: "",
        }));
      }
    }
  }, [isUserLocationsLoading, userLocations]);

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

  const validateForm = (isSaveAsDraft) => {
    if (isSaveAsDraft) {
      setValidFields({});
      setValidationErrors({});

      const isDepartmentValid = validateField(
        "departmentLocation",
        "Department",
        formData.departmentLocation
      );

      const isDeliveryLocationValid = validateField(
        "expectedDeliveryLocation",
        "Expected delivery location",
        formData.expectedDeliveryLocation
      );

      const isDeliveryDateValid = validateField(
        "expectedDeliveryDate",
        "Expected delivery date",
        formData.expectedDeliveryDate
      );

      const isRequisitionDateValid = validateField(
        "requisitionDate",
        "Requisition date",
        formData.requisitionDate
      );

      let isItemQuantityValid = true;
      // Validate item details
      formData.itemDetails.forEach((item, index) => {
        const fieldName = `quantity_${index}`;
        const fieldDisplayName = `Quantity for ${item.name}`;

        const additionalRules = {
          validationFunction: (value) => parseFloat(value) > 0,
          errorMessage: `${fieldDisplayName} must be greater than 0`,
        };

        const isValidQuantity = validateField(
          fieldName,
          fieldDisplayName,
          item.quantity,
          additionalRules
        );

        isItemQuantityValid = isItemQuantityValid && isValidQuantity;
      });

      const isAttachmentsValid = validateAttachments(formData.attachments);

      return (
        isDepartmentValid &&
        isDeliveryLocationValid &&
        isAttachmentsValid &&
        isDeliveryDateValid &&
        isRequisitionDateValid &&
        isItemQuantityValid
      );
    }

    setValidFields({});
    setValidationErrors({});

    const isDepartmentValid = validateField(
      "departmentLocation",
      "Department",
      formData.departmentLocation
    );

    const isDeliveryLocationValid = validateField(
      "expectedDeliveryLocation",
      "Expected delivery location",
      formData.expectedDeliveryLocation
    );

    const isAttachmentsValid = validateAttachments(formData.attachments);

    const isEmailValid = formData.email
      ? validateField("email", "Email", formData.email, {
          validationFunction: (value) => /\S+@\S+\.\S+/.test(value),
          errorMessage: "Please enter a valid email address",
        })
      : true;

    const isContactNumberValid = validateField(
      "contactNumber",
      "Contact number",
      formData.contactNumber,
      {
        validationFunction: (value) => /^\d+$/.test(value),
        errorMessage: "Please enter a valid contact number",
      }
    );

    const isRequisitionDateValid = validateField(
      "requisitionDate",
      "Requisition date",
      formData.requisitionDate
    );

    const isDeliveryDateValid = validateField(
      "expectedDeliveryDate",
      "Expected delivery date",
      formData.expectedDeliveryDate
    );

    let isItemQuantityValid = true;
    // Validate item details
    formData.itemDetails.forEach((item, index) => {
      const fieldName = `quantity_${index}`;
      const fieldDisplayName = `Quantity for ${item.name}`;

      const additionalRules = {
        validationFunction: (value) => parseFloat(value) > 0,
        errorMessage: `${fieldDisplayName} must be greater than 0`,
      };

      const isValidQuantity = validateField(
        fieldName,
        fieldDisplayName,
        item.quantity,
        additionalRules
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    return (
      isDepartmentValid &&
      isEmailValid &&
      isContactNumberValid &&
      isDeliveryLocationValid &&
      isRequisitionDateValid &&
      isDeliveryDateValid &&
      isAttachmentsValid &&
      isItemQuantityValid
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;

      // Get the current date and time in UTC timezone in the specified format
      const createdDate = new Date().toISOString();

      const isFormValid = validateForm(isSaveAsDraft);
      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const purchaseRequisitionData = {
          requestedBy: formData.requestorName,
          requestedUserId: sessionStorage.getItem("userId"),
          department: formData.departmentLocation,
          email: formData.email,
          contactNo: formData.contactNumber,
          requisitionDate: formData.requisitionDate,
          purposeOfRequest: formData.purposeOfRequest,
          expectedDeliveryDate: formData.expectedDeliveryDate,
          expectedDeliveryLocation: formData.expectedDeliveryLocation,
          // referenceNo: formData.referenceNumber,
          totalAmount: formData.totalAmount,
          status: status,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          companyId: sessionStorage.getItem("companyId"),
          createdDate: createdDate,
          lastUpdatedDate: createdDate,
          supplierId: formData.supplierId,
          permissionId: 9,
        };

        const response = await post_purchase_requisition_api(
          purchaseRequisitionData
        );

        const purchaseRequisitionId =
          response.data.result.purchaseRequisitionId;

        // Extract itemDetails from formData
        const itemDetailsData = formData.itemDetails.map(async (item) => {
          const detailsData = {
            purchaseRequisitionId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            itemMasterId: item.id,
            permissionId: 9,
          };

          // Call post_purchase_requisition_detail_api for each item
          const detailsApiResponse = await post_purchase_requisition_detail_api(
            detailsData
          );

          return detailsApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetailsData);

        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201
        );

        if (allDetailsSuccessful) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Purchase requisition saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log(
              "Purchase requisition submitted successfully!",
              formData
            );
          }

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

  const handleDepartmentChange = (departmentLocationId) => {
    const selectedDepartment = userDepartments.find(
      (dept) => dept.locationId === parseInt(departmentLocationId)
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      department: selectedDepartment?.location.locationName || "",
      departmentLocation: parseInt(departmentLocationId),
    }));
  };

  const handleItemDetailsChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails[index][field] = value;

      // Ensure positive values for Quantities and Unit Prices
      updatedItemDetails[index].quantity = Math.max(
        0,
        updatedItemDetails[index].quantity
      );

      updatedItemDetails[index].unitPrice = !isNaN(
        parseFloat(updatedItemDetails[index].unitPrice)
      )
        ? Math.max(0, parseFloat(updatedItemDetails[index].unitPrice))
        : 0;

      updatedItemDetails[index].totalPrice =
        updatedItemDetails[index].quantity *
        updatedItemDetails[index].unitPrice;
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
        totalAmount: calculateTotalPrice(),
      };
    });
  };

  const handleRemoveItem = (index) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails.splice(index, 1);
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });
    setValidFields({});
    setValidationErrors({});
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAttachmentChange = (files) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      attachments: files,
    }));
  };

  const calculateTotalPrice = () => {
    return formData.itemDetails.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  };

  // Handler to add the selected item to itemDetails
  const handleSelectItem = async (item) => {
    const supplierItemResponse = await get_supplier_items_by_type_category_api(
      sessionStorage.getItem("companyId"),
      parseInt(item.itemTypeId),
      parseInt(item.categoryId),
      formData.expectedDeliveryLocation
    );

    const supplierItems = supplierItemResponse.data.result
      ? supplierItemResponse.data.result.filter(
          (si) =>
            si.itemMasterId !== item.itemMasterId &&
            si.supplierName !== formData?.selectedSupplier?.supplierName
        )
      : [];

    setFormData((prevFormData) => ({
      ...prevFormData,
      itemDetails: [
        ...prevFormData.itemDetails,
        {
          id: item.itemMasterId,
          name: item.itemName,
          unit: item.unit.unitName,
          categoryId: item.categoryId,
          itemTypeId: item.itemTypeId,
          quantity:
            item.maxStockLevel - item.totalStockInHand >= 0
              ? item.maxStockLevel - item.totalStockInHand
              : 0,
          unitPrice: 0.0,
          totalPrice: 0.0,
          totalStockInHand: item.totalStockInHand,
          minReOrderLevel: item.minReOrderLevel,
          maxStockLevel: item.maxStockLevel,
          supplierItems: supplierItems,
        },
      ],
    }));
    setSearchTerm("");
  };

  const handleSupplierChange = (supplierId) => {
    const SelectedSupplierId = parseInt(supplierId, 10);

    const selectedSupplier = suppliers.find(
      (supplier) => supplier.supplierId === SelectedSupplierId
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      supplierId,
      selectedSupplier,
    }));
  };

  const handleSelectSupplier = (selectedSupplier) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      supplierId: selectedSupplier.supplierId,
      selectedSupplier: selectedSupplier,
    }));
    setSupplierSearchTerm("");
  };

  const handleResetSupplier = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedSupplier: "",
      supplierId: null,
      itemDetails: [],
    }));
  };

  const handleGeneratePR = async () => {
    try {
      setPRGenerating(true);
      setIsPRGenerated(true);
      const response = await get_Low_Stock_Items_api(
        formData.supplierId,
        formData.expectedDeliveryLocation
      );
      const lowStockItems = response.data.result || [];

      if (lowStockItems.length === 0) {
        setShowToast(true);
        setTimeout(() => {
          setIsPRGenerated(false);
          setShowToast(false);
        }, 5000);
        setPRGenerating(false);
        return;
      }

      if (lowStockItems.length > 0) {
        const companyId = sessionStorage.getItem("companyId");

        // Transform low-stock items into itemDetails format with API calls
        const newItemDetails = await Promise.all(
          lowStockItems.map(async (item) => {
            const supplierItemResponse =
              await get_supplier_items_by_type_category_api(
                companyId,
                parseInt(item.itemMaster?.itemType?.itemTypeId),
                parseInt(item.itemMaster?.category?.categoryId),
                formData.expectedDeliveryLocation
              );

            const supplierItems = supplierItemResponse.data.result
              ? supplierItemResponse.data.result.filter(
                  (si) =>
                    si.itemMasterId !== item.itemMasterId &&
                    si.supplierName !== formData?.selectedSupplier?.supplierName
                )
              : [];

            return {
              id: item.itemMasterId,
              name: item.itemMaster.itemName,
              unit: item.itemMaster.unit?.unitName || "",
              categoryId: item.itemMaster?.category?.categoryId || "",
              itemTypeId: item.itemMaster?.itemType?.itemTypeId || "",
              quantity:
                item.maxStockLevel - item.totalStockInHand >= 0
                  ? item.maxStockLevel - item.totalStockInHand
                  : 0,
              unitPrice: 0.0,
              totalPrice: 0.0,
              supplierItems: supplierItems,
              totalStockInHand: item.totalStockInHand,
              minReOrderLevel: item.minReOrderLevel,
              maxStockLevel: item.maxStockLevel,
            };
          })
        );

        // Update formData with new itemDetails
        setFormData((prevFormData) => ({
          ...prevFormData,
          itemDetails: newItemDetails,
        }));
      } else {
        console.log("No low-stock items found.");
      }
    } catch (error) {
      console.error("Error generating purchase order:", error);
    } finally {
      setPRGenerating(false);
    }
  };

  console.log("PR formData:", formData);

  return {
    formData,
    // locations,
    // isError,
    // isLoading,
    // error,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    loading,
    loadingDraft,
    userDepartments,
    userLocations,
    suppliers,
    supplierSearchTerm,
    showToast,
    isPRGenerated,
    prGenerating,
    setShowToast,
    handleInputChange,
    handleDepartmentChange,
    handleItemDetailsChange,
    handleSubmit,
    handleSelectItem,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    calculateTotalPrice,
    setSearchTerm,
    setSupplierSearchTerm,
    handleSelectSupplier,
    handleSupplierChange,
    handleResetSupplier,
    handleGeneratePR,
  };
};

export default usePurchaseRequisition;
