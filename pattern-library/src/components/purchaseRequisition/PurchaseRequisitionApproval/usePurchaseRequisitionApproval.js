import { useState, useEffect } from "react";
import { approve_purchase_requisition_api } from "../../../services/purchaseApi";

const usePurchaseRequisitionApproval = ({ onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);

  useEffect(() => {
    if (approvalStatus === "approved") {
      setTimeout(() => {
        onFormSubmit();
      }, 2000);
    }
  }, [approvalStatus, onFormSubmit]);

  const handleApprove = async (purchaseRequisitionId) => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      const approvalData = {
        status: 2,
        approvedBy: sessionStorage.getItem("username"), //username
        approvedUserId: sessionStorage.getItem("userId"), //userid
        approvedDate: formattedDate,
        permissionId: 10,
      };
      const approvalResponse = await approve_purchase_requisition_api(
        purchaseRequisitionId,
        approvalData
      );

      if (approvalResponse.status === 200) {
        setApprovalStatus("approved");
        console.log(
          "Purchase requisition approved successfully:",
          approvalResponse
        );
      } else {
        setApprovalStatus("error");
      }

      setTimeout(() => {
        setApprovalStatus(null);
      }, 2000);
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error approving purchase requisition:", error);
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

export default usePurchaseRequisitionApproval;
