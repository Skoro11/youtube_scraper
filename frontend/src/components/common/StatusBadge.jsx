import { getStatusStyle, getStatusLabel } from "../../utils/status";

export function StatusBadge({ status, size = "default" }) {
  const sizeClasses =
    size === "small" ? "px-2 py-1 lg:px-2.5 lg:py-0.5" : "px-2.5 py-0.5";

  return (
    <span
      className={`inline-flex items-center ${sizeClasses} rounded-full text-xs font-medium ${getStatusStyle(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
