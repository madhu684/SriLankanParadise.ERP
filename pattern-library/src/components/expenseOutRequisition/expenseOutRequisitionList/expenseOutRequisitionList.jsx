import React from "react";
import useExpenseOutRequisitionList from "./useExpenseOutRequisitionList";
import ExpenseOutRequisitionApproval from "../expenseOutRequisitionApproval/expenseOutRequisitionApproval";
import ExpenseOutRequisition from "../expenseOutRequisition";
import ExpenseOutRequisitionDetail from "../expenseOutRequisitionDetail/expenseOutRequisitionDetail";
import ExpenseOutRequisitionUpdate from "../expenseOutRequisitionUpdate/expenseOutRequisitionUpdate";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import moment from "moment";
import "moment-timezone";

const ExpenseOutRequisitionList = () => {
  const {
    expenseOutRequisitions,
    isLoadingData,
    isLoadingPermissions,
    isPermissionsError,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showApproveEORModal,
    showApproveEORModalInParent,
    showDetailEORModal,
    showDetailEORModalInParent,
    showCreateEORForm,
    showUpdateEORForm,
    EORDetail,
    approvalType,
    areAnySelectedRowsPendingRecommendation,
    areAnySelectedRowsPendingApproval,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleShowApproveEORModal,
    handleCloseApproveEORModal,
    handleCloseDetailEORModal,
    handleApproved,
    handleViewDetails,
    setShowCreateEORForm,
    setShowUpdateEORForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleExpensedOut,
  } = useExpenseOutRequisitionList();

  if (error || isPermissionsError) {
    return <ErrorComponent error={error || "Error fetching data"} />;
  }

  if (
    isLoadingData ||
    isLoadingPermissions ||
    (expenseOutRequisitions && !expenseOutRequisitions.length > 0)
  ) {
    return <LoadingSpinner />;
  }

  if (showCreateEORForm) {
    return (
      <ExpenseOutRequisition
        handleClose={() => setShowCreateEORForm(false)}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (showUpdateEORForm) {
    return (
      <ExpenseOutRequisitionUpdate
        handleClose={handleClose}
        expenseOutRequisition={EORDetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (!expenseOutRequisitions) {
    return (
      <div className="container mt-4">
        <h2>Expense Out Requisitions</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>
            You haven't created any expense out requisition. Create a new one.
          </p>
          {hasPermission("Create Expense Out Requisition") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateEORForm(true)}
            >
              Create
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Expense Out Requisitions</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission("Create Expense Out Requisition") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateEORForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission("Recommend Expense Out Requisition") &&
            selectedRowData[0]?.requestedUserId !==
              parseInt(sessionStorage.getItem("userId")) &&
            isAnyRowSelected &&
            areAnySelectedRowsPendingRecommendation(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={() => handleShowApproveEORModal("recommendation")}
              >
                Recommend
              </button>
            )}
          {hasPermission("Approve Expense Out Requisition") &&
            isAnyRowSelected &&
            areAnySelectedRowsPendingApproval(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={() => handleShowApproveEORModal("approval")}
              >
                Approve
              </button>
            )}
          {hasPermission("Update Expense Out Requisition") &&
            isAnyRowSelected &&
            selectedRowData[0]?.status !== 4 && (
              <button
                className="btn btn-warning"
                onClick={() => setShowUpdateEORForm(true)}
              >
                Edit
              </button>
            )}
        </div>
      </div>
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Reference No</th>
              <th>Requested By</th>
              <th>Requested Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {expenseOutRequisitions.map((eor) => (
              <tr key={eor.expenseOutRequisitionId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(eor.expenseOutRequisitionId)}
                    onChange={() =>
                      handleRowSelect(eor.expenseOutRequisitionId)
                    }
                  />
                </td>
                <td>{eor.referenceNumber}</td>
                <td>{eor.requestedBy}</td>
                <td>
                  {moment
                    .utc(eor?.createdDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      eor.status
                    )}`}
                  >
                    {getStatusLabel(eor.status)}
                  </span>
                </td>
                <td>
                  {eor.status === 0 ? (
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleUpdate(eor)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                      </svg>{" "}
                      Edit
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleViewDetails(eor)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-arrow-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                        />
                      </svg>{" "}
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showApproveEORModalInParent && (
          <ExpenseOutRequisitionApproval
            show={showApproveEORModal}
            handleClose={handleCloseApproveEORModal}
            expenseOutRequisition={selectedRowData[0]}
            handleApproved={handleApproved}
            type={approvalType}
          />
        )}
        {showDetailEORModalInParent && (
          <ExpenseOutRequisitionDetail
            show={showDetailEORModal}
            handleClose={handleCloseDetailEORModal}
            expenseOutRequisition={EORDetail}
            handleExpensedOut={handleExpensedOut}
          />
        )}
      </div>
    </div>
  );
};

export default ExpenseOutRequisitionList;
