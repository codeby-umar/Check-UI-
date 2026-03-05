import Hearder from "../components/Hearder";
import Footer from "../components/Footer"

function Layout({ children }) {
  return (
    <div>
       <Hearder/>
      {children}
      <Footer/>
    </div>
  );
}

export default Layout;
