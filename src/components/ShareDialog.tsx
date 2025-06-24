import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { ShoppingItem } from '../types/shopping';
import { useUrlSharing } from '../hooks/useUrlSharing';

interface ShareDialogProps {
  items: ShoppingItem[];
  onClose: () => void;
}

export function ShareDialog({ items, onClose }: ShareDialogProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const { generateShareUrl } = useUrlSharing();

  const shareUrl = generateShareUrl(items);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shopping List',
          text: `Check out my shopping list with ${items.length} items!`,
          url: shareUrl,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Share List</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            Share your shopping list with others. They'll be able to view and edit the list.
          </p>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Share URL:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 text-sm bg-white border border-gray-300 rounded px-3 py-2 font-mono"
              />
              <button
                onClick={handleCopy}
                className={`
                  p-2 rounded-lg transition-all
                  ${copied 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }
                `}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {navigator.share ? 'Share' : 'Copy Link'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>

          {copied && (
            <p className="text-sm text-emerald-600 text-center font-medium">
              Link copied to clipboard!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}