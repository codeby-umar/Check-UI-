import { Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Practice from "./pages/Practice";
import Dashboard from "./pages/Dashboard";
import SignUp from "./Auth/SignUp";
import Layout from "./layout/Layout";
import HomePages from "./pages/HomePages";
import Layouts from "./layout/Layouts";

export default function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="/home" element={<Layouts><HomePages /></Layouts>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Layouts><Dashboard /></Layouts>} />
        <Route
          path="/explore"
          element={
            <Layout>
              <Explore />
            </Layout>
          }
        />
        <Route
          path="/practice"
          element={
            <Layout>
              <Practice />
            </Layout>
          }
        />
        <Route path="/create" element={<SignUp />} />
      </Routes>
    </div>
  );
}
