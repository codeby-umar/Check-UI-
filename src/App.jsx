import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./Auth/Login";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Practice from "./pages/Practice";
import Dashboard from "./pages/Dashboard";
import Layout from "./layout/Layout";
import HomePages from "./pages/HomePages";
import Layouts from "./layout/Layouts";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Tests from "./pages/Tests";
import Course from "./pages/Courses";
import Settings from "./pages/Settings";
import Chatui from "./pages/Chatui";

export default function App() {
  const { user, loading } = useAuth();

  // Firebase user holatini tekshirayotgan vaqtda loading ko'rsatish
  if (loading) return <div className="h-screen flex items-center justify-center text-[#B23DEB] font-bold">Yuklanmoqda...</div>;

  return (
    <Routes>
      {/* 1. Ochiq sahifalar (Login qilmaganlar ham ko'ra oladi) */}
      <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
      
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/explore" element={<Layout><Explore /></Layout>} />
      <Route path="/practice" element={<Layout><Practice /></Layout>} />

      {/* 2. Himoyalangan sahifalar (Faqat login qilganlar uchun) */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Layouts><HomePages /></Layouts>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tests"
        element={
          <ProtectedRoute>
            <Layouts><Tests /></Layouts>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Layouts><Chatui /></Layouts>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layouts><Profile /></Layouts>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <Layouts><Course /></Layouts>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <Layouts><Leaderboard /></Layouts>
          </ProtectedRoute>
        }
      />
      <Route
        path="/setting"
        element={
          <ProtectedRoute>
            <Layouts><Settings /></Layouts>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layouts><Dashboard /></Layouts>
          </ProtectedRoute>
        }
      />

      {/* Agar noto'g'ri yo'l yozilsa yoki adashsa home ga otib yuboradi */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}