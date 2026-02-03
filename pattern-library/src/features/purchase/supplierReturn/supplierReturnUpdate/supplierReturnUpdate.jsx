import React from "react";
import useSupplierReturnUpdate from "./useSupplierReturnUpdate";
import ButtonLoadingSpinner from "common/components/loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import ErrorComponent from "common/components/errorComponent/errorComponent";
import CurrentDateTime from "common/components/currentDateTime/currentDateTime";

const SupplierReturnUpdate = ({
  handleClose,
  supplyReturnMaster,
  setShowUpdateSRForm,
}) => {
  const {
    formData,
    suppliers,
    isLoadingSuppliers,
    isErrorSuppliers,
    errorSuppliers,
    supplierSearchTerm,
    batches,
    isLoadingBatches,
    isErrorBatches,
    errorBatches,
    searchTerm,
    validFields,
    validationErrors,
    loading,
    loadingFormData,
    isFormDataError,
    formDataError,
    submissionStatus,
    alertRef,
    setSupplierSearchTerm,
    setSearchTerm,
    handleSelectSupplier,
    handleSelectBatch,
    handleResetSupplier,
    handleInputChange,
    handleRemoveItem,
    handleItemDetailsChange,
    handleSubmit,
  } = useSupplierReturnUpdate({
    supplyReturnMaster,
    onFormSubmit: () => handleClose(),
  });

  if (isLoadingSuppliers || isLoadingBatches || loadingFormData) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <ButtonLoadingSpinner />
      </div>
    );
  }

  if (isErrorSuppliers || isErrorBatches || isFormDataError) {
    return (
      <ErrorComponent error={errorSuppliers || errorBatches || formDataError} />
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          {/* <img src={companyLogoUrl} alt="Company Logo" height={30} /> */}
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Supplier Return Update</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Supply Return submitted successfully! Reference Number:{" "}
          {formData.referenceNo}
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting supply Return. Please try again.
        </div>
      )}

      <form>
        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            <h4>1. Supplier Details</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="grnDate" className="form-label">
                Select Supplier
              </label>
              <div className="input-group mb-1">
                <span className="input-group-text bg-transparent ">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className={`form-control ${
                    validFields.supplierId ? "is-valid" : ""
                  } ${validationErrors.supplierId ? "is-invalid" : ""}`}
                  placeholder="Search for a Supplier..."
                  value={supplierSearchTerm}
                  onChange={(e) => setSupplierSearchTerm(e.target.value)}
                />
                {supplierSearchTerm && (
                  <span
                    className="input-group-text bg-transparent"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => setSupplierSearchTerm("")}
                  >
                    <i className="bi bi-x"></i>
                  </span>
                )}
              </div>

              {/* Dropdown for filtered suppliers */}
              {supplierSearchTerm && (
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
                    {suppliers
                      .filter(
                        (supplier) =>
                          supplier.supplierName
                            .toLowerCase()
                            .includes(supplierSearchTerm.toLowerCase()) ||
                          supplier.phone
                            .replace(/\s/g, "")
                            .includes(supplierSearchTerm.replace(/\s/g, ""))
                      )
                      .map((supplier) => (
                        <li key={supplier.supplierId}>
                          <button
                            className="dropdown-item"
                            onClick={() => handleSelectSupplier(supplier)}
                          >
                            <span className="me-3">
                              <i className="bi-person-lines-fill"></i>
                            </span>{" "}
                            {supplier?.supplierName} - {supplier?.phone}
                          </button>
                        </li>
                      ))}
                    {suppliers.filter(
                      (supplier) =>
                        supplier.supplierName
                          .toLowerCase()
                          .includes(supplierSearchTerm.toLowerCase()) ||
                        supplier.phone
                          .replace(/\s/g, "")
                          .includes(supplierSearchTerm.replace(/\s/g, ""))
                    ).length === 0 && (
                      <li className="dropdown-item text-center">
                        <span className="me-3">
                          <i className="bi bi-emoji-frown"></i>
                        </span>
                        No Suppliers found
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Error Message */}
              {formData.selectedSupplier === "" && (
                <div className="mb-3">
                  <small className="form-text text-muted">
                    {validationErrors.supplierId && (
                      <div className="text-danger mb-1">
                        {validationErrors.supplierId}
                      </div>
                    )}
                    Please search for a customer and select it
                  </small>
                </div>
              )}

              {/* Supplier Details */}
              {formData.selectedSupplier && (
                <div className="card mb-3">
                  <div className="card-header">Selected Supplier</div>
                  <div className="card-body">
                    <p>
                      Supplier Name: {formData.selectedSupplier.supplierName}
                    </p>
                    <p>
                      Contact Person:{" "}
                      {formData.selectedSupplier.contactPerson || "-"}
                    </p>
                    <p>Contact No: {formData.selectedSupplier.phone}</p>
                    <p>Email: {formData.selectedSupplier.email}</p>
                    <button
                      type="button"
                      className="btn btn-outline-danger float-end"
                      onClick={handleResetSupplier}
                    >
                      Reset Supplier
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-5">
            <h4>2. Return Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="grnDate" className="form-label">
                Return Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.returnDate ? "is-valid" : ""
                } ${validationErrors.returnDate ? "is-invalid" : ""}`}
                id="returnDate"
                value={formData.returnDate}
                onChange={(e) =>
                  handleInputChange("returnDate", e.target.value)
                }
                required
              />
              {validationErrors.returnDate && (
                <div className="invalid-feedback">
                  {validationErrors.returnDate}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Item Details */}
        <h4>3. Item Details</h4>

        <div className="col-md-5">
          <div className="mb-3 mt-5">
            <label htmlFor="batchId" className="form-label">
              Select Batch
            </label>
            <div className="input-group mb-3">
              <span className="input-group-text bg-transparent ">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                // className={`form-control ${
                //   validFields.purchaseOrderId ? "is-valid" : ""
                // } ${
                //   validationErrors.purchaseOrderId ? "is-invalid" : ""
                // }`}
                placeholder="Search for a Batch..."
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

            {/* Dropdown for filtered batches */}
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
                  {(batches ?? [])
                    .filter(
                      (batch) =>
                        batch.batchRef
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase()) &&
                        !formData.selectedBatch.some(
                          (selected) => selected.batchId === batch.batchId
                        )
                    )
                    .map((batch) => (
                      <li key={batch.batchId}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleSelectBatch(batch)}
                        >
                          <span className="me-3">
                            <i className="bi bi-basket2-fill"></i>
                          </span>{" "}
                          {batch?.batchRef}
                        </button>
                      </li>
                    ))}

                  {/* Handle case when no matching batches are found */}
                  {(batches ?? []).filter(
                    (batch) =>
                      batch.batchRef
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) &&
                      !formData.selectedBatch.some(
                        (selected) => selected.batchId === batch.batchId
                      )
                  ).length === 0 && (
                    <li className="dropdown-item text-center">
                      <span className="me-3">
                        <i className="bi bi-emoji-frown"></i>
                      </span>
                      No Batches found
                    </li>
                  )}
                </ul>
              </div>
            )}

            {formData.selectedBatch.length === 0 && (
              <div className="mb-3">
                <small className="form-text text-muted">
                  Please search for a batch
                </small>
              </div>
            )}

            {formData.selectedBatch.length > 0 &&
              formData.itemDetails.length === 0 && (
                <div className="mb-3">
                  <small className="form-text text-danger">
                    Selected Batch does not have any items
                  </small>
                </div>
              )}
          </div>
        </div>

        {formData.itemDetails.length > 0 && (
          <div className="table-responsive mb-2">
            <table
              className="table"
              style={{ minWidth: "1000px", overflowX: "auto" }}
            >
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Batch</th>
                  <th>Unit</th>
                  <th>Stock In hand</th>
                  <th>Return Quantity</th>
                  <th>Warehouse</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.itemDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.itemName}</td>
                    <td>{item.batchRef}</td>
                    <td>{item.unit}</td>
                    <td>{item.stockInHand}</td>
                    <td>
                      <input
                        type="number"
                        className={`form-control ${
                          validFields[`returnQuantity_${index}`]
                            ? "is-valid"
                            : ""
                        } ${
                          validationErrors[`returnQuantity_${index}`]
                            ? "is-invalid"
                            : ""
                        }`}
                        value={item.returnQuantity}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "returnQuantity",
                            e.target.value
                          )
                        }
                      />
                      {validationErrors[`returnQuantity_${index}`] && (
                        <div className="invalid-feedback">
                          {validationErrors[`returnQuantity_${index}`]}
                        </div>
                      )}
                    </td>
                    <td>{item.locationName}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleRemoveItem(index, item)}
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
            onClick={() => handleSubmit()}
            disabled={!formData.itemDetails.length > 0 || loading}
          >
            {loading && submissionStatus === null ? (
              <ButtonLoadingSpinner text="Submitting..." />
            ) : (
              "Update and Submit"
            )}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClose}
            disabled={loading || submissionStatus !== null}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierReturnUpdate;













