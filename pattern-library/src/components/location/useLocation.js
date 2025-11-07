import { useState, useEffect, useRef } from "react";
import {
  get_company_locations_api,
  get_location_types_by_company_id_api,
  post_comapny_location_api,
  put_company_location_api,
} from "../../services/purchaseApi";
import { useQuery } from "@tanstack/react-query";
import { get_item_price_list_by_company_id_api } from "../../services/inventoryApi";

const useLocation = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    locationName: "",
    status: "",
    locationType: "",
    locationHierarchy: "main",
    itemPriceListId: null,
    selectedPriceList: null,
  });
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParentLocation, setSelectedParentLocation] = useState("");
  const [availableLocations, setavailableLocations] = useState("");

  const fetchLocations = async () => {
    try {
      const response = await get_company_locations_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const {
    data: availableFetchedLocations,
    isLoading: isLocationsLoading,
    isError: isLocationsError,
    error: locationsError,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });

  const fetchItemPriceList = async () => {
    try {
      const response = await get_item_price_list_by_company_id_api(
        parseInt(sessionStorage.getItem("companyId"))
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching item price list:", error);
    }
  };

  const {
    data: itemPriceList = [],
    isLoading: isItemPriceListLoading,
    isError: isItemPriceListError,
    error: itemPriceListError,
  } = useQuery({
    queryKey: ["itemPriceList", sessionStorage.getItem("companyId")],
    queryFn: fetchItemPriceList,
  });

  useEffect(() => {
    setavailableLocations(
      availableFetchedLocations?.filter((location) =>
        location.locationName
          ?.replace(/\s/g, "")
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase().replace(/\s/g, ""))
      )
    );
  }, [isLocationsLoading, searchTerm]);

  const fetchLocationTypes = async () => {
    try {
      const response = await get_location_types_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching location types:", error);
    }
  };

  const {
    data: locationTypes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["locationTypes"],
    queryFn: () => fetchLocationTypes(),
  });

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  useEffect(() => {
    if (submissionStatus != null) {
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

  const validateForm = () => {
    const islocationNameValid = validateField(
      "locationName",
      "Location name",
      formData.locationName
    );

    const isStatusValid = validateField("status", "Status", formData.status);

    const islocationTypeValid = validateField(
      "locationType",
      "Location type",
      formData.locationType
    );

    const isLocationHierarchyValid = validateField(
      "locationHierarchy",
      "Location hierarchy",
      formData.locationHierarchy
    );

    let isparentLocationValid = true;
    if (formData.locationHierarchy === "sub") {
      isparentLocationValid = validateField(
        "selectedParentLocation",
        "Parent location",
        selectedParentLocation
      );
    }

    return (
      islocationNameValid &&
      isStatusValid &&
      islocationTypeValid &&
      isLocationHierarchyValid &&
      isparentLocationValid
    );
  };

  const handleSubmit = async () => {
    try {
      const status = formData.status === "1" ? true : false;
      let putResponse = { status: 200 };

      const isFormValid = validateForm();
      if (isFormValid) {
        setLoading(true);

        const locationData = {
          companyId: sessionStorage.getItem("companyId"),
          locationName: formData.locationName,
          status: status,
          locationTypeId: formData.locationType,
          parentId: selectedParentLocation?.locationId || null,
          priceMasterId: formData.itemPriceListId,
          permissionId: 1104,
        };

        const response = await post_comapny_location_api(locationData);
        console.log("Response from post_comapny_location_api:", response);

        if (response.status === 201 && response.data && response.data.result) {
          const locationId = response.data.result.locationId;
          console.log("Location ID from response:", locationId);

          if (formData.locationHierarchy === "main") {
            const locationData = {
              companyId: sessionStorage.getItem("companyId"),
              locationName: formData.locationName,
              status: status,
              locationTypeId: formData.locationType,
              parentId: locationId,
              priceMasterId: formData.itemPriceListId,
              permissionId: 1105,
            };

            putResponse = await put_company_location_api(
              locationId,
              locationData
            );
            console.log("Response from put_company_location_api:", putResponse);
          }

          if (putResponse.status === 200) {
            setSubmissionStatus("successSubmitted");
            console.log("Location created successfully!", formData);

            setTimeout(() => {
              setSubmissionStatus(null);
              onFormSubmit();
              setLoading(false);
            }, 3000);
          } else {
            setSubmissionStatus("error");
          }
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
      }, 3000);
    }
  };

  const handleSelectLocation = (Location) => {
    setSelectedParentLocation(Location);
    setSearchTerm("");
  };

  const handleResetParentLocation = () => {
    setSelectedParentLocation("");
  };

  const handleResetItemPriceList = () => {
    setFormData((prevData) => ({
      ...prevData,
      selectedPriceList: null,
      itemPriceListId: null,
    }));
  };

  const handleItemPriceListChange = (itemId) => {
    const selectedItem = itemPriceList.find(
      (item) => item.id === parseInt(itemId)
    );

    if (selectedItem) {
      setFormData((prevData) => ({
        ...prevData,
        selectedPriceList: selectedItem,
        itemPriceListId: selectedItem.id,
      }));
    }
  };

  console.log("formData: ", formData);
  console.log("itemPriceList: ", itemPriceList);

  return {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    alertRef,
    loading,
    isLoading,
    isError,
    locationTypes,
    selectedParentLocation,
    searchTerm,
    isLocationsLoading,
    isLocationsError,
    locationsError,
    availableLocations,
    itemPriceList,
    setSearchTerm,
    handleInputChange,
    handleSubmit,
    handleSelectLocation,
    handleResetParentLocation,
    handleResetItemPriceList,
    handleItemPriceListChange,
  };
};

export default useLocation;
