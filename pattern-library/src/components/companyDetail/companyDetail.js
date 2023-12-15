import React from "react";
import template from "./companyDetail.jsx";
import { get_companies_api } from "../../services/userManagementApi.js";

class companyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    // Fetch companies when the component mounts
    this.fetchCompanies();
  }

  fetchCompanies = async () => {
    try {
      const resonse = await get_companies_api();
      const responseData = resonse.data.result;
      // Update the state with the received data
      this.setState({ data: responseData });
    } catch (error) {
      console.error("Error fetching user compamies:", error);
      // Handle error if needed
    }
  };
  render() {
    return template.call(this);
  }
}

export default companyDetail;
