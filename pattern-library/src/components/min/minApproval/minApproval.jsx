import React from "react";
import { Modal, Button } from "react-bootstrap";
import useMinApproval from "./useMinApproval";
import useMinList from "../minList/useMinList";
import moment from "moment";
import "moment-timezone";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const MinApproval = ({ show, handleClose, handleApproved, min }) => {
  const { approvalStatus, loading, alertRef, handleApprove } = useMinApproval({
    min,
    onFormSubmit: () => {
      handleClose();
      handleApproved();
    },
  });
  const { getStatusLabel, getStatusBadgeClass } = useMinList();
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
        <Modal.Title>Approve Material Issue Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>
            Details for Material Issue Note Ref Number: {min.referenceNumber}
          </h6>
          <div>
            Min Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                min.status
              )}`}
            >
              {getStatusLabel(min.status)}
            </span>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <p>
              <strong>Issued By:</strong> {min.createdBy}
            </p>
            <p>
              <strong>Dispatched Date: </strong>{" "}
              {moment
                .utc(min?.issueDate)
                .tz("Asia/Colombo")
                .format("YYYY-MM-DD hh:mm:ss A")}
            </p>
            <p>
              <strong>Material Dispatching Status:</strong>{" "}
              <span
                className={`badge rounded-pill ${getStatusBadgeClass(
                  parseInt(`${1}${min.status.toString().charAt(0)}`, 10)
                )}`}
              >
                {getStatusLabel(
                  parseInt(`${1}${min.status.toString().charAt(0)}`, 10)
                )}
              </span>
            </p>
            {parseInt(min.status.toString().charAt(1), 10) === 2 && (
              <>
                <p>
                  <strong>Approved By:</strong> {min.approvedBy}
                </p>
                <p>
                  <strong>Approved Date:</strong>{" "}
                  {moment
                    .utc(min?.approvedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
              </>
            )}
          </div>
          <div className="col-md-6">
            <p>
              <strong>Material Requisition Reference No:</strong>{" "}
              {min.requisitionMaster.referenceNumber}
            </p>
          </div>
        </div>

        <h6>Item Details</h6>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Unit</th>
              <th>Item Batch</th>
              <th>Dispatched Quantity</th>
            </tr>
          </thead>
          <tbody>
            {min.issueDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.itemMaster?.itemName}</td>
                <td>{item.itemMaster?.unit.unitName}</td>
                <td>{item.batch?.batchRef}</td>
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
            Material Issue Note approved!
          </div>
        )}
        {approvalStatus === "error" && (
          <div className="alert alert-danger mb-3" role="alert">
            Error approving material issue note. Please try again.
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
          onClick={() => handleApprove(min.issueMasterId)}
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

export default MinApproval;
