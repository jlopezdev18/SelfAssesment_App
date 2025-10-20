import { useState, useCallback } from "react";
import axios from "axios";
import type { ReleasePost } from "../types/DashboardMainInterfaces";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function useDashboardMain(postsPerSlide: number) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPost, setSelectedPost] = useState<ReleasePost | null>(null);
  const queryClient = useQueryClient();

  // Use React Query for data fetching with caching
  const { data: releasePosts = [], isLoading: loading, error } = useQuery({
    queryKey: ['release-posts'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/release-posts`);
      return res.data as ReleasePost[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation for adding posts
  const addPostMutation = useMutation({
    mutationFn: async (postData: ReleasePost) => {
      const res = await axios.post(`${API_URL}/api/release-posts/addPost`, postData);
      return res.data as ReleasePost;
    },
    onSuccess: (newPost) => {
      // Optimistically update cache
      queryClient.setQueryData(['release-posts'], (old: ReleasePost[] = []) => [newPost, ...old]);
    },
  });

  // Mutation for deleting posts
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      await axios.delete(`${API_URL}/api/release-posts/${postId}`);
      return postId;
    },
    onSuccess: (deletedId) => {
      // Optimistically update cache
      queryClient.setQueryData(['release-posts'], (old: ReleasePost[] = []) =>
        old.filter((post) => post.id !== deletedId)
      );
    },
  });

  const addReleasePost = useCallback(async (
    postData: ReleasePost,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    try {
      await addPostMutation.mutateAsync(postData);
      onSuccess?.();
    } catch {
      onError?.("Error adding post");
    }
  }, [addPostMutation]);

  const deleteReleasePost = useCallback(async (
    postId: string,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    try {
      await deletePostMutation.mutateAsync(postId);
      onSuccess?.();
      return true;
    } catch {
      onError?.("Error deleting post");
      return false;
    }
  }, [deletePostMutation]);

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
    error: error ? "Error fetching posts" : null,
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
  };
}
