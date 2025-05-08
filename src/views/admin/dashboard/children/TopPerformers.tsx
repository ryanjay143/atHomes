import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function Topperformaers() {
  return (
   <>
    <Card className="fade-in-left w-full md:w-full bg-[#eff6ff] border-b-4 border-primary ">
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="h-56 overflow-auto ">
        <Table className="w-full">
          <TableHeader className="sticky top-0 bg-primary">
            <TableRow>
              <TableHead className="border border-[#bfdbfe] bg-primary"></TableHead>
              <TableHead className="border border-[#bfdbfe] text-accent font-bold bg-primary">Agent name</TableHead>
              <TableHead className="text-right border border-[#bfdbfe] text-accent font-bold bg-primary">Latest developer</TableHead>
              <TableHead className="text-right border border-[#bfdbfe] text-accent font-bold bg-primary">Count</TableHead>
              <TableHead className="text-right border border-[#bfdbfe] text-accent font-bold bg-primary">Total sales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium border border-[#bfdbfe]">1.</TableCell>
              <TableCell className="font-medium border border-[#bfdbfe]">Aldin Tagolimot</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">Camella</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">99</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">PHP 10,000,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium border border-[#bfdbfe]">2.</TableCell>
              <TableCell className="font-medium border border-[#bfdbfe]">Venus Reyes</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">Camella</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">88</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">PHP 10,000,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium border border-[#bfdbfe]">3.</TableCell>
              <TableCell className="font-medium border border-[#bfdbfe]">Veronica Padera</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">Camella</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">77</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">PHP 10,000,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium border border-[#bfdbfe]">4.</TableCell>
              <TableCell className="font-medium border border-[#bfdbfe]">Ricky Reyes</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">Camella</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">66</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">PHP 10,000,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium border border-[#bfdbfe]">5.</TableCell>
              <TableCell className="font-medium border border-[#bfdbfe]">Ryan Reyes</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">Camella</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">55</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">PHP 10,000,000</TableCell>
            </TableRow>
           <TableRow>
              <TableCell className="font-medium border border-[#bfdbfe]">1.</TableCell>
              <TableCell className="font-medium border border-[#bfdbfe]">Aldin Tagolimot</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">Camella</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">99</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">PHP 10,000,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium border border-[#bfdbfe]">2.</TableCell>
              <TableCell className="font-medium border border-[#bfdbfe]">Venus Reyes</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">Camella</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">88</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">PHP 10,000,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium border border-[#bfdbfe]">3.</TableCell>
              <TableCell className="font-medium border border-[#bfdbfe]">Veronica Padera</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">Camella</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">77</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">PHP 10,000,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium border border-[#bfdbfe]">4.</TableCell>
              <TableCell className="font-medium border border-[#bfdbfe]">Ricky Reyes</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">Camella</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">66</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">PHP 10,000,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium border border-[#bfdbfe]">5.</TableCell>
              <TableCell className="font-medium border border-[#bfdbfe]">Ryan Reyes</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">Camella</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">55</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">PHP 10,000,000</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
          

           

          </CardContent>
        </Card>
   </>
  )
}

export default Topperformaers
