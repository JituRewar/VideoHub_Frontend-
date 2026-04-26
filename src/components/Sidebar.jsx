import { Link, useLocation } from "react-router-dom";
import { 
  FiHome, FiTrendingUp, FiYoutube, 
  FiFolder, FiClock, FiSettings, 
  FiHelpCircle, FiCpu, FiUsers, FiLayout
} from "react-icons/fi";

function Sidebar({ className = "" }) {
  const location = useLocation();

  const links = [
    { name: "Home", path: "/", icon: <FiHome className="text-xl" /> },
    { name: "Dashboard", path: "/dashboard", icon: <FiLayout className="text-xl" /> },
    { name: "AI Assistant", path: "/ai-assistant", icon: <FiCpu className="text-xl" /> },
    { name: "Community", path: "/community", icon: <FiUsers className="text-xl" /> },
    { name: "Trending", path: "/trending", icon: <FiTrendingUp className="text-xl" /> },
    { name: "Library", path: "/playlist", icon: <FiFolder className="text-xl" /> },
    { name: "History", path: "/history", icon: <FiClock className="text-xl" /> },
  ];

  return (
    <div className={`bg-white shadow-[1px_0_10px_rgba(0,0,0,0.02)] flex flex-col justify-between py-6 px-4 z-10 ${className}`}>
      <div>
        <div className="space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? "text-red-600 bg-red-50" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-y-1 mb-8">
        <hr className="my-4 border-gray-100" />
        <Link
          to="/settings"
          className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all font-medium"
        >
          <FiSettings className="text-xl" />
          <span>Settings</span>
        </Link>
        <Link
          to="/help"
          className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all font-medium"
        >
          <FiHelpCircle className="text-xl" />
          <span>Help</span>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
