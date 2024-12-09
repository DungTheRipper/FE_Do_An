import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CalendarView = ({darkMode}) => {
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Project Alpha",
      columns: [
        { id: "1", name: "a", color: "#3B82F6" },
        { id: "2", name: "b", color: "#10B981" },
        { id: "3", name: "c", color: "#6366F1" },
        { id: "4", name: "d", color: "#EF4444" }
      ],
      tasks: [
        { id: "1", columnId: "1", title: "Design UI Mockups", status: "pending", priority: "high", deadline: "2024-12-20" },
        { id: "2", columnId: "2", title: "Implement API Integration", status: "in progress", priority: "medium", deadline: "2024-12-25" }
      ]
    }
  ]);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "low":
        return darkMode ? "bg-yellow-800" : "bg-yellow-100";
      case "medium":
        return darkMode ? "bg-orange-800" : "bg-orange-100";
      case "high":
        return darkMode ? "bg-red-800" : "bg-red-100";
      default:
        return darkMode ? "bg-gray-800" : "bg-gray-100";
    }
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getTasksForDate = (date) => {
    const selectedDateObj = new Date(date);
    return selectedProject.tasks.filter(task => {
      const taskDeadline = new Date(task.deadline);
      return selectedDateObj <= taskDeadline && 
             (task.status === "pending" || task.status === "in progress" || task.status === "overdue");
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsZoomed(true);
  };

  const handleBackClick = () => {
    setIsZoomed(false);
  };

  const getStatusColor = (status) => {
    const column = selectedProject.columns.find(col => col.name.toLowerCase() === status);
    return column ? column.color : darkMode ? "bg-gray-800" : "bg-gray-100";
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const tasksForDay = getTasksForDate(date);

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
          {tasksForDay.length > 0 && (
            <div className="absolute bottom-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {tasksForDay.length}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={`p-4 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className={`rounded-lg shadow p-4 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
        <div className={`text-right mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          {currentTime.toLocaleTimeString()}
        </div>
        <select
          value={selectedProject.id}
          onChange={(e) => setSelectedProject(projects.find(p => p.id === e.target.value))}
          className={`mb-4 p-2 border rounded w-full ${darkMode ? "bg-gray-700 text-white border-gray-600" : "border-gray-300"}`}
        >
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>

        {!isZoomed ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigateMonth(-1)}
                className={`p-2 rounded ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <FaChevronLeft />
              </button>
              <h2 className="text-xl font-semibold">
                {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className={`p-2 rounded ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <FaChevronRight />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className={`text-center font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{day}</div>
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
              <FaChevronLeft className="mr-2" /> Back to Calendar
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {selectedDate.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
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
                  {getTasksForDate(selectedDate).map(task => (
                    <tr key={task.id} className={darkMode ? "border-gray-700" : "border-b"}>
                      <td className="px-4 py-2">{task.title}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
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
              {getTasksForDate(selectedDate).length === 0 && (
                <p className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No outstanding tasks for this date</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;