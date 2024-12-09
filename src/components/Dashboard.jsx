import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash, FaSort, FaPlus } from "react-icons/fa";

const Dashboard = ({darkMode}) => {
  const [tasks, setTasks] = useState([
    { id: "1", columnId: "1", title: "Design UI Mockups", status: "pending", priority: "high", deadline: "2024-12-20" },
    { id: "2", columnId: "2", title: "Implement API Integration", status: "in progress", priority: "medium", deadline: "2024-12-25" }
  ]);

  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const checkDeadlines = () => {
      const currentDate = new Date();
      const newNotifications = [];

      tasks.forEach(task => {
        const deadlineDate = new Date(task.deadline);
        const timeDiff = deadlineDate.getTime() - currentDate.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysRemaining < 0 && task.status !== "done") {
          newNotifications.push({
            id: `${task.id}-overdue`,
            message: `${task.title} is overdue`,
            type: "danger"
          });
        } else if (daysRemaining <= 3 && daysRemaining >= 0 && task.status !== "done") {
          newNotifications.push({
            id: `${task.id}-warning`,
            message: `${task.title} deadline in ${daysRemaining} days`,
            type: "warning"
          });
        }
      });

      setNotifications(newNotifications);
    };

    checkDeadlines();
    const interval = setInterval(checkDeadlines, 86400000);

    return () => clearInterval(interval);
  }, [tasks]);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow p-4 `}>
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className={`${darkMode ? "bg-blue-900" : "bg-blue-100"} p-4 rounded-lg `}>
            <p className="text-2xl font-bold">{tasks.length}</p>
            <p className="text-sm">Total Tasks</p>
          </div>
          <div className={`${darkMode ? "bg-green-900" : "bg-green-100"} p-4 rounded-lg `}>
            <p className="text-2xl font-bold">{tasks.filter(t => t.status === "done").length}</p>
            <p className="text-sm">Completed</p>
          </div>
        </div>
      </div>
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow p-4 `}>
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-2">
          {tasks.slice(0, 3).map(task => (
            <div key={task.id} className={`flex items-center justify-between p-2 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded `}>
              <span>{task.title}</span>
              <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(task.priority)} `}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow p-4 `}>
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-2">
          {notifications.map(notification => (
            <div key={notification.id} className={`p-2 rounded ${notification.type === "danger" ? (darkMode ? "bg-red-900" : "bg-red-100") : (darkMode ? "bg-yellow-900" : "bg-yellow-100")} `}>
              {notification.message}
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-gray-500 text-center p-2">
              No pending notifications
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;