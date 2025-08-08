import React from "react";
import { Calendar, Trash2 } from "lucide-react";
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
}

const ReleasePostCard: React.FC<ReleasePostCardProps> = ({ 
  post, 
  onClick, 
  onDelete,
  formatDate,
  isAdmin
}) => (
  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer relative">
    {/* Delete button for admins */}
    {isAdmin && (
      <Button
        size="icon"
        variant="destructive"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click
          onDelete(post.id);
        }}
        className="absolute top-2 right-2 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        title="Delete post"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    )}

    {/* Card content */}
    <div onClick={() => onClick(post)} className="h-full">
      {/* Image section */}
      <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600 relative overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
        />
        <div className="absolute top-2 left-2">
          <Badge className="bg-white/90 text-blue-600 hover:bg-white/90 font-medium">
            {post.version}
          </Badge>
        </div>
      </div>
      
      {/* Content section */}
      <CardContent className="p-6">
        <h4 className="font-semibold text-foreground mb-3 line-clamp-2 text-base leading-tight">
          {post.title}
        </h4>
        
        {/* Tags section */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
            {post.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{post.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
        
        {/* Date section */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(post.date)}</span>
          </div>
        </div>
      </CardContent>
    </div>
  </Card>
);

export default ReleasePostCard;