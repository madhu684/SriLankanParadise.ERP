// src/hooks/useLogin.js
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login_api } from "../../services/userManagementApi.js";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext.jsx";

const useLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [permissionId] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { updateUserId } = useContext(UserContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = { username, password, permissionId };
      const response = await login_api(formData);

      if (response.data.result == null) {
        toast.error(response.message || "Login failed.");
        setLoading(false);
        return;
      }

      toast.success(response.message || "Login successful!");

      // Store user data
      const { result } = response.data;
      sessionStorage.setItem("userId", result.userId.toString());
      sessionStorage.setItem("username", result.username);
      sessionStorage.setItem("companyId", result.companyId.toString());
      sessionStorage.setItem("companyName", result.company.companyName);
      sessionStorage.setItem("companyLogoPath", result.company.logoPath);
      sessionStorage.setItem("locationId", result.locationId);

      updateUserId(result.userId);

      // Navigate
      navigate("/main", { replace: true });
    } catch (err) {
      const msg = "Invalid username or password. Please try again.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  return {
    username,
    password,
    error,
    loading,
    handleInputChange,
    handleFormSubmit,
  };
};

export default useLogin;
