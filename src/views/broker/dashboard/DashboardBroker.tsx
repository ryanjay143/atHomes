import { useEffect, useState } from 'react';
import axios from "../../../plugin/axios";
import { formatDateToMMDDYYYYDateApproved } from '@/helper/dateUtils';


import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import TotalSales from './cards/TotalSales';
import TopAffiliated from './cards/TopAffiliated';
import RecentSales from './cards/RecentSales';


function DashboardContainer() {
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [chartData, setChartData] = useState<number[]>(Array(12).fill(0));
  const [totalSales, setTotalSales] = useState<number>(0);
  const navigate = useNavigate();
  
   const agentUser = async () => {
    try {
      const response = await axios.get('user/broker', {
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
      setSales(response.data.salesEncodingTop5);
      setTotalSales(salesData.reduce((total: number, item: any) => total + item.amount, 0));

      // console.log("List of Sales:", salesData);
    } catch (error) {
      // console.error('Error fetching data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetching data. Please login again.',
        confirmButtonText: 'OK',
      })
      localStorage.clear();
      console.clear();
      navigate('/atHomes');
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
        <TotalSales chartData={chartData} totalSales={totalSales} currencyFormatter={currencyFormatter}/>

       <TopAffiliated topPerformers={topPerformers} currencyFormatter={currencyFormatter}/>
      </div>

      <div className='ml-72 md:ml-0 grid grid-cols-1 md:grid-cols-1 md:gap-4 md:p-6 md:mt-0 gap-4 items-start justify-center mt-6 md:px-6 mr-4'>
       <RecentSales sales={sales} formatDateToMMDDYYYYDateApproved={formatDateToMMDDYYYYDateApproved} currencyFormatter={currencyFormatter}/>
      </div>
    </div>
  );
}

export default DashboardContainer;