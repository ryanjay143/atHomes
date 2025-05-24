import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from "../../../plugin/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { TableDashboard, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { formatDateToMMDDYYYY } from '@/helper/dateUtils';
import { ApexOptions } from 'apexcharts';

function DashboardContainer() {
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
   const [chartData, setChartData] = useState<number[]>(Array(12).fill(0));
  const [totalSales, setTotalSales] = useState<number>(0);
 const [isMounted, setIsMounted] = useState(false);

  const data = {
      series: [{
        name: 'Sales',
        data: chartData
      }],
      options: {
        chart: {
          type: 'line' as const,
          height: 350
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: 'Sales from January to December',
          align: 'left'
        },
        tooltip: {
          y: {
            formatter: (value: number) => {
              return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
            }
          }
        }
      } as ApexOptions
    };
  
    useEffect(() => {
      setIsMounted(true);
    }, []);

   const agentUser = async () => {
    try {
      const response = await axios.get('user/agent-broker', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const salesData = response.data.salesEncoding.map((item: any) => ({
        ...item,
        amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount),
      }));
      // Aggregate sales data by month
      const monthlySales = Array(12).fill(0);
      salesData.forEach((item: any) => {
        const month = new Date(item.date_on_sale).getMonth();
        monthlySales[month] += item.amount;
      });
      setChartData(monthlySales);

      setTopPerformers(response.data.topPerformers);
      setSales(response.data.salesEncoding);
      setTotalSales(salesData.reduce((total: number, item: any) => total + item.amount, 0));

      console.log("List of Sales:", salesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    agentUser();
  }, []);

  const currencyFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  });

  return (
    <div className="py-5 md:pt-20">
      <div className="flex justify-between md:flex-row">
        <h1 className="text-4xl font-bold ml-72 md:ml-0 md:grid-cols-1 md:text-2xl md:gap-2 md:p-5 md:mt-0">Dashboard</h1>
      </div>

      <div className="ml-72 md:ml-0 grid grid-cols-2 md:grid-cols-1 md:gap-4 md:p-6 md:mt-0 gap-4 items-start justify-center mt-6 md:px-6 mr-4">
        <div>
          <Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full">
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{currencyFormatter.format(totalSales)}</p>
              <div className="w-full md:w-full mt-6">
                 {isMounted && (
                            <Chart 
                              options={data.options} 
                              series={data.series} 
                              type="line"
                              height={350}
                            />
                          )}
              </div>
            </CardContent>
            <hr className="border-primary mb-6"/>
            <div className='flex flex-col items-start justify-start p-6 gap-4'>
              <p className="text-lg font-semibold">Monthly Sales</p>
              <div className=''>
                <p className="text-lg font-semibold">{currencyFormatter.format(totalSales)}</p>
              </div>
              <div className='w-full md:w-full'>
                <Progress value={33} />
                <p className="text-sm">33% Achieved</p>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full h-full max-h-full">
            <CardHeader>
              <CardTitle>Top Affiliated Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <TableDashboard>
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
                </TableDashboard>
              </div>
            </CardContent>
            <hr className="border-primary mb-10"/>
            <div className='flex flex-col items-start justify-start pl-6 gap-2'>
              <p className="text-lg font-semibold">Top 5 Recent Sales</p>

              <div className='grid grid-cols-2 md:grid-cols-1 items-start justify-start md:px-3 mr-4 w-full'>
                {sales.map((sale) => (
                  <div className='hover:bg-primary hover:text-white rounded-md w-full md:w-full' key={sale.id}>
                    <CardHeader key={sale.id}>
                      <CardTitle>
                        {sale.remarks}: {sale.category}
                      </CardTitle>
                      <p className='hover:text-white text-sm'>
                        {currencyFormatter.format(sale.amount)} | {formatDateToMMDDYYYY(sale.date_on_sale)}
                      </p>
                    </CardHeader>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DashboardContainer;