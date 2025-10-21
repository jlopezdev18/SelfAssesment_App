import React, { useState } from "react";
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
import { Plus } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { toastSuccess, toastError } from "@/utils/toastNotifications";
import { formatFirebaseDate } from "@/utils/formatters";

const DashboardMain: React.FC<DashboardMainProps> = ({
  darkMode,
  cardClass,
  textClass,
}) => {
  const [selectedPost, setSelectedPost] = useState<ReleasePost | null>(null);
  const [openAddPostModal, setOpenAddPostModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    postId: string | null;
  }>({ open: false, postId: null });
  const { releasePosts, addReleasePost, deleteReleasePost, loading } =
    useDashboardMain(3);

  const { isAdmin } = useIsAdmin();

  const openPost = (post: ReleasePost) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const handleAddPost = (post: ReleasePost) => {
    addReleasePost(
      post,
      () => {
        setOpenAddPostModal(false);
      },
      (error: string) => {
        toastError("Failed to add post", error);
      }
    );
  };

  const handleDeletePost = (postId: string) => {
    setDeleteDialog({ open: true, postId });
  };

  const handleConfirmDelete = () => {
    if (!deleteDialog.postId) return;

    deleteReleasePost(
      deleteDialog.postId,
      () => {
        toastSuccess("Post deleted successfully");
      },
      (error: string) => {
        toastError("Failed to delete post", error);
      }
    );
    setDeleteDialog({ open: false, postId: null });
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

      {/* Release Posts Carousel */}
      <ReleasePostCarousel
        releasePosts={releasePosts}
        cardClass={cardClass}
        textClass={textClass}
        darkMode={darkMode}
        onPostClick={openPost}
        formatDate={formatFirebaseDate}
        handleDeletePost={handleDeletePost}
        loading={loading}
        isAdmin={isAdmin}
      />

      {/* Modal */}
      {selectedPost && (
        <ReleasePostModal
          post={selectedPost}
          formatDate={formatFirebaseDate}
          onClose={() => setSelectedPost(null)}
          renderFullContent={renderFullContent}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, postId: null })}
        title="Delete Post"
        description="Are you sure you want to delete this release post? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        darkMode={darkMode}
      />
    </div>
  );
};

export default DashboardMain;
