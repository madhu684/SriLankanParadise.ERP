import { useState, useEffect, useRef } from "react";
import { approve_sales_invoice_api } from "../../../services/salesApi";
import { get_charges_and_deductions_applied_api } from "../../../services/purchaseApi";
import { useQuery } from "@tanstack/react-query";

const useSalesInvoiceApproval = ({ onFormSubmit, salesInvoice }) => {
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

  const handleApprove = async (salesInvoiceId) => {
    try {
      setLoading(true);
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
        setLoading(false);
      }, 2000);
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error approving slaes invoice:", error);
      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
    }
  };

  const calculateSubTotal = () => {
    const subTotal = salesInvoice.salesInvoiceDetails.reduce(
      (total, detail) => total + detail.totalPrice,
      0
    );
    return subTotal;
  };

  const fetchChargesAndDeductionsApplied = async () => {
    try {
      const response = await get_charges_and_deductions_applied_api(
        3,
        salesInvoice.salesInvoiceId,
        sessionStorage.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching charges and deductions:", error);
    }
  };

  const {
    data: chargesAndDeductionsApplied,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["chargesAndDeductionsApplied", salesInvoice.salesInvoiceId],
    queryFn: fetchChargesAndDeductionsApplied,
  });

  const separateChargesByLineItem = () => {
    const lineItemChargesAndDeductions = [];
    const commonChargesAndDeductions = [];

    chargesAndDeductionsApplied?.forEach((charge) => {
      if (charge.lineItemId) {
        lineItemChargesAndDeductions.push(charge);
      } else {
        commonChargesAndDeductions.push(charge);
      }
    });

    return { lineItemChargesAndDeductions, commonChargesAndDeductions };
  };

  // Separate charges/deductions
  const { lineItemChargesAndDeductions, commonChargesAndDeductions } =
    separateChargesByLineItem();

  // Get unique display names of charges and deductions for line items and common charges
  const uniqueLineItemDisplayNames = Array.from(
    new Set(
      lineItemChargesAndDeductions.map(
        (charge) => charge.chargesAndDeduction.displayName
      )
    )
  );
  const uniqueCommonDisplayNames = Array.from(
    new Set(
      commonChargesAndDeductions.map(
        (charge) => charge.chargesAndDeduction.displayName
      )
    )
  );

  useEffect(() => {
    if (approvalStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [approvalStatus]);

  return {
    approvalStatus,
    chargesAndDeductionsApplied,
    isLoading,
    isError,
    error,
    uniqueLineItemDisplayNames,
    uniqueCommonDisplayNames,
    lineItemChargesAndDeductions,
    commonChargesAndDeductions,
    loading,
    alertRef,
    calculateSubTotal,
    handleApprove,
  };
};

export default useSalesInvoiceApproval;
