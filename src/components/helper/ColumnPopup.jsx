import { IoMdClose } from "react-icons/io";
import React, { useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import axiosInstance from "../../AxiosConfig.js";
import Loading from "./Loading.jsx";

const ColumnPopup = ({ title, columnForm, setColumnForm, selectedColumnId, onClose, isDeleting }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setColumnForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (isDeleting) {
            return true;
        }
        if (!columnForm.name) {
            newErrors.name = "Column name is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            switch (title) {
                case "Rename Column":
                    await handleRenameColumn(selectedColumnId);
                    break;
                case "Delete Column":
                    await handleDeleteColumn(selectedColumnId);
                    break;
                default:
                    break;
            }
        }
    };

    const handleRenameColumn = async (columnId) => {
        try {
            setLoading(true);
            await axiosInstance.put(`/api/tasks/column/${columnId}/`, columnForm);
            window.location.reload();
        } catch (e) {
            setLoading(false);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteColumn = async (columnId) => {
        try {
            setLoading(true);
            await axiosInstance.delete(`/api/tasks/column/${columnId}/`, {});
            window.location.reload();
        } catch (e) {
            setLoading(false);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-50">
            {loading && <Loading />}
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-md w-1/3 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{title}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <IoMdClose size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {!isDeleting ? (
                            <div>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Column Name
                                    </label>
                                    <div className="relative mt-1">
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={columnForm.name}
                                            onChange={handleChange}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                                            placeholder="Enter column name"
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        {title}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="mb-2">Are you sure you want to delete this column?</p>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        {title}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ColumnPopup;
