import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import Loading from "../helper/Loading.jsx";
import axiosInstance from "../../AxiosConfig.js";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: ""
  });

  const [errors, setErrors] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ""
  });

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const messages = [
      "Very Weak",
      "Weak",
      "Fair",
      "Good",
      "Strong"
    ];

    setPasswordStrength({
      score,
      message: messages[score - 1] || ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "new_password") {
      calculatePasswordStrength(value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.old_password) {
      newErrors.old_password = "Current password is required";
      isValid = false;
    }

    if (!formData.new_password) {
      newErrors.new_password = "New password is required";
      isValid = false;
    }

    if (!formData.confirm_new_password) {
      newErrors.confirm_new_password = "Please confirm your new password";
      isValid = false;
    } else if (formData.new_password !== formData.confirm_new_password) {
      newErrors.confirm_new_password = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const response = await axiosInstance.post("/api/auth/password/change/", formData);
        navigate("/");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStrengthColor = () => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500"
    ];
    return colors[passwordStrength.score - 1] || "bg-gray-200";
  };

  const navigateHome = () => {
    navigate("/home");
  }

  return (
      <div className="relative">
        {loading && <Loading />}
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Change Password
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="old_password" className="block text-sm font-medium text-gray-700">
                Old Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="old_password"
                  name="old_password"
                  type={showPasswords.old ? "text" : "password"}
                  value={formData.old_password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.old_password ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showPasswords.old ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.old_password && (
                <p className="mt-2 text-sm text-red-600">{errors.old_password}</p>
              )}
            </div>

            {/* New Password Field */}
            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="new_password"
                  name="new_password"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.new_password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.new_password ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.new_password && (
                <p className="mt-2 text-sm text-red-600">{errors.new_password}</p>
              )}
              {formData.new_password && (
                <div className="mt-2">
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Password Strength: {passwordStrength.message}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm New Password Field */}
            <div>
              <label htmlFor="confirm_new_password" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirm_new_password"
                  name="confirm_new_password"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirm_new_password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.confirm_new_password ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirm_new_password && (
                <p className="mt-2 text-sm text-red-600">{errors.confirm_new_password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Change Password
            </button>
          </div>
          <p className="text-center mt-2 text-sm text-blue-500 hover:text-blue-700 hover:cursor-pointer" onClick={navigateHome}>Back to home screen</p>
        </form>
      </div>
    </div>
      </div>
  );
};

export default ChangePassword;