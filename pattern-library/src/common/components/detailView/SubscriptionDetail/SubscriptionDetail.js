import React from "react";
import template from "./SubscriptionDetail.jsx";
import { get_subscriptions_api } from "common/services/userManagementApi.js";

class subscriptionDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    // Fetch subscriptions when the component mounts
    this.fetchSubscriptions();
  }

  fetchSubscriptions = async () => {
    try {
      const response = await get_subscriptions_api();
      const responseData = response.data.result;
      // Update the state with the received data
      this.setState({ data: responseData });
    } catch (error) {
      console.error("Error fetching user subscriptions:", error);
      // Handle error if needed
    }
  };

  render() {
    return template.call(this);
  }
}

export default subscriptionDetail;













