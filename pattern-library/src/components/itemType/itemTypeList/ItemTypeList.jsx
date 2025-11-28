import React from "react";
import useItemTypeList from "./useItemTypeList";
import ErrorComponent from "../../errorComponent/errorComponent";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import Pagination from "../../common/Pagination/Pagination";
import { FaSearch } from "react-icons/fa";
import ItemType from "../ItemType";

const ItemTypeList = () => {
  const {
    searchQuery,
    currentPage,
    itemsPerPage,
    itemTypes,
    filteredItemTypes,
    isLoadingItemTypes,
    error,
    showCreateItemTypeForm,
    setShowCreateItemTypeForm,
    showUpdateItemTypeForm,
    setShowUpdateItemTypeForm,
    paginate,
    setSearchQuery,
    setCurrentPage,
    handleSearch,
    getStatusLabel,
    getStatusBadgeClass,
  } = useItemTypeList();

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (isLoadingItemTypes || (itemTypes && !(itemTypes.length >= 0))) {
    return <LoadingSpinner />;
  }

  if (showCreateItemTypeForm) {
    return <ItemType handleClose={() => setShowCreateItemTypeForm(false)} />;
  }

  if (itemTypes.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Item Types</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any item types. Create a new one.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowCreateItemTypeForm(true)}
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0 fw-bold text-dark">Item Types</h2>
            <div className="btn-group shadow-sm" role="group">
              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={() => setShowCreateItemTypeForm(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Create
              </button>
              {/* <button
                className="btn btn-warning px-4"
                //onClick={() => setShowUpdateCategoryForm(true)}
              >
                <i className="bi bi-pencil-square me-2"></i>
                Edit
              </button>
              <button
                className="btn btn-danger px-4"
                //onClick={() => setShowDeleteConfirmation(true)}
              >
                <i className="bi bi-trash3 me-2"></i>
                Delete
              </button> */}
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-4 ms-auto">
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search item type..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  {/* <th className="text-center">
                    <input type="checkbox" className="form-check-input" />
                  </th> */}
                  <th className="fw-semibold">Item Type ID</th>
                  <th className="fw-semibold">Item Type Name</th>
                  <th className="fw-semibold">Status</th>
                  <th className="fw-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItemTypes
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((it) => (
                    <tr key={it.itemTypeId} className="border-bottom">
                      {/* <td className="text-center">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedRows.includes(c.categoryId)}
                          onChange={() => handleRowSelect(c.categoryId)}
                        />
                      </td> */}
                      <td className="text-muted">{it.itemTypeId}</td>
                      <td className="fw-medium">{it.name}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${getStatusBadgeClass(
                            it.status
                          )}`}
                        >
                          {getStatusLabel(it.status)}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-warning btn-sm px-3 shadow-sm"
                          //onClick={() => handleUpdate(c)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            fill="currentColor"
                            className="bi bi-pencil-fill me-1"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                          </svg>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="mt-3">
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredItemTypes.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemTypeList;
