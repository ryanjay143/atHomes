import { ThemeProvider } from "@/components/themeProvider";
import { Outlet, useNavigate } from "react-router-dom";
import BrokerSidebar from "./../broker/layouts/Sidebar";
import BrokerHeader from "../broker/layouts/Header";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Profile from "./profile/Profile";

function BrokerLayout() {
  const [isHovered, setIsHovered] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const role = localStorage.getItem("role");
  const handleSwitchAccount = () => {
    if (role === "0") {
      Swal.fire({
        title: "Switch Account Success",
        icon: "success",
        iconColor: '#16a34a',
        showConfirmButton: false,
        showCloseButton: true,
        timer: 1500,
        timerProgressBar: true
      });
      navigate("/admin");
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex">
        {/* Sidebar */}
        <div className="z-40">
          <BrokerSidebar />
        </div>
        {/* Main content area */}
        <div className="flex-1 min-h-screen">
          {/* Header */}
          <div className="sticky top-0 z-30 w-full">
            <div
              className="ml-80 bg-gradient-to-r from-primary to-blue-900 shadow-lg md:ml-0 flex flex-row rounded-bl-2xl md:rounded-b-[5px] justify-between items-center px-8 py-3 transition-all duration-300"
            >
              <BrokerHeader />
              <div className="flex flex-row items-center gap-4">
                {role !== "1" && role !== "2" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="bg-[#172554] rounded-full p-2 text-[#eff6ff] h-10 w-10 md:h-8 md:w-8 shadow-lg hover:bg-blue-700 transition"
                          type="button"
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          onClick={handleSwitchAccount}
                        >
                          <FontAwesomeIcon
                            icon={faArrowsRotate}
                            className={`md:ml-[-2px] md:mb-[5px] ${isHovered ? 'animate-spin' : ''}`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#172554]">
                        <div className="text-base">Switch Account</div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <Profile />
              </div>
            </div>
            {/* Divider */}
            <div className="w-full h-[2px] bg-gradient-to-r from-blue-200 via-blue-100 to-transparent" />
          </div>
          {/* Main Outlet */}
          <div className="p-8 md:p-4">
            <Outlet />
          </div>
        </div>
      </div>
      {/* Scroll to top button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-[#0136a8] text-white rounded-full shadow-xl hover:bg-blue-700 transition animate-bounce"
        >
          <FontAwesomeIcon icon={faAngleUp} />
        </button>
      )}
    </ThemeProvider>
  );
}

export default BrokerLayout;