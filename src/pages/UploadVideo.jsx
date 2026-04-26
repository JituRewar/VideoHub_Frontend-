import { useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud, FiImage, FiVideo, FiCheckCircle } from "react-icons/fi";

function UploadVideo() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) setVideoFile(file);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !videoFile || !thumbnail) {
      alert("Please fill all required fields (Video, Thumbnail, Title).");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);

      await API.post("/v1/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Video uploaded successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Upload failed. " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-350 mx-auto px-4 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Upload Content</h1>
        <p className="text-gray-500 font-medium mt-1">
          Share your cinematic masterpiece with the world.
        </p>
      </div>

      <form onSubmit={handleUpload} className="flex flex-col lg:flex-row gap-8 items-start">
        {/* MAIN UPLOAD SECTION */}
        <div className="flex-1 w-full space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
          
          {/* DRAG & DROP AREA */}
          <div className="relative border-2 border-dashed border-red-200 bg-red-50/30 hover:bg-red-50 transition-colors rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-70">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Upload Video"
            />
            
            {!videoFile ? (
              <>
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <FiUploadCloud className="text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Drag & drop video files</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm">
                  Your videos will be private until you publish them. MP4 or WebM formats recommended.
                </p>
                <div className="bg-red-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md shadow-red-600/20 pointer-events-none">
                  Select Files
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <FiCheckCircle className="text-4xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Video Ready!</h3>
                <p className="text-gray-600 font-medium">{videoFile.name}</p>
                <p className="text-gray-500 text-sm mt-1">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                <p className="text-red-500 text-sm mt-6 font-medium z-10 relative pointer-events-none">Click to replace video</p>
              </div>
            )}
          </div>

          <div className="space-y-5 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Video Title <span className="text-red-500">*</span></label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your video a catchy title"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers about your video..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all font-medium h-32 resize-none"
              />
            </div>
          </div>
        </div>

        {/* SIDE SETTINGS BOX */}
        <div className="w-full lg:w-95 space-y-6 shrink-0">
          
          {/* THUMBNAIL CARD */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiImage className="text-red-600 text-lg" /> Thumbnail <span className="text-red-500">*</span>
            </h3>
            
            <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                title="Upload Thumbnail"
              />
              
              {thumbnailPreview ? (
                <>
                  <img src={thumbnailPreview} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium bg-black/60 px-3 py-1 rounded-full text-sm">Change Image</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <FiImage className="text-3xl text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">Click to upload custom thumbnail</p>
                </div>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mt-3 text-center">JPG or PNG. Max size 2MB.</p>
          </div>

          {/* PUBLISH ACTIONS */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Visibility</label>
                  <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-red-500 text-sm font-medium">
                    <option>Public</option>
                    <option>Private</option>
                    <option>Unlisted</option>
                  </select>
               </div>
               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Category</label>
                  <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-red-500 text-sm font-medium">
                    <option>Cinematography</option>
                    <option>Tech Review</option>
                    <option>Vlog</option>
                    <option>Entertainment</option>
                  </select>
               </div>
             </div>

            <div className="mt-8 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <><FiVideo className="text-lg" /> Publish Video</>
                )}
              </button>
              <button
                type="button"
                className="w-full bg-gray-50 text-gray-700 border border-gray-200 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Save as Draft
              </button>
            </div>
          </div>
          
        </div>
      </form>
    </div>
  );
}

export default UploadVideo;