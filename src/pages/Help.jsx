import { FiHelpCircle, FiMail, FiMessageCircle, FiBookOpen } from "react-icons/fi";

function Help() {
  const faqs = [
    {
      q: "How do I upload a cinematic video?",
      a: "Click on the video icon in the top navigation bar. Make sure your video is high quality and you have an eye-catching thumbnail prepared.",
    },
    {
      q: "Why was my video taken down?",
      a: "Videos may be removed if they violate our community guidelines, including unauthorized copyrighted content or inappropriate material.",
    },
    {
      q: "How does the AI Assistant work?",
      a: "CineMind AI uses advanced language models to help you script, title, and analyze your content. It acts as your co-pilot for creativity.",
    },
    {
      q: "Can I customize my channel profile?",
      a: "Yes! Navigate to your profile or settings to change your avatar, cover image, and account details to make it truly yours.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full">
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl mx-auto flex items-center justify-center mb-6 transform -rotate-6 shadow-lg">
          <FiHelpCircle className="text-4xl rotate-6" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">How can we help?</h1>
        <p className="text-lg text-gray-500 font-medium">Search our knowledge base or get in touch with our team.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <FiBookOpen className="text-3xl text-gray-900 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 mb-2">Creator Guide</h3>
          <p className="text-sm text-gray-500">Learn the best practices for uploading and growing your audience.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <FiMessageCircle className="text-3xl text-gray-900 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 mb-2">Community Forum</h3>
          <p className="text-sm text-gray-500">Connect with other creators and discuss the latest trends.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <FiMail className="text-3xl text-gray-900 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 mb-2">Contact Support</h3>
          <p className="text-sm text-gray-500">Need direct assistance? Email our dedicated creator success team.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="group">
              <h4 className="flex items-center gap-2 font-bold text-lg text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                <span className="text-red-600 mr-2">Q:</span> {faq.q}
              </h4>
              <p className="text-gray-600 leading-relaxed pl-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Help;
