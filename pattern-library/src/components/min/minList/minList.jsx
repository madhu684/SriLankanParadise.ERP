import React, { useState } from 'react'
import useMinList from './useMinList.js'
import MinApproval from '../minApproval/minApproval.jsx'
import Min from '../min.jsx'
import MinDetails from '../minDetail/minDetail.jsx'
import LoadingSpinner from '../../loadingSpinner/loadingSpinner.jsx'
import ErrorComponent from '../../errorComponent/errorComponent.jsx'
import moment from 'moment'
import 'moment-timezone'
import { FaSearch } from 'react-icons/fa'
import Pagination from '../../common/Pagination/Pagination.jsx'

const MinList = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    mins,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showApproveMinModal,
    showApproveMinModalInParent,
    showDetailMinModal,
    showDetailMinModalInParent,
    showCreateMinForm,
    showUpdateMinForm,
    MinDetail,
    isPermissionsError,
    permissionError,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleShowApproveMinModal,
    handleCloseApproveMinModal,
    handleCloseDetailMinModal,
    handleApproved,
    handleViewDetails,
    setShowCreateMinForm,
    setShowUpdateMinForm,
    hasPermission,
    handleUpdated,
    handleClose,
  } = useMinList()

  //Handler for search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  //Filter MINS based on search query
  const filteredMaterialIssueNotes = mins?.filter((min) =>
    min.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  //Pagination Handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (error || isPermissionsError) {
    return <ErrorComponent error={error || 'Error fetching data'} />
  }

  if (isLoadingData || isLoadingPermissions || (mins && !(mins?.length >= 0))) {
    return <LoadingSpinner />
  }

  if (showCreateMinForm) {
    return (
      <Min
        handleClose={() => setShowCreateMinForm(false)}
        handleUpdated={handleUpdated}
      />
    )
  }

  if (mins?.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Material Issue Notes</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: '80vh' }}
        >
          <p>You haven't created any material issue note. Create a new one.</p>
          {hasPermission('Create Material Issue Note') && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateMinForm(true)}
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
      <h2>Material Issue Notes</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission('Create Material Issue Note') && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateMinForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission('Approve Material Issue Note') &&
            selectedRowData[0]?.createdUserId !==
              parseInt(sessionStorage.getItem('userId')) &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={handleShowApproveMinModal}
              >
                Approve
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
              <th>Reference Number</th>
              <th>Issued By</th>
              <th>MIN Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterialIssueNotes
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((min) => (
                <tr key={min.issueMasterId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(min.issueMasterId)}
                      onChange={() => handleRowSelect(min.issueMasterId)}
                    />
                  </td>
                  <td>{min.referenceNumber}</td>
                  <td>{min.createdBy}</td>
                  <td>
                    {moment
                      .utc(min?.issueDate)
                      .tz('Asia/Colombo')
                      .format('YYYY-MM-DD hh:mm:ss A')}
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill ${getStatusBadgeClass(
                        min.status
                      )}`}
                    >
                      {getStatusLabel(min.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleViewDetails(min)}
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
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredMaterialIssueNotes.length}
          paginate={paginate}
          currentPage={currentPage}
        />
        {showDetailMinModalInParent && (
          <MinDetails
            show={showDetailMinModal}
            handleClose={handleCloseDetailMinModal}
            min={MinDetail}
          />
        )}
        {showApproveMinModalInParent && (
          <MinApproval
            show={showApproveMinModal}
            handleClose={handleCloseApproveMinModal}
            min={selectedRowData[0]}
            handleApproved={handleApproved}
          />
        )}
      </div>
    </div>
  )
}

export default MinList
