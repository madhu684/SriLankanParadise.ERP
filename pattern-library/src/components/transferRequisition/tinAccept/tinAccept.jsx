import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import moment from "moment";
import useMinList from "../../min/minList/useMinList";
import useTinAccept from "./tinAccept";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const TinAccept = ({ refetch, setRefetch, show, handleClose, tin }) => {
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
  } = useTinAccept({
    tin,
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
        <Modal.Title>Accept Transfer Issue Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>
            Details for Transfer Issue Note Ref Number: {tin.referenceNumber}
          </h6>
          <div>
            TIN Status :{" "}
            <span className={`badge rounded-pill ${getStatusBadgeClass()}`}>
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
              <span className={`badge rounded-pill ${getStatusBadgeClass()}`}>
                {getStatusLabel()}
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
              <th>Received Quantity</th>
              <th>Returned Quantity</th>
            </tr>
          </thead>
          <tbody>
            {tin.issueDetails.map((item, index) => {
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
                          : item.receivedQuantity ?? 0
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
                        loading || tin.requisitionMaster.isMINAccepted === true
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
                        loading || tin.requisitionMaster.isMINAccepted === true
                      }
                    />
                  </td>
                </tr>
              );
            })}
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
            tin.requisitionMaster.isMINAccepted === true ||
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

export default TinAccept;
