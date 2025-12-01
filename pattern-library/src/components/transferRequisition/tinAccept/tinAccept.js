import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  approve_requisition_master_api,
  get_issue_details_api,
  get_locations_inventories_by_location_id_item_master_id_api,
  patch_issue_detail_api,
  patch_location_inventory_api,
  post_batch_api,
  post_itemBatch_api,
  post_location_inventory_api,
  post_location_inventory_movement_api,
  update_min_state_in_mrn_api,
} from "../../../services/purchaseApi";
import toast from "react-hot-toast";

// Constants
const DAMAGE_LOCATION_ID = 5;
const MOVEMENT_TYPE_ID = 1;
const TRANSACTION_TYPE_ID = 5;
const STATUS_COMPLETED = 5;
const APPROVAL_TIMEOUT = 2000;

const useTinAccept = ({ tin, onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [receivedQuantities, setReceivedQuantities] = useState({});
  const [returnedQuantities, setReturnedQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(true);

  const queryClient = useQueryClient();
  const alertRef = useRef(null);

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);
  const username = useMemo(() => sessionStorage.getItem("username"), []);
  const userId = useMemo(() => sessionStorage.getItem("userId"), []);

  // Check if already accepted
  const isAccepted = useMemo(
    () => tin?.requisitionMaster?.isMINAccepted === true,
    [tin?.requisitionMaster?.isMINAccepted]
  );

  // Fetch issue details
  const { data: issuedetails } = useQuery({
    queryKey: ["tins", tin.issueMasterId],
    queryFn: () => get_issue_details_api(tin.issueMasterId),
    select: (r) => r?.data?.result || [],
    enabled: !!tin.issueMasterId,
  });

  // Auto-close form after approval
  useEffect(() => {
    if (approvalStatus === "approved") {
      const timer = setTimeout(() => {
        setShowValidation(false);
        onFormSubmit();
        // Reset states
        setTimeout(() => {
          setApprovalStatus(null);
          setShowValidation(true);
        }, 500);
      }, APPROVAL_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [approvalStatus, onFormSubmit]);

  // Scroll to alert
  useEffect(() => {
    if (approvalStatus) {
      alertRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [approvalStatus]);

  // Initialize quantities from issue details
  useEffect(() => {
    if (issuedetails?.length > 0) {
      const received = {};
      const returned = {};

      issuedetails.forEach((item) => {
        received[item.issueDetailId] = item.quantity ?? 0;
        returned[item.issueDetailId] = item.returnedQuantity ?? 0;
      });

      setReceivedQuantities(received);
      setReturnedQuantities(returned);
    }
  }, [issuedetails]);

  // Reset validation display when modal reopens or status changes
  useEffect(() => {
    if (isAccepted) {
      setShowValidation(false);
    } else {
      setShowValidation(true);
    }
  }, [isAccepted]);

  // Status helpers
  const getStatusLabel = useCallback(() => {
    return tin?.requisitionMaster?.isMINAccepted ? "Completed" : "In Progress";
  }, [tin?.requisitionMaster?.isMINAccepted]);

  const getStatusBadgeClass = useCallback(() => {
    return tin?.requisitionMaster?.isMINAccepted ? "bg-success" : "bg-info";
  }, [tin?.requisitionMaster?.isMINAccepted]);

  // Quantity change handlers
  const handleReceivedQuantityChange = useCallback(
    (issueDetailId, newQuantity) => {
      const value = parseFloat(newQuantity) || 0;
      setReceivedQuantities((prev) => ({
        ...prev,
        [issueDetailId]: value,
      }));
    },
    []
  );

  const handleReturnedQuantityChange = useCallback(
    (issueDetailId, newQuantity) => {
      const value = parseFloat(newQuantity) || 0;
      setReturnedQuantities((prev) => ({
        ...prev,
        [issueDetailId]: value,
      }));
    },
    []
  );

  // Update issue details mutation
  const mutation = useMutation({
    mutationFn: ({ issuemasterid, updatedDetails }) =>
      patch_issue_detail_api(issuemasterid, updatedDetails),
    onSuccess: () => {
      queryClient.invalidateQueries(["tins", tin.issueMasterId]);
    },
    onError: (error) => {
      console.error("Failed to update received quantities:", error);
      toast.error("Failed to update quantities");
    },
  });

  // Generate batch reference
  const generateBatchRef = useCallback(() => {
    const formattedDate = new Date()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `B-${formattedDate}-${randomNum}`;
  }, []);

  // Create batch
  const createBatch = useCallback(async () => {
    const batchData = {
      batchRef: generateBatchRef(),
      date: new Date().toISOString(),
      companyId,
      permissionId: 1047,
    };

    const response = await post_batch_api(batchData);
    return response.data.result?.batchId;
  }, [companyId, generateBatchRef]);

  // Update or create location inventory
  const updateOrCreateInventory = async (
    locationId,
    itemMasterId,
    batchId,
    quantity,
    operation,
    permissionId
  ) => {
    try {
      const response = await patch_location_inventory_api(
        locationId,
        itemMasterId,
        batchId,
        operation,
        { stockInHand: quantity, permissionId }
      );

      // If inventory doesn't exist, create it
      if (response?.status === 404) {
        const existingItemDetails =
          await get_locations_inventories_by_location_id_item_master_id_api(
            tin?.requisitionMaster?.requestedFromLocationId,
            itemMasterId
          );

        const reOrderMaxOrderDetails =
          existingItemDetails?.data?.result?.[0] || {};

        await post_location_inventory_api({
          itemMasterId,
          batchId,
          locationId,
          stockInHand: quantity,
          permissionId,
          reOrderLevel: reOrderMaxOrderDetails?.reOrderLevel || 0,
          maxStockLevel: reOrderMaxOrderDetails?.maxStockLevel || 0,
        });
      }
    } catch (error) {
      console.error(
        `Failed to update inventory for item ${itemMasterId}:`,
        error
      );
      throw error;
    }
  };

  // Record inventory movement
  const recordInventoryMovement = async (
    locationId,
    itemMasterId,
    batchId,
    qty,
    date
  ) => {
    await post_location_inventory_movement_api({
      movementTypeId: MOVEMENT_TYPE_ID,
      transactionTypeId: TRANSACTION_TYPE_ID,
      itemMasterId,
      batchId,
      locationId,
      date,
      qty,
      permissionId: 1090,
    });
  };

  // Update inventory with damage logic
  const updateInventory = async (
    batchId,
    details,
    formattedDate,
    fromLocationId
  ) => {
    const fromLocId = parseInt(fromLocationId, 10);

    for (const detail of details) {
      const { itemMasterId, issueDetailId } = detail;
      const receivedQty = parseFloat(receivedQuantities[issueDetailId] || 0);
      const returnedQty = parseFloat(returnedQuantities[issueDetailId] || 0);

      if (!batchId) {
        console.warn(`Skipping item ${itemMasterId}: Invalid batchId`);
        continue;
      }

      // Handle received quantity - ADD to FROM location (destination)
      if (receivedQty > 0) {
        await updateOrCreateInventory(
          fromLocId,
          itemMasterId,
          batchId,
          receivedQty,
          "add",
          1088
        );
        await recordInventoryMovement(
          fromLocId,
          itemMasterId,
          batchId,
          receivedQty,
          formattedDate
        );
      }

      // Handle damaged/returned quantity - ADD to DAMAGE location (ID: 5)
      if (returnedQty > 0) {
        await updateOrCreateInventory(
          DAMAGE_LOCATION_ID,
          itemMasterId,
          batchId,
          returnedQty,
          "add",
          1089
        );
        await recordInventoryMovement(
          DAMAGE_LOCATION_ID,
          itemMasterId,
          batchId,
          returnedQty,
          formattedDate
        );
      }
    }
  };

  // Update MRN state
  const updateMrnState = useCallback(async () => {
    await update_min_state_in_mrn_api(tin.requisitionMasterId, {
      isMINApproved: tin?.requisitionMaster?.isMINApproved,
      isMINAccepted: true,
    });

    if (tin?.requisitionMaster?.status !== STATUS_COMPLETED) {
      await approve_requisition_master_api(tin.requisitionMasterId, {
        status: STATUS_COMPLETED,
        approvedBy: tin?.requisitionMaster?.approvedBy,
        approvedUserId: tin?.requisitionMaster?.approvedUserId,
        approvedDate: tin?.requisitionMaster?.approvedDate,
        permissionId: 1053,
      });
    }
  }, [tin]);

  // Create item batch data
  const createItemBatchData = useCallback(
    async (batchId, fromLocationId) => {
      const promises = tin?.issueDetails.map(async (item) => {
        const formData = {
          batchId,
          itemMasterId: item.itemMasterId,
          costPrice: item.itemMaster.unitPrice || 0,
          sellingPrice: item.itemMaster.unitPrice || 0,
          status: true,
          companyId,
          createdBy: username,
          createdUserId: userId,
          tempQuantity: item.quantity,
          locationId: fromLocationId,
          qty: item.quantity,
          custDekNo: tin.issuingCustDekNo || "",
          permissionId: 1048,
        };

        return post_itemBatch_api(formData);
      });

      await Promise.all(promises);
    },
    [tin, companyId, username, userId]
  );

  // Validate quantities
  const validateQuantities = useCallback(() => {
    const errors = [];

    if (!issuedetails?.length || !showValidation || isAccepted) return errors;

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
          `Damaged quantity cannot be negative for item ${itemIdentifier}`
        );
      }

      // Check if both received and damaged quantities are 0
      if (receivedQty === 0 && returnedQty === 0) {
        errors.push(
          `Both received and damaged quantities cannot be 0 for item ${itemIdentifier}`
        );
      }

      // Check if received + damaged equals issued quantity
      const totalQty = receivedQty + returnedQty;
      if (totalQty !== issuedQty) {
        errors.push(
          `Received quantity plus Damaged quantity must equal issued quantity for item ${itemIdentifier}`
        );
      }
    });

    return errors;
  }, [
    issuedetails,
    receivedQuantities,
    returnedQuantities,
    showValidation,
    isAccepted,
  ]);

  // Handle accept
  const handleAccept = useCallback(
    async (tinId) => {
      try {
        setLoading(true);
        setApprovalStatus(null);

        // Validate quantities
        const validationErrors = validateQuantities();
        if (validationErrors.length > 0) {
          validationErrors.forEach((error) => toast.error(error));
          setApprovalStatus("error");

          // Auto-clear error status after 3 seconds
          setTimeout(() => {
            setApprovalStatus(null);
          }, 3000);
          return;
        }

        const formattedDate = new Date().toISOString();
        const toLocationId = tin?.requisitionMaster?.requestedToLocationId;
        const fromLocationId = tin?.requisitionMaster?.requestedFromLocationId;

        // Prepare updated details
        const updatedDetails = issuedetails.map((item) => ({
          issueDetailId: item.issueDetailId,
          receivedQuantity: receivedQuantities[item.issueDetailId] || 0,
          returnedQuantity: returnedQuantities[item.issueDetailId] || 0,
        }));

        // Update issue details
        mutation.mutate({ issuemasterid: tin.issueMasterId, updatedDetails });

        // Create batch and process
        const batchId = await createBatch();
        await createItemBatchData(batchId, fromLocationId);
        await updateInventory(
          batchId,
          tin.issueDetails,
          formattedDate,
          fromLocationId
        );
        await updateMrnState();

        // Invalidate queries
        queryClient.invalidateQueries(["tins", tinId]);
        queryClient.invalidateQueries(["locationInventories", toLocationId]);
        queryClient.invalidateQueries(["locationInventories", fromLocationId]);
        queryClient.invalidateQueries(["transferRequisitions", companyId]);
        queryClient.invalidateQueries([
          "locationInventories",
          DAMAGE_LOCATION_ID,
        ]);
        setShowValidation(false);
        setApprovalStatus("approved");
        toast.success("Transfer issue note accepted successfully");
      } catch (error) {
        console.error("Error accepting transfer issue note:", error);
        setApprovalStatus("error");
        toast.error(error.message || "Error accepting transfer issue note");

        // Auto-clear error status after 3 seconds
        setTimeout(() => {
          setApprovalStatus(null);
        }, 3000);
      } finally {
        setLoading(false);
      }
    },
    [
      tin,
      issuedetails,
      receivedQuantities,
      returnedQuantities,
      validateQuantities,
      mutation,
      createBatch,
      createItemBatchData,
      updateMrnState,
      queryClient,
    ]
  );

  console.log("tin: ", tin);

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
    showValidation,
    isAccepted,
  };
};

export default useTinAccept;
