import { useEffect, useRef, useState } from "react";
import {
  approve_supply_return_master_api,
  post_location_inventory_api,
  post_location_inventory_movement_api,
} from "common/services/purchaseApi";
import { useQueryClient } from "@tanstack/react-query";

const useSupplierReturnApprove = ({ onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const alertRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (approvalStatus === "approved") {
      setTimeout(() => {
        onFormSubmit();
      }, 2000);
    }
  }, [approvalStatus, onFormSubmit]);

  const handleApprove = async (supplyReturnMaster) => {
    try {
      setLoading(true);
      const currentDate = new Date();

      const approvalData = {
        status: 2,
        approvedBy: sessionStorage.getItem("username"),
        approvedUserId: sessionStorage.getItem("userId"),
        approvedDate: currentDate,
      };

      const approvalResponse = await approve_supply_return_master_api(
        supplyReturnMaster.supplyReturnMasterId,
        approvalData,
      );

      if (approvalResponse.status === 200) {
        await createInventories(supplyReturnMaster.supplyReturnDetails);
        setApprovalStatus("approved");
        queryClient.invalidateQueries([
          "supplierReturns",
          sessionStorage.getItem("companyId"),
        ]);
        console.log("Supplier return approved successfully:", approvalResponse);
      } else {
        setApprovalStatus("error");
      }
      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error approving goods received note:", error);
      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
    }
  };

  const createInventories = async (items) => {
    for (const item of items) {
      const inventoryData = {
        itemMasterId: item.itemMasterId,
        batchId: item.batchId,
        locationId: item.locationId,
        stockInHand: item.returnedQuantity,
        permissionId: 1088,
        movementTypeId: 2,
      };

      console.log("Inventory Data:", inventoryData);
      await post_location_inventory_api(inventoryData);

      const inventoryMovementData = {
        movementTypeId: 2,
        transactionTypeId: 10,
        itemMasterId: item.itemMasterId,
        batchId: item.batchId,
        locationId: item.locationId,
        date: new Date().toISOString(), // Current date and time
        qty: item.returnedQuantity,
        permissionId: 1090,
      };

      console.log("Inventory Movement Data:", inventoryMovementData);
      await post_location_inventory_movement_api(inventoryMovementData);
    }
  };

  return {
    approvalStatus,
    loading,
    alertRef,
    handleApprove,
  };
};

export default useSupplierReturnApprove;
