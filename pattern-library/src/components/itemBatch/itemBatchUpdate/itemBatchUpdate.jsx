import React from "react";
import useItemBatchUpdate from "./useItemBatchUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useCompanyLogoUrl from "../../companyLogo/useCompanyLogoUrl";
import ConfirmationModal from "../../confirmationModals/confirmationModal/confirmationModal";

const ItemBatchUpdate = ({ handleClose, handleUpdated }) => {
  const {
    formData,
    itemBatches,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    isError,
    isLoading,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    loading,
    selectedBatch,
    showConfirmationModalInParent,
    showConfirmationModal,
    handleInputChange,
    handleSubmit,
    handleReset,
    handlePrint,
    setSearchTerm,
    handleSelectItem,
    handleBatchSelection,
    handleShowConfirmationModal,
    handleCloseConfirmationModal,
  } = useItemBatchUpdate({
    onFormSubmit: () => {},
  });

  //const companyLogoUrl = useCompanyLogoUrl();

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-end">
          {/* <img src={companyLogoUrl} alt="Company Logo" height={30} /> */}
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Item Batch Update</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Item batch updated successfully!
        </div>
      )}
      {submissionStatus === "successSubmittedAll" && (
        <div className="alert alert-success mb-3" role="alert">
          All item batches updated successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Item batch saved as draft, you can edit and submit it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error updating item batch. Please try again.
        </div>
      )}

      <form>
        <div className="row g-3 mb-3 d-flex justify-content-between">
          <div className="col-md-5"></div>
        </div>

        {/* Item Batch Details */}
        <h4>1. Item Batch Details</h4>

        <div className="col-md-5">
          {/* Item Search */}
          <div className="mb-3 mt-3">
            <div className="input-group">
              <span className="input-group-text bg-transparent">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search for an item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <span
                  className="input-group-text bg-transparent"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => setSearchTerm("")}
                >
                  <i className="bi bi-x"></i>
                </span>
              )}
            </div>
            {/* Dropdown for filtered items */}
            {searchTerm && (
              <div className="dropdown" style={{ width: "100%" }}>
                <ul
                  className="dropdown-menu"
                  style={{
                    display: "block",
                    width: "100%",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {isItemsLoading ? (
                    <li className="dropdown-item">
                      <ButtonLoadingSpinner text="Searching..." />
                    </li>
                  ) : isItemsError ? (
                    <li className="dropdown-item">
                      Error: {itemsError.message}
                    </li>
                  ) : availableItems === null || availableItems.length === 0 ? (
                    <li className="dropdown-item">
                      <span className="me-3">
                        <i className="bi bi-emoji-frown"></i>
                      </span>
                      No items found
                    </li>
                  ) : (
                    availableItems.map((item) => (
                      <li key={item.itemMasterId}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleSelectItem(item)}
                        >
                          <span className="me-3">
                            <i className="bi bi-cart4"></i>
                          </span>
                          {item.itemCode} - {item.itemName}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}

            {formData.id === 0 && (
              <div className="mb-3">
                <small className="form-text text-muted">
                  Please search for an item to update
                </small>
              </div>
            )}
            {formData.id !== 0 && (
              <div className="mb-3">
                <p className="form-text text-muted">
                  Selected item: {formData.name}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-5">
          <div className="mb-3">
            <label htmlFor="batchSelection">Select Batch</label>
            <select
              id="batchSelection"
              className="form-select mt-2"
              onChange={handleBatchSelection}
              value={selectedBatch?.BatchId}
              disabled={!itemBatches}
            >
              <option value="">Select Batch</option>
              {isLoading ? (
                <option disabled>Loading...</option>
              ) : isError ? (
                <option disabled>Error fetching batches</option>
              ) : (
                itemBatches?.map((batch) => (
                  <option key={batch.batchId} value={batch.batchId}>
                    {batch.batch.batchRef}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {!itemBatches && formData.id !== 0 && (
          <div className="mb-3">
            <small className="form-text  text-danger">
              Selected item does not have any associated item batches. Please
              select another item
            </small>
          </div>
        )}

        {selectedBatch !== null && (
          <div className="table-responsive mb-2">
            <table className="table mt-2">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Unit</th>
                  <th>Batch Ref</th>
                  <th>Cost Price</th>
                  <th>Selling Price</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{formData.name}</td>
                  <td>{formData.unit}</td>
                  <td>{selectedBatch?.batch.batchRef}</td>
                  <td>{selectedBatch?.costPrice?.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      className={`form-control ${
                        validFields.sellingPrice ? "is-valid" : ""
                      } ${validationErrors.sellingPrice ? "is-invalid" : ""}`}
                      value={formData.sellingPrice}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) =>
                        handleInputChange("sellingPrice", e.target.value)
                      }
                      required
                    />
                    {validationErrors.sellingPrice && (
                      <div className="invalid-feedback">
                        {validationErrors.sellingPrice}
                      </div>
                    )}
                  </td>
                  <td>
                    <input
                      type="date"
                      className={`form-control ${
                        validFields.expiryDate ? "is-valid" : ""
                      } ${validationErrors.expiryDate ? "is-invalid" : ""}`}
                      value={formData.expiryDate}
                      onChange={(e) =>
                        handleInputChange("expiryDate", e.target.value)
                      }
                      required
                    />
                    {validationErrors.expiryDate && (
                      <div className="invalid-feedback">
                        {validationErrors.expiryDate}
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Actions */}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={handleShowConfirmationModal} //() => handleSubmit(false)
            disabled={
              selectedBatch === null ||
              formData.id === 0 ||
              loading ||
              submissionStatus !== null
            }
          >
            {loading && submissionStatus === null ? (
              <ButtonLoadingSpinner text="Updating..." />
            ) : (
              "Update"
            )}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleReset}
            disabled={
              selectedBatch === null || loading || submissionStatus !== null
            }
          >
            Reset
          </button>
        </div>
      </form>
      {showConfirmationModalInParent && (
        <ConfirmationModal
          show={showConfirmationModal}
          handleClose={() => {
            handleSubmit(false, false);
            handleCloseConfirmationModal();
          }}
          handleConfirm={() => {
            handleSubmit(false, true);
            handleCloseConfirmationModal();
          }}
          title="Update Confirmation"
          message="Do you want to update all batches for this item to maintain a same selling price?"
          confirmButtonText="Update All Batches"
          cancelButtonText="No"
        />
      )}
    </div>
  );
};

export default ItemBatchUpdate;
