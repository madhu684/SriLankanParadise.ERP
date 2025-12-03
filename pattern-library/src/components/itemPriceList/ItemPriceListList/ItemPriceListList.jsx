import React, { memo, useCallback, useContext } from "react";
import useItemPriceListList from "./useItemPriceListList";
import ErrorComponent from "../../errorComponent/errorComponent";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import { FiEye, FiEdit } from "react-icons/fi";
import {
  MdOutlineToggleOn,
  MdOutlineToggleOff,
  MdOutlineAssignmentLate,
} from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import ItemPriceList from "../ItemPriceList";
import moment from "moment";
import ItemPriceListUpdate from "../ItemPriceListUpdate/ItemPriceListUpdate";
import DeleteConfirmationModal from "../../confirmationModals/deleteConfirmationModal/deleteConfirmationModal";
import ItemPriceListView from "../ItemPriceListView/ItemPriceListView";
import { UserContext } from "../../../context/userContext";

// Memoized table row component
const PriceListRow = memo(
  ({ item, onEdit, onDelete, onView, hasPermission }) => {
    const handleEdit = useCallback(() => {
      onEdit(item);
    }, [item, onEdit]);

    const handleDelete = useCallback(() => {
      onDelete(item);
    }, [item, onDelete]);

    const handleView = useCallback(() => {
      onView(item);
    }, [item, onView]);

    return (
      <tr>
        <td className="fw-medium">{item.listName}</td>
        <td>{item.createdBy}</td>
        <td>{moment(item.effectiveDate).format("Do MMM YYYY")}</td>
        <td>
          {item.status === 5 ? (
            <span className="badge bg-secondary">Pending</span>
          ) : item.status === 1 ? (
            <span className="badge bg-success">Active</span>
          ) : (
            <span className="badge bg-danger">Inactive</span>
          )}
        </td>
        <td className="text-center">
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={handleView}
          >
            <FiEye className="me-1" /> View
          </button>
          <button
            className="btn btn-sm btn-outline-warning me-2"
            onClick={handleEdit}
          >
            <FiEdit className="me-1" />
            Edit
          </button>
          {item.status === 5 ? (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleDelete}
              disabled={!hasPermission("Approve Item Price List")}
            >
              <MdOutlineAssignmentLate className="me-1" /> Approve
            </button>
          ) : item.status === 1 ? (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleDelete}
              disabled={!hasPermission("Deactivate Item Price List")}
            >
              <MdOutlineToggleOff className="me-1" /> Deactivate
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-success"
              onClick={handleDelete}
              disabled={!hasPermission("Activate Item Price List")}
            >
              <MdOutlineToggleOn className="me-1" /> Activate
            </button>
          )}
        </td>
      </tr>
    );
  }
);

PriceListRow.displayName = "PriceListRow";

const ItemPriceListList = () => {
  const {
    itemPriceList,
    isLoadingItemPriceList,
    errorItemPriceList,
    showViewList,
    searchQuery,
    currentPage,
    itemsPerPage,
    paginatedList,
    showCreateListForm,
    showUpdateListForm,
    selectedItemPriceList,
    showDeleteModal,
    loading,
    submissionStatus,
    submissionMessage,
    paginate,
    setShowCreateListForm,
    setCurrentPage,
    setSearchQuery,
    handleSearch,
    handleOpenViewModal,
    handleCloseViewModal,
    handleOpenUpdateModal,
    handleOpenDeleteModal,
    handleCloseUpdateModal,
    handleCloseCreateModal,
    handleCloseDeleteModal,
    handleActivateDeactivate,
  } = useItemPriceListList();

  const { hasPermission } = useContext(UserContext);

  if (isLoadingItemPriceList) return <LoadingSpinner />;

  if (errorItemPriceList) {
    return (
      <ErrorComponent
        error={errorItemPriceList.message || "Error fetching data"}
      />
    );
  }

  if (showCreateListForm) {
    return <ItemPriceList handleClose={handleCloseCreateModal} />;
  }

  if (showUpdateListForm && selectedItemPriceList) {
    return (
      <ItemPriceListUpdate
        itemPriceList={selectedItemPriceList}
        handleClose={handleCloseUpdateModal}
      />
    );
  }

  if (showViewList && selectedItemPriceList) {
    return (
      <ItemPriceListView
        itemPriceList={selectedItemPriceList}
        show={showViewList}
        handleClose={handleCloseViewModal}
      />
    );
  }

  const hasPriceLists = itemPriceList && itemPriceList.length > 0;

  if (!hasPriceLists) {
    return (
      <div className="container mt-5">
        <h2 className="mb-4 text-center text-muted">Item Price Lists</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center vh-100"
          style={{ maxHeight: "70vh" }}
        >
          <div className="text-center mb-4">
            <h4 className="text-muted">No price lists created yet</h4>
            <p className="text-muted">
              Get started by creating your first price list.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => setShowCreateListForm(true)}
          >
            <FaPlus className="me-2" />
            Create Price List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 className="card-title mb-0 fw-bold">Item Price Lists</h2>
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center"
              onClick={() => setShowCreateListForm(true)}
            >
              <FaPlus className="me-2" />
              Create
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold">List Name</th>
                  <th className="fw-semibold">Created By</th>
                  <th className="fw-semibold">Effective Date</th>
                  <th className="fw-semibold">Status</th>
                  <th className="fw-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {itemPriceList.map((item) => (
                  <PriceListRow
                    key={item.id}
                    item={item}
                    onEdit={handleOpenUpdateModal}
                    onDelete={handleOpenDeleteModal}
                    onView={handleOpenViewModal}
                    hasPermission={hasPermission}
                  />
                ))}
              </tbody>
            </table>
            <DeleteConfirmationModal
              show={showDeleteModal}
              handleClose={handleCloseDeleteModal}
              handleConfirmDelete={handleActivateDeactivate}
              title={`Item Price List "${selectedItemPriceList?.listName}"`}
              submissionStatus={submissionStatus}
              message={submissionMessage}
              loading={loading}
              type={
                selectedItemPriceList?.status === 5
                  ? "Approve"
                  : selectedItemPriceList?.status === 1
                  ? "Deactivate"
                  : "Activate"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ItemPriceListList);
