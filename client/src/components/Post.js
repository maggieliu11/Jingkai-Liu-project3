import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Heart } from 'lucide-react'; 

const Post = ({ post, onPostUpdated, onPostDeleted }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/posts/${post._id}`, { content }, { withCredentials: true });
      setIsEditing(false);
      onPostUpdated();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/posts/${post._id}`, { withCredentials: true });
      onPostDeleted();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      return;
    }

    try {
      if (isLiked) {
        await axios.delete(`/api/posts/${post._id}/like`, { withCredentials: true });
        setLikeCount(prev => prev - 1);
      } else {
        await axios.post(`/api/posts/${post._id}/like`, {}, { withCredentials: true });
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
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
              className="text-gray-500"
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
            >
              <Heart
                size={20}
                className={isLiked ? 'fill-red-500 text-red-500' : ''}
              />
              <span>{likeCount}</span>
            </button>
            
            {user && user._id === post.user._id && (
              <div className="space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500"
                >
                  Delete
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