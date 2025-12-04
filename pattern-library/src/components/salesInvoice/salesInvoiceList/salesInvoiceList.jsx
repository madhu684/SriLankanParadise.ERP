import React, { useContext, useState } from "react";
import useSalesInvoiceList from "./useSalesInvoiceList";
import SalesInvoiceApproval from "../salesInvoiceApproval/salesInvoiceApproval";
import SalesInvoice from "../salesInvoice";
import SalesInvoiceDetail from "../salesInvoiceDetail/salesInvoiceDetail";
import SalesInvoiceUpdate from "../salesInvoiceUpdate/salesInvoiceUpdate";
import SalesInvoiceRightOff from "../salesInvoiceRightOff/salesInvoiceRightOff";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import Pagination from "../../common/Pagination/Pagination";
import { FaSearch } from "react-icons/fa";
import { UserContext } from "../../../context/userContext";
import SalesInvoiceDelete from "../salesInvoiceDelete/salesInvoiceDelete";

const SalesInvoiceList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    salesInvoices,
    isAnyRowSelected,
    selectedRows,
    showApproveSIModal,
    showApproveSIModalInParent,
    showDetailSIModal,
    showDetailSIModalInParent,
    showRightOffSIModal,
    showRightOffSIModalInParent,
    selectedRowData,
    showCreateSIForm,
    showUpdateSIForm,
    SIDetail,
    showDeleteSIForm,
    error,
    isLoadingSalesInvoices,
    setShowDeleteSIForm,
    areAnySelectedRowsPending,
    areAnySelectedRowsApproved,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApproveSIModal,
    handleCloseApproveSIModal,
    handleShowRightOffSIModal,
    handleCloseRightOffSIModal,
    handleApproved,
    handleRightOff,
    setShowCreateSIForm,
    setShowUpdateSIForm,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleCloseDetailSIModal,
  } = useSalesInvoiceList();

  const { hasPermission } = useContext(UserContext);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredSalesInvoices = salesInvoices
    ? salesInvoices.filter(
        (si) =>
          si.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          si.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <ErrorComponent error={error || "Error fetching data"} />;
  }

  if (
    isLoadingSalesInvoices ||
    (salesInvoices && !(salesInvoices.length >= 0))
  ) {
    return <LoadingSpinner />;
  }

  if (showCreateSIForm) {
    return (
      <SalesInvoice
        handleClose={() => setShowCreateSIForm(false)}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (showUpdateSIForm) {
    return (
      <SalesInvoiceUpdate
        handleClose={handleClose}
        salesInvoice={SIDetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (salesInvoices.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Sales Invoices</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>
            You haven't created any sales invoice. Create a new one through a
            Sales Requisition.
          </p>
          {/* {hasPermission("Create Sales Invoice") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateSIForm(true)}
            >
              Create
            </button>
          )} */}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Sales Invoices</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {/* {hasPermission("Create Sales Invoice") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateSIForm(true)}
            >
              Create
            </button>
          )} */}
          {hasPermission("Approve Sales Invoice") &&
            selectedRowData[0]?.createdUserId !==
              parseInt(sessionStorage.getItem("userId")) &&
            isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) && (
              <button
                className="btn btn-success"
                onClick={handleShowApproveSIModal}
              >
                Approve
              </button>
            )}
          {/* {hasPermission("Update Sales Invoice") &&
            isAnyRowSelected &&
            selectedRowData[0]?.status === 1 && (
              <button
                className="btn btn-warning"
                onClick={() => setShowUpdateSIForm(true)}
              >
                Edit
              </button>
            )} */}
          {isAnyRowSelected &&
            areAnySelectedRowsPending(selectedRows) &&
            selectedRowData[0]?.status === 1 && (
              <button
                className="btn btn-danger"
                onClick={() => setShowDeleteSIForm(true)}
              >
                Delete
              </button>
            )}
          {hasPermission("Sales Invoice Right Off") &&
            isAnyRowSelected &&
            areAnySelectedRowsApproved(selectedRows) && (
              <button
                className="btn btn-danger"
                onClick={handleShowRightOffSIModal}
              >
                Write Off
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
              <th>Invoice Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalesInvoices
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((si) => (
                <tr key={si.salesInvoiceId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(si.salesInvoiceId)}
                      onChange={() => handleRowSelect(si.salesInvoiceId)}
                    />
                  </td>
                  <td>{si.referenceNo}</td>
                  <td>{si.createdBy}</td>
                  <td>{si?.invoiceDate?.split("T")[0]}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${getStatusBadgeClass(
                        si.status
                      )}`}
                    >
                      {getStatusLabel(si.status)}
                    </span>
                  </td>
                  <td>
                    {si.status === 0 ? (
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => handleUpdate(si)}
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
                        onClick={() => handleViewDetails(si)}
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
          totalItems={filteredSalesInvoices.length}
          paginate={paginate}
          currentPage={currentPage}
        />
        {showApproveSIModalInParent && (
          <SalesInvoiceApproval
            show={showApproveSIModal}
            handleClose={handleCloseApproveSIModal}
            salesInvoice={selectedRowData[0]}
            handleApproved={handleApproved}
          />
        )}
        {showDetailSIModalInParent && (
          <SalesInvoiceDetail
            show={showDetailSIModal}
            handleClose={handleCloseDetailSIModal}
            salesInvoice={SIDetail}
          />
        )}
        {showRightOffSIModalInParent && (
          <SalesInvoiceRightOff
            show={showRightOffSIModal}
            handleClose={handleCloseRightOffSIModal}
            salesInvoice={selectedRowData[0]}
            handleRightOff={handleRightOff}
          />
        )}
        {showDeleteSIForm && (
          <SalesInvoiceDelete
            show={showDeleteSIForm}
            handleClose={() => setShowDeleteSIForm(false)}
            salesInvoice={selectedRowData[0]}
          />
        )}
      </div>
    </div>
  );
};

export default SalesInvoiceList;
