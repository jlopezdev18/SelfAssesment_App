import React from "react";
import { FaChevronLeft, FaChevronRight, FaNewspaper } from "react-icons/fa";
import ReleasePostCard from "./ReleasePostCard";
import type { ReleasePost } from "./types/DashboardMainInterfaces";
import { useDashboardMain } from "./hooks/useDashboardMain";
import ClipLoader from "react-spinners/ClipLoader";

interface ReleasePostCarouselProps {
  releasePosts?: ReleasePost[];
  postsPerSlide?: number;
  cardClass: string;
  textClass: string;
  darkMode: boolean;
  onPostClick: (post: ReleasePost) => void;
  formatDate: (dateObj: { _seconds: number; _nanoseconds: number }) => string;
  handleDeletePost: (postId: string) => void;
  loading?: boolean;
  isAdmin: boolean;
}

const ReleasePostCarousel: React.FC<ReleasePostCarouselProps> = ({
  releasePosts = [],
  postsPerSlide = 3,
  cardClass,
  textClass,
  darkMode,
  onPostClick,
  formatDate,
  handleDeletePost,
  loading,
  isAdmin,
}) => {
  const { currentSlide, setCurrentSlide, nextSlide, prevSlide, totalSlides } =
    useDashboardMain(postsPerSlide);

  return (
    <div
      className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${
        darkMode ? "border-gray-700" : ""
      } hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${textClass}`}>
          App Release Updates
        </h3>
        {!loading && releasePosts.length > 0 && (
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
        )}
      </div>

      <div className="overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <ClipLoader color={darkMode ? "#fff" : "#000"} size={40} />
            <p className={`mt-4 ${textClass}`}>Loading release posts...</p>
          </div>
        ) : releasePosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <FaNewspaper className={`w-16 h-16 ${textClass} opacity-50`} />
            <p className={`mt-4 text-lg font-medium ${textClass}`}>
              Release Posts Coming Soon
            </p>
            <p className={`mt-2 ${textClass} opacity-75`}>
              Stay tuned for upcoming updates and releases
            </p>
          </div>
        ) : (
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.isArray(releasePosts) &&
              Array.from({ length: totalSlides }).map((_, slideIndex) => (
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
                      <ReleasePostCard
                        key={post.id}
                        post={post}
                        onClick={onPostClick}
                        onDelete={handleDeletePost}
                        formatDate={formatDate}
                        isAdmin={isAdmin} // Assuming no admin functionality here
                      />
                    ))}
                </div>
              ))}
          </div>
        )}
      </div>
      {!loading && releasePosts.length > 0 && (
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
      )}
    </div>
  );
};

export default ReleasePostCarousel;
