import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { 
  IoClose, 
  IoCloudUpload, 
  IoLinkOutline, 
  IoTextOutline, 
  IoShapesOutline, 
  IoDocumentTextOutline,
  IoRocketSharp
} from "react-icons/io5";

const AddTestModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "English",
    description: "",
    imageUrl: "" 
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "tests"), {
        ...formData,
        createdAt: new Date(),
      });
      onClose();
      setFormData({ title: "", subject: "English", description: "", imageUrl: "" });
    } catch (err) {
      alert("Xatolik: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-center z-200 p-6 overflow-y-auto custom-scrollbar">
      
      <div className="bg-[#111111] w-full max-w-lg rounded-[3.5rem] p-8 md:p-12 relative border border-white/5 shadow-[0_0_100px_rgba(178,61,235,0.15)] animate-in fade-in zoom-in duration-500">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#B23DEB] blur-[100px] opacity-20 pointer-events-none"></div>

        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-gray-500 hover:text-[#B23DEB] hover:rotate-90 transition-all duration-300"
        >
          <IoClose size={32} />
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#B23DEB]/10 rounded-4xl flex items-center justify-center mx-auto mb-6 border border-[#B23DEB]/20">
            <IoCloudUpload size={35} className="text-[#B23DEB] animate-bounce" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            New <span className="text-[#B23DEB] not-italic">Test</span>
          </h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Deploying Knowledge Protocol</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          <div className="space-y-3 group">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-4 flex items-center gap-2 group-focus-within:text-[#B23DEB] transition-colors">
              <IoLinkOutline size={14}/> Cover Image URL
            </label>
            <input 
              required
              type="text" 
              placeholder="https://image-link.com/cover.png"
              className="w-full px-8 py-5 bg-white/[0.03] border border-white/5 rounded-[2rem] outline-none text-white font-bold focus:border-[#B23DEB]/50 focus:bg-white/[0.05] transition-all placeholder:text-gray-800"
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            />
          </div>

          {/* Title Input */}
          <div className="space-y-3 group">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-4 flex items-center gap-2 group-focus-within:text-[#B23DEB] transition-colors">
              <IoTextOutline size={14}/> Test Title
            </label>
            <input 
              required
              type="text" 
              placeholder="Masalan: JavaScript Masterclass"
              className="w-full px-8 py-5 bg-white/[0.03] border border-white/5 rounded-[2rem] outline-none text-white font-bold focus:border-[#B23DEB]/50 focus:bg-white/[0.05] transition-all placeholder:text-gray-800"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject Select */}
            <div className="space-y-3 group">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-4 flex items-center gap-2 group-focus-within:text-[#B23DEB] transition-colors">
                <IoShapesOutline size={14}/> Subject
              </label>
              <div className="relative">
                <select 
                  className="w-full px-8 py-5 bg-white/[0.03] border border-white/5 rounded-[2rem] outline-none text-white font-bold focus:border-[#B23DEB]/50 transition-all appearance-none cursor-pointer"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  <option value="English" className="bg-[#111]">English</option>
                  <option value="Matematika" className="bg-[#111]">Matematika</option>
                  <option value="Programming" className="bg-[#111]">Programming</option>
                  <option value="Rus tili" className="bg-[#111]">Rus tili</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                  <ChevronDownIcon size={18} />
                </div>
              </div>
            </div>

            {/* Placeholder for symmetry or extra field like Time Limit */}
            <div className="space-y-3 group">
               <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-4 flex items-center gap-2 group-focus-within:text-[#B23DEB] transition-colors">
                <IoDocumentTextOutline size={14}/> Difficulty
              </label>
              <select className="w-full px-8 py-5 bg-white/[0.03] border border-white/5 rounded-[2rem] outline-none text-white font-bold focus:border-[#B23DEB]/50 transition-all appearance-none cursor-pointer">
                <option className="bg-[#111]">Intermediate</option>
                <option className="bg-[#111]">Expert</option>
                <option className="bg-[#111]">Beginner</option>
              </select>
            </div>
          </div>

          {/* Description Textarea */}
          <div className="space-y-3 group">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-4 flex items-center gap-2 group-focus-within:text-[#B23DEB] transition-colors">
              <IoDocumentTextOutline size={14}/> Description
            </label>
            <textarea 
              rows="3"
              placeholder="Kurs haqida qisqacha texnik ma'lumot..."
              className="w-full px-8 py-5 bg-white/[0.03] border border-white/5 rounded-[2.5rem] outline-none text-white font-bold focus:border-[#B23DEB]/50 focus:bg-white/[0.05] transition-all placeholder:text-gray-800 resize-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            type="submit" 
            className="w-full py-6 bg-[#B23DEB] text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(178,61,235,0.3)] hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <IoRocketSharp size={20} />
                Create Test
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Simple helper icon for the select
const ChevronDownIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default AddTestModal;