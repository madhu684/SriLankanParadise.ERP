import { useState, useEffect, useRef, useMemo } from "react";
import { approve_requisition_master_api } from "../../../services/purchaseApi";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useMaterialRequisitionApproval = ({ onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const alertRef = useRef(null);

  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);

  const queryClient = useQueryClient();

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
        queryClient.invalidateQueries(["materialRequisitions", companyId]);
        toast.success("Material requisition approved successfully!");
      } else {
        setApprovalStatus("error");
        console.error("Error approving Material requisition note");
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
      console.error("Error approving Material requisition note");
    }
  };

  return {
    approvalStatus,
    alertRef,
    loading,
    handleApprove,
  };
};

export default useMaterialRequisitionApproval;
