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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    approvalStatus,
    handleApprove,
    formatDate,
  };
};

export default usePurchaseRequisitionApproval;
