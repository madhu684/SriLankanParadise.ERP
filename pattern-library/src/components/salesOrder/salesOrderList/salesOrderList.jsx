import React, { useContext, useState } from "react";
import useSalesOrderList from "./useSalesOrderList";
import SalesOrderApproval from "../salesOrderApproval/salesOrderApproval";
import SalesOrder from "../salesOrder";
import SalesOrderDetail from "../salesOrderDetail/salesOrderDetail";
import SalesOrderUpdate from "../salesOrderUpdate/salesOrderUpdate";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import SalesInvoice from "../../salesInvoice/salesInvoice";
import Pagination from "../../common/Pagination/Pagination";
import { FaSearch } from "react-icons/fa";
import { UserContext } from "../../../context/userContext";

const SalesOrderList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    salesOrders,
    isLoadingData,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showApproveSOModal,
    showApproveSOModalInParent,
    showDetailSOModal,
    showDetailSOModalInParent,
    showCreateSOForm,
    showUpdateSOForm,
    SODetail,
    showConvertSOForm,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleShowApproveSOModal,
    handleCloseApproveSOModal,
    handleCloseDetailSOModal,
    handleApproved,
    handleViewDetails,
    setShowCreateSOForm,
    setShowUpdateSOForm,
    handleUpdate,
    handleUpdated,
    handleClose,
    areAnySelectedRowsApproved,
    handleConvert,
    setShowConvertSOForm,
  } = useSalesOrderList();

  const { hasPermission } = useContext(UserContext);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredSalesOrders = salesOrders.filter(
    (so) =>
      so.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      so.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <ErrorComponent error={error || "Error fetching data"} />;
  }

  if (isLoadingData || (salesOrders && !(salesOrders.length >= 0))) {
    return <LoadingSpinner />;
  }

  if (showCreateSOForm) {
    return (
      <SalesOrder
        handleClose={() => setShowCreateSOForm(false)}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (showUpdateSOForm) {
    return (
      <SalesOrderUpdate
        handleClose={handleClose}
        salesOrder={SODetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
        setShowUpdateSOForm={setShowUpdateSOForm}
      />
    );
  }

  if (showConvertSOForm) {
    return (
      <SalesInvoice
        handleClose={handleClose}
        salesOrder={SODetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (salesOrders.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Sales Requisitions</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any sales order. Create a new one.</p>
          {hasPermission("Create Sales Order") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateSOForm(true)}
            >
              Create
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Sales Orders</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission("Create Sales Order") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateSOForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission("Approve Sales Order") &&
            selectedRowData[0]?.createdUserId !==
              parseInt(sessionStorage.getItem("userId")) &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={handleShowApproveSOModal}
              >
                Approve
              </button>
            )}
          {hasPermission("Convert Sales Order") &&
            isAnyRowSelected &&
            areAnySelectedRowsApproved(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={() => setShowConvertSOForm(true)}
              >
                Convert
              </button>
            )}
          {hasPermission("Update Sales Order") && isAnyRowSelected && (
            <button
              className="btn btn-warning"
              onClick={() => setShowUpdateSOForm(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-end mb-3">
        <div className="search-bar input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
          />
          <span className="input-group-text">
            <FaSearch />
          </span>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Reference No</th>
              <th>Created By</th>
              <th>Ordered Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalesOrders
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((so) => (
                <tr key={so.salesOrderId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(so.salesOrderId)}
                      onChange={() => handleRowSelect(so.salesOrderId)}
                    />
                  </td>
                  <td>{so.referenceNo}</td>
                  <td>{so.createdBy}</td>
                  <td>{so?.orderDate?.split("T")[0]}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${getStatusBadgeClass(
                        so.status
                      )}`}
                    >
                      {getStatusLabel(so.status)}
                    </span>
                  </td>
                  <td>
                    {so.status === 0 ? (
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => handleUpdate(so)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-pencil-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                        </svg>{" "}
                        Edit
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => handleViewDetails(so)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-arrow-right"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                          />
                        </svg>{" "}
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredSalesOrders.length}
          paginate={paginate}
          currentPage={currentPage}
        />
        {showApproveSOModalInParent && (
          <SalesOrderApproval
            show={showApproveSOModal}
            handleClose={handleCloseApproveSOModal}
            salesOrder={selectedRowData[0]}
            handleApproved={handleApproved}
          />
        )}
        {showDetailSOModalInParent && (
          <SalesOrderDetail
            show={showDetailSOModal}
            handleClose={handleCloseDetailSOModal}
            salesOrder={SODetail}
          />
        )}
      </div>
    </div>
  );
};

export default SalesOrderList;
