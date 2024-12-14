import {FaChartLine, FaChevronDown, FaChevronRight} from "react-icons/fa";
import {useState} from "react";

const ReportTreeMenu = ({darkMode, activeTab, onSetActiveTab}) => {
    const [showReportsMenu, setShowReportsMenu] = useState(false);

    const handleReportsClick = () => {
        setShowReportsMenu(!showReportsMenu);
    };

    return (
        <div className={`flex flex-col items-center text-sm font-medium rounded w-full`}>
            <button
                onClick={handleReportsClick}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded w-full transition-colors duration-200 ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
            >
                <FaChartLine className="mr-2"/> Reports
                <span className="ml-auto">
                        {showReportsMenu ? (
                            <FaChevronDown className="text-sm"/>
                        ) : (
                            <FaChevronRight className="text-sm"/>
                        )}
                    </span>
            </button>

            {showReportsMenu && (
                <div
                    className={`w-full mt-2 pl-6 space-y-2 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800 transition-colors duration-200"}`}
                >
                    <ul className="space-y-2 w-full">
                        <li>
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => {
                                        onSetActiveTab("weekly-reports");
                                    }}
                                    className={`relative flex w-full px-4 py-2 items-center cursor-pointer space-x-2 ${activeTab === "weekly-reports" ? "bg-blue-600 text-white" : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"} rounded`}
                                >
                                    Weekly Reports
                                </button>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => {
                                        onSetActiveTab("monthly-reports");
                                    }}
                                    className={`relative flex w-full px-4 py-2 items-center cursor-pointer space-x-2 ${activeTab === "monthly-reports" ? "bg-blue-600 text-white" : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"} rounded`}
                                >
                                    Monthly Reports
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ReportTreeMenu;
