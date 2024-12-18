import ChangePasswordButton from "../../auth/ChangePasswordButton.jsx";
import LogoutButton from "../../auth/LogoutButton.jsx";
import {FaDashcube, FaMoon, FaSun} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import axiosInstance from "../../../AxiosConfig.js";
import ProjectTreeMenu from "./ProjectTreeMenu.jsx";
import ReportTreeMenu from "./ReportTreeMenu.jsx";
import Loading from "../../helper/Loading.jsx";

const Nav = ({darkMode, onSetDarkMode, activeTab, onSetActiveTab, username, setSelectedProject}) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleUserMenuClick = () => {
        setShowUserMenu(!showUserMenu);
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("/api/tasks/project/");
                setProjects(response.data.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);


    return (
        <div className="relative">
            {loading && <Loading/>}
            <nav
                className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg w-64 min-h-screen transition-colors duration-200`}>
                <div className="py-4">
                    <div className="px-4 mb-6">
                        <div className="flex items-center">
                            <img
                                src={"/logo.png"}
                                alt="Logo"
                                className="w-10 h-10 rounded-lg object-cover"
                            />
                            <span className={`ml-2 font-bold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
                PungDuc
              </span>
                        </div>
                        <div className="mt-4 flex justify-between items-center relative pb-4">
                            <div className="relative">
                                <button
                                    onClick={handleUserMenuClick}
                                    className="flex items-center space-x-2 rounded-full hover:bg-opacity-80 w-44"
                                >
                                    <img
                                        src={"/user.jpg"}
                                        alt="User"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span
                                        className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} truncate overflow-hidden w-full text-start`}>{username}</span>
                                </button>
                                {showUserMenu && (
                                    <div
                                        className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 ${darkMode ? "bg-gray-700" : "bg-white"} ring-1 ring-black ring-opacity-5`}>
                                        <ChangePasswordButton darkMode={darkMode}/>
                                        <LogoutButton darkMode={darkMode}/>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={onSetDarkMode}
                                className={`absolute right-0 p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-200 text-gray-600"}`}
                            >
                                {darkMode ? <FaSun className="w-5 h-5"/> : <FaMoon className="w-5 h-5"/>}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 px-4">
                        <button
                            onClick={() => onSetActiveTab("dashboard")}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded ${activeTab === "dashboard" ? "bg-blue-600 text-white" : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <FaDashcube className="mr-2"/> Dashboard
                        </button>
                        <ReportTreeMenu darkMode={darkMode}
                                        activeTab={activeTab}
                                        onSetActiveTab={onSetActiveTab}
                        />
                        <ProjectTreeMenu darkMode={darkMode}
                                         projects={projects}
                                         activeTab={activeTab}
                                         onSetActiveTab={onSetActiveTab}
                                         setSelectedProject={setSelectedProject}
                                         setProjects={setProjects}
                        />
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Nav;