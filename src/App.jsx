import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UploadVideo from "./pages/UploadVideo";
import VideoPage from "./pages/VideoPage";
import Profile from "./pages/Profile";
import WatchHistory from "./pages/WatchHistory";
import Subscriptions from "./pages/Subscriptions";
import Playlist from "./pages/Playlist";
import AIAssistant from "./pages/AIAssistant";
import Community from "./pages/Community"; 
import Search from "./pages/Search";
import Trending from "./pages/Trending";
import Settings from "./pages/Settings";
import Help from "./pages/Help";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="hidden md:block w-64 shrink-0" />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/signup"
          element={
            <Layout>
              <Signup />
            </Layout>
          }
        />

        <Route
          path="/video/:id"
          element={
            <Layout>
              <VideoPage />
            </Layout>
          }
        />

        <Route
          path="/c/:username"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        {/* PROTECTED ROUTES */}

        <Route
          path="/dashboard"
          element={
            <Layout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/upload"
          element={
            <Layout>
              <ProtectedRoute>
                <UploadVideo />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/ai-assistant"
          element={
            <Layout>
              <ProtectedRoute>
                <AIAssistant />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/history"
          element={
            <Layout>
              <ProtectedRoute>
                <WatchHistory />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/subscriptions"
          element={
            <Layout>
              <ProtectedRoute>
                <Subscriptions />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/playlist"
          element={
            <Layout>
              <ProtectedRoute>
                <Playlist />
              </ProtectedRoute>
            </Layout>
          }
        />

          <Route
          path="/community"
          element={
            <Layout>
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />

        <Route
          path="/trending"
          element={
            <Layout>
              <Trending />
            </Layout>
          }
        />

        <Route
          path="/settings"
          element={
            <Layout>
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/help"
          element={
            <Layout>
              <Help />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;