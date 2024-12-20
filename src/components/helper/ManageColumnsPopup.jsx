import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Loading from "./Loading.jsx";
import axiosInstance from "../../AxiosConfig.js";
import NotificationManager from "./NotificationManager.jsx";

const ManageColumnsPopup = ({ currentColumns, projectId, onClose, onColumnsUpdated }) => {
    const [columns, setColumns] = useState([
        ...currentColumns.map((col) => ({
            ...col,
            isExisting: true,
            is_done_column: col.is_done_column || false,
        })),
    ]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const addColumnInput = () => {
        setColumns([
            ...columns,
            { project: projectId, name: "", order: columns.length + 1, isExisting: false, is_done_column: false },
        ]);
    };

    const removeColumnInput = async (index) => {
        const columnToRemove = columns[index];

        if (columnToRemove.isExisting) {
            try {
                await axiosInstance.delete(`/api/tasks/column/${columnToRemove.id}/`);
            } catch (error) {
                console.error("Error deleting column:", error);
                NotificationManager.showNotification(
                    "Failed to delete columns.",
                    "An error occurred while deleting columns.",
                    "danger"
                )
                return;
            }
        }

        const updatedColumns = columns.filter((_, i) => i !== index);
        setColumns(updatedColumns);
    };

    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const reorderedColumns = Array.from(columns);
        const [moved] = reorderedColumns.splice(source.index, 1);
        reorderedColumns.splice(destination.index, 0, moved);

        const updatedColumns = reorderedColumns.map((col, index) => ({
            ...col,
            order: index + 1,
        }));

        setColumns(updatedColumns);
    };

    const handleCheckboxChange = (index) => {
        const updatedColumns = columns.map((col, i) => ({
            ...col,
            is_done_column: i === index,
        }));
        setColumns(updatedColumns);
    };

    const validateForm = () => {
        if (!columns.some((col) => col.is_done_column)) {
            setError("At least one column must be marked as 'Done'.");
            return false;
        }
        if (columns.some((col) => !col.name.trim())) {
            setError("All columns must have a name.");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setIsLoading(true);

            const updates = columns.filter((col) => col.isExisting);
            for (const col of updates) {
                await axiosInstance.put(`/api/tasks/column/${col.id}/`, {
                    project: projectId,
                    name: col.name,
                    order: col.order,
                    is_done_column: col.is_done_column || false,
                });
            }

            const newColumns = columns.filter((col) => !col.isExisting);
            if (newColumns.length > 0) {
                await axiosInstance.post("/api/tasks/column/create-many/", newColumns);
            }

            onColumnsUpdated();
            onClose();
        } catch (error) {
            console.error("Error updating columns:", error);
            NotificationManager.showNotification(
                "Failed to save columns.",
                "An error occurred while saving columns.",
                "danger"
            )
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative z-50">
            {isLoading && <Loading />}
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-md w-2/3 p-6">
                    <h2 className="text-xl font-bold mb-2">Manage Columns</h2>
                    <p className="text-gray-600 mb-4 italic">* Checkbox is for Done Column</p>
                    {error && <p className="text-red-500 mb-2">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="columns">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-2"
                                    >
                                        {columns.map((column, index) => (
                                            <Draggable
                                                key={index}
                                                draggableId={String(index)}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="flex items-center space-x-3 px-4 py-2 bg-gray-100 rounded border"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={column.name}
                                                            onChange={(e) => {
                                                                const updatedColumns = [...columns];
                                                                updatedColumns[index].name = e.target.value;
                                                                setColumns(updatedColumns);
                                                            }}
                                                            className="flex-grow px-2 py-1 border rounded"
                                                            placeholder="Column Name"
                                                        />
                                                        <input
                                                            type="checkbox"
                                                            checked={column.is_done_column || false}
                                                            onChange={() => handleCheckboxChange(index)}
                                                            className="h-5 w-5"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeColumnInput(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                onClick={addColumnInput}
                                className="flex items-center text-blue-500 hover:text-blue-600"
                            >
                                <FaPlus className="mr-2" /> Add Column
                            </button>
                            <div className="space-x-2">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageColumnsPopup;
