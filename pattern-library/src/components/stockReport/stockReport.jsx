import React from "react";
import useStockReport from "./useStockReport";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";

const StockReport = () => {
  const {
    loading,
    startDate,
    endDate,
    reportData,
    companyLocations,
    searchTerm,
    generatedDateTime,
    isReportGenerated,
    isitemMastersError,
    isItemBatchesError,
    isGrnMastersError,
    isIssueMastersError,
    isSalesOrdersError,
    isSalesInvoicesError,
    setStartDate,
    setEndDate,
    handleGenerateReport,
    setSearchTerm,
    getCurrentDate,
    getFilteredData,
  } = useStockReport();

  //const companyLogoUrl = useCompanyLogoUrl();
  console.log("reportData", reportData);
  if (
    isitemMastersError ||
    isItemBatchesError ||
    isGrnMastersError ||
    isIssueMastersError ||
    isSalesOrdersError ||
    isSalesInvoicesError
  ) {
    return <ErrorComponent error={"Error fetching data"} />;
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
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={getCurrentDate()}
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
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              max={getCurrentDate()}
              min={startDate}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="warehouse" className="form-label">
              Warehouse
            </label>
            <select
              className="form-select"
              id="warehouse"
              //onChange={handleLocationChange}
            >
              <option value="" disabled selected>
                All Warehouses
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
              onClick={handleGenerateReport}
              disabled={loading || isReportGenerated}
            >
              {loading ? (
                <ButtonLoadingSpinner text="Processing..." />
              ) : (
                <>
                  <i
                    className={`bi ${
                      isReportGenerated
                        ? "bi bi-check-circle"
                        : "bi-file-earmark-text"
                    } me-2`}
                  ></i>
                  {isReportGenerated ? "Report Generated" : "Generate Report"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Report Table */}
      {loading ? (
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <span
                    className="input-group-text bg-transparent"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="bi bi-x"></i>
                  </span>
                )}
              </div>
              <div className="mb-2">
                <small className="form-text text-muted">
                  You can search for an item using item name or code
                </small>
              </div>
            </div>
          </div>

          {getFilteredData()?.length > 0 ? (
            <div className="table-responsive mb-2">
              <table
                className="table"
                style={{ minWidth: "1000px", overflowX: "auto" }}
              >
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Code</th>
                    <th>Unit</th>
                    <th>Opening Qty</th>
                    <th>
                      <i className="bi bi-arrow-down"></i> In
                    </th>
                    <th>
                      <i className="bi bi-arrow-up"></i> Out
                    </th>
                    <th>Current Qty</th>
                    <th>Reorder Level</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData
                    ?.filter(
                      (item) =>
                        item?.itemName
                          ?.toLowerCase()
                          .replace(/\s+/g, "")
                          ?.includes(
                            searchTerm.toLowerCase().replace(/\s+/g, "")
                          ) ||
                        item?.itemCode
                          ?.toLowerCase()
                          .replace(/\s+/g, "")
                          ?.includes(
                            searchTerm.toLowerCase().replace(/\s+/g, "")
                          )
                    )
                    ?.map((item) => (
                      <tr
                        key={item.itemMasterId}
                        className={
                          item.currentQty < item.reorderLevel
                            ? "table-warning"
                            : ""
                        }
                      >
                        <td>{item?.itemName}</td>
                        <td>{item?.itemCode}</td>
                        <td>{item?.unit?.unitName}</td>
                        <td>{item?.currentQty - item?.in + item?.out}</td>
                        <td>{item?.in}</td>
                        <td>{item?.out}</td>
                        <td>{item?.currentQty}</td>
                        <td>{item?.reorderLevel}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <small className="text-muted">
                *Items with a current quantity below the reorder level are
                highlighted.
              </small>
            </div>
          ) : (
            <div className="alert alert-primary text-center mb-3">
              <span className="me-3">
                <i className="bi bi-emoji-frown"></i>
              </span>
              No matching items found.
            </div>
          )}
          {/* Generated Date and Time */}
          {generatedDateTime && reportData && (
            <div className="text-center text-muted mt-4">
              <p>
                This is a computer-generated document. No signature is required.
              </p>
              <p>Generated on: {generatedDateTime.toLocaleString()}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StockReport;
