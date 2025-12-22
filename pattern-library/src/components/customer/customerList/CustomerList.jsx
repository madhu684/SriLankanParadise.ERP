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
  } = useCustomerList();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredCustomers = customers?.filter(
    (si) =>
      si.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      si.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <ErrorComponent error={error || "Error fetching data"} />;
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

  if (customers.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Customers</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any customers yet.. Create a new one.</p>
          {/* {hasPermission("Create Supplier") && ( */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowCreateCustomerForm(true)}
          >
            Create
          </button>
          {/* )} */}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Customers</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {/* {hasPermission("Create Supplier") && ( */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowCreateCustomerForm(true)}
          >
            Create
          </button>
          {/* )} */}
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
      <div className="d-flex justify-content-end mb-3">
        <div className="search-bar input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name or Phone no"
            value={searchQuery}
            onChange={handleSearch}
          />
          <span className="input-group-text">
            <FaSearch />
          </span>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Customer Name</th>
              <th>Mobile Number</th>
              <th>Customer Code</th>
              <th>Contact Person</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((im) => (
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
                  <td>{im.customerCode || "N/A"}</td>
                  <td>{im.contactPerson || "N/A"}</td>
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
                      <button
                        className="btn btn-warning me-2"
                        //onClick={() => handleUpdate(im)}
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
          totalItems={filteredCustomers?.length}
          paginate={paginate}
          currentPage={currentPage}
        />
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
    </div>
  );
};

export default CustomerList;
