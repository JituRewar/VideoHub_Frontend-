import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API } from "../api/axios";
import { FiSettings, FiUser, FiLock, FiMoon, FiSun, FiLoader } from "react-icons/fi";

function Settings() {
  const { user, setUser } = useAuth();
  
  // Tab states
  const [activeTab, setActiveTab] = useState("account");
  
  // Form states
  const [accountForm, setAccountForm] = useState({
    fullName: user?.user?.fullName || "",
    email: user?.user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [loadingAction, setLoadingAction] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // type: 'success' | 'error'

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    if (accountForm.fullName === user?.user?.fullName && accountForm.email === user?.user?.email) return;

    setLoadingAction(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await API.patch("/v1/users/update-account", accountForm);
      setUser({ ...user, user: { ...user.user, fullName: accountForm.fullName, email: accountForm.email } });
      setMessage({ text: "Account details updated successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to update account", type: "error" });
    } finally {
      setLoadingAction(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!passwordForm.oldPassword || !passwordForm.newPassword) return;

    setLoadingAction(true);
    setMessage({ text: "", type: "" });
    try {
      await API.post("/v1/users/change-password", passwordForm);
      setMessage({ text: "Password changed successfully!", type: "success" });
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to change password", type: "error" });
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full flex flex-col md:flex-row gap-8">
      
      {/* SIDEBAR TABS */}
      <div className="w-full md:w-64 shrink-0">
        <h1 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
          <FiSettings className="text-gray-400" /> Settings
        </h1>
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("account")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === "account" ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FiUser /> Account
          </button>
          
          <button 
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === "security" ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FiLock /> Security
          </button>

        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 bg-white p-8 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100">
        
        {message.text && (
          <div className={`p-4 rounded-xl mb-6 font-bold text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
            {message.text}
          </div>
        )}

        {/* ACCOUNT TAB */}
        {activeTab === "account" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Account Information</h2>
            <form onSubmit={handleAccountUpdate} className="space-y-6 max-w-lg">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={accountForm.fullName}
                  onChange={(e) => setAccountForm({...accountForm, fullName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={accountForm.email}
                  onChange={(e) => setAccountForm({...accountForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loadingAction}
                  className="bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black shadow-lg shadow-black/10 transition-all flex items-center justify-center min-w-35"
                >
                  {loadingAction ? <FiLoader className="animate-spin text-xl" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Change Password</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-lg">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-500 focus:bg-white transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-500 focus:bg-white transition-all font-medium"
                  required
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loadingAction}
                  className="bg-red-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all flex items-center justify-center min-w-35"
                >
                  {loadingAction ? <FiLoader className="animate-spin text-xl" /> : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default Settings;
