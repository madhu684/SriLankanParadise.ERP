import React from "react";
import template from "./admin.jsx";
import CompanyDetail from "../companyDetail/companyDetail.js";
import SubscriptionDetail from "../SubscriptionDetail/SubscriptionDetail.js";
import ModulesDetail from "../moduleDetail/moduleDetail.js";
// import RolesDetail from "../rolesDetail";

class admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "",
    };
  }

  renderDetail = () => {
    switch (this.state.selectedOption) {
      case "Companies":
        return <CompanyDetail />;
      case "Subscription Plans":
        return <SubscriptionDetail />;
      case "Modules":
        return <ModulesDetail />;
      // case "Roles":
      //   return <RolesDetail />;
      default:
        return null;
    }
  };

  handleSelect = (option) => {
    this.setState({ selectedOption: option });
  };

  render() {
    return template.call(this);
  }
}

export default admin;
