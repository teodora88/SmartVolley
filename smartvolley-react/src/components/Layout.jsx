import { Outlet, useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Layout() {
  const { token, setUser, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  async function handleLogout(e) {
    e.preventDefault();

    const res = await fetch("/api/logout", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      setUser(null);
      setToken(null);
      localStorage.clear();
      navigate("/login");
    }
  }

  return (
    <>
      <header>
        <nav>
          <div>
            <p>SmartVolley</p>
          </div>
          <div className="nav-right">
            <p>Dobrodosli!</p>
            <button onClick={handleLogout}>Odjavi se</button>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>SmartVolley © 2025</p>
      </footer>
    </>
  );
}
