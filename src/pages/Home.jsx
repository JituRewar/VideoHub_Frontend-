import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FiPlay, FiLoader } from "react-icons/fi";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  const fetchVideos = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await API.get(`/v1/videos?page=${pageNumber}&limit=12`);
      const newVideos = res.data.data.videos || [];
      
      if (pageNumber === 1) {
        setVideos(newVideos);
      } else {
        setVideos(prev => [...prev, ...newVideos]);
      }

      if (newVideos.length < 12) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching videos", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchVideos(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVideos(nextPage);
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-[80vh]">
        <FiLoader className="text-4xl text-red-500 animate-spin" />
      </div>
    );
  }

  const heroVideo = videos.length > 0 ? videos[0] : null;
  const recommendedVideos = videos.length > 1 ? videos.slice(1) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12 w-full">
      {/* HERO SECTION */}
      {heroVideo && (
        <div className="relative w-full h-100 md:h-125 rounded-3xl overflow-hidden shadow-2xl mb-12 group cursor-pointer" onClick={() => navigate(`/video/${heroVideo._id}`)}>
          <img
            src={heroVideo.thumbnail}
            alt={heroVideo.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">
                  Featured
                </span>
                <span className="text-white/80 text-sm font-medium">
                  {heroVideo.views} views • {new Date(heroVideo.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg">
                {heroVideo.title}
              </h1>
              <p className="text-gray-300 md:text-lg line-clamp-2 md:line-clamp-3 mb-6 max-w-2xl">
                {heroVideo.description}
              </p>
              <button 
                className="bg-white text-black hover:bg-gray-100 flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/video/${heroVideo._id}`);
                }}
              >
                <FiPlay className="text-xl" fill="currentColor" /> Watch Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO GRID */}
      {recommendedVideos.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-3">
            Recommended
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
            {recommendedVideos.map((v) => (
              <div
                key={v._id}
                onClick={() => navigate(`/video/${v._id}`)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm bg-gray-200  mb-3">
                  <img
                    src={v.thumbnail}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={v.title}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-white text-xs font-medium">
                    {Math.floor((v.duration || 0) / 60)}:{Math.floor((v.duration || 0) % 60).toString().padStart(2, '0')}
                  </div>
                </div>

                <div className="flex gap-3 px-1">
                  <img
                    src={v.owner?.avatar || `https://ui-avatars.com/api/?name=${v.owner?.fullName || 'User'}`}
                    alt="Channel avatar"
                    className="w-10 h-10 rounded-full object-cover mt-1 shrink-0 border border-gray-100"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                      {v.title}
                    </h3>
                    <p className="text-[13px] text-gray-500 mt-1 hover:text-gray-800 transition-colors">
                      {v.owner?.fullName || "User Channel"}
                    </p>
                    <p className="text-[13px] text-gray-500">
                      {v.views} views • {new Date(v.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 font-semibold px-8 py-3 rounded-full transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                {loadingMore ? (
                  <><FiLoader className="animate-spin" /> Loading...</>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        !heroVideo && (
           <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FiPlay className="text-6xl mb-4 text-gray-300" />
              <p className="text-lg font-medium">No videos found</p>
           </div>
        )
      )}
    </div>
  );
}

export default Home;