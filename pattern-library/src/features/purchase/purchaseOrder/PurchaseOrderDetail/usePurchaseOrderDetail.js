import { get_charges_and_deductions_applied_api } from "common/services/purchaseApi";
import { useQuery } from "@tanstack/react-query";

const usePurchaseOrderDetail = (purchaseOrder) => {
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
    calculateSubTotal,
    calculateLineItemDiscount,
  };
};

export default usePurchaseOrderDetail;













