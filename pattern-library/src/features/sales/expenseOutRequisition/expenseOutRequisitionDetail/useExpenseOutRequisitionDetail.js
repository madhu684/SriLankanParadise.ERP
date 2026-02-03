import { useState, useEffect, useRef } from "react";
import { put_expense_out_requisition_api } from "common/services/salesApi";
import { post_cashier_expense_out_api } from "common/services/salesApi";

const useExpenseOutRequisitionDetail = ({
  onFormSubmit,
  expenseOutRequisition,
}) => {
  const [expenseOutStatus, setExpenseOutStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const alertRef = useRef(null);

  useEffect(() => {
    if (expenseOutStatus === "expenseOut") {
      setTimeout(() => {
        onFormSubmit();
      }, 2000);
    }
  }, [expenseOutStatus, onFormSubmit]);

  const handleExpenseOut = async (expenseOutRequisitionId) => {
    try {
      setLoading(true);
      const currentDate = new Date().toISOString();

      const expenseOutRequisionUpdateData = {
        requestedUserId: expenseOutRequisition.requestedUserId,
        requestedBy: expenseOutRequisition.requestedBy,
        reason: expenseOutRequisition.reason,
        amount: expenseOutRequisition.amount,
        createdDate: expenseOutRequisition.createdDate,
        lastUpdatedDate: expenseOutRequisition.lastUpdatedDate,
        referenceNumber: expenseOutRequisition.referenceNumber,
        status: 4,
        approvedBy: expenseOutRequisition.approvedBy,
        approvedUserId: expenseOutRequisition.approvedUserId,
        approvedDate: expenseOutRequisition.approvedDate,
        recommendedBy: expenseOutRequisition.recommendedBy,
        recommendedUserId: expenseOutRequisition.recommendedUserId,
        recommendedDate: expenseOutRequisition.recommendedDate,
        companyId: expenseOutRequisition.companyId,
        permissionId: 1083,
      };

      const updateResponse = await put_expense_out_requisition_api(
        expenseOutRequisitionId,
        expenseOutRequisionUpdateData
      );

      const cashierExpenseOutData = {
        userId: sessionStorage.getItem("userId"),
        description: expenseOutRequisition?.reason,
        amount: expenseOutRequisition?.amount,
        createdDate: currentDate,
        companyId: sessionStorage.getItem("companyId"),
        expenseOutRequisitionId: expenseOutRequisitionId,
        permissionId: 1069,
      };

      const cashierExpenseOutResponse = await post_cashier_expense_out_api(
        cashierExpenseOutData
      );

      if (
        updateResponse.status === 200 &&
        cashierExpenseOutResponse.status === 201
      ) {
        setExpenseOutStatus("expenseOut");
        console.log("Expense out requisition processed successfully!");
      } else {
        setExpenseOutStatus("error");
      }

      setTimeout(() => {
        setExpenseOutStatus(null);
        setLoading(false);
      }, 2000);
    } catch (error) {
      setExpenseOutStatus("error");
      console.error(
        "Error processing expense out requisition. Please try again."
      );
      setTimeout(() => {
        setExpenseOutStatus(null);
        setLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (expenseOutStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [expenseOutStatus]);

  return { expenseOutStatus, loading, alertRef, handleExpenseOut };
};

export default useExpenseOutRequisitionDetail;













