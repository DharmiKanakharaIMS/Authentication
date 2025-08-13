import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadAuthFromStorage } from "./auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAuthFromStorage());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  );
}

export default App;
