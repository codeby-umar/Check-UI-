import art from "../assets/art.svg";
import { Link } from "react-router-dom";
import { FiCode, FiCpu, FiGlobe, FiLayout } from "react-icons/fi";
import StatsSection from "./StatsSection";

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
              <Link to="/login" className="group relative px-10 py-5 bg-[#B23DEB] rounded-2xl text-xl font-bold transition-all duration-300 hover:shadow-[0_0_40px_rgba(178,61,235,0.4)] hover:scale-105 active:scale-95">
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

     <StatsSection/>

     <section className="relative py-20 overflow-hidden bg-[#0a0a0a] text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#B23DEB]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#B23DEB]/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Sarlavha qismi */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Nega aynan <span className="bg-gradient-to-r from-[#B23DEB] to-[#7e22ce] bg-clip-text text-transparent">Check UI?</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Platformamiz sizga eng qisqa vaqt ichida natijaga erishishingiz uchun barcha zamonaviy asboblarni taqdim etadi.
          </p>
        </div>

        {/* Kartochkalar Grid tizimi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#B23DEB]/40 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Kartochka ichidagi maxsus gradient (Hoverda ko'rinadi) */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#B23DEB]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#B23DEB]/15 flex items-center justify-center text-[#B23DEB] mb-6 group-hover:bg-[#B23DEB] group-hover:text-white transition-all duration-500 shadow-lg shadow-[#B23DEB]/10">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors text-sm md:text-base">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
      

    </div>
  );
}

export default Home;