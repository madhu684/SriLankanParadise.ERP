import { useState, useEffect, useRef } from "react";
import {
  get_units_by_company_id_api,
  get_categories_by_company_id_api,
  put_item_master_api,
  get_item_types_by_company_id_api,
  get_measurement_types_by_company_id_api,
  get_item_masters_by_company_id_with_query_api,
  get_item_master_by_item_master_id_api,
  get_sub_items_by_item_master_id_api,
  get_sub_item_masters_by_item_master_id_api,
} from "../../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const useItemMasterUpdate = ({ itemMaster, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    unitId: "",
    categoryId: "",
    itemName: "",
    //itemCode: '',
    itemTypeId: "",
    measurementType: "",
    itemHierarchy: "",
    inventoryMeasurementType: "",
    inventoryUnitId: "",
    conversionValue: "",
    reorderLevel: "",
    unitPrice: "",
    costRatio: "",
    fobInUSD: "",
    landedCost: "",
    minNetSellingPrice: "",
    sellingPrice: "",
    mrp: "",
    competitorPrice: "",
    labelPrice: "",
    averageSellingPrice: "",
    stockClearance: "",
    bulkPrice: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const alertRef = useRef(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchChildTerm, setSearchChildTerm] = useState("");
  const [selectedParentItem, setSelectedParentItem] = useState("");
  const [selectedChildItems, setSelectedChildItems] = useState([]);

  const fetchItems = async (companyId, searchQuery, itemType) => {
    try {
      const response = await get_item_masters_by_company_id_with_query_api(
        companyId,
        searchQuery,
        itemType
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const {
    data: availableItems,
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", searchTerm],
    queryFn: () =>
      fetchItems(sessionStorage.getItem("companyId"), searchTerm, "All"),
  });

  const {
    data: availableChildItems,
    isLoading: isChildItemsLoading,
    isError: isChildItemsError,
    error: childItemsError,
  } = useQuery({
    queryKey: ["childItems", searchChildTerm],
    queryFn: () =>
      fetchItems(sessionStorage.getItem("companyId"), searchChildTerm, "All"),
  });

  const fetchUnits = async () => {
    try {
      const response = await get_units_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const {
    data: unitOptions,
    isLoading: isUnitOptionsLoading,
    isError: isUnitOptionsError,
    error: unitOptionsError,
  } = useQuery({
    queryKey: ["unitOptions", itemMaster.itemMasterId],
    queryFn: fetchUnits,
  });

  useEffect(() => {
    const fetchcategories = async () => {
      try {
        const response = await get_categories_by_company_id_api(
          sessionStorage.getItem("companyId")
        );
        setCategoryOptions(response.data.result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchcategories();
  }, []);

  const fetchItemTypes = async () => {
    try {
      const response = await get_item_types_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      throw new Error("Error fetching itemTypes: " + error.message);
    }
  };

  const {
    data: itemTypes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["itemTypes", itemMaster.itemMasterId],
    queryFn: fetchItemTypes,
  });

  const fetchMeasurementTypes = async () => {
    try {
      const response = await get_measurement_types_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching measurement types:", error);
    }
  };

  const {
    data: measurementTypes,
    isMeasurementTypesLoading,
    isMeasurementTypesError,
    measurementTypesError,
  } = useQuery({
    queryKey: ["measurementTypes", itemMaster.itemMasterId],
    queryFn: fetchMeasurementTypes,
  });

  useEffect(() => {
    const costRatio = parseFloat(formData.costRatio) || 0;
    const fobInUSD = parseFloat(formData.fobInUSD) || 0;

    const landedCost = costRatio * fobInUSD;
    const minNetSellingPrice = landedCost / 0.9;
    const sellingPrice = landedCost / 0.75;
    const mrp = sellingPrice / 0.7;

    setFormData((prev) => ({
      ...prev,
      landedCost: landedCost.toFixed(2),
      minNetSellingPrice: minNetSellingPrice.toFixed(2),
      sellingPrice: sellingPrice.toFixed(2),
      mrp: mrp.toFixed(2),
    }));
  }, [formData.costRatio, formData.fobInUSD]);

  useEffect(() => {
    const deepCopyItemMaster = JSON.parse(JSON.stringify(itemMaster));
    const itemHierarchy =
      deepCopyItemMaster?.parentId !== deepCopyItemMaster?.itemMasterId
        ? "sub"
        : "main";

    setFormData({
      unitId: deepCopyItemMaster?.unitId,
      categoryId: deepCopyItemMaster?.categoryId,
      itemName: deepCopyItemMaster?.itemName,
      itemTypeId: deepCopyItemMaster?.itemTypeId,
      measurementType:
        deepCopyItemMaster?.unit?.measurementType?.measurementTypeId,
      itemHierarchy: itemHierarchy,
      inventoryMeasurementType:
        deepCopyItemMaster?.inventoryUnit?.measurementTypeId,
      inventoryUnitId: deepCopyItemMaster?.inventoryUnitId,
      conversionValue: deepCopyItemMaster?.conversionRate,
      //itemCode: deepCopyItemMaster?.itemCode ?? '',
      reorderLevel: deepCopyItemMaster?.reorderLevel ?? "",
      unitPrice: deepCopyItemMaster?.unitPrice ?? "",
      costRatio: deepCopyItemMaster?.costRatio ?? "",
      fobInUSD: deepCopyItemMaster?.fobInUSD ?? "",
      landedCost: deepCopyItemMaster?.landedCost ?? "",
      minNetSellingPrice: deepCopyItemMaster?.minNetSellingPrice ?? "",
      sellingPrice: deepCopyItemMaster?.sellingPrice ?? "",
      mrp: deepCopyItemMaster?.mrp ?? "",
      competitorPrice: deepCopyItemMaster?.competitorPrice ?? "",
      labelPrice: deepCopyItemMaster?.labelPrice ?? "",
      averageSellingPrice: deepCopyItemMaster?.averageSellingPrice ?? "",
      stockClearance: deepCopyItemMaster?.stockClearance ?? "",
      bulkPrice: deepCopyItemMaster?.bulkPrice ?? "",
    });

    const fetchParentItem = async () => {
      try {
        const response = await get_item_master_by_item_master_id_api(
          deepCopyItemMaster?.parentId
        );
        setSelectedParentItem(response.data.result);
      } catch (error) {
        console.error("Error fetching parent item:", error);
      }
    };

    const fetchChildItems = async () => {
      try {
        const response = await get_sub_item_masters_by_item_master_id_api(
          deepCopyItemMaster.itemMasterId
        );

        let childItems = response.data.result;
        console.log("childItems", childItems);
        if (childItems.length > 0) {
          childItems = childItems.map((item) => {
            return {
              id: item.subItemMaster.itemMasterId,
              name: item.subItemMaster.itemName,
              unit: item.subItemMaster.unit.unitName,
              quantity: item.quantity,
            };
          });
          setSelectedChildItems(childItems);
        }
      } catch (error) {
        console.error("Error fetching child item:", error);
      }
    };

    fetchChildItems();
    if (itemHierarchy === "sub") {
      fetchParentItem();
    }
  }, [itemMaster]);

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

  const validateForm = () => {
    setValidFields({});
    setValidationErrors({});

    const isUnitValid = validateField("unitId", "Unit", formData.unitId);

    const isCategoryValid = validateField(
      "categoryId",
      "Category",
      formData.categoryId
    );

    const isItemNameValid = validateField(
      "itemName",
      "Item name",
      formData.itemName
    );

    const isItemTypeValid = validateField(
      "itemTypeId",
      "Item type",
      formData.itemTypeId
    );

    const isItemHierarchyValid = validateField(
      "itemHierarchy",
      "Item hierarchy",
      formData.itemHierarchy
    );

    let isparentItemValid = true;
    if (formData.itemHierarchy === "sub") {
      isparentItemValid = validateField(
        "selectedParentItem",
        "Parent item",
        selectedParentItem
      );
    }

    const isInventoryUnitValid = validateField(
      "inventoryUnitId",
      "Inventory unit",
      formData.inventoryUnitId
    );

    const isConversionValueValid = validateField(
      "conversionValue",
      "Conversion rate",
      formData.conversionValue,
      {
        validationFunction: (value) => parseFloat(value) > 0,
        errorMessage: `Conversion rate must be greater than 0`,
      }
    );

    // const isItemCodeValid = validateField(
    //   "itemCode",
    //   "Item code",
    //   formData.itemCode
    // );

    const isReorderLevelValid = validateField(
      "reorderLevel",
      "Reorder level",
      formData.reorderLevel
    );

    const isUnitPriceValid = validateField(
      "unitPrice",
      "Unit price",
      formData.unitPrice
    );

    const isCostRatioValid = validateField(
      "costRatio",
      "Cost Ratio",
      formData.costRatio
    );

    const isFOBInUSDValid = validateField(
      "fobInUSD",
      "FOB In USD",
      formData.fobInUSD
    );

    return (
      isUnitValid &&
      isCategoryValid &&
      isItemNameValid &&
      isItemTypeValid &&
      isItemHierarchyValid &&
      isparentItemValid &&
      isInventoryUnitValid &&
      isConversionValueValid &&
      //isItemCodeValid &&
      isReorderLevelValid &&
      isUnitPriceValid &&
      isCostRatioValid &&
      isFOBInUSDValid
    );
  };
  const handleSubmit = async (isSaveAsDraft) => {
    try {
      console.log("handleSubmit triggered!", isSaveAsDraft);
      const status = isSaveAsDraft ? false : true;

      const isFormValid = validateForm();
      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const ItemMasterData = {
          unitId: formData.unitId,
          categoryId: formData.categoryId,
          itemName: formData.itemName,
          status: status,
          companyId: sessionStorage.getItem("companyId"),
          createdBy: sessionStorage.getItem("username"),
          createdUserId: sessionStorage.getItem("userId"),
          itemTypeId: formData.itemTypeId,
          parentId:
            formData.itemHierarchy === "sub"
              ? selectedParentItem?.itemMasterId
              : itemMaster.itemMasterId,
          SubItemMasters: selectedChildItems.map((item) => ({
            SubItemMasterId: item.id,
            Quantity: parseFloat(item.quantity) || 0,
          })),
          inventoryUnitId: formData.inventoryUnitId,
          conversionRate: formData.conversionValue,
          //itemCode: formData.itemCode,
          reorderLevel: formData.reorderLevel,
          permissionId: 1040,
          unitPrice: formData.unitPrice,
          costRatio: formData.costRatio,
          fobInUSD: formData.fobInUSD,
          landedCost: formData.landedCost,
          minNetSellingPrice: formData.minNetSellingPrice,
          sellingPrice: formData.sellingPrice,
          mrp: formData.mrp,
          competitorPrice: formData.competitorPrice,
          labelPrice: formData.labelPrice,
          averageSellingPrice: formData.averageSellingPrice,
          stockClearance: formData.stockClearance,
          bulkPrice: formData.bulkPrice,
        };

        const putResponse = await put_item_master_api(
          itemMaster.itemMasterId,
          ItemMasterData
        );

        if (putResponse.status === 200) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Item master updated and saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Item master updated successfully!", formData);
          }

          setTimeout(() => {
            setSubmissionStatus(null);
            onFormSubmit();
            setLoading(false);
            setLoadingDraft(false);
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
    if (field === "measurementType") {
      // If it is, update unitId as well
      setFormData({
        ...formData,
        [field]: value,
        unitId: "",
      });
    } else if (field === "inventoryMeasurementType") {
      // If it is, update unitId as well
      setFormData({
        ...formData,
        [field]: value,
        inventoryUnitId: "",
        conversionValue: "",
      });
    } else {
      // For other fields, update formData without changing unitId
      setFormData({
        ...formData,
        [field]: value,
      });
    }

    if (field === "itemHierarchy") {
      setSelectedParentItem("");
      setFormData({
        ...formData,
        [field]: value,
        inventoryUnitId: "",
        inventoryMeasurementType: "",
        conversionValue: "",
      });
    }
    setValidFields({});
    setValidationErrors({});
  };

  const handleSelectItem = (item) => {
    setSelectedParentItem(item);
    setSearchTerm("");
    setFormData({
      ...formData,
      inventoryUnitId: item?.inventoryUnitId,
      inventoryMeasurementType: item?.inventoryUnit?.measurementTypeId,
    });
  };

  const handleSelectSubItem = (item) => {
    const subItem = {
      id: item.itemMasterId,
      name: item.itemName,
      unit: item.unit.unitName,
      quantity: item.quantity,
    };

    setSelectedChildItems((val) => [...val, subItem]);
    setSearchChildTerm("");
  };

  const handleChildItemDetailsChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails[index][field] = value;

      // Ensure positive values for Quantities and Unit Prices
      updatedItemDetails[index].quantity = Math.max(
        0,
        updatedItemDetails[index].quantity
      );

      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });
  };

  const handleRemoveChildItem = (index) => {
    setSelectedChildItems(selectedChildItems.filter((item, i) => i !== index));
  };

  const handleChildItemQuantityChange = (id, value) => {
    setSelectedChildItems(
      selectedChildItems.map((i) =>
        i.id === id
          ? { ...i, quantity: value ? parseFloat(value, 10).toString() : 0 }
          : i
      )
    );
  };

  const handleResetParentItem = () => {
    setSelectedParentItem("");
    setFormData({
      ...formData,
      inventoryUnitId: "",
      inventoryMeasurementType: "",
      conversionValue: "",
    });
  };

  return {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    categoryOptions,
    unitOptions,
    loading,
    loadingDraft,
    itemTypes,
    isMeasurementTypesLoading,
    isMeasurementTypesError,
    measurementTypes,
    availableItems,
    availableChildItems,
    isItemsLoading,
    isChildItemsLoading,
    isItemsError,
    itemsError,
    childItemsError,
    searchTerm,
    searchChildTerm,
    selectedParentItem,
    selectedChildItems,
    isUnitOptionsLoading,
    isUnitOptionsError,
    isLoading,
    isError,
    setSearchTerm,
    setSearchChildTerm,
    setFormData,
    setSelectedParentItem,
    setSelectedChildItems,
    handleInputChange,
    handleSubmit,
    handleSelectItem,
    handleSelectSubItem,
    handleChildItemDetailsChange,
    handleRemoveChildItem,
    handleResetParentItem,
    handleChildItemQuantityChange,
  };
};

export default useItemMasterUpdate;
