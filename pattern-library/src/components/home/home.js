import React    from "react";
import template from "./home.jsx";

class home extends React.Component {
  render() {
    return template.call(this);
  }
}

export default home;
