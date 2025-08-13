// hooks/useAutoLogout.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';

const useAutoLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { expiresAt, isAuthenticated,accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !expiresAt) return;

    const now = new Date().getTime();
    const timeLeft = expiresAt - now;

    const handleLogout = () => {
      alert("Session expired. Please log in again.");
      dispatch(logoutUser(accessToken));
      navigate('/login', { replace: true });
    };

    if (timeLeft <= 0) {
      handleLogout();
    } else {
      const timer = setTimeout(() => {
        handleLogout();
      }, timeLeft);

      return () => clearTimeout(timer); // cleanup on unmount
    }
  }, [dispatch, navigate, expiresAt, isAuthenticated]);
};

export default useAutoLogout;
