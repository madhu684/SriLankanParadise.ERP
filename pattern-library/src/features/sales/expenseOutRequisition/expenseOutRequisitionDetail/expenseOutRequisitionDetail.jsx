import React from "react";
import { Modal, Button } from "react-bootstrap";
import useExpenseOutRequisitionDetial from "./useExpenseOutRequisitionDetail";
import useExpenseOutRequisitionList from "features/sales/expenseOutRequisition/expenseOutRequisitionList/useExpenseOutRequisitionList";
import ButtonLoadingSpinner from "common/components/loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import moment from "moment";
import "moment-timezone";

const ExpenseOutRequisitionDetail = ({
  show,
  handleClose,
  expenseOutRequisition,
  handleExpensedOut,
}) => {
  const { expenseOutStatus, loading, alertRef, handleExpenseOut } =
    useExpenseOutRequisitionDetial({
      onFormSubmit: () => {
        handleClose();
        handleExpensedOut();
      },
      expenseOutRequisition,
    });

  const { getStatusLabel, getStatusBadgeClass } =
    useExpenseOutRequisitionList();
  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Expense Out Requisition</Modal.Title>
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
            {expenseOutRequisition.status === 4 && (
              <p>
                <strong>Expensed Out Date:</strong>{" "}
                {moment
                  .utc(
                    expenseOutRequisition?.cashierExpenseOuts[0]?.createdDate
                  )
                  .tz("Asia/Colombo")
                  .format("YYYY-MM-DD hh:mm:ss A")}
              </p>
            )}
          </div>
          <div className="col-md-6">
            {(expenseOutRequisition.status === 2 ||
              expenseOutRequisition.status === 3 ||
              expenseOutRequisition.status === 4) && (
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
            {(expenseOutRequisition.status === 3 ||
              expenseOutRequisition.status === 4) && (
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
        {expenseOutStatus === "expenseOut" && (
          <div
            className={`alert alert-success alert-dismissible fade show mb-2 mt-3`}
            role="alert"
          >
            Expense out processed successfully!
          </div>
        )}
        {expenseOutStatus === "error" && (
          <div className="alert alert-danger mb-2 mt-3" role="alert">
            "Error processing expense out. Please try again."
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {expenseOutRequisition?.status === 3 &&
          expenseOutRequisition?.requestedUserId ===
            parseInt(sessionStorage.getItem("userId")) && (
            <Button
              variant="success"
              onClick={() =>
                handleExpenseOut(expenseOutRequisition.expenseOutRequisitionId)
              }
              disabled={loading || expenseOutStatus !== null}
            >
              {loading && expenseOutStatus === null ? (
                <ButtonLoadingSpinner text="Processing..." />
              ) : (
                "Expense Out"
              )}
            </Button>
          )}
      </Modal.Footer>
    </Modal>
  );
};

export default ExpenseOutRequisitionDetail;













