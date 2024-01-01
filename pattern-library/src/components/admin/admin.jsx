import React from "react";
import "./admin.css";
import SideNav from "../sideNav/sideNav.js";

function template() {
  const { selectedOption } = this.state;
  const options = [
    "Companies",
    "Subscription Plans",
    "Modules",
    "Roles",
    "Permissions",
  ];
  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-2 col-lg-2 d-md-block bg-light sidebar">
          <SideNav
            options={options}
            selectedOption={selectedOption}
            onSelect={this.handleSelect}
          />
        </nav>
        <main className="col-md-10 ms-sm-auto col-lg-10 px-md-4">
          {this.renderDetail()}
        </main>
      </div>
    </div>
  );
}

export default template;
