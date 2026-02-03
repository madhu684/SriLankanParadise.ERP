import { useState, useEffect, useRef } from "react";
import {
  approve_grn_master_api,
  post_batch_api,
  post_batchHasGrnMaster_api,
  post_itemBatchHasGrnDetail_api,
  post_itemBatch_api,
  post_location_inventory_api,
  post_location_inventory_movement_api,
  approve_supply_return_master_api,
  get_purchase_order_by_purchase_order_id_api,
  get_purchase_requisition_by_id_api,
  approve_purchase_requisition_api,
  approve_purchase_order_api,
  get_locations_inventories_by_location_id_item_master_id_api,
} from "../../../services/purchaseApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useGrnApproval = ({ grn, onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const alertRef = useRef(null);
  const [modGrn, setModGrn] = useState(null);
  const [showManageItemModal, setShowManageItemModal] = useState(false);
  const [manageItem, setManageItem] = useState(null);
  const grnTypeDisplayMap = {
    finishedGoodsIn: "Finished Goods In",
    directPurchase: "Direct Purchase",
    goodsReceivedNote: "Goods Received Note",
  };

  const queryClient = useQueryClient();

  console.log("grn: ", grn);
  const isComplete = grn?.grnDetails.every(
    (detail) => detail.acceptedQuantity === detail.orderedQuantity
  );
  console.log("isComplete: ", isComplete);

  // Fetch Purchase Order
  const {
    data: purchaseOrder = {},
    isLoading: isLoadingPurchaseOrder,
    isError: isErrorPurchaseOrder,
  } = useQuery({
    queryKey: ["purchaseOrder", grn.purchaseOrderId],
    queryFn: async () => {
      const response = await get_purchase_order_by_purchase_order_id_api(
        parseInt(grn.purchaseOrderId)
      );
      return response.data.result;
    },
    enabled: !!grn.purchaseOrderId,
    retry: 1,
  });

  // Fetch Purchase Requisition
  const {
    data: purchaseRequisition = {},
    isLoading: isLoadingPurchaseRequisition,
    isError: isErrorPurchaseRequisition,
  } = useQuery({
    queryKey: ["purchaseRequisition", grn.purchaseRequisitionId],
    queryFn: async () => {
      const response = await get_purchase_requisition_by_id_api(
        parseInt(grn.purchaseRequisitionId)
      );
      return response.data.result;
    },
    enabled: !!grn.purchaseRequisitionId,
    retry: 1,
  });

  useEffect(() => {
    const deepCopyGrn = JSON.parse(JSON.stringify(grn));
    deepCopyGrn.grnDetails.forEach((detail) => {
      detail.costPrice = detail.unitPrice;
      detail.sellingPrice = detail.unitPrice;
    });
    setModGrn(deepCopyGrn);
  }, [grn]);

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

  const handleApprove = async (GrnId) => {
    if (isLoadingPurchaseOrder || isLoadingPurchaseRequisition) {
      setApprovalStatus("pending");
      return;
    }

    if (
      (grn.purchaseOrderId && isErrorPurchaseOrder) ||
      (grn.purchaseRequisitionId && isErrorPurchaseRequisition)
    ) {
      setApprovalStatus("error");
      setTimeout(() => {
        setApprovalStatus(null);
      }, 2000);
      return;
    }

    try {
      setLoading(true);
      // const firstDigit = parseInt(grn.status.toString().charAt(0), 10);
      // const combinedStatus = parseInt(`${firstDigit}2`, 10);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();

      const approvalData = {
        //status: combinedStatus,
        status: 52,
        approvedBy: sessionStorage.getItem("username"),
        approvedUserId: sessionStorage.getItem("userId"),
        approvedDate: formattedDate,
        permissionId: 14,
      };

      const approvalResponse = await approve_grn_master_api(
        GrnId,
        approvalData
      );

      if (approvalResponse.status === 200) {
        setApprovalStatus("approved");
        console.log(
          "Goods received note approved successfully:",
          approvalResponse
        );

        const batchId = await createBatch();
        await createBatchHasGrnMaster(batchId, GrnId);
        await createItemBatchesAndDetails(batchId, GrnId);

        if (grn.supplyReturnMasterId) {
          await updateSupplyReturnMaster(grn);
        }

        // Only call updatePR if purchaseRequisitionId exists and data is available
        if (
          grn.purchaseRequisitionId &&
          purchaseRequisition?.purchaseRequisitionId
        ) {
          await updatePR();
        }

        // Only call updatePO if purchaseOrderId exists and data is available
        if (grn.purchaseOrderId && purchaseOrder?.purchaseOrderId) {
          await updatePO();
        }

        queryClient.invalidateQueries(["grnList"]);
      } else {
        setApprovalStatus("error");
      }
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error approving goods received note:", error);
    } finally {
      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
    }
  };

  const generateBatchRef = () => {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `B-${formattedDate}-${randomNum}`;
  };

  const updateSupplyReturnMaster = async (master) => {
    try {
      const updateMasterData = {
        status: 6,
        approvedBy: master.approvedBy,
        approvedUserId: sessionStorage.getItem("userId"),
        approvedDate: new Date().toISOString(),
      };
      await approve_supply_return_master_api(
        master.supplyReturnMasterId,
        updateMasterData
      );
    } catch (error) {
      console.error("Error updating supply return master:", error);
      throw error;
    }
  };

  const updatePR = async () => {
    try {
      await approve_purchase_requisition_api(
        purchaseRequisition.purchaseRequisitionId,
        {
          status: isComplete ? 5 : 4,
          approvedBy: purchaseRequisition.approvedBy,
          approvedUserId: purchaseRequisition.approvedUserId,
          approvedDate: purchaseRequisition.approvedDate,
          permissionId: 14,
        }
      );
    } catch (error) {
      console.error("Error updating PR:", error);
      throw error;
    }
  };

  const updatePO = async () => {
    try {
      await approve_purchase_order_api(purchaseOrder.purchaseOrderId, {
        status: isComplete ? 5 : 4,
        approvedBy: purchaseOrder.approvedBy,
        approvedUserId: purchaseOrder.approvedUserId,
        approvedDate: purchaseOrder.approvedDate,
        purchaseRequisitionId: null,
        permissionId: 14,
      });
    } catch (error) {
      console.error("Error updating PO:", error);
      throw error;
    }
  };

  const createBatch = async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const batchRef = generateBatchRef();

    const batchData = {
      batchRef,
      date: formattedDate,
      companyId: sessionStorage.getItem("companyId"),
      permissionId: 1047,
    };

    const batchResponse = await post_batch_api(batchData);
    return batchResponse.data.result?.batchId;
  };

  const createBatchHasGrnMaster = async (batchId, grnId) => {
    const batchHasGrnData = {
      grnMasterId: grnId,
      batchId,
      permissionId: 1049,
    };
    await post_batchHasGrnMaster_api(batchHasGrnData);
  };

  const createItemBatchesAndDetails = async (batchId, grnId) => {
    for (const grnDetail of modGrn.grnDetails) {
      const itemBatchData = createItemBatchData(grnDetail, batchId);
      const itemBatchResponse = await post_itemBatch_api(itemBatchData);

      const itemBatchHasGrnDetailData = {
        grnDetailId: grnDetail.grnDetailId,
        itemBatchItemMasterId: itemBatchResponse.data.result?.itemMasterId,
        itemBatchBatchId: batchId,
        permissionId: 1050,
      };
      await post_itemBatchHasGrnDetail_api(itemBatchHasGrnDetailData);

      const existingItemDetails =
        await get_locations_inventories_by_location_id_item_master_id_api(
          grn?.warehouseLocationId,
          itemBatchResponse.data.result?.itemMasterId
        );

      const reOrderMaxOrderDetails =
        existingItemDetails?.data?.result?.[0] || {};

      const locationInventoryData = {
        itemMasterId: itemBatchResponse.data.result?.itemMasterId,
        batchId,
        locationId: grn?.warehouseLocationId,
        stockInHand: grnDetail.acceptedQuantity + grnDetail.freeQuantity,
        permissionId: 1088,
        movementTypeId: 2,
        reOrderLevel: reOrderMaxOrderDetails?.reOrderLevel || 0,
        maxStockLevel: reOrderMaxOrderDetails?.maxStockLevel || 0,
      };
      await post_location_inventory_api(locationInventoryData);

      const locationInventoryMovementData = {
        movementTypeId: 1,
        transactionTypeId: 4,
        itemMasterId: itemBatchResponse.data.result?.itemMasterId,
        batchId,
        locationId: grn?.warehouseLocationId,
        date: new Date().toISOString(),
        qty: grnDetail.acceptedQuantity + grnDetail.freeQuantity,
        permissionId: 1090,
      };
      await post_location_inventory_movement_api(locationInventoryMovementData);
    }
  };

  const createItemBatchData = (grnDetail, batchId) => ({
    batchId,
    itemMasterId: grnDetail.itemId,
    costPrice: grnDetail.costPrice,
    sellingPrice: grnDetail.sellingPrice,
    status: true,
    companyId: sessionStorage.getItem("companyId"),
    createdBy: sessionStorage.getItem("username"),
    createdUserId: sessionStorage.getItem("userId"),
    tempQuantity: grnDetail.acceptedQuantity + grnDetail.freeQuantity,
    locationId: grn?.warehouseLocationId,
    itemBarcode: grnDetail.itemBarcode,
    qty: grnDetail.acceptedQuantity + grnDetail.freeQuantity,
    permissionId: 1048,
  });

  const handleCostPriceChange = (value, index) => {
    setModGrn((prevGrn) => {
      const updatedGrnDetails = [...prevGrn.grnDetails];
      updatedGrnDetails[index].costPrice = Math.max(0, parseFloat(value) || 0);
      return { ...prevGrn, grnDetails: updatedGrnDetails };
    });
  };

  const handleSellingPriceChange = (value, index) => {
    setModGrn((prevGrn) => {
      const updatedGrnDetails = [...prevGrn.grnDetails];
      updatedGrnDetails[index].sellingPrice = Math.max(
        0,
        parseFloat(value) || 0
      );
      return { ...prevGrn, grnDetails: updatedGrnDetails };
    });
  };

  const handleOpenManageItemModal = (item) => {
    setManageItem(item);
    setShowManageItemModal(true);
  };

  const handleCloseManageItemModal = () => {
    setShowManageItemModal(false);
    setManageItem(null);
  };

  return {
    approvalStatus,
    loading,
    alertRef,
    modGrn,
    manageItem,
    showManageItemModal,
    grnTypeDisplayMap,
    isLoadingPurchaseOrder,
    isLoadingPurchaseRequisition,
    isErrorPurchaseOrder,
    isErrorPurchaseRequisition,
    handleApprove,
    handleCostPriceChange,
    handleSellingPriceChange,
    handleCloseManageItemModal,
    handleOpenManageItemModal,
  };
};

export default useGrnApproval;
