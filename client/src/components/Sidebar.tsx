import { Link, useLocation } from "react-router";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from "lucide-react";

const Sidebar = () => {
  const authUser = {
    fullName: localStorage.getItem("fullname") || "User",
    profilePic: localStorage.getItem("profilePic") || null,
  };
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Home", to: "/", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Friends", to: "/friends", icon: <UsersIcon className="w-5 h-5" /> },
    { label: "Notifications", to: "/notifications", icon: <BellIcon className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-[#140E0E] text-white hidden lg:flex flex-col h-screen sticky top-0">
      {/* Logo */}
      
      <div className="p-5">
  <Link to="/" className="flex items-center gap-2.5">
    <ShipWheelIcon className="size-9 text-green-500" />
    <span className="text-3xl font-bold font-mono bg-clip-text text-transparent tracking-wider bg-gradient-to-r from-[#21AF50] to-[#1FAD7A]">
      Connectify
    </span>
  </Link>
</div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-2 rounded-full transition-colors ${
              currentPath === item.to
                ? "bg-neutral-700 text-white font-semibold"
                : "hover:bg-neutral-800 text-white"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Profile */}
      <div className="p-4 mt-auto border-t border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
              {authUser?.profilePic ? (
                <img src={authUser.profilePic} alt="User Avatar" />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-black font-bold">
                  {authUser?.fullName?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{authUser?.fullName || "User"}</p>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
