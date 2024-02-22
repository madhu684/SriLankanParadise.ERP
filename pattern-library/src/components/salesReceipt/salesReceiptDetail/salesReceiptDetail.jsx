import React from "react";
import { Modal, Button } from "react-bootstrap";
import useSalesReceiptDetial from "./useSalesReceiptDetail";
import useSalesReceiptList from "../salesReceiptList/useSalesReceiptList";

const SalesReceiptDetail = ({ show, handleClose, salesReceipt }) => {
  const { getStatusLabel, getStatusBadgeClass } = useSalesReceiptList();
  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Sales Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>Details for Sales Receipt : {salesReceipt.salesReceiptId}</h6>
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
          </div>
          <p>
            <strong>Receipt Date:</strong>{" "}
            {salesReceipt?.receiptDate?.split("T")[0]}
          </p>
          <p>
            <strong>Payment Mode:</strong> {salesReceipt.paymentMode.mode}
          </p>
        </div>

        {/* Payments Table */}
        <h6>Payments</h6>
        <div className="table-responsive mb-2">
          <table className="table">
            <thead>
              <tr>
                <th>SI Ref No</th>
                <th>Invoice Total</th>
                <th>Amount Due</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {salesReceipt.salesReceiptSalesInvoices.map((item, index) => (
                <tr key={index}>
                  <td>{item.salesInvoice?.referenceNo}</td>
                  <td>{item.salesInvoice?.totalAmount.toFixed(2)}</td>
                  <td>{item.salesInvoice?.amountDue.toFixed(2)}</td>
                  <td>{item.settledAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2"></td>
                <th>Total Amount Received</th>
                <td colSpan="2">{salesReceipt.amountReceived.toFixed(2)}</td>
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
