import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { IoClose, IoCloudUpload } from "react-icons/io5";

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] p-10 relative animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black">
          <IoClose size={24} />
        </button>

        <h2 className="text-2xl font-black text-[#B23DEB] mb-8 text-center">Add New Test</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-2 uppercase">Image URL (Icon)</label>
            <input 
              required
              type="text" 
              placeholder="https://image-link.com/logo.png"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#B23DEB]"
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-2 uppercase">Test Title</label>
            <input 
              required
              type="text" 
              placeholder="Masalan: TCS Quiz Competition"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#B23DEB]"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-2 uppercase">Subject</label>
            <select 
              className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#B23DEB] appearance-none"
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            >
              <option value="English">English</option>
              <option value="Matematika">Matematika</option>
              <option value="Rus tili">Rus tili</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-2 uppercase">Description</label>
            <textarea 
              rows="3"
              placeholder="Qisqacha ma'lumot..."
              className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#B23DEB] resize-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full py-5 bg-[#B23DEB] text-white rounded-3xl font-black text-lg shadow-xl shadow-purple-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Test"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTestModal;