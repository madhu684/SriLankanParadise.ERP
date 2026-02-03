import { useEffect, useRef, useState } from "react";
import {
  approve_requisition_master_api,
  get_issue_details_api,
  patch_issue_detail_api,
  patch_location_inventory_api,
  post_location_inventory_api,
  post_location_inventory_movement_api,
  update_min_state_in_mrn_api,
} from "../../../services/purchaseApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useMinAccept = ({ min, refetch, setRefetch, onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [receivedQuantities, setReceivedQuantities] = useState({});
  const [returnedQuantities, setReturnedQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const alertRef = useRef(null);

  console.log("min in useMinAccept: ", min);

  const { data: issuedetails } = useQuery({
    queryKey: ["minDetails", min.issueMasterId],
    queryFn: () => get_issue_details_api(min.issueMasterId),
    select: (r) => r?.data?.result || [],
  });

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
      alertRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [approvalStatus]);

  useEffect(() => {
    if (issuedetails?.length > 0) {
      const updatedReceivedQuantities = issuedetails.reduce((acc, item) => {
        acc[item.issueDetailId] =
          item.receivedQuantity !== undefined && item.receivedQuantity !== null
            ? item.receivedQuantity
            : item.quantity;
        return acc;
      }, {});

      const updatedReturnedQuantities = issuedetails.reduce((acc, item) => {
        acc[item.issueDetailId] =
          item.returnedQuantity !== undefined && item.returnedQuantity !== null
            ? item.returnedQuantity
            : 0;
        return acc;
      }, {});

      setReceivedQuantities(updatedReceivedQuantities);
      setReturnedQuantities(updatedReturnedQuantities);
    }
  }, [issuedetails]);

  const handleReceivedQuantityChange = (issueDetailId, newQuantity) => {
    setReceivedQuantities((prev) => ({
      ...prev,
      [issueDetailId]: newQuantity,
    }));
  };

  const handleReturnedQuantityChange = (issueDetailId, newQuantity) => {
    setReturnedQuantities((prev) => ({
      ...prev,
      [issueDetailId]: newQuantity,
    }));
  };

  const getStatusLabel = () => {
    let statusLabel = "Unknown Status";
    if (min?.requisitionMaster?.isMINAccepted === false) {
      statusLabel = "In Progress";
    } else {
      statusLabel = "Completed";
    }
    return statusLabel;
  };

  const getStatusBadgeClass = () => {
    let statusClass = "bg-secondary";
    if (min?.requisitionMaster?.isMINAccepted === false) {
      statusClass = "bg-info";
    } else {
      statusClass = "bg-success";
    }
    return statusClass;
  };

  const mutation = useMutation({
    mutationFn: ({ issuemasterid, updatedDetails }) =>
      patch_issue_detail_api(issuemasterid, updatedDetails),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["minDetails", min.issueMasterId]);
    },
    onError: (error) => {
      console.error("Failed to update received quantities:", error);
    },
  });

  const updateInventory = async (details, formattedDate, toLocationId) => {
    try {
      const locationId = parseInt(toLocationId, 10);

      for (const detail of details) {
        console.log(
          `Processing inventory for detail with id ${detail.issueDetailId}: `,
          detail
        );

        const { itemMasterId, batchId, issueDetailId } = detail;

        // Get the received and returned quantities for this detail
        const receivedQty = parseFloat(receivedQuantities[issueDetailId] || 0);
        const returnedQty = parseFloat(returnedQuantities[issueDetailId] || 0);

        const netQuantity = receivedQty;

        console.log(
          `Item ${itemMasterId}: Received=${receivedQty}, Returned=${returnedQty}, Net=${netQuantity}`
        );

        // Skip if batchId is invalid or net quantity is 0 or negative
        if (!batchId || netQuantity <= 0) {
          console.warn(
            `Skipping item: itemMasterId=${itemMasterId}, batchId=${batchId}, netQuantity=${netQuantity}`
          );
          continue;
        }

        // Subtract the net quantity from inventory (received - returned)
        await patch_location_inventory_api(
          locationId,
          itemMasterId,
          batchId,
          "subtract",
          {
            stockInHand: netQuantity,
            permissionId: 1089,
          }
        );

        // Record the movement with net quantity
        await post_location_inventory_movement_api({
          movementTypeId: 2,
          transactionTypeId: 5,
          itemMasterId,
          batchId,
          locationId: locationId,
          date: formattedDate,
          qty: netQuantity,
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
      if (min?.requisitionMaster?.status !== 5) {
        await approve_requisition_master_api(min.requisitionMasterId, {
          status: 5,
          approvedBy: min?.requisitionMaster?.approvedBy,
          approvedUserId: min?.requisitionMaster?.approvedUserId,
          approvedDate: min?.requisitionMaster?.approvedDate,
          permissionId: 1053,
        });
      }
    } catch (error) {
      console.error("Error updating MRN state:", error);
    }
  };

  const validateQuantities = () => {
    const errors = [];

    // Check if issuedetails is available and is an array
    if (!issuedetails || !Array.isArray(issuedetails)) {
      return errors;
    }

    issuedetails.forEach((item) => {
      const receivedQty = parseFloat(
        receivedQuantities[item.issueDetailId] || 0
      );
      const returnedQty = parseFloat(
        returnedQuantities[item.issueDetailId] || 0
      );
      const issuedQty = parseFloat(item.quantity || 0);
      const itemIdentifier = item.itemMaster?.itemName || item.itemMasterId;

      // Check for negative quantities
      if (receivedQty < 0) {
        errors.push(
          `Received quantity cannot be negative for item ${itemIdentifier}`
        );
      }

      if (returnedQty < 0) {
        errors.push(
          `Returned quantity cannot be negative for item ${itemIdentifier}`
        );
      }

      // Check if both received and returned quantities are 0
      if (receivedQty === 0 && returnedQty === 0) {
        errors.push(
          `Both received and returned quantities cannot be 0 for item ${itemIdentifier}`
        );
      }

      // Check if received quantity plus returned quantity equals issued quantity
      if (receivedQty + returnedQty !== issuedQty) {
        errors.push(
          `Received quantity plus returned quantity must equal issued quantity for item ${itemIdentifier}`
        );
      }
    });

    return errors;
  };

  const handleAccept = async (minId) => {
    try {
      setLoading(true);
      setApprovalStatus(null);

      // Validate quantities before proceeding
      const validationErrors = validateQuantities();
      if (validationErrors.length > 0) {
        console.error("Validation errors:", validationErrors);
        setApprovalStatus("error");
        setTimeout(() => {
          setApprovalStatus(null);
          setLoading(false);
        }, 3000);
        return;
      }

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      const locationId = min?.requisitionMaster?.requestedToLocationId;

      const updatedDetails = issuedetails.map((item) => ({
        issueDetailId: item.issueDetailId,
        receivedQuantity: receivedQuantities[item.issueDetailId] || 0,
        returnedQuantity: returnedQuantities[item.issueDetailId] || 0,
      }));

      // Update the issue details with received and returned quantities
      mutation.mutate({ issuemasterid: min.issueMasterId, updatedDetails });

      // Update inventory with net quantities
      await updateInventory(issuedetails, formattedDate, locationId);

      // Update MRN state
      await updateMrnState();

      // Refresh queries and set success state
      queryClient.invalidateQueries(["min", minId]);
      setRefetch(!refetch);
      setApprovalStatus("approved");
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error accepting material issue note:", error);
      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return {
    approvalStatus,
    loading,
    alertRef,
    receivedQuantities,
    returnedQuantities,
    handleAccept,
    handleReceivedQuantityChange,
    handleReturnedQuantityChange,
    validateQuantities,
    getStatusBadgeClass,
    getStatusLabel,
  };
};

export default useMinAccept;
