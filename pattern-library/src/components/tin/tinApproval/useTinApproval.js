import { useState, useEffect, useRef } from "react";
import {
  approve_issue_master_api,
  patch_location_inventory_api,
  post_location_inventory_api,
  post_location_inventory_movement_api,
  post_location_inventory_goods_in_transit_api,
  update_min_state_in_mrn_api,
} from "../../../services/purchaseApi";

const useTinApproval = ({ tin, onFormSubmit }) => {
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

  console.log(tin);
  useEffect(() => {
    if (approvalStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [approvalStatus]);

  const updateInventory = async (
    details,
    formattedDate,
    fromLocationId,
    toLocationId
  ) => {
    try {
      for (const detail of details) {
        const { itemMasterId, batchId, quantity } = detail;

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

        // Patch Location Inventory API (add stock to toLocation)

        // const patchLocationInventoryResponse =
        //   await patch_location_inventory_api(
        //     toLocationId,
        //     itemMasterId,
        //     batchId,
        //     "add",
        //     {
        //       stockInHand: quantity,
        //       permissionId: 1089,
        //     }
        //   );

        // if (
        //   patchLocationInventoryResponse &&
        //   patchLocationInventoryResponse.status === 404
        // ) {
        //   // Location inventory not found, create it
        //   await post_location_inventory_api({
        //     itemMasterId,
        //     batchId,
        //     locationId: toLocationId,
        //     stockInHand: quantity,
        //     permissionId: 1088,
        //   });
        // }

        // Post Location Inventory Movement API
        await post_location_inventory_movement_api({
          movementTypeId: 2,
          transactionTypeId: 6,
          itemMasterId,
          batchId,
          locationId: fromLocationId,
          date: formattedDate,
          qty: quantity,
          permissionId: 1090,
        });

        // await post_location_inventory_movement_api({
        //   movementTypeId: 1,
        //   transactionTypeId: 6,
        //   itemMasterId,
        //   batchId,
        //   locationId: toLocationId,
        //   date: formattedDate,
        //   qty: quantity,
        //   permissionId: 1090,
        // });

        // Prepare the data for post_location_inventory_goods_in_transit_api
        const transitData = {
          toLocationId: toLocationId,
          fromLocationId: fromLocationId,
          itemMasterId: itemMasterId,
          batchId: batchId,
          date: formattedDate,
          status: 0,
          qty: quantity,
          permissionId: 1092,
        };

        //post_location_inventory_goods_in_transit_api for each item
        await post_location_inventory_goods_in_transit_api(transitData);
      }
    } catch (error) {
      throw new Error("Error updating inventory: " + error.message);
    }
  };

  const updateMrnState = async () => {
    try {
      await update_min_state_in_mrn_api(tin.requisitionMasterId, {
        isMINApproved: true,
        isMINAccepted: false,
      });
    } catch (error) {
      console.error("Error updating MRN state:", error);
    }
  };

  const handleApprove = async (tinId) => {
    try {
      setLoading(true);
      const firstDigit = parseInt(tin.status.toString().charAt(0), 10); // Extract the first digit
      const combinedStatus = parseInt(`${firstDigit}2`, 10);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();

      const approvalData = {
        status: combinedStatus,
        approvedBy: sessionStorage.getItem("username"), //username
        approvedUserId: sessionStorage.getItem("userId"), //userid
        approvedDate: formattedDate,
        permissionId: 1064,
      };
      const approvalResponse = await approve_issue_master_api(
        tinId,
        approvalData
      );

      if (approvalResponse.status === 200) {
        await updateInventory(
          tin.issueDetails,
          formattedDate,
          tin.requisitionMaster.requestedFromLocationId,
          tin.requisitionMaster.requestedToLocationId
        );

        await updateMrnState();

        setApprovalStatus("approved");
        console.log(
          "Material issue note approved successfully:",
          approvalResponse
        );
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

export default useTinApproval;
