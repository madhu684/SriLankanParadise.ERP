import { useState, useEffect } from "react";
import { approve_grn_master_api } from "../../../services/purchaseApi";

const useGrnApproval = ({ grn, onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);

  useEffect(() => {
    if (approvalStatus === "approved") {
      setTimeout(() => {
        onFormSubmit();
      }, 2000);
    }
  }, [approvalStatus, onFormSubmit]);

  const handleApprove = async (GrnId) => {
    try {
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
      } else {
        setApprovalStatus("error");
      }

      setTimeout(() => {
        setApprovalStatus(null);
      }, 2000);
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error approving goods received note:", error);
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

export default useGrnApproval;
