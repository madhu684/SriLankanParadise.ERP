import { useState, useEffect, useRef } from "react";
import {
  get_company_locations_api,
  get_location_types_by_company_id_api,
  put_company_location_api,
} from "../../../services/purchaseApi";
import { get_item_price_list_by_company_id_api } from "../../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useLocationUpdate = ({ location, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    locationName: "",
    status: "",
    locationType: "",
    locationHierarchy: "",
    itemPriceListId: null,
    selectedPriceList: null,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
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

  useEffect(() => {
    const deepCopyLocation = JSON.parse(JSON.stringify(location));
    const locationHierarchy =
      deepCopyLocation?.parentId !== deepCopyLocation?.locationId
        ? "sub"
        : "main";

    // Find the selected price list if itemPriceListId exists
    const selectedPriceList =
      deepCopyLocation?.priceMasterId && itemPriceList?.length > 0
        ? itemPriceList.find(
            (item) => item.id === deepCopyLocation.priceMasterId
          )
        : null;

    setFormData({
      locationName: deepCopyLocation?.locationName,
      status: deepCopyLocation?.status == true ? "1" : "0",
      locationType: deepCopyLocation?.locationTypeId ?? "",
      locationHierarchy: locationHierarchy,
      itemPriceListId: deepCopyLocation?.priceMasterId || null,
      selectedPriceList: selectedPriceList,
    });

    if (
      !isLocationsLoading &&
      availableFetchedLocations &&
      locationHierarchy === "sub"
    ) {
      setSelectedParentLocation(
        availableFetchedLocations.find(
          (l) => l.locationId === deepCopyLocation?.parentId
        )
      );
    }
  }, [location, isLocationsLoading, availableFetchedLocations, itemPriceList]);

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
    console.log("LocationID: ", location.locationId);
    try {
      const status = formData.status === "1" ? true : false;
      const isFormValid = validateForm();

      if (isFormValid) {
        setLoading(true);

        const locationData = {
          companyId: sessionStorage.getItem("companyId"),
          locationName: formData.locationName,
          status: status,
          locationTypeId: formData.locationType,
          parentId:
            formData.locationHierarchy === "sub"
              ? selectedParentLocation?.locationId
              : location.locationId,
          itemPriceListId: formData.itemPriceListId,
          priceMasterId: formData.itemPriceListId,
          permissionId: 1105,
        };

        console.log("Payload data:", locationData);

        const putResponse = await put_company_location_api(
          location?.locationId,
          locationData
        );
        console.log("Updated data: ", putResponse);

        if (putResponse.status === 200) {
          setSubmissionStatus("successSubmitted");

          setTimeout(() => {
            setSubmissionStatus(null);
            onFormSubmit();
            setLoading(false);
          }, 2000);
          toast.success("Location updated successfully!");
        } else {
          setSubmissionStatus("error");
          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
          }, 2000);
          toast.error("Failed to update location.");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
      setTimeout(() => {
        setSubmissionStatus(null);
        setLoading(false);
      }, 2000);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
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

export default useLocationUpdate;
