import { faBars, faBell, faChartLine, faCog, faEnvelope, faHome, faKeyboard, faTachometerAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: "/athomes/agent-broker", icon: faTachometerAlt, label: "Dashboard" },
    // { path: "/athomes/admin/developer", icon: faHomeUser, label: "Developer" },
    // { path: "/athomes/admin/affialiated", icon: faUsers, label: "Affialiated" },
    { path: "#", icon: faKeyboard, label: "Sales Encoding" },
    { path: "#", icon: faHome, label: "Brokerage/Property" },
    { path: "#", icon: faChartLine, label: "Sales Report" },
  ];

  const notificationLink = { path: "/admin/products", icon: faBell, label: "Notification" };
  const messageLink = { path: "/admin/products", icon: faEnvelope, label: "Message" };
  const settingsLink = { path: "/admin/products", icon: faCog, label: "Settings" };

  const handleNavigation = (path: any) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={`hidden md:flex fixed top-4 md:fixed left-4 z-50 text-accent bg-[#eff6ff] p-2 rounded-md shadow-md ${
          isOpen ? "hidden" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`${isOpen ? "bg-red-500 p-1.5 rounded" : ""}`}>
          <FontAwesomeIcon className={`${isOpen ? "text-white" : "text-[#172554]"}`} icon={isOpen ? faTimes : faBars} size="lg" />
        </div>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed h-full bg-primary text-accent md:z-40 z-40 transition-opacity duration-75 ease-in-out ${
          isOpen ? "w-[260px] opacity-100" : "w-[260px] opacity-100"
        } md:w-[250px] md:opacity-100 slg:w-[250px] slg:opacity-100 md:flex md:rounded-r-[5px] rounded-r-[5px] overflow-hidden ${
          !isOpen && "md:hidden"
        } md:transition-all md:ease-in-out`}
      >
        <div className="w-full h-full flex flex-col items-center justify-between py-4">
          {/* Logo Section */}
          <div
            className="flex justify-center cursor-pointer mb-4"
            onClick={() => handleNavigation("/admin")}
          >
            <img src="../../../../logoathomes.jpg" alt="Logo" className="w-42 h-32 rounded-2xl" />
          </div>
          <hr className="w-48 border-white" />

          {/* Navigation Menu */}
          <nav className="w-full">
            <ul className="relative mb-12 w-full flex flex-col items-center gap-y-2">
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
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:transition-opacity md:duration-300 md:ease-in-out"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default AdminSidebar;