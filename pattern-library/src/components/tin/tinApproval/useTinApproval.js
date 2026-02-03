import { useState, useEffect, useRef, useMemo } from "react";
import {
  approve_issue_master_api,
  patch_location_inventory_api,
  post_location_inventory_api,
  post_location_inventory_movement_api,
  post_location_inventory_goods_in_transit_api,
  update_min_state_in_mrn_api,
  post_reduce_inventory_fifo_api,
} from "../../../services/purchaseApi";
import { useQueryClient } from "@tanstack/react-query";

const useTinApproval = ({ tin, onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const alertRef = useRef(null);

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (approvalStatus === "approved") {
      setTimeout(() => {
        onFormSubmit();
      }, 2000);
    }
  }, [approvalStatus, onFormSubmit]);

  console.log("tin", tin);
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
      let detailFifo = [];
      for (const detail of details) {
        const { itemMasterId, batchId, quantity } = detail;

        const fifoResponse = await post_reduce_inventory_fifo_api({
          locationId: toLocationId,
          itemMasterId: itemMasterId,
          transactionTypeId: 6,
          quantity: quantity,
        });
        detailFifo.push(fifoResponse.data);
        if (detailFifo.every((item) => item.status === 200)) {
          console.log("Post Reduce FIFO without error");
        }

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
    if (loading || approvalStatus === "approved") return;

    try {
      setLoading(true);

      // Check if already approved to prevent duplicate inventory reduction
      if (tin.status === 52) {
        console.warn("TIN is already approved. Skipping duplicate approval.");
        setApprovalStatus("approved");
        setLoading(false);
        return;
      }

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();

      const approvalData = {
        status: 52,
        approvedBy: sessionStorage.getItem("username"),
        approvedUserId: sessionStorage.getItem("userId"),
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

      queryClient.invalidateQueries(["tinList", companyId]);
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
