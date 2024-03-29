import React, { useState } from "react";
import template from "./login.jsx";
import { login_api } from "../../services/userManagementApi.js";

class login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      permissionId: 1,
      error: null,
      showErrorToast: false,
      showSuccessToast: false,
      errorMessageToast: "",
      successMessageToast: "",
      redirectToMain: false, // Flag to trigger the redirection
      loading: false, // Flag to indicate loading state
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();
    const { username, password, permissionId } = this.state;

    // Set loading to true to show loading spinner
    this.setState({ loading: true });

    try {
      const formData = {
        username: username,
        password: password,
        permissionId: permissionId,
      };

      const response = await login_api(formData);
      if (response.data.result == null) {
        console.log(response.message);
        this.setState({
          showErrorToast: true,
          errorMessageToast: response.message,
          loading: false, // Reset loading state
        });
      } else {
        this.setState({
          showSuccessToast: true,
          successMessageToast: response.message,
        });
      }

      // Store user information in sessionStorage
      sessionStorage.setItem("userId", response.data.result.userId.toString());
      sessionStorage.setItem("username", response.data.result.username);
      sessionStorage.setItem(
        "companyId",
        response.data.result.companyId.toString()
      );
      sessionStorage.setItem(
        "companyName",
        response.data.result.company.companyName
      );
      sessionStorage.setItem(
        "companyLogoPath",
        response.data.result.company.logoPath
      );
      sessionStorage.setItem("locationId", response.data.result.locationId);
      // Set redirectToMain to true upon successful login
      this.setState({ redirectToMain: true });

      console.log("Login successful:", response);
    } catch (error) {
      // Handle login error
      this.setState({
        error: "Invalid username or password. Please try again.",
        showErrorToast: true,
        loading: false, // Reset loading state
      });
    }
  };

  render() {
    return template.call(this);
  }
}

export default login;
