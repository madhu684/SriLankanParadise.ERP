import { useState, useEffect } from "react";
import { approve_sales_order_api } from "../../../services/salesApi";

const useSalesOrderApproval = ({ onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);

  useEffect(() => {
    if (approvalStatus === "approved") {
      setTimeout(() => {
        onFormSubmit();
      }, 2000);
    }
  }, [approvalStatus, onFormSubmit]);

  const handleApprove = async (salesOrderId) => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      const approvalData = {
        status: 2,
        approvedBy: sessionStorage.getItem("username"), //username
        approvedUserId: sessionStorage.getItem("userId"), //userid
        approvedDate: formattedDate,
        permissionId: 26,
      };
      const approvalResponse = await approve_sales_order_api(
        salesOrderId,
        approvalData
      );

      if (approvalResponse.status === 200) {
        setApprovalStatus("approved");
        console.log("Sales order approved successfully:", approvalResponse);
      } else {
        setApprovalStatus("error");
      }

      setTimeout(() => {
        setApprovalStatus(null);
      }, 2000);
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error approving slaes Order:", error);
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

export default useSalesOrderApproval;
