import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { get_company_locations_api } from "../../../services/purchaseApi";
import { get_Empty_Return_Item_locations_inventories_by_location_id_api } from "../../../services/inventoryApi";
import { get_item_masters_by_company_id_with_query_api } from "../../../services/inventoryApi";

export const CreateEmptyReturn = () => {
  const [stockData, setStockData] = useState([]);
  const [searchBy, setSearchBy] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [fromLocationId, setFromLocationId] = useState(null);
  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    adjustedDate: "",
  });
  const [
    inventoryEmptyReturnItemsLoading,
    setInventoryEmptyReturnItemsLoading,
  ] = useState(false);
  // Load warehouse locations
  const fetchWarehouses = async () => {
    try {
      const response = await get_company_locations_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const {
    data: warehouses,
    isLoading: warehousesLoading,
    refetch: refetchWarehouses,
    isError: warehouseErrorState,
    error,
  } = useQuery({
    queryKey: ["warehouses"],
    queryFn: fetchWarehouses,
  });

  // Load items by selected fromLocationId
  const fetchInventoryEmptyReturnItems = async () => {
    setInventoryEmptyReturnItemsLoading(true);
    try {
      if (!formData.fromLocation) return [];
      const response =
        await get_Empty_Return_Item_locations_inventories_by_location_id_api(
          parseInt(formData.fromLocation)
        );
      const formattedItems = response.data.result
        ? response.data.result.map((item) => ({
            itemCode: item.itemMaster.itemCode,
            itemName: item.itemMaster.itemName,
            uom: item.itemMaster.unit.unitName,
            stockInHand: item.stockInHand,
            batchNumber: item.batchId || "Null",
            adjustedQuantity: "",
          }))
        : [];
      return formattedItems || [];
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setInventoryEmptyReturnItemsLoading(false);
    }
  };

  // const {
  //   data: inventoryEmptyReturnItems = [],
  //   isLoading: inventoryEmptyReturnItemsLoading,
  //   isError: inventoryEmptyReturnItemsIsError,
  //   refetch: refetchInventoryEmptyReturnItems,
  // } = useQuery({
  //   queryKey: ["inventoryEmptyReturnItems", fromLocationId],
  //   queryFn: fetchInventoryEmptyReturnItems,
  //   enabled: !!fromLocationId, // auto-trigger only when a location is selected
  // });

  // useEffect(() => {
  //   if (inventoryEmptyReturnItemsLoading) return;

  //   if (inventoryEmptyReturnItems && inventoryEmptyReturnItems.length > 0) {
  //     const formattedItems = inventoryEmptyReturnItems.map((item) => ({
  //       itemCode: item.itemMaster.itemCode,
  //       itemName: item.itemMaster.itemName,
  //       uom: item.itemMaster.unit.unitName,
  //       stockInHand: item.stockInHand,
  //       batchNumber: item.batchId || "Null",
  //       adjustedQuantity: "",
  //     }));
  //     setStockData(formattedItems);
  //   } else {
  //     setStockData([]); //Clear previous items when empty
  //   }
  // }, [inventoryEmptyReturnItems, inventoryEmptyReturnItemsLoading]);

  const handleSearch = useCallback(async () => {
    if (formData.fromLocation) {
      const inventory = await fetchInventoryEmptyReturnItems();
      setStockData(inventory);
      setShowResults(true);
    }
  }, [formData.fromLocation]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (index, value) => {
    // const updatedData = [...stockData];
    // updatedData[index].adjustedQuantity = value;
    // setStockData(updatedData);
  };

  const handleSubmit = () => {
    // console.log("Form submitted:", { formData, stockData });
    // Handle form submission here
  };

  const handleCancel = () => {
    //Reset form fields
    setFormData({
      fromLocation: "",
      toLocation: "",
      adjustedDate: "",
    });

    //Clear adjusted quantity from stock list
    setStockData((prevData) =>
      prevData.map((item) => ({ ...item, adjustedQuantity: "" }))
    );
    setSearchBy("");
    setShowResults(false);
    setFromLocationId(null);
  };

  console.log("FormData: ", formData);

  return {
    warehouses,
    warehousesLoading,
    warehouseErrorState,

    // inventoryEmptyReturnItems,
    inventoryEmptyReturnItemsLoading,
    // inventoryEmptyReturnItemsIsError,
    //refetchInventoryEmptyReturnItems,

    stockData,
    setStockData,
    searchBy,
    setSearchBy,
    showResults,
    setShowResults,
    handleSearch,
    formData,
    setFormData,
    fromLocationId,
    setFromLocationId,
    handleInputChange,
    handleCancel,
    handleQuantityChange,
    handleSubmit,
  };
};

export default CreateEmptyReturn;
