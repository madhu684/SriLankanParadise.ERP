import { useState, useEffect, useRef } from "react";
import {
  get_units_by_company_id_api,
  get_categories_by_company_id_api,
  post_item_master_api,
  get_item_types_by_company_id_api,
  get_measurement_types_by_company_id_api,
  get_item_masters_by_company_id_with_query_api,
  put_item_master_api,
  get_all_item_modes_api,
} from "../../services/inventoryApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  get_supplier_by_company_id_with_query_api,
  post_supplier_item_api,
} from "../../services/purchaseApi";

const useItemMaster = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    unitId: "",
    categoryId: "",
    itemName: "",
    itemTypeId: "",
    itemTypeName: "",
    measurementType: "",
    itemHierarchy: "main",
    inventoryMeasurementType: "",
    inventoryUnitId: "",
    conversionValue: "",
    itemCode: "",
    unitPrice: "",
    costRatio: 0,
    fobInUSD: 0,
    landedCost: 0,
    minNetSellingPrice: 0,
    sellingPrice: 0,
    mrp: 0,
    competitorPrice: "0.00",
    labelPrice: "0.00",
    averageSellingPrice: "0.00",
    stockClearance: "0.00",
    bulkPrice: "0.00",
    supplier: {},
    supplierId: null,
    itemModeId: null,
  });

  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [unitOptions, setUnitOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [searchChildTerm, setSearchChildTerm] = useState("");
  const [selectedParentItem, setSelectedParentItem] = useState("");
  const [selectedChildItems, setSelectedChildItems] = useState([]);

  const [isSupplierSelected, setIsSupplierSelected] = useState(false);
  const [itemTypeSearchTerm, setItemTypeSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [isItemTypeSelected, setIsItemTypeSelected] = useState(false);
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [showItemTypeDropdown, setShowItemTypeDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const queryClient = useQueryClient();

  const fetchItems = async (companyId, searchQuery) => {
    try {
      const response = await get_item_masters_by_company_id_with_query_api(
        companyId,
        searchQuery,
        false
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
    queryFn: () => fetchItems(sessionStorage.getItem("companyId"), searchTerm),
    enabled: !!searchTerm,
  });

  const {
    data: availableChildItems,
    isLoading: isChildItemsLoading,
    isError: isChildItemsError,
    error: childItemsError,
  } = useQuery({
    queryKey: ["childItems", searchChildTerm],
    queryFn: () =>
      fetchItems(sessionStorage.getItem("companyId"), searchChildTerm),
    enabled: !!searchChildTerm,
  });

  const fetchSuppliers = async (companyId, searchQuery) => {
    try {
      const response = await get_supplier_by_company_id_with_query_api(
        companyId,
        searchQuery
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const {
    data: availableSuppliers,
    isLoading: isSuppliersLoading,
    isError: isSuppliersError,
    error: suppliersError,
  } = useQuery({
    queryKey: ["suppliers", supplierSearchTerm],
    queryFn: () =>
      fetchSuppliers(sessionStorage.getItem("companyId"), supplierSearchTerm),
    enabled: !!supplierSearchTerm,
  });

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
    queryKey: ["itemTypes"],
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
    queryKey: ["measurementTypes"],
    queryFn: () => fetchMeasurementTypes(),
  });

  const { data: itemModes = [], isLoading: isItemModesLoading } = useQuery({
    queryKey: ["itemMode"],
    queryFn: async () => {
      const response = await get_all_item_modes_api();
      return response.data.result || [];
    },
  });

  const handleInputChange = (field, value) => {
    if (field === "measurementType") {
      setFormData({
        ...formData,
        [field]: value,
        unitId: "",
      });
    } else if (field === "inventoryMeasurementType") {
      setFormData({
        ...formData,
        [field]: value,
        inventoryUnitId: "",
        conversionValue: "",
      });
    } else if (field === "itemTypeId") {
      setFormData({
        ...formData,
        [field]: value,
        itemTypeName: itemTypes.find(
          (type) => type.itemTypeId === parseInt(value)
        )?.name,
      });
    } else {
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

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await get_units_by_company_id_api(
          sessionStorage.getItem("companyId")
        );
        // Filter out the unit with 'Treatments'
        const filteredUnits = response.data.result.filter(
          (unit) => unit.unitName !== "Treatments"
        );
        setUnitOptions(filteredUnits);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    fetchUnits();
  }, []);

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

  useEffect(() => {
    if (submissionStatus != null) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  useEffect(() => {
    if (formData.itemModeId !== 2) {
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
    }
  }, [formData.costRatio, formData.fobInUSD, formData.itemModeId]);

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

    // Always validate these fields
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
    const isUnitPriceValid = validateField(
      "unitPrice",
      "Unit price",
      formData.unitPrice
    );
    const isItemCodeValid = validateField(
      "itemCode",
      "Item code",
      formData.itemCode
    );
    const isItemModeValid = validateField(
      "itemModeId",
      "Item mode",
      formData.itemModeId
    );

    // Skip validation for Service items
    if (formData.itemModeId === 2) {
      console.log("Service item detected - skipping additional validations");
      return (
        isCategoryValid &&
        isItemNameValid &&
        isItemTypeValid &&
        isUnitPriceValid &&
        isItemModeValid &&
        isItemCodeValid
      );
    }

    // For non-Service items, validate all fields
    const isUnitValid = validateField("unitId", "Unit", formData.unitId);
    const isMeasurementTypeValid = validateField(
      "measurementType",
      "Measurement Type",
      formData.measurementType
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

    const isInventoryMeasurementTypeValid = validateField(
      "inventoryMeasurementType",
      "Inventory Measurement Type",
      formData.inventoryMeasurementType
    );
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
      isMeasurementTypeValid &&
      isCategoryValid &&
      isItemNameValid &&
      isItemTypeValid &&
      isItemHierarchyValid &&
      isparentItemValid &&
      isInventoryMeasurementTypeValid &&
      isInventoryUnitValid &&
      isConversionValueValid &&
      isUnitPriceValid &&
      isCostRatioValid &&
      isFOBInUSDValid &&
      isItemCodeValid
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? false : true;
      let putResponse = { status: 200 };

      const isFormValid = validateForm();
      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const itemMasterData = {
          unitId: formData.itemModeId === 2 ? 6 : formData.unitId,
          categoryId: formData.categoryId,
          itemName: formData.itemName,
          status: status,
          companyId: sessionStorage.getItem("companyId"),
          createdBy: sessionStorage.getItem("username"),
          createdUserId: sessionStorage.getItem("userId"),
          itemTypeId: formData.itemTypeId,
          parentId: selectedParentItem?.itemMasterId || null,
          SubItemMasters: selectedChildItems.map((item) => ({
            SubItemMasterId: item.itemMasterId,
            Quantity: parseFloat(item.quantity) || 0,
          })),
          inventoryUnitId:
            formData.itemModeId === 2 ? 6 : formData.inventoryUnitId,
          conversionRate:
            formData.itemModeId === 2 ? 1 : formData.conversionValue,
          itemCode: formData.itemCode,
          // reorderLevel:
          //   formData.itemModeId === 2 ? 0 : formData.reorderLevel,
          isInventoryItem: formData.itemModeId === 2 ? false : true,
          permissionId: 1039,
          unitPrice: formData.unitPrice,
          costRatio: formData.itemModeId === 2 ? 0 : formData.costRatio,
          fobInUSD: formData.itemModeId === 2 ? 0 : formData.fobInUSD,
          landedCost: formData.itemModeId === 2 ? 0 : formData.landedCost,
          minNetSellingPrice:
            formData.itemModeId === 2 ? 0 : formData.minNetSellingPrice,
          sellingPrice:
            formData.itemModeId === 2
              ? formData.unitPrice
              : formData.sellingPrice,
          mrp: formData.itemModeId === 2 ? 0 : formData.mrp,
          competitorPrice:
            formData.itemModeId === 2 ? 0 : formData.competitorPrice,
          labelPrice: formData.itemModeId === 2 ? 0 : formData.labelPrice,
          averageSellingPrice:
            formData.itemModeId === 2 ? 0 : formData.averageSellingPrice,
          stockClearance:
            formData.itemModeId === 2 ? 0 : formData.stockClearance,
          bulkPrice: formData.itemModeId === 2 ? 0 : formData.bulkPrice,
          supplierId: formData.itemModeId === 2 ? null : formData.supplierId,
          itemModeId: formData.itemModeId,
        };

        console.log("sending request : ", itemMasterData);
        const response = await post_item_master_api(itemMasterData);
        const itemMasterId = response.data.result.itemMasterId;

        if (formData.itemHierarchy === "main") {
          const itemMasterData = {
            unitId: formData.itemModeId === 2 ? 6 : formData.unitId,
            categoryId: formData.categoryId,
            itemName: formData.itemName,
            status: status,
            companyId: sessionStorage.getItem("companyId"),
            createdBy: sessionStorage.getItem("username"),
            createdUserId: sessionStorage.getItem("userId"),
            itemTypeId: formData.itemTypeId,
            parentId: itemMasterId,
            SubItemMasters: selectedChildItems.map((item) => ({
              SubItemMasterId: item.itemMasterId,
              Quantity: parseFloat(item.quantity) || 0,
            })),
            inventoryUnitId:
              formData.itemModeId === 2 ? 6 : formData.inventoryUnitId,
            conversionRate:
              formData.itemModeId === 2 ? 1 : formData.conversionValue,
            itemCode: formData.itemCode,
            // reorderLevel:
            //   formData.itemModeId === 2 ? 0 : formData.reorderLevel,
            isInventoryItem: formData.itemModeId === 2 ? false : true,
            permissionId: 1040,
            unitPrice: formData.unitPrice,
            costRatio: formData.itemModeId === 2 ? 0 : formData.costRatio,
            fobInUSD: formData.itemModeId === 2 ? 0 : formData.fobInUSD,
            landedCost: formData.itemModeId === 2 ? 0 : formData.landedCost,
            minNetSellingPrice:
              formData.itemModeId === 2 ? 0 : formData.minNetSellingPrice,
            sellingPrice:
              formData.itemModeId === 2
                ? formData.unitPrice
                : formData.sellingPrice,
            mrp: formData.itemModeId === 2 ? 0 : formData.mrp,
            competitorPrice:
              formData.itemModeId === 2 ? 0 : formData.competitorPrice,
            labelPrice: formData.itemModeId === 2 ? 0 : formData.labelPrice,
            averageSellingPrice:
              formData.itemModeId === 2 ? 0 : formData.averageSellingPrice,
            stockClearance:
              formData.itemModeId === 2 ? 0 : formData.stockClearance,
            bulkPrice: formData.itemModeId === 2 ? 0 : formData.bulkPrice,
            supplierId: formData.itemModeId === 2 ? null : formData.supplierId,
            itemModeId: formData.itemModeId,
          };

          putResponse = await put_item_master_api(itemMasterId, itemMasterData);
        }

        if (response.status === 201 && putResponse.status === 200) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Item master saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Item master created successfully!", formData);
          }

          if (formData.supplierId !== null) {
            const supplierData = {
              supplierId: formData.supplierId,
              itemMasterId: itemMasterId,
            };
            await post_supplier_item_api(supplierData);
          }

          setTimeout(() => {
            setSubmissionStatus(null);
            onFormSubmit();
            setLoading(false);
            setLoadingDraft(false);
            queryClient.invalidateQueries([
              "itemMasters",
              sessionStorage.getItem("companyId"),
            ]);
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
    setSelectedChildItems((val) => [...val, { ...item, quantity: 0 }]);
    setSearchChildTerm("");
  };

  const handleRemoveChildItem = (index) => {
    setSelectedChildItems(selectedChildItems.filter((item, i) => i !== index));
  };

  const handleChildItemQuantityChange = (itemMasterId, value) => {
    setSelectedChildItems(
      selectedChildItems.map((i) =>
        i.itemMasterId === itemMasterId
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

  const handleSupplierChange = (value) => {
    setIsSupplierSelected(true);
    setFormData((prev) => ({
      ...prev,
      supplier: value,
      supplierId: parseInt(value.supplierId),
    }));
    setSupplierSearchTerm("");
  };

  const handleResetSupplier = () => {
    setFormData((prev) => ({
      ...prev,
      supplier: "",
      supplierId: "",
    }));
    setIsSupplierSelected(false);
    setSupplierSearchTerm("");
  };

  const handleItemTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      itemTypeId: type.itemTypeId,
      itemTypeName: type.name,
    }));
    setIsItemTypeSelected(true);
    setItemTypeSearchTerm("");
    setShowItemTypeDropdown(false);
  };

  const handleResetItemType = () => {
    setFormData((prev) => ({
      ...prev,
      itemTypeId: "",
      itemTypeName: "",
    }));
    setIsItemTypeSelected(false);
    setItemTypeSearchTerm("");
    setShowItemTypeDropdown(true);
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: category.categoryId,
    }));
    setIsCategorySelected(true);
    setCategorySearchTerm("");
    setShowCategoryDropdown(false);
  };

  const handleResetCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categoryId: "",
    }));
    setIsCategorySelected(false);
    setCategorySearchTerm("");
    setShowCategoryDropdown(true);
  };

  const filteredItemTypes = itemTypes?.filter((type) =>
    type.name.toLowerCase().includes(itemTypeSearchTerm.toLowerCase())
  );

  const filteredCategories = categoryOptions?.filter((category) =>
    category.categoryName.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  console.log(formData);

  return {
    formData,
    itemModes,
    validFields,
    validationErrors,
    categoryOptions,
    unitOptions,
    submissionStatus,
    alertRef,
    loading,
    loadingDraft,
    itemTypes,
    isLoading,
    isError,
    error,
    isMeasurementTypesLoading,
    isMeasurementTypesError,
    measurementTypes,
    availableItems,
    availableChildItems,
    isItemsLoading,
    isChildItemsLoading,
    isItemsError,
    isChildItemsError,
    itemsError,
    childItemsError,
    searchTerm,
    searchChildTerm,
    selectedParentItem,
    selectedChildItems,
    supplierSearchTerm,
    availableSuppliers,
    isSuppliersLoading,
    isSuppliersError,
    suppliersError,
    isSupplierSelected,
    handleSupplierChange,
    handleResetSupplier,
    setSearchTerm,
    setSearchChildTerm,
    setSupplierSearchTerm,
    setFormData,
    handleInputChange,
    handleSubmit,
    handleSelectItem,
    handleResetParentItem,
    handleSelectSubItem,
    handleRemoveChildItem,
    handleChildItemQuantityChange,
    itemTypeSearchTerm,
    setItemTypeSearchTerm,
    categorySearchTerm,
    setCategorySearchTerm,
    isItemTypeSelected,
    setIsItemTypeSelected,
    isCategorySelected,
    setIsCategorySelected,
    handleItemTypeSelect,
    handleResetItemType,
    handleCategorySelect,
    handleResetCategory,
    filteredItemTypes,
    filteredCategories,
    showItemTypeDropdown,
    setShowItemTypeDropdown,
    showCategoryDropdown,
    setShowCategoryDropdown,
  };
};

export default useItemMaster;
