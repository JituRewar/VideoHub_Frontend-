import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiPlay, FiShuffle, FiLoader, FiList, FiTrash2 } from "react-icons/fi";

function Playlist() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?._id) {
      fetchPlaylists();
    } else if (!authLoading) {
      setLoading(false);
      setError("Please login to view your Library");
    }
  }, [user, authLoading]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/v1/playlist/user/${user._id}`);
      const data = res.data.data || [];
      
      setPlaylists(data);
      if (data.length > 0) {
        setSelected(data[0]);
      }
    } catch (err) {
      console.error("PLAYLIST ERROR:", err);
      if (err.response?.status === 404) {
        setPlaylists([]);
      } else {
        setError("Failed to load your library");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    if (!selected) return;
    try {
      await API.patch(`/v1/playlist/remove/${videoId}/${selected._id}`);
      setSelected({
        ...selected,
        videos: selected.videos.filter((v) => v._id !== videoId)
      });
    } catch (err) {
      console.error("Failed to remove video from playlist", err);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <FiLoader className="text-4xl text-red-600 animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <FiList className="text-6xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{error || "Library Access Required"}</h2>
        <button onClick={() => navigate("/login")} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full font-bold">Sign In</button>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <FiList className="text-6xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your library is empty</h2>
        <p className="text-gray-500 max-w-md">Save videos to playlists to build your personal cinematic collection.</p>
        <button onClick={() => navigate("/")} className="mt-6 px-6 py-2 border-2 border-red-100 text-red-600 rounded-full font-bold hover:bg-red-50">Explore Videos</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full flex flex-col lg:flex-row gap-10">
      
      {/* PLAYLIST SELECTOR (Top on mobile, hidden on desktop if only 1, or can just be a dropdown) */}
      {playlists.length > 1 && (
        <div className="lg:hidden w-full mb-4">
          <select 
            className="w-full p-3 rounded-xl bg-white border border-gray-200 outline-none font-bold"
            value={selected?._id || ""}
            onChange={(e) => setSelected(playlists.find(p => p._id === e.target.value))}
          >
            {playlists.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* LEFT SIDE: Active Playlist Detail Card */}
      {selected && (
        <div className="w-full lg:w-96 xl:w-[28rem] shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 sticky top-24">
            
            <div className="relative w-full aspect-square bg-gray-900 rounded-3xl overflow-hidden mb-6 shadow-xl">
              <img
                src={selected.videos?.[0]?.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564"}
                className="w-full h-full object-cover opacity-90"
                alt="Playlist Cover"
              />
              <div className="absolute top-4 w-full flex justify-center">
                <span className="uppercase tracking-[0.2em] text-white text-[10px] font-bold opacity-80 mix-blend-overlay">Playlist</span>
              </div>
            </div>

            <h1 className="text-4xl font-black text-gray-900 leading-none tracking-tight mb-2">
              {selected.name}
            </h1>
            
            <p className="text-gray-600 font-medium mb-4">
              {user.user?.fullName || user.user?.username || "Alex Rivera"}
            </p>

            <div className="flex items-center gap-6 text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">
              <div className="flex flex-col">
                <span className="text-gray-900 text-base">{selected.totalVideos || selected.videos?.length || 0}</span>
                <span>Videos</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 text-base">{(selected.totalViews || 0).toLocaleString()}</span>
                <span>Views</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 text-base">Today</span>
                <span>Updated</span>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-full font-bold transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2">
                <FiPlay fill="currentColor" /> Play All
              </button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-2">
                <FiShuffle /> Shuffle
              </button>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              {selected.description || "The ultimate collection. Curated blend of cinematic visuals, aesthetic narratives, and high-quality productions."}
            </p>
          </div>
        </div>
      )}

      {/* RIGHT SIDE: Video List */}
      {selected && (
        <div className="flex-1 lg:pl-4">
          <div className="flex text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2 border-b border-gray-100 pb-4">
            <div className="w-12">#</div>
            <div className="flex-1">Title</div>
            <div className="w-24 text-right">Duration</div>
          </div>

          <div className="space-y-2">
            {(!selected.videos || selected.videos.length === 0) ? (
              <p className="text-gray-500 text-center py-10">No videos in this playlist</p>
            ) : (
              selected.videos.map((v, index) => (
                <div
                  key={v._id}
                  onClick={() => navigate(`/video/${v._id}`)}
                  className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer transition-all border border-transparent hover:border-gray-100"
                >
                  <span className="font-bold text-gray-400 w-8 text-center group-hover:text-red-500 transition-colors">
                    {index + 1}
                  </span>

                  <div className="relative w-32 md:w-40 aspect-video rounded-xl overflow-hidden bg-gray-200 shrink-0">
                    <img
                      src={v.thumbnail}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={v.title}
                    />
                  </div>

                  <div className="flex-1 py-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1 text-base md:text-lg">
                      {v.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium hidden sm:block">
                      {v.owner?.fullName || "The Sound Lab"} • {(v.views || 0).toLocaleString()} views
                    </p>
                  </div>

                  <div className="flex items-center gap-4 ml-auto">
                    <span className="text-sm font-bold text-gray-500 w-16 text-right">
                      {(v.duration || 0) > 0 ? `${Math.floor((v.duration || 0) / 60)}:${Math.floor((v.duration || 0) % 60).toString().padStart(2, '0')}` : "00:00"}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveVideo(v._id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from Playlist"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Playlist;