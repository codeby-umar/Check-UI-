import Navbar from "../components/Navbar";
import Navbars from "../components/Navbars";

function Layouts({ children }) {
  return (
    <div className="flex h-full">
      <Navbar />
      <div className="h-full w-full">
        <Navbars />
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Layouts;
