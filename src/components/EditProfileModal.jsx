import { useState } from "react";
import { API } from "../api/axios";
import { FiX, FiCamera } from "react-icons/fi";

function EditProfileModal({ user, onClose, onUpdate }) {
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [coverPreview, setCoverPreview] = useState(user?.coverImage || "");

  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Update text fields
      await API.patch("/v1/users/update-account", {
        fullName,
        email,
        // if bio is supported by backend
      });

      // Update avatar
      if (avatar) {
        const formData = new FormData();
        formData.append("avatar", avatar);
        await API.patch("/v1/users/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Update cover image
      if (coverImage) {
        const formData = new FormData();
        formData.append("coverImage", coverImage);
        await API.patch("/v1/users/cover-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Update failed. " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center overflow-y-auto px-4 z-9999">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        
        {/* HEADER */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-8 py-5 border-b border-gray-100 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Profile Settings</h2>
            <p className="text-sm text-gray-500 font-medium">Customize how you appear to the community</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900">
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* COVER IMAGE */}
        <div className="relative w-full h-48 bg-linear-to-tr from-gray-800 to-gray-900 group">
          <img
            src={coverPreview || "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80"}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
            alt="Cover Preview"
          />
          <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white font-medium">
            <FiCamera className="text-3xl mb-1 mr-2" /> Change Cover
            <input type="file" className="hidden" accept="image/*" onChange={handleCoverChange} />
          </label>
        </div>

        {/* PROFILE INFO */}
        <div className="px-8 pb-8">
          
          {/* AVATAR UPLOAD */}
          <div className="flex gap-6 items-end -mt-16 mb-8 relative z-10">
            <div className="relative group rounded-full border-4 border-white shadow-lg bg-white inline-block">
              <img
                src={avatarPreview || `https://ui-avatars.com/api/?name=${fullName || 'User'}&size=256`}
                className="w-32 h-32 rounded-full object-cover group-hover:opacity-60 transition-opacity"
                alt="Avatar Settings"
              />
              <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer rounded-full bg-black/40 text-white transition-opacity">
                <FiCamera className="text-2xl" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>
            <div className="pb-2">
              <h3 className="font-bold text-xl text-gray-900 drop-shadow-md">{fullName || 'New User'}</h3>
              <p className="text-sm text-gray-600 font-medium">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT COL: BASIC INFO */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all font-medium text-sm"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  title="Email cannot be changed here"
                  className="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 outline-none font-medium text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all font-medium text-sm min-h-25 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* RIGHT COL: PREFERENCES */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preferences</label>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div>
                  <p className="font-bold text-sm text-gray-900 mb-0.5">Private Profile</p>
                  <p className="text-xs text-gray-500">Only approved followers can see your videos.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div>
                  <p className="font-bold text-sm text-gray-900 mb-0.5">Allow Duets</p>
                  <p className="text-xs text-gray-500">Let other creators remix your content.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              disabled={loading}
            >
              Discard Changes
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-2.5 text-sm font-bold bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all disabled:opacity-70 flex items-center justify-center min-w-35"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;