import { useState, useEffect, useRef } from "react";
import {
  approve_grn_master_api,
  post_batch_api,
  post_batchHasGrnMaster_api,
  post_itemBatchHasGrnDetail_api,
  post_itemBatch_api,
} from "../../../services/purchaseApi";

const useGrnApproval = ({ grn, onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const alertRef = useRef(null);
  const [modGrn, setModGrn] = useState(null);

  useEffect(() => {
    const deepCopyGrn = JSON.parse(JSON.stringify(grn));

    // Set cost and selling prices to unit price initially
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
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [approvalStatus]);

  const handleApprove = async (GrnId) => {
    try {
      setLoading(true);
      const firstDigit = parseInt(grn.status.toString().charAt(0), 10); // Extract the first digit
      const combinedStatus = parseInt(`${firstDigit}2`, 10);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();

      const approvalData = {
        status: combinedStatus,
        approvedBy: sessionStorage.getItem("username"), //username
        approvedUserId: sessionStorage.getItem("userId"), //userid
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

  const generateBatchRef = () => {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "");

    // Generate random 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    // Combine components to form batch reference
    return `B-${formattedDate}-${randomNum}`;
  };

  const createBatch = async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const batchRef = generateBatchRef();

    const batchData = {
      batchRef: batchRef,
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
      batchId: batchId,
      permissionId: 1049,
    };

    await post_batchHasGrnMaster_api(batchHasGrnData);
  };

  const createItemBatchesAndDetails = async (batchId, grnId) => {
    // Iterate over GRN details to create item batches and details
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
    }
  };

  const createItemBatchData = (grnDetail, batchId) => {
    // Construct item batch data based on grnDetail and batchId
    return {
      batchId: batchId,
      itemMasterId: grnDetail.itemId,
      costPrice: grnDetail.costPrice,
      sellingPrice: grnDetail.sellingPrice,
      status: true,
      companyId: sessionStorage.getItem("companyId"),
      createdBy: sessionStorage.getItem("username"),
      createdUserId: sessionStorage.getItem("userId"),
      tempQuantity: grnDetail.acceptedQuantity + grnDetail.freeQuantity,
      locationId: sessionStorage?.getItem("locationId"),
      expiryDate: grnDetail.expiryDate,
      permissionId: 1048,
    };
  };

  const handleCostPriceChange = (value, index) => {
    const updatedGrnDetails = [...modGrn.grnDetails]; // Use modGrn.grnDetails
    updatedGrnDetails[index].costPrice = value;

    updatedGrnDetails[index].costPrice = Math.max(
      0,
      updatedGrnDetails[index].costPrice
    );

    setGrnDetails(updatedGrnDetails);
  };

  const handleSellingPriceChange = (value, index) => {
    const updatedGrnDetails = [...modGrn.grnDetails]; // Use modGrn.grnDetails
    updatedGrnDetails[index].sellingPrice = value;

    updatedGrnDetails[index].sellingPrice = Math.max(
      0,
      updatedGrnDetails[index].sellingPrice
    );

    setGrnDetails(updatedGrnDetails);
  };

  const setGrnDetails = (updatedGrnDetails) => {
    setModGrn((prevGrn) => ({
      ...prevGrn,
      grnDetails: updatedGrnDetails,
    }));
  };

  return {
    approvalStatus,
    loading,
    alertRef,
    modGrn,
    handleApprove,
    handleCostPriceChange,
    handleSellingPriceChange,
  };
};

export default useGrnApproval;
