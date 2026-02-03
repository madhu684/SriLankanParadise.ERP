import React from "react";
import { Modal, Button } from "react-bootstrap";
import useSalesInvoiceDetial from "./useSalesInvoiceDetail";
import useSalesInvoiceList from "../salesInvoiceList/useSalesInvoiceList";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import moment from "moment";
import "moment-timezone";

const SalesInvoiceDetail = ({ show, handleClose, salesInvoice }) => {
  const { getStatusLabel, getStatusBadgeClass } = useSalesInvoiceList();
  const {
    calculateSubTotal,
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
  } = useSalesInvoiceDetial(salesInvoice);
  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Sales Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isError && isCompanyError && (
          <ErrorComponent error={"Error fetching data"} />
        )}
        {isLoading && <LoadingSpinner maxHeight="65vh" />}
        {!isError && !isLoading && !isCompanyLoading && (
          <>
            <div className="mb-3 d-flex justify-content-between">
              <h6>Details for Sales Invoice : {salesInvoice.referenceNo}</h6>
              <div>
                Status :{" "}
                <span
                  className={`badge rounded-pill ${getStatusBadgeClass(
                    salesInvoice.status
                  )}`}
                >
                  {getStatusLabel(salesInvoice.status)}
                </span>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <p>
                  <strong>Created By:</strong> {salesInvoice.createdBy}
                </p>
                <p>
                  <strong>Created Date:</strong>{" "}
                  {moment
                    .utc(salesInvoice?.createdDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
                <p>
                  <strong>Last Updated Date:</strong>{" "}
                  {moment
                    .utc(salesInvoice?.lastUpdatedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
                <p>
                  <strong>Reference Number:</strong>{" "}
                  {salesInvoice?.referenceNumber}
                </p>
                {salesInvoice?.inVoicedPersonName !== null && (
                  <p>
                    <strong>Customer Name:</strong>{" "}
                    {salesInvoice?.inVoicedPersonName || "-"}
                  </p>
                )}
                {salesInvoice?.inVoicedPersonMobileNo !== null && (
                  <p>
                    <strong>Customer Contact No:</strong>{" "}
                    {salesInvoice?.inVoicedPersonMobileNo || "-"}
                  </p>
                )}
                {salesInvoice.status === 2 && (
                  <>
                    <p>
                      <strong>Approved By:</strong> {salesInvoice.approvedBy}
                    </p>
                    <p>
                      <strong>Approved Date:</strong>{" "}
                      {moment
                        .utc(salesInvoice?.approvedDate)
                        .tz("Asia/Colombo")
                        .format("YYYY-MM-DD hh:mm:ss A")}
                    </p>
                  </>
                )}
              </div>
              <div className="col-md-6">
                {salesInvoice.tokenNo !== null && (
                  <p>
                    <strong>Appointment Token No:</strong>{" "}
                    {salesInvoice?.tokenNo}
                  </p>
                )}
                <p>
                  <strong>Invoice Date:</strong>{" "}
                  {salesInvoice?.invoiceDate?.split("T")[0]}
                </p>
                <p>
                  <strong>Due Date:</strong>{" "}
                  {salesInvoice?.dueDate?.split("T")[0]}
                </p>
                {salesInvoice.salesOrder ? (
                  <div className="card border-success mb-3">
                    <div className="card-header bg-transparent">
                      <strong>Associate Sales Order</strong>
                    </div>
                    <div className="card-body">
                      <p>
                        Sales Order Reference No:{" "}
                        {salesInvoice.salesOrder.referenceNo}
                      </p>
                      <p>
                        Order Date:{" "}
                        {salesInvoice.salesOrder.orderDate?.split("T")[0] ?? ""}
                      </p>
                      <p>
                        Delivery Date:{" "}
                        {salesInvoice.salesOrder.deliveryDate?.split("T")[0] ??
                          ""}
                      </p>
                      <p>
                        Order Type:{" "}
                        {salesInvoice.salesOrder.customerId !== null
                          ? "Customer Order"
                          : "Direct Order"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-warning" role="alert">
                    This is a direct sales invoice, no sales order.
                  </div>
                )}
              </div>
            </div>

            <h6>Item Details</h6>
            <div className="table-responsive mb-2">
              <table
                className="table mt-2"
                style={{ minWidth: "1100px", overflowX: "auto" }}
              >
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Unit</th>
                    {company.batchStockType !== "FIFO" && <th>Batch Ref</th>}
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    {uniqueLineItemDisplayNames.map((displayName, index) => {
                      // Find the charge/deduction associated with the current display name
                      const charge = lineItemChargesAndDeductions.find(
                        (charge) =>
                          charge.chargesAndDeduction.displayName === displayName
                      );

                      const sign =
                        charge && charge.chargesAndDeduction.sign
                          ? `${charge.chargesAndDeduction.sign}`
                          : "";
                      return (
                        <th key={index}>
                          {sign} {displayName}
                        </th>
                      );
                    })}
                    <th className="text-end">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {renderSalesInvoiceDetails().map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemMaster?.itemName}</td>
                      <td>{item.itemMaster?.unit.unitName}</td>
                      {company.batchStockType !== "FIFO" && (
                        <td>{item.itemBatch?.batch?.batchRef}</td>
                      )}
                      <td>{item.quantity}</td>
                      <td>{item.unitPrice.toFixed(2)}</td>
                      {/* Render line item charges/deductions */}
                      {uniqueLineItemDisplayNames.map((displayName, idx) => {
                        const charge = lineItemChargesAndDeductions.find(
                          (charge) =>
                            charge.chargesAndDeduction.displayName ===
                              displayName &&
                            charge.lineItemId === item.itemBatchItemMasterId
                        );

                        let renderedValue = "";
                        if (charge) {
                          let value = charge.appliedValue;
                          if (charge.chargesAndDeduction.sign === "-") {
                            // Remove the negative sign if present
                            value = Math.abs(value);
                          }

                          if (charge.chargesAndDeduction.percentage !== null) {
                            // Calculate percentage value
                            const percentageValue =
                              (value / (item.unitPrice * item.quantity)) * 100;
                            renderedValue =
                              value.toFixed(2) +
                              ` (${percentageValue.toFixed(2)}
                              %)`;
                          } else {
                            renderedValue = value.toFixed(2);
                          }
                        }

                        return <td key={idx}>{renderedValue}</td>;
                      })}
                      <td className="text-end">{item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={
                        4 +
                        uniqueLineItemDisplayNames.length -
                        (company.batchStockType === "FIFO" ? 1 : 0)
                      }
                    ></td>
                    <th>Sub Total</th>
                    <td className="text-end">
                      {calculateSubTotal().toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={
                        4 +
                        uniqueLineItemDisplayNames.length -
                        (company.batchStockType === "FIFO" ? 1 : 0)
                      }
                    ></td>
                    <th>Deduction Amount</th>
                    <td className="text-end text-danger fw-semibold">
                      {salesInvoice?.discountAmount !== null
                        ? salesInvoice?.discountAmount.toFixed(2)
                        : 0}
                    </td>
                  </tr>
                  {/* Rendering common charges/deductions */}
                  {uniqueCommonDisplayNames.map((displayName, index) => {
                    // Filter charges/deductions that match the current display name and are not associated with a line item
                    const commonCharges = commonChargesAndDeductions.filter(
                      (charge) =>
                        charge.chargesAndDeduction.displayName ===
                          displayName && !charge.lineItemId
                    );

                    return commonCharges.map((charge, chargeIndex) => {
                      let renderedValue = Math.abs(charge.appliedValue).toFixed(
                        2
                      ); // Remove negative sign

                      // Check if the charge is percentage-based
                      if (charge.chargesAndDeduction.percentage !== null) {
                        // Calculate percentage value based on subtotal
                        const percentageValue =
                          (renderedValue / calculateSubTotal()) * 100;

                        renderedValue =
                          renderedValue + ` (${percentageValue.toFixed(2)} %)`;
                      }

                      return (
                        <tr key={`${index}-${chargeIndex}`}>
                          <td
                            colSpan={
                              4 +
                              uniqueLineItemDisplayNames.length -
                              (company.batchStockType === "FIFO" ? 1 : 0)
                            }
                          ></td>
                          <th>
                            {charge.chargesAndDeduction.sign}{" "}
                            {charge.chargesAndDeduction.displayName}
                          </th>
                          <td className="text-end">{renderedValue}</td>
                        </tr>
                      );
                    });
                  })}
                  <tr>
                    <td
                      colSpan={
                        4 +
                        uniqueLineItemDisplayNames.length -
                        (company.batchStockType === "FIFO" ? 1 : 0)
                      }
                    ></td>
                    <th>Total Amount</th>
                    <td className="text-end">
                      {salesInvoice.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalesInvoiceDetail;
