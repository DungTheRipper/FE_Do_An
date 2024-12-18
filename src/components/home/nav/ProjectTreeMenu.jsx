import {FaChevronDown, FaChevronRight, FaEllipsisH, FaPen, FaPlus, FaProjectDiagram, FaTrash} from "react-icons/fa";
import {useState} from "react";
import Loading from "../../helper/Loading.jsx";
import ProjectPopup from "../../helper/ProjectPopup.jsx";
import axiosInstance from "../../../AxiosConfig.js";

const ProjectTreeMenu = ({darkMode, projects, setProjects, activeTab, onSetActiveTab, setSelectedProject}) => {
    const [showProjectsMenu, setShowProjectsMenu] = useState(false);
    const [projectForm, setProjectForm] = useState({name: ""});
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showProjectActions, setShowProjectActions] = useState(null);
    const [isDeletingProject, setIsDeletingProject] = useState(false);
    const [titleProjectPopup, setTitleProjectPopup] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const handleProjectsClick = () => setShowProjectsMenu(!showProjectsMenu);

    const handleProjectClick = (projectId) => {
        onSetActiveTab(`project_${projectId}`);
        setSelectedProject(projectId);
    };

    const handleProjectActionsClick = (projectId) => {
        setShowProjectActions(showProjectActions === projectId ? null : projectId);
    };

    const openCreateProjectModal = () => {
        setTitleProjectPopup("Create Project");
        setProjectForm({name: ""});
        setShowProjectModal(true);
    };

    const openRenameProjectModal = (projectId) => {
        const project = projects.find((p) => p.id === projectId);
        setTitleProjectPopup("Rename Project");
        setProjectForm({name: project.name});
        setSelectedProjectId(projectId);
        setShowProjectModal(true);
    };

    const openDeleteProjectModal = (projectId) => {
        setTitleProjectPopup("Delete Project");
        setSelectedProjectId(projectId);
        setIsDeletingProject(true);
        setShowProjectModal(true);
    };

    const onCloseProjectModal = () => {
        setShowProjectModal(false);
        setIsDeletingProject(false);
        setSelectedProjectId(null);
    };

    const handleProjectUpdate = async () => {
        try {
            const response = await axiosInstance.get("/api/tasks/project/");
            setProjects(response.data.data);
            onCloseProjectModal();
        } catch (error) {
            console.error("Error fetching updated projects:", error);
        }
    };

    return (
        <div className="relative">
            {showProjectModal && (
                <ProjectPopup
                    title={titleProjectPopup}
                    projectForm={projectForm}
                    setProjectForm={setProjectForm}
                    selectedProjectId={selectedProjectId}
                    onClose={onCloseProjectModal}
                    isDeleting={isDeletingProject}
                    projects={projects}
                    setProjects={handleProjectUpdate}
                />
            )}
            <div className="flex flex-col items-center text-sm font-medium rounded w-full">
                <button
                    onClick={handleProjectsClick}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded w-full transition-colors duration-200 ${
                        darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                    <FaProjectDiagram className="mr-2"/> Projects
                    <span className="ml-auto">
                        {showProjectsMenu ? <FaChevronDown className="text-sm"/> :
                            <FaChevronRight className="text-sm"/>}
                    </span>
                </button>

                {showProjectsMenu && (
                    <div
                        className={`w-full mt-2 pl-6 space-y-2 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
                        <button
                            onClick={openCreateProjectModal}
                            className="flex items-center px-4 py-2 text-sm text-blue-500 hover:bg-blue-100 w-full rounded"
                        >
                            <FaPlus className="mr-2"/> Create New Project
                        </button>

                        <ul className="space-y-2 w-full">
                            {projects.map((project) => (
                                <li key={project.id}>
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => handleProjectClick(project.id)}
                                            className={`relative flex w-full px-4 py-2 items-center cursor-pointer space-x-2 ${
                                                activeTab === `project_${project.id}`
                                                    ? "bg-blue-600 text-white"
                                                    : darkMode
                                                        ? "hover:bg-gray-700"
                                                        : "hover:bg-gray-100"
                                            } rounded`}
                                        >
                                            <span className="text-sm overflow-hidden truncate">{project.name}</span>
                                            <button
                                                onClick={() => handleProjectActionsClick(project.id)}
                                                className="absolute right-2 text-gray-500 hover:text-gray-700"
                                            >
                                                <FaEllipsisH/>
                                            </button>
                                        </button>
                                    </div>

                                    {showProjectActions === project.id && (
                                        <div
                                            className="absolute right-0 w-40 mt-2 bg-white rounded-md shadow-lg text-sm text-gray-700 border z-10">
                                            <button
                                                onClick={() => openRenameProjectModal(project.id)}
                                                className="flex w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-md items-center"
                                            >
                                                <FaPen className="mr-2"/> Rename
                                            </button>
                                            <button
                                                onClick={() => openDeleteProjectModal(project.id)}
                                                className="flex w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-md text-red-600 items-center"
                                            >
                                                <FaTrash className="mr-2"/> Delete
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectTreeMenu;
