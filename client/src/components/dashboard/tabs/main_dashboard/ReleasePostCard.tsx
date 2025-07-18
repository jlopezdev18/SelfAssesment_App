import React from "react";
import { FaCalendar } from "react-icons/fa";
import type { ReleasePost } from "./types/DashboardMainInterfaces";

interface ReleasePostCardProps {
  post: ReleasePost;
  onClick: (post: ReleasePost) => void;
  formatDate: (dateObj: { _seconds: number; _nanoseconds: number }) => string;
}

const ReleasePostCard: React.FC<ReleasePostCardProps> = ({ post, onClick, formatDate }) => (
  <div
    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
    onClick={() => onClick(post)}
  >
    <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600 relative overflow-hidden">
      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      <div className="absolute top-2 left-2">
        <span className="bg-white/90 text-xs px-2 py-1 rounded-full text-blue-600 font-medium">
          {post.version}
        </span>
      </div>
    </div>
    <div className="p-6">
      <h4 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base">{post.title}</h4>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <FaCalendar className="w-3 h-3" />
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
    </div>
  </div>
);

export default ReleasePostCard;