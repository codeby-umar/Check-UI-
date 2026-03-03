import Hearder from "../components/Hearder";

function Layout({ children }) {
  return (
    <div>
       <Hearder/>
      {children}
    </div>
  );
}

export default Layout;
