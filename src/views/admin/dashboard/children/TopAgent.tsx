import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import axios from '../../../../plugin/axios';
import { formatNumberShort } from "@/views/admin/utils/numberFormat";


function TopAgent() {
  const [topPerformers, setTopPerformers] = useState<any[]>([]);

  const fetchTopAgents = async () => {
    try {
      const response = await axios.get('sales-encoding', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setTopPerformers(response.data.topPerformers);
      // console.log("Top Agents:", response.data.topPerformers)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchTopAgents();
  }, []);

    const currencyFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  });

  return (
    <Card className="fade-in-right w-full md:w-full bg-[#eff6ff] border-b-4 border-primary">
      <CardHeader className="text-center">
        <CardTitle>Top 10 Agents</CardTitle>
        <CardDescription>of the month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 md:grid-cols-3 gap-4 h-56 overflow-auto">
          {topPerformers.map((topAgent: any, index: number) => (
            <div className="relative flex flex-col items-center" key={topAgent.id || index}>
              <div className='absolute top-0 left-3 bg-[#172554] rounded-full z-50 px-2 py-1 text-[#eff6ff]'>
                {index + 1}
              </div>
              <Popover>
                <PopoverTrigger asChild className="cursor-pointer">
                  <Avatar className="h-12 w-12 md:h-12 md:w-12 border-primary border-4 ">
                    {topAgent.profile_pic ? (
                      <AvatarImage
                        src={`${import.meta.env.VITE_URL}/${topAgent.profile_pic}`}
                        alt={`${topAgent.first_name} ${topAgent.last_name}`}
                        className="rounded-full border border-border object-cover"
                      />
                    ) : null}
                    <AvatarFallback className='font-bold text-2xl bg-[#172554] text-[#eff6ff] '>
                      {topAgent.first_name
                        ? topAgent.first_name.charAt(0).toUpperCase()
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='p-4 bg-white shadow-lg rounded-lg'>
                  <div className="text-center">
                    <p className="font-semibold">{topAgent.first_name} {topAgent.middle_name} {topAgent.last_name}</p>
                    <p className="text-sm text-muted-foreground">{topAgent.email || ''}</p>
                    <p>Total Sales: <span className="text-green-500 text-sm">{currencyFormatter.format(topAgent.totalSales)}</span></p>
                    <p>Total Reserved: <span className="text-green-500 text-sm">+ {topAgent.totalReserved}</span></p>
                  </div>
                </PopoverContent>
              </Popover>
              <div className='text-center mt-2'>
                <p className="text-sm font-bold">{topAgent.first_name} {topAgent.last_name}</p>
                <p className="text-sm">{formatNumberShort(Number(topAgent.totalSales))}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TopAgent;