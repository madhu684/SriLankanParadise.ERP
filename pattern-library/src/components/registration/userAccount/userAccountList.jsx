import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ErrorComponent from "../../errorComponent/errorComponent";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import useUserAccountList from "./useUserAccountList";
//import Registration from "../registrationUpdate/registration";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Pagination from "../../common/Pagination/Pagination"; // Import the new Pagination component
import ConfirmationModal from "../../confirmationModals/confirmationModal/confirmationModal";
import Registration from "../registration";
import "./userAccountList.css"; // Import the CSS file
import RegistrationUpdate from "../registeredUserUpdate/registeredUserUpdate";

const UserAccountList = () => {
  const navigate = useNavigate(); // Hook to manage navigation

  const {
    userAccounts,
    isLoadingData,
    error,
    selectedRows,
    showEditForm,
    showDeactivateConfirmation,
    showActivateConfirmation,
    selectedUser,
    showRegistrationForm,
    handleRowSelect,
    setShowEditForm,
    getStatusBadgeClass,
    getStatusLabel,
    handleEdit,
    handleClose,
    handleRefetchTrue,
    selectedRowData,
    userDetail,
    handleDeactivate,
    handleActivate,
    setShowRegistrationForm,
    setShowConfirmation,
    showConfirmation,
    setShowActivateConfirmation,
    setShowDeactivateConfirmation,
    setSelectedUser,
    userActivate,
    userDeactivate
  } = useUserAccountList();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15); // Set items per page to 6

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAccounts = userAccounts.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contactNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAccounts = filteredAccounts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  console.log("Selected user: ", selectedUser);

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (isLoadingData || (userAccounts && !(userAccounts.length >= 0))) {
    return <LoadingSpinner />;
  }
  if (showEditForm) {
    if (userDetail) {
      console.log("Rendering Registration with user:", userDetail);
      console.log("Rendering Registration with userId:", userDetail.userId);
    } else {
      console.log(
        "No userDetail available, using selectedRowData:",
        selectedRowData
      );
    }

    // return (
    //   <Registration
    //     userId={userDetail?.userId || selectedRowData[0]?.userId}
    //     user={userDetail || selectedRowData[0]}
    //     handleClose={() => {
    //       console.log("Closing Registration form");
    //       setShowEditForm(false);
    //     }}
    //   />

    return (
      <RegistrationUpdate
        userId={userDetail?.userId || selectedRowData[0]?.userId}
        user={userDetail || selectedRowData[0]}
        handleClose={() => {
          setShowEditForm(false);
        }}
        handleRefetchTrue={handleRefetchTrue}
      />
    );
  } else {
    console.log(
      "Not rendering Registration component. Current showEditForm state:",
      showEditForm
    );
  }

  if (showRegistrationForm) {
    return <Registration />;
  }

  if (userAccounts.length === 0) {
    return (
      <div className="container mt-4">
        <h2>User Accounts</h2>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
          style={{ maxHeight: "80vh" }}
        >
          <p>You haven't created any user account. Create a new one.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowRegistrationForm(true)}
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>User Accounts</h2>
      <div className="mt-3 d-flex justify-content-start align-items-center">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowRegistrationForm(true)}
        >
          Create
        </button>
      </div>
      <div className="d-flex justify-content-end mb-3">
        <div className="input-group search-bar">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="input-group-text">
            <FaSearch />
          </span>
        </div>
      </div>
      <div className="table-responsive">
        <table
          className="table mt-2"
          style={{ minWidth: "1000px", overflowX: "auto" }}
        >
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Contact No</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAccounts.map((user) => (
              <tr key={user.userId}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.contactNo}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      user.status
                    )}`}
                  >
                    {getStatusLabel(user.status)}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleEdit(user)}
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
                  {user.status ? (
                    <button
                      className="btn btn-danger me-2"
                      onClick={() => {
                        setShowDeactivateConfirmation(true);
                        handleDeactivate(user);
                      }}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowActivateConfirmation(true);
                        handleActivate(user);
                      }}
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredAccounts.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
      <ConfirmationModal
        show={showActivateConfirmation}
        handleClose={() => setShowActivateConfirmation(false)}
        handleConfirm={() => userActivate(parseInt(selectedUser?.userId))}
        title="Confirm Activation"
        message={`Are you sure you want to activate "${selectedUser?.firstname} ${selectedUser?.lastname}"?`}
        confirmButtonText="Activate"
        cancelButtonText="Cancel"
      />
      ;{/* Deactivate Confirmation Modal */}
      <ConfirmationModal
        show={showDeactivateConfirmation}
        handleClose={() => setShowDeactivateConfirmation(false)}
        handleConfirm={() => userDeactivate(parseInt(selectedUser?.userId))}
        title="Confirm Deactivation"
        message={`Are you sure you want to deactivate "${selectedUser?.firstname} ${selectedUser?.lastname}"?`}
        confirmButtonText="Deactivate"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default UserAccountList;
