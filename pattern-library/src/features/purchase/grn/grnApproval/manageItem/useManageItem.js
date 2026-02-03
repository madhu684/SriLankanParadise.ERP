import { useState, useEffect, useRef } from "react";
import {
  get_sub_items_by_item_master_id_api,
  get_units_by_company_id_api,
  get_measurement_types_by_company_id_api,
} from "common/services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const useManageItem = (item) => {
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [availableConvertibleQuantities, setAvailableConvertibleQuantities] =
    useState({});
  const [formData, setFormData] = useState({
    unitId: "",
    measurementType: "",
    itemHierarchy: "main",
    conversionValue: "",
  });

  console.log(item?.item?.itemName);

  const fetchSubItems = async () => {
    try {
      const response = await get_sub_items_by_item_master_id_api(
        item?.item?.itemMasterId,
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching sub items:", error);
    }
  };

  const {
    data: subItems,
    isLoading: isLoadingsubItems,
    isError: issubItemsError,
    error: subItemsError,
  } = useQuery({
    queryKey: ["subItems", item?.item?.itemMasterId],
    queryFn: fetchSubItems,
  });

  const fetchMeasurementTypes = async () => {
    try {
      const response = await get_measurement_types_by_company_id_api(
        sessionStorage.getItem("companyId"),
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching measurement types:", error);
    }
  };

  const {
    data: measurementTypes,
    isLoading: isMeasurementTypesLoading,
    isError: isMeasurementTypesError,
    error: measurementTypesError,
  } = useQuery({
    queryKey: ["measurementTypes"],
    queryFn: () => fetchMeasurementTypes(),
  });

  const fetchUnits = async () => {
    try {
      const response = await get_units_by_company_id_api(
        sessionStorage.getItem("companyId"),
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const {
    data: units,
    isLoading: isUnitsLoading,
    isError: isUnitsError,
    error: unitsError,
  } = useQuery({
    queryKey: ["units"],
    queryFn: fetchUnits,
  });

  const handleConvertToSubItem = (subItem) => {
    // Logic to handle converting main item to selected subitem
    console.log("Converting main item to subitem:", subItem);
  };

  const handleInputChange = (field, value) => {
    if (field === "measurementType") {
      // If it is, update unitId as well
      setFormData({
        ...formData,
        [field]: value,
        unitId: "",
      });
    } else {
      // For other fields, update formData without changing unitId
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  useEffect(() => {
    if (formData.conversionValue != null) {
      const totalAvailableQuantity =
        item?.receivedQuantity + item?.freeQuantity;

      const availableConvertibleQuantities = subItems?.map((subItem) => {
        const subItemConversionValue =
          formData[`conversionValue-${subItem.itemMasterId}`] || 1; // Default to 1 if conversion value is not provided
        const convertibleQuantity =
          (totalAvailableQuantity * formData.conversionValue) /
          subItemConversionValue;

        // Separate the integer part and the remaining part
        const integerPart = Math.floor(convertibleQuantity);
        const remainingPart = convertibleQuantity - integerPart;
        const remainingValue = remainingPart * subItemConversionValue;

        return {
          itemMasterId: subItem.itemMasterId,
          convertibleQuantity: integerPart,
          remainingValue: remainingValue.toFixed(2),
        };
      });

      setAvailableConvertibleQuantities(availableConvertibleQuantities);
    }
  }, [formData]);

  return {
    formData,
    subItems,
    isLoadingsubItems,
    issubItemsError,
    validFields,
    validationErrors,
    units,
    isUnitsLoading,
    isUnitsError,
    measurementTypes,
    isMeasurementTypesLoading,
    isMeasurementTypesError,
    availableConvertibleQuantities,
    handleConvertToSubItem,
    handleInputChange,
  };
};

export default useManageItem;
