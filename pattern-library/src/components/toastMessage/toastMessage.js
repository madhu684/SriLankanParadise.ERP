import React from "react";
import "./toastMessage.css"; // Add your custom CSS for the toast messages
import { Toast } from "react-bootstrap";

function ToastMessage({ show, onClose, type, message }) {
  {
    console.log(show + " " + type + " " + message);
  }
  return (
    <Toast
      show={show}
      onClose={onClose}
      delay={3000}
      className={`bg-${type} text-white ml-auto`}
    >
      <Toast.Body>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{message}</span>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
      </Toast.Body>
    </Toast>
  );
}

export default ToastMessage;
