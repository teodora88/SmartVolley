
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header>
        <nav>SmartVolley</nav>
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
