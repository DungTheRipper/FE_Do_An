import React, {useEffect, useState} from "react";

import Dashboard from './components/home/dashboard/Dashboard.jsx'
import Nav from "./components/home/nav/Nav.jsx";
import Loading from "./components/helper/Loading.jsx";
import axiosInstance from "./AxiosConfig.js";
import WeeklyReports from "./components/home/report/WeeklyReports.jsx";
import MonthlyReports from "./components/home/report/MonthlyReports.jsx";
import KanbanBoard from "./components/home/kanban/KanbanBoard.jsx";

const WorkManagementApp = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [darkMode, setDarkMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("/api/users/");
                setUserData(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getUserDetails();
    }, [])

    return (
        <div className={`relative min-h-screen overflow-x-auto ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
            {loading && <Loading/>}
            <div
                className={`min-h-screen flex transition-colors duration-200`}>
                <Nav darkMode={darkMode} onSetDarkMode={toggleDarkMode} activeTab={activeTab}
                     onSetActiveTab={setActiveTab} username={userData?.full_name}
                     setSelectedProject={setSelectedProject}/>
                <main className="flex-1 p-6">
                    {activeTab === "dashboard" && <Dashboard darkMode={darkMode}/>}
                    {activeTab === "weekly-reports" && <WeeklyReports darkMode={darkMode}/>}
                    {activeTab === "monthly-reports" && <MonthlyReports darkMode={darkMode}/>}
                    {activeTab.startsWith("project_") && <KanbanBoard darkMode={darkMode} projectId={activeTab.split("_")[1]}/> }
                </main>
            </div>
        </div>
    );
};

export default WorkManagementApp;
