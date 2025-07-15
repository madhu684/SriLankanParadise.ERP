import { useEffect, useRef, useState } from "react";
import {
  patch_location_inventory_api,
  post_location_inventory_movement_api,
  update_min_state_in_mrn_api,
} from "../../../services/purchaseApi";
import { useQueryClient } from "@tanstack/react-query";

const useMinAccept = ({ min, refetch, setRefetch, onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const alertRef = useRef(null);

  console.log("min in useMinAccept: ", min);

  useEffect(() => {
    if (approvalStatus === "approved") {
      setTimeout(() => {
        onFormSubmit();
      }, 2000);
    }
  }, [approvalStatus, onFormSubmit]);

  useEffect(() => {
    if (approvalStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [approvalStatus]);

  const updateInventory = async (details, formattedDate, toLocationId) => {
    try {
      const locationId = parseInt(toLocationId, 10);
      for (const detail of details) {
        console.log(
          `Creating inventory for detail with id ${detail.issueDetailId}: `,
          detail
        );
        const { itemMasterId, batchId, quantity } = detail;

        // Skip if batchId or quantity is invalid
        if (!batchId || !quantity || quantity <= 0) {
          console.warn(
            `Skipping invalid item: itemMasterId=${itemMasterId}, batchId=${batchId}, quantity=${quantity}`
          );
          continue;
        }

        // Patch Location Inventory API
        await patch_location_inventory_api(
          locationId,
          itemMasterId,
          batchId,
          "add",
          {
            stockInHand: quantity,
            permissionId: 1089,
          }
        );

        // Post Location Inventory Movement API
        await post_location_inventory_movement_api({
          movementTypeId: 1,
          transactionTypeId: 5, // need to change
          itemMasterId,
          batchId,
          locationId: locationId,
          date: formattedDate,
          qty: quantity,
          permissionId: 1090,
        });
      }
    } catch (error) {
      throw new Error("Error updating inventory: " + error.message);
    }
  };

  const updateMrnState = async () => {
    try {
      await update_min_state_in_mrn_api(min.requisitionMasterId, {
        isMINApproved: min?.requisitionMaster?.isMINApproved,
        isMINAccepted: true,
      });
    } catch (error) {
      console.error("Error updating MRN state:", error);
    }
  };

  const handleAccept = async (minId) => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      const locationId = min?.requisitionMaster?.requestedFromLocationId;

      await updateInventory(min.issueDetails, formattedDate, locationId);
      await updateMrnState();
      queryClient.invalidateQueries(["min", minId]);
      setRefetch(!refetch);
      setApprovalStatus("approved");
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error accepting material issue Note note:", error);
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
    handleAccept,
  };
};

export default useMinAccept;
