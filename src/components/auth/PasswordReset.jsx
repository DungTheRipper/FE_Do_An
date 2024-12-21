import React, {useState} from "react";
import {IoMail} from "react-icons/io5";
import Loading from "../helper/Loading.jsx";
import NotificationManager from "../helper/NotificationManager.jsx";
import axios from "axios";

const PasswordReset = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        setError("");
        if (!email) {
            setError("Please enter your email address");
        } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError("Please enter a valid email address");
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        validateEmail(email);
        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/password/reset/`, {
                email: email,
            })
            NotificationManager.showNotification(
                "Send request reset password successfully",
                "Please check your email to reset your password",
                "success"
            )
        } catch (e) {
            console.error(e);
            NotificationManager.showNotification(
                "Failed to reset your password",
                "Something went wrong, try again later",
                "danger"
            )
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {loading && <Loading/>}
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">Reset Password</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            "Enter your email to receive a verification code"
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}


                    <form onSubmit={handleEmailSubmit} className="mt-8 space-y-6">
                        <div className="relative">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email Address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IoMail className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
        ;
};

export default PasswordReset;