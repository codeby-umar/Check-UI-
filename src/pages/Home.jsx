import Hearder from "../components/Hearder";
import art from "../assets/art.svg";
import { Link } from "react-router-dom";

function Home() {
  return (
   <div className="container mx-auto min-h-[80vh] flex flex-col lg:flex-row items-center justify-between px-6 py-12 gap-10">
  <div className="flex-1 text-center lg:text-left">
    <h1 className="text-5xl md:text-5xl lg:text-8xl font-bold tracking-tight mb-6">
      <span className="text-[#B23DEB]">A </span>
      <span className="text-white">New Way </span>
      <br className="hidden md:block" />
      <span className="text-[#B23DEB]">To Learn</span>
    </h1>
    
    <p className="text-lg p-2 md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
      Check UI is the best platform to help you enhance your skills, expand
      your knowledge and prepare for technical interviews.
    </p>

    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
      <Link 
        className="px-10 py-4 bg-[#B23DEB] hover:bg-[#a034d6] transition-all duration-300 rounded-full text-xl font-medium text-white shadow-lg shadow-[#b23deb44] hover:scale-105 active:scale-95"
      >
        Create Account
      </Link>
      
      <button className="px-10 py-4 text-white hover:text-[#B23DEB] transition-colors font-medium text-xl">
        Learn More →
      </button>
    </div>
  </div>

  <div className="flex-1 w-full max-w-xl animate-float">
    <img 
      src={art} 
      alt="Suniy intelekt" 
      className="w-full h-auto object-contain drop-shadow-2xl"
    />
  </div>
</div>
  );
}

export default Home;
