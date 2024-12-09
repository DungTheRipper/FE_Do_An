import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaTasks, FaCalendarAlt, FaBell, FaChartLine, FaSearch, FaEdit, FaTrash, FaSort, FaPlus, FaChevronLeft, FaChevronRight, FaMoon, FaSun, FaUserCircle, FaKey, FaSignOutAlt } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useNavigate } from 'react-router-dom';

import Dashboard from './components/Dashboard.jsx'
import KanbanBoard from './components/KanbanBoard.jsx'
import WorkList from './components/WorkList.jsx'
import CalendarView from './components/CalendarView.jsx'
import Reports from './components/Reports.jsx'
import logo from './assets/logo.png'
import user from './assets/user.jpg'

const WorkManagementApp = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleChangePassword = () => {
    navigate('/change');
  };

  const handleLogout = () => {
    navigate('/');
  };


  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} flex transition-colors duration-200`}>
      <nav className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg w-64 min-h-screen transition-colors duration-200`}>
        <div className="py-4">
          <div className="px-4 mb-6">
            <div className="flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className={`ml-2 font-bold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
                WorkManagement
              </span>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="relative">
                <button
                  onClick={handleUserMenuClick}
                  className="flex items-center space-x-2 rounded-full hover:bg-opacity-80"
                >
                  <img
                    src={user}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Dungz</span>
                </button>
                {showUserMenu && (
                  <div className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 ${darkMode ? "bg-gray-700" : "bg-white"} ring-1 ring-black ring-opacity-5`}>
                    <button
                      onClick={handleChangePassword}
                      className={`flex items-center w-full px-4 py-2 text-sm ${darkMode ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      <FaKey className="mr-2" /> Change Password
                    </button>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center w-full px-4 py-2 text-sm ${darkMode ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-200 text-gray-600"}`}
              >
                {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-2 px-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded ${activeTab === "dashboard" ? "bg-blue-600 text-white" : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <FaTasks className="mr-2" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab("kanban")}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded ${activeTab === "kanban" ? "bg-blue-600 text-white" : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <FaTasks className="mr-2" /> Kanban
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded ${activeTab === "list" ? "bg-blue-600 text-white" : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <FaTasks className="mr-2" /> List
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded ${activeTab === "calendar" ? "bg-blue-600 text-white" : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <FaCalendarAlt className="mr-2" /> Calendar
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded ${activeTab === "reports" ? "bg-blue-600 text-white" : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <FaChartLine className="mr-2" /> Reports
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-6">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "kanban" && <KanbanBoard />}
        {activeTab === "list" && <WorkList />}
        {activeTab === "calendar" && <CalendarView />}
        {activeTab === "reports" && <Reports />}
      </main>
    </div>
  );
};

export default WorkManagementApp;
