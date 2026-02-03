import React from "react";
import useCashierExpenseOutList from "./useCashierExpenseOutList";
import CashierExpenseOut from "features/sales/cashierExpenseOut/cashierExpenseOut";
import { Spinner } from "react-bootstrap";
import { RiCurrencyLine } from "react-icons/ri";
import { BiReceipt } from "react-icons/bi";

const CashierExpenseOutList = () => {
  const {
    cashierExpenseOutList,
    isLoading,
    date,
    showCreateForm,
    setDate,
    handleCreateClick,
    handleCloseForm,
    requisitions,
    isRequisitionsLoading,
    handleRequisitionClick,
    initialData,
    searchQuery,
    setSearchQuery,
  } = useCashierExpenseOutList();

  const filteredRequisitions = requisitions.filter((req) => {
    const query = searchQuery.toLowerCase();
    return (
      req.reason?.toLowerCase().includes(query) ||
      req.referenceNumber?.toLowerCase().includes(query) ||
      req.amount?.toString().includes(query)
    );
  });

  if (showCreateForm) {
    return (
      <div className="container mt-4">
        <CashierExpenseOut
          onFormSubmit={handleCloseForm}
          onClose={handleCloseForm}
          initialData={initialData}
        />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Cashier Expense Out List</h2>
        {/* Commented out for future use
        <button className="btn btn-primary" onClick={handleCreateClick}>
          Create Expense Out
        </button>
        */}
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header bg-secondary text-white py-3"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-clipboard-check"></i>
              Approved Requisitions
            </h5>
            <div className="d-flex align-items-center gap-3">
              <div className="input-group" style={{ maxWidth: "250px" }}>
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <span className="badge bg-white text-dark fw-semibold px-3 py-2">
                {filteredRequisitions.length} Available
              </span>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {isRequisitionsLoading ? (
            <div className="d-flex justify-content-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : filteredRequisitions.length > 0 ? (
            <div
              className="table-responsive"
              style={{ maxHeight: "320px", overflowY: "auto" }}
            >
              <table className="table table-hover mb-0">
                <thead className="table-light sticky-top">
                  <tr>
                    <th className="text-nowrap py-3 px-4 border-bottom">
                      Reference No
                    </th>
                    <th className="text-nowrap py-3 px-4 border-bottom">
                      Description
                    </th>
                    <th className="text-nowrap py-3 px-4 border-bottom">
                      Amount
                    </th>
                    <th className="text-nowrap py-3 px-4 border-bottom">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequisitions.map((req) => (
                    <tr
                      key={req.expenseOutRequisitionId}
                      className="border-bottom"
                    >
                      <td className="fw-semibold py-3 px-4 text-dark">
                        {req.referenceNumber}
                      </td>
                      <td className="py-3 px-4" style={{ maxWidth: "250px" }}>
                        <div className="text-truncate" title={req.reason}>
                          {req.reason}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {req.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleRequisitionClick(req)}
                        >
                          Create Expense Out
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-4 text-muted d-block mb-3"></i>
              <p className="text-muted mb-0">
                No approved requisitions available
              </p>
            </div>
          )}
        </div>
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

      {/* Total Expenses Card */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-md-4 col-sm-6">
          <div
            className="card shadow-sm border-0"
            style={{ borderLeft: "4px solid #6f42c1" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Expenses</p>
                  <h4 className="mb-0" style={{ color: "#6f42c1" }}>
                    Rs.{" "}
                    {cashierExpenseOutList
                      ?.reduce((sum, item) => sum + (item.amount || 0), 0)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </h4>
                </div>
                <div
                  className="p-3 rounded-circle"
                  style={{ backgroundColor: "rgba(111, 66, 193, 0.1)" }}
                >
                  <RiCurrencyLine size={28} style={{ color: "#6f42c1" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-4 col-sm-6">
          <div
            className="card shadow-sm border-0"
            style={{ borderLeft: "4px solid #6c757d" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Records</p>
                  <h4 className="mb-0 text-secondary">
                    {cashierExpenseOutList?.length || 0}
                  </h4>
                </div>
                <div className="bg-secondary bg-opacity-10 p-3 rounded-circle">
                  <BiReceipt size={28} className="text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table mt-2">
            <thead>
              <tr>
                <th>No</th>
                <th>Description</th>
                <th>Expense Out Requisition</th>
                <th>Amount</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {cashierExpenseOutList?.length > 0 ? (
                cashierExpenseOutList.map((item, index) => (
                  <tr key={item.cashierExpenseOutId}>
                    <td>{index + 1}</td>
                    <td style={{ maxWidth: "300px" }}>
                      <div className="text-truncate" title={item.description}>
                        {item.description}
                      </div>
                    </td>
                    <td>
                      {item?.expenseOutRequisition?.referenceNumber || "-"}
                    </td>
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













