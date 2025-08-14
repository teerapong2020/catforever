"use client";
import React, { useState, useEffect } from "react";
import { MessageCircle, Send, LogOut, Trash2, User } from "lucide-react";

export default function Commentbox({ catid, user }) {
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