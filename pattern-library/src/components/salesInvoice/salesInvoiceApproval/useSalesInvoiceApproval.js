import { useState, useEffect } from "react";
import { approve_sales_invoice_api } from "../../../services/salesApi";

const useSalesInvoiceApproval = ({ onFormSubmit }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);

  useEffect(() => {
    if (approvalStatus === "approved") {
      setTimeout(() => {
        onFormSubmit();
      }, 2000);
    }
  }, [approvalStatus, onFormSubmit]);

  const handleApprove = async (salesInvoiceId) => {
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
      const approvalResponse = await approve_sales_invoice_api(
        salesInvoiceId,
        approvalData
      );

      if (approvalResponse.status === 200) {
        setApprovalStatus("approved");
        console.log("Sales invoice approved successfully:", approvalResponse);
      } else {
        setApprovalStatus("error");
      }

      setTimeout(() => {
        setApprovalStatus(null);
      }, 2000);
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error approving slaes invoice:", error);
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

export default useSalesInvoiceApproval;
