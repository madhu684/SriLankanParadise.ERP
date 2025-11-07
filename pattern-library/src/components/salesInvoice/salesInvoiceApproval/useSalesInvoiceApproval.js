import { useState, useEffect, useRef } from "react";
import {
  approve_sales_invoice_api,
  update_outstanding_balance_api,
} from "../../../services/salesApi";
import {
  get_charges_and_deductions_applied_api,
  post_reduce_inventory_fifo_api,
} from "../../../services/purchaseApi";
import { get_company_api } from "../../../services/salesApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useSalesInvoiceApproval = ({ onFormSubmit, salesInvoice }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const alertRef = useRef(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (approvalStatus === "approved") {
      setTimeout(() => {
        onFormSubmit();
      }, 2000);
    }
  }, [approvalStatus, onFormSubmit]);

  console.log(salesInvoice);

  const updateCustomer = async (customerId, movementTypeId, formData) => {
    try {
      const response = await update_outstanding_balance_api(
        customerId,
        movementTypeId,
        formData
      );
      return response;
    } catch (error) {
      console.error("Error fetching charges and deductions:", error);
    }
  };

  const handleApprove = async (salesInvoiceId) => {
    try {
      setLoading(true);
      let detailFifo = [];
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
        const fifoResponse = await post_reduce_inventory_fifo_api({
          locationId: salesInvoice?.locationId,
          itemMasterId: invoiceDetail?.itemBatchItemMasterId,
          transactionTypeId: 3,
          quantity: invoiceDetail?.quantity,
        });
        detailFifo.push(fifoResponse.data);
      }

      if (approvalResponse.status === 200) {
        if (detailFifo.every((item) => item.status === 200)) {
          const customerResponse = await updateCustomer(
            salesInvoice.customerId,
            1,
            { outstandingAmount: salesInvoice.totalAmount }
          );

          if (customerResponse.status === 200) {
            setApprovalStatus("approved");
            toast.success("Sales invoice approved successfully");
          } else {
            setApprovalStatus("error");
            toast.error("Error approving sales invoice");
          }
        } else {
          setApprovalStatus("error");
          toast.error("Error approving sales invoice");
        }
      } else {
        setApprovalStatus("error");
        toast.error("Error approving sales invoice");
      }

      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);

        queryClient.invalidateQueries([
          "salesInvoicesByUserId",
          sessionStorage.getItem("userId"),
        ]);
      }, 2000);
    } catch (error) {
      setApprovalStatus("error");
      console.error("Error approving slaes invoice:", error);
      setTimeout(() => {
        setApprovalStatus(null);
        setLoading(false);
      }, 2000);
      toast.error("Error approving sales invoice");
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
      const itemMasterId = item?.itemMaster?.itemMasterId;
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
