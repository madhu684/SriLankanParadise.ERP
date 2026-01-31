import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  approve_issue_master_api,
  approve_requisition_master_api,
  get_issue_details_api,
  get_issue_masters_by_requisition_master_id_api,
  get_locations_inventories_by_location_id_item_master_id_api,
  patch_issue_detail_api,
  patch_location_inventory_api,
  post_increase_inventory_fifo_api,
  post_location_inventory_api,
  post_location_inventory_movement_api,
  update_min_state_in_mrn_api,
} from "../../../services/purchaseApi";

const useTinAccept = ({ tin, refetch, setRefetch, onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [receivedQuantities, setReceivedQuantities] = useState({});
  const [returnedQuantities, setReturnedQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const alertRef = useRef(null);

  const companyId = sessionStorage.getItem("companyId");

  const { data: issuedetails } = useQuery({
    queryKey: ["tins", tin.issueMasterId],
    queryFn: () => get_issue_details_api(tin.issueMasterId),
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

  const isAlreadyAccepted =
    tin?.status?.toString().charAt(1) === "5" ||
    (issuedetails?.length > 0 &&
      issuedetails.every(
        (d) => d.receivedQuantity !== null && d.receivedQuantity !== undefined
      ));

  const getStatusLabel = () => {
    let statusLabel = "Unknown Status";
    if (isAlreadyAccepted) {
      statusLabel = "Completed";
    } else {
      statusLabel = "In Progress";
    }
    return statusLabel;
  };

  const getStatusBadgeClass = () => {
    let statusClass = "bg-secondary";
    if (isAlreadyAccepted) {
      statusClass = "bg-success";
    } else {
      statusClass = "bg-info";
    }
    return statusClass;
  };

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

  const mutation = useMutation({
    mutationFn: ({ issuemasterid, updatedDetails }) =>
      patch_issue_detail_api(issuemasterid, updatedDetails),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tins", tin.issueMasterId]);
    },
    onError: (error) => {
      console.error("Failed to update received quantities:", error);
    },
  });

  // const updateInventory = async (
  //   details,
  //   formattedDate,
  //   toLocationId,
  //   fromLocationId
  // ) => {
  //   try {
  //     const locationId = parseInt(toLocationId, 10);
  //     const fromLocId = parseInt(fromLocationId, 10);

  //     for (const detail of details) {
  //       const { itemMasterId, batchId, issueDetailId } = detail;

  //       // Get the received and returned quantities for this detail
  //       const receivedQty = parseFloat(receivedQuantities[issueDetailId] || 0);
  //       const returnedQty = parseFloat(returnedQuantities[issueDetailId] || 0);

  //       console.log(
  //         `Item ${itemMasterId}: Received=${receivedQty}, Returned=${returnedQty}`
  //       );

  //       // Skip if batchId is invalid
  //       if (!batchId) {
  //         console.warn(
  //           `Skipping item: itemMasterId=${itemMasterId}, batchId=${batchId}`
  //         );
  //         continue;
  //       }

  //       // Handle received quantity - ADD to TO location (Location B)
  //       if (receivedQty > 0) {
  //         try {
  //           // Use patch instead of post to update existing inventory
  //           const patchResponse = await patch_location_inventory_api(
  //             fromLocId, // To Location (Location B)
  //             itemMasterId,
  //             batchId,
  //             "add", // Add the received quantity
  //             {
  //               stockInHand: receivedQty,
  //               permissionId: 1088,
  //             }
  //           );
  //           if (patchResponse && patchResponse.status === 404) {
  //             const existingItemDetails =
  //               await get_locations_inventories_by_location_id_item_master_id_api(
  //                 tin?.requisitionMaster?.requestedFromLocationId,
  //                 itemMasterId
  //               );
  //             const reOrderMaxOrderDetails =
  //               existingItemDetails?.data?.result?.[0] || {};
  //             const payload = {
  //               itemMasterId,
  //               batchId,
  //               locationId: fromLocId,
  //               stockInHand: receivedQty,
  //               permissionId: 1088,
  //               reOrderLevel: reOrderMaxOrderDetails?.reOrderLevel || 0,
  //               maxStockLevel: reOrderMaxOrderDetails?.maxStockLevel || 0,
  //             };
  //             await post_location_inventory_api(payload);
  //           }

  //           console.log(
  //             `Added ${receivedQty} to location ${locationId} for item ${itemMasterId}`
  //           );
  //         } catch (error) {
  //           console.error(
  //             `Failed to update location inventory for item ${itemMasterId}:`,
  //             error
  //           );
  //           throw new Error(
  //             `Failed to update inventory for item ${itemMasterId}`
  //           );
  //         }

  //         // Post Location Inventory Movement API for received quantity
  //         await post_location_inventory_movement_api({
  //           movementTypeId: 1,
  //           transactionTypeId: 5,
  //           itemMasterId,
  //           batchId,
  //           locationId: fromLocId, // To Location
  //           date: formattedDate,
  //           qty: receivedQty,
  //           permissionId: 1090,
  //         });
  //       }

  //       // Handle returned quantity - ADD back to FROM location (Location A)
  //       if (returnedQty > 0) {
  //         try {
  //           await patch_location_inventory_api(
  //             locationId, // From Location (Location A)
  //             itemMasterId,
  //             batchId,
  //             "add", // Add the returned quantity back
  //             {
  //               stockInHand: returnedQty,
  //               permissionId: 1089,
  //             }
  //           );

  //           console.log(
  //             `Added ${returnedQty} back to location ${fromLocId} for item ${itemMasterId}`
  //           );
  //         } catch (error) {
  //           console.error(
  //             `Failed to update return inventory for item ${itemMasterId}:`,
  //             error
  //           );
  //           throw new Error(
  //             `Failed to update return inventory for item ${itemMasterId}`
  //           );
  //         }

  //         // Post Location Inventory Movement API for returned quantity
  //         await post_location_inventory_movement_api({
  //           movementTypeId: 1,
  //           transactionTypeId: 5,
  //           itemMasterId,
  //           batchId,
  //           locationId: locationId, // From Location
  //           date: formattedDate,
  //           qty: returnedQty,
  //           permissionId: 1090,
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     throw new Error("Error updating inventory: " + error.message);
  //   }
  // };

  const increaseInventoryFifo = async (
    details,
    locationId,
    sourceLocationId
  ) => {
    console.log("=== increaseInventoryFifo STARTED ===");
    console.log("Details:", details);
    console.log("locationId:", locationId);
    console.log("sourceLocationId:", sourceLocationId);

    try {
      console.log("Details length:", details?.length);

      if (!details || details.length === 0) {
        console.log("No details to process!");
        return;
      }

      for (const detail of details) {
        console.log("Processing detail:", detail);

        const itemMasterId =
          detail.itemMaster?.itemMasterId || detail.itemMasterId;
        const issueDetailId = detail.issueDetailId;

        console.log("Extracted values:", { itemMasterId, issueDetailId });

        const receivedQty = parseFloat(receivedQuantities[issueDetailId] || 0);
        const returnedQty = parseFloat(returnedQuantities[issueDetailId] || 0);

        console.log(
          `Item ${itemMasterId}: Received=${receivedQty}, Returned=${returnedQty}`
        );

        // Handle received quantity
        if (receivedQty > 0) {
          console.log("ABOUT TO CALL API for received quantity");
          const payload = {
            locationId: parseInt(locationId, 10),
            itemMasterId: parseInt(itemMasterId, 10),
            transactionTypeId: 5,
            quantity: receivedQty,
            sourceLocationId: parseInt(sourceLocationId, 10),
          };
          console.log("Payload:", payload);

          try {
            const fifoResponse = await post_increase_inventory_fifo_api(
              payload
            );
            console.log("API Response:", fifoResponse);
          } catch (apiError) {
            console.error("API call failed:", apiError);
            throw apiError;
          }
        }

        // Handle returned quantity
        if (returnedQty > 0) {
          console.log("ABOUT TO CALL API for returned quantity");
          const payload = {
            locationId: parseInt(sourceLocationId, 10),
            itemMasterId: parseInt(itemMasterId, 10),
            transactionTypeId: 5,
            quantity: returnedQty,
            sourceLocationId: null,
          };
          console.log("Payload:", payload);

          try {
            const fifoResponse = await post_increase_inventory_fifo_api(
              payload
            );
            console.log("API Response:", fifoResponse);
          } catch (apiError) {
            console.error("API call failed:", apiError);
            throw apiError;
          }
        }
      }
      console.log("=== increaseInventoryFifo COMPLETED ===");
    } catch (error) {
      console.error("=== increaseInventoryFifo ERROR ===", error);
      throw error;
    }
  };

  const updateMrnState = async () => {
    try {
      // 1. Fetch all TINs for this TRN to check overall progress
      const tinsResponse = await get_issue_masters_by_requisition_master_id_api(
        tin.requisitionMasterId
      );
      const allTins = tinsResponse?.data?.result || [];

      // 2. Calculate total received quantity for each item across ALL TINs
      // Also check if all existing TINs are accepted
      let allTinsAccepted = true;
      const totalReceivedMap = {};

      allTins.forEach((t) => {
        // Check if TIN is accepted (status starts with 5)
        if (t.status?.toString().charAt(1) !== "5") {
          // If the TIN we just accepted isn't updated in the list yet, we handle it
          if (t.issueMasterId !== tin.issueMasterId) {
            allTinsAccepted = false;
          }
        }

        t.issueDetails?.forEach((detail) => {
          const itemId = detail.itemMasterId;
          const received = detail.receivedQuantity || 0;
          totalReceivedMap[itemId] = (totalReceivedMap[itemId] || 0) + received;
        });
      });

      // 3. Compare with requested quantities
      const requestedDetails = tin.requisitionMaster?.requisitionDetails || [];
      let allItemsFullyReceived = true;

      requestedDetails.forEach((req) => {
        const itemId = req.itemMasterId;
        const requestedQty = req.quantity || 0;
        const totalReceived = totalReceivedMap[itemId] || 0;

        if (totalReceived < requestedQty) {
          allItemsFullyReceived = false;
        }
      });

      // 4. Determine final TRN status
      // If all items are dispatched and all TINs are accepted -> Completed (5)
      // Otherwise -> In Progress (4)
      const finalStatus = allItemsFullyReceived && allTinsAccepted ? 5 : 4;

      await update_min_state_in_mrn_api(tin.requisitionMasterId, {
        isMINApproved: tin?.requisitionMaster?.isMINApproved,
        isMINAccepted: allItemsFullyReceived && allTinsAccepted,
      });

      await approve_requisition_master_api(tin.requisitionMasterId, {
        status: finalStatus,
        approvedBy: tin?.requisitionMaster?.approvedBy,
        approvedUserId: tin?.requisitionMaster?.approvedUserId,
        approvedDate: tin?.requisitionMaster?.approvedDate,
        permissionId: 1053,
      });
    } catch (error) {
      console.error("Error updating MRN state:", error);
    }
  };

  const updateTinStatus = async (tinId) => {
    try {
      await approve_issue_master_api(tinId, {
        status: 55, // Completed
        approvedBy: sessionStorage.getItem("username"),
        approvedUserId: sessionStorage.getItem("userId"),
        approvedDate: new Date().toISOString(),
        permissionId: 1064,
      });
    } catch (error) {
      console.error("Error updating TIN status:", error);
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

      // Check for negative quantities
      if (receivedQty < 0) {
        errors.push(
          `Received quantity cannot be negative for item ${item.itemMasterId}`
        );
      }

      if (returnedQty < 0) {
        errors.push(
          `Returned quantity cannot be negative for item ${item.itemMasterId}`
        );
      }

      // Check if both received and returned quantities are 0
      if (receivedQty === 0 && returnedQty === 0) {
        errors.push(
          `Both received and returned quantities cannot be 0 for item ${item.itemMasterId}`
        );
      }

      // Check if received quantity plus returned quantity equals issued quantity
      if (receivedQty + returnedQty !== issuedQty) {
        errors.push(
          `Received quantity plus returned quantity must equal issued quantity for item ${item.itemMasterId}`
        );
      }
    });

    return errors;
  };

  const handleAccept = async (tinId) => {
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

      // const currentDate = new Date();
      // const formattedDate = currentDate.toISOString();
      const toLocationId = tin?.requisitionMaster?.requestedToLocationId;
      const fromLocationId = tin?.requisitionMaster?.requestedFromLocationId;

      const updatedDetails = issuedetails.map((item) => ({
        issueDetailId: item.issueDetailId,
        receivedQuantity: receivedQuantities[item.issueDetailId] || 0,
        returnedQuantity: returnedQuantities[item.issueDetailId] || 0,
      }));

      // Update the issue details with received and returned quantities
      mutation.mutate({ issuemasterid: tin.issueMasterId, updatedDetails });

      // Add logging before the call
      console.log("Calling increaseInventoryFifo with:", {
        details: tin.issueDetails,
        toLocationId,
        fromLocationId,
      });

      // Ensure this completes before moving on
      await increaseInventoryFifo(
        tin.issueDetails,
        fromLocationId,
        toLocationId
      );

      console.log("increaseInventoryFifo completed successfully");

      await updateTinStatus(tinId);
      await updateMrnState();

      queryClient.invalidateQueries(["tins", tinId]);
      queryClient.invalidateQueries(["locationInventories", toLocationId]);
      queryClient.invalidateQueries(["locationInventories", fromLocationId]);
      queryClient.invalidateQueries(["transferRequisitions", companyId]);
      setRefetch(!refetch);
      setApprovalStatus("approved");
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error accepting transfer issue note:", error);
      console.error("Error stack:", error.stack); // Add stack trace
      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  console.log("TIN: ", tin);
  console.log("Received Qtys =", JSON.stringify(receivedQuantities));
  console.log("Returned Qtys =", JSON.stringify(returnedQuantities));

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
    isAlreadyAccepted,
    getStatusBadgeClass,
    getStatusLabel,
  };
};

export default useTinAccept;
