import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TableBody, TableCell, TableDashboard, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from '../../../../plugin/axios'
import { useEffect, useState } from "react";


function Topperformaers() {
  const [topPerformers, settopPerformers] = useState<any[]>([]);

  const fetchTopPerformers = async () => {
    try {
      const response = await axios.get('sales-encoding', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      settopPerformers(response.data.topPerformers);
      console.log("Top Performers:", response.data.topPerformers)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

useEffect(() => {
    fetchTopPerformers();
  }, []);


  const currencyFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  });

  return (
   <>
    <Card className="fade-in-left w-full md:w-full bg-[#eff6ff] border-b-4 border-primary ">
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <CardDescription>of this month</CardDescription>
      </CardHeader>
          <CardContent>
        <TableDashboard >
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Affiliated</TableHead>
              <TableHead>Total Reserved</TableHead>
              <TableHead>Total Sales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topPerformers.map((top, index) => (
              <TableRow key={top.id}>
                <TableCell className="font-medium border border-[#bfdbfe]">{index + 1}</TableCell>
                <TableCell className="font-medium border border-[#bfdbfe]">{top.first_name} {top.middle_name} {top.last_name} {top.extension_name}</TableCell>
                <TableCell className="text-right border border-[#bfdbfe]">{top.totalReserved}</TableCell>
                <TableCell className="text-right border border-[#bfdbfe]">{currencyFormatter.format(top.totalSales)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableDashboard>
      </CardContent>
    </Card>
   </>
  )
}

export default Topperformaers
