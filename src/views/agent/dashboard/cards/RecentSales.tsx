import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


function RecentSales( {sales, formatDateToMMDDYYYY, currencyFormatter }:any ) {
  return (
    <>
     <Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full">
          <CardContent>
            <div className='py-5 flex flex-row justify-between items-center'>
              <CardTitle>Top 5 Recent Sales</CardTitle>
                  <Input 
                    type='text' 
                    placeholder='Search' 
                    className='w-52'
                  />
                  </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Top</TableHead>
                  <TableHead>Reservation date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Amount</TableHead>
                  
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No data available</TableCell>
                  </TableRow>
                )}
                {sales.map((sale: any, index:any) => (
                  <TableRow key={sale.id}>
                     <TableCell className="border border-[#bfdbfe]">{index + 1}</TableCell>
                    <TableCell className="border border-[#bfdbfe]">{formatDateToMMDDYYYY(sale.date_on_sale)}</TableCell>
                    <TableCell className="border border-[#bfdbfe]">{sale.category}</TableCell>
                    <TableCell className="border border-[#bfdbfe]">{sale.remarks}</TableCell>
                    <TableCell className="border border-[#bfdbfe]">{currencyFormatter.format(sale.amount)}</TableCell>
                   
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             <div className='flex flex-row justify-end mt-3'>
                <div>
                    <p className='text-[#172554] text-sm w-full'>Showing 1 to 10 of 10 entries</p>
                </div>
            </div>
          </CardContent>
        </Card>
    </>
  )
}

export default RecentSales
