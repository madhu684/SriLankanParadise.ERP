import "./SubscriptionDetail.css";
import React from "react";

function template() {
  const { data } = this.state;
  return (
    <div className="p-3">
      <h2 className="mb-4">Subscriptions</h2>
      <table className="table">
        <thead className="table-light">
          <tr>
            <th scope="col">Subscription ID</th>
            <th scope="col">Plan Name</th>
            <th scope="col">Price</th>
            <th scope="col">Description</th>
            <th scope="col">Duration</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.subscriptionId}>
              <td>{item.subscriptionId}</td>
              <td>{item.planName}</td>
              <td>{item.price}</td>
              <td>{item.description}</td>
              <td>{item.duration}</td>
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













