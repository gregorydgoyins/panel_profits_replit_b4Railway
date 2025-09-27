import React, { useState } from 'react';
import { Play, ExternalLink, CheckCircle, X, Monitor } from 'lucide-react';

export function VideoTestPage() {
  const [testResults, setTestResults] = useState<Record<string, 'loading' | 'success' | 'error'>>({});

  // Known working YouTube video URLs for testing
  const testVideos = [
    {
      id: 'test1',
      title: 'Test Video 1 (Rick Roll)',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Classic test video to verify embedding works'
    },
    {
      id: 'test2', 
      title: 'Test Video 2 (Never Gonna Give You Up)',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?start=10',
      description: 'Same video with start parameter'
    },
    {
      id: 'ns1-primary',
      title: 'NS1 Primary Video',
      url: 'https://www.youtube.com/embed/UhVjp48U2Oc',
      description: 'Your NS1 primary video URL'
    },
    {
      id: 'ns1-secondary',
      title: 'NS1 Secondary Video', 
      url: 'https://www.youtube.com/embed/FvKgXtKZbJA',
      description: 'Your NS1 secondary video URL'
    }
  ];

  const handleVideoLoad = (videoId: string) => {
    setTestResults(prev => ({ ...prev, [videoId]: 'success' }));
  };

  const handleVideoError = (videoId: string) => {
    setTestResults(prev => ({ ...prev, [videoId]: 'error' }));
  };

  const getStatusIcon = (videoId: string) => {
    const status = testResults[videoId];
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <X className="h-5 w-5 text-red-400" />;
      default:
        return <Monitor className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <Play className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Video Embedding Test Page</h1>
        </div>
        
        <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-700/30 mb-6">
          <p className="text-indigo-200 text-sm">
            This test page will help verify if YouTube video embedding is working correctly in your environment. 
            Each video should load and be playable. Check the status indicators next to each video.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testVideos.map((video) => (
            <div key={video.id} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                {getStatusIcon(video.id)}
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{video.description}</p>
              
              <div className="relative bg-black rounded-lg overflow-hidden h-64">
                <iframe
                  src={video.url}
                  title={video.title}
                  className="w-full h-full border-0"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => handleVideoLoad(video.id)}
                  onError={() => handleVideoError(video.id)}
                />
              </div>
              
              <div className="mt-3 p-2 bg-slate-800/50 rounded border border-slate-600/50">
                <p className="text-xs text-gray-400 font-mono">{video.url}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-yellow-900/20 p-4 rounded-lg border border-yellow-700/30">
          <h3 className="font-medium text-white mb-2">Troubleshooting Guide</h3>
          <ul className="space-y-2 text-yellow-200 text-sm">
            <li>• If videos don't load: Check if the YouTube URLs are accessible</li>
            <li>• If you see "Video unavailable": The video might be restricted or removed</li>
            <li>• If no videos load: There might be a CSP (Content Security Policy) issue</li>
            <li>• Test videos should work - they use a well-known public video</li>
          </ul>
        </div>

        <div className="mt-6 bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <h3 className="font-medium text-white mb-3">Alternative Video Hosting Options</h3>
          <div className="space-y-2 text-gray-300 text-sm">
            <p>• <strong>YouTube:</strong> Free, reliable, but requires public videos</p>
            <p>• <strong>Vimeo:</strong> Professional hosting with privacy options</p>
            <p>• <strong>Google Drive:</strong> Share video files publicly (get embed link)</p>
            <p>• <strong>Dropbox:</strong> Similar to Google Drive for file sharing</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoTestPage;