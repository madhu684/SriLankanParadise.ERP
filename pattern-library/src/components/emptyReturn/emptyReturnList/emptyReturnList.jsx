import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import Pagination from "../../common/Pagination/Pagination";
import AddEmpties from "../addEmpties/addEmpties.jsx";
import CreateEmptyReturn from "../createEmptyReturn/createEmptyReturn.jsx";
import useEmptyReturnsLogic from "./emptyReturnList.js"; // Importing the logic file

const EmptyReturnList = () => {
  // Fetching data and actions using the custom hook
  const {
    addedEmptyItems,
    isLoading,
    isError,
    error,
    selectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    handleViewDetails,
    handleEmptyTransfer,
    handleApprove,
    handleEdit,
    paginate,
    showAddEmptiesForm,
    setShowAddEmptiesForm,
    showCreateEmptyReturnForm,
    setShowCreateEmptyReturnForm,
    selectedItems,
    setSelectedItems,
  } = useEmptyReturnsLogic();

  const itemsPerPage = 10;

  // If loading or error
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorComponent error={error || "Error fetching empty returns"} />;
  }

  if (showCreateEmptyReturnForm) {
    return (
      <CreateEmptyReturn
        selectedItems={selectedItems}
        handleClose={() => {
          setShowCreateEmptyReturnForm(false);
          setSelectedItems([]);
        }}
      />
    );
  }

  // Empty state when no data
  // if (addedEmptyItems?.length === 0) {
  //   return(
  //     <div className="container mt-4">
  //     <h2>Empty Returns</h2>
  //     <div
  //       className="d-flex flex-column align-items-center justify-content-center text-center vh-100"
  //       style={{ maxHeight: "80vh" }}
  //     >
  //       <p>
  //         You haven't created any empty returns yet. Start by adding empties or
  //         creating a new return.
  //       </p>
  //       <div className="btn-group" role="group">
  //         <button
  //           type="button"
  //           className="btn btn-primary"
  //           onClick={() => setShowAddEmptiesForm(true)}
  //         >
  //           Empty Collection
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  //   )
  // }

  return (
    <>
      <div className="container mt-4">
        <h2>Empty Returns</h2>

        {/* Action buttons */}
        <div className="d-flex align-items-center justify-content-start mt-3">
          <div className="btn-group" role="group">
            {addedEmptyItems?.length > 0 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowAddEmptiesForm(true)}
              >
                Empty Collection
              </button>
            )}

            {/* {selectedRows.length > 0 &&
              addedEmptyItems.some(
                (item) =>
                  selectedRows.includes(item.emptyReturnMasterId) &&
                  item.status === 1
              ) && (
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => handleEdit(selectedRows[0])}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => handleApprove(selectedRows[0])}
                  >
                    Approve
                  </button>
                </div>
              )} */}
          </div>
        </div>

        {/* Table - Displays data */}
        {addedEmptyItems?.length > 0 ? (
          <div className="table-responsive">
            <table className="table mt-2">
              <thead>
                <tr>
                  {/* <th></th> */}
                  <th>Reference No</th>
                  <th>From Location</th>
                  <th>Created Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {/* Table - Row rendering with status and select logic */}
              <tbody>
                {addedEmptyItems?.map((item) => (
                  <tr key={item.emptyReturnMasterId}>
                    {/* <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(
                          item.emptyReturnMasterId
                        )} // Only checked if the item is in selectedRows
                        onChange={() =>
                          handleRowSelect(item.emptyReturnMasterId)
                        } // Handle selection of the row
                      />
                    </td> */}
                    <td>{item.referenceNo}</td>
                    <td>{item.fromLocation.locationName}</td>
                    <td>
                      {new Date(item.createDate).toISOString().split("T")[0]}
                    </td>
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
                      {/* <button
                        className="btn btn-primary me-2"
                        onClick={() => handleViewDetails(item)}
                      >
                        View
                      </button> */}

                      <button
                        type="button"
                        className="btn btn-warning me-2"
                        onClick={() => handleEdit(selectedRows[0])}
                        disabled={item.status === 1}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => handleEmptyTransfer(item)}
                        disabled={item.status !== 0} // Disable the button when status is 0
                      >
                        Empty Transfer
                      </button>
                      {/* <button
                        type="button"
                        className="btn btn-success me-2"
                        onClick={() => handleApprove(selectedRows[0])}
                        disabled={item.status === 0 || item.status === 2}
                      >
                        Approve
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination - Works with real data */}
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={addedEmptyItems?.length}
              paginate={paginate}
            />
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center text-center vh-100">
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
            </div>
          </div>
        )}

        {/* No results message */}
        {/* {searchTerm && (
          <div className="alert alert-primary text-center mb-3">
            <span className="me-3">
              <i className="bi bi-emoji-frown"></i>
            </span>
            No matching empty returns found.
          </div>
        )} */}
      </div>

      {/* Add Empties Modal */}
      <AddEmpties
        show={showAddEmptiesForm}
        handleClose={() => setShowAddEmptiesForm(false)}
      />
    </>
  );
};

export default React.memo(EmptyReturnList);
