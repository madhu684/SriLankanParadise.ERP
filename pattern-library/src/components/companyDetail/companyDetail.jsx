import "./companyDetail.css";
import React from "react";

function template() {
  const { data } = this.state;
  return (
    <div className="p-3">
      <h2 className="mb-4">Companies</h2>
      <table className="table">
        <thead className="table-light">
          <tr>
            <th scope="col">Company Name</th>
            <th scope="col">Subscription Plan ID</th>
            <th scope="col">Subscription Expired Date</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.companyName}</td>
              <td>{item.subscriptionPlanId}</td>
              <td>{item.subscriptionExpiredDate}</td>
              <td>{item.status ? "Active" : "Inactive"}</td>
              <td>
                <button
                  className="btn btn-outline-secondary btn-sm me-2"
                  //   onClick={()}
                >
                  Update
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  //   onClick={()}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default template;