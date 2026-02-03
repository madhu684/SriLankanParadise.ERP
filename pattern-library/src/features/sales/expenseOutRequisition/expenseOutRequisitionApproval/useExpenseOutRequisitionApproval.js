import { useState, useEffect, useRef } from "react";
import { put_expense_out_requisition_api } from "common/services/salesApi";

const useExpenseOutRequisitionApproval = ({
  onFormSubmit,
  expenseOutRequisition,
  type,
}) => {
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

  const handleApprove = async (expenseOutRequisitionId) => {
    try {
      let expenseOutRequisionUpdateData;
      setLoading(true);
      const currentDate = new Date().toISOString();

      if (type === "recommendation") {
        expenseOutRequisionUpdateData = {
          requestedUserId: expenseOutRequisition.requestedUserId,
          requestedBy: expenseOutRequisition.requestedBy,
          reason: expenseOutRequisition.reason,
          amount: expenseOutRequisition.amount,
          createdDate: expenseOutRequisition.createdDate,
          lastUpdatedDate: expenseOutRequisition.lastUpdatedDate,
          referenceNumber: expenseOutRequisition.referenceNumber,
          status: 2,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          recommendedBy: sessionStorage.getItem("username"),
          recommendedUserId: sessionStorage.getItem("userId"),
          recommendedDate: currentDate,
          companyId: expenseOutRequisition.companyId,
          permissionId: 1083,
        };
      }

      if (type === "approval") {
        expenseOutRequisionUpdateData = {
          requestedUserId: expenseOutRequisition.requestedUserId,
          requestedBy: expenseOutRequisition.requestedBy,
          reason: expenseOutRequisition.reason,
          amount: expenseOutRequisition.amount,
          createdDate: expenseOutRequisition.createdDate,
          lastUpdatedDate: expenseOutRequisition.lastUpdatedDate,
          referenceNumber: expenseOutRequisition.referenceNumber,
          status: 3,
          approvedBy: sessionStorage.getItem("username"),
          approvedUserId: sessionStorage.getItem("userId"),
          approvedDate: currentDate,
          recommendedBy: expenseOutRequisition.recommendedBy,
          recommendedUserId: expenseOutRequisition.recommendedUserId,
          recommendedDate: expenseOutRequisition.recommendedDate,
          companyId: expenseOutRequisition.companyId,
          permissionId: 1083,
        };
      }

      const approvalResponse = await put_expense_out_requisition_api(
        expenseOutRequisitionId,
        expenseOutRequisionUpdateData
      );

      if (approvalResponse.status === 200) {
        setApprovalStatus("approved");
        type === "approval"
          ? console.log("Expense out requisition approved successfully!")
          : console.log("Expense out requisition recommended successfully!");
      } else {
        setApprovalStatus("error");
      }

      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
    } catch (error) {
      setApprovalStatus("error");
      type === "approval"
        ? console.error(
            "Error approving expense out requisition. Please try again."
          )
        : console.error(
            "Error recommending expense out requisition. Please try again."
          );
      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (approvalStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [approvalStatus]);

  return {
    approvalStatus,
    loading,
    alertRef,
    handleApprove,
  };
};

export default useExpenseOutRequisitionApproval;













