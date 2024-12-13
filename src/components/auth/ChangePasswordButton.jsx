import {FaKey} from "react-icons/fa";
import React, {useState} from "react";
import Loading from "../helper/Loading.jsx";
import {useNavigate} from "react-router-dom";

const ChangePasswordButton = ({ darkMode }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChangePassword = () => {
        navigate('/change');
    };
    return (
        <div className="relative">
            {loading && <Loading />}
            <button
                onClick={handleChangePassword}
                className={`flex items-center w-full px-4 py-2 text-sm ${darkMode ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-gray-100"}`}
            >
                <FaKey className="mr-2"/> Change Password
            </button>
        </div>
    )
}

export default ChangePasswordButton;