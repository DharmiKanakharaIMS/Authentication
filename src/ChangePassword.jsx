import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from './auth/authSlice';

function ChangePassword() {
  const { accessToken } = useSelector(state => state.auth);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // success or error
  const dispatch = useDispatch()
  const nav = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if(oldPassword === newPassword)
    {
      setMessage({type:'error',text:"Password is similar to old password"})
      return
    }

    setLoading(true);
    setMessage(null);

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/change-password`,
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert("Password Changed successfully")
      dispatch(logoutUser(accessToken));
      nav('/login');
     
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to change password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
        Change Password
      </h2>

      {message && (
        <div
          className={`mb-6 p-3 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="currentPassword"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              placeholder="Enter current password"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              autoComplete="current-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="newPassword"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            New Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Enter new password"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="mb-8">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition ${
            loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
