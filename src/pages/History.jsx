import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FiClock, FiTrash2, FiSearch, FiLoader } from "react-icons/fi";

function History() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get("/v1/users/watch-history");
      setVideos(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all watch history?")) return;
    setVideos([]);
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-[80vh]">
        <FiLoader className="text-4xl text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8">
      {/* MAIN CONTENT: HISTORY LIST */}
      <div className="flex-1">
        <h1 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Watch History</h1>
        
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FiClock className="text-4xl text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Keep track of what you watch</h2>
            <p className="text-gray-500 max-w-sm mb-8">You haven't watched any videos yet. When you do, they'll show up here.</p>
            <button onClick={() => navigate("/")} className="px-8 py-3 bg-red-600 text-white font-bold rounded-full shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">
              Explore Videos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 mb-4 pb-2 border-b border-gray-100">Today</h3>
            {videos.map((v) => (
              <div
                key={v._id}
                onClick={() => navigate(`/video/${v._id}`)}
                className="group flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-md hover:border-red-100 transition-all"
              >
                <div className="relative w-full sm:w-48 xl:w-64 aspect-video rounded-xl overflow-hidden bg-gray-200 shrink-0">
                  <img
                    src={v.thumbnail}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={v.title}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-white text-[10px] font-bold">
                    {(v.duration || 0) > 0 ? `${Math.floor((v.duration || 0) / 60)}:${Math.floor((v.duration || 0) % 60).toString().padStart(2, '0')}` : "00:00"}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-start py-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                      {v.title}
                    </h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                      {v.owner?.fullName || v.owner?.username || "Channel"}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{(v.views || 0).toLocaleString()} views</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-3 line-clamp-2 leading-relaxed hidden sm:block">
                    {v.description || "No description provided for this video."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR: CONTROLS */}
      {videos.length > 0 && (
        <div className="w-full md:w-80 shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] sticky top-24">
            <div className="relative mb-6">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input 
                type="text" 
                placeholder="Search watch history" 
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pl-12 pr-4 outline-none focus:border-red-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={clearHistory}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 font-bold rounded-xl transition-colors"
              >
                <FiTrash2 size={18} /> Clear all watch history
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-bold rounded-xl transition-colors">
                <FiClock size={18} /> Pause watch history
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;