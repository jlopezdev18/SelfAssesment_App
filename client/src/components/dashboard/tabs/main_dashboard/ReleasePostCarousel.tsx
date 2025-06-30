import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ReleasePostCard from "./ReleasePostCard";
import type { ReleasePost } from "./types/DashboardMainInterfaces";
import { useDashboardMain } from "./hooks/useDashboardMain";

interface ReleasePostCarouselProps {
  releasePosts: ReleasePost[];
  postsPerSlide?: number;
  cardClass: string;
  textClass: string;
  darkMode: boolean;
  onPostClick: (post: ReleasePost) => void;
  formatDate: (date: string) => string;
}

const ReleasePostCarousel: React.FC<ReleasePostCarouselProps> = ({
  releasePosts,
  postsPerSlide = 3,
  cardClass,
  textClass,
  darkMode,
  onPostClick,
  formatDate,
}) => {
  const {
    currentSlide,
    setCurrentSlide,
    nextSlide,
    prevSlide,
    totalSlides,
  } = useDashboardMain(releasePosts, postsPerSlide);

  return (
    <div
      className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${
        darkMode ? "border-gray-700" : ""
      } hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${textClass}`}>App Release Updates</h3>
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
                  <ReleasePostCard
                    key={post.id}
                    post={post}
                    onClick={onPostClick}
                    formatDate={formatDate}
                  />
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
  );
};

export default ReleasePostCarousel;