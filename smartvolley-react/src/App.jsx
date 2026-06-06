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
import CreateActivity from "./pages/CreateActivity";
import EditActivity from "./pages/EditActivity";
import ActivityAttendance from "./pages/ActivityAttendance";
import Attendances from "./pages/Attendances";
import Groups from "./pages/Groups";
import CreateGroup from "./pages/CreateGroup";
import EditGroup from "./pages/EditGroup";
import Members from "./pages/Members";
import CreateMember from "./pages/CreateMember";
import MemberDetails from "./pages/MemberDetails";
import CreateLocation from "./pages/CreateLocation";
import EditLocation from "./pages/EditLocation";
import Payments from "./pages/Payments";

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
            path="/activities/create"
            element={isCoach ? <CreateActivity /> : <Navigate to="/login" />}
          />
          <Route
            path="/activities/edit/:id"
            element={isCoach ? <EditActivity /> : <Navigate to="/login" />}
          />
          <Route
            path="/activities/:id/attendance"
            element={
              isCoach ? <ActivityAttendance /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/attendances"
            element={isCoach ? <Attendances /> : <Navigate to="/login" />}
          />
          <Route
            path="/payments"
            element={isCoach ? <Payments /> : <Navigate to="/login" />}
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
            path="/members/create"
            element={isCoach ? <CreateMember /> : <Navigate to="/login" />}
          />
          <Route
            path="/members/:id"
            element={isCoach ? <MemberDetails /> : <Navigate to="/login" />}
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
