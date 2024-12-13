import React, { useEffect, useState } from "react";
import axiosInstance from "../../../AxiosConfig.js";
import Loading from "../../helper/Loading.jsx";

import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import DaysOfWeekChart from "./DaysOfWeekChart.jsx";
import HoursOfDayChart from "./HoursOfDayChart.jsx";
import CircleChart from "./CircleChart.jsx";
import DaysOfMonthChart from "./DaysOfMonthChart.jsx";

ChartJS.register(
    ArcElement,
    CategoryScale,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
);

const Reports = ({ darkMode }) => {
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = useState("weekly");
    const [weeklyReports, setWeeklyReports] = useState([]);
    const [monthlyReports, setMonthlyReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [report, setReport] = useState(null);

    useEffect(() => {
        const getAllReports = async () => {
            try {
                setLoading(true);

                const [weeklyResponse, monthlyResponse] = await Promise.all([
                    axiosInstance.get('/api/reports/get-all-weakly/'),
                    axiosInstance.get('/api/reports/get-all-monthly/')
                ]);

                setWeeklyReports(weeklyResponse.data.data);
                setMonthlyReports(monthlyResponse.data.data);

                if (reportType === "weekly" && weeklyResponse.data.data.length > 0) {
                    setSelectedReport(weeklyResponse.data.data[0]);
                } else if (reportType === "monthly" && monthlyResponse.data.data.length > 0) {
                    setSelectedReport(monthlyResponse.data.data[0]);
                } else {
                    setSelectedReport(null);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getAllReports();
    }, [reportType]);

    useEffect(() => {
        if (!selectedReport) return;

        const getSelectedReport = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/api/reports/${selectedReport?.id}/`);
                setReport(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getSelectedReport();
    }, [selectedReport]);

    const handleReportSelect = (event) => {
        const reportId = event.target.value;
        let selected;
        switch (reportType) {
            case "weekly":
                selected = weeklyReports.find((report) => report.id === reportId);
                break;
            case "monthly":
                selected = monthlyReports.find((report) => report.id === reportId);
                break;
        }
        setSelectedReport(selected);
    };

    return (
        <div className="relative">
            {loading && <Loading />}
            <div className="p-4">
                <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow p-4`}>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex">
                            <select
                                className={`px-4 py-2 mr-4 rounded-md shadow-lg ${darkMode ? 'text-gray-100 bg-gray-500' : 'text-gray-600 bg-gray-100'} w-max`}
                                value={selectedReport?.id || ""}
                                onChange={handleReportSelect}
                            >
                                {(reportType === "weekly" ? weeklyReports : monthlyReports).map((report) => (
                                    <option
                                        key={report.id}
                                        value={report.id}
                                        className={`px-4 py-2 text-sm cursor-pointer ${darkMode ? 'text-gray-100 bg-gray-500 hover:bg-gray-600' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        {report.report_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setReportType("weekly")}
                                className={`px-4 py-2 rounded-lg ${reportType === "weekly" ? (darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white") : (darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200")}`}
                            >
                                Weekly Report
                            </button>
                            <button
                                onClick={() => setReportType("monthly")}
                                className={`px-4 py-2 rounded-lg ${reportType === "monthly" ? (darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white") : (darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200")}`}
                            >
                                Monthly Report
                            </button>
                        </div>
                    </div>

                    {reportType === "weekly" ? (
                        <div>
                            <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-4 mb-6`}>
                                <CircleChart darkMode={darkMode} report={report} />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-4 mb-6`}>
                                    <DaysOfWeekChart darkMode={darkMode} report={report} />
                                </div>
                                <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-4 mb-6`}>
                                    <HoursOfDayChart darkMode={darkMode} report={report} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-4 mb-6`}>
                                <CircleChart darkMode={darkMode} report={report} />
                            </div>
                            <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-4 mb-6`}>
                                <DaysOfMonthChart darkMode={darkMode} report={report} />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}>
                            <h4 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Summary</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Total Tasks:</span>
                                    <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{report?.total_tasks || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Completed Tasks:</span>
                                    <span className="font-semibold text-green-400">{report?.completed_tasks || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Pending Tasks:</span>
                                    <span className="font-semibold text-yellow-400">{report?.pending_tasks || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Overdue Tasks:</span>
                                    <span className="font-semibold text-red-400">{report?.overdue_tasks || 0}</span>
                                </div>
                            </div>
                        </div>
                        <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}>
                            <h4 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Performance Metrics</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Completion Rate:</span>
                                    <span className="font-semibold text-blue-400">{(report?.completed_tasks / report?.total_tasks) * 100 || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Average Completion Time:</span>
                                    <span className="font-semibold text-green-400">{(report?.average_completion_time || 0) + " hours"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
