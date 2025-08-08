import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ReleasePost } from "./types/DashboardMainInterfaces";

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
}) => (
  <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden">
      {/* Modal Header */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-blue-400 to-blue-600 relative overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover opacity-80" 
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full text-white hover:text-gray-800 transition-all"
          >
            <X className="w-5 h-5" />
          </Button>
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
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {renderFullContent(post.fullContent)}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default ReleasePostModal;