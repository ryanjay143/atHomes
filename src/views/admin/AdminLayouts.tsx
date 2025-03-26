import { ThemeProvider } from "@/components/themeProvider";
import Profile from "../../views/profile/Profile";
import Sidebar from "../../views/admin/layouts/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../../views/admin/layouts/Header";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Admin() {
  const [isHovered, setIsHovered] = useState(false);
  const [showScroll, setShowScroll] = useState(false); // Added missing state
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleSwitchAccount = () => {
    Swal.fire({
      title: "Switch Account Success",
      icon: "success",
      iconColor: '#16a34a',
      showConfirmButton: false,
      showCloseButton: true,
    });
    navigate("/athomes/agent-broker"); 
     
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Sidebar />
        <div className="bg-primary md:h-16 md:z-30 md:fixed border ml-72 md:ml-0 md:w-full flex flex-row md:rounded-b-[5px] rounded-bl-lg justify-between items-center px-6 py-2">
          <Header />
          <div className="flex flex-row items-center">
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="bg-[#172554] rounded-full p-2 text-[#eff6ff] h-10 w-10 md:h-7 md:w-7"
                      type="button"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={handleSwitchAccount} // Add onClick handler
                    >
                      <FontAwesomeIcon
                        icon={faArrowsRotate}
                        className={`md:ml-[-2px] md:mb-[5px] ${isHovered ? "animate-spin" : ""}`}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#172554]">
                    <div className="text-base">Switch Account</div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Profile />
          </div>
        </div>
        <Outlet />
      </ThemeProvider>

      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-[#0136a8] text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FontAwesomeIcon icon={faAngleUp} />
        </button>
      )}
    </>
  );
}

export default Admin;
