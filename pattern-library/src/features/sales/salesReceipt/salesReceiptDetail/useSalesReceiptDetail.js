import { useState, useEffect } from "react";
import {
  get_sales_receipt_api,
  get_sales_invoices_by_user_id_api,
} from "common/services/salesApi";

const useSalesReceiptDetail = (salesReceiptId) => {
  const [refreshedSalesReceipt, setRefreshedSalesReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSalesReceipt = async () => {
    if (!salesReceiptId) {
      setError("No sales receipt ID provided");
      return;
    }
    setIsLoading(true);
    try {
      const receiptResponse = await get_sales_receipt_api(salesReceiptId);
      let salesReceiptData = receiptResponse.data.result;

      // If salesReceiptSalesInvoices is empty or missing, fetch related invoices
      if (!salesReceiptData.salesReceiptSalesInvoices?.length) {
        const invoiceResponse = await get_sales_invoices_by_user_id_api(
          sessionStorage.getItem("userId")
        );
        const userInvoices = invoiceResponse.data.result || [];

        // Match invoices to this sales receipt based on salesInvoiceId
        const relatedInvoices = userInvoices.filter(
          (invoice) =>
            salesReceiptData.salesReceiptSalesInvoices?.some(
              (srsi) => srsi.salesInvoiceId === invoice.salesInvoiceId
            ) || invoice.salesReceiptId === salesReceiptId
        );

        salesReceiptData = {
          ...salesReceiptData,
          salesReceiptSalesInvoices: relatedInvoices.map((invoice) => ({
            salesInvoice: {
              ...invoice,
              amountDue: Math.max(0, invoice.amountDue || 0),
              invoiceAmount: invoice.invoiceAmount || 0, // Keep original invoice total
            },
            excessAmount: invoice.excessAmount || 0,
            outstandingAmount: invoice.amountDue || 0,
            settledAmount: invoice.settledAmount || 0,
            customerBalance: invoice.customerBalance || 0,
            salesInvoiceId: invoice.salesInvoiceId,
          })),
        };
      } else {
        // Ensure amountDue is not negative for existing invoices
        salesReceiptData = {
          ...salesReceiptData,
          salesReceiptSalesInvoices:
            salesReceiptData.salesReceiptSalesInvoices.map((srsi) => ({
              ...srsi,
              salesInvoice: {
                ...srsi.salesInvoice,
                amountDue: Math.max(0, srsi.salesInvoice?.amountDue || 0),
              },
            })),
        };
      }
      setRefreshedSalesReceipt(salesReceiptData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch sales receipt or related invoices");
      console.error("Error fetching sales receipt:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesReceipt();
  }, [salesReceiptId]);

  return { refreshedSalesReceipt, isLoading, error };
};

export default useSalesReceiptDetail;













