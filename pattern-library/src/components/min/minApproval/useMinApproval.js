import { useState, useEffect, useRef } from "react";
import {
  approve_issue_master_api,
  patch_item_batch_api,
  patch_location_inventory_api,
  post_location_inventory_movement_api,
} from "../../../services/purchaseApi";

const useMinApproval = ({ min, onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const alertRef = useRef(null);

  useEffect(() => {
    if (approvalStatus === "approved") {
      setTimeout(() => {
        onFormSubmit();
      }, 2000);
    }
  }, [approvalStatus, onFormSubmit]);

  console.log(min);
  useEffect(() => {
    if (approvalStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [approvalStatus]);

  const updateInventory = async (details, formattedDate, fromLocationId) => {
    try {
      for (const detail of details) {
        const { itemMasterId, batchId, quantity } = detail;

        // Patch Item Batch API
        await patch_item_batch_api(batchId, itemMasterId, "subtract", {
          qty: quantity,
          permissionId: 1065,
        });

        // Patch Location Inventory API
        await patch_location_inventory_api(
          fromLocationId,
          itemMasterId,
          batchId,
          "subtract",
          {
            stockInHand: quantity,
            permissionId: 1089,
          }
        );

        // Post Location Inventory Movement API
        await post_location_inventory_movement_api({
          movementTypeId: 2,
          transactionTypeId: 5,
          itemMasterId,
          batchId,
          locationId: fromLocationId,
          date: formattedDate,
          qty: quantity,
          permissionId: 1090,
        });
      }
    } catch (error) {
      throw new Error("Error updating inventory: " + error.message);
    }
  };

  const handleApprove = async (minId) => {
    try {
      setLoading(true);
      const firstDigit = parseInt(min.status.toString().charAt(0), 10); // Extract the first digit
      const combinedStatus = parseInt(`${firstDigit}2`, 10);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();

      const approvalData = {
        status: combinedStatus,
        approvedBy: sessionStorage.getItem("username"), //username
        approvedUserId: sessionStorage.getItem("userId"), //userid
        approvedDate: formattedDate,
        permissionId: 1062,
      };
      const approvalResponse = await approve_issue_master_api(
        minId,
        approvalData
      );

      if (approvalResponse.status === 200) {
        await updateInventory(
          min.issueDetails,
          formattedDate,
          min.requisitionMaster.requestedFromLocationId
        );

        console.log(
          "Material issue note approved and inventory updated successfully:",
          approvalResponse
        );
        setApprovalStatus("approved");
      } else {
        setApprovalStatus("error");
      }

      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error approving material issue Note note:", error);
      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
    }
  };

  return {
    approvalStatus,
    loading,
    alertRef,
    handleApprove,
  };
};

export default useMinApproval;
