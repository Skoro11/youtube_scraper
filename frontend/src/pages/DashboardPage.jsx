import { useState, useEffect, useRef } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  createLink,
  deleteLinkById,
  getLinks,
  editLink,
  getTranscript,
  updateLinkStatus,
  sendToWebhookWithChat,
} from "../services/taskService";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [filter, setFilter] = useState("all");
  const [links, setLinks] = useState([]);
  const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isChatModalOpen, setIsChatModalOpen] = useState(true);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [user, setUser] = useState({
    id: null,
    email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("user");

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
    fetchLinksDb();
  }, [user.id]);

  async function fetchLinksDb() {
    try {
      const response = await getLinks(user.id);
      setLinks(response.data.links);
    } catch (error) {
      console.error("Failed to fetch links:", error);
    }
  }

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    youtube_url: "",
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsCreateLoading(true);

    try {
      const response = await createLink(
        user.id,
        formData.title,
        formData.youtube_url,
        formData.notes
      );

      const newLink = response.data.link;
      setLinks((prev) => [newLink, ...prev]);

      // Immediately send to webhook with use: "chat"
      try {
        const webhookResponse = await sendToWebhookWithChat(
          user.email,
          formData.title,
          formData.youtube_url
        );

        if (webhookResponse.status === 200) {
          await updateLinkStatus(newLink.id, "processed");
          setLinks((prev) =>
            prev.map((link) =>
              link.id === newLink.id ? { ...link, status: "processed" } : link
            )
          );
          setToast({
            show: true,
            message: "Link added and sent to webhook successfully!",
            type: "success",
          });
        } else {
          await updateLinkStatus(newLink.id, "failed");
          setLinks((prev) =>
            prev.map((link) =>
              link.id === newLink.id ? { ...link, status: "failed" } : link
            )
          );
          setToast({
            show: true,
            message: "Link added but webhook failed",
            type: "error",
          });
        }
      } catch (webhookError) {
        console.error("Webhook error:", webhookError);
        await updateLinkStatus(newLink.id, "failed");
        setLinks((prev) =>
          prev.map((link) =>
            link.id === newLink.id ? { ...link, status: "failed" } : link
          )
        );
        setToast({
          show: true,
          message: "Link added but webhook failed",
          type: "error",
        });
      }

      setFormData({
        id: null,
        title: "",
        youtube_url: "",
        notes: "",
      });
      setIsModalOpen(false);
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    } catch (error) {
      console.error("Failed to create link:", error);
      alert("Failed to create link. Please try again.");
    } finally {
      setIsCreateLoading(false);
    }
  }

  async function handleDeleteLink(link_id) {
    try {
      const response = await deleteLinkById(link_id);
      if (response) {
        const filteredLinks = links.filter((link) => link.id != link_id);
        setLinks(filteredLinks);
      }
    } catch (error) {
      console.error("Failed to delete link:", error);
      alert("Failed to delete link. Please try again.");
    }
  }

  const handleViewLink = (link) => {
    setSelectedLink(link);
    setIsViewModalOpen(true);
  };

  const handleEditLink = (link) => {
    setSelectedLink(link);
    setFormData({
      id: link.id,
      title: link.title,
      youtube_url: link.youtube_url,
      notes: link.notes,
      status: link.status,
    });
    setIsEditModalOpen(true);
  };

  async function handleUpdateLink(e) {
    e.preventDefault();

    try {
      const response = await editLink(
        formData.id,
        formData.title,
        formData.youtube_url,
        formData.notes
      );

      const updatedLink = response.data.link;
      setLinks((prev) =>
        prev.map((link) => (link.id === selectedLink.id ? updatedLink : link))
      );
      setIsEditModalOpen(false);
      setSelectedLink(null);
    } catch (error) {
      console.error("Failed to update link:", error);
      alert("Failed to update link. Please try again.");
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "processed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "sent":
        return "Sent";
      case "processed":
        return "Processed";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  async function sendWebhook(linkId, email, title, youtube_url) {
    setIsTranscriptLoading(true);
    try {
      const response = await getTranscript(email, title, youtube_url);
      if (response.status === 200) {
        await updateLinkStatus(linkId, "processed");
        setLinks((prev) =>
          prev.map((link) =>
            link.id === linkId ? { ...link, status: "processed" } : link
          )
        );
        setToast({
          show: true,
          message: "Transcript sent successfully!",
          type: "success",
        });
      } else {
        await updateLinkStatus(linkId, "failed");
        setLinks((prev) =>
          prev.map((link) =>
            link.id === linkId ? { ...link, status: "failed" } : link
          )
        );
        setToast({
          show: true,
          message: "Failed to send transcript",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error sending webhook:", error);
      await updateLinkStatus(linkId, "failed");
      setLinks((prev) =>
        prev.map((link) =>
          link.id === linkId ? { ...link, status: "failed" } : link
        )
      );
      setToast({
        show: true,
        message: "Error sending transcript",
        type: "error",
      });
    } finally {
      setIsTranscriptLoading(false);
      setIsViewModalOpen(false);
      setSelectedLink(null);
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    }
  }

  // Initialize n8n chat when modal opens
  useEffect(() => {
    if (isChatModalOpen) {
      createChat({
        webhookUrl: import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL,
        mode: "window",
        showWelcomeScreen: false,
        initialMessages: [
          "Hi there! What do you wanna know about your videos?",
        ],
      });
    }

    // Cleanup when modal closes
    return () => {
      const chatWidget = document.querySelector(".n8n-chat");
      if (chatWidget) {
        chatWidget.remove();
      }
    };
  }, [isChatModalOpen]);

  const filteredLinks =
    filter === "all" ? links : links.filter((link) => link.status === filter);

  const linkCounts = {
    all: links.length,
    processed: links.filter((l) => l.status === "processed").length,
    failed: links.filter((l) => l.status === "failed").length,
  };

  const extractVideoId = (url) => {
    const match = url?.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/
    );
    return match ? match[1] : null;
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
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900">All Links</h3>
                <p className="text-sm text-gray-500">{linkCounts.all} links</p>
              </div>
            </div>
          </div>
          <div
            onClick={() => setFilter("processed")}
            className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border flex-shrink-0 ${
              filter === "processed"
                ? "border-green-500 ring-2 ring-green-200"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900">Processed</h3>
                <p className="text-sm text-gray-500">
                  {linkCounts.processed} links
                </p>
              </div>
            </div>
          </div>
          <div
            onClick={() => setFilter("failed")}
            className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border flex-shrink-0 ${
              filter === "failed"
                ? "border-red-500 ring-2 ring-red-200"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900">Failed</h3>
                <p className="text-sm text-gray-500">
                  {linkCounts.failed} links
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="ml-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2 flex-shrink-0 h-fit my-auto"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            Add YouTube Link
          </button>
        </div>
      </main>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Add YouTube Link
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
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="Enter a title for this link"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    name="youtube_url"
                    value={formData.youtube_url}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors resize-none"
                    placeholder="Add any notes about this video..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isCreateLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreateLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCreateLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Add Link"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Link Details
                </h2>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedLink(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Title
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedLink.title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    YouTube URL
                  </label>
                  <a
                    href={selectedLink.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 break-all"
                  >
                    {selectedLink.youtube_url}
                  </a>
                </div>
                {extractVideoId(selectedLink.youtube_url) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Preview
                    </label>
                    <img
                      src={`https://img.youtube.com/vi/${extractVideoId(
                        selectedLink.youtube_url
                      )}/mqdefault.jpg`}
                      alt="Video thumbnail"
                      className="rounded-lg w-full"
                    />
                  </div>
                )}
                {selectedLink.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Notes
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedLink.notes}
                    </p>
                  </div>
                )}
                <div className="flex gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                        selectedLink.status
                      )}`}
                    >
                      {getStatusLabel(selectedLink.status)}
                    </span>
                  </div>
                  <div></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Created On
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedLink.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-6">
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      sendWebhook(
                        selectedLink.id,
                        user.email,
                        selectedLink.title,
                        selectedLink.youtube_url
                      )
                    }
                    disabled={isTranscriptLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isTranscriptLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      "Get transcript"
                    )}
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleEditLink(selectedLink);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Edit Link
                  </button>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setSelectedLink(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Link</h2>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedLink(null);
                    setFormData({
                      id: null,
                      title: "",
                      youtube_url: "",
                      notes: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleUpdateLink} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    name="youtube_url"
                    value={formData.youtube_url}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors resize-none"
                    placeholder="Add any notes..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setSelectedLink(null);
                      setFormData({
                        id: null,
                        title: "",
                        youtube_url: "",
                        notes: "",
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
                My YouTube Links
              </h2>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                Manage your YouTube links and send them to n8n
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm lg:text-base">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm lg:text-base hidden md:table-cell">
                    YouTube URL
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm lg:text-base">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm lg:text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No links found. Add your first YouTube link!
                    </td>
                  </tr>
                ) : (
                  filteredLinks.map((link) => (
                    <tr
                      key={link.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {extractVideoId(link.youtube_url) && (
                            <img
                              src={`https://img.youtube.com/vi/${extractVideoId(
                                link.youtube_url
                              )}/default.jpg`}
                              alt="Thumbnail"
                              className="w-16 h-12 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 text-sm lg:text-base truncate">
                              {link.title}
                            </div>
                            {link.notes && (
                              <div className="text-xs lg:text-sm text-gray-500 truncate max-w-[200px]">
                                {link.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <a
                          href={link.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-800 text-sm truncate block max-w-[200px]"
                        >
                          {link.youtube_url}
                        </a>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 lg:px-2.5 lg:py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                            link.status
                          )}`}
                        >
                          {getStatusLabel(link.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1 lg:gap-2">
                          <button
                            onClick={() => handleViewLink(link)}
                            className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteLink(link.id)}
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

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
