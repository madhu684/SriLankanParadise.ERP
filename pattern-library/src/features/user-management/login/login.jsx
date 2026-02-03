import React from "react";
import logoImage from "assets/images/erp_system_logo.png";
import "./login.css";
import useLogin from "./useLogin";

function Login() {
  const {
    username,
    password,
    error,
    loading,
    handleInputChange,
    handleFormSubmit,
  } = useLogin();

  return (
    <div className="container-wraper-login">
      <div className="container container-main">
        <div className="row">
          {/* Left Side */}
          <div className="col-lg-8">
            <div className="welcome-image text-center">
              <h5>Nice to see you again</h5>
              <h1>WELCOME BACK</h1>
              <p className="welcome-description">
                This is an Enterprise Resource Planning (ERP) system designed to
                streamline and optimize various business processes within your
                organization...
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="col-lg-4">
            <div className="login text-center d-flex flex-column justify-content-center align-items-center">
              <img src={logoImage} alt="Logo" className="logo img-fluid" />

              {error && <div className="error-message mb-4">{error}</div>}

              <form onSubmit={handleFormSubmit} className="w-100 mw-400">
                <div className="form-group mb-3">
                  <input
                    type="text"
                    className="form-control rounded-0"
                    id="username"
                    name="username"
                    value={username}
                    onChange={handleInputChange}
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
                    value={password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                  />
                </div>

                <div className="row mt-2">
                  <div className="col">
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
                    <a href="/forgot-password" className="forgot-password-link">
                      Forgot Password?
                    </a>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-block mt-3"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
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

export default Login;













