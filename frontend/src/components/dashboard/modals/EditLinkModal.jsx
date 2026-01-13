import { Modal } from "../../common/Modal";

export function EditLinkModal({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onSubmit,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Link">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors resize-none"
            placeholder="Add any notes..."
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
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
    </Modal>
  );
}
