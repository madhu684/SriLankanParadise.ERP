import { Table, Container, Button } from "react-bootstrap";
import SalesOrderReportView from "./salesOrderReportView/salesOrderReportView";
import SalesOrderReportHook from "./useSalesOrderReport";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";

const SalesOrderReport = () => {
  const {
    handleFromDateChange,
    handleToDateChange,
    handleSearch,
    handleShowModal,
    handleCloseModal,
    showModal,
    isSearched,
    fromDate,
    toDate,
    isFromDateSelected,
    isToDateSelected,
    salesOrderData,
    loading,
    salesOrderId,
  } = SalesOrderReportHook();

  console.log("Master data", salesOrderData);
  return (
    <>
      <div className="container mt-4">
        <div className="mb-4">
          <div className="d-flex justify-content-end">
            <p className="mb-0">
              <CurrentDateTime />
            </p>
          </div>
          <h1 className="mt-2 text-center">Sales Order Report</h1>
          <hr />
        </div>
        <div className="row g-3 mt-2">
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="fromDate" className="form-label">
                From Date
              </label>
              <input
                type="date"
                className="form-control"
                id="fromDate"
                value={fromDate}
                onChange={handleFromDateChange}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="toDate" className="form-label">
                To Date
              </label>
              <input
                type="date"
                className="form-control"
                id="toDate"
                value={toDate}
                onChange={handleToDateChange}
              />
            </div>
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <button
              className="btn btn-primary w-50"
              onClick={handleSearch}
              disabled={!isFromDateSelected || !isToDateSelected}
            >
              Search
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col">
            {!isSearched ? (
              <p className="text-center bg-light text-black fw-bold p-2 border">
                Please select a date range
              </p>
            ) : (
              <table
                className="table table-striped table-bordered text-center"
                style={{ minWidth: "1000px", overflowX: "auto" }}
              >
                <thead>
                  <tr>
                    <th>Sales Order Id</th>
                    <th>Customer Name</th>
                    <th>Order Date</th>
                    <th>Delivery Date</th>
                    <th>Reference No</th>
                    <th>Sales Order Details</th>
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
                  ) : salesOrderData && salesOrderData.length > 0 ? (
                    salesOrderData.map((data, index) => (
                      <tr key={index}>
                        <td>{data.salesOrderId}</td>
                        <td>
                          {data.customer ? data.customer.customerName : "N/A"}
                        </td>
                        <td>{data.orderDate.split("T")[0]}</td>
                        <td>{data.deliveryDate.split("T")[0]}</td>
                        <td>{data.referenceNo}</td>
                        <td>
                          <button
                            className="btn btn-secondary w-50"
                            onClick={() => handleShowModal(data.salesOrderId)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <SalesOrderReportView
        showModal={showModal}
        onCancel={handleCloseModal}
        salesOrderId={salesOrderId}
      />
    </>
  );
};

export default SalesOrderReport;
