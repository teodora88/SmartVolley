import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Layout() {
  const { user, token, setUser, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  async function handleLogout(e) {
    e.preventDefault();

    const res = await fetch("/api/logout", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setUser(null);
      setToken(null);
      localStorage.clear();
      navigate("/login");
    }
  }

  return (
    <div className="app-wrapper">
      <header>
        <nav>
          <p className="nav-logo">SmartVolley</p>
          <div className="nav-right">
            {user && <p>{user.name} {user.last_name}</p>}
          </div>
        </nav>
      </header>
      <div className="content-wrapper">
        <aside className="sidebar">
          <div className="sidebar-menu">
            <p className="sidebar-role">{user?.role_as === "admin" ? "Admin" : user?.role_as === "coach" ? "Trener" : "Roditelj"}</p>
            <ul>
              {user?.role_as === "admin" && (
                <>
                  <li><Link to="/users">Korisnici</Link></li>
                  <li><Link to="/profile">Moj profil</Link></li>
                </>
              )}
            </ul>
          </div>
          <button className="logout-button" onClick={handleLogout}>Odjavi se</button>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
