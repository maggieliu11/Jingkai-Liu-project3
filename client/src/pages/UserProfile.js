import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from '../components/Post';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();

  const fetchUserData = async () => {
    try {
      setError(null);
      const [userResponse, postsResponse] = await Promise.all([
        axios.get(`/api/users/${username}`),
        axios.get(`/api/posts/user/${username}`)
      ]);
      
      setUser(userResponse.data);
      setDescription(userResponse.data.description || '');
      setPosts(postsResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.response?.data?.message || 'Error loading profile');
      setUser(null);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const handleUpdateDescription = async () => {
    try {
      await axios.put('/api/users/description', 
        { description }, 
        { withCredentials: true }
      );
      setIsEditingDescription(false);
      fetchUserData();
    } catch (error) {
      console.error('Error updating description:', error);
      alert(error.response?.data?.message || 'Error updating description');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <div className="bg-red-100 text-red-600 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-2xl p-4 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
        <p className="text-gray-500 mb-4">
          Joined {new Date(user.createdAt).toLocaleDateString()}
        </p>
        
        {isEditingDescription && currentUser?.username === username ? (
          <div className="mb-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows="3"
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setIsEditingDescription(false)}
                className="text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDescription}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <p>{user.description || 'No description'}</p>
            {currentUser?.username === username && (
              <button
                onClick={() => setIsEditingDescription(true)}
                className="text-blue-500 text-sm mt-2"
              >
                Edit description
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <Post
            key={post._id}
            post={post}
            onPostUpdated={fetchUserData}
            onPostDeleted={fetchUserData}
          />
        ))}
        {posts.length === 0 && (
          <p className="text-center text-gray-500">No posts yet</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;