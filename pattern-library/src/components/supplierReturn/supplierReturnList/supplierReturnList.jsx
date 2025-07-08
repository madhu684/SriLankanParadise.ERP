import React from "react";
import useSupplierReturnList from "./useSupplierReturnList";
import SupplierReturn from "../SupplierReturn";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import SupplierReturnDetail from "../supplierReturnDetail/supplierReturnDetail";
import SupplierReturnUpdate from "../supplierReturnUpdate/supplierReturnUpdate";
import SupplierReturnApprove from "../supplierReturnApprove/supplierReturnApprove";
import Pagination from "../../common/Pagination/Pagination";

const SupplierReturnList = () => {
  const {
    supplyReturns,
    isLoadingSupplyReturns,
    isErrorSupplyReturns,
    errorSupplyReturns,
    showCreateSRForm,
    selectedRows,
    selectedRowData,
    isAnyRowSelected,
    showDetailSRModal,
    showDetailSRModalInParent,
    SRDetail,
    showUpdateSRForm,
    showApproveSRModal,
    showApproveSRModalInParent,
    currentItems,
    itemsPerPage,
    currentPage,
    filteredData,
    searchTerm,
    setShowUpdateSRForm,
    setShowCreateSRForm,
    areAnySelectedRowsPending,
    areAnySelectedRowsApproved,
    setSelectedRows,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowDetailSRModal,
    handleCloseDetailSRModal,
    handleViewDetails,
    handleShowApproveSRModal,
    handleCloseApproveSRModal,
    handleUpdate,
    paginate,
    handleSearchChange,
  } = useSupplierReturnList();

  if (isErrorSupplyReturns) {
    return (
      <ErrorComponent
        error={errorSupplyReturns || "Error fetching supplier returns"}
      />
    );
  }

  if (
    isLoadingSupplyReturns ||
    (supplyReturns && !(supplyReturns.length >= 0))
  ) {
    return <LoadingSpinner />;
  }

  if (showCreateSRForm) {
    return (
      <SupplierReturn
        handleClose={() => setShowCreateSRForm(false)}
        setShowCreateSRForm={setShowCreateSRForm}
      />
    );
  }

  if (showUpdateSRForm) {
    return (
      <SupplierReturnUpdate
        handleClose={() => setShowUpdateSRForm(false)}
        supplyReturnMaster={SRDetail || selectedRowData[0]}
        setShowUpdateSRForm={setShowUpdateSRForm}
      />
    );
  }

  if (supplyReturns.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Supplier Returns</h2>
        <div
          className="d-flex flex-column align-items-center justify-content-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any supplier returns. Create a new one.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowCreateSRForm(true)}
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Supplier Returns</h2>
      <div className="d-flex align-items-center justify-content-start mt-3">
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowCreateSRForm(true)}
          >
            Create
          </button>
          {selectedRowData[0]?.returnedUserId !==
            parseInt(sessionStorage.getItem("userId")) &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={() => handleShowApproveSRModal(selectedRowData[0])}
              >
                Approve
              </button>
            )}
          {/* {isAnyRowSelected && areAnySelectedRowsApproved(selectedRows) && (
            <button
              className="btn btn-success"
              //onClick={() => setShowConvertSOForm(true)}
            >
              {selectedRowData[0]?.returnType === "creditNote"
                ? "Credit Note"
                : "GRN"}
            </button>
          )} */}
          {isAnyRowSelected && areAnySelectedRowsPending(selectedRows) && (
            <button
              className="btn btn-warning"
              onClick={() => setShowUpdateSRForm(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="input-group mt-4 mb-3 w-25">
        <span className="input-group-text bg-transparent">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search for a return..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <span
            className="input-group-text bg-transparent"
            style={{ cursor: "pointer" }}
            onClick={handleSearchChange}
          >
            <i className="bi bi-x"></i>
          </span>
        )}
      </div>

      {/* Table */}
      {currentItems && currentItems.length > 0 ? (
        <div className="table-responsive">
          <table className="table mt-2">
            <thead>
              <tr>
                <th></th>
                <th>Reference No</th>
                <th>Created By</th>
                <th>Created Date</th>
                <th>Returned Date</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((sr) => (
                <tr key={sr.supplyReturnMasterId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(sr.supplyReturnMasterId)}
                      onChange={() => handleRowSelect(sr.supplyReturnMasterId)}
                    />
                  </td>
                  <td>{sr.referenceNo}</td>
                  <td>{sr.returnedBy}</td>
                  <td>{sr.createdDate.split("T")[0]}</td>
                  <td>{sr.returnDate.split("T")[0]}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${getStatusBadgeClass(
                        sr.status
                      )}`}
                    >
                      {getStatusLabel(sr.status)}
                    </span>
                  </td>
                  <td>
                    {sr.status === 0 ? (
                      <button
                        className="btn btn-warning me-2"
                        //onClick={() => handleUpdate(so)}
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
                        onClick={() => handleViewDetails(sr)}
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
          {supplyReturns && supplyReturns.length > 0 && (
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={filteredData ? filteredData.length : 0}
              paginate={paginate}
              currentPage={currentPage}
            />
          )}
          {showDetailSRModalInParent && (
            <SupplierReturnDetail
              show={showDetailSRModal}
              handleClose={handleCloseDetailSRModal}
              supplyReturnMaster={SRDetail}
            />
          )}
          {showApproveSRModalInParent && (
            <SupplierReturnApprove
              show={showApproveSRModal}
              handleClose={handleCloseApproveSRModal}
              supplyReturnMaster={SRDetail}
            />
          )}
        </div>
      ) : (
        <div className="alert alert-primary text-center mb-3">
          <span className="me-3">
            <i className="bi bi-emoji-frown"></i>
          </span>
          No matching items found.
        </div>
      )}
    </div>
  );
};

export default SupplierReturnList;
