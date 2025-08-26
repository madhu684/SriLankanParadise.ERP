import { useState, useEffect, useRef } from "react";
import { approve_sales_invoice_api } from "../../../services/salesApi";
import {
  get_charges_and_deductions_applied_api,
  post_location_inventory_api,
  post_location_inventory_movement_api,
} from "../../../services/purchaseApi";
import { get_company_api } from "../../../services/salesApi";
import { useQuery } from "@tanstack/react-query";

const useSalesInvoiceApproval = ({ onFormSubmit, salesInvoice }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const alertRef = useRef(null);

  useEffect(() => {
    console.log(salesInvoice);
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
        approvedBy: sessionStorage.getItem("username"),
        approvedUserId: sessionStorage.getItem("userId"),
        approvedDate: formattedDate,
        permissionId: 26,
      };
      const approvalResponse = await approve_sales_invoice_api(
        salesInvoiceId,
        approvalData
      );

      for (const invoiceDetail of salesInvoice.salesInvoiceDetails) {
        // Add to location inventory
        const locationInventoryData = {
          itemMasterId: invoiceDetail.itemBatch.itemMasterId,
          batchId: invoiceDetail.itemBatch.batchId,
          locationId: salesInvoice.locationId,
          stockInHand: invoiceDetail.quantity,
          permissionId: 1088,
          movementTypeId: 2,
        };

        await post_location_inventory_api(locationInventoryData);

        // Add to location inventory movement
        const locationInventoryMovementData = {
          movementTypeId: 2,
          transactionTypeId: 3,
          itemMasterId: invoiceDetail.itemBatch.itemMasterId,
          batchId: invoiceDetail.itemBatch.batchId,
          locationId: salesInvoice.locationId,
          date: new Date().toISOString(), // Current date and time
          qty: invoiceDetail.quantity,
          permissionId: 1090,
        };

        await post_location_inventory_movement_api(
          locationInventoryMovementData
        );
      }

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
  const groupedSalesInvoiceDetails = salesInvoice.salesInvoiceDetails.reduce(
    (acc, item) => {
      const itemMasterId = item.itemBatch?.itemMaster?.itemMasterId;
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
    isCompanyLoading,
    isCompanyError,
    company,
    renderSalesInvoiceDetails,
    calculateSubTotal,
    handleApprove,
  };
};

export default useSalesInvoiceApproval;
