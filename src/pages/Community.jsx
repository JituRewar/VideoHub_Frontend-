import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiImage,
  FiVideo,
  FiBarChart2,
  FiSmile,
  FiTrendingUp,
  FiMessageSquare,
  FiRepeat,
  FiHeart,
  FiShare,
} from "react-icons/fi";

function Community() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("For You");

  const fetchTweets = async () => {
    try {
      if (!user?._id) return;
      const res = await API.get(`/v1/tweets/user/${user._id}`);
      setTweets(res.data.data || []);
    } catch (err) {
      console.error("Fetch Tweets Error:", err);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [user]);

  const handlePost = async () => {
    if (!content.trim()) return;
    try {
      setLoading(true);
      await API.post("/v1/tweets", { content });
      setContent("");
      fetchTweets();
    } catch (err) {
      console.error("Create Tweet Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTweet = async (id) => {
    try {
      await API.delete(`/v1/tweets/${id}`);
      setTweets((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async (id) => {
    // Optimistic UI could be added here
    try {
      await API.patch(`/v1/likes/tweet/${id}`);
      fetchTweets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-300 mx-auto w-full px-4 lg:px-8 py-6 flex flex-col lg:flex-row gap-8 items-start">
      {/* MAIN FEED */}
      <div className="flex-1 w-full max-w-175 space-y-6">
        {/* POST CREATOR BOX */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="flex gap-4">
            <img
              src={
                user?.user?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.user?.fullName || "Creator"}&background=FF0000&color=fff`
              }
              className="w-12 h-12 rounded-full object-cover shadow-sm"
              alt="User"
            />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening?"
                className="w-full bg-transparent resize-none outline-none text-xl placeholder-gray-400 font-medium h-14"
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-4 text-red-600">
                  <button className="p-2 hover:bg-red-50 rounded-full transition-colors">
                    <FiImage size={20} />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-full transition-colors">
                    <FiVideo size={20} />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-full transition-colors">
                    <FiBarChart2 size={20} />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-full transition-colors hidden sm:block">
                    <FiSmile size={20} />
                  </button>
                </div>
                <button
                  onClick={handlePost}
                  disabled={loading || !content.trim()}
                  className="bg-red-600 text-white font-bold px-6 py-2 rounded-full hover:bg-red-700 shadow-md shadow-red-600/20 transition-all disabled:opacity-60 disabled:shadow-none"
                >
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FEED TABS */}
        <div className="flex gap-2 mb-2 p-1 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 w-fit">
          {["For You", "Following", "Creators Only", "Media"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 font-bold text-sm rounded-full transition-all ${
                activeTab === tab
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TWEETS LIST */}
        <div className="space-y-6">
          {/* STATIC MOCK TWEET FOR DESIGN */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold border-b border-transparent hover:border-gray-900 cursor-pointer inline-block text-gray-900">
                    Alex Rivera
                  </h3>
                  <div className="text-gray-500 text-sm font-medium">
                    <span>@arivera</span>
                    <span className="mx-1">•</span>
                    <span>2h</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">...</button>
            </div>
            <p className="text-gray-800 font-medium leading-relaxed mb-4 text-[15px]">
              Just finished editing the new cinematic tour of Kyoto! Can't wait
              to show you all the 8K color grades. The lighting at Fushimi Inari
              during sunrise was absolutely ethereal. 🏮 ✨
            </p>
            <div className="flex justify-between max-w-100 text-gray-500 font-medium text-sm mt-2">
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                <FiMessageSquare /> 124
              </button>
              <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                <FiRepeat /> 42
              </button>
              <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                <FiHeart /> 1.2k
              </button>
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                <FiShare />
              </button>
            </div>
          </div>

          {/* DYNAMIC POSTS */}
          {tweets.map((t) => (
            <div
              key={t._id}
              className="bg-white p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`/c/${t.owner?.username}`)}
                >
                  <img
                    src={
                      t.owner?.avatar ||
                      `https://ui-avatars.com/api/?name=${t.owner?.username || "User"}`
                    }
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    alt={t.owner?.username}
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:underline">
                      {t.owner?.fullName || t.owner?.username}
                    </h3>
                    <div className="text-gray-500 text-sm font-medium">
                      <span>@{t.owner?.username}</span>
                      <span className="mx-1">•</span>
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {user?._id === t.owner?._id && (
                  <button
                    onClick={() => deleteTweet(t._id)}
                    className="text-red-500 hover:bg-red-50 text-xs font-bold px-3 py-1 rounded-full transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>

              <p className="text-gray-800 font-medium leading-relaxed mb-4 text-[15px] whitespace-pre-wrap">
                {t.content}
              </p>

              <div className="flex justify-between max-w-100 text-gray-500 font-medium text-sm mt-2">
                <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                  <FiMessageSquare /> {t.commentsCount || 0}
                </button>
                <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                  <FiRepeat /> 0
                </button>
                <button
                  onClick={() => toggleLike(t._id)}
                  className="flex items-center gap-2 hover:text-red-500 transition-colors"
                >
                  <FiHeart /> {t.likesCount || 0}
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                  <FiShare />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR TABS */}
      <div className="w-full lg:w-87.5 space-y-6 shrink-0">
        {/* TRENDING WIDGET */}
        <div className="bg-white/60 p-6 rounded-3xl border border-gray-100">
          <h2 className="font-black text-xl mb-6 text-gray-900 flex items-center gap-2">
            Trending in Community <FiTrendingUp className="text-red-600" />
          </h2>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">
                Photography • Trending
              </p>
              <h4 className="font-bold text-gray-900 text-base">
                #GoldenHourKyoto
              </h4>
              <p className="text-xs text-gray-500 font-medium mt-1">
                42.5k posts
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">
                Technology • Trending
              </p>
              <h4 className="font-bold text-gray-900 text-base">
                #AIEditingSuite
              </h4>
              <p className="text-xs text-gray-500 font-medium mt-1">
                12.8k posts
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">
                Gaming • Trending
              </p>
              <h4 className="font-bold text-gray-900 text-base">
                #NexusSpeedrun
              </h4>
              <p className="text-xs text-gray-500 font-medium mt-1">
                8.4k posts
              </p>
            </div>

            <button className="text-red-600 font-bold text-sm w-full text-left hover:underline">
              Show more
            </button>
          </div>
        </div>

        {/* SUGGESTED CREATORS WIDGET */}
        <div className="bg-white/60 p-6 rounded-3xl border border-gray-100">
          <h2 className="font-black text-xl mb-6 text-gray-900">
            Suggested Creators
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-none">
                    Maya VFX
                  </h4>
                  <span className="text-xs text-gray-500 font-medium">
                    @maya_vfx
                  </span>
                </div>
              </div>
              <button className="bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-gray-800">
                Follow
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-none">
                    Chef Luca
                  </h4>
                  <span className="text-xs text-gray-500 font-medium">
                    @lucacooks
                  </span>
                </div>
              </div>
              <button className="bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-gray-800">
                Follow
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-none">
                    Wild Peak
                  </h4>
                  <span className="text-xs text-gray-500 font-medium">
                    @wildpeak
                  </span>
                </div>
              </div>
              <button className="bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-gray-800">
                Follow
              </button>
            </div>

            <button className="text-red-600 font-bold text-sm w-full text-left hover:underline pt-2">
              Show more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;
