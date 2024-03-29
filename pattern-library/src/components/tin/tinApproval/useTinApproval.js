import { useState, useEffect, useRef } from "react";
import { approve_issue_master_api } from "../../../services/purchaseApi";

const useTinApproval = ({ tin, onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const alertRef = useRef(null);

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

  const handleApprove = async (tinId) => {
    try {
      setLoading(true);
      const firstDigit = parseInt(tin.status.toString().charAt(0), 10); // Extract the first digit
      const combinedStatus = parseInt(`${firstDigit}2`, 10);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();

      const approvalData = {
        status: combinedStatus,
        approvedBy: sessionStorage.getItem("username"), //username
        approvedUserId: sessionStorage.getItem("userId"), //userid
        approvedDate: formattedDate,
        permissionId: 1064,
      };
      const approvalResponse = await approve_issue_master_api(
        tinId,
        approvalData
      );

      if (approvalResponse.status === 200) {
        setApprovalStatus("approved");
        console.log(
          "Material issue note approved successfully:",
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
      console.error("Error approving material issue Note note:", error);
      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
    }
  };

  return {
    approvalStatus,
    loading,
    alertRef,
    handleApprove,
  };
};

export default useTinApproval;
