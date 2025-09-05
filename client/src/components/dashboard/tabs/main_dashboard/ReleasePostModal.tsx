import React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag } from "lucide-react";
import type { ReleasePost } from "./types/DashboardMainInterfaces";
import DOMPurify from "dompurify";

interface ReleasePostModalProps {
  post: ReleasePost;
  onClose: () => void;
  formatDate: (dateObj: { _seconds: number; _nanoseconds: number }) => string;
  renderFullContent: (content: string) => React.ReactNode;
}

const ReleasePostModal: React.FC<ReleasePostModalProps> = ({
  post,
  onClose,
  formatDate,
  renderFullContent,
}) => {
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(post.fullContent);
  const safeHtml = isHtml
    ? DOMPurify.sanitize(post.fullContent, { USE_PROFILES: { html: true } })
    : "";

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {/* Modal Content */}
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border-0">
        {/* Modal Header */}
        <div className="relative">
          <div className="h-64 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 relative overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover opacity-75 transition-opacity duration-300 hover:opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="flex items-center space-x-2 mb-3">
                <Badge className="bg-white/95 text-blue-700 hover:bg-white font-semibold shadow-lg border-0">
                  {post.version}
                </Badge>
              </div>
              <DialogHeader className="text-left space-y-0">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {post.title}
                </h1>
              </DialogHeader>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-white/90" />
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-white/95 text-blue-700 hover:bg-white font-medium shadow-lg border-0 transition-all duration-200 hover:scale-105"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-4 text-white text-sm">
                <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{formatDate(post.date)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8 max-h-[calc(90vh-16rem)] overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
          {/* Scoped viewer styles */}
          <style>
            {`
              .rte-view a { 
                color: #2563eb; 
                text-decoration: underline; 
                transition: color 0.2s ease;
              }
              .rte-view a:hover { 
                color: #1d4ed8; 
                text-decoration-thickness: 2px;
              }
              .rte-view ul { 
                list-style: disc; 
                padding-left: 1.5rem; 
                margin: 1rem 0;
              }
              .rte-view ol { 
                list-style: decimal; 
                padding-left: 1.5rem; 
                margin: 1rem 0;
              }
              .rte-view li { 
                margin: 0.25rem 0; 
                line-height: 1.6;
              }
              .rte-view blockquote {
                border-left: 4px solid #3b82f6;
                padding-left: 1rem;
                color: #6b7280;
                margin: 1rem 0;
                background: #f8fafc;
                padding: 1rem;
                border-radius: 0.5rem;
                font-style: italic;
              }
              .rte-view h1, .rte-view h2, .rte-view h3 {
                color: #1f2937;
                margin-top: 2rem;
                margin-bottom: 0.75rem;
              }
              .rte-view p {
                line-height: 1.7;
                margin-bottom: 1rem;
              }
              .dark .rte-view h1, .dark .rte-view h2, .dark .rte-view h3 {
                color: #f9fafb;
              }
              .dark .rte-view blockquote {
                background: #374151;
                border-left-color: #60a5fa;
                color: #d1d5db;
              }
            `}
          </style>

          <div className="animate-in fade-in-50 duration-500">
            {isHtml ? (
              <div
                className="rte-view prose prose-lg max-w-none dark:prose-invert prose-blue"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            ) : (
              <div className="prose prose-lg max-w-none dark:prose-invert prose-blue">
                {renderFullContent(post.fullContent)}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReleasePostModal;
