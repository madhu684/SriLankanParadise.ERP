import React from "react";
import useCashierExpenseOutList from "./useCashierExpenseOutList";
import CashierExpenseOut from "../cashierExpenseOut";
import { Spinner } from "react-bootstrap";

const CashierExpenseOutList = () => {
  const {
    cashierExpenseOutList,
    isLoading,
    date,
    showCreateForm,
    setDate,
    handleCreateClick,
    handleCloseForm,
  } = useCashierExpenseOutList();

  if (showCreateForm) {
    return (
      <div className="container mt-4">
        <CashierExpenseOut
          onFormSubmit={handleCloseForm}
          onClose={handleCloseForm}
        />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Cashier Expense Out List</h2>
        <button className="btn btn-primary" onClick={handleCreateClick}>
          Create Expense Out
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <label className="form-label">Select Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <hr />

      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover mt-3">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {cashierExpenseOutList?.length > 0 ? (
                cashierExpenseOutList.map((item, index) => (
                  <tr key={item.cashierExpenseOutId}>
                    <td>{index + 1}</td>
                    <td>{item.reason}</td>
                    <td>
                      {item.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{new Date(item.createdDate).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No expense out records found for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CashierExpenseOutList;
