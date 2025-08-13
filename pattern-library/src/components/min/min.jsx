import React, { useEffect, useState } from "react";
import useMin from "./useMin";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import moment from "moment";
import "moment-timezone";

const Min = ({ handleClose, handleUpdated, setShowCreateMinForm }) => {
  const {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    selectedMrn,
    mrns,
    statusOptions,
    alertRef,
    searchByMrn,
    searchByWithoutMrn,
    isLoading,
    isError,
    mrnSearchTerm,
    loading,
    loadingDraft,
    itemBatches,
    isItemBatchesLoading,
    isItemBatchesError,
    isLocationInventoriesLoading,
    isLocationInventoriesError,
    locationInventories,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    setSearchByMrn,
    setSearchByWithoutMrn,
    handleInputChange,
    handleItemDetailsChange,
    handleRemoveItem,
    handleSubmit,
    handlePrint,
    handleMrnChange,
    handleStatusChange,
    setMrnSearchTerm,
    handleResetMrn,
    setSearchTerm,
    handleModeChange,
    handleAddDummyItem,
  } = useMin({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  if (isLoading || isItemBatchesLoading) {
    return <LoadingSpinner />;
  }

  if (isError || isItemBatchesError) {
    return <ErrorComponent error={"Error fetching data"} />;
  }

  const handleBack = () => {
    setShowCreateMinForm(false);
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          <i
            className="bi bi-arrow-left btn btn-dark d-flex align-items-center justify-content-center"
            onClick={handleClose}
          ></i>
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Material Issue Note</h1>
        <hr />
      </div>

      {/* Display success or error message */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Material issue note submitted successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Material issue note saved as draft, you can edit and submit it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting Material issue note. Please try again.
        </div>
      )}

      <form>
        {/* 1. MIN Information */}
        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            <h4>1. MIN Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                className={`form-select ${
                  validFields.status ? "is-valid" : ""
                } ${validationErrors.status ? "is-invalid" : ""}`}
                value={formData.status}
                onChange={(e) =>
                  handleStatusChange(
                    statusOptions.find((option) => option.id === e.target.value)
                  )
                }
                required
              >
                <option value="">Select Status</option>
                {statusOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {validationErrors.status && (
                <div className="invalid-feedback">
                  {validationErrors.status}
                </div>
              )}
            </div>
          </div>

          {/* 2. Material Requisition Details */}
          <div className="col-md-5">
            <h4>2. Material Requisition Details</h4>
            {/* Modified checkbox logic */}
            <div className="mb-3 mt-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="searchByMrn"
                checked={searchByMrn}
                onChange={() => handleModeChange("mrn")}
              />
              <label className="form-check-label" htmlFor="searchByMrn">
                Search Using MRN
              </label>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="searchByWithoutMrn"
                checked={searchByWithoutMrn}
                onChange={() => handleModeChange("withoutMrn")}
              />
              <label className="form-check-label" htmlFor="searchByWithoutMrn">
                Search By Without MRN
              </label>
            </div>
            {/* Show Material Requisition search bar only if searchByMrn is true */}
            {searchByMrn && (
              <div className="mt-3">
                <label htmlFor="materialRequisition" className="form-label">
                  Material Requisition
                </label>
                {/* ... keep existing search input logic ... */}
                {/* (unchanged code for MRN search bar remains here) */}
                {selectedMrn === null && (
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control ${
                          validFields.mrnId ? "is-valid" : ""
                        } ${validationErrors.mrnId ? "is-invalid" : ""}`}
                        placeholder="Search for a material requisition..."
                        value={mrnSearchTerm}
                        onChange={(e) => setMrnSearchTerm(e.target.value)}
                        autoFocus={false}
                      />
                      {mrnSearchTerm && (
                        <span
                          className="input-group-text bg-transparent"
                          style={{ cursor: "pointer" }}
                          onClick={() => setMrnSearchTerm("")}
                        >
                          <i className="bi bi-x"></i>
                        </span>
                      )}
                    </div>

                    {/* Dropdown for filtered MRNs */}
                    {mrnSearchTerm && (
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
                          {mrns
                            .filter((mrn) =>
                              mrn.referenceNumber
                                ?.replace(/\s/g, "")
                                ?.toLowerCase()
                                .includes(
                                  mrnSearchTerm.toLowerCase().replace(/\s/g, "")
                                )
                            )
                            .map((mrn) => (
                              <li key={mrn.requisitionMasterId}>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    handleMrnChange(mrn.referenceNumber)
                                  }
                                >
                                  <span className="me-3">
                                    <i className="bi bi-file-earmark-text"></i>
                                  </span>
                                  {mrn.referenceNumber}
                                </button>
                              </li>
                            ))}
                          {mrns.filter((mrn) =>
                            mrn.referenceNumber
                              ?.replace(/\s/g, "")
                              ?.toLowerCase()
                              .includes(
                                mrnSearchTerm.toLowerCase().replace(/\s/g, "")
                              )
                          ).length === 0 && (
                            <li className="dropdown-item text-center">
                              <span className="me-3">
                                <i className="bi bi-emoji-frown"></i>
                              </span>
                              No material requisitions found
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {selectedMrn === null && (
                      <div className="mb-3">
                        <small className="form-text text-muted">
                          {validationErrors.mrnId && (
                            <div className="text-danger mb-1">
                              {validationErrors.mrnId}
                            </div>
                          )}
                          Please search for a material requisition and select it
                        </small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div>
              {selectedMrn && (
                <div className="card mb-3">
                  <div className="card-header">
                    Selected Material Requisition
                  </div>
                  <div className="card-body">
                    <p>
                      Material Requisition Reference No:{" "}
                      {selectedMrn.referenceNumber}
                    </p>
                    <p>Requested By: {selectedMrn.requestedBy}</p>
                    <p>
                      MRN Date:{" "}
                      {moment
                        .utc(selectedMrn.requisitionDate)
                        .tz("Asia/Colombo")
                        .format("YYYY-MM-DD hh:mm:ss A")}
                    </p>
                    <p>
                      Delivery Location:{" "}
                      {selectedMrn.requestedToLocation.locationName}
                    </p>
                    <p>
                      Requested From:{" "}
                      {selectedMrn.requestedFromLocation.locationName}
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline-danger float-end"
                      onClick={handleResetMrn}
                    >
                      Reset Material Requisition
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* {selectedMrn && (
            <div className="card mb-3">
              <div className="card-header">Selected Material Requisition</div>
              <div className="card-body">
                <p>
                  Material Requisition Reference No:{" "}
                  {selectedMrn.referenceNumber}
                </p>
                <p>Requested By: {selectedMrn.requestedBy}</p>
                <p>
                  MRN Date:{" "}
                  {moment
                    .utc(selectedMrn.requisitionDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
                <p>
                  Delivery Location:{" "}
                  {selectedMrn.requestedToLocation.locationName}
                </p>
                <p>
                  Warehouse Location:{" "}
                  {selectedMrn.requestedFromLocation.locationName}
                </p>
                <button
                  type="button"
                  className="btn btn-outline-danger float-end"
                  onClick={handleResetMrn}
                >
                  Reset Material Requisition
                </button>
              </div>
            </div>
          )} */}
        </div>
        {selectedMrn === null && (
          <div className="mb-3">
            <small className="form-text text-muted">
              Please select a material requisition to add item details.
            </small>
          </div>
        )}
        {selectedMrn !== null && formData.itemDetails.length === 0 && (
          <div className="mb-3">
            <small className="form-text text-danger">
              Selected material requisition has no remaining items to issue.
            </small>
          </div>
        )}
        {/* Show Item Details only if searchByWithoutMrn is selected */}
        {searchByWithoutMrn && (
          <div className="row mb-3 d-flex justify-content-between">
            <div className="col-md-5">
              <div className="mt-3">
                <label className="form-label">Search Item</label>
                <div
                  className="input-group mb-2"
                  style={{ width: "100%", maxWidth: "100%" }}
                >
                  <span
                    className="input-group-text bg-transparent"
                    style={{ width: "40px" }}
                  >
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for an item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: "1" }}
                  />
                  {searchTerm && (
                    <span
                      className="input-group-text bg-transparent"
                      style={{ width: "40px", cursor: "pointer" }}
                      onClick={() => setSearchTerm("")}
                    >
                      <i className="bi bi-x"></i>
                    </span>
                  )}
                </div>
                {isItemsLoading && <LoadingSpinner />}
                {isItemsError && (
                  <ErrorComponent error="Error fetching items" />
                )}
                {availableItems?.length > 0 ? (
                  <ul className="list-group mb-3">
                    {availableItems.map((item, idx) => (
                      <li
                        key={idx}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        onClick={() => handleAddDummyItem(item)}
                        style={{ cursor: "pointer" }} // Indicate clickable behavior
                      >
                        <span>{item.itemName}</span>
                      </li>
                    ))}
                  </ul>
                ) : searchTerm ? (
                  <div className="text-muted">No matching items found.</div>
                ) : null}
              </div>
            </div>
          </div>
        )}
        <h4>3. Item Details</h4>
        {/* {console.log('formdata: ', formData)} */}
        {formData.itemDetails.length > 0 && (
          <div className="table-responsive mb-2">
            <table className="table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Unit</th>
                  {searchByMrn && formData.mrnId && <th>Requested Quantity</th>}
                  <th>Stock In Hand</th>
                  <th>Item Batch</th>
                  <th>Dispatched Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.itemDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.unit}</td>
                    {searchByMrn && formData.mrnId && <td>{item.quantity}</td>}
                    <td>{item.remainingQuantity}</td>
                    <td>
                      <select
                        className="form-select"
                        value={item.batchId}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "batchId",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select item batch</option>
                        {locationInventories
                          ?.filter((i) => i.itemMasterId === item.id)
                          ?.map((i, batchIndex) => (
                            <option
                              key={batchIndex}
                              value={i.batchId}
                              disabled={i.stockInHand === 0}
                            >
                              {i.itemBatch.batch.batchRef}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        max={item.remainingQuantity}
                        className={`form-control ${
                          validFields[`issuedQuantity_${index}`]
                            ? "is-valid"
                            : ""
                        } ${
                          validationErrors[`issuedQuantity_${index}`]
                            ? "is-invalid"
                            : ""
                        }`}
                        value={item.issuedQuantity}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "issuedQuantity",
                            e.target.value
                          )
                        }
                        placeholder={`1 - ${item.remainingQuantity}`}
                      />
                      {validationErrors[`issuedQuantity_${index}`] && (
                        <div className="invalid-feedback">
                          {validationErrors[`issuedQuantity_${index}`]}
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Actions */}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={() => handleSubmit(false)}
            disabled={
              !formData.itemDetails.length > 0 ||
              loading ||
              loadingDraft ||
              submissionStatus !== null
            }
          >
            {loading && submissionStatus === null ? (
              <ButtonLoadingSpinner text="Submitting..." />
            ) : (
              "Submit"
            )}
          </button>
          <button
            type="button"
            className="btn btn-success me-2"
            onClick={handlePrint}
            disabled={loading || loadingDraft || submissionStatus !== null}
          >
            Print
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClose}
            disabled={loading || loadingDraft || submissionStatus !== null}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Min;
