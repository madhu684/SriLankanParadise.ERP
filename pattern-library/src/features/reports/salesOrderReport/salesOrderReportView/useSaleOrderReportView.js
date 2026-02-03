import React, { useEffect, useState } from "react";
import { get_sales_order_details_by_sales_order_id } from "common/services/salesApi";
import { useExcelExport } from "common/components/common/excelSheetGenerator/excelSheetGenerator.js";

const useSaleOrderReportViewHook = (salesOrderId) => {
  const [salesOrderDetails, setsalesOrderDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (salesOrderId) {
      const getsalesOrderDetails = async () => {
        setLoading(true);
        try {
          const response = await get_sales_order_details_by_sales_order_id(
            salesOrderId
          );
          setsalesOrderDetails(response.data.result);
          console.log("Sales Order Details", salesOrderDetails);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      getsalesOrderDetails();
    }
  }, [salesOrderId]);

  const excelExport = useExcelExport();
  const handleExportExcel = () => {
    if (!salesOrderDetails || salesOrderDetails.length === 0) {
      alert("No data available for export");
      return;
    }
    const columns = [
      {
        header: "Sales Order Detail Id",
        accessor: (item) => item.salesOrderDetailId,
      },
      {
        header: "Batch Id",
        accessor: (item) => item.itemBatchBatchId,
      },
      {
        header: "Item Name",
        accessor: (item) => item.itemBatch.itemMaster.itemName,
      },
      { header: "Quantity", accessor: (item) => item.quantity },
      { header: "Unit Price", accessor: (item) => item.unitPrice },
      { header: "Total Price", accessor: (item) => item.totalPrice },
    ];
    excelExport({
      data: salesOrderDetails,
      columns,
      fileName: `Sales_Order_Details_Report_for_SalesOrderId_${salesOrderId}.xlsx`,
      sheetName: "Sales Order Details Report",
      topic: `Sales Order Details Report for SalesOrderId: ${salesOrderId}`,
    });
  };
  return {
    salesOrderDetails,
    loading,
    handleExportExcel,
  };
};

export default useSaleOrderReportViewHook;













