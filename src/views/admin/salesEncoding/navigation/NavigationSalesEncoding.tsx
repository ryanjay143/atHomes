import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Link } from 'react-router-dom'

function NavigationSalesEncoding() {
  return (
    <div className="bg-[#172554] flex flex-row items-center gap-4 p-2 rounded-md mb-5 ">
            <div className=" flex flex-col items-start md:items-center md:justify-center md:ml-10 text-accent fade-in-right">
            <Breadcrumb >
                <BreadcrumbList>
                    <BreadcrumbItem className="text-accent">
<<<<<<< HEAD
                        <Link to="#" >List of Sales Encoding</Link>
=======
                        <Link to="/athomes/admin/sales-encoding" >List of Sales Encoding</Link>
>>>>>>> 69cab2f124d33b12174b1edafe0a92534ec11019
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                </BreadcrumbList>
            </Breadcrumb>


            </div>
        </div>
  )
}

export default NavigationSalesEncoding
