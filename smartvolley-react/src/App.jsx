import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import Login from "./pages/Login";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

export default function App() {
  const { user } = useContext(AppContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/users" /> : <Login />}
        />

        <Route element={<Layout />}>
          <Route
            path="/users"
            element={user ? <Users /> : <Navigate to="/login" />}
          />
          <Route
            path="/users/create"
            element={user ? <CreateUser /> : <Navigate to="/login" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
