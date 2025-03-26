import { Link, Outlet, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "../affialiated/navigation/NavigationAffialiated";
import navItems from "@/helper/navItems";
import '../../../components/style.css'

const FacilainersPage = () => {
  const location = useLocation();

  return (
    <div className="py-5 md:pt-20">
      <div className="ml-72 md:ml-0 md:w-full gap-2 items-start justify-center mt-5 mr-5 md:px-5">
        <Navigation />
        <Card className="border-b-4 border-primary bg-[#eff6ff] h-[550px] md:h-full">
          <CardContent>
            <nav className="flex flex-row md:grid-cols-2 md:grid gap-4 mt-5 md:overflow-auto">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-md md:text-[12px] text-[#172554] hover:bg-[#dbeafe] ${
                    location.pathname === item.to ? "bg-[#dbeafe] font-bold" : ""
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacilainersPage;
