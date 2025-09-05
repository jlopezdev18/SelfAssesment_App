import React from "react";
import { ChevronLeft, ChevronRight, Newspaper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ReleasePostCard from "./ReleasePostCard";
import type { ReleasePost } from "./types/DashboardMainInterfaces";
import { useDashboardMain } from "./hooks/useDashboardMain";
import ScaleLoader from "react-spinners/ScaleLoader";

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
  darkMode,
  onPostClick,
  formatDate,
  handleDeletePost,
  loading,
  isAdmin,
  textClass,
}) => {
  const { currentSlide, setCurrentSlide, nextSlide, prevSlide, totalSlides } =
    useDashboardMain(postsPerSlide);
  return (
    <Card
      className={`hover:shadow-xl transition-all duration-300 border-0 shadow-lg ${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Sparkles
                className={`w-5 h-5 text-blue-600 dark:text-blue-400`}
              />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${textClass}`}>
                Release Updates
              </h3>
              <p
                className={`text-sm text-muted-foreground ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Latest app updates and features
              </p>
            </div>
          </div>
          {!loading && releasePosts.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`h-9 w-9 hover:bg-blue-50 transition-colors ${cardClass}`}
              >
                <ChevronLeft className={`w-4 h-4 ${textClass}`} />
              </Button>
              <div
                className={`text-sm font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 ${
                  darkMode ? "bg-blue-900 text-blue-300" : ""
                }`}
              >
                {currentSlide + 1} / {totalSlides}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                disabled={currentSlide >= totalSlides - 1}
                className={`h-9 w-9 hover:bg-blue-50 transition-colors ${cardClass}`}
              >
                <ChevronRight className={`w-4 h-4 ${textClass}`} />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-8">
        <div className="overflow-hidden min-h-[420px] rounded-lg py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[420px] w-full space-y-4">
              <ScaleLoader color={darkMode ? "#60a5fa" : "#2563eb"} />
              <p className={`text-sm font-medium ${textClass}`}>
                Loading updates...
              </p>
            </div>
          ) : releasePosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[420px] space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                <Newspaper
                  className={`w-12 h-12 text-blue-600 dark:text-blue-400`}
                />
              </div>
              <div className="text-center space-y-2">
                <p className={`text-lg font-semibold ${textClass}`}>
                  No Updates Yet
                </p>
                <p
                  className={`text-sm max-w-md ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Release posts will appear here when they're published. Stay
                  tuned for exciting updates!
                </p>
              </div>
            </div>
          ) : (
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.isArray(releasePosts) &&
                Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4"
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
                          isAdmin={isAdmin}
                          cardClass={cardClass}
                          textClass={textClass}
                        />
                      ))}
                  </div>
                ))}
            </div>
          )}
        </div>

        {!loading && releasePosts.length > 0 && totalSlides > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full p-0 transition-all duration-200 ${
                  currentSlide === index
                    ? "bg-blue-600 hover:bg-blue-700 scale-110"
                    : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReleasePostCarousel;
