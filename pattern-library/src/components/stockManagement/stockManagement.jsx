import React, { useContext, useMemo } from "react";
import { FaSearch, FaFileExcel } from "react-icons/fa";
import useStockManagement from "./useStockManagement";
import LoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import Pagination from "../common/Pagination/Pagination";
import { UserContext } from "../../context/userContext";
import StockAdjustmentModal from "./StockAdjustmentModal";

const StockManagement = () => {
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
    stockFilter,
    handleStockFilterChange,
    handleExportToExcel,
    showAdjustmentModal,
    selectedItem,
    handleAdjustStockClick,
    handleCloseAdjustmentModal,
  } = useStockManagement();

  const { user, allLocations, userLocations, hasPermission } =
    useContext(UserContext);

  const displayLocations = user?.userId === 1 ? allLocations : userLocations;

  const selectedLocationName = useMemo(
    () =>
      allLocations?.find((loc) => loc.locationId === parseInt(selectedLocation))
        ?.locationName,
    [allLocations, selectedLocation],
  );
  console.log(selectedLocationName);

  return (
    <div className="container-sm mt-4" style={{ maxWidth: "1200px" }}>
      <h2 className="text-black fw-bold">Manage Stock</h2>
      <div className="mt-3 row g-3">
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
              Select a Warehouse
            </option>
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
      {/* <div className="mt-4">
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={selectedLocation === null}
        >
          Search
        </button>
      </div> */}
      <hr />
      <div>
        <h6 className="mt-2 mb-3 fw-semibold">Stock Information</h6>
        <div className="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
          <div className="d-flex gap-3 align-items-center flex-wrap">
            {/* Search Input */}
            <div className="input-group" style={{ maxWidth: "250px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by item name"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  borderRight: "none",
                  paddingLeft: "12px",
                }}
              />
              <span
                className="input-group-text bg-white"
                style={{ borderLeft: "none" }}
              >
                <FaSearch style={{ color: "#6c757d" }} />
              </span>
            </div>

            {/* Stock Filter */}
            <div className="d-flex align-items-center gap-2">
              <label
                htmlFor="stockFilter"
                className="form-label mb-0 text-nowrap fw-medium"
                style={{ fontSize: "14px" }}
              >
                Stock Filter:
              </label>
              <select
                className="form-select"
                id="stockFilter"
                value={stockFilter}
                onChange={handleStockFilterChange}
                style={{
                  width: "auto",
                  minWidth: "150px",
                  fontSize: "14px",
                }}
              >
                <option value="all">All Items</option>
                <option value="positive">Positive Stock</option>
                <option value="zeroOrBelow">Zero Stock</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <button
            className="btn btn-success d-flex align-items-center gap-2"
            onClick={() => handleExportToExcel(selectedLocationName)}
            disabled={inventories.length === 0}
            style={{
              backgroundColor: "#198754",
              border: "none",
              padding: "8px 20px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            <FaFileExcel size={16} />
            Export to Excel
          </button>
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
                <th>Batch Reference</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8">
                    <div className="d-flex justify-content-center align-content-center">
                      <LoadingSpinner />
                    </div>
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={index}>
                    <td></td>
                    <td>{item.itemCode}</td>
                    <td>{item.itemName}</td>
                    <td>{item.unitName}</td>
                    <td>{item.stockInHand}</td>
                    <td>{item?.batchNo || "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleAdjustStockClick(item)}
                        disabled={!hasPermission("Stock Adjustment")}
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
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
            totalItems={inventories ? inventories.length : []}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>

      <StockAdjustmentModal
        show={showAdjustmentModal}
        onHide={handleCloseAdjustmentModal}
        selectedItem={selectedItem}
        selectedLocation={selectedLocation}
      />
    </div>
  );
};

export default StockManagement;
