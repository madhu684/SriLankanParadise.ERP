import React, { useContext, useMemo, useState } from "react";
import useTinList from "./useTinList.js";
import TinApproval from "../tinApproval/tinApproval.jsx";
import Tin from "../tin.jsx";
import TinDetails from "../tinDetail/tinDetail.jsx";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner.jsx";
import ErrorComponent from "../../errorComponent/errorComponent.jsx";
import moment from "moment";
import "moment-timezone";
import { FaSearch, FaPlus, FaCheck, FaTrash, FaEye } from "react-icons/fa";
import Pagination from "../../common/Pagination/Pagination.jsx";
import DeleteConfirmationModal from "../../confirmationModals/deleteConfirmationModal/deleteConfirmationModal.jsx";
import { UserContext } from "../../../context/userContext";

const TinList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    Tins,
    isLoadingData,
    error,
    isAnyRowSelected,
    selectedRows,
    showApproveTinModal,
    showApproveTinModalInParent,
    showDetailTinModal,
    showDetailTinModalInParent,
    selectedRowData,
    showCreateTinForm,
    showUpdateTinForm,
    TinDetail,
    submissionMessage,
    submissionStatus,
    isLoading,
    showTINDeleteModal,
    transferRequisitions,
    isLoadingTrn,
    setShowTINDeleteModal,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApproveTinModal,
    handleCloseApproveTinModal,
    handleShowDetailTinModal,
    handleCloseDetailTinModal,
    handleApproved,
    setShowCreateTinForm,
    setShowUpdateTinForm,
    handleUpdated,
    handleClose,
    handleConfirmDeleteTIN,
    handleCloseDeleteConfirmation,
    selectedDate,
    setSelectedDate,
    isInitializing,
  } = useTinList();

  const { hasPermission } = useContext(UserContext);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    let normalizedDateStr = dateString.replace(" ", "T");
    if (!normalizedDateStr.endsWith("Z")) {
      normalizedDateStr += "Z";
    }
    const date = new Date(normalizedDateStr);
    return date.toLocaleString("en-GB", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredTins = Tins?.filter((tin) =>
    tin.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <ErrorComponent error={error || "Error fetching data..."} />;
  }

  if (isLoadingData || isLoadingTrn || isLoading || isInitializing) {
    return <LoadingSpinner />;
  }

  if (showCreateTinForm) {
    return (
      <Tin
        handleClose={() => setShowCreateTinForm(false)}
        handleUpdated={handleUpdated}
        setShowCreateTinForm={setShowCreateTinForm}
      />
    );
  }

  if (Tins?.length === 0 && transferRequisitions?.length === 0) {
    return (
      <div className="container-fluid px-4 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 fw-bold">Transfer Issue Notes</h2>
        </div>
        <div className="card border-0 shadow-sm" style={{ minHeight: "400px" }}>
          <div className="card-body d-flex flex-column justify-content-center align-items-center text-center py-5">
            <div
              className="mb-4"
              style={{ fontSize: "4rem", color: "#e0e0e0" }}
            >
              <i className="bi bi-inbox"></i>
            </div>
            <h4 className="text-muted mb-3">No Transfer Issue Notes Yet</h4>
            <p className="text-muted mb-4">
              Get started by creating your first transfer issue note.
            </p>
            {hasPermission("Create Transfer Issue Note") && (
              <button
                type="button"
                className="btn btn-primary btn-lg px-4"
                onClick={() => setShowCreateTinForm(true)}
              >
                <FaPlus className="me-2" />
                Create Transfer Issue Note
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">Transfer Issue Notes</h2>
        <div className="d-flex gap-2">
          {hasPermission("Create Transfer Issue Note") && (
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => setShowCreateTinForm(true)}
            >
              <FaPlus size={14} />
              Create TIN
            </button>
          )}
          {hasPermission("Approve Transfer Issue Note") &&
            selectedRowData[0]?.createdUserId !==
              parseInt(sessionStorage.getItem("userId")) &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success d-flex align-items-center gap-2"
                onClick={handleShowApproveTinModal}
              >
                <FaCheck size={14} />
                Approve Selected
              </button>
            )}
        </div>
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
              Available Approved Transfer Requisitions
            </h5>
            <span className="badge bg-white text-dark fw-semibold px-3 py-2">
              {transferRequisitions.length} Available
            </span>
          </div>
        </div>
        <div className="card-body p-0">
          {isLoadingTrn ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : transferRequisitions.length > 0 ? (
            <div
              className="table-responsive"
              style={{
                maxHeight: "320px",
                overflowY: "auto",
              }}
            >
              <table className="table table-hover mb-0">
                <thead className="table-light sticky-top">
                  <tr>
                    <th className="text-nowrap py-3 px-4 border-bottom">
                      Reference Number
                    </th>
                    <th className="text-nowrap py-3 px-4 border-bottom">
                      Requested By
                    </th>
                    <th className="text-nowrap py-3 px-4 border-bottom">
                      Requested Location
                    </th>
                    <th className="text-nowrap py-3 px-4 border-bottom">
                      TRN Date
                    </th>
                    <th className="text-nowrap py-3 px-4 border-bottom">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transferRequisitions.map((trn) => (
                    <tr key={trn.requisitionMasterId} className="border-bottom">
                      <td className="fw-semibold py-3 px-4 text-dark">
                        {trn.referenceNumber}
                      </td>
                      <td className="py-3 px-4">{trn.requestedBy}</td>
                      <td className="py-3 px-4">
                        {trn?.requestedFromLocation?.locationName || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-muted">
                        {formatDateTime(trn.requisitionDate)}
                      </td>
                      <td className="py-3 px-4">
                        {trn.isIssueMasterCreated ? (
                          <span className="badge bg-success rounded-pill">
                            TIN Created
                          </span>
                        ) : (
                          <span className="badge bg-warning text-dark rounded-pill">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-3">
              <i className="bi bi-inbox display-4 text-muted d-block mb-3"></i>
              <p className="text-muted mb-0">
                No approved Transfer Requisitions available
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body py-3">
          <div className="row align-items-center g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by reference number..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-calendar3 text-muted"></i>
                </span>
                <input
                  type="date"
                  className="form-control border-start-0 ps-0"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-info">
                <tr>
                  <th className="py-3 px-4" style={{ width: "50px" }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  <th className="py-3 px-4 text-nowrap">Reference Number</th>
                  <th className="py-3 px-4 text-nowrap">TRN Reference</th>
                  <th className="py-3 px-4 text-nowrap">Issued By</th>
                  <th className="py-3 px-4 text-nowrap">Dispatched To</th>
                  <th className="py-3 px-4 text-nowrap">TIN Date</th>
                  <th className="py-3 px-4 text-nowrap">Status</th>
                  <th className="py-3 px-4 text-nowrap text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTins.length > 0 ? (
                  filteredTins
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage,
                    )
                    .map((Tin) => (
                      <tr key={Tin.issueMasterId} className="border-bottom">
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedRows.includes(Tin.issueMasterId)}
                            onChange={() => handleRowSelect(Tin.issueMasterId)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                        <td className="py-3 px-3 fw-semibold text-dark">
                          {Tin.referenceNumber}
                        </td>
                        <td className="py-3 px-4 fw-semibold text-dark">
                          {Tin?.requisitionMaster?.referenceNumber || "N/A"}
                        </td>
                        <td className="py-3 px-3">{Tin.createdBy}</td>
                        <td className="py-3 px-3">
                          {Tin?.requisitionMaster?.requestedFromLocation
                            ?.locationName || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-muted">
                          {formatDateTime(Tin?.issueDate)}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`badge rounded-pill ${getStatusBadgeClass(
                              Tin.status,
                            )}`}
                          >
                            {getStatusLabel(Tin.status)}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
                            onClick={() => handleViewDetails(Tin)}
                          >
                            <FaEye size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="text-muted">
                        <i className="bi bi-search display-4 d-block mb-3"></i>
                        <p className="mb-0">
                          No transfer issue notes found matching your search.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {filteredTins.length > 0 && (
          <div className="card-footer bg-white border-top py-3">
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={filteredTins.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>

      {showDetailTinModalInParent && (
        <TinDetails
          show={showDetailTinModal}
          handleClose={handleCloseDetailTinModal}
          tin={TinDetail}
        />
      )}
      {showApproveTinModalInParent && (
        <TinApproval
          show={showApproveTinModal}
          handleClose={handleCloseApproveTinModal}
          tin={selectedRowData[0]}
          handleApproved={handleApproved}
        />
      )}
      <DeleteConfirmationModal
        show={showTINDeleteModal}
        handleClose={handleCloseDeleteConfirmation}
        handleConfirmDelete={handleConfirmDeleteTIN}
        title={`TIN "${selectedRowData[0]?.referenceNumber}"`}
        submissionStatus={submissionStatus}
        message={submissionMessage}
        loading={isLoading}
      />
    </div>
  );
};

export default TinList;
