import Sidebar from "./components/Sidebar";
import LoginPage    from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage  from "./pages/StudentsPage";
import TasksPage     from "./pages/TasksPage";
import { Route , Routes } from "react-router-dom";


export default function App() {
        return (
          <div>
               <Routes>
                     <Route path="/" element={<DashboardPage/>} />
               </Routes>
          </div>
        );
    };
