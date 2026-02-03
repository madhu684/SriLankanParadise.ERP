import React from "react";
import { FaEye } from "react-icons/fa";
import useGrnList from "./useGrnList.js";
import GrnApproval from "features/purchase/grn/grnApproval/grnApproval.jsx";
import Grn from "features/purchase/grn/grn";
import GrnDetail from "features/purchase/grn/grnDetail/grnDetail.jsx";
import GrnUpdate from "features/purchase/grn/grnUpdate/grnUpdate.jsx";
import LoadingSpinner from "common/components/loadingSpinner/loadingSpinner";
import ErrorComponent from "common/components/errorComponent/errorComponent";
import Pagination from "common/components/common/Pagination/Pagination.jsx";

const GrnList = () => {
  const {
    grns,
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
    isPermissionsError,
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
    handleClose,
    pagination,
    setPage,
    grnType,
    setGrnType,
  } = useGrnList();

  console.log("grns: ", grns);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
    setSelectedRows([]); // Clear selections on page change
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    console.log("Filter changed to:", newFilter);
    setGrnType(newFilter);
    setPage(1); // Reset to first page on filter change
    setSelectedRows([]); // Clear selections on filter change
  };

  const getGrnTypeLabel = (type) => {
    const labels = {
      finishedGoodsIn: "Finished Goods In",
      directPurchase: "Direct Purchase",
      goodsReceivedNote: "Goods Received Note",
    };
    return labels[type] || type;
  };

  const getGrnTypeBadgeClass = (type) => {
    const classes = {
      finishedGoodsIn:
        "border border-success text-success bg-success bg-opacity-10",
      directPurchase:
        "border border-danger text-danger bg-danger bg-opacity-10",
      goodsReceivedNote:
        "border border-primary text-primary bg-primary bg-opacity-10",
    };
    return classes[type] || "bg-info";
  };

  if (error || isPermissionsError) {
    return <ErrorComponent error={error || "Error fetching data"} />;
  }

  if (isLoadingData || isLoadingPermissions) {
    return <LoadingSpinner />;
  }

  if (showCreateGrnForm) {
    return (
      <Grn
        handleClose={() => setShowCreateGrnForm(false)}
        handleUpdated={handleUpdated}
        setShowCreateGrnForm={setShowCreateGrnForm}
      />
    );
  }

  if (showUpdateGrnForm) {
    return (
      <GrnUpdate
        handleClose={handleClose}
        grn={GRNDetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
      />
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Goods Received Notes</h2>
        <div className="d-flex align-items-center gap-2">
          <label className="form-label mb-0 me-2 fw-semibold">
            Filter by Type:
          </label>
          <select
            className="form-select"
            value={grnType}
            onChange={handleFilterChange}
            style={{ width: "250px" }}
          >
            <option value="">All Types</option>
            <option value="finishedGoodsIn">Finished Goods In</option>
            <option value="directPurchase">Direct Purchase</option>
            <option value="goodsReceivedNote">Goods Received Note</option>
          </select>
        </div>
      </div>

      <div className="mt-3 d-flex justify-content-between align-items-center">
        <div className="btn-group" role="group">
          {hasPermission("Create Goods Received Note") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateGrnForm(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus-lg me-1"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                />
              </svg>
              Create
            </button>
          )}
          {hasPermission("Approve Goods Received Note") &&
            selectedRowData[0]?.receivedUserId !==
              parseInt(sessionStorage.getItem("userId")) &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={handleShowApproveGrnModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-check-circle me-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                </svg>
                Approve
              </button>
            )}
          {hasPermission("Update Goods Received Note") &&
            isAnyRowSelected &&
            selectedRowData[0]?.status.toString().charAt(1) !== "2" && (
              <button
                className="btn btn-warning"
                onClick={() => setShowUpdateGrnForm(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil me-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                </svg>
                Edit
              </button>
            )}
        </div>
        <div className="text-muted">
          Showing{" "}
          {grns.length > 0
            ? (pagination.pageNumber - 1) * pagination.pageSize + 1
            : 0}{" "}
          to{" "}
          {Math.min(
            pagination.pageNumber * pagination.pageSize,
            pagination.totalCount
          )}{" "}
          of {pagination.totalCount} entries
        </div>
      </div>

      <div className="table-responsive mt-3">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th style={{ width: "50px" }}>
                <input type="checkbox" disabled />
              </th>
              <th>GRN ID</th>
              <th>Type</th>
              <th>Received By</th>
              <th>Received Date</th>
              <th>Status</th>
              <th style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {grns.length > 0 ? (
              grns.map((Grn) => (
                <tr key={Grn.grnMasterId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(Grn.grnMasterId)}
                      onChange={() => handleRowSelect(Grn.grnMasterId)}
                    />
                  </td>
                  <td>
                    <strong>{Grn.grnMasterId}</strong>
                  </td>
                  <td>
                    <span
                      className={`badge ${getGrnTypeBadgeClass(Grn.grnType)}`}
                    >
                      {getGrnTypeLabel(Grn.grnType)}
                    </span>
                  </td>
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
                        className="btn btn-sm btn-warning"
                        onClick={() => handleUpdate(Grn)}
                        title="Edit GRN"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="currentColor"
                          className="bi bi-pencil-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleViewDetails(Grn)}
                        title="View Details"
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
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <div className="text-muted">
                    {grnType ? (
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          fill="currentColor"
                          className="bi bi-exclamation-circle mb-2"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                        </svg>
                        <p className="mb-0">
                          No GRNs found for type:{" "}
                          <strong>{getGrnTypeLabel(grnType)}</strong>
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p>
                          You haven't created any goods received note. Create a
                          new one.
                        </p>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        itemsPerPage={pagination.pageSize}
        totalItems={pagination.totalCount}
        paginate={handlePageChange}
        currentPage={pagination.pageNumber}
      />

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
  );
};

export default GrnList;













