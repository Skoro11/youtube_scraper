import { StatusBadge } from "../common/StatusBadge";
import { extractVideoId, getThumbnailUrl } from "../../utils/youtube";

export function LinkTableRow({ link, onView, onDelete }) {
  const videoId = extractVideoId(link.youtube_url);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          {videoId && (
            <img
              src={getThumbnailUrl(videoId)}
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
        <StatusBadge status={link.status} size="small" />
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-1 lg:gap-2">
          <button
            onClick={() => onView(link)}
            className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium"
          >
            View
          </button>
          <button
            onClick={() => onDelete(link.id)}
            className="text-red-600 hover:text-red-800 text-xs lg:text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
