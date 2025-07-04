import React, { useState } from "react";
import type { ReleasePost } from "./types/DashboardMainInterfaces";

interface AddReleasePostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (post: ReleasePost) => void;
}

const AddReleasePostModal: React.FC<AddReleasePostModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    title: "Latest Update - Release December 2023",
    description:
      "Hello Users, We hope this message finds you well! We're thrilled to share some exciting news with you – a brand new version of our application is now available for download!",
    fullContent: `Latest Update - Release December 2023

Hello Users,

We hope this message finds you well! We're thrilled to share some exciting news with you – a brand new version of our application is now available for download!

Our team has been working hard to enhance your user experience, address any bugs, and introduce exciting new features. To take advantage of these improvements, we encourage you to upgrade to the latest version.

Here's how to get started:

Visit the download page.
Search for the latest version, Version 1.2.0.
Under Download Links & More Click on “SelfAssessmentApp - Update - Ver 1.2.0” to download the latest version.
Follow the “Install Update Guide"

We sincerely appreciate your continued support, and we're confident that you'll love the enhancements we've made.

If you have any questions or encounter any issues during the update process, please don't hesitate to reach out.

Thank you for being a valued member of our community!

Best regards,
The Development Team`,
    version: "v1.2.0",
    tags: "Update, Download, Features, Bug Fixes",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = form.tags.split(",").map((tag) => tag.trim());
    onSubmit({
      ...form,
      tags: tagsArray,
      id: 0,
      date: "",
      image: "",
      category: "",
      author: "",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Add Release Post</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Content
              </label>
              <textarea
                placeholder="Full Content"
                value={form.fullContent}
                onChange={(e) => handleChange("fullContent", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Version
              </label>
              <input
                type="text"
                placeholder="Version"
                value={form.version}
                onChange={(e) => handleChange("version", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={form.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
            >
              Add Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReleasePostModal;
