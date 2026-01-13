import { useState, useMemo } from "react";
import { Navbar } from "../components/Navbar";
import { Toast } from "../components/common/Toast";
import { FilterCards } from "../components/dashboard/FilterCards";
import { LinksTable } from "../components/dashboard/LinksTable";
import { CreateLinkModal } from "../components/dashboard/modals/CreateLinkModal";
import { ViewLinkModal } from "../components/dashboard/modals/ViewLinkModal";
import { EditLinkModal } from "../components/dashboard/modals/EditLinkModal";
import { useAuth } from "../hooks/useAuth";
import { useLinks } from "../hooks/useLinks";
import { useToast } from "../hooks/useToast";
import { useLinkForm } from "../hooks/useLinkForm";
import { useN8nChat } from "../hooks/useN8nChat";
import { FILTER_OPTIONS, LINK_STATUS } from "../constants/status";
import "@n8n/chat/style.css";

export default function DashboardPage() {
  // Authentication
  const { user } = useAuth();

  // Links management
  const {
    links,
    addLink,
    updateLink,
    removeLink,
    sendWebhook,
    sendWebhookForChat,
    updateStatus,
  } = useLinks(user.id);

  // Toast notifications
  const { toast, showToast } = useToast();

  // Form management
  const { formData, handleInputChange, setFormFromLink, resetForm } =
    useLinkForm();

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  // Loading states
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);

  // Filter state
  const [filter, setFilter] = useState(FILTER_OPTIONS.ALL);

  // n8n chat integration
  useN8nChat(true);

  // Computed values
  const filteredLinks = useMemo(() => {
    return filter === FILTER_OPTIONS.ALL
      ? links
      : links.filter((link) => link.status === filter);
  }, [links, filter]);

  const linkCounts = useMemo(
    () => ({
      [FILTER_OPTIONS.ALL]: links.length,
      [FILTER_OPTIONS.PROCESSED]: links.filter(
        (l) => l.status === LINK_STATUS.PROCESSED
      ).length,
      [FILTER_OPTIONS.FAILED]: links.filter(
        (l) => l.status === LINK_STATUS.FAILED
      ).length,
    }),
    [links]
  );

  // Handlers
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsCreateLoading(true);

    try {
      const newLink = await addLink(formData);

      try {
        await sendWebhookForChat(
          newLink.id,
          user.email,
          formData.title,
          formData.youtube_url
        );
        showToast("Link added and sent to webhook successfully!", "success");
      } catch (webhookError) {
        console.error("Webhook error:", webhookError);
        await updateStatus(newLink.id, LINK_STATUS.FAILED);
        showToast("Link added but webhook failed", "error");
      }

      resetForm();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create link:", error);
      alert("Failed to create link. Please try again.");
    } finally {
      setIsCreateLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLink(formData.id, formData);
      setIsEditModalOpen(false);
      setSelectedLink(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update link:", error);
      alert("Failed to update link. Please try again.");
    }
  };

  const handleViewLink = (link) => {
    setSelectedLink(link);
    setIsViewModalOpen(true);
  };

  const handleEditLink = (link) => {
    setSelectedLink(link);
    setFormFromLink(link);
    setIsEditModalOpen(true);
  };

  const handleDeleteLink = async (linkId) => {
    try {
      await removeLink(linkId);
    } catch (error) {
      console.error("Failed to delete link:", error);
      alert("Failed to delete link. Please try again.");
    }
  };

  const handleGetTranscript = async () => {
    setIsTranscriptLoading(true);
    try {
      await sendWebhook(
        selectedLink.id,
        user.email,
        selectedLink.title,
        selectedLink.youtube_url
      );
      showToast("Transcript sent successfully!", "success");
    } catch (error) {
      console.error("Error sending webhook:", error);
      showToast("Error sending transcript", "error");
    } finally {
      setIsTranscriptLoading(false);
      setIsViewModalOpen(false);
      setSelectedLink(null);
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedLink(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedLink(null);
    resetForm();
  };

  const handleSwitchToEdit = () => {
    setIsViewModalOpen(false);
    handleEditLink(selectedLink);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <FilterCards
          filter={filter}
          onFilterChange={setFilter}
          linkCounts={linkCounts}
          onAddClick={() => setIsCreateModalOpen(true)}
        />
      </main>

      <LinksTable
        links={filteredLinks}
        onView={handleViewLink}
        onDelete={handleDeleteLink}
      />

      <CreateLinkModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleCreateSubmit}
        isLoading={isCreateLoading}
      />

      <ViewLinkModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        link={selectedLink}
        onEdit={handleSwitchToEdit}
        onGetTranscript={handleGetTranscript}
        isTranscriptLoading={isTranscriptLoading}
      />

      <EditLinkModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleEditSubmit}
      />

      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
}
