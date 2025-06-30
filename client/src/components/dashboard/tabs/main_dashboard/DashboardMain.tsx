import React, { useState } from "react";
import {
  FaUsers,
  FaDollarSign,
  FaBoxOpen,
  FaUndo,
} from "react-icons/fa";
import ReleasePostModal from "./ReleasePostModal";
import ReleasePostCarousel from "./ReleasePostCarousel";
import type { DashboardMainProps, ReleasePost } from "./types/DashboardMainInterfaces";

const DashboardMain: React.FC<DashboardMainProps> = ({
  darkMode,
  cardClass,
  textClass,
  mutedTextClass,
}) => {
  const [selectedPost, setSelectedPost] = useState<ReleasePost | null>(null);

  // Release posts data
  const releasePosts: ReleasePost[] = [
    {
      id: 1,
      title: "Latest Update - Release December 2023",
      description:
        "Hello Users, We hope this message finds you well! We're thrilled to share some exciting news with you – a brand new version of our application is now available for download!",
      fullContent: `Latest Update - Release December 2023

Hello Users,

We hope this message finds you well! We're thrilled to share some exciting news with you – a brand new version of our application is now available for download!

Our team has been working hard to enhance your user experience, address any bugs, and introduce exciting new features. To take advantage of these improvements, we encourage you to upgrade to the latest version.

Here's how to get started:

1. Visit the download page.
2. Search for the latest version, Version 1.2.0.
3. Under Download Links & More Click on "SelfAssessmentApp - Update - Ver 1.2.0" to download the latest version.
4. Follow the "Install Update Guide"

We sincerely appreciate your continued support, and we're confident that you'll love the enhancements we've made.

If you have any questions or encounter any issues during the update process, please don't hesitate to reach out.

Thank you for being a valued member of our community!

Best regards,
The Development Team`,
      date: "2023-12-15",
      version: "v1.2.0",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
      category: "Update Release",
      author: "Development Team",
      tags: ["Update", "Download", "Features", "Bug Fixes"],
    },
    {
      id: 2,
      title: "Latest Update - Release December 2025",
      description:
        "Hello Users, We hope this message finds you well! We're thrilled to share some exciting news with you – a brand new version of our application is now available for download!",
      fullContent: `Latest Update - Release December 2023

Hello Users,

We hope this message finds you well! We're thrilled to share some exciting news with you – a brand new version of our application is now available for download!

Our team has been working hard to enhance your user experience, address any bugs, and introduce exciting new features. To take advantage of these improvements, we encourage you to upgrade to the latest version.

Here's how to get started:

1. Visit the download page.
2. Search for the latest version, Version 1.2.0.
3. Under Download Links & More Click on "SelfAssessmentApp - Update - Ver 1.2.0" to download the latest version.
4. Follow the "Install Update Guide"

We sincerely appreciate your continued support, and we're confident that you'll love the enhancements we've made.

If you have any questions or encounter any issues during the update process, please don't hesitate to reach out.

Thank you for being a valued member of our community!

Best regards,
The Development Team`,
      date: "2023-12-15",
      version: "v1.2.0",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
      category: "Update Release",
      author: "Development Team",
      tags: ["Update", "Download", "Features", "Bug Fixes"],
    },
  ];

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const openPost = (post: ReleasePost) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const closePost = () => {
    setSelectedPost(null);
    document.body.style.overflow = "unset";
  };

  const renderFullContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">{line.replace('## ', '')}</h2>;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <h3 key={index} className="text-lg font-semibold text-gray-800 mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
      } else if (line.match(/^\d+\./)) {
        return <p key={index} className="text-gray-600 mb-2 ml-4 font-medium">{line}</p>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="text-gray-600 mb-1 ml-4">{line.replace('- ', '')}</li>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="text-gray-600 mb-3 leading-relaxed">{line}</p>;
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
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>🕐 Time period:</span>
          </div>
        </div>
        <button
          className="text-white px-6 py-3 rounded-lg text-sm font-medium transition-all hover:shadow-lg transform hover:scale-105"
          style={{
            background:
              "linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%)",
          }}
        >
          Add data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${
            darkMode ? "border-gray-700" : ""
          } hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FaUsers className="w-4 h-4 text-blue-500" />
              <span className={`text-sm ${mutedTextClass}`}>Total customers</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${textClass}`}>567,899</span>
            <span className="text-sm text-green-500 font-medium">📈 2.6%</span>
          </div>
        </div>
        <div
          className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${
            darkMode ? "border-gray-700" : ""
          } hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FaDollarSign className="w-4 h-4 text-green-500" />
              <span className={`text-sm ${mutedTextClass}`}>Total revenue</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${textClass}`}>$3,465 M</span>
            <span className="text-sm text-green-500 font-medium">📈 0.6%</span>
          </div>
        </div>
        <div
          className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${
            darkMode ? "border-gray-700" : ""
          } hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FaBoxOpen className="w-4 h-4 text-purple-500" />
              <span className={`text-sm ${mutedTextClass}`}>Total orders</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${textClass}`}>1,136 M</span>
            <span className="text-sm text-red-500 font-medium">📉 0.2%</span>
          </div>
        </div>
        <div
          className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${
            darkMode ? "border-gray-700" : ""
          } hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FaUndo className="w-4 h-4 text-orange-500" />
              <span className={`text-sm ${mutedTextClass}`}>Total returns</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${textClass}`}>1,789</span>
            <span className="text-sm text-green-500 font-medium">📈 0.12%</span>
          </div>
        </div>
      </div>

      {/* Release Posts Carousel */}
      <ReleasePostCarousel
        releasePosts={releasePosts}
        cardClass={cardClass}
        textClass={textClass}
        darkMode={darkMode}
        onPostClick={openPost}
        formatDate={formatDate}
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