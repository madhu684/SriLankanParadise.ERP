import { useState, useEffect, useRef, useMemo } from "react";
import { approve_requisition_master_api } from "../../../services/purchaseApi";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const useTransferRequisitionApproval = ({ onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const alertRef = useRef(null);

  const queryClient = useQueryClient();

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

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

  const handleApprove = async (requisitionMasterId) => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      const approvalData = {
        status: 2,
        approvedBy: sessionStorage.getItem("username"),
        approvedUserId: sessionStorage.getItem("userId"),
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
          "Transfer requisition note approved successfully:",
          approvalResponse
        );
      } else {
        setApprovalStatus("error");
      }

      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);

      queryClient.invalidateQueries(["transferRequisitions", companyId]);
      toast.success("Transfer requisition note approved successfully");
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error approving transfer requisition note:", error);
      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
      toast.error("Error approving transfer requisition note");
    }
  };

  return {
    approvalStatus,
    alertRef,
    loading,
    approvalStatus,
    handleApprove,
  };
};

export default useTransferRequisitionApproval;
