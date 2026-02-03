import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is loaded if not already global

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
            <div className="text-center">
                <h1 className="display-1 fw-bold text-primary">404</h1>
                <h2 className="fs-1 fw-bold mb-3">Page Not Found</h2>
                <p className="lead mb-4">
                    Oops! The page you are looking for does not exist.
                    <br />
                    It might have been moved or deleted.
                </p>
                <button 
                    className="btn btn-primary btn-lg shadow-sm"
                    onClick={() => navigate('/main')}
                >
                    <i className="bi bi-house-door-fill me-2"></i>
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;
