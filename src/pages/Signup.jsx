import { useState } from "react";
import { API } from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { FiLoader, FiCamera, FiImage } from "react-icons/fi";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if(file){
       setAvatar(file);
       setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if(file){
       setCoverImage(file);
       setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!avatar || !coverImage) {
      return setError("Avatar and Cover Image are required");
    }

    try {
      setLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatar", avatar);
      formData.append("coverImage", coverImage);

      await API.post("/v1/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 py-12">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 w-full max-w-xl">
        
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black italic tracking-tighter text-red-600 inline-block mb-2">
            VideoHub
          </Link>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
            Join the Community
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium p-3 rounded-lg mb-6 flex items-start gap-2">
            <span className="mt-0.5">⚠️</span> 
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name <span className="text-red-500">*</span></label>
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-gray-900" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username <span className="text-red-500">*</span></label>
              <input required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-gray-900" placeholder="johndoe123" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email <span className="text-red-500">*</span></label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-gray-900" placeholder="name@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password <span className="text-red-500">*</span></label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-gray-900" placeholder="••••••••" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            
            <div className="relative group cursor-pointer">
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Avatar <span className="text-red-500">*</span></label>
               <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-red-200 rounded-xl bg-red-50/50 hover:bg-red-50 transition-colors cursor-pointer overflow-hidden">
                 {avatarPreview ? (
                   <img src={avatarPreview} className="w-16 h-16 rounded-full object-cover" />
                 ) : (
                   <div className="flex flex-col items-center text-red-500">
                     <FiCamera className="text-xl mb-1" />
                     <span className="text-xs font-bold">Upload Avatar</span>
                   </div>
                 )}
                 <input type="file" required accept="image/*" className="hidden" onChange={handleAvatarChange} />
               </label>
            </div>

            <div className="relative group cursor-pointer">
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cover Image <span className="text-red-500">*</span></label>
               <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-red-200 rounded-xl bg-red-50/50 hover:bg-red-50 transition-colors cursor-pointer overflow-hidden">
                 {coverPreview ? (
                   <img src={coverPreview} className="w-full h-full object-cover" />
                 ) : (
                   <div className="flex flex-col items-center text-red-500">
                     <FiImage className="text-xl mb-1" />
                     <span className="text-xs font-bold">Upload Cover</span>
                   </div>
                 )}
                 <input type="file" required accept="image/*" className="hidden" onChange={handleCoverChange} />
               </label>
            </div>

          </div>

          <button 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-600/30 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center mt-4"
          >
            {loading ? <FiLoader className="animate-spin text-xl" /> : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;