export interface Project {
  id: string;
  title: string;
  client: string;
  category: 'Long Form' | 'Short Form';
  year: string;
  aspectRatio: '16:9' | '2.39:1' | '9:16';
  duration: string;
  timecode: string;
  videoUrl: string;
  posterUrl: string;
  description: string;
  role: string;
  tools: string[];
  awards?: string[];
  stats?: {
    views?: string;
    cuts?: number;
    timelineBpm?: string;
  };
  beforeAfterComparison?: {
    rawUrl?: string;
    gradedUrl?: string;
  };
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  avatarUrl: string;
  projectId?: string;
  projectTitle?: string;
  badge?: string;
  rating: number;
}

export interface VideoTestSlot {
  name: string;
  fileUrl: string;
  type: 'local' | 'demo' | 'external';
  aspectRatio: '16:9' | '2.39:1' | '9:16';
}
