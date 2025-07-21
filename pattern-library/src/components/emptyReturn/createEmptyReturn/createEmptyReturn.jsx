import React, { useState, useEffect } from "react";
import { Search, Package, MapPin, Calendar } from "lucide-react";
import CreateEmptyReturnManagement from "./createEmptyReturn.js";
import { Spinner } from "react-bootstrap";
import ToastMessage from "../../toastMessage/toastMessage";

const CreateEmptyReturn = ({ selectedItems, handleClose }) => {
  const {
    warehouses,
    warehousesLoading,
    inventoryEmptyReturnItemsLoading,

    stockData,
    setStockData,
    searchBy,
    setSearchBy,
    handleSearch,
    formData,
    setFormData,
    handleInputChange,
    handleCancel,
    handleQuantityChange,
    handleSubmit,
    loading,
    setLoading,
    setToastData,
    toastData,
    handleCloseToast,
    errors,
  } = CreateEmptyReturnManagement(selectedItems);

  return (
    <div
      className="container-fluid p-3"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <ToastMessage
        show={toastData.show}
        onClose={handleCloseToast}
        type={toastData.type}
        message={toastData.message}
      />
      <div className="row justify-content-center">
        <div className="col-12">
          {/* Header */}
          <div className="card shadow-sm border-0 mb-3">
            {/* <div className="card-header bg-primary text-white py-2">
              <div className="d-flex align-items-center">
                <Package className="me-2" size={18} />
                <h5 className="mb-0">Empty Transfer</h5>
              </div>

              <div className="d-flex align-items-center">
                <h5 className="mb-0 text-end">
                  Empty Transfer count:
                  <span className="badge bg-light text-dark ms-2">
                    {selectedItems?.length > 0
                      ? selectedItems?.emptyReturnDetails?.reduce(
                          (total, item) =>
                            total + (parseFloat(item.returnQuantity) || 0),
                          0
                        )
                      : 0}
                  </span>
                </h5>
              </div>
            </div> */}

            <div className="card-header bg-primary text-white py-2">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Package className="me-2" size={18} />
                  <h5 className="mb-0">Empty Transfer</h5>
                </div>

                {/* Displaying Empty Transfer count */}
                <div className="d-flex align-items-center">
                  <h5 className="mb-0 text-end">
                    Empty Transfer count:
                    <span className="badge bg-light text-dark ms-2">
                      {formData?.emptyReturnDetails?.length > 0
                        ? formData.emptyReturnDetails?.reduce(
                            (total, item) =>
                              total + (parseFloat(item.returnQuantity) || 0),
                            0
                          )
                        : 0}
                    </span>
                  </h5>
                </div>
              </div>
            </div>

            <div className="card-body p-3">
              {/* Form Section */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-medium text-dark">
                    <MapPin size={14} className="me-1" />
                    From Location
                  </label>
                  <select
                    className="form-select"
                    name="fromLocation"
                    value={formData.fromLocation}
                    disabled
                  >
                    <option>{selectedItems.fromLocation?.locationName}</option>
                  </select>

                  {/* <select
                    className="form-select"
                    name="fromLocation"
                    value={formData.fromLocation} // Ensure the value is the locationId
                    onChange={(e) => {
                      const selectedLocationId = e.target.value;
                      const updatedLocation = warehouses.find(
                        (w) => w.location.locationId === selectedLocationId
                      );

                      // If found, update formData with the selected location object
                      if (updatedLocation) {
                        setFormData((prevData) => ({
                          ...prevData,
                          fromLocation: updatedLocation.fromLocation, // Store the full location object
                        }));
                      } else {
                        setFormData((prevData) => ({
                          ...prevData,
                          fromLocation: null, // Handle case when no location is selected
                        }));
                      }
                    }}
                  >
                    <option value="">Select a location</option>{" "}
                    {warehouses
                      .filter(
                        (w) => w.location.locationType?.name === "Warehouse"
                      )
                      .map((w) => (
                        <option
                          key={w.location.locationId}
                          value={w.location.locationId}
                        >
                          {w.location.locationName}
                        </option>
                      ))}
                  </select> */}
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium text-dark">
                    <MapPin size={14} className="me-1" />
                    To Location
                  </label>
                  <select
                    className="form-select"
                    name="toLocation"
                    value={formData.toLocation}
                    // onChange={handleInputChange}
                    onChange={(e) =>
                      handleInputChange("toLocation", parseInt(e.target.value))
                    }
                    disabled={warehousesLoading} // 🔁 Disable while loading
                  >
                    {warehousesLoading ? (
                      <option>Loading locations...</option> // ⏳ Loading state
                    ) : (
                      <>
                        <option value="">Select To Location</option>
                        {/* {warehouses
                          .filter((w) => w.locationType?.name === "Warehouse")
                          .map((w) => (
                            <option key={w.locationId} value={w.locationId}>
                              {w.locationName}
                            </option>
                          ))} */}

                        {warehouses
                          .filter(
                            (w) => w.location.locationType?.name === "Warehouse"
                          ) // ✅ filter here
                          .map((w) => (
                            <option
                              key={w.location.locationId}
                              value={w.location.locationId}
                            >
                              {w.location.locationName}
                            </option>
                          ))}
                      </>
                    )}
                  </select>
                  {errors.toLocation && (
                    <div className="text-danger">{errors.toLocation}</div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium text-dark">
                    <Calendar size={14} className="me-1" />
                    Transfer Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="transferDate"
                    value={formData.transferDate}
                    // onChange={handleInputChange}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleInputChange("transferDate", e.target.value)
                    }
                  />
                  {errors.transferDate && (
                    <div className="text-danger">{errors.transferDate}</div>
                  )}
                </div>
              </div>

              {/* Search Button */}
              {/* <div className="d-flex justify-content-center mb-3">
                <button
                  className="btn btn-success px-4 py-2 me-3"
                  onClick={handleSearch}
                  disabled={!formData.fromLocation}
                >
                  <Search size={16} className="me-2" />
                  Search Empties
                </button>
                <button
                  className="btn btn-danger px-4 py-2"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div> */}
            </div>
          </div>

          {/* Stock Information Section */}

          <div className="card shadow-sm border-0 mb-3">
            <div className="card-header bg-info text-white py-2">
              <div className="d-flex align-items-center justify-content-between">
                <h6 className="mb-0">Empty Return Information</h6>
                {/* <div className="input-group" style={{ maxWidth: "250px" }}>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search by item name"
                      value={searchBy}
                      onChange={(e) => setSearchBy(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-light btn-sm"
                      type="button"
                    >
                      <Search size={14} />
                    </button>
                  </div> */}
              </div>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th className="py-2 px-3 fw-medium">Item Code</th>
                      <th className="py-2 px-3 fw-medium">Item Name</th>
                      <th className="py-2 px-3 fw-medium">Unit Price</th>
                      <th className="py-2 px-3 fw-medium">Added Quantity</th>
                      <th className="py-2 px-3 fw-medium">Transfer Quantity</th>
                      <th className="py-2 px-3 fw-medium">
                        Total Return Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.emptyReturnDetails?.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">
                          No empty return items available
                        </td>
                      </tr>
                    ) : (
                      formData?.emptyReturnDetails?.map((item, index) => (
                        <tr key={index} className="align-middle">
                          {/* Item Code */}
                          <td className="px-3 py-2">
                            <span className="badge bg-primary">
                              {item.itemMaster.itemCode} {/* Bind itemCode */}
                            </span>
                          </td>

                          {/* Item Name */}
                          <td className="px-3 py-2">
                            {item.itemMaster.itemName} {/* Bind itemName */}
                          </td>

                          {/* Unit Price */}
                          <td className="px-3 py-2">
                            <span className="badge bg-light text-dark">
                              {item.itemMaster.unitPrice} {/* Bind unitPrice */}
                            </span>
                          </td>

                          <td className="px-3 py-2">
                            <span className="badge bg-light text-dark">
                              {item.addedQuantity} {/* Bind unitPrice */}
                            </span>
                          </td>

                          {/* Transfer Quantity */}
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              placeholder="Enter quantity"
                              //value={returnQuantity || ""}
                              onChange={(e) =>
                                handleQuantityChange(index, e.target.value)
                              }
                              min="0"
                              max={item.addedQuantity}
                              style={{ minWidth: "120px" }}
                            />
                            {errors.transferQuantity && (
                              <div className="text-danger">
                                {errors.transferQuantity}
                              </div>
                            )}
                          </td>

                          <td className="px-3 py-2">
                            <span className="badge bg-success">
                              {/* Calculate Total Return Value */}
                              {(item.returnQuantity || 0) *
                                item.itemMaster.unitPrice}
                            </span>
                          </td>
                          {/* Unit Price */}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-center py-2 bg-light">
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li className="page-item active">
                      <span className="page-link bg-primary border-primary">
                        1
                      </span>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          {/* Action Buttons */}

          <div className="card shadow-sm border-0">
            <div className="card-body p-3">
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-outline-secondary px-4 py-2"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary px-4 py-2"
                  onClick={handleSubmit}
                  disabled={loading} // Disable the button while loading
                >
                  {loading ? (
                    // Show spinner when loading
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Submit Return"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEmptyReturn;
