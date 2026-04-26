import { useNavigate } from "react-router-dom"

function VideoCard({ video }) {
  const navigate = useNavigate()

  return (
<div
  onClick={() => navigate(`/video/${video._id}`)}
  className="cursor-pointer rounded-xl overflow-hidden 
  hover:scale-105 transition duration-300"
>
  <img
    src={video.thumbnail}
    className="w-full h-40 object-cover rounded-lg"
  />

  <div className="mt-2 flex gap-3">
    <img
      src={video.owner?.avatar}
      className="w-8 h-8 rounded-full"
    />

    <div>
      <h2 className="text-sm font-semibold line-clamp-2">
        {video.title}
      </h2>

      <p className="text-xs text-gray-500">
        {video.owner?.username}
      </p>

      <p className="text-xs text-gray-500">
        {video.views} views
      </p>
    </div>
  </div>
</div>
  )
}

export default VideoCard