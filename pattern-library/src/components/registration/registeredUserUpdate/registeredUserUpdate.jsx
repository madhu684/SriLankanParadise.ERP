import "./registeredUserUpdate.css";
import React from "react";
import AssignItems from "../../assignItems/assignItems.js";
import { Row, Col, Form, Button, Card } from "react-bootstrap";

function template() {
  const { showSuccessAlert, showFailureAlert } = this.state;
  return (
    <div className=" top-0 start-0 w-100 h-50 d-flex align-items-center justify-content-center">
      <div className="container mt-4 mb-4">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <h2 className="mb-3 text-black fw-bold">User Registration</h2>
            <div
              className="card bg-transparent"
              style={{
                backdropFilter: "blur(10px)",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                border: "0",
              }}
            >
              <div className="card-header bg-transparent">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <a
                      className={`nav-link disabled ${
                        this.state.activeTab === "basic"
                          ? "active tab-active"
                          : ""
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
                        this.state.activeTab === "user-module"
                          ? "active tab-active"
                          : ""
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
                        this.state.activeTab === "user-role"
                          ? "active tab-active"
                          : ""
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
                        this.state.activeTab === "role-permission"
                          ? "active tab-active"
                          : ""
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
                      {/* <h5 className="mt-1 mb-4 fw-semibold">
                        Please enter the user information
                      </h5> */}
                      <div className="row g-3">
                        <Row>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label style={{ fontWeight: "bold" }}>
                                First Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter First Name"
                                required
                                style={{
                                  width: "100%",
                                  borderColor: this.state.validationErrors.basic
                                    ?.firstname
                                    ? "red"
                                    : null,
                                }}
                                value={this.state.formData.basic.firstname}
                                onChange={(e) =>
                                  this.handleInputChange(
                                    "basic",
                                    "firstname",
                                    e.target.value
                                  )
                                }
                                className={`form-control focus-ring input-registration ${
                                  this.state.validFields.basic?.firstname
                                    ? "is-valid"
                                    : ""
                                } ${
                                  this.state.validationErrors.basic?.firstname
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              {this.state.validationErrors.basic?.firstname && (
                                <div className="invalid-feedback">
                                  {this.state.validationErrors.basic.firstname}
                                </div>
                              )}
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label style={{ fontWeight: "bold" }}>
                                Last Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Last Name"
                                required
                                style={{
                                  width: "100%",
                                  borderColor: this.state.validationErrors.basic
                                    ?.lastname
                                    ? "red"
                                    : null,
                                }}
                                value={this.state.formData.basic.lastname}
                                onChange={(e) =>
                                  this.handleInputChange(
                                    "basic",
                                    "lastname",
                                    e.target.value
                                  )
                                }
                                className={`form-control focus-ring input-registration ${
                                  this.state.validFields.basic?.lastname
                                    ? "is-valid"
                                    : ""
                                } ${
                                  this.state.validationErrors.basic?.lastname
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              {this.state.validationErrors.basic?.lastname && (
                                <div className="invalid-feedback">
                                  {this.state.validationErrors.basic.lastname}
                                </div>
                              )}
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mt-1">
                              <Form.Label style={{ fontWeight: "bold" }}>
                                User Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="User Name"
                                required
                                style={{ width: "100%" }}
                                value={this.state.formData.basic.username}
                                onChange={(e) =>
                                  this.handleInputChange(
                                    "basic",
                                    "username",
                                    e.target.value
                                  )
                                }
                                className={`form-control focus-ring input-registration ${
                                  this.state.validFields.basic?.username
                                    ? "is-valid"
                                    : ""
                                } ${
                                  this.state.validationErrors.basic?.username
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="username"
                              />
                              {this.state.validationErrors.basic?.username && (
                                <div className="invalid-feedback">
                                  {this.state.validationErrors.basic.username}
                                </div>
                              )}
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label style={{ fontWeight: "bold" }}>
                                Status
                              </Form.Label>
                              <Form.Select
                                value={this.state.formData.basic.status}
                                onChange={(e) => {
                                  const selectedStatus = e.target.value;
                                  this.setState((prevState) => ({
                                    formData: {
                                      ...prevState.formData,
                                      basic: {
                                        ...prevState.formData.basic,
                                        status: selectedStatus,
                                      },
                                    },
                                    validationErrors: {
                                      ...prevState.validationErrors,
                                      basic: {
                                        ...prevState.validationErrors.basic,
                                        status: "", // Clear the error on change if necessary
                                      },
                                    },
                                  }));
                                }}
                              >
                                <option value="">Select Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mt-1">
                              <Form.Label style={{ fontWeight: "bold" }}>
                                Email
                              </Form.Label>
                              <Form.Control
                                type="email"
                                placeholder="Enter Email"
                                required
                                style={{ width: "100%" }}
                                value={this.state.formData.basic.email}
                                onChange={(e) =>
                                  this.handleInputChange(
                                    "basic",
                                    "email",
                                    e.target.value
                                  )
                                }
                                className={`form-control focus-ring input-registration ${
                                  this.state.validFields.basic?.email
                                    ? "is-valid"
                                    : ""
                                } ${
                                  this.state.validationErrors.basic?.email
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="email"
                              />
                              {this.state.validationErrors.basic?.email && (
                                <div className="invalid-feedback">
                                  {this.state.validationErrors.basic.email}
                                </div>
                              )}
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group className="mt-1">
                              <Form.Label style={{ fontWeight: "bold" }}>
                                Contact Number
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Contact Number"
                                required
                                style={{ width: "100%" }}
                                value={this.state.formData.basic.contactNo}
                                onChange={(e) =>
                                  this.handleInputChange(
                                    "basic",
                                    "contactNo",
                                    e.target.value
                                  )
                                }
                                className={`form-control focus-ring input-registration ${
                                  this.state.validFields.basic?.contactNo
                                    ? "is-valid"
                                    : ""
                                } ${
                                  this.state.validationErrors.basic?.contactNo
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="contactNo"
                              />
                              {this.state.validationErrors.basic?.contactNo && (
                                <div className="invalid-feedback">
                                  {this.state.validationErrors.basic.contactNo}
                                </div>
                              )}
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6} className="mt-1">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: "bold" }}>
                                Department
                              </Form.Label>
                              <Form.Select
                                id="department"
                                required
                                style={{ width: "100%" }}
                                value={this.state.formData.basic.department}
                                onChange={(e) => {
                                  const selectedDepartment = e.target.value;
                                  this.handleInputChange(
                                    "basic",
                                    "department",
                                    selectedDepartment
                                  );
                                  // Reset warehouseLocation in formData when department changes
                                  this.setState((prevState) => ({
                                    formData: {
                                      ...prevState.formData,
                                      basic: {
                                        ...prevState.formData.basic,
                                        warehouse: "", // Reset warehouse when department changes
                                      },
                                    },
                                  }));
                                }}
                                className={`form-control focus-ring input-registration ${
                                  this.state.validFields.basic?.department
                                    ? "is-valid"
                                    : ""
                                } ${
                                  this.state.validationErrors.basic?.department
                                    ? "is-invalid"
                                    : ""
                                }`}
                              >
                                <option value="">Select Department</option>
                                {this.state.locations
                                  .filter(
                                    (location) =>
                                      location.locationType.name ===
                                      "Department"
                                  )
                                  .map((location) => (
                                    <option
                                      key={location.locationId}
                                      value={location.locationId}
                                    >
                                      {location.locationName}
                                    </option>
                                  ))}
                              </Form.Select>
                              {this.state.validationErrors.basic
                                ?.department && (
                                <div className="invalid-feedback">
                                  {this.state.validationErrors.basic.department}
                                </div>
                              )}
                            </Form.Group>
                          </Col>
                          <Col md={6} className="mt-1">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: "bold" }}>
                                Warehouses
                              </Form.Label>
                              <Form.Select
                                id="warehouse"
                                required
                                style={{ width: "100%" }}
                                value={this.state.formData.basic.warehouse}
                                onChange={(e) =>
                                  this.handleInputChange(
                                    "basic",
                                    "warehouse",
                                    e.target.value
                                  )
                                }
                                disabled={!this.state.formData.basic.department}
                                className={`form-control focus-ring input-registration ${
                                  this.state.validFields.basic?.warehouse
                                    ? "is-valid"
                                    : ""
                                } ${
                                  this.state.validationErrors.basic?.warehouse
                                    ? "is-invalid"
                                    : ""
                                }`}
                              >
                                <option value="">Select Warehouses</option>
                                {this.state.locations
                                  .filter(
                                    (location) =>
                                      location.parentId ===
                                        parseInt(
                                          this.state.formData.basic.department
                                        ) &&
                                      location.locationType.name === "Warehouse"
                                  )
                                  .map((location) => (
                                    <option
                                      key={location.locationId}
                                      value={location.locationId}
                                    >
                                      {location.locationName}
                                    </option>
                                  ))}
                              </Form.Select>
                              {this.state.validationErrors.basic?.warehouse && (
                                <div className="invalid-feedback">
                                  {this.state.validationErrors.basic.warehouse}
                                </div>
                              )}
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6} sm={12} className="mb-3">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: "bold" }}>
                                Production Stage
                              </Form.Label>
                              <Form.Select
                                value={this.state.selectedProductionStageId} // This tracks the selected stage ID
                                onChange={this.handleSelectProductionStage} // Handles selection
                                style={{ width: "100%" }}
                                className={`form-control focus-ring input-registration ${
                                  this.state.validFields.basic?.productionStage
                                    ? "is-valid"
                                    : ""
                                } ${
                                  this.state.validationErrors.basic
                                    ?.productionStage
                                    ? "is-invalid"
                                    : ""
                                }`}
                              >
                                <option value="">
                                  Select Production Stage
                                </option>
                                {this.state.availableProductionStages.map(
                                  (stage) => (
                                    <option key={stage.id} value={stage.id}>
                                      {stage.name}{" "}
                                      {/* Display the stage name */}
                                    </option>
                                  )
                                )}
                              </Form.Select>
                              {this.state.validationErrors.basic
                                ?.productionStage && (
                                <div className="invalid-feedback">
                                  {
                                    this.state.validationErrors.basic
                                      .productionStage
                                  }
                                </div>
                              )}
                            </Form.Group>
                          </Col>

                          {/* Log the selected stages before rendering */}
                          {console.log(
                            "Current state of selected production stages:",
                            this.state.formData.basic.productionStages
                          )}
                          {this.state.formData.basic.productionStages.length >
                            0 && (
                            <Col md={6} className="mt-4">
                              <Card>
                                <Card.Header>
                                  <h6 className="card-title-small">
                                    Selected Stages
                                  </h6>
                                </Card.Header>
                                <Card.Body>
                                  <div className="selected-stages">
                                    {this.state.formData.basic.productionStages.map(
                                      (stage) => (
                                        <div
                                          key={stage.id}
                                          className="d-flex justify-content-between align-items-center mb-2"
                                        >
                                          <span className="me-2">
                                            {stage.name}
                                          </span>
                                          <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() =>
                                              this.handleRemoveProductionStage(
                                                stage.id
                                              )
                                            } // Remove stage by its ID
                                            className="ms-2"
                                          >
                                            Remove
                                          </Button>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          )}
                        </Row>
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

                      {/* Log the current state of available and assigned modules */}

                      {console.log(
                        "Current assignedModules state:",
                        this.state.formData["user-module"].assignedModules
                      )}

                      {/* Render the AssignItems component for user module assignment */}
                      <AssignItems
                        label="Assigned Modules"
                        choise="module"
                        choiseFor="User"
                        availableItems={
                          this.state.formData["user-module"].availableModules
                        }
                        assignedItems={
                          this.state.formData["user-module"].assignedModules
                        } // This should be populated by fetchUserModules
                        handleSelect={this.handleSelectModule}
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
                        this.state.activeTab === "user-role"
                          ? "show active"
                          : ""
                      }`}
                      id="user-role"
                    >
                      <h5 className="mt-1 mb-4 fw-semibold">
                        Please assign user roles for each module
                      </h5>
                      <hr className="my-3" />

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
                                this.handleSelectRole(itemId, module.id)
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

                      {/* Log the current state of permissions */}
                      {console.log(
                        "Current State of Assigned Permissions:",
                        this.state.permissions
                      )}
                      {console.log(
                        "Current State of Assigned Modules:",
                        this.state.formData["user-module"].assignedModules
                      )}

                      {/* Render the AssignItems component for each assigned module */}
                      {this.state.formData[
                        "user-module"
                      ].assignedModules.flatMap((module) =>
                        module.roles.assignedRoles?.map((role) => (
                          <>
                            <AssignItems
                              key={role.id}
                              label={`Module ${role.name}`}
                              choise="permission"
                              choiseFor={`${role.name}`}
                              availableItems={
                                role.permissions.availablePermissions
                              }
                              assignedItems={
                                role.permissions.assignedPermissions
                              }
                              handleSelect={(itemId) =>
                                this.handleSelectPermission(
                                  module.id,
                                  role.id,
                                  itemId
                                )
                              }
                              handleRemove={(itemId) =>
                                this.handleRemovePermission(
                                  module.id,
                                  role.id,
                                  itemId
                                )
                              }
                            />
                            {this.state.validationErrors["role-permission"][
                              role.id
                            ] && (
                              <div className="invalid-feedback d-block">
                                {
                                  this.state.validationErrors[
                                    "role-permission"
                                  ][role.id]
                                }
                              </div>
                            )}
                            <br />
                          </>
                        ))
                      )}
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
                        style={{
                          backgroundColor: "#BFB69F",
                          color: "white",
                          borderRadius: "5px",
                          fontWeight: "bold",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = "#666053";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = "#88857c";
                        }}
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
                        style={{
                          backgroundColor: "#666053",
                          color: "white",
                          borderRadius: "24px",
                          fontWeight: "bold",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = "#666053";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = "#88857c";
                        }}
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
                        style={{
                          backgroundColor: "#666053",
                          color: "white",
                          borderRadius: "5px",
                          fontWeight: "bold",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = "#666053";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = "#88857c";
                        }}
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
    </div>
  );
}

export default template;
