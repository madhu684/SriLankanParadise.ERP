import React from "react";
import useSalesPersonList from "./useSalesPersonList";
import ErrorComponent from "../../errorComponent/errorComponent";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import { FaSearch } from "react-icons/fa";
import Pagination from "../../common/Pagination/Pagination";
import SalesPerson from "../SalesPerson";
import SalesPersonUpdate from "../salesPersonUpdate/SalesPersonUpdate.jsx";
import SalesPersonDetail from "../salesPersonDetail/salesPersonDetail.jsx";
import DeleteConfirmationModal from "../../confirmationModals/deleteConfirmationModal/deleteConfirmationModal.jsx";

const SalesPersonList = () => {
  const {
    salesPerson,
    isLoadingSalesPersons,
    error,
    isAnyRowSelected,
    selectedRows,
    searchQuery,
    itemsPerPage,
    currentPage,
    selectedRowData,
    filteredSalesPerson,
    showCreateSPForm,
    showUpdateSPForm,
    showSPViewModal,
    selectedSalesPerson,
    showDeleteModal,
    loading,
    setShowDeleteModal,
    setShowUpdateSPForm,
    setShowCreateSPForm,
    handleSearch,
    handleCloseUpdate,
    handleViewDetails,
    handleCloseSPViewModal,
    paginate,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleDelete,
  } = useSalesPersonList();

  if (error) {
    return <ErrorComponent error={error || "Error fetching data"} />;
  }

  if (isLoadingSalesPersons || (salesPerson && salesPerson.length === 0)) {
    return <LoadingSpinner />;
  }

  if (showCreateSPForm) {
    return <SalesPerson handleClose={() => setShowCreateSPForm(false)} />;
  }

  if (showUpdateSPForm) {
    return (
      <SalesPersonUpdate
        salesPerson={selectedRowData[0]}
        handleClose={handleCloseUpdate}
      />
    );
  }

  if (salesPerson.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Sales Persons</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any Sales Person yet.. Create a new one.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowCreateSPForm(true)}
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Sales Persons</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowCreateSPForm(true)}
          >
            Create
          </button>
          {isAnyRowSelected && (
            <button
              className="btn btn-warning"
              onClick={() => setShowUpdateSPForm(true)}
            >
              Edit
            </button>
          )}
          {isAnyRowSelected &&
            salesPerson?.some(
              (cm) => cm?.salesPersonId === selectedRowData[0]?.salesPersonId
            ) && (
              <button
                className={`btn btn-${
                  selectedRowData[0]?.isActive === true ? "danger" : "success"
                }`}
                onClick={() => setShowDeleteModal(true)}
              >
                {selectedRowData[0]?.isActive === true
                  ? "Deactivate"
                  : "Activate"}
              </button>
            )}
        </div>
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

      {/* Table */}
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Sales Person Code</th>
              <th>Sales Person Name</th>
              <th>Contact Number</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalesPerson
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((sp) => (
                <tr key={sp.salesPersonId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(sp.salesPersonId)}
                      onChange={() => handleRowSelect(sp.salesPersonId)}
                    />
                  </td>
                  <td>{sp.salesPersonCode}</td>
                  <td>
                    {sp.firstName} {sp.lastName}
                  </td>
                  <td>{sp.contactNo}</td>
                  <td>
                    <span
                      className={`badge ${getStatusBadgeClass(
                        sp.isActive === true ? 1 : 0
                      )}`}
                    >
                      {getStatusLabel(sp.isActive === true ? 1 : 0)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleViewDetails(sp)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={filteredSalesPerson ? filteredSalesPerson?.length : 0}
            paginate={paginate}
            currentPage={currentPage}
          />
          {showSPViewModal && (
            <SalesPersonDetail
              show={showSPViewModal}
              salesPerson={selectedSalesPerson || selectedRowData[0]}
              handleClose={handleCloseSPViewModal}
            />
          )}
          <DeleteConfirmationModal
            show={showDeleteModal}
            handleClose={() => setShowDeleteModal(false)}
            handleConfirmDelete={handleDelete}
            title={`Sales Person "${selectedRowData[0]?.firstName} ${selectedRowData[0]?.lastName}"`}
            submissionStatus={null}
            message={null}
            loading={loading}
            type={
              selectedRowData[0]?.isActive === true ? "Deactivate" : "Activate"
            }
          />
        </table>
      </div>
    </div>
  );
};

export default SalesPersonList;
