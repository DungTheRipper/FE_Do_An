import React, { useState } from "react";
import { FaSearch, FaSort, FaEdit } from "react-icons/fa";

const WorkList = ({darkMode}) => {
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Project Alpha",
      columns: [
        { id: "1", name: "pending", color: "#9CA3AF" },
        { id: "2", name: "in progress", color: "#FBBF24" },
        { id: "3", name: "done", color: "#10B981" },
        { id: "4", name: "overdue", color: "#EF4444" }
      ],
      tasks: [
        { id: "1", columnId: "1", title: "Design UI Mockups", status: "pending", priority: "high", deadline: "2024-12-20" },
        { id: "2", columnId: "2", title: "Implement API Integration", status: "in progress", priority: "medium", deadline: "2024-12-25" }
      ]
    }
  ]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(projects[0].id);
  const [editingTaskId, setEditingTaskId] = useState(null);

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

  const sortTasks = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getCurrentProject = () => {
    return projects.find(project => project.id === selectedProject);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject) {
        const updatedTasks = project.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, status: newStatus };
          }
          return task;
        });
        return { ...project, tasks: updatedTasks };
      }
      return project;
    });
    setProjects(updatedProjects);
    setEditingTaskId(null);
  };

  const filteredTasks = getCurrentProject().tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.priority.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const taskDate = new Date(task.deadline);
      const today = new Date();
      
      switch(dateFilter) {
        case "today":
          matchesDate = taskDate.toDateString() === today.toDateString();
          break;
        case "thisWeek":
          const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
          const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
          matchesDate = taskDate >= weekStart && taskDate <= weekEnd;
          break;
        case "thisMonth":
          matchesDate = taskDate.getMonth() === today.getMonth() && 
                       taskDate.getFullYear() === today.getFullYear();
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
  });

  return (
    <div className={`p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="mb-4">
        <select
          className={`border rounded-lg px-4 py-2 ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"}`}
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 pr-4 py-2 border rounded-lg ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
          />
        </div>
        <div className="space-x-2 flex items-center">
          <select 
            className={`border rounded-lg px-4 py-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
            <option value="overdue">Overdue</option>
          </select>
          <select 
            className={`border rounded-lg px-4 py-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select 
            className={`border rounded-lg px-4 py-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
      </div>
      <div className={`rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="grid grid-cols-5 gap-4 p-4 font-semibold border-b">
          <div className="flex items-center cursor-pointer" onClick={() => sortTasks("title")}>
            Title <FaSort className="ml-2" />
          </div>
          <div className="flex items-center cursor-pointer" onClick={() => sortTasks("status")}>
            Status <FaSort className="ml-2" />
          </div>
          <div className="flex items-center cursor-pointer" onClick={() => sortTasks("priority")}>
            Priority <FaSort className="ml-2" />
          </div>
          <div className="flex items-center cursor-pointer" onClick={() => sortTasks("deadline")}>
            Deadline <FaSort className="ml-2" />
          </div>
          <div className="flex items-center">
            Actions
          </div>
        </div>
        {filteredTasks.map(task => (
          <div key={task.id} className={`border-b p-4 grid grid-cols-5 gap-4 items-center ${darkMode ? "border-gray-700" : ""}`}>
            <div className="flex items-center space-x-4">
              <span className="font-semibold">{task.title}</span>
            </div>
            <div>
              {editingTaskId === task.id ? (
                <select
                  className={`border rounded-lg px-4 py-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  autoFocus
                >
                  {getCurrentProject().columns.map(column => (
                    <option key={column.id} value={column.name}>{column.name}</option>
                  ))}
                </select>
              ) : (
                <span
                  className="capitalize px-2 py-1 rounded"
                  style={{
                    backgroundColor: getCurrentProject().columns.find(col => col.name === task.status)?.color,
                    color: "white"
                  }}
                >
                  {task.status}
                </span>
              )}
            </div>
            <div>
              <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <div className="flex items-center">
              <span>{task.deadline}</span>
            </div>
            <div>
              <button
                onClick={() => setEditingTaskId(editingTaskId === task.id ? null : task.id)}
                className="p-2 text-blue-600 hover:text-blue-800"
              >
                <FaEdit />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkList;