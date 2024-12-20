import {FaSignOutAlt} from "react-icons/fa";
import React, {useState} from "react";
import axiosInstance from "../../AxiosConfig.js";
import Loading from "../helper/Loading.jsx";
import {useNavigate} from "react-router-dom";
import NotificationManager from "../helper/NotificationManager.jsx";

const LogoutButton = ({ darkMode }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const refreshToken = localStorage.getItem("refresh");
    const handleLogout = async () => {
        try {
            setLoading(true);
            await axiosInstance.post("/api/auth/logout/", {
                "refresh": refreshToken
            })
            NotificationManager.showNotification(
                "Logout successfully",
                "You have been logged out successfully!",
                "info"
            )
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("activeTab");
            navigate("/");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    }
    return (
        <div className="relative">
            {loading && <Loading />}
            <button
                onClick={handleLogout}
                className={`flex items-center w-full px-4 py-2 text-sm ${darkMode ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-gray-100"}`}
            >
                <FaSignOutAlt className="mr-2"/> Logout
            </button>
        </div>
    )
};
export default LogoutButton;