import { Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import type { NavBar as NavBarType } from "./components/NavBar";

export default function Wrapper() {
  const auth = useAuth();
  const location = useLocation();

  const routesWithNavBar = ["/"];
  const routes: NavBarType = [
    { path: "/", name: "Homie" },
    { path: "/login", name: "Login" },
    { path: "/", name: "something" },
    { path: "/", name: "else" },
  ];

  const hasNavBar = routesWithNavBar.includes(location.pathname);

  // useEffect(() => {}, []);

  return (
    <div className={`wrapper ${hasNavBar ? "hasNavBar" : ""}`}>
      {hasNavBar && (
        <div className="header">
          <h1>Heading</h1>
          <NavBar routes={routes} />
        </div>
      )}
      <Outlet />
    </div>
  );
}
