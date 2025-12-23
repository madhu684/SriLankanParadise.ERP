import React from "react";
import { Modal, Button, Spinner, Alert, Badge } from "react-bootstrap";
import useSalesReceiptDetail from "./useSalesReceiptDetail";
import useSalesReceiptList from "../salesReceiptList/useSalesReceiptList";
import moment from "moment";
import "moment-timezone";

const SalesReceiptDetail = ({ show, handleClose, salesReceipt }) => {
  const { getStatusLabel, getStatusBadgeClass } = useSalesReceiptList();
  const { refreshedSalesReceipt, isLoading, error } = useSalesReceiptDetail(
    salesReceipt?.salesReceiptId
  );

  // Error State
  if (error) {
    return (
      <Modal show={show} onHide={handleClose} centered scrollable size="lg">
        <Modal.Header closeButton className="bg-light border-bottom">
          <Modal.Title className="fw-semibold">Sales Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <Alert variant="danger" className="mb-0 d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </Alert>
        </Modal.Body>
        <Modal.Footer className="bg-light border-top">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <Modal show={show} onHide={handleClose} centered scrollable size="lg">
        <Modal.Header closeButton className="bg-light border-bottom">
          <Modal.Title className="fw-semibold">Sales Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-5 text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted mb-0">Loading sales receipt details...</p>
        </Modal.Body>
        <Modal.Footer className="bg-light border-top">
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
      <Modal.Header closeButton className="bg-light border-bottom">
        <Modal.Title className="fw-semibold">Sales Receipt Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {/* Header Section */}
        <div className="mb-4 p-3 bg-light rounded-3 border">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h5 className="mb-1 fw-bold text-primary">
                {displaySalesReceipt?.referenceNumber || "N/A"}
              </h5>
              <small className="text-muted">Receipt Reference Number</small>
            </div>
            <div className="text-end">
              <div className="mb-1">
                <Badge
                  bg=""
                  className={`${getStatusBadgeClass(
                    displaySalesReceipt?.status
                  )} px-3 py-2 fs-6`}
                >
                  {getStatusLabel(displaySalesReceipt?.status)}
                </Badge>
              </div>
              <small className="text-muted">Status</small>
            </div>
          </div>
        </div>

        {/* Receipt Information */}
        <div className="mb-4">
          <h6 className="fw-semibold mb-3 pb-2 border-bottom">
            Receipt Information
          </h6>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="text-muted small mb-1">Created By</label>
                <p className="mb-0 fw-medium">
                  {displaySalesReceipt?.createdBy || "N/A"}
                </p>
              </div>
              <div className="mb-3">
                <label className="text-muted small mb-1">Receipt Date</label>
                <p className="mb-0 fw-medium">
                  {displaySalesReceipt?.receiptDate?.split("T")[0] || "N/A"}
                </p>
              </div>
              <div className="mb-3">
                <label className="text-muted small mb-1">Payment Mode</label>
                <p className="mb-0 fw-medium">
                  <Badge bg="info" className="px-2 py-1">
                    {displaySalesReceipt?.paymentMode?.mode || "N/A"}
                  </Badge>
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="text-muted small mb-1">
                  Payment Reference No
                </label>
                <p className="mb-0 fw-medium">
                  {displaySalesReceipt?.paymentReferenceNo || "N/A"}
                </p>
              </div>
              <div className="mb-3">
                <label className="text-muted small mb-1">Created Date</label>
                <p className="mb-0 fw-medium">
                  {displaySalesReceipt?.createdDate
                    ? moment
                        .utc(displaySalesReceipt.createdDate)
                        .tz("Asia/Colombo")
                        .format("YYYY-MM-DD hh:mm:ss A")
                    : "N/A"}
                </p>
              </div>
              <div className="mb-3">
                <label className="text-muted small mb-1">
                  Last Updated Date
                </label>
                <p className="mb-0 fw-medium">
                  {displaySalesReceipt?.lastUpdatedDate
                    ? moment
                        .utc(displaySalesReceipt.lastUpdatedDate)
                        .tz("Asia/Colombo")
                        .format("YYYY-MM-DD hh:mm:ss A")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="mb-3">
          <h6 className="fw-semibold mb-3 pb-2 border-bottom">
            Payment Details
          </h6>
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold">SI Ref No</th>
                  {/* <th>Payment Ref No</th> */}
                  <th className="fw-semibold text-end">Invoice Total</th>
                  <th className="fw-semibold text-end">Amount Due</th>
                  <th className="fw-semibold text-end">Excess Amount</th>
                  <th className="fw-semibold text-end">Outstanding Amount</th>
                  {/* <th>Amount Received</th> */}
                  <th className="fw-semibold text-end">Customer Balance</th>
                </tr>
              </thead>
              <tbody>
                {displaySalesReceipt?.salesReceiptSalesInvoices?.length > 0 ? (
                  displaySalesReceipt.salesReceiptSalesInvoices.map(
                    (item, index) => (
                      <tr key={index}>
                        <td className="fw-medium">
                          {item.salesInvoice?.referenceNo || "N/A"}
                        </td>
                        {/* <td>{item.salesInvoice?.paymentReferenceNo || "N/A"}</td> */}
                        <td className="text-end text-dark fw-bold">
                          {item.salesInvoice?.totalAmount?.toFixed(2) || "0.00"}
                        </td>
                        <td className="text-end">
                          <span className="text-dark fw-medium">
                            {Math.max(
                              0,
                              item.salesInvoice?.amountDue || 0
                            ).toFixed(2)}
                          </span>
                        </td>
                        <td className="text-end">
                          <span className="text-success fw-medium">
                            {item.excessAmount?.toFixed(2) || "0.00"}
                          </span>
                        </td>
                        <td className="text-end">
                          <span className="text-danger fw-medium">
                            {item.outstandingAmount?.toFixed(2) || "0.00"}
                          </span>
                        </td>
                        {/* <td>
                        {(
                          (item.settledAmount || 0) +
                          (item.customerBalance || 0) +
                          (item.excessAmount || 0) -
                          (item.outstandingAmount || 0)
                        ).toFixed(2)}
                      </td> */}
                        <td className="text-end fw-medium">
                          {item.customerBalance?.toFixed(2) || "0.00"}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      <i className="bi bi-inbox fs-3 d-block mb-2"></i>
                      No associated sales invoices found for this receipt.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="table-light fw-semibold">
                <tr>
                  <td colSpan="4" className="border-0"></td>
                  <td className="text-end border-start">Total Excess Amount</td>
                  <td className="text-end text-success">
                    {displaySalesReceipt?.excessAmount?.toFixed(2) || "0.00"}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="border-0"></td>
                  <td className="text-end border-start">
                    Total Outstanding Amount
                  </td>
                  <td className="text-end text-danger">
                    {displaySalesReceipt?.outstandingAmount?.toFixed(2) ||
                      "0.00"}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="border-0"></td>
                  <td className="text-end border-start">
                    Total Amount Received
                  </td>
                  <td className="text-end text-primary">
                    {displaySalesReceipt?.amountReceived?.toFixed(2) || "0.00"}
                  </td>
                </tr>
                <tr className="table-primary">
                  <td colSpan="4" className="border-0"></td>
                  <td className="text-end border-start">
                    Total Amount Collected
                  </td>
                  <td className="text-end fw-bold fs-5">
                    {displaySalesReceipt?.amountCollect?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-light border-top">
        <Button variant="secondary" onClick={handleClose} className="px-4">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalesReceiptDetail;
