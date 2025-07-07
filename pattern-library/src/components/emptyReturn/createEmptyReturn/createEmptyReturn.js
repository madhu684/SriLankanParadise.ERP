import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get_company_locations_api } from "../../../services/purchaseApi";
import { update_empty_return_api } from "../../../services/inventoryApi";
import ToastMessage from "../../toastMessage/toastMessage";
import { get_item_masters_by_company_id_with_query_api } from "../../../services/inventoryApi";

export const CreateEmptyReturn = (selectedItems) => {
  const [stockData, setStockData] = useState([]);
  const [searchBy, setSearchBy] = useState("");
  // const [showResults, setShowResults] = useState(true);
  const [fromLocationId, setFromLocationId] = useState(null);
  const [handleSetSelectedItems, setHandleSetSelectedItems] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    transferDate: "",
    emptyReturnDetails: [],
  });
  // New state to manage toast visibility and content
  const [toastData, setToastData] = useState({
    show: false,
    type: "",
    message: "",
  });

  const queryClient = useQueryClient();

  // Mutation for submitting the updated empty return
  const mutation = useMutation({
    mutationFn: update_empty_return_api, // Our API call function
    onSuccess: (data) => {
      console.log("Empty return updated successfully:", data);
      queryClient.invalidateQueries("addedEmptyItems");
      // Optionally, reset form or show success message here
    },
    onError: (error) => {
      console.error("Error updating empty return:", error);
      // Optionally, show error message here
    },
  });

  useEffect(() => {
    console.log("Effect trigger");
    setFormData((prev) => ({
      ...prev,
      fromLocation: selectedItems?.fromLocationId,
      emptyReturnDetails: selectedItems?.emptyReturnDetails,
    }));
  }, []);

  useEffect(() => {
    if (handleSetSelectedItems) {
      setFormData((prev) => ({
        ...prev,
        fromLocation: selectedItems.fromLocation?.locationName,
        emptyReturnDetails: selectedItems.emptyReturnDetails,
      }));
    }
  }, [handleSetSelectedItems]);

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

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle quantity change in the item details
  const handleQuantityChange = (index, value) => {
    const updatedItems = [...formData.emptyReturnDetails];
    const adjustedValue = parseFloat(value);

    if (
      adjustedValue >= 0 &&
      adjustedValue <= updatedItems[index].addedQuantity
    ) {
      updatedItems[index].returnQuantity = adjustedValue;
    } else {
      updatedItems[index].returnQuantity = updatedItems[index].addedQuantity;
    }

    setFormData((prev) => ({
      ...prev,
      emptyReturnDetails: updatedItems,
    }));
  };

  const [errors, setErrors] = useState({
    toLocation: "",
    transferDate: "",
    transferQuantity: "",
  });

  // Handle form submission
  const handleSubmit = async () => {
    // Reset errors before validation
    setErrors({
      toLocation: "",
      transferDate: "",
      transferQuantity: "",
    });

    // Validation: Check if fields are empty
    if (!formData.toLocation) {
      setErrors((prev) => ({
        ...prev,
        toLocation: "To Location is required.",
      }));
    }
    if (!formData.transferDate) {
      setErrors((prev) => ({
        ...prev,
        transferDate: "Transfer Date is required.",
      }));
    }
    if (
      formData.emptyReturnDetails?.some(
        (item) => !item.returnQuantity || item.returnQuantity <= 0
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        transferQuantity:
          "Transfer Quantity must be greater than 0 for all items.",
      }));
    }

    // If any errors exist, stop submission
    if (errors.toLocation || errors.transferDate || errors.transferQuantity) {
      return; // Prevent form submission
    }

    setLoading(true);

    const emptyReturnMasterId = selectedItems?.emptyReturnMasterId; // Get the empty return master ID

    if (!emptyReturnMasterId) {
      console.error("Empty return master ID is missing");
      return;
    }

    // Prepare the updated empty return data
    const emptyReturnData = {
      toLocationId: formData.toLocation,
      status: 1,
      modifyedBy: parseInt(sessionStorage.getItem("userId")),
      ModifyDate: formData.transferDate,
      emptyReturnDetails: formData.emptyReturnDetails.map((item) => ({
        emptyReturnDetailId: item.emptyReturnDetailId,
        itemMasterId: item.itemMasterId,
        returnQuantity: item.returnQuantity,
      })),
    };

    try {
      // Call the update API to submit the data
      const result = await update_empty_return_api(
        emptyReturnMasterId,
        emptyReturnData
      );
      // Show success toast after successful submission
      setToastData({
        show: true,
        type: "success", // Success toast
        message: "Empty return updated successfully!",
      });

      console.log("Updated empty return data:", emptyReturnData);
      console.log("Empty return updated successfully", result);
    } catch (error) {
      setToastData({
        show: true,
        type: "danger", // Error toast
        message: "Error updating empty return. Please try again.",
        setTimeout: 100,
      });
      console.error("Error updating empty return:", error);
    } finally {
      setLoading(false); // Reset loading state after submission is complete
    }
  };

  const handleCloseToast = () => {
    // Close the toast automatically after 1 second
    setTimeout(() => {
      setToastData({ ...toastData, show: false });
    }, 100);
  };

  const handleCancel = () => {
    //Reset form fields
    setFormData({
      fromLocation: "",
      toLocation: "",
      transferDate: "",
    });

    //Clear adjusted quantity from stock list
    setStockData((prevData) =>
      prevData.map((item) => ({ ...item, returnQuantity: "" }))
    );
    setSearchBy("");
    // setShowResults(false);
    setFromLocationId(null);
  };

  console.log("FormData: ", formData);

  return {
    warehouses,
    warehousesLoading,
    warehouseErrorState,

    stockData,
    setStockData,
    searchBy,
    setSearchBy,
    // showResults,
    // setShowResults,
    // handleSearch,
    formData,
    setFormData,
    fromLocationId,
    setFromLocationId,
    handleInputChange,
    handleCancel,
    handleQuantityChange,
    handleSubmit,
    loading,
    setLoading,
    setToastData,
    toastData,
    handleCloseToast,
    setErrors,
    errors,
  };
};

export default CreateEmptyReturn;
