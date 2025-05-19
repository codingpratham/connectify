import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";
import Navbar from "./Navbar";

interface LayoutProps {
  showSidebar: boolean;
  children?: ReactNode; // ✅ Make optional
}

const Layout = ({ showSidebar }: LayoutProps) => {
  return (
    <div className="flex h-screen">
      {showSidebar && <Sidebar />}
      <main className="flex-1 overflow-auto">
        <Navbar/>
        <Outlet /> {/* This handles nested route rendering */}
      </main>
    </div>
  );
};

export default Layout;
