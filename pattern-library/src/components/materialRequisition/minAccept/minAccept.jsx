import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import moment from "moment";
import useMinAccept from "./minAccept";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const MinAccept = ({ refetch, setRefetch, show, handleClose, min }) => {
  const {
    approvalStatus,
    loading,
    alertRef,
    receivedQuantities,
    returnedQuantities,
    handleAccept,
    handleReceivedQuantityChange,
    handleReturnedQuantityChange,
    validateQuantities,
    getStatusBadgeClass,
    getStatusLabel,
  } = useMinAccept({
    min,
    refetch,
    setRefetch,
    onFormSubmit: () => {
      handleClose();
    },
  });

  // Get validation errors for display
  const validationErrors = validateQuantities();
  const hasValidationErrors = validationErrors.length > 0;

  // Helper function to get validation error for specific item
  const getItemValidationError = (itemMasterId) => {
    return validationErrors.find((error) =>
      error.includes(`item ${itemMasterId}`)
    );
  };

  // Helper function to check if received quantity exceeds issued quantity
  const isReceivedExceedsIssued = (item) => {
    const receivedQty = parseFloat(receivedQuantities[item.issueDetailId] || 0);
    const issuedQty = parseFloat(item.quantity || 0);
    return receivedQty > issuedQty;
  };

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
            <span className={`badge rounded-pill ${getStatusBadgeClass()}`}>
              {getStatusLabel()}
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
              <span className={`badge rounded-pill ${getStatusBadgeClass()}`}>
                {getStatusLabel()}
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
        <div className="table-responsive">
          <table className="table mt-2">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Unit</th>
                <th>Item Batch</th>
                <th>Issued Quantity</th>
                <th>Received Quantity</th>
                <th>Returned Quantity</th>
              </tr>
            </thead>
            <tbody>
              {min.issueDetails.map((item, index) => {
                const receivedExceedsIssued = isReceivedExceedsIssued(item);
                const itemError = getItemValidationError(
                  item.itemMaster?.itemMasterId
                );

                return (
                  <tr key={index} className={itemError ? "table-warning" : ""}>
                    <td>{item.itemMaster?.itemName}</td>
                    <td>{item.itemMaster?.unit.unitName}</td>
                    <td className="text-nowrap">{item.batch?.batchRef}</td>
                    <td>
                      <span className="fw-bold">{item.quantity}</span>
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max={item.quantity} // Prevent exceeding issued quantity
                        step="0.1"
                        value={
                          receivedQuantities[item.issueDetailId] !== undefined
                            ? receivedQuantities[item.issueDetailId]
                            : item.quantity ?? 0
                        }
                        onChange={(e) =>
                          handleReceivedQuantityChange(
                            item.issueDetailId,
                            e.target.value
                          )
                        }
                        placeholder="Enter received qty"
                        className={receivedExceedsIssued ? "is-invalid" : ""}
                        disabled={
                          loading ||
                          min.requisitionMaster.isMINAccepted === true
                        }
                      />
                      {receivedExceedsIssued && (
                        <div className="invalid-feedback">
                          Cannot exceed issued quantity
                        </div>
                      )}
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max={receivedQuantities[item.issueDetailId] || 0} // Prevent exceeding received quantity
                        step="0.1"
                        value={
                          returnedQuantities[item.issueDetailId] !== undefined
                            ? returnedQuantities[item.issueDetailId]
                            : item.returnedQuantity ?? 0
                        }
                        onChange={(e) =>
                          handleReturnedQuantityChange(
                            item.issueDetailId,
                            e.target.value
                          )
                        }
                        placeholder="Enter returned qty"
                        disabled={
                          loading ||
                          min.requisitionMaster.isMINAccepted === true
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div ref={alertRef}></div>
        {approvalStatus === "approved" && (
          <div
            className="alert alert-success alert-dismissible fade show mb-3"
            role="alert"
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            Material Issue Note accepted!
          </div>
        )}
        {approvalStatus === "error" && (
          <div className="alert alert-danger mb-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Error accepting material issue note. Please check the details and
            try again.
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
            min.requisitionMaster.isMINAccepted === true ||
            hasValidationErrors
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
