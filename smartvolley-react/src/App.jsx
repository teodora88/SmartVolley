import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

export default function App() {
  const {user} = useContext(AppContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route element={<Layout />}>
        <Route path="/home" element={<Home />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}