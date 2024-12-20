import { IoMdClose } from "react-icons/io";
import React, { useState } from "react";
import { FaProjectDiagram } from "react-icons/fa";
import axiosInstance from "../../AxiosConfig.js";
import Loading from "./Loading.jsx";
import NotificationManager from "./NotificationManager.jsx";

const ProjectPopup = ({
                          title,
                          projectForm,
                          setProjectForm,
                          selectedProjectId,
                          onClose,
                          isDeleting,
                          projects,
                          setProjects,
                      }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!isDeleting) {
            if (!projectForm.name || !projectForm.name.trim()) {
                newErrors.name = "Project name is required";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            let title, message, projectName;
            if (selectedProjectId) {
                const response = await axiosInstance.get(`/api/tasks/project/${selectedProjectId}/`, {});
                projectName = response.data.name;
            }
            if (isDeleting) {
                await axiosInstance.delete(`/api/tasks/project/${selectedProjectId}/`);
                title = "Deleted project successfully";
                message = `You deleted project ${projectName} successfully`;
            } else if (selectedProjectId) {
                await axiosInstance.put(`/api/tasks/project/${selectedProjectId}/`, projectForm);
                title = "Updated project successfully";
                message = `You updated project ${projectForm.name} successfully`;
            } else {
                await axiosInstance.post(`/api/tasks/project/`, projectForm);
                title = "Created project successfully";
                message = `You created project ${projectForm.name} successfully`;
            }

            NotificationManager.showNotification(
                `${title}`,
                `${message}`,
                "success",
            )

            setProjects((prev) => [...prev]);
            onClose();
        } catch (error) {
            console.error("Error updating project:", error);
            let title, message;
            if (isDeleting) {
                title = "Failed to delete project";
                message = "An error occurred while deleting columns.";
            } else if (selectedProjectId) {
                title = "Failed to update project";
                message = "An error occurred while updating columns.";
            } else {
                title = "Failed to create project";
                message = "An error occurred while creating columns.";
            }
            NotificationManager.showNotification(
                `${title}`,
                `${message}`,
                "danger",
            )
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
                                        Project Name
                                    </label>
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaProjectDiagram className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={projectForm.name}
                                            onChange={handleChange}
                                            className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                                            placeholder="Enter project name"
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
                                <p className="mb-2">Are you sure you want to delete this project?</p>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Delete
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

export default ProjectPopup;
