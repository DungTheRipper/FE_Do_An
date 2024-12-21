import {useEffect, useState} from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "../helper/Loading.jsx";
import NotificationManager from "../helper/NotificationManager.jsx";
import axios from "axios";

const ResetPasswordConfirmation = () => {
    const navigate = useNavigate();
    const {uidb64} = useParams();
    const {token} = useParams();
    const [disableInput, setDisableInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        password1: "",
        password2: ""
    });

    const [errors, setErrors] = useState({
        password1: "",
        password2: ""
    });

    const [showPasswords, setShowPasswords] = useState({
        new: false,
        confirm: false
    });

    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: ""
    });

    useEffect(() => {
        if (!uidb64 || !token) {
            NotificationManager.showNotification(
                "Invalid Request",
                "Invalid or expired reset link.",
                "danger"
            );
            setDisableInput(true);
        } else {
            setDisableInput(false);
        }
    }, [uidb64, token]);

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
        const {name, value} = e.target;
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

        if (!formData.password1) {
            newErrors.password1 = "New password is required";
            isValid = false;
        }

        if (!formData.password2) {
            newErrors.password2 = "Please confirm your new password";
            isValid = false;
        } else if (formData.password1 !== formData.password2) {
            newErrors.password2 = "Passwords do not match";
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
                const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/password/reset/confirm/${uidb64}/${token}/`, formData);
                NotificationManager.showNotification(
                    "Reset password successfully",
                    "Your password has been reset successfully",
                    "success"
                )
                navigate("/");
            } catch (error) {
                console.error(error);
                NotificationManager.showNotification(
                    "Reset password failed",
                    "Oops! Something went wrong!",
                    "danger"
                )
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

    return (
        <div className="relative">
            {loading && <Loading/>}
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Reset Password
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* New Password Field */}
                            <div>
                                <label htmlFor="password1" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="password1"
                                        name="password1"
                                        type={showPasswords.new ? "text" : "password"}
                                        value={formData.password1}
                                        onChange={handleInputChange}
                                        className={`appearance-none block w-full px-3 py-2 border ${errors.password1 ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                        placeholder="Enter new password"
                                        disabled={disableInput}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility("new")}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                    >
                                        {showPasswords.new ? <FaEyeSlash/> : <FaEye/>}
                                    </button>
                                </div>
                                {errors.password1 && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password1}</p>
                                )}
                                {formData.password1 && (
                                    <div className="mt-2">
                                        <div className="h-2 rounded-full bg-gray-200">
                                            <div
                                                className={`h-full rounded-full ${getStrengthColor()}`}
                                                style={{width: `${(passwordStrength.score / 5) * 100}%`}}
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
                                <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="password2"
                                        name="password2"
                                        type={showPasswords.confirm ? "text" : "password"}
                                        value={formData.password2}
                                        onChange={handleInputChange}
                                        className={`appearance-none block w-full px-3 py-2 border ${errors.password2 ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                        placeholder="Confirm new password"
                                        disabled={disableInput}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility("confirm")}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                    >
                                        {showPasswords.confirm ? <FaEyeSlash/> : <FaEye/>}
                                    </button>
                                </div>
                                {errors.password2 && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password2}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Reset Password
                            </button>
                        </div>
                        <p className="text-center mt-2 text-sm text-blue-500 hover:text-blue-700 hover:cursor-pointer"
                           onClick={() => navigate("/")}>Back to Login</p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordConfirmation;
