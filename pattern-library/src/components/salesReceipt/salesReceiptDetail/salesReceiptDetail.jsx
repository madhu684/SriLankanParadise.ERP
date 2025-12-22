import React from "react";
import { Modal, Button } from "react-bootstrap";
import useSalesReceiptDetail from "./useSalesReceiptDetail";
import useSalesReceiptList from "../salesReceiptList/useSalesReceiptList";
import moment from "moment";
import "moment-timezone";

const SalesReceiptDetail = ({ show, handleClose, salesReceipt }) => {
  const { getStatusLabel, getStatusBadgeClass } = useSalesReceiptList();
  const { refreshedSalesReceipt, isLoading, error } = useSalesReceiptDetail(
    salesReceipt?.salesReceiptId
  );

  if (error) {
    return (
      <Modal show={show} onHide={handleClose} centered scrollable size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Sales Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Error loading sales receipt details: {error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  if (isLoading) {
    return (
      <Modal show={show} onHide={handleClose} centered scrollable size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Sales Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Loading...</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const displaySalesReceipt =
    refreshedSalesReceipt?.salesReceiptSalesInvoices?.length > 0
      ? refreshedSalesReceipt
      : salesReceipt;

  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Sales Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>
            Details for Sales Receipt :{" "}
            {displaySalesReceipt?.referenceNumber || "N/A"}
          </h6>
          <div>
            Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                displaySalesReceipt?.status
              )}`}
            >
              {getStatusLabel(displaySalesReceipt?.status)}
            </span>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <p>
              <strong>Created By:</strong>{" "}
              {displaySalesReceipt?.createdBy || "N/A"}
            </p>
            <p>
              <strong>Receipt Date:</strong>{" "}
              {displaySalesReceipt?.receiptDate?.split("T")[0] || "N/A"}
            </p>
            <p>
              <strong>Payment Mode:</strong>{" "}
              {displaySalesReceipt?.paymentMode?.mode || "N/A"}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Payment Reference No:</strong>{" "}
              {displaySalesReceipt?.paymentReferenceNo || "N/A"}
            </p>
            <p>
              <strong>Created Date:</strong>{" "}
              {displaySalesReceipt?.createdDate
                ? moment
                    .utc(displaySalesReceipt.createdDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")
                : "N/A"}
            </p>
            <p>
              <strong>Last Updated Date:</strong>{" "}
              {displaySalesReceipt?.lastUpdatedDate
                ? moment
                    .utc(displaySalesReceipt.lastUpdatedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")
                : "N/A"}
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
                {/* <th>Payment Ref No</th> */}
                <th>Invoice Total</th>
                <th>Amount Due</th>
                <th>Excess Amount</th>
                <th>Outstanding Amount</th>
                {/* <th>Amount Received</th> */}
                <th className="text-end">Customer Balance</th>
              </tr>
            </thead>
            <tbody>
              {displaySalesReceipt?.salesReceiptSalesInvoices?.length > 0 ? (
                displaySalesReceipt.salesReceiptSalesInvoices.map(
                  (item, index) => (
                    <tr key={index}>
                      <td>{item.salesInvoice?.referenceNo || "N/A"}</td>
                      {/* <td>{item.salesInvoice?.paymentReferenceNo || "N/A"}</td> */}
                      <td>
                        {item.salesInvoice?.totalAmount?.toFixed(2) || "0.00"}
                      </td>
                      <td>
                        {Math.max(0, item.salesInvoice?.amountDue || 0).toFixed(
                          2
                        )}
                      </td>
                      <td>{item.excessAmount?.toFixed(2) || "0.00"}</td>
                      <td>{item.outstandingAmount?.toFixed(2) || "0.00"}</td>
                      {/* <td>
                        {(
                          (item.settledAmount || 0) +
                          (item.customerBalance || 0) +
                          (item.excessAmount || 0) -
                          (item.outstandingAmount || 0)
                        ).toFixed(2)}
                      </td> */}
                      <td className="text-end">
                        {item.customerBalance?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="7">
                    No associated sales invoices found for this receipt.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4"></td>
                <th>Total Excess Amount</th>
                <td className="text-end text-success">
                  {displaySalesReceipt?.excessAmount?.toFixed(2) || "0.00"}
                </td>
              </tr>
              <tr>
                <td colSpan="4"></td>
                <th>Total Outstanding Amount</th>
                <td className="text-end text-danger">
                  {displaySalesReceipt?.outstandingAmount?.toFixed(2) || "0.00"}
                </td>
              </tr>
              <tr>
                <td colSpan="4"></td>
                <th>Total Amount Received</th>
                <td className="text-end text-primary">
                  {displaySalesReceipt?.amountReceived?.toFixed(2) || "0.00"}
                </td>
              </tr>
              <tr>
                <td colSpan="4"></td>
                <th>Total Amount Collected</th>
                <td className="text-end">
                  {displaySalesReceipt?.amountCollect?.toFixed(2) || "0.00"}
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
