import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const OldKanbanBoard = ({ darkMode, projectId }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    status: "pending",
    priority: "medium",
    deadline: "",
    columnId: ""
  });
  const [newProject, setNewProject] = useState({ name: "" });
  const [newColumn, setNewColumn] = useState({ name: "", color: "#3B82F6" });
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewColumn, setShowNewColumn] = useState(false);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showEditTaskForm, setShowEditTaskForm] = useState(false);

  const currentProject = projects.find(p => p.id === selectedProject);

  const groupColumnsIntoRows = (columns) => {
    const rows = [];
    for (let i = 0; i < columns.length; i += 4) {
      rows.push(columns.slice(i, i + 4));
    }
    return rows;
  };

  const handleDeleteProject = (projectId) => {
    if (projects.length <= 1) {
      alert("Cannot delete the last project");
      return;
    }
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    setSelectedProject(updatedProjects[0].id);
  };

  const handleAddProject = () => {
    if (newProject.name.trim()) {
      const project = {
        id: String(Date.now()),
        name: newProject.name,
        columns: [],
        tasks: []
      };
      setProjects([...projects, project]);
      setNewProject({ name: "" });
      setShowNewProject(false);
    }
  };

  const handleAddColumn = () => {
    if (newColumn.name.trim()) {
      const updatedProjects = projects.map(project => {
        if (project.id === selectedProject) {
          return {
            ...project,
            columns: [...project.columns, {
              id: `col-${Date.now()}`,
              name: newColumn.name,
              color: newColumn.color
            }]
          };
        }
        return project;
      });
      setProjects(updatedProjects);
      setNewColumn({ name: "", color: "#3B82F6" });
      setShowNewColumn(false);
    }
  };

  const handleDeleteColumn = (columnId) => {
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject) {
        const updatedColumns = project.columns.filter(col => col.id !== columnId);
        const updatedTasks = project.tasks.filter(task => task.columnId !== columnId);
        return {
          ...project,
          columns: updatedColumns,
          tasks: updatedTasks
        };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const handleUpdateColumn = (columnId) => {
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject) {
        const updatedColumns = project.columns.map(col =>
          col.id === columnId ? { ...editingColumn } : col
        );
        return {
          ...project,
          columns: updatedColumns
        };
      }
      return project;
    });
    setProjects(updatedProjects);
    setEditingColumn(null);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !currentProject || !newTask.columnId) return;

    const newTaskItem = {
      id: String(Date.now()),
      title: newTask.title,
      status: currentProject.columns.find(col => col.id === newTask.columnId)?.name.toLowerCase() || "pending",
      priority: newTask.priority || "medium",
      deadline: newTask.deadline || new Date().toISOString().split("T")[0],
      columnId: newTask.columnId
    };

    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject) {
        return {
          ...project,
          tasks: [...project.tasks, newTaskItem]
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    setNewTask({
      title: "",
      status: "pending",
      priority: "medium",
      deadline: "",
      columnId: ""
    });
    setShowNewTaskForm(false);
  };

  const handleUpdateTask = () => {
    if (typeof newTask.title === "string") {
      const updatedProjects = projects.map(project => {
        if (project.id === selectedProject) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === editingTask.id ? { ...newTask, id: task.id } : task
            )
          };
        }
        return project;
      });
      setProjects(updatedProjects);
      setEditingTask(null);
      setShowEditTaskForm(false);
      setNewTask({
        title: "",
        status: "pending",
        priority: "medium",
        deadline: "",
        columnId: ""
      });
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      ...task
    });
    setShowEditTaskForm(true);
  };

  const handleDeleteTask = (taskId) => {
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject) {
        return {
          ...project,
          tasks: project.tasks.filter(task => task.id !== taskId)
        };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject) {
        const newStatus = result.destination.droppableId.toLowerCase();
        const newColumnId = project.columns.find(col => 
          col.name.toLowerCase() === newStatus
        )?.id;
        const newTasks = Array.from(project.tasks);
        const taskToMove = newTasks.find(task => task.id === result.draggableId);
        const updatedTask = {
          ...taskToMove,
          status: newStatus,
          columnId: newColumnId
        };
        const filteredTasks = newTasks.filter(task => task.id !== result.draggableId);
        filteredTasks.splice(result.destination.index, 0, updatedTask);
        return { ...project, tasks: filteredTasks };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"} p-4`}>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className={`p-2 rounded border ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowNewProject(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <FaPlus className="inline mr-2" /> New Project
          </button>
          <button
            onClick={() => handleDeleteProject(selectedProject)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <FaTrash className="inline mr-2" /> Delete Project
          </button>
          <button
            onClick={() => setShowNewColumn(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <FaPlus className="inline mr-2" /> New Column
          </button>
          <button
            onClick={() => setShowNewTaskForm(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            <FaPlus className="inline mr-2" /> New Task
          </button>
        </div>

        {showNewProject && (
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ name: e.target.value })}
              placeholder="Project name"
              className={`p-2 rounded border ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
            />
            <button
              onClick={handleAddProject}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Project
            </button>
            <button
              onClick={() => setShowNewProject(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        )}

        {showNewColumn && (
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newColumn.name}
              onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
              placeholder="Column name"
              className={`p-2 rounded border ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
            />
            <input
              type="color"
              value={newColumn.color}
              onChange={(e) => setNewColumn({ ...newColumn, color: e.target.value })}
              className="p-1 rounded border"
            />
            <button
              onClick={handleAddColumn}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Column
            </button>
            <button
              onClick={() => setShowNewColumn(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        )}

        {(showNewTaskForm || showEditTaskForm) && (
          <div className={`mb-4 p-4 rounded shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-lg font-semibold mb-3">
              {showEditTaskForm ? "Edit Task" : "Create New Task"}
            </h3>
            <div className="grid gap-3">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
                className={`p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className={`p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                value={newTask.columnId}
                onChange={(e) => setNewTask({ ...newTask, columnId: e.target.value })}
                className={`p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              >
                <option value="">Select Column</option>
                {currentProject?.columns.map(column => (
                  <option key={column.id} value={column.id}>{column.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                className={`p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              />
              <div className="flex gap-2">
                <button
                  onClick={showEditTaskForm ? handleUpdateTask : handleAddTask}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  {showEditTaskForm ? "Update Task" : "Add Task"}
                </button>
                <button
                  onClick={() => {
                    setShowNewTaskForm(false);
                    setShowEditTaskForm(false);
                    setEditingTask(null);
                    setNewTask({
                      title: "",
                      status: "pending",
                      priority: "medium",
                      deadline: "",
                      columnId: ""
                    });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col gap-4">
          {groupColumnsIntoRows(currentProject?.columns || []).map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-4 w-full">
              {row.map(column => (
                <div key={column.id} className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    {editingColumn?.id === column.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={editingColumn.name}
                          onChange={(e) => setEditingColumn({ ...editingColumn, name: e.target.value })}
                          className={`p-1 rounded border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                        />
                        <input
                          type="color"
                          value={editingColumn.color}
                          onChange={(e) => setEditingColumn({ ...editingColumn, color: e.target.value })}
                          className="p-1 rounded border"
                        />
                        <button
                          onClick={() => handleUpdateColumn(column.id)}
                          className="text-green-500 hover:text-green-700"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{column.name}</h3>
                        <div
                          className="w-4 h-4 rounded-full cursor-pointer"
                          style={{ backgroundColor: column.color }}
                          onClick={() => setEditingColumn(column)}
                        />
                        <button
                          onClick={() => handleDeleteColumn(column.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                  <Droppable droppableId={column.name.toLowerCase()}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`p-4 rounded-lg min-h-[400px] ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}
                        style={{ borderTop: `3px solid ${column.color}` }}
                      >
                        {currentProject.tasks
                          .filter(task => task.columnId === column.id)
                          .map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-4 rounded-lg shadow mb-2 border-l-4 cursor-move ${darkMode ? "bg-gray-700" : "bg-white"}`}
                                  style={{ 
                                    borderLeftColor: column.color,
                                    ...provided.draggableProps.style
                                  }}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-semibold">{task.title}</div>
                                      <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-sm rounded px-2 py-1 ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
                                          {task.priority}
                                        </span>
                                        <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                          {task.deadline}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => handleEditTask(task)} 
                                        className="text-blue-500 hover:text-blue-700"
                                      >
                                        <FaEdit />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteTask(task.id)} 
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default OldKanbanBoard;