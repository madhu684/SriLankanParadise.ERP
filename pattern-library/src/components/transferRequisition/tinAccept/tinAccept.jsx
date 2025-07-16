import React from "react";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import useMinList from "../../min/minList/useMinList";
import useTinAccept from "./tinAccept";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const TinAccept = ({ refetch, setRefetch, show, handleClose, tin }) => {
  const { getStatusLabel, getStatusBadgeClass } = useMinList();
  const { approvalStatus, loading, alertRef, handleAccept } = useTinAccept({
    tin,
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
        <Modal.Title>Accept Transfer Issue Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>
            Details for Transfer Issue Note Ref Number: {tin.referenceNumber}
          </h6>
          <div>
            TIN Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                tin.status
              )}`}
            >
              {getStatusLabel(tin.status)}
            </span>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <p>
              <strong>Issued By:</strong> {tin.createdBy}
            </p>
            <p>
              <strong>Dispatched Date: </strong>{" "}
              {moment
                .utc(tin?.issueDate)
                .tz("Asia/Colombo")
                .format("YYYY-MM-DD hh:mm:ss A")}
            </p>
            <p>
              <strong>Transfer Accepting Status:</strong>{" "}
              <span
                className={`badge rounded-pill ${getStatusBadgeClass(
                  parseInt(`${1}${tin.status.toString().charAt(0)}`, 10)
                )}`}
              >
                {getStatusLabel(
                  parseInt(`${1}${tin.status.toString().charAt(0)}`, 10)
                )}
              </span>
            </p>
            {parseInt(tin.status.toString().charAt(1), 10) === 2 && (
              <>
                <p>
                  <strong>Approved By:</strong> {tin.approvedBy}
                </p>
                <p>
                  <strong>Approved Date:</strong>{" "}
                  {moment
                    .utc(tin?.approvedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
              </>
            )}
          </div>
          <div className="col-md-6">
            {tin.requisitionMaster && (
              <p>
                <strong>Transfer Requisition Reference No:</strong>{" "}
                {tin.requisitionMaster.referenceNumber}
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
            {tin.issueDetails.map((item, index) => (
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
            Transfer Issue Note accepted!
          </div>
        )}
        {approvalStatus === "error" && (
          <div className="alert alert-danger mb-3" role="alert">
            Error accepting transfer issue note. Please try again.
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
            onClick={() => handleAccept(tin.issueMasterId)}
            disabled={
              loading ||
              approvalStatus !== null ||
              tin.requisitionMaster.isMINAccepted === true
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

export default TinAccept;
