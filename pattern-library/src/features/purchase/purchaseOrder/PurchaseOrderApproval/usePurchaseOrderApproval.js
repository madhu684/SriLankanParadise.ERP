import { useState, useEffect, useRef } from "react";
import {
  approve_purchase_order_api,
  approve_purchase_requisition_api,
  get_purchase_requisition_by_id_api,
} from "common/services/purchaseApi";
import { useQuery } from "@tanstack/react-query";
import { get_charges_and_deductions_applied_api } from "common/services/purchaseApi";

const usePurchaseOrderApproval = ({ onFormSubmit, purchaseOrder }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const alertRef = useRef(null);

  const { data: purchaseRequisition, isLoading: isLoadingPurchaseRequisition } =
    useQuery({
      queryKey: ["purchaseRequisition", purchaseOrder?.purchaseRequisitionId],
      queryFn: async () => {
        const response = await get_purchase_requisition_by_id_api(
          parseInt(purchaseOrder?.purchaseRequisitionId)
        );
        return response.data.result;
      },
      enabled: !!purchaseOrder?.purchaseRequisitionId,
      retry: 1,
    });

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

  const handleUpdatePR = async () => {
    try {
      await approve_purchase_requisition_api(
        purchaseRequisition.purchaseRequisitionId,
        {
          status: 5,
          approvedBy: purchaseRequisition.approvedBy,
          approvedUserId: purchaseRequisition.approvedUserId,
          approvedDate: purchaseRequisition.approvedDate,
          permissionId: 14,
        }
      );
    } catch (error) {}
  };

  const handleApprove = async (purchaseOrderId) => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      const approvalData = {
        status: 2,
        approvedBy: sessionStorage.getItem("username"), //username
        approvedUserId: sessionStorage.getItem("userId"), //userid
        approvedDate: formattedDate,
        isPRConverted: purchaseOrder?.isPRConverted,
        permissionId: 14,
      };
      const approvalResponse = await approve_purchase_order_api(
        purchaseOrderId,
        approvalData
      );

      if (purchaseOrder?.purchaseRequisitionId) {
        await handleUpdatePR();
      }

      if (approvalResponse.status === 200) {
        setApprovalStatus("approved");
        console.log("Purchase Order approved successfully:", approvalResponse);
      } else {
        setApprovalStatus("error");
      }

      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error approving purchase Order:", error);
      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
    }
  };

  const calculateSubTotal = () => {
    const subTotal = purchaseOrder.purchaseOrderDetails.reduce(
      (total, detail) => total + detail.totalPrice,
      0
    );
    return subTotal;
  };

  const fetchChargesAndDeductionsApplied = async () => {
    try {
      const response = await get_charges_and_deductions_applied_api(
        2,
        purchaseOrder.purchaseOrderId,
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
    queryKey: ["chargesAndDeductionsApplied", purchaseOrder.purchaseOrderId],
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

  const calculateLineItemDiscount = (quantity, unitPrice, totalPrice) => {
    const priceDifference = parseFloat(quantity * unitPrice - totalPrice);

    const lineItemDiscount = (priceDifference / (quantity * unitPrice)) * 100;

    return lineItemDiscount.toFixed(2);
  };

  return {
    chargesAndDeductionsApplied,
    isLoading,
    isError,
    error,
    uniqueLineItemDisplayNames,
    uniqueCommonDisplayNames,
    lineItemChargesAndDeductions,
    commonChargesAndDeductions,
    approvalStatus,
    alertRef,
    loading,
    isLoadingPurchaseRequisition,
    handleApprove,
    calculateSubTotal,
    calculateLineItemDiscount,
  };
};

export default usePurchaseOrderApproval;













