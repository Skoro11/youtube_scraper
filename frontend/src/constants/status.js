export const LINK_STATUS = {
  PENDING: "pending",
  SENT: "sent",
  PROCESSED: "processed",
  FAILED: "failed",
};

export const STATUS_CONFIG = {
  [LINK_STATUS.PENDING]: {
    label: "Pending",
    style: "bg-yellow-100 text-yellow-800",
  },
  [LINK_STATUS.SENT]: {
    label: "Sent",
    style: "bg-blue-100 text-blue-800",
  },
  [LINK_STATUS.PROCESSED]: {
    label: "Processed",
    style: "bg-green-100 text-green-800",
  },
  [LINK_STATUS.FAILED]: {
    label: "Failed",
    style: "bg-red-100 text-red-800",
  },
};

export const FILTER_OPTIONS = {
  ALL: "all",
  PROCESSED: "processed",
  FAILED: "failed",
};
