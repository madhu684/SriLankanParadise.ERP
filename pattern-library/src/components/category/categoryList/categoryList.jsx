import React, { useContext, useState } from "react";
import useCategoryList from "./useCategoryList";
import Category from "../category";
import CategoryUpdate from "../categoryUpdate/categoryUpdate";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import DeleteConfirmationModal from "../../confirmationModals/deleteConfirmationModal/deleteConfirmationModal";
import { FaSearch } from "react-icons/fa";
import Pagination from "../../common/Pagination/Pagination";
import { UserContext } from "../../../context/userContext";

const CategoryList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    categories,
    isLoadingData,
    error,
    isAnyRowSelected,
    selectedRows,
    selectedRowData,
    showCreateCategoryForm,
    showUpdateCategoryForm,
    categoryDetail,
    showDeleteConfirmation,
    submissionStatus,
    submissionMessage,
    loading,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleRowSelect,
    getStatusLabel,
    getStatusBadgeClass,
    setShowCreateCategoryForm,
    setShowUpdateCategoryForm,
    setShowDeleteConfirmation,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleConfirmDeleteCategory,
    handleCloseDeleteConfirmation,
  } = useCategoryList();

  const { hasPermission } = useContext(UserContext);

  //Handler for search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  //Filter MRNs based on search query
  const filteredCategories = categories
    ? categories?.filter((catagory) =>
        catagory.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  //Pagination Handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (isLoadingData || (categories && !(categories.length >= 0))) {
    return <LoadingSpinner />;
  }

  if (showCreateCategoryForm) {
    return (
      <Category
        handleClose={() => setShowCreateCategoryForm(false)}
        handleUpdated={handleUpdated}
        setShowCreateCategoryForm={setShowCreateCategoryForm}
      />
    );
  }

  if (showUpdateCategoryForm) {
    return (
      <CategoryUpdate
        handleClose={handleClose}
        category={categoryDetail || selectedRowData[0]}
        handleUpdated={handleUpdated}
      />
    );
  }

  if (categories.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Categories</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any category. Create a new one.</p>
          {hasPermission("Create Category") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateCategoryForm(true)}
            >
              Create
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0 fw-bold text-dark">Categories</h2>
            <div className="btn-group shadow-sm" role="group">
              {hasPermission("Create Category") && (
                <button
                  type="button"
                  className="btn btn-primary px-4"
                  onClick={() => setShowCreateCategoryForm(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Create
                </button>
              )}
              {/* {hasPermission("Update Category") && isAnyRowSelected && (
                <button
                  className="btn btn-warning px-4"
                  onClick={() => setShowUpdateCategoryForm(true)}
                >
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit
                </button>
              )}
              {hasPermission("Delete Category") && isAnyRowSelected && (
                <button
                  className="btn btn-danger px-4"
                  onClick={() => setShowDeleteConfirmation(true)}
                >
                  <i className="bi bi-trash3 me-2"></i>
                  Delete
                </button>
              )} */}
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
                  placeholder="Search categories..."
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
                  <th className="fw-semibold">Category ID</th>
                  <th className="fw-semibold">Category Name</th>
                  <th className="fw-semibold">Status</th>
                  <th className="fw-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((c) => (
                    <tr key={c.categoryId} className="border-bottom">
                      {/* <td className="text-center">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedRows.includes(c.categoryId)}
                          onChange={() => handleRowSelect(c.categoryId)}
                        />
                      </td> */}
                      <td className="text-muted">{c.categoryId}</td>
                      <td className="fw-medium">{c.categoryName}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${getStatusBadgeClass(
                            c.status
                          )}`}
                        >
                          {getStatusLabel(c.status)}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-warning btn-sm px-3 shadow-sm"
                          onClick={() => handleUpdate(c)}
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
                totalItems={filteredCategories.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        handleClose={handleCloseDeleteConfirmation}
        handleConfirmDelete={handleConfirmDeleteCategory}
        title={`Category "${selectedRowData[0]?.categoryName}"`}
        submissionStatus={submissionStatus}
        message={submissionMessage}
        loading={loading}
      />
    </div>
  );
};

export default CategoryList;
