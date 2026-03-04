import art from "../assets/art.svg";
import { Link } from "react-router-dom";
import { FiCode, FiCpu, FiGlobe, FiLayout } from "react-icons/fi"; // Ikonkalar uchun

function Home() {
  const features = [
    {
      title: "Modern UI/UX",
      desc: "Eng so'nggi dizayn trendlari asosida qurilgan interfeys.",
      icon: <FiLayout className="text-3xl" />,
    },
    {
      title: "Smart Learning",
      desc: "Sizning darajangizga moslashuvchi o'quv algoritmlari.",
      icon: <FiCpu className="text-3xl" />,
    },
    {
      title: "Global Community",
      desc: "Butun dunyodagi dasturchilar bilan tajriba almashing.",
      icon: <FiGlobe className="text-3xl" />,
    },
    {
      title: "Clean Code",
      desc: "Sanoat standartlariga mos kod yozishni o'rganing.",
      icon: <FiCode className="text-3xl" />,
    },
  ];

  return (
    <div className="bg-[#0a0a0a] text-white selection:bg-[#B23DEB]/30">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-125 h-125 bg-[#B23DEB]/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-[#B23DEB]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-bounce-slow">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B23DEB] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#B23DEB]"></span>
              </span>
              <span className="text-sm text-gray-400 font-medium tracking-wide">v2.0 is now live</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-tight">
              A New Way <br />
              <span className="bg-gradient-to-r from-[#B23DEB] via-[#d484f5] to-[#B23DEB] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(178,61,235,0.4)]">
                To learn
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-12 font-light">
              Check UI — bu zamonaviy Oquvchilar uchun bilim va tajribani birlashtirgan platforma. Biz bilan o'zingizni sinang va mahoratingizni oshiring.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <Link to="/signup" className="group relative px-10 py-5 bg-[#B23DEB] rounded-2xl text-xl font-bold transition-all duration-300 hover:shadow-[0_0_40px_rgba(178,61,235,0.4)] hover:scale-105 active:scale-95">
                Boshlash →
              </Link>
              <button className="text-white hover:text-[#B23DEB] transition-colors font-bold text-xl">
                Loyiha haqida
              </button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl relative">
            <div className="absolute inset-0 bg-[#B23DEB]/20 rounded-full blur-[80px] scale-75 animate-pulse"></div>
            <img src={art} alt="AI Art" className="w-full h-auto animate-float relative z-10 drop-shadow-[0_10px_50px_rgba(178,61,235,0.2)]" />
          </div>
        </div>
      </section>
      <section className="py-20 border-y border-white/5 bg-white/2">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[["10k+", "Users"], ["500+", "Lessons"], ["98%", "Success"], ["24/7", "Support"]].map(([val, label]) => (
              <div key={label} className="group">
                <h4 className="text-4xl md:text-5xl font-black text-white group-hover:text-[#B23DEB] transition-colors">{val}</h4>
                <p className="text-gray-500 uppercase tracking-widest text-xs mt-2">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className=" relative">
        <div className="container mx-auto px-6 p-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-9">Nega aynan <span className="text-[#B23DEB]">Check UI?</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Platformamiz sizga eng qisqa vaqt ichida natijaga erishishingiz uchun barcha asboblarni taqdim etadi.</p>
        </div>

        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#B23DEB]/50 transition-all duration-500 group">
              <div className="w-14 h-14 rounded-2xl bg-[#B23DEB]/10 flex items-center justify-center text-[#B23DEB] mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      

    </div>
  );
}

export default Home;