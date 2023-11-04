import React, { useState }    from "react";
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
      successMessageToast: ""
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

    try {
      const formData = {
        username: username,
        password: password,
        permissionId: permissionId
      };

      const response = await login_api(formData);
      if(response.data.result == null){
        
      console.log(response.message)
        this.setState({
          showErrorToast : true,
          errorMessageToast : response.message
        });
      }else{
        this.setState({
          showSuccessToast : true,
          successMessageToast : response.message
        });
      }
      console.log("Login successful:", response);
    } catch (error) {
      // Handle login error
      this.setState({
        error: "Invalid username or password. Please try again.",
        showErrorToast : true
      });
    }
  };
  
  render() {
    return template.call(this);
  }
}

export default login;
