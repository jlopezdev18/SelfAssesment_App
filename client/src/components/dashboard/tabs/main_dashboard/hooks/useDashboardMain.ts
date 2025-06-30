import { useState } from "react";
import type { ReleasePost } from "../types/DashboardMainInterfaces";

export function useDashboardMain(releasePosts: ReleasePost[], postsPerSlide: number) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPost, setSelectedPost] = useState<ReleasePost | null>(null);

  const totalSlides = Math.ceil(releasePosts.length / postsPerSlide);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const openPost = (post: ReleasePost) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const closePost = () => {
    setSelectedPost(null);
    document.body.style.overflow = "unset";
  };

  return {
    currentSlide,
    setCurrentSlide,
    selectedPost,
    openPost,
    closePost,
    nextSlide,
    prevSlide,
    totalSlides,
  };
}