import { Modal } from "../../common/Modal";
import { StatusBadge } from "../../common/StatusBadge";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import { extractVideoId, getThumbnailUrl } from "../../../utils/youtube";
import { formatDate } from "../../../utils/date";

export function ViewLinkModal({
  isOpen,
  onClose,
  link,
  onEdit,
  onGetTranscript,
  isTranscriptLoading,
}) {
  if (!link) return null;

  const videoId = extractVideoId(link.youtube_url);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Link Details">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Title
          </label>
          <p className="text-gray-900 font-medium">{link.title}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            YouTube URL
          </label>
          <a
            href={link.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-800 break-all"
          >
            {link.youtube_url}
          </a>
        </div>
        {videoId && (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Preview
            </label>
            <img
              src={getThumbnailUrl(videoId, "mq")}
              alt="Video thumbnail"
              className="rounded-lg w-full"
            />
          </div>
        )}
        {link.notes && (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Notes
            </label>
            <p className="text-gray-900 whitespace-pre-wrap">{link.notes}</p>
          </div>
        )}
        <div className="flex gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Status
            </label>
            <StatusBadge status={link.status} />
          </div>
          <div></div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Created On
          </label>
          <p className="text-gray-900">{formatDate(link.created_at)}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-6">
        <div className="flex gap-3">
          <button
            onClick={onGetTranscript}
            disabled={isTranscriptLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isTranscriptLoading ? (
              <>
                <LoadingSpinner className="text-white" />
                Loading...
              </>
            ) : (
              "Get transcript"
            )}
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Edit Link
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
