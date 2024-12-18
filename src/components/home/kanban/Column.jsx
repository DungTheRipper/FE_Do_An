import {Droppable} from "react-beautiful-dnd";
import Task from "./Task.jsx";

const Column = ({darkMode, title, tasks, id, onTaskUpdated}) => {
    return (
        <div
            className={`column ${darkMode ? "bg-gray-700" : "bg-gray-100"}
                rounded-md min-w-[300px] max-w-[300px] min-h-[75vh] flex-shrink-0 overflow-hidden shadow-lg border border-gray-300`}
        >
            <div className="relative flex items-center justify-center px-2 py-2 border-b border-gray-300">
                <h3
                    className={`text-center font-bold text-xl truncate w-5/6 ${
                        darkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                    title={title}
                >
                    {title}
                </h3>
            </div>
            <Droppable droppableId={id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`${darkMode ? "text-gray-100 bg-gray-700" : "text-gray-600 bg-gray-100"} p-3 transition-colors duration-200 flex-grow min-h-[100px]`}
                    >
                        {tasks.map((task, index) => (
                            <Task key={task.id} task={task} index={index} darkMode={darkMode} onTaskUpdated={onTaskUpdated}/>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;
