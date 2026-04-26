import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiX } from "react-icons/fi";

function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get("/v1/users/watch-history");
      setHistory(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear your entire watch history?")) return;
    try {
      // Optimistic
      setHistory([]);
      await API.delete("/v1/users/watch-history");
    } catch (err) {
      console.error(err);
      fetchHistory(); // Revert on fail
    }
  };

  const handleRemove = async (e, videoId) => {
    e.stopPropagation();
    try {
      setHistory(prev => prev.filter(v => v._id !== videoId));
      await API.delete(`/v1/users/watch-history/${videoId}`);
    } catch (err) {
      console.error(err);
      // Backend might not have this, it's ok
    }
  };

  // Group videos by Today, Yesterday, Older
  const groupHistory = () => {
    const todayStr = new Date().toDateString();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toDateString();

    const grouped = {
      Today: [],
      Yesterday: [],
      Older: []
    };

    history.forEach(video => {
      // Assuming watch history comes with a viewedAt timestamp, or fallback to createdAt
      const dateStr = new Date(video.createdAt).toDateString(); 
      if (dateStr === todayStr) {
        grouped.Today.push(video);
      } else if (dateStr === yesterdayStr) {
        grouped.Yesterday.push(video);
      } else {
        grouped.Older.push(video);
      }
    });

    return grouped;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full"></div>
    </div>
  );

  const grouped = groupHistory();
  const hasHistory = history.length > 0;

  return (
    <div className="max-w-300 mx-auto px-4 lg:px-8 py-8 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Watch History</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your recently viewed cinematic journeys.</p>
        </div>
        {hasHistory && (
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold transition-colors"
          >
            <FiTrash2 /> Clear all watch history
          </button>
        )}
      </div>

      {!hasHistory ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <FiTrash2 className="text-6xl text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800">No Watch History</h3>
          <p className="text-gray-500 mt-2">You haven't watched any videos yet.</p>
          <button onClick={() => navigate("/")} className="mt-6 px-6 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700">
            Explore Videos
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(grouped).map(([groupName, videos]) => {
            if (videos.length === 0) return null;
            return (
              <div key={groupName}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{groupName}</h2>
                  <div className="flex-1 h-px bg-gray-200 mt-2"></div>
                </div>
                
                <div className="space-y-4">
                  {videos.map(video => (
                    <div 
                      key={video._id} 
                      onClick={() => navigate(`/video/${video._id}`)}
                      className="group cursor-pointer flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white p-3 sm:p-4 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-gray-50 hover:shadow-md hover:border-gray-100 transition-all relative pr-12"
                    >
                      <button 
                        onClick={(e) => handleRemove(e, video._id)}
                        className="absolute right-4 top-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove from Watch History"
                      >
                        <FiX className="text-xl" />
                      </button>

                      <div className="relative w-full sm:w-70 h-40 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        <img src={video.thumbnail} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={video.title} />
                        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-white text-xs font-medium">
                          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                        </div>
                      </div>

                      <div className="flex flex-col justify-start py-2">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors pr-6">
                          {video.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <img src={video.owner?.avatar || `https://ui-avatars.com/api/?name=${video.owner?.username || 'User'}`} className="w-6 h-6 rounded-full" />
                          <span className="text-sm font-bold text-gray-700">{video.owner?.fullName || video.owner?.username}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded">4K</span>
                        </div>

                        <p className="text-sm text-gray-500 mt-4 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-2xl">
                          {video.description || "No description available."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WatchHistory;