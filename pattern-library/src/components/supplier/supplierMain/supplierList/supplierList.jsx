import React, { useState } from 'react'
import useSupplierList from './useSupplierList'
import Supplier from '../supplier'
import SupplierDetails from '../supplierDetail/supplierDetail'
import SupplierUpdate from '../supplierUpdate/supplierUpdate'
import LoadingSpinner from '../../../loadingSpinner/loadingSpinner'
import ErrorComponent from '../../../errorComponent/errorComponent'
import DeleteConfirmationModal from '../../../confirmationModals/deleteConfirmationModal/deleteConfirmationModal'
import { FaSearch } from 'react-icons/fa'
import Pagination from '../../../common/Pagination/Pagination'

const SupplierList = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    suppliers,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showDetailSupplierModal,
    showDetailSupplierModalInParent,
    showCreateSupplierForm,
    showUpdateSupplierForm,
    SupplierDetail,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    loading,
    isPermissionsError,
    purchaseOrders,
    isLoadingPurchaseOrders,
    isPurchaseOrdersError,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleCloseDetailSupplierModal,
    handleViewDetails,
    setShowCreateSupplierForm,
    setShowUpdateSupplierForm,
    setShowDeleteConfirmation,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleConfirmDeleteSupplier,
    handleCloseDeleteConfirmation,
  } = useSupplierList()

  //Handler for search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  //Filter Suppliers based on search query
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  )

  //Pagination Handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (error || isPurchaseOrdersError || isPermissionsError) {
    return <ErrorComponent error={error} />
  }

  if (
    isLoadingData ||
    isLoadingPermissions ||
    isLoadingPurchaseOrders ||
    (suppliers && !(suppliers.length >= 0))
  ) {
    return <LoadingSpinner />
  }

  if (showCreateSupplierForm) {
    return (
      <Supplier
        handleClose={() => setShowCreateSupplierForm(false)}
        handleUpdated={handleUpdated}
      />
    )
  }

  if (showUpdateSupplierForm) {
    return (
      <SupplierUpdate
        handleClose={handleClose}
        supplier={SupplierDetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
      />
    )
  }

  if (suppliers.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Suppliers</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: '80vh' }}
        >
          <p>You haven't created any supplier. Create a new one.</p>
          {hasPermission('Create Supplier') && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateSupplierForm(true)}
            >
              Create
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <h2>Suppliers</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission('Create Supplier') && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateSupplierForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission('Update Supplier') && isAnyRowSelected && (
            <button
              className="btn btn-warning"
              onClick={() => setShowUpdateSupplierForm(true)}
            >
              Edit
            </button>
          )}
          {hasPermission('Delete Supplier') &&
            isAnyRowSelected &&
            !purchaseOrders?.some(
              (order) => order?.supplierId === selectedRowData[0]?.supplierId
            ) && (
              <button
                className="btn btn-danger"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Delete
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
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Supplier Id</th>
              <th>Supplier Name</th>
              <th>Contact Person</th>
              <th>Mobile Number</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((im) => (
                <tr key={im.supplierId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(im.supplierId)}
                      onChange={() => handleRowSelect(im.supplierId)}
                    />
                  </td>
                  <td>{im.supplierId}</td>
                  <td>{im.supplierName}</td>
                  <td>{im.contactPerson}</td>
                  <td>{im.phone}</td>
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
                        </svg>{' '}
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
                        </svg>{' '}
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
          totalItems={filteredSuppliers.length}
          paginate={paginate}
          currentPage={currentPage}
        />
        {showDetailSupplierModalInParent && (
          <SupplierDetails
            show={showDetailSupplierModal}
            handleClose={handleCloseDetailSupplierModal}
            supplier={SupplierDetail}
          />
        )}
        <DeleteConfirmationModal
          show={showDeleteConfirmation}
          handleClose={handleCloseDeleteConfirmation}
          handleConfirmDelete={handleConfirmDeleteSupplier}
          title={`Supplier "${selectedRowData[0]?.supplierName}"`}
          submissionStatus={submissionStatus}
          message={submissionMessage}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default SupplierList
