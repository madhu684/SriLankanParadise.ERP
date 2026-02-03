import React from "react";
import { Modal, Button } from "react-bootstrap";
import useExpenseOutRequisitionApproval from "./useExpenseOutRequisitionApproval";
import useExpenseOutRequisitionList from "features/sales/expenseOutRequisition/expenseOutRequisitionList/useExpenseOutRequisitionList";
import ButtonLoadingSpinner from "common/components/loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import moment from "moment";
import "moment-timezone";

const ExpenseOutRequisitionApproval = ({
  show,
  handleClose,
  handleApproved,
  expenseOutRequisition,
  type,
}) => {
  const { approvalStatus, loading, alertRef, handleApprove } =
    useExpenseOutRequisitionApproval({
      onFormSubmit: () => {
        handleClose();
        handleApproved();
      },
      expenseOutRequisition,
      type,
    });

  const { getStatusLabel, getStatusBadgeClass } =
    useExpenseOutRequisitionList();

  // Variables for different types
  let title, buttonText;

  // Set title and button text based on the type
  if (type === "approval") {
    title = "Approve Expense Out Requisition";
    buttonText = "Approve";
  } else if (type === "recommendation") {
    title = "Recommend Expense Out Requisition";
    buttonText = "Recommend";
  }

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
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>
            Details for Expense Out Requisition :{" "}
            {expenseOutRequisition.referenceNumber}
          </h6>
          <div>
            Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                expenseOutRequisition.status
              )}`}
            >
              {getStatusLabel(expenseOutRequisition.status)}
            </span>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <p>
              <strong>Requested By:</strong> {expenseOutRequisition.requestedBy}
            </p>
            <p>
              <strong>Requested Date:</strong>{" "}
              {moment
                .utc(expenseOutRequisition?.createdDate)
                .tz("Asia/Colombo")
                .format("YYYY-MM-DD hh:mm:ss A")}
            </p>
          </div>
          <div className="col-md-6">
            {(expenseOutRequisition.status === 2 ||
              expenseOutRequisition.status === 3) && (
              <>
                <p>
                  <strong>Recommended By:</strong>{" "}
                  {expenseOutRequisition.recommendedBy}
                </p>
                <p>
                  <strong>Recommended Date:</strong>{" "}
                  {moment
                    .utc(expenseOutRequisition?.recommendedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
              </>
            )}
            {expenseOutRequisition.status === 3 && (
              <>
                <p>
                  <strong>Approved By:</strong>{" "}
                  {expenseOutRequisition.approvedBy}
                </p>
                <p>
                  <strong>Approved Date:</strong>{" "}
                  {moment
                    .utc(expenseOutRequisition?.approvedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
              </>
            )}
          </div>
        </div>
        <h6>Expense Out Request Information</h6>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{expenseOutRequisition?.amount.toFixed(2)}</td>
              <td>{expenseOutRequisition?.reason}</td>
            </tr>
          </tbody>
        </table>
        <div className="d-flex justify-content-between text-muted ">
          <small>
            Created -{" "}
            {moment
              .utc(expenseOutRequisition?.createdDate)
              .tz("Asia/Colombo")
              .format("YYYY-MM-DD hh:mm:ss A")}
          </small>
          <small>
            Last Updated -{" "}
            {moment
              .utc(expenseOutRequisition?.lastUpdatedDate)
              .tz("Asia/Colombo")
              .format("YYYY-MM-DD hh:mm:ss A")}
          </small>
        </div>
        <div ref={alertRef}></div>
        {approvalStatus === "approved" && (
          <div
            className={`alert alert-success alert-dismissible fade show mb-2 mt-3`}
            role="alert"
          >
            {type === "approval"
              ? "Expense out requisition approved!"
              : "Expense out requisition recommended!"}
          </div>
        )}
        {approvalStatus === "error" && (
          <div className="alert alert-danger mb-2 mt-3" role="alert">
            {type === "approval"
              ? "Error approving expense out requisition. Please try again."
              : "Error recommending expense out requisition. Please try again."}
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
          onClick={() =>
            handleApprove(expenseOutRequisition.expenseOutRequisitionId)
          }
          disabled={loading || approvalStatus !== null}
        >
          {loading && approvalStatus === null ? (
            <ButtonLoadingSpinner text={` ${buttonText}ing...`} />
          ) : (
            buttonText
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExpenseOutRequisitionApproval;













