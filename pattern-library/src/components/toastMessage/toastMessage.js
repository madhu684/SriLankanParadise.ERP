import React from "react";
import "./toastMessage.css"; // Add your custom CSS for the toast messages
import { Toast } from "react-bootstrap";

function toastMessage({ show, onClose, type, message }) {
  return (
    <Toast show={show} onClose={onClose} autohide delay={3000} className={`bg-${type} text-white`}>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
}

export default toastMessage;
