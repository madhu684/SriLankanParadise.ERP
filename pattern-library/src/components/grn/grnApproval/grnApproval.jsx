import React from "react";
import { Modal, Button } from "react-bootstrap";
import useGrnApproval from "./useGrnApproval";
import useGrnList from "../grnList/useGrnList";

const GrnApproval = ({ show, handleClose, handleApproved, grn }) => {
  const { approvalStatus, handleApprove } = useGrnApproval({
    grn,
    onFormSubmit: () => {
      handleClose();
      handleApproved();
    },
  });
  const { getStatusLabel, getStatusBadgeClass } = useGrnList();
  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Approve Goods Received Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>Details for Goods Received Note : {grn.grnMasterId}</h6>
          <div>
            Grn Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                grn.status
              )}`}
            >
              {getStatusLabel(grn.status)}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>GRN Date:</strong> {grn?.grnDate?.split("T")[0]}
            </p>
            <p>
              <strong>Received By:</strong> {grn.receivedBy}
            </p>
            <p>
              <strong>Received Date:</strong> {grn?.receivedDate?.split("T")[0]}
            </p>
            <p>
              <strong>Goods Receiving Status:</strong>{" "}
              <span
                className={`badge rounded-pill ${getStatusBadgeClass(
                  parseInt(`${1}${grn.status.toString().charAt(0)}`, 10)
                )}`}
              >
                {getStatusLabel(
                  parseInt(`${1}${grn.status.toString().charAt(0)}`, 10)
                )}
              </span>
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Purchase Order Reference No:</strong>{" "}
              {grn.purchaseOrder.referenceNo}
            </p>
          </div>
        </div>

        <h6>Item Details</h6>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Received Quantity</th>
              <th>Accepted Quantity</th>
              <th>Rejected Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {grn.grnDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.itemId}</td>
                <td>{item.receivedQuantity}</td>
                <td>{item.acceptedQuantity}</td>
                <td>{item.rejectedQuantity}</td>
                <td>{item.unitPrice.toFixed(2)}</td>
                <td>{item.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4"></td>
              <th>Total Amount</th>
              <td colSpan="2">{grn.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        {approvalStatus === "approved" && (
          <div
            className="alert alert-success alert-dismissible fade show mb-3"
            role="alert"
          >
            Goods Received Note approved!
          </div>
        )}
        {approvalStatus === "error" && (
          <div className="alert alert-danger mb-3" role="alert">
            Error approving goods received note. Please try again.
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="success"
          onClick={() => handleApprove(grn.grnMasterId)}
        >
          Approve
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GrnApproval;
