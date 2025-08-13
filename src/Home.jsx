import { useDispatch, useSelector } from 'react-redux';
import {  logoutUser } from './auth/authSlice';
import { useNavigate } from 'react-router-dom';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user,accessToken } = useSelector(state => state.auth);

   const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      try {
        await dispatch(logoutUser(accessToken));
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  if (!user) return <p className="text-center mt-10">Loading user info...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-600">Home</h1>
        <h3 className="text-lg text-gray-700 mb-6">Welcome, <span className="font-semibold">{user.name}</span></h3>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
