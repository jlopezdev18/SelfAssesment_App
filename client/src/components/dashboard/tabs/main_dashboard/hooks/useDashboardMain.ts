import { useState, useEffect } from "react";
import axios from "axios";
import type { ReleasePost } from "../types/DashboardMainInterfaces";

export function useDashboardMain(postsPerSlide: number) {
  const [releasePosts, setReleasePosts] = useState<ReleasePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPost, setSelectedPost] = useState<ReleasePost | null>(null);

  // Obtener posts al montar
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/release-posts");
      setReleasePosts(res.data as ReleasePost[]);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching posts");
    } finally {
      setLoading(false);
    }
  };

  // Agregar un nuevo post
  const addReleasePost = async (postData: ReleasePost) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/release-posts/addPost", postData);
      // Opcional: recargar la lista después de agregar
      await fetchPosts();
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.message || "Error adding post");
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
    addReleasePost, // <-- aquí está la función para agregar
    fetchPosts,     // <-- puedes exponerla si quieres refrescar manualmente
  };
}