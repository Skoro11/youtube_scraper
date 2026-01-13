/**
 * Extracts video ID from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if not found
 */
export function extractVideoId(url) {
  const match = url?.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/
  );
  return match ? match[1] : null;
}

/**
 * Generates YouTube thumbnail URL
 * @param {string} videoId - YouTube video ID
 * @param {string} quality - Thumbnail quality: 'default', 'mq', 'hq', 'sd', 'maxres'
 * @returns {string} - Thumbnail URL
 */
export function getThumbnailUrl(videoId, quality = "default") {
  const qualityMap = {
    default: "default",
    mq: "mqdefault",
    hq: "hqdefault",
    sd: "sddefault",
    maxres: "maxresdefault",
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality] || "default"}.jpg`;
}
