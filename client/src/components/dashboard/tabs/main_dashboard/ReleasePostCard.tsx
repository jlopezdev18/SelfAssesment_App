import React from "react";
import { FaCalendar, FaTrash } from "react-icons/fa";
import type { ReleasePost } from "./types/DashboardMainInterfaces";

interface ReleasePostCardProps {
  post: ReleasePost;
  onClick: (post: ReleasePost) => void;
  onDelete: (postId: string) => void;
  formatDate: (dateObj: { _seconds: number; _nanoseconds: number }) => string;
  isAdmin?: boolean;
}

const ReleasePostCard: React.FC<ReleasePostCardProps> = ({ 
  post, 
  onClick, 
  onDelete,
  formatDate,
  isAdmin
}) => (
  <div className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all relative">
    {/* Delete button for admins */}
    {isAdmin && (
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click
          onDelete(post.id);
        }}
        className="absolute top-2 right-2 z-10 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        title="Delete post"
      >
        <FaTrash className="w-3 h-3 text-white" />
      </button>
    )}

    {/* Card content - add onClick to a new div to prevent delete button triggering it */}
    <div onClick={() => onClick(post)} className="cursor-pointer">
      <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600 relative overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 text-xs px-2 py-1 rounded-full text-blue-600 font-medium">
            {post.version}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h4 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base">
          {post.title}
        </h4>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <FaCalendar className="w-3 h-3" />
            <span>{formatDate(post.date)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReleasePostCard;