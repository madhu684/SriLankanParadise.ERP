import React from "react";
import useItemMasterList from "./useItemMasterList";
import ItemMaster from "../itemMaster";
import ItemMasterDetail from "../itemMasterDetail/itemMasterDetail";
import ItemMasterUpdate from "../itemMasterUpdate/itemMasterUpdate";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import DeleteConfirmationModal from "../../confirmationModals/deleteConfirmationModal/deleteConfirmationModal";

const ItemMasterList = () => {
  const {
    itemMasters,
    isLoadingData,
    isLoadingPermissions,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showDetailIMModal,
    showDetailIMModalInParent,
    showCreateIMForm,
    showUpdateIMForm,
    IMDetail,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    loading,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleCloseDetailIMModal,
    handleViewDetails,
    setShowCreateIMForm,
    setShowUpdateIMForm,
    setShowDeleteConfirmation,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleConfirmDeleteItemMaster,
    handleCloseDeleteConfirmation,
  } = useItemMasterList();

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (
    isLoadingData ||
    isLoadingPermissions ||
    (itemMasters && !itemMasters.length > 0)
  ) {
    return <LoadingSpinner />;
  }

  if (showCreateIMForm) {
    return (
      <ItemMaster
        handleClose={() => setShowCreateIMForm(false)}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (showUpdateIMForm) {
    return (
      <ItemMasterUpdate
        handleClose={handleClose}
        itemMaster={IMDetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (!itemMasters) {
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
          {hasPermission("Delete Item Master") && isAnyRowSelected && (
            <button
              className="btn btn-danger"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              Delete
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
              <th>Item Master Id</th>
              <th>Item Name</th>
              <th>Quantity Stock</th>
              <th>Status</th>
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
                <td>{im.itemName}</td>
                <td>{im.stockQuantity}</td>
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
    </div>
  );
};

export default ItemMasterList;