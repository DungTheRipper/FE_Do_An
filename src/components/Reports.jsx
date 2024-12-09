import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const Reports = ({darkMode}) => {
  const [reportType, setReportType] = useState("weekly");

  const weeklyData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [4, 6, 8, 3, 7, 2, 5],
        borderColor: darkMode ? "rgb(134, 239, 172)" : "rgb(75, 192, 192)",
        tension: 0.1
      },
      {
        label: "Tasks Added",
        data: [5, 8, 6, 4, 9, 3, 6],
        borderColor: darkMode ? "rgb(248, 113, 113)" : "rgb(255, 99, 132)",
        tension: 0.1
      }
    ]
  };

  const monthlyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [12, 19, 3, 5],
        borderColor: darkMode ? "rgb(134, 239, 172)" : "rgb(75, 192, 192)",
        tension: 0.1
      },
      {
        label: "Tasks Added",
        data: [15, 22, 8, 10],
        borderColor: darkMode ? "rgb(248, 113, 113)" : "rgb(255, 99, 132)",
        tension: 0.1
      }
    ]
  };

  return (
    <div className="p-4">
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow p-4`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Task Progress Reports</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setReportType("weekly")}
              className={`px-4 py-2 rounded-lg ${reportType === "weekly" ? 
                (darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white") : 
                (darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200")}`}
            >
              Weekly Report
            </button>
            <button
              onClick={() => setReportType("monthly")}
              className={`px-4 py-2 rounded-lg ${reportType === "monthly" ? 
                (darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white") : 
                (darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200")}`}
            >
              Monthly Report
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <Line data={reportType === "weekly" ? weeklyData : monthlyData} options={{
            plugins: {
              legend: {
                labels: {
                  color: darkMode ? "#fff" : "#000"
                }
              }
            },
            scales: {
              y: {
                ticks: { color: darkMode ? "#fff" : "#000" },
                grid: { color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }
              },
              x: {
                ticks: { color: darkMode ? "#fff" : "#000" },
                grid: { color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }
              }
            }
          }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}>
            <h4 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Total Tasks:</span>
                <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{reportType === "weekly" ? "35" : "140"}</span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Completed Tasks:</span>
                <span className="font-semibold text-green-400">{reportType === "weekly" ? "28" : "112"}</span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Pending Tasks:</span>
                <span className="font-semibold text-yellow-400">{reportType === "weekly" ? "7" : "28"}</span>
              </div>
            </div>
          </div>
          <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}>
            <h4 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Performance Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Completion Rate:</span>
                <span className="font-semibold text-blue-400">{reportType === "weekly" ? "80%" : "75%"}</span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>On-time Completion:</span>
                <span className="font-semibold text-green-400">{reportType === "weekly" ? "90%" : "85%"}</span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Overdue Tasks:</span>
                <span className="font-semibold text-red-400">{reportType === "weekly" ? "2" : "8"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;