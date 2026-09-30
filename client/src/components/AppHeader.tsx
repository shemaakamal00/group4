import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Översikt" },
  { to: "/applications", label: "Ansökningar" },
  { to: "/articles", label: "Artiklar" },
  { to: "/goals", label: "Mål" },
];

function AppHeader() {
  const { user, logout } = useAuth();

  const firstName = (user?.user_metadata as { first_name?: string } | undefined)?.first_name;
  const initial = (firstName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();

  return (
    <header className="navbar">
          <Link to="/dashboard" className="brand">
            <span className="brand__logo">K</span>
            <span className="brand__name">KarriärKoll</span>
          </Link>
      <div className="nav-links">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "nav-link nav-link--active" : "nav-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
        <button type="button" className="link-button" onClick={() => logout()}>
          Logga ut
        </button>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "avatar avatar--active" : "avatar"
          }
          title={user?.email ?? undefined}
        >
          {initial}
        </NavLink>
      </div>
    </header>
  );
}

export default AppHeader;