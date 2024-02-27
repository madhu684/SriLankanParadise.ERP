import React from "react";
import { Modal, Button } from "react-bootstrap";
import useSalesInvoiceApproval from "./useSalesInvoiceApproval";
import useSalesInvoiceList from "../salesInvoiceList/useSalesInvoiceList";

const SalesInvoiceApproval = ({
  show,
  handleClose,
  handleApproved,
  salesInvoice,
}) => {
  const { approvalStatus, handleApprove } = useSalesInvoiceApproval({
    onFormSubmit: () => {
      handleClose();
      handleApproved();
    },
  });
  const { getStatusLabel, getStatusBadgeClass } = useSalesInvoiceList();
  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Approve Sales Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Created By:</strong> {salesInvoice.createdBy}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Invoice Date:</strong>{" "}
              {salesInvoice?.invoiceDate?.split("T")[0]}
            </p>
            <p>
              <strong>Due Date:</strong> {salesInvoice?.dueDate?.split("T")[0]}
            </p>
          </div>
        </div>

        <h6>Item Details</h6>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Batch Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {salesInvoice.salesInvoiceDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.itemCategory}</td>
                <td>{item.itemId}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice.toFixed(2)}</td>
                <td>{item.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3"></td>
              <th>Total Amount</th>
              <td colSpan="2">{salesInvoice.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        {approvalStatus === "approved" && (
          <div
            className="alert alert-success alert-dismissible fade show mb-3"
            role="alert"
          >
            Sales invoice approved!
          </div>
        )}
        {approvalStatus === "error" && (
          <div className="alert alert-danger mb-3" role="alert">
            Error approving sales invoice. Please try again.
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="success"
          onClick={() => handleApprove(salesInvoice.salesInvoiceId)}
        >
          Approve
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalesInvoiceApproval;
