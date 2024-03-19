import { useState, useEffect, useRef } from "react";
import { approve_issue_master_api } from "../../../services/purchaseApi";

const useMinApproval = ({ min, onFormSubmit }) => {
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

  const handleApprove = async (minId) => {
    try {
      setLoading(true);
      const firstDigit = parseInt(min.status.toString().charAt(0), 10); // Extract the first digit
      const combinedStatus = parseInt(`${firstDigit}2`, 10);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();

      const approvalData = {
        status: combinedStatus,
        approvedBy: sessionStorage.getItem("username"), //username
        approvedUserId: sessionStorage.getItem("userId"), //userid
        approvedDate: formattedDate,
        permissionId: 1062,
      };
      const approvalResponse = await approve_issue_master_api(
        minId,
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

export default useMinApproval;
