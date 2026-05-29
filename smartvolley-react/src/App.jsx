import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Users from "./pages/Users";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

export default function App() {
  const { user } = useContext(AppContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/users" /> : <Login />}
        />

        <Route element={<Layout />}>
          <Route
            path="/users"
            element={user ? <Users /> : <Navigate to="/login" />}
          />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}
