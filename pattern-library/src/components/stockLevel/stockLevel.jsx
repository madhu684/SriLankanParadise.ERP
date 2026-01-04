import React, { useContext } from "react";
import { FaSearch } from "react-icons/fa";
import useStockLevel from "./useStockLevel";
import LoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import Pagination from "../common/Pagination/Pagination";
import { UserContext } from "../../context/userContext";

const StockLevel = () => {
  const {
    selectedLocation,
    inventories,
    currentItems,
    itemsPerPage,
    currentPage,
    loading,
    handleSearch,
    paginate,
    handleLocationChange,
    searchTerm,
    handleSearchChange,
    filteredInventories,
    showEditModal,
    selectedItem,
    modalAdjustedVolumes,
    modalErrors,
    isSubmitting,
    submissionStatus,
    handleEdit,
    handleCloseModal,
    handleModalInputChange,
    handleModalSubmit,
  } = useStockLevel();

  const { user, allLocations, userLocations, userLocationsLoading } =
    useContext(UserContext);

  const displayLocations = user?.userId === 1 ? allLocations : userLocations;

  return (
    <div className="container-sm mt-4" style={{ maxWidth: "1200px" }}>
      <h2 className="text-black fw-bold">Stock Level</h2>

      {/* Display success or error message */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Stock levels updated successfully!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error updating stock levels. Please try again.
        </div>
      )}

      <div className="mt-3 row g-3">
        <div className="col-md-3">
          <label htmlFor="warehouse" className="form-label">
            Warehouse
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
            {/* {userLocations ? (
              userLocations.map((item) => (
                <option key={item.locationId} value={item.locationId}>
                  {item.location.locationName}
                </option>
              ))
            ) : (
              <option>No warehouses available</option>
            )} */}
            {displayLocations ? (
              displayLocations.map((item) => {
                const locationId = item.locationId;
                const locationName =
                  item.location?.locationName || item.locationName;

                return (
                  <option key={locationId} value={locationId}>
                    {locationName}
                  </option>
                );
              })
            ) : (
              <option>No warehouses available</option>
            )}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          className="btn btn-success"
          onClick={() => {
            console.log("Search button clicked");
            handleSearch();
          }}
          disabled={selectedLocation === null}
        >
          Search
        </button>
      </div>

      <hr />

      <div>
        <h6 className="mt-2">Stock Information</h6>
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
                <th>UOM</th>
                <th>Stock in Hand</th>
                <th>Reorder Level</th>
                <th>Max Stock Level</th>
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
                      item.totalStockInHand < item.minReOrderLevel
                        ? "table-warning"
                        : item.totalStockInHand > item.maxStockLevel
                        ? "table-danger"
                        : ""
                    }
                  >
                    <td></td>
                    <td>{item?.itemMaster?.itemCode || "-"}</td>
                    <td>{item?.itemMaster?.itemName || "-"}</td>
                    <td>{item?.itemMaster?.unit?.unitName || "-"}</td>
                    <td>{item.totalStockInHand || "-"}</td>
                    <td>
                      {item.minReOrderLevel !== null &&
                      item.minReOrderLevel !== undefined
                        ? item.minReOrderLevel
                        : "-"}
                    </td>
                    <td>
                      {item.maxStockLevel !== null &&
                      item.maxStockLevel !== undefined
                        ? item.maxStockLevel
                        : "-"}
                    </td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
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

        <div className="mt-3">
          <p>
            <span className="badge bg-warning text-dark me-2">Yellow</span>{" "}
            Current stock is below reorder level
          </p>
          <p>
            <span className="badge bg-danger text-white me-2">Red</span> Current
            stock exceeds maximum stock level
          </p>
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
                <h5 className="modal-title">Edit Stock Levels</h5>
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
                        <p>{selectedItem?.itemMaster?.itemCode || "-"}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          <strong>Item Name:</strong>
                        </label>
                        <p>{selectedItem?.itemMaster?.itemName || "-"}</p>
                      </div>
                    </div>
                    <div className="row mb-3 mx-auto">
                      <div className="col-md-6">
                        <label className="form-label">
                          <strong>UOM:</strong>
                        </label>
                        <p>{selectedItem?.itemMaster?.unit?.unitName || "-"}</p>
                      </div>
                    </div>
                    <hr />
                    <h6>Edit Stock Levels</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <label htmlFor="reorderLevel" className="form-label">
                          Reorder Level (Edit)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="reorderLevel"
                          placeholder="Enter reorder level"
                          value={modalAdjustedVolumes.reOrderLevel ?? ""}
                          onChange={(e) =>
                            handleModalInputChange(
                              "reOrderLevel",
                              e.target.value
                            )
                          }
                          step="any"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="maxStockLevel" className="form-label">
                          Max Stock Level (Edit)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="maxStockLevel"
                          placeholder="Enter max stock level"
                          value={modalAdjustedVolumes.maxStockLevel ?? ""}
                          onChange={(e) =>
                            handleModalInputChange(
                              "maxStockLevel",
                              e.target.value
                            )
                          }
                          step="any"
                        />
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
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockLevel;
