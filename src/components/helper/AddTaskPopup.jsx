import React, {useState} from "react";
import axiosInstance from "../../AxiosConfig.js";
import NotificationManager from "./NotificationManager.jsx";

const AddTaskPopup = ({darkMode, projectId, columns, onClose, onTaskAdded}) => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        deadline: "",
        priority: 1,
        status: 1,
        project: projectId || "",
        column: columns?.[0]?.id || "",
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleChangeCalendar = (e) => {
        const {value} = e.target;
        const currentDateTime = new Date();
        const selectedDateTime = new Date(value);

        if (selectedDateTime < currentDateTime) {
            alert("Deadline cannot be in the past, please select a valid time.");
            return;
        }

        handleChange(e);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/api/tasks/task/", formData);
            NotificationManager.showNotification(
                "Task added successfully",
                `Task "${formData.title}" added successfully`,
                "success"
            )
            onTaskAdded();
            onClose();
        } catch (err) {
            console.error("Error creating task:", err);
            NotificationManager.showNotification(
                "Failed to add task",
                `Failed to create task. Please try again.`,
                "danger"
            )
        }
    };

    return (
        <div className="relative z-50">
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div
                    className={`${
                        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                    } rounded-md w-1/2 p-6`}
                >
                    <h2 className="text-2xl font-bold mb-4">Create Task</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-semibold">Content</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="block text-sm font-semibold">Deadline <span
                                className="text-red-500">*</span></label>
                            <input
                                type="datetime-local"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChangeCalendar}
                                required
                                min={new Date().toISOString().slice(0, 16)}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-semibold">Priority <span
                                className="text-red-500">*</span></label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="1">Low</option>
                                <option value="2">Medium</option>
                                <option value="3">High</option>
                            </select>
                        </div>

                        {/* Column */}
                        <div>
                            <label className="block text-sm font-semibold">Column <span
                                className="text-red-500">*</span></label>
                            <select
                                name="column"
                                value={formData.column}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                {columns?.map((col) => (
                                    <option key={col.id} value={col.id}>
                                        {col.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTaskPopup;
