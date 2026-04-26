import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch, FiLoader } from "react-icons/fi";

function Search() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/v1/videos?query=${encodeURIComponent(query)}`);
        setVideos(res.data.data.videos || []);
      } catch (err) {
        console.error("Error fetching search results", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setVideos([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-[80vh]">
        <FiLoader className="text-4xl text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
          Search results for "<span className="text-red-600">{query}</span>"
        </h1>
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
          {videos.map((v) => (
            <div
              key={v._id}
              onClick={() => navigate(`/video/${v._id}`)}
              className="group cursor-pointer flex flex-col"
            >
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
                  <p className="text-[13px] text-gray-500">
                    {v.views || 0} views • {new Date(v.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 mt-12">
          <FiSearch className="text-6xl mb-4 text-gray-300" />
          <p className="text-xl font-bold text-gray-600 mb-2">No results found</p>
          <p className="text-sm">Try searching with a different keyword</p>
        </div>
      )}
    </div>
  );
}

export default Search;
