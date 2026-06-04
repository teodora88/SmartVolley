import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import Login from "./pages/Login";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import EditUser from "./pages/EditUser";
import Profile from "./pages/Profile";
import Locations from "./pages/Locations";
import Activities from "./pages/Activities";
import Groups from "./pages/Groups";
import CreateGroup from "./pages/CreateGroup";
import EditGroup from "./pages/EditGroup";
import Members from "./pages/Members";
import CreateLocation from "./pages/CreateLocation";
import EditLocation from "./pages/EditLocation";

export default function App() {
  const { user } = useContext(AppContext);

  const isAdmin = user?.role_as === "admin";
  const isCoach = user?.role_as === "coach";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            user ? (
              isAdmin ? (
                <Navigate to="/users" />
              ) : (
                <Navigate to="/activities" />
              )
            ) : (
              <Login />
            )
          }
        />

        <Route element={<Layout />}>
          {/* Zajednicke rute */}
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />

          {/* Admin rute */}
          <Route
            path="/users"
            element={isAdmin ? <Users /> : <Navigate to="/login" />}
          />
          <Route
            path="/users/create"
            element={isAdmin ? <CreateUser /> : <Navigate to="/login" />}
          />
          <Route
            path="/users/edit/:id"
            element={user ? <EditUser /> : <Navigate to="/login" />}
          />

          {/* Trener rute */}
          <Route
            path="/activities"
            element={isCoach ? <Activities /> : <Navigate to="/login" />}
          />
          <Route
            path="/groups"
            element={isCoach ? <Groups /> : <Navigate to="/login" />}
          />
          <Route
            path="/groups/create"
            element={isCoach ? <CreateGroup /> : <Navigate to="/login" />}
          />
          <Route
            path="/groups/edit/:id"
            element={isCoach ? <EditGroup /> : <Navigate to="/login" />}
          />
          <Route
            path="/members"
            element={isCoach ? <Members /> : <Navigate to="/login" />}
          />
          <Route
            path="/locations"
            element={isCoach ? <Locations /> : <Navigate to="/login" />}
          />
          <Route
            path="/locations/create"
            element={isCoach ? <CreateLocation /> : <Navigate to="/login" />}
          />
          <Route
            path="/locations/edit/:id"
            element={isCoach ? <EditLocation /> : <Navigate to="/login" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
