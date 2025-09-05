import React from "react";
import { Trash2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReleasePost } from "./types/DashboardMainInterfaces";

interface ReleasePostCardProps {
  post: ReleasePost;
  onClick: (post: ReleasePost) => void;
  onDelete: (postId: string) => void;
  formatDate: (dateObj: { _seconds: number; _nanoseconds: number }) => string;
  isAdmin?: boolean;
  cardClass: string;
  textClass: string;
}

const ReleasePostCard: React.FC<ReleasePostCardProps> = ({
  post,
  onClick,
  onDelete,
  formatDate,
  isAdmin,
  cardClass,
  textClass,
}) => (
  <div className="p-2">
    <Card
      className={`group overflow-hidden hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 relative border-0 shadow-md ${cardClass}`}
    >
      {/* Delete button for admins */}
      {isAdmin && (
        <Button
          size="icon"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(post.id);
          }}
          className="absolute top-3 right-3 z-20 h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-110 bg-red-500 hover:bg-red-600 border border-red-400"
          title="Delete post"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </Button>
      )}

      {/* Subtle hover effect */}
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-5"></div>

      <div className="h-full relative z-10">
        {/* Image section with improved overlay */}
        <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          <div className="absolute top-3 left-3 z-15">
            <Badge className="bg-white/95 text-blue-700 hover:bg-white font-semibold shadow-md backdrop-blur-sm">
              {post.version}
            </Badge>
          </div>
        </div>

        {/* Content section with improved spacing */}
        <CardContent className="p-5 space-y-3">
          <h4
            className={`font-bold text-lg mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200 ${textClass}`}
          >
            {post.title}
          </h4>

          {/* Tags section with better styling */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 2 && (
                <Badge
                  variant="outline"
                  className="text-xs px-2.5 py-1 border-blue-200 text-blue-600"
                >
                  +{post.tags.length - 2} more
                </Badge>
              )}
            </div>
          )}

          {/* Date section with view button */}
          <div
            className={`flex items-center justify-between text-sm ${textClass}`}
          >
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{formatDate(post.date)}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-3 text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800 transition-all duration-200 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onClick(post);
              }}
            >
              Read More →
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  </div>
);

export default ReleasePostCard;
