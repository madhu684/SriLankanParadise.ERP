import React, { useState, useMemo } from "react";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import Pagination from "../../common/Pagination/Pagination";
import AddEmpties from "../addEmpties/addEmpties.jsx";
import useEmptyReturnsLogic from "./emptyReturnList.js";
import { FaSearch } from "react-icons/fa";
import ToastMessage from "../../toastMessage/toastMessage.js";

const EmptyReturnList = () => {
  const {
    showAddEmptiesForm,
    setShowAddEmptiesForm,
    companyLocations,
    companyLocationsLoading,
    userLocationsLoading,
    userLocations,
    selectedLocation,
    inventories,
    currentItems,
    itemsPerPage,
    currentPage,
    loading,
    handleSearch,
    paginate,
    handleLocationChange,
    handleToLocationChange,
    searchTerm,
    handleSearchChange,
    filteredInventories,
    showEditModal,
    showReduceEmptyModal,
    selectedItem,
    transferDetails,
    modalErrors,
    isSubmitting,
    submissionStatus,
    handleTransfer,
    handleReduceEmpty,
    handleCloseModal,
    handleCloseReduceModal,
    handleModalInputChange,
    handleModalSubmit,
    handleEmptyReduceModalSubmit,

    showToast,
    toastMessage,
    toastType,
    setShowToast,
    errors,
  } = useEmptyReturnsLogic();

  return (
    <>
      <div className="container-sm mt-4" style={{ maxWidth: "1200px" }}>
        {/* Display success or error message */}
        {submissionStatus === "successSubmitted" && (
          <div className="alert alert-success mb-3" role="alert">
            Empty Return Transfer successfully!
          </div>
        )}
        {submissionStatus === "error" && (
          <div className="alert alert-danger mb-3" role="alert">
            Error Empty Return Transfer. Please try again.
          </div>
        )}
        {/* Action buttons */}
        <div className="d-flex align-items-center justify-content-start mt-3">
          <div className="btn-group" role="group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowAddEmptiesForm(true)}
            >
              Empty Collection
            </button>
          </div>
        </div>

        <div className="row align-items-end g-3 mt-3">
          <div className="col-md-3">
            <label htmlFor="warehouse" className="form-label">
              Select From Location Warehouse
            </label>
            <select
              className="form-select"
              id="warehouse"
              value={selectedLocation || ""}
              onChange={handleLocationChange}
            >
              <option value="" disabled>
                Select a Warehouse
              </option>
              {/* {companyLocations && companyLocations.length > 0 ? (
                companyLocations
                  .filter((l) => l.locationTypeId === 2)
                  .map((item) => (
                    <option key={item.id} value={item.locationId}>
                      {item.locationName}
                    </option>
                  ))
              ) : (
                <option>No warehouses available</option>
              )} */}

              {userLocations && userLocations.length > 0 ? (
                userLocations
                  .filter((w) => w.location.locationType?.name === "Warehouse")
                  .map((w) => (
                    <option
                      key={w.location.locationId}
                      value={w.location.locationId}
                    >
                      {w.location.locationName}
                    </option>
                  ))
              ) : (
                <option>No warehouses available</option>
              )}
            </select>
          </div>

          <div className="col-md-3">
            <button
              className="btn btn-success mt-4 w-100"
              onClick={() => {
                console.log("Search button clicked");
                handleSearch();
              }}
              disabled={selectedLocation === null}
            >
              Search
            </button>
          </div>
        </div>

        <hr />
        <div>
          <h6 className="mt-2">Empty Return Information</h6>
          <div className="d-flex justify-content-between">
            <div className="input-group search-bar d-flex justify-content-between">
              <input
                type="text"
                className="form-control"
                placeholder="Search by item name"
                value={searchTerm}
                onChange={handleSearchChange}
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
                  <th></th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>From Location</th>
                  <th>Empty Stock in Hand</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9">
                      <div className="d-flex justify-content-center align-content-center">
                        <LoadingSpinner />
                      </div>
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr
                      key={index}
                      className={
                        item.stockInHand < item.reOrderLevel
                          ? "table-warning"
                          : item.stockInHand > item.maxStockLevel
                          ? "table-danger"
                          : ""
                      }
                    >
                      <td></td>
                      <td>{item.itemMaster.itemCode || "-"}</td>
                      <td>{item.itemMaster.itemName || "-"}</td>
                      <td>{item.location.locationName}</td>
                      <td>{item.stockInHand || "-"}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleTransfer(item)}
                        >
                          Empty Transfer
                        </button>

                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => handleReduceEmpty(item)}
                        >
                          Empty Reduce
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">
                      <div className="d-flex justify-content-center align-content-center">
                        No items available for the selected warehouse
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-2 d-flex justify-content-between align-items-center">
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={filteredInventories.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
        {/* Edit Modal */}
        {showEditModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Empty Return Transfer</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  ></button>
                </div>
                <div className="modal-body">
                  {selectedItem && (
                    <div>
                      <div className="row mb-3 mx-auto">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Item Code:</strong>
                          </label>
                          <p>{selectedItem.itemMaster.itemCode || "-"}</p>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Item Name:</strong>
                          </label>
                          <p>{selectedItem.itemMaster.itemName || "-"}</p>
                        </div>
                      </div>
                      <div className="row mb-3 mx-auto">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>From Location:</strong>
                          </label>
                          <p>{selectedItem.location.locationName || "-"}</p>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Empty Stock in Hand:</strong>
                          </label>
                          <p>{selectedItem.stockInHand || "-"}</p>
                        </div>
                      </div>
                      <hr />
                      <h6>Transfer Your Empties</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="warehouse" className="form-label">
                            Select To Location Warehouse
                          </label>
                          {/* Show validation error if location is not selected */}

                          <select
                            className="form-select"
                            id="warehouse"
                            value={transferDetails.location || ""}
                            onChange={handleToLocationChange}
                          >
                            <option value="" disabled>
                              Select a Warehouse
                            </option>
                            {companyLocations && companyLocations.length > 0 ? (
                              companyLocations
                                .filter((l) => l.locationTypeId === 2)
                                .map((item) => (
                                  <option key={item.id} value={item.locationId}>
                                    {item.locationName}
                                  </option>
                                ))
                            ) : (
                              <option>No warehouses available</option>
                            )}
                          </select>
                          {errors.selectedLocation && (
                            <div className="text-danger mb-2">
                              {errors.selectedLocation}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="reorderLevel" className="form-label">
                            Transfer Empties
                          </label>

                          {/* Show validation error if present */}

                          <input
                            type="number"
                            className="form-control"
                            id="transferQty"
                            placeholder="Enter transfer qty"
                            value={transferDetails.transferQty ?? ""}
                            onChange={(e) =>
                              handleModalInputChange(
                                "transferQty",
                                e.target.value
                              )
                            }
                            step="any"
                          />
                          {errors.transferQty && (
                            <div className="text-danger mb-2">
                              {errors.transferQty}
                            </div>
                          )}
                        </div>
                      </div>
                      {modalErrors && (
                        <div className="alert alert-danger mt-3" role="alert">
                          {modalErrors}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleModalSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Transfering...
                      </>
                    ) : (
                      "Transfer"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Empty Reduce Modal */}
        {showReduceEmptyModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reduce Your Empties</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseReduceModal}
                    disabled={isSubmitting}
                  ></button>
                </div>
                <div className="modal-body">
                  {selectedItem && (
                    <div>
                      <div className="row mb-3 mx-auto">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Item Code:</strong>
                          </label>
                          <p>{selectedItem.itemMaster.itemCode || "-"}</p>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Item Name:</strong>
                          </label>
                          <p>{selectedItem.itemMaster.itemName || "-"}</p>
                        </div>
                      </div>
                      <div className="row mb-3 mx-auto">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>From Location:</strong>
                          </label>
                          <p>{selectedItem.location.locationName || "-"}</p>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Empty Stock in Hand:</strong>
                          </label>
                          <p>{selectedItem.stockInHand || "-"}</p>
                        </div>
                      </div>
                      <hr />
                      <h6>Reduce Your Empties</h6>
                      <div className="row">
                        {/* <div className="col-md-6">
                          <label htmlFor="warehouse" className="form-label">
                            Select To Location Warehouse
                          </label>

                          <select
                            className="form-select"
                            id="warehouse"
                            value={transferDetails.location || ""}
                            onChange={handleToLocationChange}
                          >
                            <option value="" disabled>
                              Select a Warehouse
                            </option>
                            {companyLocations && companyLocations.length > 0 ? (
                              companyLocations
                                .filter((l) => l.locationTypeId === 2)
                                .map((item) => (
                                  <option key={item.id} value={item.locationId}>
                                    {item.locationName}
                                  </option>
                                ))
                            ) : (
                              <option>No warehouses available</option>
                            )}
                          </select>
                          {errors.selectedLocation && (
                            <div className="text-danger mb-2">
                              {errors.selectedLocation}
                            </div>
                          )}
                        </div> */}
                        <div className="col-md-6">
                          {/* <label htmlFor="reorderLevel" className="form-label">
                            Transfer Empties
                          </label> */}

                          {/* Show validation error if present */}

                          <input
                            type="number"
                            className="form-control"
                            id="transferQty"
                            placeholder="Enter Reduce qty"
                            value={transferDetails.transferQty ?? ""}
                            onChange={(e) =>
                              handleModalInputChange(
                                "transferQty",
                                e.target.value
                              )
                            }
                            step="any"
                          />
                          {errors.transferQty && (
                            <div className="text-danger mb-2">
                              {errors.transferQty}
                            </div>
                          )}
                        </div>
                      </div>
                      {modalErrors && (
                        <div className="alert alert-danger mt-3" role="alert">
                          {modalErrors}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseReduceModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleEmptyReduceModalSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Reducing ...
                      </>
                    ) : (
                      "Reduce Empties"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <ToastMessage
          show={showToast}
          onClose={() => setShowToast(false)}
          type={toastType}
          message={toastMessage}
        />
      </div>

      {/* Add Empties Modal */}
      <AddEmpties
        show={showAddEmptiesForm}
        handleClose={() => setShowAddEmptiesForm(false)}
        handleSearch={handleSearch}
      />
    </>
  );
};

export default React.memo(EmptyReturnList);
