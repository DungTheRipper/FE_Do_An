import {useState} from "react";
import Loading from "./Loading.jsx";

const TaskDetailsPopup = ({darkMode, task, isOverdue, onClose}) => {
    const [loading, setLoading] = useState(true);

    return (
        <div className="relative">
            {loading && <Loading/>}
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg w-1/3 p-6">
                    <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
                    <p className="mb-2">
                        <strong>Deadline:</strong> {task.deadline}
                    </p>
                    <p className="mb-4">
                        <strong>Content:</strong> {task.content || "No content provided."}
                    </p>
                    {isOverdue && <p className="text-red-600 font-bold">⚠️ This task is overdue!</p>}
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => console.log("Edit Task")}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskDetailsPopup;