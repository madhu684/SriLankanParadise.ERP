import React, { useContext, useState } from "react";
import useTransferRequisitionList from "./useTransferRequisitionList";
import TransferRequisitionApproval from "../transferRequisitionApproval/transferRequisitionApproval";
import TransferRequisition from "../transferRequisition";
import TransferRequisitionDetail from "../transferRequisitionDetail/transferRequisitionDetail";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import TinsListDetail from "../tinsListDetail/tinsListDetail";
import moment from "moment";
import "moment-timezone";
import { FaSearch } from "react-icons/fa";
import Pagination from "../../common/Pagination/Pagination";
import { UserContext } from "../../../context/userContext";

const TransferRequisitionList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    transferRequisitions,
    isLoadingTrn,
    error,
    isAnyRowSelected,
    selectedRows,
    showApproveTRModal,
    showApproveTRModalInParent,
    showDetailTRModal,
    showDetailTRModalInParent,
    selectedRowData,
    showCreateTRForm,
    TRDetail,
    selectedWarehouse,
    userWarehouses,
    filter,
    filteredRequisitions,
    openTINsList,
    refetch,
    selectedDate,
    setRefetch,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApproveTRModal,
    handleCloseApproveTRModal,
    handleShowDetailTRModal,
    handleCloseDetailTRModal,
    handleApproved,
    setShowCreateTRForm,
    handleUpdated,
    handleClose,
    formatDateInTimezone,
    setSelectedWarehouse,
    setFilter,
    setOpenTINsList,
    setSelectedDate,
  } = useTransferRequisitionList();

  const { hasPermission } = useContext(UserContext);

  const [selectedTrnId, setSelectedTrnId] = useState(null);

  //Handler for search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  //Filter MRNs based on search query
  const filteredTransferRequisitions = filteredRequisitions?.filter(
    (tr) =>
      tr.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tr.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  //Pagination Handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (
    isLoadingTrn ||
    (transferRequisitions && !(transferRequisitions.length >= 0))
  ) {
    return <LoadingSpinner />;
  }

  if (showCreateTRForm) {
    return (
      <TransferRequisition
        handleClose={() => setShowCreateTRForm(false)}
        handleUpdated={handleUpdated}
        setShowCreateTRForm={setShowCreateTRForm}
      />
    );
  }

  if (openTINsList) {
    return (
      <TinsListDetail
        refetch={refetch}
        setRefetch={setRefetch}
        trnId={selectedTrnId}
        handleBack={() => setOpenTINsList(false)}
      />
    );
  }

  if (transferRequisitions.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Transfer Requisition Notes</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>
            You haven't created any transfer requisition note. Create a new one.
          </p>
          {hasPermission("Create Transfer Requisition Note") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateTRForm(true)}
            >
              Create
            </button>
          )}
        </div>
      </div>
    );
  }

  console.log("transferRequisitions: ", transferRequisitions);

  return (
    <div className="container mt-4">
      <h2>Transfer Requisition Notes</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission("Create Transfer Requisition Note") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateTRForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission("Approve Transfer Requisition Note") &&
            selectedRowData[0]?.requestedUserId !==
              parseInt(sessionStorage.getItem("userId")) &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={handleShowApproveTRModal}
              >
                Approve
              </button>
            )}
        </div>
      </div>
      <div className="d-flex flex-column flex-md-row align-items-md-center mb-3 mt-3">
        <div className="me-3 mb-2 mb-md-0">
          <select
            className="form-select"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            <option value="">Select Current Warehouse</option>
            {userWarehouses.map((warehouse) => (
              <option key={warehouse.locationId} value={warehouse.locationId}>
                {warehouse.location.locationName}
              </option>
            ))}
          </select>
        </div>
        <div className="me-3 mb-2 mb-md-0">
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        {selectedWarehouse && (
          <div className="filter-buttons">
            <button
              className={`btn ${
                filter === "all" ? "btn-primary" : "btn-outline-primary"
              } me-2 mb-2 mb-md-0`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`btn ${
                filter === "incoming" ? "btn-primary" : "btn-outline-primary"
              } me-2 mb-2 mb-md-0`}
              onClick={() => setFilter("incoming")}
            >
              Incoming
            </button>
            <button
              className={`btn ${
                filter === "outgoing" ? "btn-primary" : "btn-outline-primary"
              } mb-2 mb-md-0`}
              onClick={() => setFilter("outgoing")}
            >
              Outgoing
            </button>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-end mb-3">
        <div className="search-bar input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
          />
          <span className="input-group-text">
            <FaSearch />
          </span>
        </div>
      </div>
      <div className="table-responsive">
        <table
          className="table mt-2"
          style={{ minWidth: "1000px", overflowX: "auto" }}
        >
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Reference Number</th>
              <th>Requested By</th>
              <th>TRN Date</th>
              <th>Status</th>
              <th>Direction</th>
              <th>Details</th>
              <th>TRN Details</th>
              {/* <th>TIN Details</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredTransferRequisitions
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage,
              )
              .map((mr) => (
                <tr key={mr.requisitionMasterId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(mr.requisitionMasterId)}
                      onChange={() => handleRowSelect(mr.requisitionMasterId)}
                    />
                  </td>
                  <td>{mr.referenceNumber}</td>
                  <td>{mr.requestedBy}</td>
                  <td>
                    {moment
                      .utc(mr.requisitionDate)
                      .tz("Asia/Colombo")
                      .format("YYYY-MM-DD hh:mm:ss A")}
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill ${getStatusBadgeClass(
                        mr.status,
                      )}`}
                    >
                      {getStatusLabel(mr.status)}
                    </span>
                  </td>
                  <td>
                    {mr.requestedFromLocationId ===
                    parseInt(selectedWarehouse) ? (
                      <span className="bi bi-arrow-down"></span>
                    ) : (
                      <span className="bi bi-arrow-up"></span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleViewDetails(mr)}
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
                  </td>
                  <td>
                    {/* Display Accept button and disable it if Pending Approval or Approved and user is not the creator */}
                    <button
                      // style={{
                      //   backgroundColor: "#FFA07A",
                      //   color: "white",
                      //   border: "none",
                      // }}
                      className={`btn me-2 ${
                        mr.isMINAccepted ? "btn-info" : "btn-warning"
                      }`}
                      onClick={() => {
                        setOpenTINsList(true);
                        setSelectedTrnId(mr.requisitionMasterId);
                      }}
                      // disabled={
                      //   mr.isMINApproved === false ||
                      //   mr.status === 1 ||
                      //   (mr.status === 2 &&
                      //     mr.requestedUserId !==
                      //       parseInt(sessionStorage.getItem("userId")))
                      // }
                      disabled={
                        mr.status === 1 ||
                        mr.isMINApproved === false ||
                        mr.requestedUserId !==
                          parseInt(sessionStorage.getItem("userId"))
                      }
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
                      {mr.isMINAccepted === true ? "Accepted" : "Accept"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredTransferRequisitions.length}
          paginate={paginate}
          currentPage={currentPage}
        />
        {showApproveTRModalInParent && (
          <TransferRequisitionApproval
            show={showApproveTRModal}
            handleClose={handleCloseApproveTRModal}
            transferRequisition={selectedRowData[0]}
            handleApproved={handleApproved}
          />
        )}
        {showDetailTRModalInParent && (
          <TransferRequisitionDetail
            show={showDetailTRModal}
            handleClose={handleCloseDetailTRModal}
            transferRequisition={TRDetail}
          />
        )}
      </div>
    </div>
  );
};

export default TransferRequisitionList;
