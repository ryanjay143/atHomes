import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from "../../../../plugin/axios";

const Sales = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [chartData, setChartData] = useState<number[]>(Array(12).fill(0));

  const fetchDataSales = async () => {
    try {
      const response = await axios.get('sales-encoding', {
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

      console.log("List of Sales:", salesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataSales();
  }, []);

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

  return (
    <>
      <Card className="fade-in-left w-full md:w-full bg-[#eff6ff] border-b-4 border-primary">
        <CardHeader>
          <CardTitle className="text-[#172554]">Overall Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {isMounted && (
            <Chart 
              options={data.options} 
              series={data.series} 
              type="line"
              height={350}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Sales;