import React, { useMemo, useCallback } from "react";
import { get_sales_invoices_by_status_customerId } from "../../../services/salesApi";
import { useQuery } from "@tanstack/react-query";

const CustomerStatusMessage = ({ formData }) => {
  const customerId = formData?.selectedCustomer?.customerId;

  const fetchSalesUnsettledInvoices = useCallback(async () => {
    try {
      const response = await get_sales_invoices_by_status_customerId(
        customerId,
        2
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching sales unsettled invoices:", error);
      return [];
    }
  }, [customerId]);

  // Fetch unsettled invoices
  const {
    data: unSettledInvoices = [],
    isLoading,
    isError: isQueryError,
  } = useQuery({
    queryKey: ["unSettledInvoices", customerId],
    queryFn: fetchSalesUnsettledInvoices,
    enabled: !!formData.selectedCustomer,
  });

  const getStatus = useCallback(
    (formData, unSettledInvoices, isLoading, isQueryError) => {
      const currentDate = new Date();
      const licenseEndDate = formData?.selectedCustomer?.lisenEndDate
        ? new Date(formData.selectedCustomer.lisenEndDate)
        : null;

      // Check if customer is selected and license is expired
      if (
        formData?.selectedCustomer &&
        licenseEndDate &&
        currentDate > licenseEndDate
      ) {
        console.log("License expired:", { currentDate, licenseEndDate });
        return {
          message: (
            <div
              className="alert alert-danger alert-dismissible fade show mb-2"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>
                Unable to create sales invoice. Customer license has expired.
              </strong>
            </div>
          ),
          isError: true,
        };
      }

      // NEW: Prevent submission while loading or if query fails
      // This ensures validation isn't bypassed when unSettledInvoices is temporarily empty
      if (formData?.selectedCustomer && (isLoading || isQueryError)) {
        return {
          message: (
            <div
              className="alert alert-warning alert-dismissible fade show mb-2"
              role="alert"
            >
              <i className="bi bi-hourglass-split me-2"></i>
              <strong>
                {isLoading
                  ? "Checking customer invoices..."
                  : "Error loading customer data. Please try again."}
              </strong>
            </div>
          ),
          isError: true,
        };
      }

      // Check for unsettled invoices within credit duration
      if (formData?.selectedCustomer && unSettledInvoices.length > 0) {
        const creditDuration =
          Number(formData.selectedCustomer.creditDuration) || 0;
        const hasUnsettledWithinCreditDuration = unSettledInvoices.some(
          (invoice) => {
            const approvedDate = invoice.approvedDate
              ? new Date(invoice.approvedDate)
              : null;
            if (!approvedDate || isNaN(approvedDate)) {
              console.log("Invalid approvedDate for invoice:", invoice);
              return false;
            }
            const creditDurationEndDate = new Date(approvedDate);
            creditDurationEndDate.setDate(
              approvedDate.getDate() + creditDuration
            );
            const isWithinCreditDuration = currentDate < creditDurationEndDate;
            return isWithinCreditDuration;
          }
        );

        if (!hasUnsettledWithinCreditDuration) {
          return {
            message: (
              <div
                className="alert alert-danger alert-dismissible fade show mb-2"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>
                  Unable to create sales invoice. Customer has unsettled
                  invoices within credit duration.
                </strong>
              </div>
            ),
            isError: true,
          };
        }
      }

      // Check if customer is selected and outstanding amount is not 0
      const totalAmount = Number(formData?.totalAmount) || 0;
      const outstandingAmount =
        Number(formData?.selectedCustomer?.outstandingAmount) || 0;

      // Only check credit limit if outstandingAmount is not 0
      if (
        formData?.selectedCustomer &&
        outstandingAmount !== 0 &&
        formData.selectedCustomer.creditLimit < outstandingAmount + totalAmount
      ) {
        console.log("Credit limit exceeded:", {
          creditLimit: formData.selectedCustomer.creditLimit,
          outstandingAmount,
          totalAmount,
          sum: outstandingAmount + totalAmount,
        });
        return {
          message: (
            <div
              className="alert alert-danger alert-dismissible fade show mb-2"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>
                Unable to create sales invoice. Customer Credit Limit exceeded.
              </strong>
            </div>
          ),
          isError: true,
        };
      }

      // If all checks pass, show success message
      console.log("All checks passed, invoice can be raised");
      return {
        message: (
          <div
            className="alert alert-success alert-dismissible fade show mb-2"
            role="alert"
          >
            <i className="bi bi-info-circle-fill me-2"></i>
            <strong>Sales Invoice can be raised</strong>
          </div>
        ),
        isError: false,
      };
    },
    []
  );

  // Calculate status with loading and error states included in dependency array
  // This ensures status updates properly when query state changes
  const status = useMemo(() => {
    return formData?.selectedCustomer
      ? getStatus(formData, unSettledInvoices, isLoading, isQueryError)
      : { message: null, isError: true };
  }, [formData, unSettledInvoices, isLoading, isQueryError, getStatus]);

  const result = useMemo(
    () => ({
      message: <div className="mt-3">{status.message}</div>,
      disableSubmit: status.isError || isLoading,
    }),
    [status.message, status.isError, isLoading]
  );

  return result;
};

export default CustomerStatusMessage;
