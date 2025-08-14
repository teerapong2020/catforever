"use client";
import React, { useState, useEffect } from "react";
import { Heart, Shuffle, Camera, Star, MessageCircle, Send, LogOut, Trash2, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

// Comment Box Component
function Commentbox({ catid, user }) {
  const [comment, setComment] = useState("");
  const [posts, setPosts] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comment?catid=${catid}`);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [catid]);

  const handlePost = async () => {
    if (!comment.trim()) return;
    
    setIsPosting(true);
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          username: user.username,
          catid,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPosts([...posts, data.comment]);
        setComment("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/";
  };

  const handleDelete = async (postId) => {
    setDeletingId(postId);
    try {
      const res = await fetch(`/api/comment/${postId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setPosts((prev) => prev.filter((c) => c.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Comments</h2>
              <p className="text-blue-100 text-sm">{posts.length} comment{posts.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all duration-200 text-white hover:scale-105"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="max-h-96 overflow-y-auto px-6 py-4 space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No comments yet</p>
            <p className="text-gray-400 text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div
              key={index}
              className="group bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 hover:shadow-md transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-full">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        {post.username}
                      </span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="text-gray-500 text-xs">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed break-words">
                      {post.comment}
                    </p>
                  </div>
                </div>
                {user && (user.id === post.user_id || user.username === post.username) && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className="opacity-0 group-hover:opacity-100 ml-3 p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 disabled:opacity-50"
                  >
                    {deletingId === post.id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <div className="flex items-start space-x-4">
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-full flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`What's on your mind, ${user?.username || 'there'}?`}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                rows="3"
                maxLength="500"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {comment.length}/500
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-500">
                Press Enter to post, Shift+Enter for new line
              </p>
              <button
                onClick={handlePost}
                disabled={!comment.trim() || isPosting}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isPosting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Post Comment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Cat Feedback Page
export default function Page() {
  const [catUrl, setCatUrl] = useState("");
  const [user, setUser] = useState(null);
  const [catid, setCatid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Mock JWT decode function since we don't have the library
  const jwtDecode = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('JWT decode error:', err);
      return null;
    }
  };

  const randomCat = () => {
    setIsLoading(true);
    setImageLoaded(false);
    const newCatId = Date.now().toString();
    setCatid(newCatId);
    setCatUrl(`https://cataas.com/cat?${newCatId}`);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    alert('Failed to load cat image. Please try again!');
  };

  useEffect(() => {
    randomCat();

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Token decode error:", err);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Cat Feedback Gallery
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover adorable cats and share your thoughts with our community!
          </p>
        </div>

        {/* Cat Display Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-8">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Featured Cat</h2>
                  <p className="text-blue-100">Rate this adorable feline!</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="text-white font-semibold">4.9</span>
              </div>
            </div>
          </div>

          {/* Cat Image Section */}
          <div className="p-8">
            <div className="relative max-w-2xl mx-auto">
              {/* Image Container */}
              <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-xl">
                {catUrl && (
                  <>
                    <img
                      src={catUrl}
                      alt="Random adorable cat"
                      className="w-full h-full object-cover transition-opacity duration-500"
                      style={{ opacity: imageLoaded ? 1 : 0 }}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                    
                    {/* Loading Overlay */}
                    {(isLoading || !imageLoaded) && (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading adorable cat...</p>
                        </div>
                      </div>
                    )}

                    {/* Cat ID Badge */}
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      Cat #{catid.slice(-6)}
                    </div>
                  </>
                )}
              </div>

              {/* New Cat Button */}
              <div className="text-center mt-8">
                <button
                  onClick={randomCat}
                  disabled={isLoading}
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Getting New Cat...</span>
                    </>
                  ) : (
                    <>
                      <Shuffle className="w-6 h-6" />
                      <span>Get New Cat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        {user ? (
          <Commentbox catid={catid} user={user} />
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Join the Conversation</h2>
            </div>
            <div className="p-8 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign in to comment</h3>
              <p className="text-gray-600 mb-6">Share your thoughts about this adorable cat!</p>
              <button
                onClick={() => window.location.href = "/login"}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Sign In to Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}