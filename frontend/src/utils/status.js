import { STATUS_CONFIG } from "../constants/status";

export function getStatusStyle(status) {
  return STATUS_CONFIG[status]?.style || "bg-gray-100 text-gray-800";
}

export function getStatusLabel(status) {
  return STATUS_CONFIG[status]?.label || status;
}
