import React from "react";
import { Modal, Button } from "react-bootstrap";
import usePurchaseRequisitionDetial from "./usePurchaseRequisitionDetail";
import usePurchaseRequisitionList from "../purchaseRequisitionList/usePurchaseRequisitionList";

const PurchaseRequisitionDetail = ({
  show,
  handleClose,
  purchaseRequisition,
}) => {
  const { getStatusLabel, getStatusBadgeClass } = usePurchaseRequisitionList();
  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Purchase Requisition</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>
            Details for Purchase Requisition ID:{" "}
            {purchaseRequisition.purchaseRequisitionId}
          </h6>
          <div>
            Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                purchaseRequisition.status
              )}`}
            >
              {getStatusLabel(purchaseRequisition.status)}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Requested By:</strong> {purchaseRequisition.requestedBy}
            </p>
            <p>
              <strong>Department:</strong> {purchaseRequisition.department}
            </p>
            <p>
              <strong>Email:</strong> {purchaseRequisition.email}
            </p>
            <p>
              <strong>Contact Number:</strong> {purchaseRequisition.contactNo}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Requisition Date:</strong>{" "}
              {purchaseRequisition?.requisitionDate?.split("T")[0]}
            </p>
            <p>
              <strong>Purpose of Request:</strong>{" "}
              {purchaseRequisition.purposeOfRequest}
            </p>
            <p>
              <strong>Delivery Date:</strong>{" "}
              {purchaseRequisition?.deliveryDate?.split("T")[0]}
            </p>
            <p>
              <strong>Delivery Location:</strong>{" "}
              {purchaseRequisition.deliveryLocationNavigation?.locationName}
            </p>
            <p>
              <strong>Reference Number:</strong>{" "}
              {purchaseRequisition.referenceNo}
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
            {purchaseRequisition.purchaseRequisitionDetails.map(
              (item, index) => (
                <tr key={index}>
                  <td>{item.itemCategory}</td>
                  <td>{item.itemId}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice.toFixed(2)}</td>
                  <td>{item.totalPrice.toFixed(2)}</td>
                </tr>
              )
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4"></td>
              <th>Total Amount</th>
              <td colSpan="2">{purchaseRequisition.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PurchaseRequisitionDetail;
