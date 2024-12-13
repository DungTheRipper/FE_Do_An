import React, {useState} from "react";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import Loading from "../../helper/Loading.jsx";
import axiosInstance from "../../../AxiosConfig.js";

const CalendarView = ({darkMode}) => {
    const [loading, setLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [taskInMonth, setTaskInMonth] = useState(new Map());
    const [selectedDateTask, setSelectedDateTask] = useState(null);

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    React.useEffect(() => {
        const getTasksOfDate = async (month, year) => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("/api/tasks/tasks-by-month/?month=" + month + "&year=" + year);

                const tasksData = response.data.data;

                const newTasksMap = new Map();
                Object.keys(tasksData).forEach(date => {
                    newTasksMap.set(date, tasksData[date]);
                });
                setTaskInMonth(newTasksMap);
            } catch (error) {
                console.error("Error fetching task data:", error);
            } finally {
                setLoading(false);
            }
        }

        getTasksOfDate(currentMonth, currentYear);
    }, [currentMonth, currentYear]);

    React.useEffect(() => {
        const fetchData = async (date) => {
            const formattedDate = formatDateTime(date);
            try {
                setLoading(true);
                const [allTasksRes, overdueTasksRes, onDeadlineTasksRes] = await Promise.all([
                    axiosInstance.get(`/api/tasks/all-task/?time=` + formattedDate),
                    axiosInstance.get(`/api/tasks/overdue-tasks/?time=` + formattedDate),
                    axiosInstance.get(`/api/tasks/on-deadline-tasks/?time=` + formattedDate),
                ]);

                const data = [
                    ...allTasksRes.data.data.tasks,
                    ...onDeadlineTasksRes.data.data.tasks,
                    ...overdueTasksRes.data.data.tasks,
                ];
                setSelectedDateTask(data);
            } catch (error) {
                console.error("Error fetching task data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData(selectedDate);
    }, [selectedDate]);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 1:
                return darkMode ? "bg-yellow-800" : "bg-yellow-100";
            case 2:
                return darkMode ? "bg-orange-800" : "bg-orange-100";
            case 3:
                return darkMode ? "bg-red-800" : "bg-red-100";
            default:
                return darkMode ? "bg-gray-800" : "bg-gray-100";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 1:
                return darkMode ? "bg-green-800" : "bg-green-100";
            case 2:
                return darkMode ? "bg-green-800" : "bg-green-100";
            case 3:
                return darkMode ? "bg-red-800" : "bg-red-100";
            default:
                return darkMode ? "bg-gray-800" : "bg-gray-100";
        }
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
        setCurrentMonth(newDate.getMonth());
        setCurrentYear(newDate.getFullYear());
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setIsZoomed(true);
    };

    const handleBackClick = () => {
        setIsZoomed(false);
    };

    const formatDateTime = (date) => {
        const newDate = date ? date : new Date();
        newDate.setHours(0, 0, 0, 0);

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
        const formattedDate = formatter.format(date);

        const [datePart, timePart] = formattedDate.split(', ');
        const [month, day, year] = datePart.split('/');

        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${timePart}`;
    }

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const renderCalendar = () => {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const days = [];
        const today = new Date();

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const formattedDate = formatDate(date);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

            const tasksForDay = taskInMonth.get(formattedDate) || {doing: 0, on_deadline: 0, overdue: 0};

            days.push(
                <div
                    key={day}
                    onClick={() => handleDateClick(date)}
                    className={`aspect-square border rounded p-2 text-sm cursor-pointer relative
            ${darkMode ? "border-gray-700 text-white" : ""}
            ${isToday ? "border-2 border-red-500" : ""}
            ${isSelected ? "ring-2 ring-blue-500" : ""}
          `}
                >
                    <span className={isToday ? "text-red-500 font-bold" : ""}>{day}</span>
                    <div className="absolute bottom-1 right-1 flex space-x-1">
                        <div
                            className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {tasksForDay.doing}
                        </div>

                        <div
                            className="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {tasksForDay.on_deadline}
                        </div>
                        <div
                            className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {tasksForDay.overdue}
                        </div>
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="relative">
            {loading && <Loading/>}

            <div className={`rounded-lg shadow p-4 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
                <div className={`text-right mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {currentTime.toLocaleTimeString()}
                </div>
                {!isZoomed ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => navigateMonth(-1)}
                                className={`p-2 rounded ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                            >
                                <FaChevronLeft/>
                            </button>
                            <h2 className="text-xl font-semibold">
                                {currentDate.toLocaleString("default", {month: "long", year: "numeric"})}
                            </h2>
                            <button
                                onClick={() => navigateMonth(1)}
                                className={`p-2 rounded ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                            >
                                <FaChevronRight/>
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                <div key={day}
                                     className={`text-center font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{day}</div>
                            ))}
                            {renderCalendar()}
                        </div>
                    </>
                ) : (
                    <div className="transition-all duration-300 ease-in-out transform">
                        <button
                            onClick={handleBackClick}
                            className={`mb-4 flex items-center ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
                        >
                            <FaChevronLeft className="mr-2"/> Back to Calendar
                        </button>
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedDate.toLocaleDateString("default", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                            })}
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead>
                                <tr className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                                    <th className={`px-4 py-2 text-left text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-600"}`}>Title</th>
                                    <th className={`px-4 py-2 text-left text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-600"}`}>Status</th>
                                    <th className={`px-4 py-2 text-left text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-600"}`}>Priority</th>
                                    <th className={`px-4 py-2 text-left text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-600"}`}>Deadline</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedDateTask.map(task => (
                                    <tr key={task.id} className={darkMode ? "border-gray-700" : "border-b"}>
                                        <td className="px-4 py-2">{task.title}</td>
                                        <td className="px-4 py-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                                        </td>
                                        <td className="px-4 py-2">
                        <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            {new Date(task.deadline).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {selectedDateTask.length === 0 && (
                                <p className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No
                                    outstanding tasks for this date</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarView;