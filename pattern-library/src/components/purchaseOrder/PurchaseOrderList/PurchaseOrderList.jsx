import React, { useState } from 'react'
import usePurchaseOrderList from './usePurchaseOrderList'
import PurchaseOrderApproval from '../PurchaseOrderApproval/PurchaseOrderApproval'
import PurchaseOrder from '../purchaseOrder'
import PurchaseOrderDetail from '../PurchaseOrderDetail/PurchaseOrderDetail'
import PurchaseOrderUpdate from '../purchaseOrderUpdate/purchaseOrderUpdate'
import LoadingSpinner from '../../loadingSpinner/loadingSpinner'
import ErrorComponent from '../../errorComponent/errorComponent'
import Pagination from '../../common/Pagination/Pagination'
import { FaSearch } from 'react-icons/fa'

const PurchaseOrderList = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    purchaseOrders,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showApprovePOModal,
    showApprovePOModalInParent,
    showDetailPOModal,
    showDetailPOModalInParent,
    showCreatePOForm,
    showUpdatePOForm,
    PODetail,
    isPermissionsError,
    permissionError,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleShowApprovePOModal,
    handleCloseApprovePOModal,
    handleCloseDetailPOModal,
    handleApproved,
    handleViewDetails,
    setShowCreatePOForm,
    setShowUpdatePOForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
  } = usePurchaseOrderList()

  //Handler for search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  //Filter MRNs based on search query
  const filteredPurchaseOrders = purchaseOrders.filter((po) =>
    po.referenceNo.toLowerCase().includes(searchQuery.toLowerCase())
  )

  //Pagination Handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (error || isPermissionsError) {
    return <ErrorComponent error={error || 'Error fetching data'} />
  }

  if (
    isLoadingData ||
    isLoadingPermissions ||
    (purchaseOrders && !(purchaseOrders.length >= 0))
  ) {
    return <LoadingSpinner />
  }

  if (showCreatePOForm) {
    return (
      <PurchaseOrder
        handleClose={() => setShowCreatePOForm(false)}
        handleUpdated={handleUpdated}
      />
    )
  }

  if (showUpdatePOForm) {
    return (
      <PurchaseOrderUpdate
        handleClose={handleClose}
        purchaseOrder={PODetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
      />
    )
  }

  if (purchaseOrders.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Purchase Orders</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: '80vh' }}
        >
          <p>You haven't created any purchase Order. Create a new one.</p>
          {hasPermission('Create Purchase Order') && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreatePOForm(true)}
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
      <h2>Purchase Orders</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission('Create Purchase Order') && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreatePOForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission('Approve Purchase Order') &&
            selectedRowData[0]?.orderedUserId !==
              parseInt(sessionStorage.getItem('userId')) &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={handleShowApprovePOModal}
              >
                Approve
              </button>
            )}
          {hasPermission('Update Purchase Order') && isAnyRowSelected && (
            <button
              className="btn btn-warning"
              onClick={() => setShowUpdatePOForm(true)}
            >
              Edit
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
              <th>Reference No</th>
              <th>Ordered By</th>
              <th>Supplier Name</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchaseOrders
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((po) => (
                <tr key={po.purchaseOrderId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(po.purchaseOrderId)}
                      onChange={() => handleRowSelect(po.purchaseOrderId)}
                    />
                  </td>
                  <td>{po.referenceNo}</td>
                  <td>{po.orderedBy}</td>
                  <td>{po.supplier.supplierName}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${getStatusBadgeClass(
                        po.status
                      )}`}
                    >
                      {getStatusLabel(po.status)}
                    </span>
                  </td>
                  <td>
                    {po.status === 0 ? (
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => handleUpdate(po)}
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
                        onClick={() => handleViewDetails(po)}
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
          totalItems={filteredPurchaseOrders.length}
          paginate={paginate}
          currentPage={currentPage}
        />
        {showApprovePOModalInParent && (
          <PurchaseOrderApproval
            show={showApprovePOModal}
            handleClose={handleCloseApprovePOModal}
            purchaseOrder={selectedRowData[0]}
            handleApproved={handleApproved}
          />
        )}
        {showDetailPOModalInParent && (
          <PurchaseOrderDetail
            show={showDetailPOModal}
            handleClose={handleCloseDetailPOModal}
            purchaseOrder={PODetail}
          />
        )}
      </div>
    </div>
  )
}

export default PurchaseOrderList
