import React, { useContext, useState } from "react";
import useItemMasterList from "./useItemMasterList";
import ItemMaster from "features/inventory/itemMaster/itemMaster";
import ItemMasterDetail from "features/inventory/itemMaster/itemMasterDetail/itemMasterDetail";
import ItemMasterUpdate from "features/inventory/itemMaster/itemMasterUpdate/itemMasterUpdate";
import LoadingSpinner from "common/components/loadingSpinner/loadingSpinner";
import ErrorComponent from "common/components/errorComponent/errorComponent";
import DeleteConfirmationModal from "common/components/confirmationModals/deleteConfirmationModal/deleteConfirmationModal";
import { UserContext } from "common/context/userContext";
import { FaSearch } from "react-icons/fa";
import Pagination from "common/components/common/Pagination/Pagination";

const ItemMasterList = () => {
  const {
    itemsPerPage,
    itemMasters,
    isLoadingItemMasters,
    itemMastersError,
    isAnyRowSelected,
    selectedRows,
    showDetailIMModal,
    showDetailIMModalInParent,
    selectedRowData,
    showCreateIMForm,
    showUpdateIMForm,
    IMDetail,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    loading,
    searchQuery,
    currentPage,
    suppliers,
    supplierFilter,
    paginationMeta,
    isFetching,
    debouncedSearchQuery,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowDetailIMModal,
    handleCloseDetailIMModal,
    setShowCreateIMForm,
    setShowUpdateIMForm,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleCloseDeleteConfirmation,
    setShowDeleteConfirmation,
    handleConfirmDeleteItemMaster,
    handleSearch,
    handlePageChange,
    handleSupplierFilterChange,
  } = useItemMasterList();

  const { hasPermission, isLoadingPermissions } = useContext(UserContext);

  if (itemMastersError) {
    return <ErrorComponent error={itemMastersError} />;
  }

  if (isLoadingItemMasters || isLoadingPermissions) {
    return <LoadingSpinner />;
  }

  if (showCreateIMForm) {
    return (
      <ItemMaster
        handleClose={() => setShowCreateIMForm(false)}
        handleUpdated={handleUpdated}
        setShowCreateIMForm={setShowCreateIMForm}
      />
    );
  }

  if (showUpdateIMForm) {
    return (
      <ItemMasterUpdate
        handleClose={handleClose}
        itemMaster={IMDetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
        setShowUpdateIMForm={setShowUpdateIMForm}
      />
    );
  }

  if (
    itemMasters.length === 0 &&
    !debouncedSearchQuery &&
    !supplierFilter &&
    !isFetching
  ) {
    return (
      <div className="container mt-4">
        <h2>Item Masters</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any item master. Create a new one.</p>
          {hasPermission("Create Item Master") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateIMForm(true)}
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
      <h2>Item Masters</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission("Create Item Master") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateIMForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission("Update Item Master") && isAnyRowSelected && (
            <button
              className="btn btn-warning"
              onClick={() => setShowUpdateIMForm(true)}
            >
              Edit
            </button>
          )}
          {/* {hasPermission("Delete Item Master") && isAnyRowSelected && (
            <button
              className="btn btn-danger"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              Delete
            </button>
          )} */}
        </div>
      </div>

      {/* Filter and Search Row */}
      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        {/* Supplier Filter */}
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center gap-2 p-2 rounded"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <label
              htmlFor="supplierTypeFilter"
              className="mb-0 fw-semibold text-dark small"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-funnel me-1"
                viewBox="0 0 16 16"
              >
                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
              </svg>
              Filter by Supplier:
            </label>
            <select
              id="supplierTypeFilter"
              className="form-select form-select-sm border-0 shadow-sm"
              style={{
                width: "180px",
                borderRadius: "6px",
                padding: "6px 32px 6px 10px",
                fontSize: "13px",
                cursor: "pointer",
                backgroundColor: "#fff",
                fontWeight: "500",
                transition: "all 0.2s ease",
              }}
              value={supplierFilter || ""}
              onChange={(e) =>
                handleSupplierFilterChange(e.target.value || null)
              }
            >
              <option value="">All Suppliers</option>
              {suppliers?.map((supplier) => (
                <option key={supplier.supplierId} value={supplier.supplierId}>
                  {supplier.supplierName}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filter Badge */}
          {supplierFilter && (
            <span className="badge border border-bg-danger border-2 bg-white text-danger rounded-pill d-inline-flex align-items-center gap-2 py-2 px-3 fw-medium">
              {
                suppliers.find((s) => s.supplierId === parseInt(supplierFilter))
                  ?.supplierName
              }
              <button
                type="button"
                className="btn-close btn-close-sm opacity-75"
                onClick={() => handleSupplierFilterChange(null)}
                aria-label="Clear filter"
              ></button>
            </span>
          )}
        </div>

        {/* Search Bar */}
        <div
          className="search-bar input-group shadow-sm"
          style={{ maxWidth: "320px" }}
        >
          <span
            className="input-group-text bg-white"
            style={{
              border: "1px solid #dee2e6",
              borderRight: "none",
              borderRadius: "6px 0 0 6px",
            }}
          >
            <FaSearch style={{ color: "#6c757d", fontSize: "14px" }} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name or Item Code"
            value={searchQuery}
            onChange={handleSearch}
            style={{
              border: "1px solid #dee2e6",
              borderLeft: "none",
              borderRadius: "0 6px 6px 0",
              padding: "8px 12px",
              fontSize: "14px",
            }}
          />
        </div>
      </div>

      {/* No Item Found Message */}
      {itemMasters.length === 0 ? (
        <div className="d-flex flex-column justify-content-center align-items-center text-center py-5 my-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="currentColor"
            className="bi bi-inbox text-muted mb-3"
            viewBox="0 0 16 16"
          >
            <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z" />
          </svg>
          <h5 className="text-muted mb-2">No Item Masters Found</h5>
          <p className="text-secondary mb-3">
            {searchQuery || supplierFilter
              ? "No Item Master match your search criteria. Try adjusting your filters."
              : "You haven't created any Item Master yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table mt-2">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Item Master Id</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Item Type</th>
                  <th>Item Mode</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {itemMasters.map((im) => (
                  <tr key={im.itemMasterId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(im.itemMasterId)}
                        onChange={() => handleRowSelect(im.itemMasterId)}
                      />
                    </td>
                    <td>{im.itemMasterId}</td>
                    <td>{im.itemCode}</td>
                    <td>{im.itemName}</td>
                    <td>{im.itemType?.name}</td>
                    <td>{im.itemMode?.name || "N/A"}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${getStatusBadgeClass(
                          im.status
                        )}`}
                      >
                        {getStatusLabel(im.status)}
                      </span>
                    </td>
                    <td>{im.createdBy || "N/A"}</td>
                    <td>
                      {im.status === false ? (
                        <button
                          className="btn btn-warning me-2"
                          onClick={() => handleUpdate(im)}
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
                          onClick={() => handleViewDetails(im)}
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
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={paginationMeta.totalCount} // Use totalCount from backend
              paginate={handlePageChange}
              currentPage={currentPage}
            />
          </div>
        </>
      )}

      {/* Modals */}
      {showDetailIMModalInParent && (
        <ItemMasterDetail
          show={showDetailIMModal}
          handleClose={handleCloseDetailIMModal}
          itemMaster={IMDetail}
        />
      )}
      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        handleClose={handleCloseDeleteConfirmation}
        handleConfirmDelete={handleConfirmDeleteItemMaster}
        title={`Item Master "${selectedRowData[0]?.itemName}"`}
        submissionStatus={submissionStatus}
        message={submissionMessage}
        loading={loading}
      />
    </div>
  );
};

export default ItemMasterList;













