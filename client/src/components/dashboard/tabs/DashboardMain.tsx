import React, { useState } from "react";
import {
  FaUsers,
  FaDollarSign,
  FaBoxOpen,
  FaUndo,
  FaChevronLeft,
  FaChevronRight,
  FaCalendar,
  FaTimes,
} from "react-icons/fa";

interface ReleasePost {
  id: number;
  title: string;
  description: string;
  fullContent: string;
  date: string;
  version: string;
  image: string;
  category: string;
  author: string;
  tags: string[];
}

interface DashboardMainProps {
  darkMode: boolean;
  cardClass: string;
  textClass: string;
  mutedTextClass: string;
}

const DashboardMain: React.FC<DashboardMainProps> = ({
  darkMode,
  cardClass,
  textClass,
  mutedTextClass,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPost, setSelectedPost] = useState<ReleasePost | null>(null);

  // Updated release posts data with the new format
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
      title: "Performance Improvements & Bug Fixes",
      description:
        "We've optimized our platform for better performance and fixed several reported issues.",
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
      date: "2025-06-08",
      version: "v2.3.2",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
      category: "Update",
      author: "Mike Rodriguez",
      tags: ["Performance", "Bug Fixes", "Optimization", "Updates"],
    },
    {
      id: 3,
      title: "Mobile App 2.0 Launch",
      description:
        "Experience our completely redesigned mobile app with enhanced user interface and new features.",
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
      date: "2025-06-05",
      version: "v2.0.0",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop",
      category: "Product Launch",
      author: "Emma Thompson",
      tags: ["Mobile", "App Launch", "UI/UX", "Design"],
    },
    {
      id: 4,
      title: "API v3.0 Documentation",
      description:
        "Comprehensive documentation for our new API version with improved endpoints and authentication.",
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
      date: "2025-06-03",
      version: "v3.0.0",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
      category: "Documentation",
      author: "David Kim",
      tags: ["API", "Documentation", "Developers", "Integration"],
    },
    {
      id: 5,
      title: "Security Enhancement Update",
      description:
        "Important security updates and new two-factor authentication options for better account protection.",
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
      date: "2025-06-01",
      version: "v2.3.1",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop",
      category: "Security",
      author: "Lisa Zhang",
      tags: ["Security", "Authentication", "Privacy", "Compliance"],
    },
  ];

  const postsPerSlide = 3;
  const totalSlides = Math.ceil(releasePosts.length / postsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const openPost = (post: ReleasePost) => {
    setSelectedPost(post);
    document.body.style.overflow = 'hidden';
  };

  const closePost = () => {
    setSelectedPost(null);
    document.body.style.overflow = 'unset';
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
              <span className={`text-sm ${mutedTextClass}`}>
                Total customers
              </span>
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
      <div
        className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${
          darkMode ? "border-gray-700" : ""
        } hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${textClass}`}>
            App Release Updates
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={currentSlide === 0}
            >
              <FaChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={currentSlide >= totalSlides - 1}
            >
              <FaChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {releasePosts
                  .slice(
                    slideIndex * postsPerSlide,
                    slideIndex * postsPerSlide + postsPerSlide
                  )
                  .map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
                      onClick={() => openPost(post)}
                    >
                      <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600 relative overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="bg-white/90 text-xs px-2 py-1 rounded-full text-blue-600 font-medium">
                            {post.version}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="bg-white/90 text-xs px-2 py-1 rounded-full text-green-600 font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base">
                          {post.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {post.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FaCalendar className="w-3 h-3" />
                            <span>{formatDate(post.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Updated Release Modal - Removed "Released by" */}
      {selectedPost && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="relative">
              <div className="h-64 bg-gradient-to-r from-blue-400 to-blue-600 relative overflow-hidden">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <button
                  onClick={closePost}
                  className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
                >
                  <FaTimes className="w-5 h-5 text-black" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-white/90 text-xs px-3 py-1 rounded-full text-blue-600 font-medium">
                      {selectedPost.version}
                    </span>
                    <span className="bg-white/90 text-xs px-3 py-1 rounded-full text-green-600 font-medium">
                      {selectedPost.category}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {selectedPost.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-white text-sm">
                    <span>{formatDate(selectedPost.date)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[calc(90vh-16rem)] overflow-y-auto">
              {/* Full Content */}
              <div className="prose prose-lg max-w-none">
                {renderFullContent(selectedPost.fullContent)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMain;