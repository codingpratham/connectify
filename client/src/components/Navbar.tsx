import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import { Link, useLocation } from "react-router";

const Navbar = () => {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");
  const profilePic = localStorage.getItem("profilePic") ?? "/default-avatar.png";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullname");
    localStorage.removeItem("profilePic");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-[#140E0E] sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between w-full">
        {isChatPage ? (
          <Link to="/" className="flex items-center gap-2.5">
            <ShipWheelIcon className="size-9 text-white text-green-500" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-500 tracking-wider">
              Connectify
            </span>
          </Link>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          <Link to="/notifications">
            <button className="btn btn-ghost btn-circle">
              <BellIcon className="h-6 w-6 text-white" />
            </button>
          </Link>

          <div className="avatar">
            <div className="w-9 rounded-full overflow-hidden">
              <img src={profilePic} alt="User Avatar" />
            </div>
          </div>

          <button className="btn btn-ghost btn-circle" onClick={handleLogout}>
            <LogOutIcon className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
