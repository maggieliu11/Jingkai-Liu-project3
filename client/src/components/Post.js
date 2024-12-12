// src/components/Post.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import api from '../utils/axios';

const Post = ({ post, onPostUpdated, onPostDeleted }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [error, setError] = useState('');
  const isAdmin = user?.username === 'MaggieL';

  const handleUpdate = async () => {
    try {
      setError('');
      await api.put(`/api/posts/${post._id}`, { content });
      setIsEditing(false);
      onPostUpdated();
    } catch (error) {
      console.error('Error updating post:', error);
      setError(error.response?.data?.message || 'Error updating post');
    }
  };

  const handleDelete = async () => {
    try {
      setError('');
      if (isAdmin) {
        // Use admin delete endpoint
        await api.delete(`/api/admin/posts/${post._id}`);
      } else {
        // Use regular delete endpoint
        await api.delete(`/api/posts/${post._id}`);
      }
      onPostDeleted();
    } catch (error) {
      console.error('Error deleting post:', error);
      setError(error.response?.data?.message || 'Error deleting post');
    }
  };

  const handleLike = async () => {
    if (!user) {
      // Could add a redirect to login here
      return;
    }

    try {
      setError('');
      if (isLiked) {
        await api.delete(`/api/posts/${post._id}/like`);
        setLikeCount(prev => prev - 1);
      } else {
        await api.post(`/api/posts/${post._id}/like`, {});
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      setError(error.response?.data?.message || 'Error updating like');
    }
  };

  return (
    <div className="border-b p-4">
      <div className="flex justify-between items-start">
        <Link to={`/user/${post.user.username}`} className="font-bold text-blue-500">
          {post.user.username}
        </Link>
        <span className="text-gray-500 text-sm">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
      
      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 px-3 py-1"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="mt-2">{post.content}</p>
          <div className="flex items-center mt-2 space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
              title={user ? 'Like' : 'Login to like posts'}
            >
              <Heart
                size={20}
                className={isLiked ? 'fill-red-500 text-red-500' : ''}
              />
              <span>{likeCount}</span>
            </button>
            
            {/* Show delete/edit buttons for post owner or admin */}
            {(user?.username === post.user.username || isAdmin) && (
              <div className="space-x-2">
                {user?.username === post.user.username && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className={isAdmin ? "text-red-600 font-bold" : "text-red-500"}
                >
                  {isAdmin && user?.username !== post.user.username ? "Admin Delete" : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;