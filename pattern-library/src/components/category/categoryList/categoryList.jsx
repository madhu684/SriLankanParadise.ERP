import React from "react";
import useCategoryList from "./useCategoryList";
import Category from "../category";
import CategoryUpdate from "../categoryUpdate/categoryUpdate";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import DeleteConfirmationModal from "../../confirmationModals/deleteConfirmationModal/deleteConfirmationModal";

const CategoryList = () => {
  const {
    categories,
    isLoadingData,
    isLoadingPermissions,
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
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    handleConfirmDeleteCategory,
    handleCloseDeleteConfirmation,
  } = useCategoryList();

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (
    isLoadingData ||
    isLoadingPermissions ||
    (categories && !(categories.length >= 0))
  ) {
    return <LoadingSpinner />;
  }

  if (showCreateCategoryForm) {
    return (
      <Category
        handleClose={() => setShowCreateCategoryForm(false)}
        handleUpdated={handleUpdated}
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
    <div className="container mt-4">
      <h2>Categories</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <div className="btn-group" role="group">
          {hasPermission("Create Category") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateCategoryForm(true)}
            >
              Create
            </button>
          )}
          {hasPermission("Update Category") && isAnyRowSelected && (
            <button
              className="btn btn-warning"
              onClick={() => setShowUpdateCategoryForm(true)}
            >
              Edit
            </button>
          )}
          {hasPermission("Delete Category") && isAnyRowSelected && (
            <button
              className="btn btn-danger"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Category Id</th>
              <th>Category Name</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.categoryId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(c.categoryId)}
                    onChange={() => handleRowSelect(c.categoryId)}
                  />
                </td>
                <td>{c.categoryId}</td>
                <td>{c.categoryName}</td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      c.status
                    )}`}
                  >
                    {getStatusLabel(c.status)}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdate(c)}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default CategoryList;
