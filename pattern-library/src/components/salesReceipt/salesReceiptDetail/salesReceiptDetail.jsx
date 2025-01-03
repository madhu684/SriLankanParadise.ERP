import React from "react";
import { Modal, Button } from "react-bootstrap";
import useSalesReceiptDetial from "./useSalesReceiptDetail";
import useSalesReceiptList from "../salesReceiptList/useSalesReceiptList";
import moment from "moment";
import "moment-timezone";

const SalesReceiptDetail = ({ show, handleClose, salesReceipt }) => {
  const { getStatusLabel, getStatusBadgeClass } = useSalesReceiptList();
  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Sales Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>Details for Sales Receipt : {salesReceipt.referenceNumber}</h6>
          <div>
            Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                salesReceipt.status
              )}`}
            >
              {getStatusLabel(salesReceipt.status)}
            </span>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <p>
              <strong>Created By:</strong> {salesReceipt.createdBy}
            </p>
            <p>
              <strong>Receipt Date:</strong>{" "}
              {salesReceipt?.receiptDate?.split("T")[0]}
            </p>
            <p>
              <strong>Payment Mode:</strong> {salesReceipt.paymentMode.mode}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Created Date:</strong>{" "}
              {moment
                .utc(salesReceipt?.createdDate)
                .tz("Asia/Colombo")
                .format("YYYY-MM-DD hh:mm:ss A")}
            </p>
            <p>
              <strong>Last Updated Date:</strong>{" "}
              {moment
                .utc(salesReceipt?.lastUpdatedDate)
                .tz("Asia/Colombo")
                .format("YYYY-MM-DD hh:mm:ss A")}
            </p>
          </div>
        </div>

        {/* Payments Table */}
        <h6>Payments</h6>
        <div className="table-responsive mb-2">
          <table
            className="table"
            style={{ minWidth: "1000px", overflowX: "auto" }}
          >
            <thead>
              <tr>
                <th>SI Ref No</th>
                <th>Ref Number</th>
                <th>Invoice Total</th>
                <th>Amount Due</th>
                <th>Excess Amount</th>
                <th>Short Amount</th>
                <th>Amount Received</th>
                <th className="text-end">Customer Balance</th>
              </tr>
            </thead>
            <tbody>
              {salesReceipt.salesReceiptSalesInvoices.map((item, index) => (
                <tr key={index}>
                  <td>{item.salesInvoice?.referenceNo}</td>
                  <td>{item.salesInvoice?.referenceNumber}</td>
                  <td>{item.salesInvoice?.totalAmount.toFixed(2)}</td>
                  <td>{item.salesInvoice?.amountDue.toFixed(2)}</td>
                  <td>{item.excessAmount?.toFixed(2)}</td>
                  <td>{item.shortAmount?.toFixed(2)}</td>
                  <td>
                    {(
                      item.settledAmount +
                      item.customerBalance +
                      item.excessAmount -
                      item.shortAmount
                    ).toFixed(2)}
                  </td>
                  <td className="text-end">
                    {item.customerBalance?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="6"></td>
                <th>Total Excess Amount</th>
                <td className="text-end">
                  {salesReceipt.excessAmount.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan="6"></td>
                <th>Total Short Amount </th>
                <td className="text-end">
                  {salesReceipt.shortAmount.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan="6"></td>
                <th>Total Amount Received</th>
                <td className="text-end">
                  {salesReceipt.amountReceived.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalesReceiptDetail;
