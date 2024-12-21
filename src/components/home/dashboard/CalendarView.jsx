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
            const formattedDate = formatDateTime(date, true);
            try {
                setLoading(true);
                const [allTasksRes, overdueTasksRes, onDeadlineTasksRes] = await Promise.all([
                    axiosInstance.get(`/api/tasks/all-task/?time=` + formattedDate),
                    axiosInstance.get(`/api/tasks/overdue-tasks/?time=` + formattedDate),
                    axiosInstance.get(`/api/tasks/on-deadline-tasks/?time=` + formattedDate),
                ]);

                const allTasks = allTasksRes.data.data.tasks.map(task => ({ ...task, type: 'all' }));
                const overdueTasks = overdueTasksRes.data.data.tasks.map(task => ({ ...task, type: 'overdue' }));
                const onDeadlineTasks = onDeadlineTasksRes.data.data.tasks.map(task => ({ ...task, type: 'on_deadline' }));

                const taskMap = new Map();

                overdueTasks.forEach(task => taskMap.set(task.id, { ...task, color: 'red' }));
                onDeadlineTasks.forEach(task => {
                    if (!taskMap.has(task.id)) {
                        taskMap.set(task.id, { ...task, color: 'yellow' });
                    }
                });
                allTasks.forEach(task => {
                    if (!taskMap.has(task.id)) {
                        taskMap.set(task.id, { ...task, color: 'default' });
                    }
                });

                const uniqueTasks = Array.from(taskMap.values());
                setSelectedDateTask(uniqueTasks);
            } catch (error) {
                console.error("Error fetching task data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData(selectedDate);
    }, [selectedDate]);

    const getTitleColor = (color) => {
        switch (color) {
            case "red":
                return "text-red-500"
            case "yellow":
                return "text-yellow-500"
            case "default":
                return darkMode ? "text-gray-200" : "text-gray-500"
        }
    }

    const getPriorityImg = (priority) => {
        switch (priority) {
            case 1:
                return "/prio-low.svg";
            case 2:
                return "/prio-medium.svg";
            case 3:
                return "/prio-high.svg";
        }
    }

    const getTypeColor = (type) => {
        switch (type) {
            case "all":
                return darkMode ? "bg-green-200 text-gray-500" : "bg-green-500 text-gray-100";
            case "overdue":
                return darkMode ? "bg-red-200 text-gray-500" : "bg-red-500 text-gray-100";
            case "on_deadline":
                return darkMode ? "bg-yellow-200 text-gray-500" : "bg-yellow-500 text-gray-100";
            default:
                return darkMode ? "bg-gray-200 text-gray-500" : "bg-gray-500 text-gray-100";
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

    const formatDateTime = (date, resetHours = false) => {
        const newDate = date ? new Date(date) : new Date();
        if (resetHours) {
            newDate.setHours(0, 0, 0, 0);
        }

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
        const formattedDate = formatter.format(newDate);

        const [datePart, timePart] = formattedDate.split(', ');
        const [month, day, year] = datePart.split('/');

        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${timePart}`;
    };


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
                    <div className="transition-colors duration-200 transform">
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
                                    <th className={`px-4 py-2 text-left text-sm font-bold ${darkMode ? "text-gray-200" : "text-gray-600"}`}>Title</th>
                                    <th className={`px-4 py-2 text-center text-sm font-bold ${darkMode ? "text-gray-200" : "text-gray-600"}`}>Status</th>
                                    <th className={`px-4 py-2 text-center text-sm font-bold ${darkMode ? "text-gray-200" : "text-gray-600"}`}>Priority</th>
                                    <th className={`px-4 py-2 text-center text-sm font-bold ${darkMode ? "text-gray-200" : "text-gray-600"}`}>Deadline</th>
                                    <th className={`px-4 py-2 text-center text-sm font-bold ${darkMode ? "text-gray-200" : "text-gray-600"}`}>Project</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedDateTask.map(task => (
                                    <tr key={task.id} className={darkMode ? "border-gray-700" : "border-b"}>
                                        <td className={`text-left font-semibold px-4 py-2 ${getTitleColor(task.color)}`}>{task.title}</td>
                                        <td className="text-center font-semibold px-4 py-2">
                                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(task.type)}`}>
                                                {task.type === "all"
                                                    ? "In Progress"
                                                    : task.type === "on_deadline"
                                                        ? "On Deadline"
                                                        : "Overdue"}
                                            </span>
                                        </td>
                                        <td className="text-center font-semibold px-4 py-2">
                                            <img className={`inline-block px-2 py-1 text-xs rounded-full`}
                                                 src={getPriorityImg(task.priority)}
                                                alt={""} />
                                        </td>
                                        <td className={`text-center font-semibold px-4 py-2 ${new Date(task.deadline) < new Date() ? "text-red-500" : ""}`}>
                                            {formatDateTime(new Date(task.deadline))}
                                        </td>
                                        <td className="text-center font-semibold px-4 py-2">{task.project_name || "No Project"}</td>
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