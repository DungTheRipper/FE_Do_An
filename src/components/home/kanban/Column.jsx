import {Droppable} from "react-beautiful-dnd";
import Task from "./Task.jsx";

const Column = ({darkMode, title, tasks, id}) => {
    return (
        <div
            className={`column ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-md min-w-[200px] min-h-screen max-w-max flex-grow transition-colors duration-200`}>
            <h3 className={`sticky px-2 py-2 text-center font-bold text-xl rounded
            ${darkMode ? "text-gray-100 bg-gray-700" : "text-gray-800 bg-gray-100"} 
            transition-colors duration-200`}
                style={{userSelect: "none"}}
            >
                {title}
            </h3>
            <Droppable droppableId={id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`${darkMode ? "text-gray-100 bg-gray-700" : "text-gray-600 bg-gray-100"} p-3 transition-colors duration-200 flex-grow min-h-[100px]`}
                    >
                        {tasks.map((task, index) => (
                            <Task key={task.id} task={task} index={index} darkMode={darkMode}/>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;
