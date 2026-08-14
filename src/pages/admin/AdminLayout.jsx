import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="container section-tight admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
