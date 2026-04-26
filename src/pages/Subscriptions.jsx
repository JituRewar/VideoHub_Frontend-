import { useEffect, useState } from "react";
import { API } from "../api/axios";

function Subscriptions() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      const res = await API.get(`/v1/subscriptions/c/${channelId}`)
      setChannels(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Subscriptions</h1>

      {channels.length === 0 ? (
        <p>No subscriptions yet</p>
      ) : (
        channels.map((c) => (
          <div key={c._id}>{c.username}</div>
        ))
      )}
    </div>
  );
}

export default Subscriptions;