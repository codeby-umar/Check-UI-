import Hearder from "../components/Hearder";
import art from "../assets/art.svg";

function Home() {
  return (
    <div>
        <div className="flex container py-12 items-center justify-center">
          <div>
            <h1 className="text-[90px] font-semibold text-[#B23DEB]">
              A <span className="text-white">New Way </span>To Learn{" "}
            </h1>
            <p className="text-[22px] mb-6 text-gray-600 leading-9 w-162">
              Check UI is the best platform to help you enhance your skills,
              expand your knowledge and prepare for technical interviews.
            </p>
            <button className="p-4 bg-[#B23DEB] px-10 rounded-full text-xl text-white">
              Create Account
            </button>
          </div>
          <div>
            <img src={art} alt="Suniy intelekt" />
          </div>
        </div>
    </div>
  );
}

export default Home;
