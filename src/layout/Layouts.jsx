import Navbar from "../components/Navbar"

function Layouts({children}) {
  return (
    <div className="h-screen flex">
         <Navbar/>
         <div className="h-screen border-[0.5px] border-gray-300"></div>
         <div className="p-5">
             {children}
         </div>
    </div>
  )
}

export default Layouts