import React, { useState, useEffect, useRef } from "react";
import { API } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { FiCpu, FiSend, FiLoader, FiUser, FiBarChart2, FiEdit3, FiPaperclip, FiMic } from "react-icons/fi";

const AIAssistant = () => {
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;

    const userPrompt = text.trim();
    if(input === text) setInput("");

    setMessages(prev => [...prev, { role: "user", content: userPrompt }]);
    setLoading(true);

    try {
      // Changed to the exact route stated in the prompt rules
      const response = await API.post("/v1/ai/ask", {
        prompt: userPrompt,
        chatId: chatId,
      });

      const result = response.data?.data;

      if (result && result.aiResponse) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.aiResponse },
        ]);
        if (result.chat && result.chat._id) {
          setChatId(result.chat._id);
        }
      }
    } catch (error) {
      console.error("AI Error:", error.response?.data?.message || error.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I encountered an error connecting to my neural network. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Analyze my last video",
    "Generate 5 title ideas",
    "Script a 15s intro hook",
    "Content Strategy"
  ];

  return (
    <div className="max-w-375 mx-auto w-full h-[calc(100vh-100px)] flex bg-white rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100 mt-4">
      
      {/* LEFT SIDEBAR: PREVIOUS CHATS (Static) */}
      <div className="hidden lg:flex flex-col w-87.5 bg-gray-50 border-r border-gray-100 p-6 shrink-0">
        <h3 className="text-xs font-bold text-gray-500 tracking-wider mb-6">PREVIOUS CHATS</h3>
        
        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <FiBarChart2 className="text-red-600" />
              <span className="text-[10px] font-bold text-gray-400">2H AGO</span>
            </div>
            <p className="font-bold text-gray-900 text-sm leading-snug">Performance Audit: Summer Travel Vlog Series</p>
          </div>

          <div className="p-4 rounded-2xl border border-transparent hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="flex justify-between items-start mb-2">
              <FiEdit3 className="text-gray-500" />
              <span className="text-[10px] font-bold text-gray-400">YESTERDAY</span>
            </div>
            <p className="font-semibold text-gray-700 text-sm leading-snug">Creative Hook Ideas for Tech Reviews</p>
          </div>

          <div className="p-4 rounded-2xl border border-transparent hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="flex justify-between items-start mb-2">
              <FiUser className="text-gray-500" />
              <span className="text-[10px] font-bold text-gray-400">JUL 12</span>
            </div>
            <p className="font-semibold text-gray-700 text-sm leading-snug">Title Generation for "The Future of AI"</p>
          </div>

        </div>

        {/* AI IMPACT WIDGET */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mt-6">
          <p className="text-[10px] font-bold text-red-600 tracking-wider mb-2">AI IMPACT</p>
          <div className="flex items-end gap-2 mb-2">
             <h4 className="text-3xl font-black text-gray-900">14.2%</h4>
             <span className="text-sm font-bold text-green-500 mb-1">+2.1%</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-medium mt-1">Average CTR increase after title optimization</p>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col relative px-4 lg:px-12 py-8 bg-white">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20 transform -rotate-6">
            <FiCpu size={24} className="rotate-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">CineMind AI</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <p className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">Active Intelligence</p>
            </div>
          </div>
        </div>

        {/* CHAT MESSAGES */}
        <div className="flex-1 overflow-y-auto mb-6 pr-4 space-y-8 custom-scrollbar">
          
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
               <div className="max-w-xl text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCpu className="text-4xl text-red-600/40" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">How can I help you create today?</h3>
                  <p className="text-gray-500 font-medium">I'm CineMind, your intelligent co-pilot. I can analyze your metrics, generate compelling titles, write scripts, or give feedback on your ideas.</p>
               </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {msg.role === "assistant" ? (
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <FiCpu className="text-gray-600" />
                </div>
              ) : null}

              <div className={`max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-gray-100/80 px-6 py-4 rounded-3xl rounded-tr-sm text-gray-800 font-medium mt-6"
                    : "text-gray-700 leading-relaxed pt-2 font-medium"
                }`}
              >
                {msg.role === "assistant" && i === 0 && messages.length > 1 && msg.content.includes("Hello") ? (
                   // Special formatting for the first AI message to look like demo
                   <div>
                     <p>Hello, <span className="font-bold text-gray-900">{user?.user?.fullName?.split(" ")[0] || "Creator"}</span>. I've analyzed your latest upload. Your audience engagement peaked at the 4-minute mark.</p>
                     <p className="mt-2 text-gray-900">{msg.content}</p>
                   </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n(.*)/g, '<p class="mt-4">$1</p>') }} />
                )}
              </div>
            </div>
          ))}

          {loading && (
             <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <FiCpu className="text-gray-600 animate-pulse" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></span>
                </div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* BOTTOM INPUT AREA */}
        <div className="mt-auto">
          {/* SUGGESTIONS PILLS */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {suggestions.map((s, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(s)}
                  className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-bold rounded-full transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* INPUT FIELD */}
          <div className="relative flex items-center bg-gray-50 rounded-3xl p-2 border border-gray-200 focus-within:border-red-200 focus-within:ring-4 ring-red-50 transition-all">
            <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
              <FiPaperclip size={20} />
            </button>
            <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
              <FiMic size={20} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-transparent px-2 py-3 outline-none text-gray-800 font-medium placeholder-gray-400"
              placeholder="Message CineMind..."
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className={`p-3 rounded-2xl mx-1 transition-colors ${
                loading || !input.trim()
                  ? "bg-transparent text-gray-300"
                  : "bg-red-600 text-white shadow-md shadow-red-600/20"
              }`}
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiSend />}
            </button>
          </div>
          
          <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">
            CineMind AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
