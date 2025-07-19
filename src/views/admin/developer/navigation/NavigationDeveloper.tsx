import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 shadow-lg flex flex-row items-center gap-4 p-4 rounded-xl mb-8 border border-blue-800/40">
      <div className="flex flex-col items-start md:items-center md:justify-center md:ml-10 text-accent fade-in-right w-full">
        
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-accent">
              <Link
                to="/admin/developer"
                className="transition-colors duration-200 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                List of Accredited Developers
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

export default Navigation;