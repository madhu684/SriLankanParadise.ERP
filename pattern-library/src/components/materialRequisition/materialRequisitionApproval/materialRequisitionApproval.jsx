import React from "react";
import { Modal, Button } from "react-bootstrap";
import useMaterialRequisitionApproval from "./useMaterialRequisitionApproval";
import useMaterialRequisitionList from "../materialRequisitionList/useMaterialRequisitionList";
import moment from "moment";
import "moment-timezone";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const MaterialRequisitionApproval = ({
  show,
  handleClose,
  handleApproved,
  materialRequisition,
}) => {
  const { approvalStatus, alertRef, handleApprove, loading } =
    useMaterialRequisitionApproval({
      onFormSubmit: () => {
        handleClose();
        handleApproved();
      },
    });
  const { getStatusLabel, getStatusBadgeClass } = useMaterialRequisitionList();
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      scrollable
      size="lg"
      backdrop={!(loading || approvalStatus !== null) ? true : "static"}
      keyboard={!(loading || approvalStatus !== null)}
    >
      <Modal.Header closeButton={!(loading || approvalStatus !== null)}>
        <Modal.Title>Approve Material Requisition</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>
            Details for Material Requisition Ref Number:{" "}
            {materialRequisition.referenceNumber}
          </h6>
          <div>
            Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                materialRequisition.status
              )}`}
            >
              {getStatusLabel(materialRequisition.status)}
            </span>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <p>
              <strong>Requested By:</strong> {materialRequisition.requestedBy}
            </p>
            <p>
              <strong>Requisition Date:</strong>{" "}
              {moment
                .utc(materialRequisition?.requisitionDate)
                .tz("Asia/Colombo")
                .format("YYYY-MM-DD HH:mm:ss A")}
            </p>
            <p>
              <strong>Purpose of Request:</strong>{" "}
              {materialRequisition.purposeOfRequest}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Delivery Location:</strong>{" "}
              {materialRequisition.requestedToLocation?.locationName}
            </p>
            <p>
              <strong>Warehouse Location:</strong>{" "}
              {materialRequisition.requestedFromLocation?.locationName}
            </p>
          </div>
        </div>

        <h6>Item Details</h6>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Unit</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {materialRequisition.requisitionDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.itemMaster.itemName}</td>
                <td>{item.itemMaster.unit.unitName}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div ref={alertRef}></div>
        {approvalStatus === "approved" && (
          <div
            className="alert alert-success alert-dismissible fade show mb-3"
            role="alert"
          >
            Material requisition note approved!
          </div>
        )}
        {approvalStatus === "error" && (
          <div className="alert alert-danger mb-3" role="alert">
            Error approving material requisition note. Please try again.
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={loading || approvalStatus !== null}
        >
          Close
        </Button>
        <Button
          variant="success"
          onClick={() => handleApprove(materialRequisition.requisitionMasterId)}
          disabled={loading || approvalStatus !== null}
        >
          {loading && approvalStatus === null ? (
            <ButtonLoadingSpinner text="Approving..." />
          ) : (
            "Approve"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MaterialRequisitionApproval;
