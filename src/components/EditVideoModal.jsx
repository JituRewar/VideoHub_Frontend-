import { useState } from "react"
import { API } from "../api/axios"

function EditVideoModal({ video, onClose, onUpdate }) {
  const [title, setTitle] = useState(video.title)
  const [description, setDescription] = useState(video.description || "")
  const [thumbnail, setThumbnail] = useState(null)
  const [preview, setPreview] = useState(video.thumbnail)

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(file)
      setPreview(URL.createObjectURL(file)) // preview
    }
  }

  const handleUpdate = async () => {
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)

      if (thumbnail) {
        formData.append("thumbnail", thumbnail)
      }

      const res = await API.patch(
        `/v1/videos/${video._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      onUpdate(res.data.data)
      onClose()
    } catch (err) {
      console.error("Update failed", err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-96 space-y-4">
        <h2 className="text-lg font-semibold">Edit Video</h2>

        {/* TITLE */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter video title"
        />

        {/* DESCRIPTION */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter video description"
          rows={3}
        />

        {/* THUMBNAIL PREVIEW */}
        {preview && (
          <img
            src={preview}
            alt="thumbnail preview"
            className="w-full h-40 object-cover rounded"
          />
        )}

        {/* FILE INPUT */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Thumbnail
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-500">
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditVideoModal