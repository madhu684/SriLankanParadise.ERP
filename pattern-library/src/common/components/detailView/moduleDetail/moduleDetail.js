import React from "react";
import template from "./moduleDetail.jsx";
import { get_modules_api } from "common/services/userManagementApi.js";

class moduleDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    // Fetch modules when the component mounts
    this.fetchModules();
  }

  fetchModules = async () => {
    try {
      const response = await get_modules_api();
      const responseData = response.data.result;
      // Update the state with the received data
      this.setState({ data: responseData });
    } catch (error) {
      console.error("Error fetching user modules:", error);
      // Handle error if needed
    }
  };

  render() {
    return template.call(this);
  }
}

export default moduleDetail;














