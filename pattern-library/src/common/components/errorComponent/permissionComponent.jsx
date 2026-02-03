import { MdLockOutline } from "react-icons/md";

const PermissionComponent = ({
  message = "You don't have permission to access this resource",
  maxHeight = "80vh",
}) => (
  <div
    className="d-flex flex-column justify-content-center align-items-center vh-100"
    style={{ maxHeight }}
  >
    <MdLockOutline size={64} className="text-warning mb-3" />
    <h4 className="text-dark mb-2">Access Denied</h4>
    <p className="text-muted text-center" style={{ maxWidth: "500px" }}>
      {message}
    </p>
    {/* <small className="text-muted mt-2">
      Please contact your administrator if you believe this is a mistake.
    </small> */}
  </div>
);

export default PermissionComponent;













