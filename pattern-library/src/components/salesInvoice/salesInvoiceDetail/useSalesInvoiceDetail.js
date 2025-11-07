import { get_charges_and_deductions_applied_api } from "../../../services/purchaseApi";
import { get_company_api } from "../../../services/salesApi";
import { useQuery } from "@tanstack/react-query";

const useSalesInvoiceDetail = (salesInvoice) => {
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

  const fetchCompany = async () => {
    try {
      const response = await get_company_api(
        sessionStorage?.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const {
    data: company,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
    error: companyError,
  } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
  });

  // Group sales invoice details by item master ID
  const groupedSalesInvoiceDetails = salesInvoice?.salesInvoiceDetails?.reduce(
    (acc, item) => {
      const itemMasterId = item.itemMaster?.itemMasterId;
      if (!acc[itemMasterId]) {
        acc[itemMasterId] = { ...item, quantity: 0, totalPrice: 0 };
      }
      acc[itemMasterId].quantity += item.quantity;
      acc[itemMasterId].totalPrice += item.totalPrice;
      return acc;
    },
    {}
  );

  const renderSalesInvoiceDetails = () => {
    if (company.batchStockType === "FIFO") {
      return Object.values(groupedSalesInvoiceDetails);
    } else {
      return salesInvoice.salesInvoiceDetails;
    }
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
    isCompanyLoading,
    isCompanyError,
    company,
    renderSalesInvoiceDetails,
    calculateSubTotal,
  };
};

export default useSalesInvoiceDetail;
