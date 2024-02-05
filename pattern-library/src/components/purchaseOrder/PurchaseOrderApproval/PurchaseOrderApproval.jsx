import React from "react";
import { Modal, Button } from "react-bootstrap";
import usePurchaseOrderApproval from "./usePurchaseOrderApproval";
import usePurchaseOrderList from "../purchaseOrderList/usePurchaseOrderList";

const PurchaseOrderApproval = ({
  show,
  handleClose,
  handleApproved,
  purchaseOrder,
}) => {
  const { approvalStatus, handleApprove } = usePurchaseOrderApproval({
    onFormSubmit: () => {
      handleClose();
      handleApproved();
    },
  });
  const { getStatusLabel, getStatusBadgeClass } = usePurchaseOrderList();
  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Approve Purchase Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>Details for Purchase Order : {purchaseOrder.referenceNo}</h6>
          <div>
            Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                purchaseOrder.status
              )}`}
            >
              {getStatusLabel(purchaseOrder.status)}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Supplier Name:</strong>{" "}
              {purchaseOrder.supplier.supplierName}
            </p>
            <p>
              <strong>Contact Person:</strong>{" "}
              {purchaseOrder.supplier.contactPerson}
            </p>
            <p>
              <strong>Contact Number:</strong> {purchaseOrder.supplier.phone}
            </p>
            <p>
              <strong>Email:</strong> {purchaseOrder.supplier.email}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Order Date:</strong>{" "}
              {purchaseOrder?.orderDate?.split("T")[0]}
            </p>
            <p>
              <strong>Delivery Date:</strong>{" "}
              {purchaseOrder?.deliveryDate?.split("T")[0]}
            </p>
          </div>
        </div>

        <h6>Item Details</h6>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Item Category</th>
              <th>Item ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrder.purchaseOrderDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.itemCategory}</td>
                <td>{item.itemId}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice.toFixed(2)}</td>
                <td>{item.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4"></td>
              <th>Total Amount</th>
              <td colSpan="2">{purchaseOrder.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        {approvalStatus === "approved" && (
          <div
            className="alert alert-success alert-dismissible fade show mb-3"
            role="alert"
          >
            Purchase Order approved!
          </div>
        )}
        {approvalStatus === "error" && (
          <div className="alert alert-danger mb-3" role="alert">
            Error approving purchase Order. Please try again.
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="success"
          onClick={() => handleApprove(purchaseOrder.purchaseOrderId)}
        >
          Approve
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PurchaseOrderApproval;
