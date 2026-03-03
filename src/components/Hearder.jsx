import { Link } from "react-router-dom";

function Hearder() {
  return (
    <div className="flex container px-4 p-10 items-center justify-between">
      <a className="text-[40px] text-white font-bold" href="/">
        <span className="text-[#B23DEB]">Check</span> UI
      </a>
      <ul className="flex items-center gap-20 ">
        <Link className="text-lg text-gray-600 hover:text-[#B23DEB]" to={"/"}>
          Home
        </Link>
        <Link
          className="text-lg text-gray-600 hover:text-[#B23DEB]"
          to={"/practice"}
        >
          Practice
        </Link>
        <Link
          className="text-lg text-gray-600 hover:text-[#B23DEB]"
          to={"/explore"}
        >
          Explore
        </Link>
        <Link
          className="text-lg p-4 px-10 rounded-full bg-[#B23DEB]  text-white"
          to={"/login"}
        >
          Sign In
        </Link>
      </ul>
    </div>
  );
}

export default Hearder;
