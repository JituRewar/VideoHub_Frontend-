import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../api/axios";
import { FiSearch, FiBell, FiVideo } from 'react-icons/fi';

function Navbar() {
  const { user, setUser } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/v1/users/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      
      {/* Brand logo */}
      <div className="flex items-center gap-8 w-1/4">
        <Link to="/" className="text-2xl font-black italic tracking-tighter text-red-600">
          VideoHub
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-1 flex justify-center w-1/2">
        <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-4 py-2.5 w-full max-w-xl focus-within:ring-2 ring-red-500/20 transition-all border border-transparent focus-within:border-red-200 focus-within:bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <FiSearch className="text-gray-400 text-lg mr-3" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cinematic moments..." 
            className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
          />
        </form>
      </div>

      {/* Right Icons */}
      <div className="flex items-center justify-end gap-6 w-1/4 text-gray-600">
        {user ? (
          <>
            <Link to="/upload" className="hover:text-red-600 transition-colors" title="Upload Video">
              <FiVideo className="text-xl" />
            </Link>
            
            <div className="relative group cursor-pointer flex items-center">
              <button className="hover:text-red-600 transition-colors">
                <FiBell className="text-xl" />
              </button>
              <div className="absolute right-0 top-full mt-4 w-64 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-4 text-center">
                  <FiBell className="text-3xl text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800">No Notifications</p>
                  <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
                </div>
              </div>
            </div>

            <div className="relative group cursor-pointer pl-2">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=FF0000&color=fff`
                }
                alt="profile"
                className="w-10 h-10 rounded-full object-cover hover:scale-105 border-2 border-transparent group-hover:border-red-200 transition-all duration-300"
                onClick={() => {
                  if (user?.username) {
                    navigate(`/c/${user.username}`);
                  }
                }}
              />
              
              {/* Dropdown for logout - simplistic for now */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none group-hover:pointer-events-auto">
                <div className="p-2">
                  <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                    <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}`} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{user?.fullName}</div>
                      <div className="text-xs text-gray-500">@{user?.username}</div>
                    </div>
                  </div>
                  <Link to={`/c/${user?.username}`} className="block px-4 py-2 mt-1 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg">Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg">Settings</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium">Logout</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white shadow-[0_4px_14px_0_rgb(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 rounded-full transition-all">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
