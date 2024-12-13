import React, { useEffect, useState } from "react";
import axiosInstance from "../../../AxiosConfig.js";
import Loading from "../../helper/Loading.jsx";
import CalendarView from "./CalendarView.jsx";

const Dashboard = ({ darkMode }) => {
  const [tasks, setTasks] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);
  const [onDeadlineTasks, setOnDeadlineTasks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const options = {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = formatter.format(today);

    const [datePart, timePart] = formattedDate.split(', ');
    const [month, day, year] = datePart.split('/');

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${timePart}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const today = getTodayDate();
      try {
        setIsLoading(true);
        const [allTasksRes, overdueTasksRes, onDeadlineTasksRes] = await Promise.all([
          axiosInstance.get(`/api/tasks/all-task/?time=` + today),
          axiosInstance.get(`/api/tasks/overdue-tasks/?time=` + today),
          axiosInstance.get(`/api/tasks/on-deadline-tasks/?time=` + today),
        ]);

        setTasks(allTasksRes.data.data);
        setOverdueTasks(overdueTasksRes.data.data);
        setOnDeadlineTasks(onDeadlineTasksRes.data.data);
      } catch (error) {
        console.error("Error fetching task data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
      <div className="relative">
        {isLoading && <Loading />}
        <div className="p-4">
          <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-lg shadow p-4 transition-colors duration-200 mb-8`}>
            <h3 className="text-lg font-semibold mb-4">Today Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className={`${darkMode ? "bg-green-900" : "bg-green-100"} p-4 rounded-lg`}>
                <p className="text-2xl font-bold">{tasks.total_tasks}</p>
                <p className="text-sm">Doing Tasks</p>
              </div>
              <div className={`${darkMode ? "bg-yellow-900" : "bg-yellow-100"} p-4 rounded-lg`}>
                <p className="text-2xl font-bold">{onDeadlineTasks.total_tasks}</p>
                <p className="text-sm">On Deadline Tasks</p>
              </div>
              <div className={`${darkMode ? "bg-red-900" : "bg-red-100"} p-4 rounded-lg`}>
                <p className="text-2xl font-bold">{overdueTasks.total_tasks}</p>
                <p className="text-sm">Overdue Tasks</p>
              </div>
            </div>
          </div>
          <CalendarView darkMode={darkMode} doingTasks={tasks} onDeadlineTasks={onDeadlineTasks} overdueTasks={overdueTasks} />
        </div>
      </div>
  );
};

export default Dashboard;
