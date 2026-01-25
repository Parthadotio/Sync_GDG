import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context.jsx";
import axios from "../config/axios.js";
import { useNavigate } from 'react-router-dom'

const Project = () => {
 
  const { user } = useContext(UserContext)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  function createProject(e) {
    e.preventDefault();
    setError(null);

    axios
      .post("/projects/create", {
        name: projectName,
      })
      .then((res) => {
        setIsModalOpen(false);
        setProjectName("");
        fetchProjects();
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to create project");
      });
  }
  
  const fetchProjects = () => {
    setIsLoading(true);
    setError(null);

    axios
      .get("/projects/all")
      .then((res) => {
        setProjects(res.data.projects);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to fetch projects");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <main className="p-6 bg-slate-700 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <i className="ri-add-line"></i>
          New Project
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-slate-900 outline outline-2 outline-white rounded-lg hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <i className="ri-folder-check-line"></i>
                  {project.name}
                </h3>
                <div className="flex gap-2">
                  <button 
                    className="p-2 text-white hover:text-gray-400 transition-colors"
                    title="Edit project"
                  >
                    <i className="ri-settings-line"></i>
                  </button>
                  <button 
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete project"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <i className="ri-user-line text-blue-500"></i>
                  <span>Collaborators: {project.users?.length || 0}</span>
                </div>
              </div>

              <button
                onClick={() => { 
                  navigate(`/projects/${project._id}`, {
                    state: { project }
                  })
                }}
                className="w-full text-center py-2 px-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 outline outline-white outline-2 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Project Name
                </label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3 text-black outline-none focus:border-blue-500"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setProjectName("");
                  }}
                  className="px-5 py-2 rounded-lg border-2 border-gray-400 text-white hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createProject}
                  className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;