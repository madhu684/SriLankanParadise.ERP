import React from "react";
import "./toastMessage.css"; // Add your custom CSS for the toast messages
import { Toast } from "react-bootstrap";

function ToastMessage({ show, onClose, type, message }) {
  {console.log(show + ' ' + type + ' ' + message)}
  return (
   
    <Toast show={show} onClose={onClose} delay={3000} className={`bg-${type} text-white ml-auto`}>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
}

export default ToastMessage;
