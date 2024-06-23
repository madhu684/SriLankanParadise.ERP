import React from "react";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import "moment-timezone";

const ExpenseOutDetail = ({ show, handleClose, expenseOuts }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Expense Out Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table">
          <thead>
            <tr>
              <th>Expense Out ID</th>
              <th>Expense Out Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenseOuts.map((eo) => (
              <tr key={eo.cashierExpenseOutId}>
                <td>{eo.cashierExpenseOutId}</td>
                <td>
                  {moment
                    .utc(eo?.createdDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </td>
                <td>{eo.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td>
                <strong>Total</strong>
              </td>
              <td>
                {expenseOuts
                  .reduce((total, eo) => total + eo.amount, 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tfoot>
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

export default ExpenseOutDetail;
