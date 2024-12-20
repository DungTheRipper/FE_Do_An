import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Loading from "../../helper/Loading.jsx";
import Column from "./Column.jsx";
import axiosInstance from "../../../AxiosConfig.js";
import AddTaskPopup from "../../helper/AddTaskPopup.jsx";
import ManageColumnsPopup from "../../helper/ManageColumnsPopup.jsx";
import {FaColumns, FaPlus} from "react-icons/fa";

const KanbanBoard = ({ darkMode, projectId }) => {
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
    const [showManageColumnsPopup, setShowManageColumnsPopup] = useState(false);

    const fetchColumns = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/tasks/task/get/${projectId}/`);
            const { columns: apiColumns } = response.data.data;

            const updatedColumns = apiColumns.map((column) => {
                const tasksInColumn = column.tasks.map((task) => ({
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
            console.error("Error fetching columns:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColumns();
    }, [projectId]);

    const handleOnDragEnd = async (result) => {
        const {destination, source, draggableId} = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const updatedColumns = [...columns];
        const sourceColumn = updatedColumns.find((col) => col.id === source.droppableId);
        const destinationColumn = updatedColumns.find((col) => col.id === destination.droppableId);

        const task = sourceColumn.tasks.find((task) => task.id === draggableId);
        sourceColumn.tasks = sourceColumn.tasks.filter((task) => task.id !== draggableId);
        destinationColumn.tasks.splice(destination.index, 0, task);

        setColumns(updatedColumns);

        try {
            await axiosInstance.patch(`/api/tasks/task/${draggableId}/`, {
                column: destinationColumn.id,
                status: destinationColumn.is_done_column ? 2 : task.status === 2 ? 1 : task.status,
            });
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <div className="relative">
            {loading && <Loading />}
            <div className="p-4">
                <div
                    className={`${
                        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                    } rounded-lg shadow p-4 transition-colors duration-200 mb-8`}
                >
                    <div className="flex justify-start items-center mb-4 space-x-8 border-b border-gray-200 p-2">
                        <h2 className="text-2xl font-bold">Kanban Board</h2>
                        <button
                            onClick={() => setShowManageColumnsPopup(true)}
                            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            <FaColumns className="mr-2"/> Manage Columns
                        </button>
                        <button
                            onClick={() => setShowAddTaskPopup(true)}
                            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            <FaPlus className="mr-2"/> Add a task
                        </button>
                    </div>

                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        {showAddTaskPopup && (
                            <AddTaskPopup
                                darkMode={darkMode}
                                projectId={projectId}
                                columns={columns}
                                onClose={() => setShowAddTaskPopup(false)}
                                onTaskAdded={fetchColumns}
                            />
                        )}
                        <div className="flex flex-row space-x-2 overflow-x-auto">
                            {columns.map((column) => (
                                <Column
                                    key={column.id}
                                    darkMode={darkMode}
                                    title={column.name}
                                    tasks={column.tasks}
                                    id={column.id}
                                    onTaskUpdated={fetchColumns}
                                />
                            ))}
                        </div>
                    </DragDropContext>
                </div>
            </div>

            {showManageColumnsPopup && (
                <ManageColumnsPopup
                    currentColumns={columns}
                    projectId={projectId}
                    onClose={() => setShowManageColumnsPopup(false)}
                    onColumnsUpdated={fetchColumns}
                />
            )}
        </div>
    );
};

export default KanbanBoard;
