import React from "react";
import useGrnList from "./useGrnList.js";
import GrnApproval from "../grnApproval/grnApproval.jsx";
import Grn from "../grn";
import GrnDetail from "../grnDetail/grnDetail.jsx";
import GrnUpdate from "../grnUpdate/grnUpdate.jsx";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";

const GrnList = () => {
  const {
    Grns,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showApproveGrnModal,
    showApproveGrnModalInParent,
    showDetailGrnModal,
    showDetailGrnModalInParent,
    showCreateGrnForm,
    showUpdateGrnForm,
    GRNDetail,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleShowApproveGrnModal,
    handleCloseApproveGrnModal,
    handleCloseDetailGrnModal,
    handleApproved,
    handleViewDetails,
    setShowCreateGrnForm,
    setShowUpdateGrnForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
  } = useGrnList();

  if (isLoadingData || isLoadingPermissions) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (showCreateGrnForm) {
    return (
      <Grn
        handleClose={() => setShowCreateGrnForm(false)}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (showUpdateGrnForm) {
    return (
      <GrnUpdate
        handleClose={() => setShowUpdateGrnForm(false)}
        grn={GRNDetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (!Grns) {
    return (
      <div className="container mt-4">
        <h2>Goods Received Notes</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any goods received note. Create a new one.</p>
          {hasPermission("Create Goods Received Note") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateGrnForm(true)}
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
      <h2>Goods Received Notes</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission("Create Goods Received Note") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateGrnForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission("Approve Goods Received Note") &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={handleShowApproveGrnModal}
              >
                Approve
              </button>
            )}
          {hasPermission("Update Goods Received Note") && isAnyRowSelected && (
            <button
              className="btn btn-warning"
              onClick={() => setShowUpdateGrnForm(true)}
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
                <input type="checkbox" onChange={() => setSelectedRows([])} />
              </th>
              <th>Id</th>
              <th>Received By</th>
              <th>Received Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {Grns.map((Grn) => (
              <tr key={Grn.grnMasterId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(Grn.grnMasterId)}
                    onChange={() => handleRowSelect(Grn.grnMasterId)}
                  />
                </td>
                <td>{Grn.grnMasterId}</td>
                <td>{Grn.receivedBy}</td>
                <td>{Grn?.receivedDate?.split("T")[0]}</td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      Grn.status
                    )}`}
                  >
                    {getStatusLabel(Grn.status)}
                  </span>
                </td>
                <td>
                  {Grn.status.toString().charAt(1) === "0" ? (
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleUpdate(Grn)}
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
                      onClick={() => handleViewDetails(Grn)}
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
        {showApproveGrnModalInParent && (
          <GrnApproval
            show={showApproveGrnModal}
            handleClose={handleCloseApproveGrnModal}
            grn={selectedRowData[0]}
            handleApproved={handleApproved}
          />
        )}
        {showDetailGrnModalInParent && (
          <GrnDetail
            show={showDetailGrnModal}
            handleClose={handleCloseDetailGrnModal}
            grn={GRNDetail}
          />
        )}
      </div>
    </div>
  );
};

export default GrnList;
