import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="main-layout">
      <div className="sidebar-shell">
        <Sidebar />
      </div>
      <div className="layout-right">
        <Topbar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
