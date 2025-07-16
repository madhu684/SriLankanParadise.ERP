import React from "react";
import { Modal, Button } from "react-bootstrap";
import useTransferRequisitionDetial from "./useTransferRequisitionDetail";
import useTransferRequisitionList from "../transferRequisitionList/useTransferRequisitionList";
import moment from "moment";
import "moment-timezone";

const TransferRequisitionDetail = ({
  show,
  handleClose,
  transferRequisition,
}) => {
  const { getStatusLabel, getStatusBadgeClass } = useTransferRequisitionList();
  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Transfer Requisition</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>
            Details for Transfer Requisition Note Ref Number:{" "}
            {transferRequisition.referenceNumber}
          </h6>
          <div>
            Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                transferRequisition.status
              )}`}
            >
              {getStatusLabel(transferRequisition.status)}
            </span>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <p>
              <strong>Requested By:</strong> {transferRequisition.requestedBy}
            </p>
            <p>
              <strong>Requisition Date:</strong>{" "}
              {moment
                .utc(transferRequisition?.requisitionDate)
                .tz("Asia/Colombo")
                .format("YYYY-MM-DD hh:mm:ss A")}
            </p>
            <p>
              <strong>Purpose of Request:</strong>{" "}
              {transferRequisition.purposeOfRequest}
            </p>
            {transferRequisition.status === 2 && (
              <>
                <p>
                  <strong>Approved By:</strong> {transferRequisition.approvedBy}
                </p>
                <p>
                  <strong>Approved Date:</strong>{" "}
                  {moment
                    .utc(transferRequisition?.approvedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
              </>
            )}
          </div>
          <div className="col-md-6">
            <p>
              <strong>To Warehouse Location:</strong>{" "}
              {transferRequisition.requestedToLocation?.locationName}
            </p>
            <p>
              <strong>From Warehouse Location:</strong>{" "}
              {transferRequisition.requestedFromLocation?.locationName}
            </p>
          </div>
        </div>

        <h6>Item Details</h6>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Unit</th>
              <th>Requested Quantity</th>
            </tr>
          </thead>
          <tbody>
            {transferRequisition.requisitionDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.itemMaster.itemName}</td>
                <td>{item.itemMaster.unit.unitName}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
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

export default TransferRequisitionDetail;
