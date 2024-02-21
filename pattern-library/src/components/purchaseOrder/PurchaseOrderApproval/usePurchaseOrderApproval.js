import { useState, useEffect } from "react";
import { approve_purchase_order_api } from "../../../services/purchaseApi";

const usePurchaseOrderApproval = ({ onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);

  useEffect(() => {
    if (approvalStatus === "approved") {
      setTimeout(() => {
        onFormSubmit();
      }, 2000);
    }
  }, [approvalStatus, onFormSubmit]);

  const handleApprove = async (purchaseOrderId) => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      const approvalData = {
        status: 2,
        approvedBy: sessionStorage.getItem("username"), //username
        approvedUserId: sessionStorage.getItem("userId"), //userid
        approvedDate: formattedDate,
        permissionId: 14,
      };
      const approvalResponse = await approve_purchase_order_api(
        purchaseOrderId,
        approvalData
      );

      if (approvalResponse.status === 200) {
        setApprovalStatus("approved");
        console.log("Purchase Order approved successfully:", approvalResponse);
      } else {
        setApprovalStatus("error");
      }

      setTimeout(() => {
        setApprovalStatus(null);
      }, 2000);
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error approving purchase Order:", error);
      setTimeout(() => {
        setApprovalStatus(null);
      }, 2000);
    }
  };

  return {
    approvalStatus,
    handleApprove,
  };
};

export default usePurchaseOrderApproval;
