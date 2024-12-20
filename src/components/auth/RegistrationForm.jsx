import React, {useEffect, useState} from "react";
import {FiLock, FiMail, FiUser} from "react-icons/fi";
import axios from "axios";
import NotificationPopup from "../helper/NotificationPopup.jsx";
import Loading from "../helper/Loading.jsx";
import NotificationManager from "../helper/NotificationManager.jsx";

const RegistrationForm = ({setIsLogin}) => {
    const [loading, setLoading] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationsCode, setNotificationsCode] = useState("");
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password1: "",
        password2: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.first_name) {
            newErrors.first_name = "First Name is required";
        }
        if (!formData.last_name) {
            newErrors.last_name = "Last Name is required";
        }
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.password1) {
            newErrors.password1 = "Password is required";
        }
        if (formData.password1 !== formData.password2) {
            newErrors.password2 = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setLoading(true);
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/auth/registration/`,
                    formData
                );
                console.log("Registration successful:", response.data);

                NotificationManager.showNotification(
                    "Registration successful",
                    "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.",
                    "success"
                )

                setFormData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    password1: "",
                    password2: "",
                });

                setIsLogin(true);
            } catch (error) {
                console.error("Registration failed:", error);

                const errorMessage =
                    error.response?.data?.error ||
                    error.response?.data?.message ||
                    error.response?.data?.email?.error ||
                    "Đã có lỗi xảy ra. Vui lòng thử lại.";

                NotificationManager.showNotification(
                    "Registration failed",
                    `${errorMessage}`,
                    "danger"
                )
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCloseNotifications = () => {
        setShowNotifications(false);
        if (registrationSuccess) {
            window.location.reload();
        }
    }

    return (
        <div className="relative">
            {loading && <Loading />}
            {showNotifications &&
                <NotificationPopup code={notificationsCode} onClose={handleCloseNotifications}/>}
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="first_name" className="sr-only">
                        First Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                            placeholder="First Name"
                        />
                    </div>
                    {errors.first_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="last_name" className="sr-only">
                        Last Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                            placeholder="Last Name"
                        />
                    </div>
                    {errors.last_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="sr-only">
                        Email address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                            placeholder="Email address"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password1" className="sr-only">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            id="password1"
                            name="password1"
                            type="password"
                            value={formData.password1}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                            placeholder="Password"
                        />
                    </div>
                    {errors.password1 && (
                        <p className="text-red-500 text-xs mt-1">{errors.password1}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password2" className="sr-only">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            id="password2"
                            name="password2"
                            type="password"
                            value={formData.password2}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                            placeholder="Confirm Password"
                        />
                    </div>
                    {errors.password2 && (
                        <p className="text-red-500 text-xs mt-1">{errors.password2}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegistrationForm;
