import React from "react";
import { FaSearch } from "react-icons/fa";
import useStockManagement from "./useStockManagement";
import LoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import Pagination from "../common/Pagination/Pagination";

const StockManagement = () => {
  const {
    companyLocations,
    selectedLocation,
    inventories,
    currentItems,
    itemsPerPage,
    currentPage,
    loading,
    handleSearch,
    paginate,
    handleLocationChange,
    handleDateChange,
  } = useStockManagement();
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
        {/* <div className="col-md-3">
          <label htmlFor="transactionType" className="form-label">
            Transaction Type
          </label>
          <select
            className="form-select"
            id="transactionType"
            //onChange={handleTransactionTypeChange}
          >
            <option value="" disabled selected>
              Select a Transaction type
            </option>
            <option>Adjustment</option>
            {transactionTypes && transactionTypes.length > 0 ? (
              transactionTypes.map((tr) => (
                <option key={tr.id} value={tr.id}>
                  {tr.name}
                </option>
              ))
            ) : (
              <option>No Trasaction Types available</option>
            )}
          </select>
        </div> */}
        {/* <div className="col-md-3">
          <label htmlFor="transactionDate" className="form-label">
            Adjusted Date
          </label>
          <input
            type="date"
            className="form-control"
            id="transactionDate"
            name="transactionDate"
            //value={transactionDate}
            onChange={handleDateChange}
          />
        </div> */}
      </div>
      <div className="mt-4">
        <button
          className="btn btn-success"
          onClick={handleSearch}
          disabled={selectedLocation === null}
          //   disable={
          //     !isTransactionTypeSelected ||
          //     !isTransactionDateSelected
          //   }
        >
          Search
        </button>
      </div>
      <hr />
      {/* {isWarehouseSelected && ( */}
      <div>
        <h6 className="mt-2">Stock Information</h6>
        <div className="d-flex justify-content-between">
          <div className="input-group search-bar  d-flex justify-content-between">
            <input
              type="text"
              className="form-control"
              placeholder="Search by item name"
              //value={searchTerm}
              //onChange={handleSearchChange}
            />
            <span className="input-group-text">
              <FaSearch />
            </span>
          </div>
          {/* <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="show-all-items"
              //onChange={handleIsChecked}
              //checked={isChecked}
            />
            <label className="form-check-label" htmlFor="show-all-items">
              Show all items
            </label>
          </div> */}
        </div>
        <div className="tabnle-responsive">
          <table className="table mt-2">
            <thead>
              <tr>
                <th></th>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>UOM</th>
                <th>Stock in Hand</th>
                <th>Cust Dek Number</th>
                {/* <th>Adjusted Quantity</th> */}
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
                    <td>{item.custDekNo}</td>
                    {/* <td>
                      <input
                        type="number"
                        className="form-control form-input rounded-4"
                        placeholder="Enter quantity"
                        value={
                          adjustedVolumes[
                            itemsPerPage * (currentPage - 1) + index
                          ]
                        }
                        onChange={(e) =>
                          handleSetAdjustedVolumes(
                            itemsPerPage * (currentPage - 1) + index,
                            parseFloat(e.target.value)
                          )
                        }
                        step="any"
                      />
                    </td> */}
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
          {/* <div className="d-flex">
            <button className="btn btn-danger me-2" onClick={handleClear}>
              Clear
            </button>
            <button
              className="btn btn-primary me-2"
              onClick={handleSubmit}
              disable={isSubmitting}
              loading={isSubmitting}
            >
              Submit
            </button>
          </div> */}
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default StockManagement;
