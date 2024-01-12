import React from "react";
import useGrn from "./useGrn";

const Grn = () => {
  const {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    handleInputChange,
    handleItemDetailsChange,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
    handlePrint,
    formatDateTime,
  } = useGrn();

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <img
            src="path/to/your/logo.png"
            alt="Company Logo"
            className="img-fluid"
          />
          <p>Date and Time: {formatDateTime()}</p>
        </div>
        <h1 className="mt-2 text-center">Goods Received Note</h1>
        <hr />
      </div>

      {/* Display success or error message */}
      {submissionStatus === "success" && (
        <div className="alert alert-success mb-3" role="alert">
          Form submitted successfully!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting form. Please try again.
        </div>
      )}

      <form>
        {/* GRN Information */}
        <div className="row mb-3">
          <div className="col-md-5">
            <h4>1. GRN Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="grnDate" className="form-label">
                GRN Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.grnDate ? "is-valid" : ""
                } ${validationErrors.grnDate ? "is-invalid" : ""}`}
                id="grnDate"
                placeholder="Enter GRN date"
                value={formData.grnDate}
                onChange={(e) => handleInputChange("grnDate", e.target.value)}
                required
              />
              {validationErrors.grnDate && (
                <div className="invalid-feedback">
                  {validationErrors.grnDate}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="receivedBy" className="form-label">
                Received By
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.receivedBy ? "is-valid" : ""
                } ${validationErrors.receivedBy ? "is-invalid" : ""}`}
                id="receivedBy"
                placeholder="Enter name"
                value={formData.receivedBy}
                onChange={(e) =>
                  handleInputChange("receivedBy", e.target.value)
                }
                required
              />
              {validationErrors.receivedBy && (
                <div className="invalid-feedback">
                  {validationErrors.receivedBy}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="receivedDate" className="form-label">
                Received Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.receivedDate ? "is-valid" : ""
                } ${validationErrors.receivedDate ? "is-invalid" : ""}`}
                id="receivedDate"
                placeholder="Enter received date"
                value={formData.receivedDate}
                onChange={(e) =>
                  handleInputChange("receivedDate", e.target.value)
                }
                required
              />
              {validationErrors.receivedDate && (
                <div className="invalid-feedback">
                  {validationErrors.receivedDate}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Item Details */}
        <h4>2. Item Details</h4>
        {formData.itemDetails.length > 0 && (
          <div className="table-responsive mb-2">
            <table className="table">
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Received Quantity</th>
                  <th>Accepted Quantity</th>
                  <th>Rejected Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.itemDetails.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={item.id}
                        onChange={(e) =>
                          handleItemDetailsChange(index, "id", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.receivedQuantity}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "receivedQuantity",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.acceptedQuantity}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "acceptedQuantity",
                            e.target.value
                          )
                        }
                        max={item.receivedQuantity}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.receivedQuantity - item.acceptedQuantity}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "rejectedQuantity",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "unitPrice",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>{item.totalPrice}</td>
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
              <tfoot>
                <tr>
                  <td colSpan="4"></td>
                  <th>Total Amount</th>
                  <td colSpan="2">{formData.totalAmount}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Add button to add more items */}
        <button
          type="button"
          className="btn btn-outline-primary mb-3"
          onClick={handleAddItem}
        >
          Add Item
        </button>

        {/* Actions */}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button type="button" className="btn btn-secondary me-2">
            Save as Draft
          </button>
          <button
            type="button"
            className="btn btn-success me-2"
            onClick={handlePrint}
          >
            Print
          </button>
          <button type="button" className="btn btn-danger">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Grn;
