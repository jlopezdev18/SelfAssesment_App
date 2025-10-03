import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { ReleasePost } from "../types/DashboardMainInterfaces";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function useDashboardMain(postsPerSlide: number) {
  const [releasePosts, setReleasePosts] = useState<ReleasePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPost, setSelectedPost] = useState<ReleasePost | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/release-posts`);
      setReleasePosts(res.data as ReleasePost[]);
      setError(null);
    } catch {
      setError("Error fetching posts");
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener posts al montar
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Agregar un nuevo post - optimized to update state directly instead of refetching
  const addReleasePost = useCallback(async (
    postData: ReleasePost,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/release-posts/addPost`,
        postData
      );
      // Update state directly instead of refetching all posts
      setReleasePosts((prev) => [res.data as ReleasePost, ...prev]);
      setError(null);
      onSuccess?.();
      return res.data;
    } catch {
      const errorMessage = "Error adding post";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReleasePost = useCallback(async (
    postId: string,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/api/release-posts/${postId}`);
      setReleasePosts((prev) => prev.filter((post) => post.id !== postId));
      setError(null);
      onSuccess?.();
      return true;
    } catch {
      const errorMessage = "Error deleting post";
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const totalSlides = Math.ceil(releasePosts.length / postsPerSlide);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const openPost = useCallback((post: ReleasePost) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  }, []);

  const closePost = useCallback(() => {
    setSelectedPost(null);
    document.body.style.overflow = "unset";
  }, []);

  return {
    releasePosts,
    loading,
    error,
    currentSlide,
    setCurrentSlide,
    selectedPost,
    openPost,
    closePost,
    nextSlide,
    prevSlide,
    totalSlides,
    addReleasePost,
    deleteReleasePost,
    fetchPosts,
  };
}
