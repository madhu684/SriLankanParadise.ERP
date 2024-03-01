import { useState, useEffect } from "react";
import { approve_requisition_master_api } from "../../../services/purchaseApi";

const useMaterialRequisitionApproval = ({ onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (approvalStatus === "approved") {
      setTimeout(() => {
        onFormSubmit();
      }, 2000);
    }
  }, [approvalStatus, onFormSubmit]);

  const handleApprove = async (requisitionMasterId) => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      const approvalData = {
        status: 2,
        approvedBy: sessionStorage.getItem("username"), //username
        approvedUserId: sessionStorage.getItem("userId"), //userid
        approvedDate: formattedDate,
        permissionId: 1053,
      };
      const approvalResponse = await approve_requisition_master_api(
        requisitionMasterId,
        approvalData
      );

      if (approvalResponse.status === 200) {
        setApprovalStatus("approved");
        console.log(
          "Material requisition note approved successfully:",
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
      console.error("Error approving material requisition note:", error);
      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
    }
  };

  return {
    approvalStatus,
    handleApprove,
    loading,
    approvalStatus,
  };
};

export default useMaterialRequisitionApproval;
