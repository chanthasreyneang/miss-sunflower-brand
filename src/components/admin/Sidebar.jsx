import { NavLink } from "react-router-dom";
import { FiGrid, FiBox, FiTag, FiShoppingBag } from "react-icons/fi";
import "./Sidebar.css";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/products", label: "Products", icon: FiBox },
  { to: "/admin/categories", label: "Categories", icon: FiTag },
  { to: "/admin/orders", label: "Orders", icon: FiShoppingBag },
];

export default function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <nav>
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `admin-sidebar-link ${isActive ? "is-active" : ""}`}
          >
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
