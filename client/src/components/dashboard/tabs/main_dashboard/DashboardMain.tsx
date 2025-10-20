import React, { useState } from "react";
//import { FaUsers } from "react-icons/fa";
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
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

  const formatDate = (dateObj: { _seconds: number; _nanoseconds: number } | undefined) => {
    if (!dateObj || !dateObj._seconds) {
      return new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return new Date(dateObj._seconds * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
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
        toast("Failed to add post", {
          description: error,
          style: {
            background: "#dc2626",
            color: "white",
            border: "1px solid #dc2626",
          },
          duration: 4000,
        });
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
        toast("🗑️ Post deleted successfully", {
          style: {
            background: "#dc2626",
            color: "white",
            border: "1px solid #dc2626",
          },
          duration: 4000,
        });
      },
      (error: string) => {
        toast("❌ Failed to delete post", {
          description: error,
          style: {
            background: "#dc2626",
            color: "white",
            border: "1px solid #dc2626",
          },
          duration: 4000,
        });
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
        formatDate={formatDate}
        handleDeletePost={handleDeletePost}
        loading={loading}
        isAdmin={isAdmin}
      />

      {/* Modal */}
      {selectedPost && (
        <ReleasePostModal
          post={selectedPost}
          formatDate={formatDate}
          onClose={() => setSelectedPost(null)}
          renderFullContent={renderFullContent}
        />
      )}

      {/* Add Post Modal (duplicate removed - already exists above) */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, postId: null })}
      >
        <AlertDialogContent
          className={
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }
        >
          <AlertDialogHeader>
            <AlertDialogTitle className={textClass}>
              Delete Post
            </AlertDialogTitle>
            <AlertDialogDescription
              className={darkMode ? "text-gray-400" : "text-gray-600"}
            >
              Are you sure you want to delete this release post? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardMain;
