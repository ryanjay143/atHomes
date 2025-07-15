import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom"


function Navigation() {
  return (
   
        <div className="bg-[#172554] flex flex-row items-center gap-4 p-2 rounded-md mb-5 ">
            <div className=" flex flex-col items-start md:items-center md:justify-center md:ml-10 text-accent fade-in-right">
            <Breadcrumb >
                <BreadcrumbList>
                    <BreadcrumbItem className="text-accent">
                        <Link to="/admin/developer" >List of Accredited Developers</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                </BreadcrumbList>
            </Breadcrumb>


            </div>
        </div>
  
    
  )
}

export default Navigation
