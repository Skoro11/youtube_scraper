import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { createTask, deleteTaskById } from "../services/taskService";
import { getTasks } from "../services/taskService";
import { editTask } from "../services/taskService";
export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({
    id: null,
    email: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    console.log("UserInfo", userInfo);

    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);

      setUser({
        id: parsedUser._id,
        email: parsedUser.email,
      });
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (!user.id) return;

    fetchTasksDb();
  }, [user.id]);

  async function fetchTasksDb() {
    const response = await getTasks(user.id);
    setTasks(response.data.tasks);
  }

  const [formData, setFormData] = useState({
    task_id: null,
    task_name: "Stripe implementation",
    repository_branch: "feature/implement",
    project_name: "E-Commerce",
    task_description: "Add stripe as payment method",
    deadline: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await createTask(
      user.id,
      formData.task_name,
      formData.repository_branch,
      formData.project_name,
      formData.task_description,
      formData.deadline
    );

    const newTask = response.data.task;
    setTasks((prev) => [...prev, newTask]);
    setFormData({
      id: null,
      task_name: "",
      repository_branch: "",
      project_name: "",
      task_description: "",
      deadline: "",
    });
    setIsModalOpen(false);
  }

  async function handleDeleteTask(task_id) {
    const response = await deleteTaskById(task_id);

    if (response) {
      const filteredTasks = tasks.filter((task) => task.id != task_id);

      setTasks(filteredTasks);
    }
  }

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setFormData({
      id: task.id,
      task_name: task.task_name,
      repository_branch: task.repository_branch,
      project_name: task.project_name,
      task_description: task.task_description,
      deadline: task.deadline,
    });
    setIsEditModalOpen(true);
  };

  async function handleUpdateTask(e) {
    e.preventDefault();

    console.log(formData);
    const response = await editTask(
      formData.id,
      formData.task_name,
      formData.repository_branch,
      formData.project_name,
      formData.task_description,
      formData.deadline,
      formData.status
    );

    setTasks((prev) =>
      prev.map((task) =>
        task.id === selectedTask.id ? { ...task, ...formData } : task
      )
    );
    /* setFormData({
      name: "",
      branch: "",
      project: "",
      description: "",
      deadline: "",
    }); */
    setIsEditModalOpen(false);
    setSelectedTask(null);
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "in_progress":
        return "⚙️";
      case "completed":
        return "✅";
      default:
        return "📋";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-4 overflow-x-auto pb-4">
          <div
            onClick={() => setFilter("all")}
            className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border flex-shrink-0 ${
              filter === "all"
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">📋</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900">All Tasks</h3>
                <p className="text-sm text-gray-500">{taskCounts.all} tasks</p>
              </div>
            </div>
          </div>
          <div
            onClick={() => setFilter("pending")}
            className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border flex-shrink-0 ${
              filter === "pending"
                ? "border-yellow-500 ring-2 ring-yellow-200"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-semibold text-sm">
                  ⏳
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900">Pending</h3>
                <p className="text-sm text-gray-500">
                  {taskCounts.pending} tasks
                </p>
              </div>
            </div>
          </div>
          <div
            onClick={() => setFilter("in_progress")}
            className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border flex-shrink-0 ${
              filter === "in_progress"
                ? "border-orange-500 ring-2 ring-orange-200"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-semibold text-sm">
                  ⚙️
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900">In Progress</h3>
                <p className="text-sm text-gray-500">
                  {taskCounts.in_progress} tasks
                </p>
              </div>
            </div>
          </div>
          <div
            onClick={() => setFilter("completed")}
            className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border flex-shrink-0 ${
              filter === "completed"
                ? "border-green-500 ring-2 ring-green-200"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">✅</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900">Completed</h3>
                <p className="text-sm text-gray-500">
                  {taskCounts.completed} tasks
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2 flex-shrink-0 h-fit my-auto"
          >
            <span>+</span> Add New Task
          </button>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Create New Task
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.task_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter task name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Github Repository Branch *
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.repository_branch}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="e.g., feature/new-feature"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    name="project"
                    value={formData.project_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.task_description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Describe the task..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Task Details
                </h2>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedTask(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Task Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedTask.task_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Project Name
                  </label>
                  <p className="text-gray-900">{selectedTask.project_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Github Repository Branch
                  </label>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                    {selectedTask.repository_branch}
                  </code>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedTask.task_description}
                  </p>
                </div>
                <div className="flex gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                        selectedTask.status
                      )}`}
                    >
                      {getStatusIcon(selectedTask.status)}{" "}
                      {getStatusLabel(selectedTask.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Deadline
                    </label>
                    <p className="text-gray-900">
                      {new Date(selectedTask.deadline).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Created On
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedTask.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEditTask(selectedTask);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Task
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedTask(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Task</h2>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedTask(null);
                    setFormData({
                      id: null,
                      task_name: "",
                      repository_branch: "",
                      project_name: "",
                      task_description: "",
                      deadline: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleUpdateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.task_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter task name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Github Repository Branch *
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.repository_branch}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="e.g., feature/new-feature"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    name="project"
                    value={formData.project_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.task_description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Describe the task..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setSelectedTask(null);
                      setFormData({
                        id: null,
                        name: "",
                        branch: "",
                        project: "",
                        description: "",
                        deadline: "",
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                My Tasks
              </h2>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                Track and manage your development tasks
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm lg:text-base">
                    Task Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm lg:text-base hidden md:table-cell">
                    Project
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm lg:text-base hidden lg:table-cell">
                    Branch
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm lg:text-base">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm lg:text-base hidden sm:table-cell">
                    Deadline
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm lg:text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No tasks found. Create your first task!
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              task.status === "completed"
                                ? "bg-green-100"
                                : task.status === "in_progress"
                                ? "bg-orange-100"
                                : "bg-yellow-100"
                            }`}
                          >
                            <span className="text-sm">
                              {getStatusIcon(task.status)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 text-sm lg:text-base truncate">
                              {task.task_name}
                            </div>
                            <div className="text-xs lg:text-sm text-gray-500 truncate max-w-[200px]">
                              {task.task_description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="text-gray-700 text-sm">
                          {task.project_name}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                          {task.repository_branch}
                        </code>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 lg:px-2.5 lg:py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                            task.status
                          )}`}
                        >
                          {getStatusIcon(task.status)}{" "}
                          {getStatusLabel(task.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm lg:text-base hidden sm:table-cell">
                        {new Date(task.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1 lg:gap-2">
                          <button
                            onClick={() => handleViewTask(task)}
                            className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-600 hover:text-red-800 text-xs lg:text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
