import React, { useState } from "react";
import { FaUsers } from "react-icons/fa";
import ReleasePostModal from "./ReleasePostModal";
import ReleasePostCarousel from "./ReleasePostCarousel";
import type {
  DashboardMainProps,
  ReleasePost,
} from "./types/DashboardMainInterfaces";
import AddReleasePostModal from "./AddReleasePostModal";
import { useDashboardMain } from "./hooks/useDashboardMain";
import { useIsAdmin } from "../../../../hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const DashboardMain: React.FC<DashboardMainProps> = ({
  darkMode,
  cardClass,
  textClass,
}) => {
  const [selectedPost, setSelectedPost] = useState<ReleasePost | null>(null);
  const [openAddPostModal, setOpenAddPostModal] = useState(false);
  const { releasePosts, addReleasePost, deleteReleasePost, loading } =
    useDashboardMain(3);

  const formatDate = (dateObj: { _seconds: number; _nanoseconds: number }) =>
    new Date(dateObj._seconds * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const isAdmin = useIsAdmin();
  const openPost = (post: ReleasePost) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const closePost = () => {
    setSelectedPost(null);
    document.body.style.overflow = "unset";
  };

  const handleAddPost = (post: ReleasePost) => {
    // Here you would typically send the post to your backend
    addReleasePost(post);
    // For now, just close the modal
    setOpenAddPostModal(false);
  };

  const handleDeletePost = (postId: string) => {
    deleteReleasePost(postId);
  };

  const renderFullContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, index) => {
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <h3
            key={index}
            className="text-lg font-semibold text-gray-800 mt-4 mb-2"
          >
            {line.replace(/\*\*/g, "")}
          </h3>
        );
      } else if (line.match(/^\d+\./)) {
        return (
          <p key={index} className="text-gray-600 mb-2 ml-4 font-medium">
            {line}
          </p>
        );
      } else if (line.startsWith("- ")) {
        return (
          <li key={index} className="text-gray-600 mb-1 ml-4">
            {line.replace("- ", "")}
          </li>
        );
      } else if (line.trim() === "") {
        return <br key={index} />;
      } else {
        return (
          <p key={index} className="text-gray-600 mb-3 leading-relaxed">
            {line}
          </p>
        );
      }
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 mb-3">
            Dashboard
          </h1>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setOpenAddPostModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Release Post
          </Button>
        )}
      </div>
      {/* Add Release Post Modal */}
      <AddReleasePostModal
        open={openAddPostModal}
        onClose={() => setOpenAddPostModal(false)}
        onSubmit={handleAddPost}
      />
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FaUsers className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">
                  Total customers
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">567,899</span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                📈 2.6%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FaUsers className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">
                  Total customers
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">567,899</span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                📈 2.6%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FaUsers className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">
                  Total customers
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">567,899</span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                📈 2.6%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FaUsers className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">
                  Total customers
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">567,899</span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                📈 2.6%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Release Posts Carousel */}
      <ReleasePostCarousel
        releasePosts={releasePosts}
        cardClass={cardClass}
        textClass={textClass}
        darkMode={darkMode}
        onPostClick={openPost}
        formatDate={formatDate}
        handleDeletePost={handleDeletePost}
        loading={loading}
        isAdmin={isAdmin}
      />

      {/* Modal */}
      {selectedPost && (
        <ReleasePostModal
          post={selectedPost}
          onClose={closePost}
          formatDate={formatDate}
          renderFullContent={renderFullContent}
        />
      )}
    </div>
  );
};

export default DashboardMain;
