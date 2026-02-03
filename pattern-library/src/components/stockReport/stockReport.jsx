import React from "react";
import useStockReport from "./useStockReport";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";
import Pagination from "../common/Pagination/Pagination";

const StockReport = () => {
  const {
    companyLocations,
    isCompanyLocationsLoading,
    isCompanyLocationsError,
    companyLocationsError,
    startDate,
    endDate,
    reportData,
    isLoading,
    selectedLoction,
    currentItems,
    itemsPerPage,
    currentPage,
    filteredData,
    searchTerm,
    handleStartDateChange,
    handleEndDateChange,
    handleLocationChange,
    handleSearch,
    paginate,
    handleSearchChange,
  } = useStockReport();

  //const companyLogoUrl = useCompanyLogoUrl();
  console.log("reportData", reportData);
  if (isCompanyLocationsError) {
    return (
      <ErrorComponent
        error={"Error fetching locations" || companyLocationsError}
      />
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-end">
          {/* <img src={companyLogoUrl} alt="Company Logo" height={30} /> */}
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Stock Report</h1>
        <hr />
      </div>

      {/* Date Range Selection */}
      <div className="mb-4">
        <h4>Date Range</h4>
        <div className="row g-3 mt-2">
          <div className="col-md-2">
            <label htmlFor="startDate" className="form-label">
              From
            </label>
            <input
              id="startDate"
              type="date"
              className="form-control"
              //value={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="endDate" className="form-label">
              To
            </label>
            <input
              id="endDate"
              type="date"
              className="form-control"
              //value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="warehouse" className="form-label">
              Warehouse
            </label>
            <select
              className="form-select"
              id="warehouse"
              onChange={handleLocationChange}
            >
              <option value="" disabled selected>
                Select a warehouse
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
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-primary w-100"
              onClick={handleSearch}
              disabled={
                isLoading ||
                isCompanyLocationsLoading ||
                !selectedLoction ||
                !startDate ||
                !endDate
              }
            >
              {isLoading ? (
                <ButtonLoadingSpinner text="Processing..." />
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Report Table */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="row mb-3 d-flex justify-content-between">
            <div className="col-md-4">
              <h4>Stock Information</h4>
              {/* Search Bar */}
              <div className="input-group mt-4">
                <span className="input-group-text bg-transparent">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for an item..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {/* {searchTerm && (
                  <span
                    className="input-group-text bg-transparent"
                    style={{ cursor: "pointer" }}
                    onClick={handleSearchChange}
                  >
                    <i className="bi bi-x"></i>
                  </span>
                )} */}
              </div>
              <div className="mb-2">
                <small className="form-text text-muted">
                  You can search for an item using item name or code
                </small>
              </div>
            </div>
          </div>

          {currentItems && currentItems.length > 0 ? (
            <div className="table-responsive mb-2">
              <table
                className="table"
                style={{ minWidth: "2000px", overflowX: "auto" }}
              >
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Item Code</th>
                    <th>Batch Number</th>
                    <th>Unit</th>
                    <th>Opening Qty</th>
                    <th>
                      <i className="bi bi-arrow-down"></i> In
                    </th>
                    <th>
                      <i className="bi bi-arrow-up"></i> Out
                    </th>
                    <th>Sale Order</th>
                    <th>Purchase Order</th>
                    <th>Sales Invoice</th>
                    <th>GRN</th>
                    <th>MIN</th>
                    <th>TIN</th>
                    <th>Prod In</th>
                    <th>Prod Out</th>
                    <th>Packing Slip</th>
                    <th>Supp. Return</th>
                    <th>Emp. Ret. In</th>
                    <th>Emp. Ret. Out</th>
                    <th>Emp. Ret. Red.</th>
                    <th>Adjusted In</th>
                    <th>Adjusted Out</th>
                    <th>Closing Bal</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={`${item.itemId}-${item.batchId}`}>
                      <td>{item.itemName}</td>
                      <td>{item.itemCode}</td>
                      <td>{item.batchNumber}</td>
                      <td>{item.unitName}</td>
                      <td className="fw-bold">{item.openingBalance}</td>
                      <td className="fw-bold">{item.totalIn}</td>
                      <td className="text-danger fw-bold">{item.totalOut}</td>
                      <td>{item.salesOrder}</td>
                      <td>{item.purchaseOrder}</td>
                      <td>{item.salesInvoice}</td>
                      <td>{item.grn}</td>
                      <td>{item.min}</td>
                      <td>{item.tin}</td>
                      <td>{item.productionIn}</td>
                      <td>{item.productionOut}</td>
                      <td>{item.packingSlip}</td>
                      <td>{item.supplierReturnNote}</td>
                      <td>{item.emptyReturnIn}</td>
                      <td>{item.emptyReturnOut}</td>
                      <td>{item.emptyReturnReduce}</td>
                      <td className="fw-bold">{item.adjustIn}</td>
                      <td className="text-danger fw-bold">{item.adjustOut}</td>
                      <td className="fw-bold">{item.closingBalance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-primary text-center mb-3">
              <span className="me-3">
                <i className="bi bi-emoji-frown"></i>
              </span>
              {`${
                !selectedLoction ||
                !startDate ||
                !endDate ||
                reportData.length < 0
                  ? "Please select a date range and location"
                  : "No matching items found."
              }`}
            </div>
          )}
          {/* Generated Date and Time */}
          {/* {generatedDateTime && reportData && (
            <div className="text-center text-muted mt-4">
              <p>
                This is a computer-generated document. No signature is required.
              </p>
              <p>Generated on: {generatedDateTime.toLocaleString()}</p>
            </div>
          )} */}
          {/* Pagination */}
          {reportData && reportData.length > 0 && (
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={filteredData ? filteredData.length : 0}
              paginate={paginate}
              currentPage={currentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default StockReport;
