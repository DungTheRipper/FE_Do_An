import {useState} from "react";
import {IoMdClose} from "react-icons/io";
import Loading from "./Loading.jsx";
import axiosInstance from "../../AxiosConfig.js";
import NotificationManager from "./NotificationManager.jsx";

const TaskDetailsPopup = ({darkMode, task, onClose, onTaskUpdated}) => {
    const [loading, setLoading] = useState(false);
    const [showExtendPopup, setShowExtendPopup] = useState(false);
    const [newDeadline, setNewDeadline] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [formData, setFormData] = useState({
        title: task.title,
        content: task.content || "",
        deadline: task.deadline.slice(0, 16),
        priority: task.priority,
    });

    const isOverdue = task.status === 3;

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleUpdateTask = async () => {
        try {
            setLoading(true);
            await axiosInstance.patch(`/api/tasks/task/${task.id}/`, {
                ...formData
            });
            NotificationManager.showNotification(
                "Successfully updated task",
                `The task "${formData.title}" was updated successfully.`,
                "success"
            )
            onTaskUpdated();
            onClose();
        } catch (error) {
            console.error("Error updating task:", error);
            NotificationManager.showNotification(
                "Failed to update task",
                "An error occurred while updating task",
                "danger"
            )
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async () => {
        try {
            setLoading(true);
            await axiosInstance.delete(`/api/tasks/task/${task.id}/`);
            NotificationManager.showNotification(
                "Task Deleted",
                `The task "${task.title}" has been deleted successfully.`,
                "success"
            );
            onTaskUpdated();
            onClose();
        } catch (error) {
            console.error("Error deleting task:", error);
            NotificationManager.showNotification(
                "Failed to Delete Task",
                "An error occurred while deleting the task.",
                "danger"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleExtendTask = async () => {
        try {
            setLoading(true);
            await axiosInstance.patch(`/api/tasks/task/${task.id}/`, {
                deadline: newDeadline,
                status: 1,
            });
            NotificationManager.showNotification(
                "Task Deleted",
                `The task "${task.title}" has been extended successfully.`,
                "success"
            );
            onTaskUpdated();
            onClose();
        } catch (error) {
            console.error("Error extending task:", error);
            NotificationManager.showNotification(
                "Failed to Extend Task",
                "An error occurred while extending the task.",
                "danger"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChangeCalendar = (e) => {
        const {value} = e.target;
        const currentDateTime = new Date();
        const selectedDateTime = new Date(value);

        if (selectedDateTime < currentDateTime) {
            NotificationManager.showNotification(
                "Alert calendar",
                `Deadline cannot be in the past, please select a valid time.`,
                "warning"
            );
            return;
        }

        setNewDeadline(value);
    }

    return (
        <div className="relative">
            {loading && <Loading/>}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                        <h2 className="text-xl font-semibold mb-4">Delete Task</h2>
                        <p>Are you sure you want to delete the task "{task.title}"?</p>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded border"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteTask}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div
                    className={`relative rounded-lg w-1/3 p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-600"
                    >
                        <IoMdClose size={24}/>
                    </button>

                    <h2 className="text-2xl font-bold mb-4">Task Detail</h2>
                    <form className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
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
                            <label className="block text-sm font-semibold">Deadline</label>
                            <input
                                type="datetime-local"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-semibold">Priority</label>
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
                        {/* Status */}
                        {isOverdue && <p className="text-red-600 font-bold">⚠️ This task is overdue!</p>}
                        {/* Buttons */}
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                            {isOverdue && (
                                <button
                                    type="button"
                                    onClick={() => setShowExtendPopup(true)}
                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                                >
                                    Extend Task
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleUpdateTask}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Extend Task Popup */}
            {showExtendPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                        className={`rounded-lg w-1/3 p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                        <h2 className="text-2xl font-bold mb-4">Extend Task Deadline</h2>
                        <div>
                            <label className="block text-sm font-semibold mb-2">New Deadline</label>
                            <input
                                type="datetime-local"
                                value={newDeadline}
                                onChange={handleChangeCalendar}
                                min={new Date().toISOString().slice(0, 16)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={() => setShowExtendPopup(false)}
                                className="px-4 py-2 border rounded hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleExtendTask}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetailsPopup;
