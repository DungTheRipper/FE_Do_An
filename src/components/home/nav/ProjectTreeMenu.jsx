import {
    FaChevronDown,
    FaChevronRight,
    FaEllipsisH,
    FaPen,
    FaPlus,
    FaProjectDiagram,
    FaTrash
} from "react-icons/fa";
import {useState} from "react";
import Loading from "../../helper/Loading.jsx";
import axiosInstance from "../../../AxiosConfig.js";
import ProjectPopup from "../../helper/ProjectPopup.jsx";

const ProjectTreeMenu = ({darkMode, projects, activeTab, onSetActiveTab, setSelectedProject}) => {
    const [expandedProjects, setExpandedProjects] = useState({});
    const [showProjectsMenu, setShowProjectsMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [projectForm, setProjectForm] = useState({
        name: "",
    });
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showProjectActions, setShowProjectActions] = useState(null);
    const [isDeletingProject, setIsDeletingProject] = useState(false);
    const [titleProjectPopup, setTitleProjectPopup] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const toggleProject = (projectId) => {
        setExpandedProjects((prevState) => ({
            ...prevState,
            [projectId]: !prevState[projectId],
        }));
    };

    const handleProjectsClick = () => {
        setShowProjectsMenu(!showProjectsMenu);
    };

    const handleProjectClick = (projectId) => {
        onSetActiveTab("project-" + projectId);
        toggleProject(projectId);
        setSelectedProject(projectId);
    }

    const handleProjectActionsClick = (projectId) => {
        setShowProjectActions(showProjectActions === projectId ? null : projectId);
    };

    const openCreateProjectModal = () => {
        setTitleProjectPopup("Create Project");
        setShowProjectModal(true);
    };

    const openRenameProjectModal = (projectId) => {
        setTitleProjectPopup("Rename Project");
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
    }

    return (
        <div className={"relative"}>
            {loading && <Loading/>}
            {showProjectModal &&
                <ProjectPopup
                    title={titleProjectPopup}
                    projectForm={projectForm}
                    setProjectForm={setProjectForm}
                    selectedProjectId={selectedProjectId}
                    onClose={onCloseProjectModal}
                    isDeleting={isDeletingProject}
                />
            }
            <div
                className={`flex flex-col items-center text-sm font-medium rounded w-full`}
            >
                <button
                    onClick={handleProjectsClick}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded w-full transition-colors duration-200 ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
                >
                    <FaProjectDiagram className="mr-2"/> Projects
                    <span className="ml-auto">
                    {showProjectsMenu ? (
                        <FaChevronDown className="text-sm"/>
                    ) : (
                        <FaChevronRight className="text-sm"/>
                    )}
                </span>
                </button>

                {showProjectsMenu && (
                    <div
                        className={`w-full mt-2 pl-6 space-y-2 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800 transition-colors duration-200"}`}>
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
                                            className={`relative flex w-full px-4 py-2 items-center cursor-pointer space-x-2 ${activeTab === "project-" + project.id ? "bg-blue-600" : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded`}
                                        >
                                            <span
                                                className={`text-sm overflow-hidden truncate ${activeTab === "project-" + project.id ? "text-white" : darkMode ? "text-gray-300" : "text-gray-500"}`}
                                            >
                                                {project.name}
                                            </span>
                                            <button
                                                onClick={() => handleProjectActionsClick(project.id)}
                                                className={`absolute right-2 ${activeTab === "project-" + project.id ? "text-gray-300 hover:text-white" : darkMode ? "text-gray-500 hover:text-gray-700" : "text-gray-500"}`}
                                            >
                                                <FaEllipsisH/>
                                            </button>
                                        </button>
                                    </div>

                                    {showProjectActions === project.id && (
                                        <div
                                            className="absolute right-0 w-40 mt-2 bg-white rounded-md shadow-lg text-sm text-gray-700 border border-gray-300 z-10">
                                            <button
                                                onClick={() => openRenameProjectModal(project.id)}
                                                className="flex w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-md items-center"
                                            >
                                                <FaPen className="mr-2" /> Rename
                                            </button>
                                            <button
                                                onClick={() => openDeleteProjectModal(project.id)}
                                                className="flex w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-md text-red-600 items-center"
                                            >
                                                <FaTrash className="mr-2" /> Delete
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
