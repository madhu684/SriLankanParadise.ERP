import "./companyDetail.css";
import React from "react";
import AddCompanyForm from "./addCompanyForm/addCompanyForm";
import DeleteConfirmationModal from "../../confirmationModals/deleteConfirmationModal/deleteConfirmationModal";

function template() {
  const { data, showModal, showDeleteConfirmation, showModalInParent } =
    this.state;
  return (
    <div className="p-3">
      <h2 className="mb-4">Companies</h2>
      <div className="mb-3">
        <button
          className="btn btn-primary btn-width"
          onClick={this.handleShowModal}
        >
          Add New Company
        </button>
      </div>
      <table className="table">
        <thead className="table-light">
          <tr>
            <th scope="col">Company Name</th>
            <th scope="col">Subscription Plan</th>
            <th scope="col">Subscription Expired Date</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.companyId}>
              <td>{item.companyName}</td>
              <td>
                {item.subscriptionPlan
                  ? item.subscriptionPlan.planName
                  : "Not Subscribed"}
              </td>
              <td>
                {item.subscriptionExpiredDate
                  ? item.subscriptionExpiredDate
                  : "Not Applied"}
              </td>
              <td>{item.status ? "Active" : "Inactive"}</td>
              <td>
                <button
                  className="btn btn-outline-secondary btn-sm me-2"
                  //   onClick={()}
                >
                  Update
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => this.handleDeleteCompany(item.companyId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModalInParent && (
        <AddCompanyForm
          show={showModal}
          handleClose={this.handleCloseModal}
          handleCompanyAdded={this.handleCompanyAdded}
        />
      )}
      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        handleClose={this.handleCloseDeleteConfirmation}
        handleConfirmDelete={this.handleConfirmDeleteCompany}
        title={"Company"}
      />
    </div>
  );
}

export default template;
