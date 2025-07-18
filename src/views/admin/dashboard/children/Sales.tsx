import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from "../../../../plugin/axios";

const Sales = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [chartData, setChartData] = useState<number[]>(Array(12).fill(0));
  const [totalSales, setTotalSales] = useState<number>(0);

  const fetchDataSales = async () => {
    try {
      const response = await axios.get('sales-encoding', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const salesData = response.data.salesEncodingDashboardYearly.map((item: any) => ({
        ...item,
        amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount),
      }));
      // Aggregate sales data by month
      const monthlySales = Array(12).fill(0);
      let total = 0;
      salesData.forEach((item: any) => {
        const month = new Date(item.date_on_sale).getMonth();
        monthlySales[month] += item.amount;
        total += item.amount;
      });
      setChartData(monthlySales);
      setTotalSales(total);
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
        height: 350,
        toolbar: { show: false },
        dropShadow: {
          enabled: true,
          top: 3,
          left: 2,
          blur: 4,
          opacity: 0.2,
        },
        zoom: { enabled: false },
      },
      colors: ['#2563eb'],
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 5,
        colors: ['#fff'],
        strokeColors: '#2563eb',
        strokeWidth: 3,
        hover: { size: 8 }
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4,
        row: { colors: ['#f9fafb', 'transparent'], opacity: 0.5 },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: { style: { colors: '#64748b', fontWeight: 500 } }
      },
      yaxis: {
        labels: {
          formatter: (value: number) => value > 0 ? value.toLocaleString() : '',
          style: { colors: '#64748b', fontWeight: 500 }
        }
      },
      stroke: {
        curve: 'smooth',
        width: 4
      },
      title: {
        text: undefined,
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (value: number) => {
            return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
          }
        }
      },
      legend: {
        show: false
      }
    } as ApexOptions
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Card className="fade-in-left w-full md:w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 border-0 shadow-xl rounded-2xl relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          {/* Badge for visual interest */}
          <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-700 text-xs font-semibold shadow-sm">
            SALES
          </span>
          <div>
            <CardTitle className="text-[#172554] text-xl font-bold">Overall Sales</CardTitle>
            <div className="text-xs text-blue-700 font-medium">Yearly Overview</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-green-500">
            {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(totalSales)}
          </div>
          <div className="text-xs text-gray-500">Total Sales</div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isMounted && (
          <div className="w-full">
            <Chart
              options={data.options}
              series={data.series}
              type="line"
              height={320}
            />
          </div>
        )}
      </CardContent>
      {/* Decorative gradient blob */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 opacity-30 rounded-full blur-2xl pointer-events-none" />
    </Card>
  );
};

export default Sales;