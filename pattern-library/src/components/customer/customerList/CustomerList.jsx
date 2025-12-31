import { FaSearch } from "react-icons/fa";
import useCustomerList from "./useCustomerList";
import Pagination from "../../common/Pagination/Pagination";
import ErrorComponent from "../../errorComponent/errorComponent";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import Customer from "../customer";
import CustomerUpdate from "../customerUpdate/CustomerUpdate.jsx";
import DeleteConfirmationModal from "../../confirmationModals/deleteConfirmationModal/deleteConfirmationModal.jsx";
import CustomerView from "../customerView/CustomerView.jsx";

const CustomerList = () => {
  const {
    isAnyRowSelected,
    selectedRows,
    customers,
    isLoadingCustomers,
    error,
    searchQuery,
    itemsPerPage,
    currentPage,
    showCreateCustomerForm,
    showCustomerUpdateForm,
    selectedRowData,
    showCustomerViewModal,
    selectedCustomer,
    submissionMessage,
    submissionStatus,
    isLoading,
    showCustomerDeleteModal,
    customerTypeFilter,
    customerTypes,
    paginationMeta,
    getStatusLabel,
    getStatusBadgeClass,
    setShowCustomerDeleteModal,
    setShowCreateCustomerForm,
    setShowCustomerUpdateForm,
    setSearchQuery,
    setCurrentPage,
    handleCloseDeleteConfirmation,
    handleConfirmDeleteCustomer,
    handleRowSelect,
    handleClose,
    handleCloseCustomerViewModal,
    handleViewDetails,
    handleCustomerTypeFilterChange,
    debouncedSearchQuery,
    isFetching,
  } = useCustomerList();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <ErrorComponent error={error?.message || "Error fetching data"} />;
  }

  if (isLoadingCustomers) {
    return <LoadingSpinner />;
  }

  if (showCreateCustomerForm) {
    return <Customer handleClose={() => setShowCreateCustomerForm(false)} />;
  }

  if (showCustomerUpdateForm) {
    return (
      <CustomerUpdate handleClose={handleClose} customer={selectedRowData[0]} />
    );
  }

  // Check if it's initial load with no customers at all
  if (
    customers.length === 0 &&
    !debouncedSearchQuery &&
    !customerTypeFilter &&
    !isFetching
  ) {
    return (
      <div className="container mt-4">
        <h2>Customers</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any customers yet.. Create a new one.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowCreateCustomerForm(true)}
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Customers</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowCreateCustomerForm(true)}
          >
            Create
          </button>
          {isAnyRowSelected && (
            <button
              className="btn btn-warning"
              onClick={() => setShowCustomerUpdateForm(true)}
            >
              Edit
            </button>
          )}
          {isAnyRowSelected &&
            customers?.some(
              (cm) => cm?.customerId === selectedRowData[0]?.customerId
            ) && (
              <button
                className={`btn btn-${
                  selectedRowData[0]?.status === 1 ? "danger" : "success"
                }`}
                onClick={() => setShowCustomerDeleteModal(true)}
              >
                {selectedRowData[0]?.status === 1 ? "Deactivate" : "Activate"}
              </button>
            )}
        </div>
      </div>

      {/* Filter and Search Row */}
      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        {/* Customer Type Filter */}
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center gap-2 p-2 rounded"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <label
              htmlFor="customerTypeFilter"
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
              Filter by Type:
            </label>
            <select
              id="customerTypeFilter"
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
              value={customerTypeFilter || ""}
              onChange={(e) =>
                handleCustomerTypeFilterChange(e.target.value || null)
              }
            >
              <option value="">All Customers</option>
              {customerTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filter Badge */}
          {customerTypeFilter && (
            <span className="badge border border-primary border-2 bg-white text-primary rounded-pill d-inline-flex align-items-center gap-2 py-2 px-3 fw-medium">
              {customerTypes.find((t) => t.value === customerTypeFilter)?.label}
              <button
                type="button"
                className="btn-close btn-close-sm opacity-75"
                onClick={() => handleCustomerTypeFilterChange(null)}
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
            placeholder="Search by Name or Phone no"
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

      {/* No Customers Found Message */}
      {customers.length === 0 ? (
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
          <h5 className="text-muted mb-2">No Customers Found</h5>
          <p className="text-secondary mb-3">
            {searchQuery || customerTypeFilter
              ? "No customers match your search criteria. Try adjusting your filters."
              : "You haven't created any customers yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Table with customers */}
          <div className="table-responsive">
            <table className="table mt-2">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Customer Name</th>
                  <th>Mobile Number</th>
                  <th>Customer Type</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((im) => (
                  <tr key={im.customerId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(im.customerId)}
                        onChange={() => handleRowSelect(im.customerId)}
                      />
                    </td>
                    <td>{im.customerName}</td>
                    <td>{im.phone}</td>
                    <td>
                      <span
                        className={`badge ${
                          im.customerType === "patient"
                            ? "border border-primary text-primary bg-primary bg-opacity-10"
                            : "border border-danger text-danger bg-danger bg-opacity-10"
                        }`}
                      >
                        {im.customerType === "patient"
                          ? "Patient"
                          : "Sales Customer"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill ${getStatusBadgeClass(
                          im.status
                        )}`}
                      >
                        {getStatusLabel(im.status)}
                      </span>
                    </td>
                    <td>
                      {im.status === false ? (
                        <button className="btn btn-warning me-2">
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
              totalItems={paginationMeta.totalCount}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </>
      )}

      {/* Modals */}
      {showCustomerViewModal && (
        <CustomerView
          show={showCustomerViewModal}
          handleClose={handleCloseCustomerViewModal}
          customer={selectedCustomer || selectedRowData[0]}
        />
      )}
      <DeleteConfirmationModal
        show={showCustomerDeleteModal}
        handleClose={handleCloseDeleteConfirmation}
        handleConfirmDelete={handleConfirmDeleteCustomer}
        title={`Customer "${selectedRowData[0]?.customerName}"`}
        submissionStatus={submissionStatus}
        message={submissionMessage}
        loading={isLoading}
        type={selectedRowData[0]?.status === 1 ? "Deactivate" : "Activate"}
      />
    </div>
  );
};

export default CustomerList;
