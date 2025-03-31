import React from 'react'
import usePackingSlipList from './usePackingSlipList'
import PackingSlip from '../packingSlip'
import ErrorComponent from '../../errorComponent/errorComponent'
import LoadingSpinner from '../../loadingSpinner/loadingSpinner'
import PackingSlipDetail from '../packingSlipDetail/packingSlipDetail'
import PackingSlipApproval from '../packingSlipApproval/packingSlipApproval'
import PackingSlipUpdate from '../packingSlipUpdate/packingSlipUpdate'

const PackingSlipList = () => {
  const {
    packingSlips,
    isLoadingData,
    showCreatePSForm,
    error,
    isPermissionsError,
    isLoadingPermissions,
    permissionError,
    isAnyRowSelected,
    selectedRows,
    showApprovePSModal,
    showApprovePSModalInParent,
    showDetailPSModal,
    showDetailPSModalInParent,
    selectedRowData,
    showUpdatePSForm,
    userPermissions,
    PSDetail,
    showConvertPSForm,
    handleCloseDetailPSModal,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApprovePSModal,
    handleCloseApprovePSModal,
    handleShowDetailPSModal,
    handleApproved,
    setShowUpdatePSForm,
    setShowCreatePSForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    areAnySelectedRowsApproved,
    handleConvert,
    setShowConvertPSForm,
  } = usePackingSlipList()

  if (error || isPermissionsError) {
    return <ErrorComponent error={error || 'Error fetching data'} />
  }

  if (
    isLoadingData ||
    isLoadingPermissions ||
    (packingSlips && !(packingSlips.length >= 0))
  ) {
    return <LoadingSpinner />
  }

  if (showCreatePSForm) {
      return (
        <PackingSlip
          handleClose={() => setShowCreatePSForm(false)}
        />
      )
  }

  if(showUpdatePSForm) {
    return (
      <PackingSlipUpdate
        handleClose={handleClose}
        packingSlip={PSDetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
        setShowUpdatePSForm={setShowUpdatePSForm}
      />
    )
  }
  

  if(packingSlips.length === 0){
    return (
      <div className="container mt-4">
        <h2>Packing Slips</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: '80vh' }}
        >
          <p>You haven't created any packing slips. Create a new one.</p>
          {hasPermission('Create Packing Slip') && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreatePSForm(true)}
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
      <h2>Packing Slips</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission('Create Packing Slip') && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreatePSForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission('Approve Packing Slip') &&
            selectedRowData[0]?.createdUserId !==
              parseInt(sessionStorage.getItem('userId')) &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={handleShowApprovePSModal}
              >
                Approve
              </button>
            )}
          {/* {hasPermission('Convert Packing  Slip') &&
            isAnyRowSelected &&
            areAnySelectedRowsApproved(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={() => setShowConvertPSForm(true)}
              >
                Convert
              </button>
            )} */}
          {hasPermission('Update Packing Slip') && isAnyRowSelected && (
            <button
              className="btn btn-warning"
              onClick={() => setShowUpdatePSForm(true)}
            >
              Edit
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
              <th>Reference No</th>
              <th>Created By</th>
              <th>Packing Slip Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {packingSlips.map((ps) => (
              <tr key={ps.packingSlipId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(ps.packingSlipId)}
                    onChange={() => handleRowSelect(ps.packingSlipId)}
                  />
                </td>
                <td>{ps.referenceNo}</td>
                <td>{ps.createdBy}</td>
                <td>{ps?.packingSlipDate?.split('T')[0]}</td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      ps.status
                    )}`}
                  >
                    {getStatusLabel(ps.status)}
                  </span>
                </td>
                <td>
                  {ps.status === 0 ? (
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleUpdate(ps)}
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
                      onClick={() => handleViewDetails(ps)}
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
        {showApprovePSModalInParent && (
          <PackingSlipApproval
            show={showApprovePSModal}
            handleClose={handleCloseApprovePSModal}
            packingSlip={selectedRowData[0]}
            handleApproved={handleApproved}
          />
        )}
        {showDetailPSModalInParent && (
          <PackingSlipDetail
            show={showDetailPSModal}
            handleClose={handleCloseDetailPSModal}
            packingSlip={PSDetail}
          />
        )}
      </div>
    </div>
  )
  
}

export default PackingSlipList
