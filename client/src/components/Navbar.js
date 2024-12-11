import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-semibold text-white hover:text-gray-200 transition">
          Maggie's Tech Blog
        </Link>
        <div className="space-x-6">
          {user ? (
            <>
              <Link to={`/user/${user.username}`} className="text-white hover:text-gray-200 transition">
                {user.username}
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-200 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[rgb(77,71,220)] text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
