import { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/posts', { content }, { withCredentials: true });
      setContent('');
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-4 border rounded-lg resize-none"
        rows="3"
        placeholder="What's happening?"
        maxLength={280}
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          disabled={!content.trim()}
        >
          Status Update
        </button>
      </div>
    </form>
  );
};

export default CreatePost;