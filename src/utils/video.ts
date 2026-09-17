export type VideoSourceType = 'youtube' | 'vimeo' | 'mp4';

export interface ParsedVideo {
  type: VideoSourceType;
  embedUrl?: string;
  directUrl?: string;
  videoId?: string;
}

/**
 * Parses any video URL (YouTube, YouTube Shorts, Vimeo with privacy hash, or direct MP4/stream)
 * and returns the appropriate embed or direct streaming format.
 */
export function parseVideoUrl(url?: string): ParsedVideo {
  if (!url) return { type: 'mp4', directUrl: '' };

  const trimmed = url.trim();

  // YouTube match: handles youtu.be, shorts, embed, watch?v=... with any query parameters
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|(?:watch\?(?:.*&)?v=)))([\w-]{11})/i
  );
  if (ytMatch) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    };
  }

  // Vimeo match with optional unlisted hash (e.g. vimeo.com/123456789/abcdef123 or player.vimeo.com/video/123456789?h=abcdef123)
  const vimeoHashMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)\/([a-zA-Z0-9]+)/i);
  if (vimeoHashMatch) {
    const videoId = vimeoHashMatch[1];
    const hash = vimeoHashMatch[2];
    return {
      type: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?h=${hash}&autoplay=1&title=0&byline=0&portrait=0`
    };
  }

  // Standard Vimeo match (e.g. vimeo.com/123456789)
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`
    };
  }

  // Fallback to direct MP4 / video file URL
  return {
    type: 'mp4',
    directUrl: trimmed
  };
}

