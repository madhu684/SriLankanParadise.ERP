import "./registration.css";
import React from "react";
import AssignItems from "../assignItems/assignItems.js";

function template() {
  const { showSuccessAlert, showFailureAlert } = this.state;
  return (
    <div className="container mt-4 mb-4">
      <div className="row justify-content-center">
        <div className="col-md-11">
          <h4 className="mb-3 fw-semibold">User Registration</h4>
          <div className="card border-secondary">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <a
                    className={`nav-link disabled ${
                      this.state.activeTab === "basic" ? "active" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="bi bi-1-circle"
                      viewBox="0 0 18 18"
                    >
                      <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M9.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383z" />
                    </svg>
                    <span className="ms-2">User Information</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link disabled ${
                      this.state.activeTab === "user-module" ? "active" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="bi bi-2-circle"
                      viewBox="0 0 18 18"
                    >
                      <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.646 6.24v.07H5.375v-.064c0-1.213.879-2.402 2.637-2.402 1.582 0 2.613.949 2.613 2.215 0 1.002-.6 1.667-1.287 2.43l-.096.107-1.974 2.22v.077h3.498V12H5.422v-.832l2.97-3.293c.434-.475.903-1.008.903-1.705 0-.744-.557-1.236-1.313-1.236-.843 0-1.336.615-1.336 1.306Z" />
                    </svg>
                    <span className="ms-2">User Modules</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link disabled ${
                      this.state.activeTab === "user-role" ? "active" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="bi bi-3-circle"
                      viewBox="0 0 18 18"
                    >
                      <path d="M7.918 8.414h-.879V7.342h.838c.78 0 1.348-.522 1.342-1.237 0-.709-.563-1.195-1.348-1.195-.79 0-1.312.498-1.348 1.055H5.275c.036-1.137.95-2.115 2.625-2.121 1.594-.012 2.608.885 2.637 2.062.023 1.137-.885 1.776-1.482 1.875v.07c.703.07 1.71.64 1.734 1.917.024 1.459-1.277 2.396-2.93 2.396-1.705 0-2.707-.967-2.754-2.144H6.33c.059.597.68 1.06 1.541 1.066.973.006 1.6-.563 1.588-1.354-.006-.779-.621-1.318-1.541-1.318Z" />
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8" />
                    </svg>
                    <span className="ms-2">User Roles</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link disabled ${
                      this.state.activeTab === "role-permission" ? "active" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="bi bi-4-circle"
                      viewBox="0 0 18 18"
                    >
                      <path d="M7.519 5.057c.22-.352.439-.703.657-1.055h1.933v5.332h1.008v1.107H10.11V12H8.85v-1.559H4.978V9.322c.77-1.427 1.656-2.847 2.542-4.265ZM6.225 9.281v.053H8.85V5.063h-.065c-.867 1.33-1.787 2.806-2.56 4.218Z" />
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8" />
                    </svg>
                    <span className="ms-2">Role Permissions</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-body card-height overflow-y-auto">
              <form>
                <div className="tab-content">
                  {/* Basic Tab */}
                  <div
                    className={`tab-pane fade ${
                      this.state.activeTab === "basic" ? "show active" : ""
                    }`}
                    id="basic"
                  >
                    <h5 className="mt-1 mb-4 fw-semibold">
                      Please enter the user information
                    </h5>
                    <div className="row g-3">
                      <div className="form-group col-md-4">
                        <label htmlFor="firstname" className="form-label">
                          First Name
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            this.state.validFields.basic?.firstname
                              ? "is-valid"
                              : ""
                          } ${
                            this.state.validationErrors.basic?.firstname
                              ? "is-invalid"
                              : ""
                          }`}
                          id="firstname"
                          value={this.state.formData.basic.firstname}
                          onChange={(e) =>
                            this.handleInputChange(
                              "basic",
                              "firstname",
                              e.target.value
                            )
                          }
                          required
                        />
                        {this.state.validationErrors.basic?.firstname && (
                          <div className="invalid-feedback">
                            {this.state.validationErrors.basic.firstname}
                          </div>
                        )}
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="lastname" className="form-label">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastname"
                          value={this.state.formData.basic.lastname}
                          onChange={(e) =>
                            this.handleInputChange(
                              "basic",
                              "lastname",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="username" className="form-label">
                          User Name
                        </label>
                        <div className="input-group has-validation">
                          <span
                            className="input-group-text"
                            id="inputGroupPrepend"
                          >
                            @
                          </span>
                          <input
                            type="text"
                            className={`form-control ${
                              this.state.validFields.basic?.username
                                ? "is-valid"
                                : ""
                            } ${
                              this.state.validationErrors.basic?.username
                                ? "is-invalid"
                                : ""
                            }`}
                            id="username"
                            value={this.state.formData.basic.username}
                            onChange={(e) =>
                              this.handleInputChange(
                                "basic",
                                "username",
                                e.target.value
                              )
                            }
                            required
                          />
                          {this.state.validationErrors.basic?.username && (
                            <div className="invalid-feedback">
                              {this.state.validationErrors.basic.username}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className={`form-control ${
                            this.state.validFields.basic?.email
                              ? "is-valid"
                              : ""
                          } ${
                            this.state.validationErrors.basic?.email
                              ? "is-invalid"
                              : ""
                          }`}
                          id="email"
                          value={this.state.formData.basic.email}
                          onChange={(e) =>
                            this.handleInputChange(
                              "basic",
                              "email",
                              e.target.value
                            )
                          }
                          required
                        />
                        {this.state.validationErrors.basic?.email && (
                          <div className="invalid-feedback">
                            {this.state.validationErrors.basic.email}
                          </div>
                        )}
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="contactNo" className="form-label">
                          Contact Number
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            this.state.validFields.basic?.contactNo
                              ? "is-valid"
                              : ""
                          } ${
                            this.state.validationErrors.basic?.contactNo
                              ? "is-invalid"
                              : ""
                          }`}
                          id="contactNo"
                          value={this.state.formData.basic.contactNo}
                          onChange={(e) =>
                            this.handleInputChange(
                              "basic",
                              "contactNo",
                              e.target.value
                            )
                          }
                          required
                        />
                        {this.state.validationErrors.basic?.contactNo && (
                          <div className="invalid-feedback">
                            {this.state.validationErrors.basic.contactNo}
                          </div>
                        )}
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <input
                          type="password"
                          className={`form-control ${
                            this.state.validFields.basic?.password
                              ? "is-valid"
                              : ""
                          } ${
                            this.state.validationErrors.basic?.password
                              ? "is-invalid"
                              : ""
                          }`}
                          id="password"
                          value={this.state.formData.basic.password}
                          onChange={(e) =>
                            this.handleInputChange(
                              "basic",
                              "password",
                              e.target.value
                            )
                          }
                          required
                        />
                        {this.state.validationErrors.basic?.password && (
                          <div className="invalid-feedback">
                            {this.state.validationErrors.basic.password}
                          </div>
                        )}
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          className={`form-control ${
                            this.state.validFields.basic?.confirmPassword
                              ? "is-valid"
                              : ""
                          } ${
                            this.state.validationErrors.basic?.confirmPassword
                              ? "is-invalid"
                              : ""
                          }`}
                          id="confirmPassword"
                          value={this.state.formData.basic.confirmPassword}
                          onChange={(e) =>
                            this.handleInputChange(
                              "basic",
                              "confirmPassword",
                              e.target.value
                            )
                          }
                          required
                        />
                        {this.state.validationErrors.basic?.confirmPassword && (
                          <div className="invalid-feedback">
                            {this.state.validationErrors.basic.confirmPassword}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* User Module Assign Tab */}
                  <div
                    className={`tab-pane fade ${
                      this.state.activeTab === "user-module"
                        ? "show active"
                        : ""
                    }`}
                    id="user-module"
                  >
                    <h5 className="mt-1 mb-4 fw-semibold">
                      Please assign modules for the user
                    </h5>
                    <hr className="my-3" />
                    {/* Add your user module assign form fields here */}
                    <AssignItems
                      label=""
                      choise="module"
                      choiseFor="User"
                      availableItems={
                        this.state.formData["user-module"].availableModules
                      }
                      assignedItems={
                        this.state.formData["user-module"].assignedModules
                      }
                      handleSelect={this.handleModuleSelect}
                      handleRemove={this.handleRemoveModule}
                    />
                    {this.state.validationErrors["user-module"].modules && (
                      <div className="invalid-feedback d-block">
                        {this.state.validationErrors["user-module"].modules}
                      </div>
                    )}
                  </div>
                  {/* User Role Assign Tab */}
                  <div
                    className={`tab-pane fade ${
                      this.state.activeTab === "user-role" ? "show active" : ""
                    }`}
                    id="user-role"
                  >
                    <h5 className="mt-1 mb-4 fw-semibold">
                      Please assign user roles for each module
                    </h5>
                    <hr className="my-3" />
                    {/* Add your user role assign form fields here */}
                    {/* Render AssignItems for each assigned module */}
                    {this.state.formData["user-module"].assignedModules.map(
                      (module) => (
                        <>
                          <AssignItems
                            key={module.id}
                            label={`Module ${module.name}`}
                            choise="role"
                            choiseFor={`${module.name}`}
                            availableItems={module.roles.availableRoles}
                            assignedItems={module.roles.assignedRoles}
                            handleSelect={(itemId) =>
                              this.handleRoleSelect(itemId, module.id)
                            }
                            handleRemove={(itemId) =>
                              this.handleRemoveRole(itemId, module.id)
                            }
                          />
                          {this.state.validationErrors["user-role"][
                            module.id
                          ] && (
                            <div className="invalid-feedback d-block">
                              {
                                this.state.validationErrors["user-role"][
                                  module.id
                                ]
                              }
                            </div>
                          )}
                          <br />
                        </>
                      )
                    )}
                  </div>
                  {/* Role Permission Assign Tab */}
                  <div
                    className={`tab-pane fade ${
                      this.state.activeTab === "role-permission"
                        ? "show active"
                        : ""
                    }`}
                    id="role-permission"
                  >
                    <h5 className="mt-1 mb-4 fw-semibold">
                      Please assign role permissions for each module
                    </h5>
                    <hr className="my-3" />
                    {/* Add your role permission assign form fields here */}
                    {/* Render AssignItems for each assigned module */}
                    {this.state.formData["user-module"].assignedModules.map(
                      (module) => (
                        <>
                          <AssignItems
                            key={module.id}
                            label={`Module ${module.name}`}
                            choise="permission"
                            choiseFor={`${module.name}`}
                            availableItems={
                              module.permissions.availablePermissions
                            }
                            assignedItems={
                              module.permissions.assignedPermissions
                            }
                            handleSelect={(itemId) =>
                              this.handleRolePermissionSelect(itemId, module.id)
                            }
                            handleRemove={(itemId) =>
                              this.handleRemoveRolePermission(itemId, module.id)
                            }
                          />
                          {this.state.validationErrors["role-permission"][
                            module.id
                          ] && (
                            <div className="invalid-feedback d-block">
                              {
                                this.state.validationErrors["role-permission"][
                                  module.id
                                ]
                              }
                            </div>
                          )}
                          <br />
                        </>
                      )
                    )}
                    <div>
                      {showSuccessAlert && (
                        <div className="alert alert-success" role="alert">
                          Registration successful! Your data have been saved.
                        </div>
                      )}
                      {showFailureAlert && (
                        <div className="alert alert-danger" role="alert">
                          Registration failed! Please try again.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
              <div
                className={`d-flex mt-3 ${
                  this.state.activeTab === "basic"
                    ? "justify-content-end"
                    : "justify-content-between"
                }`}
              >
                {this.state.activeTab !== "basic" && (
                  <div className="btn-width">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={this.handlePrevious}
                    >
                      Previous
                    </button>
                  </div>
                )}
                {this.state.activeTab !== "role-permission" ? (
                  <div className="btn-width-reg">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={this.handleNext}
                    >
                      Next
                    </button>
                  </div>
                ) : (
                  <div className="btn-width-reg">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={this.handleSave}
                      disabled={this.state.registrationSuccessful}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default template;
