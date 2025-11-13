import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { approve_sales_order_api } from "../../../services/salesApi";
import { get_charges_and_deductions_applied_api } from "../../../services/purchaseApi";
import { get_company_api } from "../../../services/salesApi";
import toast from "react-hot-toast";

const useSalesOrderApproval = ({ onFormSubmit, salesOrder }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const alertRef = useRef(null);

  const companyId = sessionStorage.getItem("companyId");
  const username = sessionStorage.getItem("username");
  const userId = sessionStorage.getItem("userId");

  const queryClient = useQueryClient();

  // Auto-close modal after successful approval
  useEffect(() => {
    if (approvalStatus === "approved") {
      setTimeout(() => {
        onFormSubmit();
      }, 2000);
    }
  }, [approvalStatus, onFormSubmit]);

  // Scroll to alert when status changes
  useEffect(() => {
    if (approvalStatus !== null && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [approvalStatus]);

  // Fetch charges and deductions
  const {
    data: chargesAndDeductionsApplied,
    isLoading: isChargesLoading,
    isError: isChargesError,
    error: chargesError,
  } = useQuery({
    queryKey: ["chargesAndDeductionsApplied", salesOrder?.salesOrderId],
    queryFn: async () => {
      const response = await get_charges_and_deductions_applied_api(
        1,
        salesOrder.salesOrderId,
        companyId
      );
      return response.data.result;
    },
    enabled: !!salesOrder?.salesOrderId && !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch company details
  const {
    data: company,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
    error: companyError,
  } = useQuery({
    queryKey: ["company", companyId],
    queryFn: async () => {
      const response = await get_company_api(companyId);
      return response.data.result;
    },
    enabled: !!companyId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Separate charges by line item (memoized)
  const { lineItemChargesAndDeductions, commonChargesAndDeductions } =
    useMemo(() => {
      if (!chargesAndDeductionsApplied) {
        return {
          lineItemChargesAndDeductions: [],
          commonChargesAndDeductions: [],
        };
      }

      const lineItem = [];
      const common = [];

      chargesAndDeductionsApplied.forEach((charge) => {
        if (charge.lineItemId) {
          lineItem.push(charge);
        } else {
          common.push(charge);
        }
      });

      return {
        lineItemChargesAndDeductions: lineItem,
        commonChargesAndDeductions: common,
      };
    }, [chargesAndDeductionsApplied]);

  // Get unique display names (memoized)
  const uniqueLineItemDisplayNames = useMemo(
    () =>
      Array.from(
        new Set(
          lineItemChargesAndDeductions.map(
            (charge) => charge.chargesAndDeduction.displayName
          )
        )
      ),
    [lineItemChargesAndDeductions]
  );

  const uniqueCommonDisplayNames = useMemo(
    () =>
      Array.from(
        new Set(
          commonChargesAndDeductions.map(
            (charge) => charge.chargesAndDeduction.displayName
          )
        )
      ),
    [commonChargesAndDeductions]
  );

  // Group sales order details by item master ID (memoized)
  const groupedSalesOrderDetails = useMemo(() => {
    if (!salesOrder?.salesOrderDetails) return {};

    return salesOrder.salesOrderDetails.reduce((acc, item) => {
      const itemMasterId = item?.itemMaster?.itemMasterId;

      if (!itemMasterId) return acc;

      if (!acc[itemMasterId]) {
        acc[itemMasterId] = {
          ...item,
          quantity: 0,
          totalPrice: 0,
        };
      }

      acc[itemMasterId].quantity += item.quantity;
      acc[itemMasterId].totalPrice += item.totalPrice;

      return acc;
    }, {});
  }, [salesOrder?.salesOrderDetails]);

  // Calculate subtotal (memoized)
  const calculateSubTotal = useMemo(() => {
    if (!salesOrder?.salesOrderDetails) return 0;

    return salesOrder.salesOrderDetails.reduce(
      (total, detail) => total + (detail.totalPrice || 0),
      0
    );
  }, [salesOrder?.salesOrderDetails]);

  // Render sales order details based on batch stock type (memoized)
  const renderSalesOrderDetails = () => {
    if (!company?.batchStockType || !salesOrder?.salesOrderDetails) {
      return [];
    }

    return company.batchStockType === "FIFO"
      ? Object.values(groupedSalesOrderDetails)
      : salesOrder.salesOrderDetails;
  };

  // Handle approval (useCallback to prevent re-renders)
  const handleApprove = useCallback(
    async (salesOrderId) => {
      try {
        setLoading(true);

        const approvalData = {
          status: 2,
          approvedBy: username,
          approvedUserId: userId,
          approvedDate: new Date().toISOString(),
          permissionId: 26,
        };

        const approvalResponse = await approve_sales_order_api(
          salesOrderId,
          approvalData
        );

        if (approvalResponse.status === 200) {
          setApprovalStatus("approved");
          toast.success("Sales Order Approved Successfully");
          queryClient.invalidateQueries([
            "salesOrdersByUserId",
            sessionStorage.getItem("userId"),
          ]);
        } else {
          setApprovalStatus("error");
          toast.error("Error Approving Sales Order");
        }

        setTimeout(() => {
          setApprovalStatus(null);
          setLoading(false);
        }, 2000);
      } catch (error) {
        setApprovalStatus("error");
        console.error("Error approving sales order:", error);
        toast.error("Error Approving Sales Order");

        setTimeout(() => {
          setApprovalStatus(null);
          setLoading(false);
        }, 2000);
      }
    },
    [username, userId]
  );

  return {
    // Data
    approvalStatus,
    chargesAndDeductionsApplied,
    company,
    uniqueLineItemDisplayNames,
    uniqueCommonDisplayNames,
    lineItemChargesAndDeductions,
    commonChargesAndDeductions,
    groupedSalesOrderDetails,
    renderSalesOrderDetails,
    calculateSubTotal: () => calculateSubTotal,

    // Refs
    alertRef,

    // Loading states
    loading,
    isLoading: isChargesLoading,
    isCompanyLoading,

    // Error states
    isError: isChargesError,
    isCompanyError,
    error: chargesError,
    companyError,

    // Actions
    handleApprove,
  };
};

export default useSalesOrderApproval;
