import React from "react";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import useSupplierReturn from "./useSupplierReturn";

const SupplierReturn = () => {
  const {
    formData,
    suppliers,
    isLoadingSuppliers,
    isErrorSuppliers,
    errorSuppliers,
    supplierSearchTerm,
    setSupplierSearchTerm,
    handleSelectSupplier,
    handleResetSupplier,
    handleInputChange,
  } = useSupplierReturn();
  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div
        // ref={alertRef}
        ></div>
        <div className="d-flex justify-content-between">
          {/* <img src={companyLogoUrl} alt="Company Logo" height={30} /> */}
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Supplier Return</h1>
        <hr />
      </div>

      <form>
        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-6">
            <h4>1. Supplier and Item Details</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="grnDate" className="form-label">
                Select Supplier
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

              {/* Sales Person Details */}
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
            <div className="mb-3 mt-3">
              <label htmlFor="grnDate" className="form-label">
                Return Date
              </label>
              <input
                type="date"
                className="form-control"
                // className={`form-control ${
                //   validFields.grnDate ? "is-valid" : ""
                // } ${validationErrors.grnDate ? "is-invalid" : ""}`}
                id="returnDate"
                value={formData.returnDate}
                onChange={(e) =>
                  handleInputChange("returnDate", e.target.value)
                }
                required
              />
              {/* {validationErrors.grnDate && (
                <div className="invalid-feedback">
                  {validationErrors.grnDate}
                </div>
              )} */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SupplierReturn;
