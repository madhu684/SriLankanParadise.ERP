import React, { useState } from "react";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import Pagination from "../../common/Pagination/Pagination";
import AddEmpties from "../addEmpties/addEmpties.jsx";
import CreateEmptyReturn from "../createEmptyReturn/createEmptyReturn.jsx";

const EmptyReturnList = () => {
  // State for UI management - will be replaced with actual data later
  const [showAddEmptiesForm, setShowAddEmptiesForm] = useState(false);
  const [showCreateEmptyReturnForm, setShowCreateEmptyReturnForm] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  // Mock data for UI display - will be replaced with actual data from React Query
  const [isLoading] = useState(false);
  const [isError] = useState(false);
  const [error] = useState(null);

  //   const [emptyReturns] = useState([]);
  const [emptyReturns] = useState([
    {
      id: 1,
      referenceNo: "ER-2024-001",
      createdBy: "John Doe",
      createdDate: "2024-06-01",
      returnedDate: "2024-06-05",
      status: 1,
    },
    {
      id: 2,
      referenceNo: "ER-2024-002",
      createdBy: "Jane Smith",
      createdDate: "2024-06-02",
      returnedDate: "2024-06-06",
      status: 0,
    },
    {
      id: 2,
      referenceNo: "ER-2024-003",
      createdBy: "Fred Smith",
      createdDate: "2024-06-02",
      returnedDate: "2024-06-06",
      status: 2,
    },
    {
      id: 2,
      referenceNo: "ER-2024-004",
      createdBy: "Bob Duwa",
      createdDate: "2024-06-02",
      returnedDate: "2024-06-06",
      status: 3,
    },
  ]);

  const itemsPerPage = 10;

  if (showCreateEmptyReturnForm) {
    return (
      <CreateEmptyReturn
        show={showCreateEmptyReturnForm}
        handleClose={() => setShowCreateEmptyReturnForm(false)}
      />
    );
  }

  const handleSearchChange = (e) => {
    if (e.target && e.target.value !== undefined) {
      setSearchTerm(e.target.value);
    } else {
      setSearchTerm("");
    }
    setCurrentPage(1);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleViewDetails = (emptyReturn) => {
    // Will implement modal/detail view later
    console.log("View details for:", emptyReturn);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 0:
        return "bg-warning text-dark";
      case 1:
        return "bg-success";
      case 2:
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  if (isError) {
    return <ErrorComponent error={error || "Error fetching empty returns"} />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show Create Empty Return form (placeholder)
  // if (showCreateEmptyReturnForm) {
  //   return (
  //     <div className="container mt-4">
  //       <div className="card">
  //         <div className="card-header d-flex justify-content-between align-items-center">
  //           <h4 className="mb-0">Create Empty Return</h4>
  //           <button
  //             type="button"
  //             className="btn btn-secondary"
  //             onClick={() => setShowCreateEmptyReturnForm(false)}
  //           >
  //             Back to List
  //           </button>
  //         </div>
  //         <div className="card-body">
  //           <p className="text-muted">
  //             Create Empty Return form will be implemented here...
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Empty state when no data
  if (emptyReturns.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Empty Returns</h2>
        <div
          className="d-flex flex-column align-items-center justify-content-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>
            You haven't created any empty returns yet. Start by adding empties
            or creating a new return.
          </p>
          <div className="btn-group" role="group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowAddEmptiesForm(true)}
            >
              Empty Collection
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setShowCreateEmptyReturnForm(true)}
            >
              Empty Transfer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-4">
        <h2>Empty Returns</h2>

        {/* Action buttons */}
        <div className="d-flex align-items-center justify-content-start mt-3">
          <div className="btn-group" role="group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                console.log("Add Empties clicked"); // Debug log
                setShowAddEmptiesForm(true);
              }}
            >
              Empty Collection
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setShowCreateEmptyReturnForm(true)}
            >
              Empty Transfer
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="input-group mt-4 mb-3 w-25">
          <span className="input-group-text bg-transparent">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search for an empty return..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <span
              className="input-group-text bg-transparent"
              style={{ cursor: "pointer" }}
              onClick={handleSearchChange}
            >
              <i className="bi bi-x"></i>
            </span>
          )}
        </div>

        {/* Table - This will show when you have data */}
        <div className="table-responsive">
          <table className="table mt-2">
            <thead>
              <tr>
                <th></th>
                <th>Reference No</th>
                <th>Created By</th>
                <th>Created Date</th>
                <th>Returned Date</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample rows for UI preview - remove when implementing real data
              <tr>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(1)}
                    onChange={() => handleRowSelect(1)}
                  />
                </td>
                <td>ER-2024-001</td>
                <td>John Doe</td>
                <td>2024-06-01</td>
                <td>2024-06-05</td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(1)}`}
                  >
                    {getStatusLabel(1)}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() =>
                      handleViewDetails({ id: 1, referenceNo: "ER-2024-001" })
                    }
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
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(2)}
                    onChange={() => handleRowSelect(2)}
                  />
                </td>
                <td>ER-2024-002</td>
                <td>Jane Smith</td>
                <td>2024-06-02</td>
                <td>2024-06-06</td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(0)}`}
                  >
                    {getStatusLabel(0)}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() =>
                      handleViewDetails({ id: 2, referenceNo: "ER-2024-002" })
                    }
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
                </td>
              </tr> */}
              {/* Add more sample rows as needed */}
              {emptyReturns.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => handleRowSelect(item.id)}
                    />
                  </td>
                  <td>{item.referenceNo}</td>
                  <td>{item.createdBy}</td>
                  <td>{item.createdDate}</td>
                  <td>{item.returnedDate}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${getStatusBadgeClass(
                        item.status
                      )}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleViewDetails(item)}
                    >
                      <i className="bi bi-arrow-right"></i> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination - will work with real data */}
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={2} // This will be dynamic with real data
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>

        {/* No results message */}
        {searchTerm && (
          <div className="alert alert-primary text-center mb-3">
            <span className="me-3">
              <i className="bi bi-emoji-frown"></i>
            </span>
            No matching empty returns found.
          </div>
        )}
      </div>

      {/* Add Empties Modal - Outside container for proper z-index */}
      <AddEmpties
        show={showAddEmptiesForm}
        handleClose={() => setShowAddEmptiesForm(false)}
      />
    </>
  );
};

export default EmptyReturnList;
