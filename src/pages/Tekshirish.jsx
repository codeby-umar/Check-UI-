import { useState, useRef } from "react";
import { 
  IoCameraOutline, 
  IoImageOutline, 
  IoScanOutline, 
  IoCheckmarkDoneCircle, 
  IoCloudUploadOutline,
  IoFlaskOutline,
  IoAlertCircleOutline
} from "react-icons/io5";

const Tekshirish = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const startAnalysis = () => {
    if (!selectedImage) return;
    setIsScanning(true);
    
    // Simulyatsiya: 3 soniyadan keyin natija chiqadi
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        score: "92/100",
        feedback: "Vazifa deyarli mukammal. 3-misoldagi formulada kichik xatolik bor, lekin umumiy mantiq to'g'ri.",
        status: "Accepted"
      });
    }, 3500);
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex flex-col overflow-hidden text-white font-sans">
      
      <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
        <div className="max-w-6xl mx-auto pb-20">
          
          {/* 1. Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/5 pb-10">
            <div>
              <div className="flex items-center gap-2 text-[#B23DEB] mb-4">
                <IoFlaskOutline size={18} className="animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">AI Analysis Lab v1.0</span>
              </div>
              <h1 className="text-6xl font-black italic tracking-tighter uppercase">
                Vazifa <span className="text-[#B23DEB] not-italic">Skaneri</span>
              </h1>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Tizim holati</p>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black text-emerald-500 uppercase">Ready to Scan</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* 2. Upload/Preview Area */}
            <div className="space-y-6">
              <div 
                className={`relative aspect-[4/5] rounded-[3.5rem] border-2 border-dashed transition-all duration-700 overflow-hidden flex flex-col items-center justify-center bg-[#111] ${
                  selectedImage ? 'border-[#B23DEB]/40' : 'border-white/5 hover:border-white/10'
                }`}
              >
                {selectedImage ? (
                  <>
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover opacity-60" />
                    
                    {/* Scanning Animation Layer */}
                    {isScanning && (
                      <div className="absolute inset-0 z-10">
                        <div className="w-full h-1 bg-[#B23DEB] shadow-[0_0_20px_#B23DEB] absolute top-0 animate-scan"></div>
                        <div className="w-full h-full bg-gradient-to-b from-[#B23DEB]/10 to-transparent"></div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                  </>
                ) : (
                  <div className="text-center p-10">
                    <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/5">
                      <IoCloudUploadOutline size={40} className="text-gray-700" />
                    </div>
                    <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Vazifani yuklang</p>
                    <p className="text-gray-700 text-[9px] font-bold uppercase tracking-widest max-w-[200px]">Rasmga oling yoki galereyadan tanlang (PNG, JPG)</p>
                  </div>
                )}
              </div>

              {/* Upload Buttons */}
              <div className="flex gap-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload}
                />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="flex-1 py-5 bg-[#111] border border-white/10 rounded-[2rem] font-black text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all"
                >
                  <IoImageOutline size={20} /> GALEREYA
                </button>
                <button 
                  onClick={() => fileInputRef.current.click()} // Mobile-da kamerani ochadi
                  className="flex-1 py-5 bg-[#111] border border-white/10 rounded-[2rem] font-black text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all"
                >
                  <IoCameraOutline size={20} /> KAMERA
                </button>
              </div>
            </div>

            {/* 3. Results/Analysis Area */}
            <div className="flex flex-col">
              <div className="flex-1 bg-[#111] border border-white/5 rounded-[3.5rem] p-10 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                   <IoScanOutline size={150} />
                </div>

                {!result && !isScanning && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <IoAlertCircleOutline size={50} className="text-gray-800 mb-6" />
                    <h3 className="text-gray-600 font-black uppercase text-xs tracking-widest italic">Tahlil qilish uchun rasm yuklang</h3>
                    <button 
                      onClick={startAnalysis}
                      disabled={!selectedImage}
                      className={`mt-8 px-12 py-4 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase transition-all ${
                        selectedImage 
                        ? 'bg-[#B23DEB] text-white shadow-[0_10px_30px_rgba(178,61,235,0.3)] hover:scale-105' 
                        : 'bg-white/5 text-gray-700 cursor-not-allowed'
                      }`}
                    >
                      SKANERNI BOSHLASH
                    </button>
                  </div>
                )}

                {isScanning && (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="relative w-20 h-20 mb-8">
                       <div className="absolute inset-0 border-4 border-[#B23DEB]/20 rounded-full"></div>
                       <div className="absolute inset-0 border-4 border-t-[#B23DEB] rounded-full animate-spin"></div>
                    </div>
                    <p className="text-[#B23DEB] font-black italic uppercase tracking-[0.4em] text-sm animate-pulse">Analiz qilinmoqda...</p>
                    <p className="text-gray-700 text-[9px] font-bold uppercase tracking-widest mt-4">Neyrotizim ma'lumotlarni o'qimoqda</p>
                  </div>
                )}

                {result && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="w-20 h-20 bg-[#B23DEB]/10 rounded-[1.5rem] flex items-center justify-center border border-[#B23DEB]/20">
                        <IoCheckmarkDoneCircle size={40} className="text-[#B23DEB]" />
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Samaradorlik</p>
                         <h2 className="text-5xl font-black italic text-[#B23DEB] tracking-tighter">{result.score}</h2>
                      </div>
                    </div>

                    <div className="h-[1px] w-full bg-white/5"></div>

                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">AI Feedback</p>
                      <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] italic text-gray-300 leading-relaxed text-sm">
                        "{result.feedback}"
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6">
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Status</p>
                          <p className="text-xs font-black text-emerald-500 uppercase italic tracking-tighter">Accepted</p>
                       </div>
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">XP Points</p>
                          <p className="text-xs font-black text-[#B23DEB] uppercase italic tracking-tighter">+450 EXP</p>
                       </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                className="mt-6 w-full py-5 bg-white text-black rounded-[2rem] font-black text-[10px] tracking-[0.3em] uppercase hover:bg-[#B23DEB] hover:text-white transition-all shadow-xl"
                onClick={() => {setSelectedImage(null); setResult(null);}}
              >
                YANGI SKANERLASH
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Tekshirish;