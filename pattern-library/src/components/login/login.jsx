import React from "react";
import logoImage from "../../assets/images/erp_system_logo.jpg";
import "./login.css";
import ToastMessage from "../toastMessage/toastMessage.js";
import { Navigate } from "react-router-dom";

function template() {
  return (
    <div className="container-wraper-login">
      {/* Error Toast */}
      <ToastMessage
        show={this.state.showErrorToast}
        onClose={() => this.setState({ showErrorToast: false })}
        type="danger"
        message={this.state.errorMessageToast}
      />
      {/* Success Toast */}
      <ToastMessage
        show={this.state.showSuccessToast}
        onClose={() => this.setState({ showSuccessToast: false })}
        type="success"
        message={this.state.successMessageToast}
      />
      {/* Redirect to the /menu route */}
      {this.state.redirectToMain && <Navigate to="/main" replace={true} />}
      <div className="container container-main">
        <div className="row">
          <div className="col-lg-8">
            <div className="welcome-image text-center">
              <h5>Nice to see you again</h5>
              <h1>WELCOME BACK</h1>
              <p className="welcome-description">
                This is an Enterprise Resource Planning (ERP) system designed to
                streamline and optimize various business processes within your
                organization. Our ERP solution integrates different departments
                and functions across your company into a single platform,
                enhancing efficiency, collaboration, and decision-making.
                Experience the power of seamless business management with our
                advanced ERP system.
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="login text-center">
              <img
                src={logoImage}
                alt="Logo"
                className="logo img-fluid mb-4 mt-4"
              />
              {this.state.error && (
                <div className="error-message mb-4">{this.state.error}</div>
              )}
              <form onSubmit={this.handleFormSubmit} className="w-100 mw-400">
                <div className="form-group mb-3">
                  <input
                    type="text"
                    className="form-control rounded-0"
                    id="username"
                    name="username"
                    value={this.state.username}
                    onChange={this.handleInputChange}
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <input
                    type="password"
                    className="form-control rounded-0"
                    id="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="row mt-2">
                  <div className="col">
                    {/* Remember Me checkbox */}
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember Me
                      </label>
                    </div>
                  </div>
                  <div className="col text-right">
                    {/* Forgot Password link */}
                    <a href="/forgot-password" className="forgot-password-link">
                      Forgot Password?
                    </a>
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-block mt-3"
                  type="submit"
                  disabled={this.state.loading} // Disable button when loading
                >
                  {this.state.loading ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default template;
