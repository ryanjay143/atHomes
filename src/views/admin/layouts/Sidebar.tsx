import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faChartLine,
  faCog,
  faEnvelope,
  faHome,
  faHomeUser,
  faKeyboard,
  faTachometerAlt,
  faTimes,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import logo from "./../../../assets/logoathomes.png";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: "/admin/user-dashboard", icon: faTachometerAlt, label: "Dashboard" },
    { path: "/admin/developer", icon: faHomeUser, label: "Developer" },
    { path: "/admin/affialiated", icon: faUsers, label: "Affiliated" },
    { path: "/admin/sales-encoding", icon: faKeyboard, label: "Sales Encoding" },
    { path: "/admin/brokerage-property", icon: faHome, label: "Brokerage/Property" },
    { path: "/admin/sales-report", icon: faChartLine, label: "Sales Report" },
  ];

  const notificationLink = { path: "/admin/products", icon: faBell, label: "Notification" };
  const messageLink = { path: "/admin/products", icon: faEnvelope, label: "Message" };
  const settingsLink = { path: "/admin/products", icon: faCog, label: "Settings" };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-md text-primary p-2 rounded-full shadow-lg transition-all duration-300 ease-in-out transform ${
          isOpen ? "opacity-100 scale-100 md:block" : "opacity-100 scale-100 hidden md:block"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        <FontAwesomeIcon
          icon={isOpen ? faTimes : faBars}
          className={isOpen ? "text-red-500" : "text-primary"}
          size="lg"
        />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white/80 backdrop-blur-xl shadow-2xl text-primary z-40 transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "md:-translate-x-full"
        } overflow-hidden rounded-r-3xl flex flex-col`}
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        }}
      >
        <div className="w-full h-full flex flex-col items-center justify-between py-4">
          {/* Logo Section */}
          <div
            className="flex justify-center cursor-pointer mb-7"
            onClick={() => handleNavigation("/admin/user-dashboard")}
          >
           <img
              src={logo}
              alt="Logo"
              className="w-36 h-28 rounded-2xl"
              
            />
          </div>

          {/* Navigation Menu */}
          <nav className="w-full">
            <ul className="relative mb-12 w-full flex flex-col items-center gap-y-2">
              {links.map((link) => (
                <li
                  key={link.path}
                  onClick={() => handleNavigation(link.path)}
                  className={`w-11/12 rounded-xl flex justify-center items-center transition duration-200 cursor-pointer group ${
                    location.pathname.startsWith(link.path)
                      ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg"
                      : "hover:bg-blue-100 hover:text-blue-700"
                  }`}
                >
                  <div className="flex items-center gap-3 text-lg w-full px-5 py-3 font-semibold group-hover:scale-105 transition-transform">
                    <FontAwesomeIcon icon={link.icon} className="w-5 h-5" />
                    <span>{link.label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Quick Links */}
          <div className="w-full flex flex-col items-center mb-4 gap-2">
            {/* Notification */}
            <li
              onClick={() => handleNavigation(notificationLink.path)}
              className={`w-11/12 rounded-xl flex justify-center items-center transition duration-200 cursor-pointer group ${
                location.pathname === notificationLink.path
                  ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg"
                  : "hover:bg-blue-100 hover:text-blue-700"
              }`}
            >
              <div className="flex items-center gap-3 text-lg w-full px-5 py-3 font-semibold group-hover:scale-105 transition-transform">
                <FontAwesomeIcon icon={notificationLink.icon} className="w-5 h-5" />
                <span>{notificationLink.label}</span>
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow border-2 border-white">
                  0
                </span>
              </div>
            </li>

            {/* Message Link */}
            <li
              onClick={() => handleNavigation(messageLink.path)}
              className={`w-11/12 rounded-xl flex justify-center items-center transition duration-200 cursor-pointer group ${
                location.pathname === messageLink.path
                  ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg"
                  : "hover:bg-blue-100 hover:text-blue-700"
              }`}
            >
              <div className="flex items-center gap-3 text-lg w-full px-5 py-3 font-semibold group-hover:scale-105 transition-transform">
                <FontAwesomeIcon icon={messageLink.icon} className="w-5 h-5" />
                <span>{messageLink.label}</span>
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow border-2 border-white">
                  0
                </span>
              </div>
            </li>

            {/* Settings Link */}
            <li
              onClick={() => handleNavigation(settingsLink.path)}
              className={`w-11/12 rounded-xl flex justify-center items-center transition duration-200 cursor-pointer group ${
                location.pathname === settingsLink.path
                  ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg"
                  : "hover:bg-blue-100 hover:text-blue-700"
              }`}
            >
              <div className="flex items-center gap-3 text-lg w-full px-5 py-3 font-semibold group-hover:scale-105 transition-transform">
                <FontAwesomeIcon icon={settingsLink.icon} className="w-5 h-5" />
                <span>{settingsLink.label}</span>
              </div>
            </li>
          </div>

          {/* Footer */}
          <div className="block text-center text-xs text-blue-900 font-semibold opacity-80 mt-4">
            © {new Date().getFullYear()} <span className="font-bold text-primary">ATHomes Company</span>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default AdminSidebar;