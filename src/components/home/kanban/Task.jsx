import {Draggable} from "react-beautiful-dnd";
import {useState} from "react";
import TaskDetailsPopup from "../../helper/TaskDetailsPopup.jsx";

const Task = ({darkMode, task, index, onTaskUpdated}) => {
    const [showDetailTaskPopup, setShowDetailTaskPopup] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(date);
    };

    const priorityIconMap = {
        1: "/prio-low.svg",
        2: "/prio-medium.svg",
        3: "/prio-high.svg",
    };

    const isOverdue = task.status === 3;

    return (
        <div className="relative">
            <Draggable draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        className={`flex flex-col space-between cursor-pointer my-2.5 w-full h-[100px] max-w-full 
                        rounded-lg p-2 shadow-md border border-gray-300 overflow-hidden 
                        ${snapshot.isDragging && "bg-blue-300 text-gray-100"}
                        ${
                            isOverdue
                                ? (darkMode ? "border-2 border-red-600 bg-red-500" : "border-2 border-red-600 bg-red-200")
                                : darkMode
                                    ? "text-gray-100 bg-gray-600"
                                    : "text-gray-600 bg-gray-100"
                        } transition-all duration-200`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => setShowDetailTaskPopup(true)}
                    >
                        <p
                            className={`text-start text-lg font-bold truncate ${
                                darkMode ? "text-gray-100" : "text-gray-600"
                            }`}
                            title={task.title}
                        >
                            {task.title}
                        </p>
                        <p
                            className={`text-start text-sm truncate ${
                                darkMode ? "text-gray-100" : "text-gray-600"
                            }`}
                            title={`Deadline: ${formatDate(task.deadline)}`}
                        >
                            Deadline: {formatDate(task.deadline)}
                        </p>
                        <img
                            src={`${priorityIconMap[task.priority]}`}
                            alt={"Priority: " + task.priority}
                            className={"text-start w-1/12 h-1/12"}
                        />
                        {isOverdue && (
                            <p className={`${darkMode ? "text-red-900" : "text-red-600"} font-bold text-xs`}>⚠️ Overdue</p>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Draggable>

            {showDetailTaskPopup && (
                <TaskDetailsPopup darkMode={darkMode} task={task}
                                  isOverdue={isOverdue}
                                  onClose={() => setShowDetailTaskPopup(false)}
                                  onTaskUpdated={onTaskUpdated}
                />
            )}
        </div>
    );
};

export default Task;
