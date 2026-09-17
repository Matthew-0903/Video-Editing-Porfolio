import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Film, Check, RefreshCw, AlertCircle, Eye } from 'lucide-react';

interface TestReelSandboxProps {
  customVideoUrl: string | null;
  customVideoName: string | null;
  onSetCustomVideo: (url: string, name: string) => void;
  onResetToDemo: () => void;
  onOpenTestInModal: () => void;
}

export const TestReelSandbox: React.FC<TestReelSandboxProps> = ({
  customVideoUrl,
  customVideoName,
  onSetCustomVideo,
  onResetToDemo,
  onOpenTestInModal,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadFile(file);
    }
  };

  const loadFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setErrorMessage('Please provide a valid video file (.mp4, .mov, .webm)');
      return;
    }
    setErrorMessage(null);
    const objectUrl = URL.createObjectURL(file);
    onSetCustomVideo(objectUrl, file.name);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      loadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    try {
      new URL(urlInput);
      onSetCustomVideo(urlInput.trim(), 'Custom Network Video');
      setUrlInput('');
      setErrorMessage(null);
    } catch {
      setErrorMessage('Please enter a valid video stream URL (e.g. https://.../video.mp4)');
    }
  };

  const samplePresets = [
    {
      name: 'Tears of Steel (2.39:1 Sci-Fi Action)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    },
    {
      name: 'Elephants Dream (Moody 3D Anamorphic)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
      name: 'Blazes Reel (Vertical 9:16 Kinetic Cut)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    }
  ];

  return (
    <div id="video-test-sandbox" className="w-full border-y border-neutral-800 bg-[#09090b]/90 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Header Info */}
          <div className="space-y-1.5 max-w-xl">
            <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white">
              Preview Your Cuts In This Layout
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Test your draft shortform or longform video file right now to verify playback, aspect ratio framing, and grid responsiveness before locking your final files.
            </p>
          </div>

          {/* Test Status Indicator */}
          {customVideoUrl && (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 bg-neutral-900/90">
              <Film className="h-5 w-5 text-white" />
              <div className="text-left">
                <span className="font-mono text-[10px] text-emerald-400 block font-semibold uppercase">
                  ● Custom Reel Active
                </span>
                <span className="font-mono text-xs text-white truncate max-w-[200px] block">
                  {customVideoName || 'Uploaded Video'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={onOpenTestInModal}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-white text-black font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" /> Full Player
                </button>
                <button
                  onClick={onResetToDemo}
                  className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
                  title="Reset to default demo"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload & Dropzone Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6">
          {/* Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`md:col-span-6 flex flex-col items-center justify-center p-5 rounded-xl border border-dashed cursor-pointer transition-all ${
              isDragging
                ? 'border-white bg-neutral-800/80 scale-[0.99]'
                : 'border-neutral-700/80 bg-neutral-900/40 hover:border-neutral-500 hover:bg-neutral-900/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={handleFileChange}
              className="hidden"
            />
            <UploadCloud className="h-7 w-7 text-neutral-400 mb-2" />
            <p className="font-mono text-xs font-medium text-white text-center">
              Drop your video file here or click to browse
            </p>
            <span className="font-mono text-[10px] text-neutral-500 mt-1">
              Supports .mp4, .mov, .webm (Plays locally in browser)
            </span>
          </div>

          {/* URL Input & Presets */}
          <div className="md:col-span-6 flex flex-col justify-between gap-3">
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                <input
                  type="url"
                  placeholder="Or paste video link (https://.../video.mp4)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900/80 pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:border-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition-colors whitespace-nowrap"
              >
                Load URL
              </button>
            </form>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-mono text-[10px] text-neutral-500 mr-1">QUICK TEST PRESETS:</span>
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSetCustomVideo(preset.url, preset.name)}
                  className="rounded border border-neutral-800 bg-neutral-900/70 px-2 py-1 font-mono text-[10px] text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors truncate max-w-[190px]"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-3 flex items-center gap-2 font-mono text-xs text-rose-400">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
