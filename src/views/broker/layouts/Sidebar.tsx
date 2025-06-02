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
  faKeyboard,
  faTachometerAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

function AdminSidebar() {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation links
  const links = [
    { path: "/athomes/broker/broker-dashboard", icon: faTachometerAlt, label: "Dashboard" },
    { path: "/athomes/broker/broker-salesEncoding", icon: faKeyboard, label: "Sales Encoding" },
    { path: "/athomes/broker/broker-brokerage", icon: faHome, label: "Brokerage/Property" },
    { path: "/athomes/broker/broker-salesReport", icon: faChartLine, label: "Sales Report" },
  ];

  const notificationLink = { path: "/admin/products", icon: faBell, label: "Notification" };
  const messageLink = { path: "/admin/products", icon: faEnvelope, label: "Message" };
  const settingsLink = { path: "/admin/products", icon: faCog, label: "Settings" };

  // Event handlers
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // JSX structure
  return (
    <>
     <button
        className={`fixed top-4 left-4 z-50 bg-white text-accent p-2 rounded-md shadow-md transition-all duration-300 ease-in-out transform ${
          isOpen ? "opacity-100 scale-100 md:block" : "opacity-100 scale-100 hidden md:block"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon
          icon={isOpen ? faTimes : faBars}
          className={isOpen ? "text-red-500" : "text-primary"}
          size="lg"
        />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-primary text-accent z-40 transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "md:-translate-x-full"
        } overflow-hidden rounded-r-[5px]`}
      >
        <div className="w-full h-full flex flex-col items-center justify-between py-4">
          {/* Logo Section */}
          <div
            className="flex justify-center cursor-pointer mb-7"
            onClick={() => handleNavigation("/athomes/admin/user-dashboard")}
          >
            <img src="../logoathomes.jpg" alt="Logo" className="w-36 h-28 rounded-2xl" />
          </div>

          {/* Navigation Menu */}
          <nav className="w-full">
            <ul className="relative mb-12 w-full flex flex-col items-center gap-y-2 ">
              {links.map((link) => (
                <li
                  key={link.path}
                  onClick={() => handleNavigation(link.path)}
                  className={`w-full text-[#eff6ff] rounded-md flex justify-center items-center transition duration-200 ${
                    location.pathname.startsWith(link.path)
                      ? "bg-[#172554] text-[#172554] border border-primary"
                      : "hover:bg-[#172554] hover:text-[#eff6ff] border border-primary"
                  }`}
                >
                  <div className="flex items-center gap-3 text-xl w-full px-4 py-2 cursor-pointer">
                    <FontAwesomeIcon icon={link.icon} className="w-5 h-5" />
                    <span>{link.label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          <div className="w-full flex flex-col items-center mb-4">
            {/* Notification */}
            <li
              onClick={() => handleNavigation(notificationLink.path)}
              className={`w-full text-[#eff6ff] rounded-md flex justify-center items-center transition duration-200 ${
                location.pathname === notificationLink.path
                  ? "bg-[#172554] text-[#172554] border border-primary"
                  : "hover:bg-[#172554] hover:text-[#eff6ff] border border-primary"
              }`}
            >
              <div className="flex items-center gap-3 text-xl w-full px-4 py-2 cursor-pointer">
                <FontAwesomeIcon icon={notificationLink.icon} className="w-5 h-5" />
                <span>{notificationLink.label}</span>
                <span className="bg-red-500 rounded-full w-5 h-5">
                  <p className="text-center text-sm">0</p>
                </span>
              </div>
            </li>

            {/* Message Link */}
            <li
              onClick={() => handleNavigation(messageLink.path)}
              className={`w-full text-[#eff6ff] rounded-md flex justify-center items-center transition duration-200 ${
                location.pathname === messageLink.path
                  ? "bg-[#172554] text-[#172554] border border-primary"
                  : "hover:bg-[#172554] hover:text-[#eff6ff] border border-primary"
              }`}
            >
              <div className="flex items-center gap-3 text-xl w-full px-4 py-2 cursor-pointer">
                <FontAwesomeIcon icon={messageLink.icon} className="w-5 h-5" />
                <span>{messageLink.label}</span>
                <span className="bg-red-500 rounded-full w-5 h-5">
                  <p className="text-center text-sm">0</p>
                </span>
              </div>
            </li>

            {/* Settings Link */}
            <li
              onClick={() => handleNavigation(settingsLink.path)}
              className={`w-full text-[#eff6ff] rounded-md flex justify-center items-center transition duration-200 ${
                location.pathname === settingsLink.path
                  ? "bg-[#172554] text-[#172554] border border-primary"
                  : "hover:bg-[#172554] hover:text-[#eff6ff] border border-primary"
              }`}
            >
              <div className="flex items-center gap-3 text-xl w-full px-4 py-2 cursor-pointer">
                <FontAwesomeIcon icon={settingsLink.icon} className="w-5 h-5" />
                <span>{settingsLink.label}</span>
              </div>
            </li>
          </div>

          <div className="text-center text-sm text-[#eff6ff]">
            © {new Date().getFullYear()} ATHomes Company
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default AdminSidebar;