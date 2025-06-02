import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

function TopAffiliated( {topPerformers, currencyFormatter}:any ) {
  return (
     <div>
          <Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full h-full max-h-full">
            <CardContent>
              <div>
                <div className='py-5 flex flex-row justify-between items-center'>
                  <CardTitle>Top Affiliated Rankings</CardTitle>
                  <Input 
                    type='text' 
                    placeholder='Search' 
                    className='w-52'
                  />
                  </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Affiliated</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Total Reserved</TableHead>
                      <TableHead>Total Sales</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      topPerformers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">No data available</TableCell>
                        </TableRow>
                      )
                    }
                    {topPerformers.map((top:any, index:any) => (
                      <TableRow key={top.id}>
                        <TableCell className="font-medium border border-[#bfdbfe]">{index + 1}</TableCell>
                        <TableCell className="font-medium border border-[#bfdbfe]">{top.first_name} {top.middle_name} {top.last_name} {top.extension_name}</TableCell>
                        <TableCell className="font-medium border border-[#bfdbfe]">{top.role}</TableCell>
                        <TableCell className="font-medium border border-[#bfdbfe]">{top.totalReserved}</TableCell>
                        <TableCell className="font-medium border border-[#bfdbfe]">{currencyFormatter.format(top.totalSales)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 <div className='flex flex-row justify-end mt-3'>
                      <div>
                          <p className='text-[#172554] text-sm w-full'>Showing 1 to 10 of 10 entries</p>
                      </div>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>
  )
}

export default TopAffiliated
