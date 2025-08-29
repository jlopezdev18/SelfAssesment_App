import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Newspaper,
} from "lucide-react";
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
    <Card className={`hover:shadow-lg transition-shadow ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-bold ${textClass}`}>App Release Updates</h3>
          {!loading && releasePosts.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`h-8 w-8 ${cardClass}`}
              >
                <ChevronLeft className={`w-4 h-4 ${textClass}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                disabled={currentSlide >= totalSlides - 1}
                className={`h-8 w-8 ${cardClass}`}
              >
                <ChevronRight className={`w-4 h-4 ${textClass}`} />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[300px] w-full">
                <ScaleLoader color={darkMode ? "#fff" : "#2563eb"} />
            </div>
          ) : releasePosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
              <Newspaper className={`w-16 h-16 ${textClass}`} />
              <div className="text-center space-y-2">
                <p className={`text-lg font-medium ${textClass}`}>Release Posts Coming Soon</p>
                <p className={textClass}>
                  Stay tuned for upcoming updates and releases
                </p>
              </div>
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

        {!loading && releasePosts.length > 0 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full p-0 ${
                  currentSlide === index ? "bg-primary" : "bg-muted"
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