import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth.jsx";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import BrowseChains from "./pages/BrowseChains.jsx";
import ChainDetail from "./pages/ChainDetail.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import MentorDashboard from "./pages/MentorDashboard.jsx";
import ChainBuilder from "./pages/ChainBuilder.jsx";

import Passport from "./pages/Passport.jsx";
import Portfolio from "./pages/Portfolio.jsx";

import Onboarding from "./pages/Onboarding.jsx";
import Mentors from "./pages/Mentors.jsx";
import Certificate from "./pages/Certificate.jsx";
import SessionRoom from "./pages/SessionRoom.jsx";

function Protected({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-soft">
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
}

function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "mentor" ? <MentorDashboard /> : <StudentDashboard />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-page text-ink flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/onboarding"
            element={
              <Protected>
                <Onboarding />
              </Protected>
            }
          />
          <Route
            path="/mentors"
            element={
              <Protected>
                <Mentors />
              </Protected>
            }
          />
          <Route
            path="/certificate/:studentId"
            element={
              <Protected>
                <Certificate />
              </Protected>
            }
          />
          <Route
            path="/chains"
            element={
              <Protected>
                <BrowseChains />
              </Protected>
            }
          />
          <Route
            path="/chains/new"
            element={
              <Protected role="mentor">
                <ChainBuilder />
              </Protected>
            }
          />

          <Route
            path="/chains/:id"
            element={
              <Protected>
                <ChainDetail />
              </Protected>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Protected>
                <DashboardRouter />
              </Protected>
            }
          />
          <Route
            path="/session/:id"
            element={
              <Protected>
                <SessionRoom />
              </Protected>
            }
          />
          <Route path="/passport/:userId" element={<Passport />} />
          <Route path="/p/:slug" element={<Portfolio />} />
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </div>
  );
}
