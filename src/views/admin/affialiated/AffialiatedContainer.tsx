import { Link, Outlet, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "../affialiated/navigation/NavigationAffialiated";
import navItems from "@/helper/navItems";
import '../../../components/style.css';

const FacilainersPage = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row gap-4 bg-gradient-to-br relative overflow-x-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 opacity-20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-300 opacity-20 rounded-full blur-3xl -z-10 animate-pulse" />

      <div className="ml-72 md:ml-0 gap-2 items-start justify-center mr-5 md:px-2 relative z-10">
        <Navigation />
        <Card className="bg-white/60 border-b-4 border-primary min-w-[100px] fade-in-left md:w-[380px] rounded-2xl shadow-2xl backdrop-blur-lg transition-all duration-300 hover:shadow-blue-200">
          <CardContent>
            <nav className="flex flex-row md:grid-cols-2 md:grid gap-4 pt-5 md:overflow-auto">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`
                    px-3 py-2 rounded-lg md:text-[12px] text-[#172554] font-medium flex items-center gap-2
                    transition-all duration-200
                    hover:bg-blue-100 hover:text-blue-700 hover:shadow
                    ${location.pathname === item.to
                      ? "bg-blue-200 text-blue-900 font-bold shadow-inner ring-2 ring-blue-300"
                      : ""}
                  `}
                  style={{
                    boxShadow: location.pathname === item.to
                      ? "0 2px 12px 0 rgba(59,130,246,0.10)"
                      : undefined,
                  }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div >
              <Outlet />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Custom Animations */}
      <style>
        {`
          .fade-in-left {
            animation: fadeInLeft 0.7s cubic-bezier(.39,.575,.565,1) both;
          }
          @keyframes fadeInLeft {
            0% { opacity: 0; transform: translateX(-40px);}
            100% { opacity: 1; transform: translateX(0);}
          }
        `}
      </style>
    </div>
  );
};

export default FacilainersPage;