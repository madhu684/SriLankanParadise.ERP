import React from "react";
import { Modal, Button } from "react-bootstrap";
import useSalesReceiptDetail from "./useSalesReceiptDetail";
import useSalesReceiptList from "../salesReceiptList/useSalesReceiptList";
import moment from "moment";
import "moment-timezone";
import useFormatCurrency from "../../salesInvoice/helperMethods/useFormatCurrency";

const SalesReceiptDetail = ({ show, handleClose, salesReceipt }) => {
  const { getStatusLabel, getStatusBadgeClass } = useSalesReceiptList();
  const { refreshedSalesReceipt, isLoading, error } = useSalesReceiptDetail(
    salesReceipt?.salesReceiptId
  );

  const formatTotals = useFormatCurrency({ showCurrency: false });

  if (error) {
    return (
      <Modal show={show} onHide={handleClose} centered scrollable size="lg">
        <Modal.Header
          closeButton
          className="bg-danger bg-opacity-10 border-bottom border-danger"
        >
          <Modal.Title className="text-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Sales Receipt
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="alert alert-danger mb-0" role="alert">
            <strong>Error:</strong> {error}
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-light">
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
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title>Sales Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-5 text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mb-0">Loading sales receipt details...</p>
        </Modal.Body>
        <Modal.Footer className="bg-light">
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
    <Modal show={show} onHide={handleClose} centered scrollable size="xl">
      <Modal.Header className="bg-light bg-opacity-9 border-bottom">
        <Modal.Title className="fs-4">
          {/* <i className="bi bi-receipt me-2"></i> */}
          Sales Receipt
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {/* Header Section */}
        <div className="mb-4 p-3 bg-light rounded-3 border">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h6 className="text-muted text-uppercase small fw-bold mb-1">
                Receipt Number
              </h6>
              <h5 className="mb-0 fw-bold text-primary">
                {displaySalesReceipt?.referenceNumber || "N/A"}
              </h5>
            </div>
            <div className="text-end">
              <h6 className="text-muted text-uppercase small fw-bold mb-1">
                Status
              </h6>
              <span
                className={`badge rounded-pill fs-6 ${getStatusBadgeClass(
                  displaySalesReceipt?.status
                )}`}
              >
                {getStatusLabel(displaySalesReceipt?.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Receipt Information */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                  <i className="bi bi-file-text me-2"></i>Receipt Information
                </h5>
              </div>
              <div className="card-body">
                {/* <h6 className="card-title text-primary mb-3 fw-bold">
                  Receipt Information
                </h6> */}
                <div className="mb-2">
                  <small className="text-muted d-block mb-1">Created By</small>
                  <p className="mb-0 fw-semibold">
                    {displaySalesReceipt?.createdBy || "N/A"}
                  </p>
                </div>
                <div className="mb-2">
                  <small className="text-muted d-block mb-1">
                    Receipt Date
                  </small>
                  <p className="mb-0 fw-semibold">
                    {displaySalesReceipt?.receiptDate?.split("T")[0] || "N/A"}
                  </p>
                </div>
                <div className="mb-0">
                  <small className="text-muted d-block mb-1">
                    Payment Mode
                  </small>
                  <p className="mb-0 fw-semibold">
                    <span className="badge bg-secondary bg-opacity-25 text-dark">
                      {displaySalesReceipt?.paymentMode?.mode || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-clock me-2"></i>Timestamp Details
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-2">
                  <small className="text-muted d-block mb-1">
                    Created Date
                  </small>
                  <p className="mb-0 fw-semibold">
                    {displaySalesReceipt?.createdDate
                      ? moment
                          .utc(displaySalesReceipt.createdDate)
                          .tz("Asia/Colombo")
                          .format("YYYY-MM-DD hh:mm:ss A")
                      : "N/A"}
                  </p>
                </div>
                <div className="mb-0">
                  <small className="text-muted d-block mb-1">
                    Last Updated
                  </small>
                  <p className="mb-0 fw-semibold">
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
        </div>

        {/* Payments Table */}
        <div className="card h-100 border-0 shadow mb-3">
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0">
              <i className="bi bi-table me-2"></i>
              Payment Details
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-bordered mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="text-nowrap">SI Ref No</th>
                    <th className="text-nowrap">Ref Number</th>
                    <th className="text-nowrap text-end">Invoice Total</th>
                    <th className="text-nowrap text-end">Amount Due</th>
                    <th className="text-nowrap text-end">Excess Amount</th>
                    <th className="text-nowrap text-end">Outstanding Amount</th>
                    <th className="text-nowrap text-end">Customer Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {displaySalesReceipt?.salesReceiptSalesInvoices?.length >
                  0 ? (
                    displaySalesReceipt.salesReceiptSalesInvoices.map(
                      (item, index) => (
                        <tr key={index}>
                          <td className="text-nowrap">
                            {item.salesInvoice?.referenceNo || "N/A"}
                          </td>
                          <td className="text-nowrap">
                            {item.salesInvoice?.referenceNumber || "N/A"}
                          </td>
                          <td className="text-nowrap text-end">
                            {formatTotals(
                              item.salesInvoice?.totalAmount?.toFixed(2)
                            ) || "0.00"}
                          </td>
                          <td className="text-nowrap text-end">
                            {formatTotals(
                              Math.max(
                                0,
                                item.salesInvoice?.amountDue || 0
                              ).toFixed(2)
                            )}
                          </td>
                          <td className="text-nowrap text-end text-success fw-semibold">
                            {formatTotals(item.excessAmount?.toFixed(2)) ||
                              "0.00"}
                          </td>
                          <td className="text-nowrap text-end text-danger fw-semibold">
                            {formatTotals(item.outstandingAmount?.toFixed(2)) ||
                              "0.00"}
                          </td>
                          <td className="text-nowrap text-end fw-semibold">
                            {formatTotals(item.customerBalance?.toFixed(2)) ||
                              "0.00"}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                        No associated sales invoices found for this receipt.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="table-light border-top border-2">
                  <tr>
                    <td colSpan="5"></td>
                    <th className="text-nowrap">Total Excess Amount</th>
                    <td className="text-end fw-bold text-success">
                      {formatTotals(
                        displaySalesReceipt?.excessAmount?.toFixed(2)
                      ) || "0.00"}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5"></td>
                    <th className="text-nowrap">Total Outstanding Amount</th>
                    <td className="text-end fw-bold text-danger">
                      {formatTotals(
                        displaySalesReceipt?.outstandingAmount?.toFixed(2)
                      ) || "0.00"}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5"></td>
                    <th className="text-nowrap">Total Amount Received</th>
                    <td className="text-end fw-bold text-dark">
                      {formatTotals(
                        displaySalesReceipt?.amountReceived?.toFixed(2)
                      ) || "0.00"}
                    </td>
                  </tr>
                  <tr className="table-primary">
                    <td colSpan="5"></td>
                    <th className="text-nowrap fs-6">Total Amount Collected</th>
                    <td className="text-end fw-bold fs-6">
                      {formatTotals(
                        displaySalesReceipt?.amountCollect?.toFixed(2)
                      ) || "0.00"}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-light border-top">
        <Button variant="secondary" onClick={handleClose} className="px-4">
          <i className="bi bi-x-circle me-2"></i>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalesReceiptDetail;
