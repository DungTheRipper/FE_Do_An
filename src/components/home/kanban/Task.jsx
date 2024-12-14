import {Draggable} from "react-beautiful-dnd";

const Task = ({darkMode, task, index}) => {
    const priorityColorMap = {
        1: !darkMode ? "bg-green-100" : "bg-green-900",
        2: !darkMode ? "bg-yellow-100" : "bg-yellow-900",
        3: !darkMode ? "bg-red-100" : "bg-red-900",
    };
    const priorityIconMap = {
        1: "/prio-low.svg",
        2: "/prio-medium.svg",
        3: "/prio-high.svg",
    }

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    className={`flex flex-col space-between cursor-pointer my-2.5 min-h-[90px] mb-2 rounded-lg p-2 shadow-md
                      ${darkMode ? `text-gray-100 ${priorityColorMap[task.priority]}` : `text-gray-600 ${priorityColorMap[task.priority]}`}
                      ${snapshot.isDragging && "bg-blue-300 text-gray-100"}
                      transition-all duration-200`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <p className={`text-start text-xl font-bold ${darkMode ? "text-gray-100" : "text-gray-600"}`}
                       style={{userSelect: "none"}}
                    >
                        {task.title}
                    </p>
                    <p className={`text-start text-sm ${darkMode ? "text-gray-100" : "text-gray-600"}`}
                       style={{userSelect: "none"}}
                    >
                        Deadline: {task.deadline}
                    </p>
                    <img src={`${priorityIconMap[task.priority]}`} alt={"Priority: " + task.priority}
                         className={"text-start w-1/12 h-1/12"}
                         style={{userSelect: "none"}}
                    />
                    {provided.placeholder}
                </div>
            )}
        </Draggable>
    );
};

export default Task;
