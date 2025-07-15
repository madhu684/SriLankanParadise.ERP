import React from "react";
import { Button, Modal } from "react-bootstrap";
import useMinList from "../../min/minList/useMinList";
import moment from "moment";
import useMinAccept from "./minAccept";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const MinAccept = ({ refetch, setRefetch, show, handleClose, min }) => {
  const { getStatusLabel, getStatusBadgeClass } = useMinList();
  const { approvalStatus, loading, alertRef, handleAccept } = useMinAccept({
    min,
    refetch,
    setRefetch,
    onFormSubmit: () => {
      handleClose();
    },
  });

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      scrollable
      size="lg"
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title>Accept Material Issue Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>
            Details for Material Issue Note Ref Number: {min.referenceNumber}
          </h6>
          <div>
            MIN Status :{" "}
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
              <strong>Material Accepting Status:</strong>{" "}
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
            {min.requisitionMaster && (
              <p>
                <strong>Material Requisition Reference No:</strong>{" "}
                {min.requisitionMaster.referenceNumber}
              </p>
            )}
          </div>
        </div>

        <h6>Item Details</h6>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Unit</th>
              <th>Item Batch</th>
              <th>Issued Quantity</th>
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
            Material Issue Note accepted!
          </div>
        )}
        {approvalStatus === "error" && (
          <div className="alert alert-danger mb-3" role="alert">
            Error accepting material issue note. Please try again.
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
          onClick={() => handleAccept(min.issueMasterId)}
          disabled={
            loading ||
            approvalStatus !== null ||
            min.requisitionMaster.isMINAccepted === true
          }
        >
          {loading && approvalStatus === null ? (
            <ButtonLoadingSpinner text="Accepting..." />
          ) : (
            "Accept"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MinAccept;
