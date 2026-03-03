import Navbar from "../components/Navbar";
import Navbars from "../components/Navbars";

function Layouts({ children }) {
  return (
    <div className="h-screen gap-4 flex">
      <Navbar />
      <div className="h-screen border-[0.5px] border-gray-300"></div>
      <div className="w-full">
        <Navbars />
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Layouts;
