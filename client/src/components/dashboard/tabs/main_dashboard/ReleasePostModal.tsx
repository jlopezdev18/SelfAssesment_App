import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { ReleasePost } from "./types/DashboardMainInterfaces";
import DOMPurify from 'dompurify';

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
}) =>{
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(post.fullContent);
  const safeHtml = isHtml
    ? DOMPurify.sanitize(post.fullContent, { USE_PROFILES: { html: true } })
    : "";
  
  return (
  <Dialog open={true}  onOpenChange={(open) => { if (!open) onClose(); }}>
    {/* Modal Content */}
    <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden">
      {/* Modal Header */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-blue-400 to-blue-600 relative overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover opacity-80" 
          />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2 mb-3">
              <Badge className="bg-white/90 text-blue-600 hover:bg-white/90">
                {post.version}
              </Badge>
            </div>
            <DialogHeader className="text-left space-y-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {post.title}
              </h1>
            </DialogHeader>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="bg-white/90 text-blue-600 hover:bg-white/90"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-center space-x-4 text-white text-sm">
              <span>{formatDate(post.date)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Content */}
      <div className="p-6 max-h-[calc(90vh-16rem)] overflow-y-auto">
          {/* Scoped viewer styles */}
          <style>
            {`
              .rte-view a { color:#2563eb; text-decoration:underline; }
              .rte-view a:hover { color:#1d4ed8; }
              .rte-view ul { list-style: disc; padding-left: 1.5rem; }
              .rte-view ol { list-style: decimal; padding-left: 1.5rem; }
              .rte-view li { margin: 0.125rem 0; }
              .rte-view blockquote {
                border-left: 3px solid #e5e7eb;
                padding-left: 0.75rem;
                color: #6b7280;
                margin: 0.5rem 0;
              }
            `}
          </style>

          {isHtml ? (
            <div
              className="rte-view prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          ) : (
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {renderFullContent(post.fullContent)}
            </div>
          )}
        </div>
    </DialogContent>
  </Dialog>
);
}

export default ReleasePostModal;