import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import EditProfileModal from "../components/EditProfileModal";
import { FiLoader, FiPlay, FiTrash2 } from "react-icons/fi";

function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Videos");

  const isOwnProfile = user?._id === channel?._id || user?.username === username;

  useEffect(() => {
    fetchChannel();
  }, [username]);

  const fetchChannel = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/v1/users/c/${username}`);
      setChannel(res.data.data);
      
      if (res.data.data?._id) {
        const vids = await API.get(`/v1/videos/user/${res.data.data._id}`);
        setVideos(vids.data.data?.videos || vids.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscribe = async () => {
    try {
      await API.post(`/v1/subscriptions/c/${channel._id}`);
      setSubscribed(!subscribed);
    } catch {
      alert("Login required");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await API.delete(`/v1/videos/${videoId}`);
      setVideos((prev) => prev.filter(v => v._id !== videoId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete video");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-[80vh]">
        <FiLoader className="text-4xl text-red-500 animate-spin" />
      </div>
    );
  }

  if (!channel) return <p className="p-6 text-center text-gray-500">Channel not found</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* COVER IMAGE */}
      <div className="w-full h-48 md:h-72 bg-linear-to-r from-gray-800 to-gray-900 relative rounded-b-3xl overflow-hidden shadow-sm mx-auto max-w-400">
        <img
          src={channel.coverImage || "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80"}
          className="w-full h-full object-cover opacity-80"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
      </div>

      {/* HEADER SECTION */}
      <div className="max-w-300 mx-auto px-6 sm:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 md:-mt-20 mb-8">
          
          {/* AVATAR */}
          <div className="relative">
            <img
              src={
                channel.avatar ||
                `https://ui-avatars.com/api/?name=${channel.fullName || channel.username}&size=256`
              }
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-50 shadow-xl object-cover bg-white"
              alt={channel.username}
            />
          </div>

          {/* CHANNEL INFO */}
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-black text-gray-900 drop-shadow-sm">{channel.fullName || channel.username}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-medium text-gray-600 bg-gray-200/60 px-2 py-0.5 rounded text-sm">
                @{channel.username}
              </span>
              <span className="text-sm text-gray-500 font-medium pb-px">•</span>
              <span className="text-sm text-gray-500 font-medium">
                {(channel.subscribersCount || 0).toLocaleString()} subscribers
              </span>
              <span className="text-sm text-gray-500 font-medium pb-px">•</span>
              <span className="text-sm text-gray-500 font-medium">
                {videos.length} videos
              </span>
            </div>
            {channel.bio && (
              <p className="mt-4 text-sm text-gray-700 max-w-2xl leading-relaxed">
                {channel.bio}
              </p>
            )}
          </div>

          {/* ACTION BUTTON */}
          <div className="pb-4 shrink-0">
            {isOwnProfile ? (
              <button
                onClick={() => setEditOpen(true)}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-800 font-semibold rounded-full shadow-sm hover:bg-gray-50 transition-all"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={toggleSubscribe}
                className={`px-8 py-2.5 rounded-full font-bold shadow-sm transition-all ${
                  subscribed
                    ? "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                    : "bg-red-600 text-white hover:bg-red-700 shadow-red-600/20"
                }`}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-8 border-b border-gray-200 text-sm font-bold text-gray-500 uppercase tracking-wider">
          {["Videos", "Playlists", "Community", "About"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 transition-colors relative ${
                activeTab === tab 
                  ? "text-red-600" 
                  : "hover:text-gray-900"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute -bottom-px left-0 w-full h-0.75 bg-red-600 rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-300 mx-auto px-6 sm:px-12 py-8">
        {activeTab === "Videos" && (
          <>
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
                {videos.map((video) => (
                  <div
                    key={video._id}
                    onClick={() => navigate(`/video/${video._id}`)}
                    className="cursor-pointer group flex flex-col"
                  >
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 shadow-sm mb-3">
                      <img
                        src={video.thumbnail}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={video.title}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[13px] text-gray-500">
                        {video.views?.toLocaleString() || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                      </p>
                      {isOwnProfile && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVideo(video._id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Video"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex justify-center items-center mb-4">
                  <FiPlay className="text-4xl text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-700">No videos yet</h3>
                <p className="text-gray-500 text-sm mt-2">This channel hasn't uploaded any videos.</p>
              </div>
            )}
          </>
        )}
        
        {activeTab !== "Videos" && (
          <div className="text-center py-20 text-gray-500 text-sm">
            Content for {activeTab} coming soon...
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editOpen && (
        <EditProfileModal
          user={channel}
          onClose={() => setEditOpen(false)}
          onUpdate={fetchChannel}
        />
      )}
    </div>
  );
}

export default Profile;
