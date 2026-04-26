import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { 
  FiThumbsUp, FiThumbsDown, FiShare2, 
  FiMoreHorizontal, FiSend, FiLoader,
  FiFolderPlus, FiX 
} from "react-icons/fi";

function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const videoRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);

  useEffect(() => {
    fetchVideo();
    fetchComments();
    fetchRelatedVideos();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/v1/videos/${id}`);
      setVideo(res.data.data);
      setLikesCount(res.data.data?.likes || 0);
      
      if (user && res.data.data?.owner?._id) {
        // Optional: Check if user is subscribed (if backend supports a check or we have it in user profile)
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await API.get(`/v1/comments/video/${id}`);
      const data = res.data.data;
      if (Array.isArray(data)) {
        setComments(data);
      } else if (Array.isArray(data?.docs)) {
        setComments(data.docs); 
      } else if (Array.isArray(data?.comments)) {
        setComments(data.comments);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.log(err);
      setComments([]);
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      const res = await API.get("/v1/videos?limit=10");
      const vids = res.data.data?.videos || [];
      setRelatedVideos(vids.filter((v) => v._id !== id));
    } catch(err) {
      console.log(err);
    }
  };

  const toggleLike = async () => {
    if (!user) return alert("Login required to like videos");
    try {
      await API.patch(`/v1/likes/video/${id}`);
      setLiked(!liked);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSubscribe = async () => {
    if (!user) return alert("Login required to subscribe");
    try {
      await API.post(`/v1/subscriptions/c/${video?.owner?._id}`);
      setSubscribed(!subscribed);
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setCommentLoading(true);
    try {
      const res = await API.post(`/v1/comments/video/${id}`, {
        content: newComment,
      });
      setComments((prev) => [
        res.data.data,
        ...(Array.isArray(prev) ? prev : []),
      ]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  const fetchUserPlaylists = async () => {
    try {
      if(!user?._id) return;
      const res = await API.get(`/v1/playlist/user/${user._id}`);
      setPlaylists(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveToPlaylist = async (playlistId) => {
    try {
      await API.patch(`/v1/playlist/add/${id}/${playlistId}`);
      alert("Added to playlist!");
      setPlaylistModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error adding to playlist");
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim() || !newPlaylistDesc.trim()) return alert("Name and description required");
    setCreatingPlaylist(true);
    try {
      const res = await API.post("/v1/playlist", {
        name: newPlaylistName,
        description: newPlaylistDesc
      });
      const createdPlaylist = res.data.data;
      setPlaylists(prev => [createdPlaylist, ...prev]);
      setNewPlaylistName("");
      setNewPlaylistDesc("");
      handleSaveToPlaylist(createdPlaylist._id);
    } catch (err) {
      alert(err.response?.data?.message || "Error creating playlist");
    } finally {
      setCreatingPlaylist(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-[80vh]">
        <FiLoader className="text-4xl text-red-500 animate-spin" />
      </div>
    );
  }

  if (!video) return <div className="text-center mt-20 text-xl font-medium">Video not found.</div>;

  return (
    <div className="max-w-400 mx-auto px-4 lg:px-8 py-6 flex flex-col lg:flex-row gap-8">
      
      {/* LEFT SIDE: PLAYER & METADATA */}
      <div className="flex-1 max-w-275">
        {/* VIDEO PLAYER */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video shadow-xl ring-1 ring-gray-200/50">
          <video
            ref={videoRef}
            src={video.videoFile}
            controls
            autoPlay
            className="w-full h-full outline-none"
            poster={video.thumbnail}
          />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold mt-5 text-gray-900 leading-tight">
          {video.title}
        </h1>

        {/* CHANNEL & ACTIONS BAR */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-4 pb-4 border-b border-gray-200 gap-4">
          
          <div className="flex items-center gap-4">
            <img 
              src={video.owner?.avatar || `https://ui-avatars.com/api/?name=${video.owner?.fullName || 'User'}`} 
              className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-90" 
              onClick={() => navigate(`/c/${video.owner?.username}`)}
            />
            <div className="cursor-pointer" onClick={() => navigate(`/c/${video.owner?.username}`)}>
              <p className="font-bold text-gray-900 text-[15px]">{video.owner?.fullName || video.owner?.username}</p>
              <p className="text-xs text-gray-500 font-medium">{(video.owner?.subscribersCount || 0).toLocaleString()} subscribers</p>
            </div>

            <button
              onClick={toggleSubscribe}
              className={`ml-4 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                subscribed 
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                  : "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20"
              }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-full divide-x divide-gray-300">
              <button
                onClick={toggleLike}
                className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-200 rounded-l-full transition-colors font-medium text-sm"
              >
                <FiThumbsUp className={liked ? "fill-gray-900 text-gray-900" : "text-gray-900"} /> 
                {likesCount}
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-200 rounded-r-full transition-colors text-gray-900">
                <FiThumbsDown />
              </button>
            </div>

            <button className="flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-full hover:bg-gray-200 transition-colors font-medium text-sm">
              <FiShare2 /> Share
            </button>
            <div className="relative">
              <button 
                onClick={() => {
                  if (!user) return alert("Login required");
                  setPlaylistModalOpen(!playlistModalOpen);
                  if (!playlists.length) fetchUserPlaylists();
                }}
                className="flex items-center justify-center bg-gray-100 w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
                title="Save to Playlist"
              >
                <FiFolderPlus />
              </button>
              
              {playlistModalOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-50 flex justify-between items-center bg-gray-50">
                    <span className="font-bold text-sm">Save to playlist</span>
                    <button onClick={() => setPlaylistModalOpen(false)}><FiX /></button>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {playlists.length > 0 ? (
                      playlists.map(p => (
                        <button 
                          key={p._id}
                          onClick={() => handleSaveToPlaylist(p._id)}
                          className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm font-medium transition-colors border-b border-gray-50 last:border-0"
                        >
                          {p.name}
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-gray-500 text-center">No playlists found.</div>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-600 mb-2">Create New Playlist</p>
                    <input 
                      type="text" 
                      placeholder="Playlist Name" 
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="w-full text-sm mb-2 px-2 py-1.5 border border-gray-200 rounded outline-none focus:border-red-500"
                    />
                    <input 
                      type="text" 
                      placeholder="Description" 
                      value={newPlaylistDesc}
                      onChange={(e) => setNewPlaylistDesc(e.target.value)}
                      className="w-full text-sm mb-2 px-2 py-1.5 border border-gray-200 rounded outline-none focus:border-red-500"
                    />
                    <button 
                      onClick={handleCreatePlaylist}
                      disabled={creatingPlaylist}
                      className="w-full bg-red-600 text-white text-sm font-bold py-1.5 rounded hover:bg-red-700 disabled:opacity-70"
                    >
                      {creatingPlaylist ? "Creating..." : "Create & Save"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DESCRIPTION BOX */}
        <div className="bg-gray-50 hover:bg-gray-100 transition-colors p-4 rounded-xl mt-6 cursor-pointer text-sm mb-8 relative group">
          <p className="font-bold text-gray-900 mb-1">
            {video.views?.toLocaleString() || 0} views • {new Date(video.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed line-clamp-3 group-hover:line-clamp-none">
            {video.description || "No description provided."}
          </p>
        </div>

        {/* COMMENTS SECTION */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900">
            {comments.length} Comments
          </h2>

          <div className="flex gap-4 mb-8">
            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}`} 
              className="w-10 h-10 rounded-full" 
            />
            <form onSubmit={addComment} className="flex-1 relative">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a cinematic comment..."
                className="w-full bg-transparent border-b-2 border-gray-200 focus:border-red-600 outline-none pb-2 text-sm transition-colors pr-10"
              />
              <button 
                type="submit" 
                disabled={!newComment.trim() || commentLoading}
                className="absolute right-0 top-0 text-red-600 disabled:text-gray-300 p-2"
              >
                {commentLoading ? <FiLoader className="animate-spin" /> : <FiSend />}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            {comments.map((c) => (
              <div key={c._id} className="flex gap-4">
                <img src={c.owner?.avatar || `https://ui-avatars.com/api/?name=${c.owner?.username || 'User'}`} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-sm text-gray-900">
                      @{c.owner?.username || "user"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 leading-snug wrap-break-word">
                    {c.content}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="text-gray-500 hover:text-gray-900">
                      <FiThumbsUp size={14} />
                    </button>
                    <button className="text-gray-500 hover:text-gray-900">
                      <FiThumbsDown size={14} />
                    </button>
                    <button className="text-xs font-medium text-gray-600 hover:text-gray-900">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: UP NEXT */}
      <div className="w-full lg:w-100 shrink-0">
        <h3 className="font-bold text-lg mb-4 text-gray-900">Up Next</h3>

        <div className="flex flex-col gap-3">
          {relatedVideos.map((v) => (
            <div
              key={v._id}
              onClick={() => navigate(`/video/${v._id}`)}
              className="flex gap-3 cursor-pointer group"
            >
              <div className="relative w-40 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-200">
                <img
                  src={v.thumbnail}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-white text-[10px] font-medium">
                  {Math.floor((v.duration || 0) / 60)}:{Math.floor((v.duration || 0) % 60).toString().padStart(2, '0')}
                </div>
              </div>

              <div className="flex flex-col flex-1 py-1">
                <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                  {v.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{v.owner?.fullName || "User"}</p>
                <p className="text-xs text-gray-500">
                  {v.views} views • {new Date(v.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoPage;
