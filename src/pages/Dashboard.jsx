import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FiVideo, FiEye, FiUsers, FiThumbsUp, FiTrendingUp } from "react-icons/fi";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, videosRes] = await Promise.all([
          API.get("/v1/dashboard/stats"),
          API.get("/v1/dashboard/videos"),
        ]);

        const vids = videosRes.data.data;
        setStats(statsRes.data.data);
        setVideos(vids);
        generateAnalytics(vids);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const generateAnalytics = (videos) => {
    const daysMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
      daysMap[key] = { views: 0, likes: 0 };
    }

    videos.forEach((video) => {
      const day = new Date(video.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
      if (daysMap[day]) {
        daysMap[day].views += video.views || 0;
        daysMap[day].likes += video.likes || 0;
      }
    });

    const formatted = Object.keys(daysMap).map((day) => ({
      date: day,
      ...daysMap[day]
    }));

    setAnalytics(formatted);
  };

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-350 mx-auto px-4 lg:px-8 py-8 w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Channel Studio</h1>
          <p className="text-gray-500 font-medium mt-1">Detailed performance of your creative journey.</p>
        </div>
        <button 
          onClick={() => navigate("/upload")}
          className="bg-red-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md shadow-red-600/20 hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <FiVideo /> New Upload
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Views" value={stats.totalViews} icon={<FiEye className="text-blue-500" />} trend="+12.5%" />
        <StatCard title="Subscribers" value={stats.totalSubscribers} icon={<FiUsers className="text-indigo-500" />} trend="+4.1%" />
        <StatCard title="Total Likes" value={stats.totalLikes} icon={<FiThumbsUp className="text-green-500" />} trend="+18.2%" />
        <StatCard title="Total Videos" value={stats.totalVideos} icon={<FiVideo className="text-red-500" />} trend="2 New" isNeutral />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* GRAPH */}
        <div className="xl:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FiTrendingUp className="text-red-600" /> Performance Trend (Last 7 Days)
            </h2>
          </div>

          <div className="h-75 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#dc2626" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT UPLOADS */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Uploads</h2>
            <button className="text-sm text-red-600 font-bold hover:underline" onClick={() => navigate('/playlist')}>View All</button>
          </div>

          <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <FiVideo className="text-4xl mb-2 text-gray-300" />
                <p className="text-sm font-medium text-center">No uploads yet.<br/>Time to share your first video!</p>
              </div>
            ) : (
              videos.slice(0, 5).map((video) => (
                <div 
                  key={video._id} 
                  className="flex gap-4 items-center group cursor-pointer"
                  onClick={() => navigate(`/video/${video._id}`)}
                >
                  <div className="relative w-32 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={video.thumbnail}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={video.title}
                    />
                  </div>

                  <div className="flex flex-col flex-1 overflow-hidden">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug truncate group-hover:text-red-600 transition-colors title-clamp">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1"><FiEye /> {video.views?.toLocaleString() || 0}</span>
                      <span>•</span>
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, isNeutral }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl border border-gray-100">
          {icon}
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          isNeutral ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
        }`}>
          {trend}
        </div>
      </div>
      <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">{title}</p>
      <h2 className="text-3xl font-black text-gray-900">{(value || 0).toLocaleString()}</h2>
    </div>
  );
}

export default Dashboard;