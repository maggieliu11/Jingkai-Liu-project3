// src/components/CreatePost.js
import { useState } from 'react';
import api from '../utils/axios';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/posts', { content });
      setContent('');
      setError('');
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.message || 'Error creating post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-4 border rounded-lg resize-none"
        rows="3"
        placeholder="What's happening?"
        maxLength={280}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-gray-500">{280 - content.length} characters remaining</span>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          disabled={!content.trim()}
        >
          Tweet
        </button>
      </div>
    </form>
  );
};

export default CreatePost;