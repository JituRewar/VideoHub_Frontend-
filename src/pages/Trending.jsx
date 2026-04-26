import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FiTrendingUp, FiLoader } from "react-icons/fi";

function Trending() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        // Sort by views in descending order to get trending videos
        const res = await API.get("/v1/videos?sortBy=views&sortType=desc&limit=20");
        setVideos(res.data.data.videos || []);
      } catch (err) {
        console.error("Error fetching trending videos", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-[80vh]">
        <FiLoader className="text-4xl text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="mb-8 flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <FiTrendingUp className="text-2xl text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-none">Trending</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">The most viewed cinematic moments</p>
        </div>
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
          {videos.map((v, index) => (
            <div
              key={v._id}
              onClick={() => navigate(`/video/${v._id}`)}
              className="group cursor-pointer flex flex-col relative"
            >
              {/* Rank Badge */}
              <div className="absolute -left-2 -top-2 w-8 h-8 bg-red-600 text-white font-black rounded-full flex items-center justify-center shadow-lg z-10 border-2 border-white">
                #{index + 1}
              </div>

              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm bg-gray-200 mb-3">
                <img
                  src={v.thumbnail}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={v.title}
                />
                <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-white text-xs font-medium">
                  {Math.floor((v.duration || 0) / 60)}:{((v.duration || 0) % 60).toString().padStart(2, '0')}
                </div>
              </div>

              <div className="flex gap-3 px-1">
                <img
                  src={v.owner?.avatar || `https://ui-avatars.com/api/?name=${v.owner?.fullName || v.owner?.username || 'User'}`}
                  alt="Channel avatar"
                  className="w-10 h-10 rounded-full object-cover mt-1 shrink-0 border border-gray-100"
                />
                <div className="flex flex-col overflow-hidden">
                  <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 mt-1 hover:text-gray-800 transition-colors">
                    {v.owner?.fullName || v.owner?.username || "User Channel"}
                  </p>
                  <p className="text-[13px] text-gray-500 font-medium">
                    {v.views || 0} views • {new Date(v.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 mt-12">
          <FiTrendingUp className="text-6xl mb-4 text-gray-300" />
          <p className="text-xl font-bold text-gray-600 mb-2">Nothing trending right now</p>
        </div>
      )}
    </div>
  );
}

export default Trending;
