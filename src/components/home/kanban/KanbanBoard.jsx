import React, {useEffect, useState} from 'react';
import {DragDropContext} from "react-beautiful-dnd";
import Loading from "../../helper/Loading.jsx";
import Column from "./Column.jsx";
import axiosInstance from "../../../AxiosConfig.js";

const KanbanBoard = ({darkMode, projectId}) => {
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const fetchTasks = async () => {
            try {
                const response = await axiosInstance.get(`/api/tasks/task/get/${projectId}/`);
                const {columns: apiColumns, project} = response.data.data;

                const updatedColumns = apiColumns.map((column) => {
                    const tasksInColumn = column.tasks.map(task => ({
                        id: task.id,
                        title: task.title,
                        content: task.content,
                        deadline: task.deadline,
                        priority: task.priority,
                        status: task.status,
                        finish_at: task.finish_at,
                    }));
                    return {
                        ...column.column,
                        tasks: tasksInColumn,
                    };
                });

                setColumns(updatedColumns);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [projectId]);

    const handleOnDragEnd = (result) => {
        const {destination, source, draggableId} = result;

        if (!destination) return;
        if (destination.index === source.index && destination.droppableId === source.droppableId) return;

        const updatedColumns = [...columns];
        const sourceColumn = updatedColumns.find(col => col.id === source.droppableId);
        const destinationColumn = updatedColumns.find(col => col.id === destination.droppableId);

        const task = sourceColumn.tasks.find(task => task.id === draggableId);
        sourceColumn.tasks = sourceColumn.tasks.filter(task => task.id !== draggableId);
        destinationColumn.tasks.splice(destination.index, 0, task);

        setColumns(updatedColumns);
    };

    return (
        <div className="relative">
            {loading && <Loading/>}
            <div className="p-4">
                <div
                    className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-lg shadow p-4 transition-colors duration-200 mb-8`}
                >
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <div className="flex flex-row space-x-2 overflow-x-auto">
                            {columns.map((column) => (
                                <Column
                                    key={column.id}
                                    darkMode={darkMode}
                                    title={column.name}
                                    tasks={column.tasks}
                                    id={column.id}
                                />
                            ))}
                        </div>
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;
