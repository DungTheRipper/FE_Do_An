import {FaSignOutAlt} from "react-icons/fa";
import React, {useState} from "react";
import axiosInstance from "../../AxiosConfig.js";
import Loading from "../helper/Loading.jsx";

const LogoutButton = ({ darkMode }) => {
    const [loading, setLoading] = useState(false);
    const refreshToken = localStorage.getItem("refresh");
    const handleLogout = async () => {
        try {
            await axiosInstance.post("/api/auth/logout/", {
                "refresh": refreshToken
            })
            setLoading(true);
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