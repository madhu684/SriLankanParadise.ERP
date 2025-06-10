import React, { useState } from "react";
import { Badge, Card, Col, Modal, Row, Spinner } from "react-bootstrap";
import useViewUserDetails from "./viewUserDetails";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import {
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaWarehouse,
} from "react-icons/fa";

const ViewUserDetails = ({ user, show, onHide }) => {
  const {
    userLocations,
    userModules,
    userRoles,
    userPermissions,
    userLocationsLoading,
    userModulesLoading,
    userRolesLoading,
    userPermissionsLoading,
    userLocationsError,
    errors,
  } = useViewUserDetails(user);

  const [searchText, setSearchText] = useState("");

  const handlePermissionSearch = (e) => {
    setSearchText(e.target.value);
  };

  console.log("User details:", user);

  const getStatusBadge = (status) => {
    return status === true ? (
      <Badge bg="success" className="px-3 py-2 rounded-pill fs-6">
        <i className="bi bi-check-circle me-1"></i>Active
      </Badge>
    ) : (
      <Badge bg="danger" className="px-3 py-2 rounded-pill fs-6">
        <i className="bi bi-x-circle me-1"></i>Inactive
      </Badge>
    );
  };

  const renderBasicInfo = () => (
    <Card className="border-0 shadow-sm mb-4 overflow-hidden">
      <Card.Header className="bg-gradient bg-secondary text-white border-0 py-3">
        <div className="d-flex align-items-center">
          <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-person-circle text-secondary"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>
          </div>
          <h5 className="mb-0 fw-bold">Personal Information</h5>
        </div>
      </Card.Header>
      <Card.Body className="p-4 bg-light bg-opacity-25">
        <Row className="g-4">
          <Col lg={6}>
            <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm h-100">
              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-person text-primary"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                </svg>
              </div>
              <div className="flex-grow-1">
                <label className="form-label text-muted mb-1 small fw-semibold">
                  First Name
                </label>
                <p className="mb-0 fw-bold text-dark fs-6">
                  {user.firstname || "N/A"}
                </p>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm h-100">
              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-person text-primary"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                </svg>
              </div>
              <div className="flex-grow-1">
                <label className="form-label text-muted mb-1 small fw-semibold">
                  Last Name
                </label>
                <p className="mb-0 fw-bold text-dark fs-6">
                  {user.lastname || "N/A"}
                </p>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm h-100">
              <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-at text-info"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
                </svg>
              </div>
              <div className="flex-grow-1">
                <label className="form-label text-muted mb-1 small fw-semibold">
                  Username
                </label>
                <p className="mb-0 fw-bold text-dark fs-6">
                  {user?.username || "N/A"}
                </p>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm h-100">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-check-circle text-success"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                </svg>
              </div>
              <div className="flex-grow-1">
                <label className="form-label text-muted mb-1 small fw-semibold">
                  Status
                </label>
                <div className="mt-1">{getStatusBadge(user?.status)}</div>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm h-100">
              <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                <FaEnvelope className="text-warning fs-6" />
              </div>
              <div className="flex-grow-1">
                <label className="form-label text-muted mb-1 small fw-semibold">
                  Email
                </label>
                <p className="mb-0 fw-bold text-dark fs-6 text-break">
                  {user?.email || "N/A"}
                </p>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm h-100">
              <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-3">
                <FaPhone className="text-secondary fs-6" />
              </div>
              <div className="flex-grow-1">
                <label className="form-label text-muted mb-1 small fw-semibold">
                  Contact Number
                </label>
                <p className="mb-0 fw-bold text-dark fs-6">
                  {user?.contactNo || "N/A"}
                </p>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm h-100">
              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                <FaBuilding className="text-primary fs-6" />
              </div>
              <div className="flex-grow-1">
                <label className="form-label text-muted mb-1 small fw-semibold">
                  Department
                </label>
                <p className="mb-0 fw-bold text-dark fs-6">
                  {userLocations?.find(
                    (loc) => loc.location.locationType.name === "Department"
                  )?.location.locationName || "N/A"}
                </p>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm h-100">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                <FaWarehouse className="text-success fs-6" />
              </div>
              <div className="flex-grow-1">
                <label className="form-label text-muted mb-1 small fw-semibold">
                  Warehouse
                </label>
                <p className="mb-0 fw-bold text-dark fs-6">
                  {userLocations?.find(
                    (loc) => loc.location.locationType.name === "Warehouse"
                  )?.location.locationName || "N/A"}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  const renderUserModules = () => (
    <Card className="border-0 shadow-sm mb-4 overflow-hidden">
      <Card.Header className="bg-gradient bg-info text-white border-0 py-3">
        <div className="d-flex align-items-center">
          <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-grid-3x3-gap text-info"
              viewBox="0 0 16 16"
            >
              <path d="M4 2v2H2V2h2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zM9 2v2H7V2h2zm5 0v2h-2V2h2zM4 7v2H2V7h2zm5 0v2H7V7h2zm5 0h-2v2h2V7zM4 12v2H2v-2h2zm5 0v2H7v-2h2zm5 0v2h-2v-2h2z" />
            </svg>
          </div>
          <h5 className="mb-0 fw-bold">Assigned Modules</h5>
        </div>
      </Card.Header>
      <Card.Body className="p-4 bg-light bg-opacity-25">
        {userModulesLoading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="text-center">
              <ButtonLoadingSpinner />
              <p className="mt-3 text-muted">Loading modules...</p>
            </div>
          </div>
        ) : errors.userModulesError ? (
          <div
            className="alert alert-danger border-0 rounded-3 shadow-sm"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle me-2"></i>
            {errors.userModulesError ||
              "An error occurred while fetching Modules."}
          </div>
        ) : userModules && userModules.length > 0 ? (
          <Row className="g-3">
            {userModules.map((module) => (
              <Col lg={6} xl={4} key={module.moduleId}>
                <div className="bg-white rounded-3 p-3 shadow-sm border-0 h-100 hover-lift transition-all">
                  <div className="d-flex align-items-center">
                    <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="bi bi-puzzle text-info fs-5"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">
                        {module.moduleName}
                      </h6>
                      <small className="text-muted">Module</small>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-inbox text-muted display-4"></i>
            <p className="text-muted mt-3 mb-0">
              No modules assigned to this user.
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  const renderUserRoles = () => {
    return (
      <Card className="border-0 shadow-sm mb-4 overflow-hidden">
        <Card.Header className="bg-gradient bg-success text-white border-0 py-3">
          <div className="d-flex align-items-center">
            <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-people text-success"
                viewBox="0 0 16 16"
              >
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002A.274.274 0 0 1 15 13H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
              </svg>
            </div>
            <h5 className="mb-0 fw-bold">User Roles</h5>
          </div>
        </Card.Header>
        <Card.Body className="p-4 bg-light bg-opacity-25">
          {userRolesLoading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="text-center">
                <ButtonLoadingSpinner />
                <p className="mt-3 text-muted">Loading roles...</p>
              </div>
            </div>
          ) : errors.userRolesError ? (
            <div
              className="alert alert-danger border-0 rounded-3 shadow-sm"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle me-2"></i>
              {errors.userRolesError ||
                "An error occurred while fetching Roles."}
            </div>
          ) : userRoles && userRoles.length > 0 ? (
            <Row className="g-3">
              {userRoles.map((role) => (
                <Col lg={6} xl={4} key={role.roleId}>
                  <div className="bg-white rounded-3 p-3 shadow-sm border-0 h-100 hover-lift transition-all">
                    <div className="d-flex align-items-center">
                      <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                        <i className="bi bi-person-badge text-success fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold text-dark">
                          {role.roleName}
                        </h6>
                        <small className="text-muted">Role</small>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted display-4"></i>
              <p className="text-muted mt-3 mb-0">
                No roles assigned to this user.
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  const renderRolePermissions = ({ searchText, handleSearch }) => {
    const filteredPermissions = (userPermissions || []).filter((permission) =>
      permission.permission?.permissionName
        ?.toLowerCase()
        .includes(searchText.toLowerCase())
    );

    return (
      <Card className="border-0 shadow-sm mb-4 overflow-hidden">
        <Card.Header className="bg-gradient bg-warning text-dark border-0 py-3">
          <div className="d-flex align-items-center">
            <div className="bg-dark bg-opacity-10 rounded-circle p-2 me-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-shield-check text-dark"
                viewBox="0 0 16 16"
              >
                <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
                <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
              </svg>
            </div>
            <h5 className="mb-0 fw-bold">Role Permissions</h5>
          </div>
        </Card.Header>
        <Card.Body className="p-4 bg-light bg-opacity-25">
          {userPermissionsLoading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="text-center">
                <ButtonLoadingSpinner />
                <p className="mt-3 text-muted">Loading permissions...</p>
              </div>
            </div>
          ) : errors.userPermissionsError ? (
            <div
              className="alert alert-danger border-0 rounded-3 shadow-sm"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle me-2"></i>
              {errors.userPermissionsError ||
                "An error occurred while fetching permissions."}
            </div>
          ) : userPermissions && userPermissions.length > 0 ? (
            <>
              <div className="mb-4">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-lg border-0 shadow-sm rounded-3 ps-5"
                    placeholder="Search permissions..."
                    value={searchText}
                    onChange={handleSearch}
                  />
                  <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                </div>
              </div>

              <Row className="g-3">
                {filteredPermissions.length > 0 ? (
                  filteredPermissions.map((permission) => (
                    <Col lg={6} xl={4} key={permission.permissionId}>
                      <div className="bg-white rounded-3 p-3 shadow-sm border-0 h-100 hover-lift transition-all">
                        <div className="d-flex align-items-center">
                          <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-key text-warning fs-5"></i>
                          </div>
                          <div>
                            <h6
                              className="mb-0 fw-bold text-dark text-truncate"
                              style={{
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                                maxWidth: "100%",
                              }}
                            >
                              {permission.permission?.permissionName}
                            </h6>
                            <small className="text-muted">Permission</small>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <div className="text-center py-5">
                      <i className="bi bi-search text-muted display-4"></i>
                      <p className="text-muted mt-3 mb-0">
                        No matching permissions found.
                      </p>
                    </div>
                  </Col>
                )}
              </Row>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted display-4"></i>
              <p className="text-muted mt-3 mb-0">
                No permissions assigned to this user.
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      backdrop="static"
      className="fade"
    >
      <Modal.Header closeButton className="bg-primary text-white border-0 py-3">
        <Modal.Title className="d-flex align-items-center fs-4">
          <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-person-lines-fill text-primary"
              viewBox="0 0 16 16"
            >
              <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
            </svg>
          </div>
          <div>
            <span className="fw-bold">User Profile</span>
            {user && (
              <div className="fs-6 fw-normal opacity-75 mt-1">
                {user.firstname} {user.lastname}
              </div>
            )}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ maxHeight: "75vh", overflowY: "auto" }}
        className="p-0 bg-light"
      >
        {!user ? (
          <div className="text-center py-5 m-4">
            <div className="bg-white rounded-4 shadow-sm p-5">
              <Spinner
                animation="border"
                role="status"
                variant="primary"
                className="mb-3"
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <h5 className="text-muted">Loading user details...</h5>
              <p className="text-muted mb-0">
                Please wait while we fetch the information.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {renderBasicInfo()}
            {renderUserModules()}
            {renderUserRoles()}
            {renderRolePermissions({
              searchText,
              handleSearch: handlePermissionSearch,
            })}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ViewUserDetails;
