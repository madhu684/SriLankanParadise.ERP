import React from "react";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import "moment-timezone";

const ExpenseOutDetail = ({
  show,
  handleClose,
  expenseOuts,
  thousandSeperator,
}) => {
  const totalAmount = expenseOuts.reduce((total, eo) => total + eo.amount, 0);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton className="bg-danger bg-gradient text-white">
        <Modal.Title className="fw-bold">
          <i className="bi bi-wallet2 me-2"></i>
          Expense Out Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="alert alert-warning border-0 shadow-sm mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className="bi bi-cash-stack fs-4 me-3"></i>
              <div>
                <small className="text-muted d-block mb-1">
                  Total Expenses
                </small>
                <h5 className="mb-0 fw-semibold text-danger">
                  {thousandSeperator(totalAmount.toFixed(2))}
                </h5>
              </div>
            </div>
            <div className="text-end">
              <small className="text-muted d-block">Total Records</small>
              <span className="badge bg-secondary fs-6 px-3 py-2">
                {expenseOuts.length}
              </span>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th className="fw-semibold">Expense Out ID</th>
                <th className="fw-semibold">Expense Out Date</th>
                <th className="text-end fw-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenseOuts.map((eo) => (
                <tr key={eo.cashierExpenseOutId}>
                  <td className="fw-medium text-primary">
                    #{eo.cashierExpenseOutId}
                  </td>
                  <td className="text-muted">
                    <small>
                      {moment
                        .utc(eo?.createdDate)
                        .tz("Asia/Colombo")
                        .format("YYYY-MM-DD hh:mm:ss A")}
                    </small>
                  </td>
                  <td className="text-end fw-semibold text-danger">
                    {thousandSeperator(eo.amount.toFixed(2))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-light border-top border-2">
              <tr>
                <td colSpan="2" className="text-end pe-3">
                  <strong className="fs-5">Total</strong>
                </td>
                <td className="text-end">
                  <span className="badge bg-danger fs-6 px-3 py-2">
                    {thousandSeperator(totalAmount.toFixed(2))}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {expenseOuts.length === 0 && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox fs-1 d-block mb-3"></i>
            <p className="mb-0">No expense records found</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={handleClose} className="px-4">
          <i className="bi bi-x-circle me-2"></i>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExpenseOutDetail;













