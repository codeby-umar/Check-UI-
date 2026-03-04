import Navbar from "../components/Navbar";
import Navbars from "../components/Navbars";

function Layouts({ children }) {
  return (
    <div className="h-screen  flex">
      <Navbar />
      <div className="w-full">
        <Navbars />
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Layouts;
