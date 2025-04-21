import React from "react";
import { Modal, Button } from "react-bootstrap";
import useManageItem from "./useManageItem";
import LoadingSpinner from "../../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../../errorComponent/errorComponent";

const ManageItem = ({ show, handleClose, item }) => {
  const {
    formData,
    subItems,
    isLoadingsubItems,
    issubItemsError,
    validFields,
    validationErrors,
    units,
    isUnitsLoading,
    isUnitsError,
    measurementTypes,
    isMeasurementTypesLoading,
    isMeasurementTypesError,
    availableConvertibleQuantities,
    handleConvertToSubItem,
    handleInputChange,
  } = useManageItem(item);
  console.log(subItems);
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Manage Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {issubItemsError && <ErrorComponent error={"Error fetching data"} />}
        {isLoadingsubItems && <LoadingSpinner maxHeight="65vh" />}
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">Item Details</div>
                <div className="card-body">
                  <div className="row mb-2">
                    <div className="col-6">
                      <strong>Item Name:</strong>
                    </div>
                    <div className="col-6">{item?.item?.itemName}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6">
                      <strong>Unit:</strong>
                    </div>
                    <div className="col-6">{item?.item?.unit.unitName}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6">
                      <strong>Received Quantity:</strong>
                    </div>
                    <div className="col-6">{item?.receivedQuantity}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6">
                      <strong>Free Quantity:</strong>
                    </div>
                    <div className="col-6">{item?.freeQuantity}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6">
                      <strong>Item Barcode:</strong>
                    </div>
                    <div className="col-6">
                      {item?.itemBarcode}
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6">
                      <strong>Unit Price:</strong>
                    </div>
                    <div className="col-6">{item?.unitPrice.toFixed(2)}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6">
                      <strong>Cost Price:</strong>
                    </div>
                    <div className="col-6">{item?.costPrice.toFixed(2)}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6">
                      <strong>Selling Price:</strong>
                    </div>
                    <div className="col-6">{item?.sellingPrice.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <h5 className="mt-3">Fundamental Unit</h5>
              <div className="mb-3 mt-3">
                <label htmlFor="measurementType" className="form-label">
                  Measurement Type
                </label>
                <select
                  className={`form-select ${
                    validFields.measurementType ? "is-valid" : ""
                  } ${validationErrors.measurementType ? "is-invalid" : ""}`}
                  id="measurementType"
                  value={formData.measurementType}
                  onChange={(e) =>
                    handleInputChange("measurementType", e.target.value)
                  }
                  required
                >
                  <option value="">Select measurement Type</option>
                  {/* Assuming you have an array of measurement types */}
                  {measurementTypes?.map((type) => (
                    <option
                      key={type.measurementTypeId}
                      value={type.measurementTypeId}
                    >
                      {type.name}
                    </option>
                  ))}
                </select>
                {validationErrors.measurementType && (
                  <div className="invalid-feedback">
                    {validationErrors.measurementType}
                  </div>
                )}
              </div>

              <div className="mb-3 mt-3">
                <label htmlFor="unitId" className="form-label">
                  Unit
                </label>
                <select
                  className={`form-select ${
                    validFields.unitId ? "is-valid" : ""
                  } ${validationErrors.unitId ? "is-invalid" : ""}`}
                  id="unitId"
                  value={formData.unitId}
                  onChange={(e) => handleInputChange("unitId", e.target.value)}
                  required
                  disabled={formData.measurementType === ""}
                >
                  <option value="">Select Unit</option>
                  {units
                    ?.filter(
                      (u) =>
                        u.measurementTypeId ===
                        parseInt(formData.measurementType)
                    )
                    .map((unit) => (
                      <option key={unit.unitId} value={unit.unitId}>
                        {unit.unitName}
                      </option>
                    ))}
                </select>
                {validationErrors.unitId && (
                  <div className="invalid-feedback">
                    {validationErrors.unitId}
                  </div>
                )}
              </div>
              {formData.unitId && item?.item?.unit.unitName && (
                <div className="mb-3 mt-3">
                  <label htmlFor="conversionValue" className="form-label">
                    How many{" "}
                    <span className="fw-bold text-primary">
                      {units
                        .find((u) => u.unitId === parseInt(formData.unitId))
                        .unitName.toLowerCase()}
                    </span>{" "}
                    in one {/* {item.item.itemName.toLowerCase()}{" "} */}
                    <span className="fw-bold text-primary">
                      {item?.item?.unit.unitName.toLowerCase()}
                    </span>
                    ?
                  </label>
                  <input
                    type="number"
                    className={`form-control ${
                      validFields.conversionValue ? "is-valid" : ""
                    } ${validationErrors.conversionValue ? "is-invalid" : ""}`}
                    id="conversionValue"
                    value={formData.conversionValue}
                    onChange={(e) =>
                      handleInputChange("conversionValue", e.target.value)
                    }
                    required
                  />

                  {validationErrors.conversionValue && (
                    <div className="invalid-feedback">
                      {validationErrors.conversionValue}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <h5 className="mt-3">Convert this item to its sub items</h5>

          <p>Sub Items</p>
          <ul className="list-group">
            {subItems?.map((subItem, index) => (
              <li key={index} className="list-group-item">
                <strong>{subItem.itemName}</strong>

                {formData.unitId && subItem?.unit.unitName && (
                  <div className="mb-3 mt-3">
                    <label
                      htmlFor={`conversionValue-${subItem.itemMasterId}`}
                      className="form-label"
                    >
                      How many{" "}
                      <span className="fw-bold text-primary">
                        {units
                          .find((u) => u.unitId === parseInt(formData.unitId))
                          .unitName.toLowerCase()}
                      </span>{" "}
                      in one {/* {subItem.itemName.toLowerCase()}{" "} */}
                      <span className="fw-bold text-primary">
                        {subItem?.unit.unitName.toLowerCase()}
                      </span>
                      ?
                    </label>
                    <input
                      type="number"
                      className={`form-control ${
                        validFields[`conversionValue-${subItem.itemMasterId}`]
                          ? "is-valid"
                          : ""
                      } ${
                        validationErrors[
                          `conversionValue-${subItem.itemMasterId}`
                        ]
                          ? "is-invalid"
                          : ""
                      }`}
                      id={`conversionValue-${subItem.itemMasterId}`}
                      value={
                        formData[`conversionValue-${subItem.itemMasterId}`]
                      }
                      onChange={(e) =>
                        handleInputChange(
                          `conversionValue-${subItem.itemMasterId}`,
                          e.target.value
                        )
                      }
                      required
                    />
                    {validationErrors[
                      `conversionValue-${subItem.itemMasterId}`
                    ] && (
                      <div className="invalid-feedback">
                        {
                          validationErrors[
                            `conversionValue-${subItem.itemMasterId}`
                          ]
                        }
                      </div>
                    )}
                  </div>
                )}
                <div>
                  Convertible Quantity:{" "}
                  {/* {
                    availableConvertibleQuantities[index]
                      ?.convertibleQuantity
                  } */}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ManageItem;
