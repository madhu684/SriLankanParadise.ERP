import React from 'react'
import useTinList from './useTinList.js'
import TinApproval from '../tinApproval/tinApproval.jsx'
import Tin from '../tin.jsx'
import TinDetails from '../tinDetail/tinDetail.jsx'
import LoadingSpinner from '../../loadingSpinner/loadingSpinner.jsx'
import ErrorComponent from '../../errorComponent/errorComponent.jsx'
import moment from 'moment'
import 'moment-timezone'

const TinList = () => {
  const {
    Tins,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showApproveTinModal,
    showApproveTinModalInParent,
    showDetailTinModal,
    showDetailTinModalInParent,
    showCreateTinForm,
    showUpdateTinForm,
    TinDetail,
    isPermissionsError,
    permissionError,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleShowApproveTinModal,
    handleCloseApproveTinModal,
    handleCloseDetailTinModal,
    handleApproved,
    handleViewDetails,
    setShowCreateTinForm,
    setShowUpdateTinForm,
    hasPermission,
    handleUpdated,
    handleClose,
  } = useTinList()

  if (error || isPermissionsError) {
    return <ErrorComponent error={error || 'Error fetching data'} />
  }

  if (isLoadingData || isLoadingPermissions || (Tins && !(Tins?.length >= 0))) {
    return <LoadingSpinner />
  }

  if (showCreateTinForm) {
    return (
      <Tin
        handleClose={() => setShowCreateTinForm(false)}
        handleUpdated={handleUpdated}
        setShowCreateTinForm={setShowCreateTinForm}
      />
    )
  }

  if (Tins?.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Transfer Issue Notes</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: '80vh' }}
        >
          <p>You haven't created any transfer issue note. Create a new one.</p>
          {hasPermission('Create Transfer Issue Note') && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateTinForm(true)}
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
      <h2>Transfer Issue Notes</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission('Create Transfer Issue Note') && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateTinForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission('Approve Transfer Issue Note') &&
            selectedRowData[0]?.createdUserId !==
              parseInt(sessionStorage.getItem('userId')) &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={handleShowApproveTinModal}
              >
                Approve
              </button>
            )}
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
              <th>Tin Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {Tins?.map((Tin) => (
              <tr key={Tin.issueMasterId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(Tin.issueMasterId)}
                    onChange={() => handleRowSelect(Tin.issueMasterId)}
                  />
                </td>
                <td>{Tin.referenceNumber}</td>
                <td>{Tin.createdBy}</td>
                <td>
                  {moment
                    .utc(Tin?.issueDate)
                    .tz('Asia/Colombo')
                    .format('YYYY-MM-DD hh:mm:ss A')}
                </td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      Tin.status
                    )}`}
                  >
                    {getStatusLabel(Tin.status)}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleViewDetails(Tin)}
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
      </div>
    </div>
  )
}

export default TinList
