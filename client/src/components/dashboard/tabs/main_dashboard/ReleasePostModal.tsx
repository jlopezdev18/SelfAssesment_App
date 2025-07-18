import React from "react";
import { FaTimes } from "react-icons/fa";
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
  <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
      {/* Modal Header */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-blue-400 to-blue-600 relative overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-fill opacity-55" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
          >
            <FaTimes className="w-5 h-5 text-black" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="bg-white/90 text-xs px-3 py-1 rounded-full text-blue-600 font-medium">
                {post.version}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{post.title}</h1>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center space-x-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-white/90 text-xs px-2 py-1 rounded-full text-blue-600 font-medium">
                    {tag}
                  </span>
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
        <div className="prose prose-lg max-w-none">{renderFullContent(post.fullContent)}</div>
      </div>
    </div>
  </div>
);

export default ReleasePostModal;