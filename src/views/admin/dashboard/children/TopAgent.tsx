import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import axios from '../../../../plugin/axios';
import { formatNumberShort } from "@/views/admin/utils/numberFormat";

function getRankColor(rank: number) {
  if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-200 text-yellow-900 border-yellow-400";
  if (rank === 2) return "bg-gradient-to-r from-gray-400 to-gray-200 text-gray-900 border-gray-400";
  if (rank === 3) return "bg-gradient-to-r from-orange-400 to-orange-200 text-orange-900 border-orange-400";
  return "bg-[#172554] text-[#eff6ff] border-[#172554]";
}

function getRankEmoji(rank: number) {
  if (rank === 1) return "🏆";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
}

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
    <Card className="fade-in-right w-full md:w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 border-0 shadow-xl rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-[#172554] text-2xl font-bold">Top 10 Agents</CardTitle>
        <CardDescription className="text-blue-700">of the month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 h-56 overflow-auto">
          {topPerformers.map((topAgent: any, index: number) => (
            <div
              className="relative flex flex-col items-center rounded-xl transition transform hover:-translate-y-1 p-2 md:p-1"
              key={topAgent.id || index}
            >
              {/* Rank Badge */}
              <div
                className={`
                  absolute top-0 left-3 z-50 
                  px-2 rounded-full border-2 font-bold flex items-center gap-1 
                  text-base md:text-xs
                  md:px-1 py-1 md:py-0.5
                  ${getRankColor(index + 1)}
                `}
                style={{ minWidth: 36, justifyContent: "center" }}
              >
                {getRankEmoji(index + 1)} {index + 1}
              </div>
              {/* Avatar with ring for top 3 */}
              <Popover>
                <PopoverTrigger asChild className="cursor-pointer">
                  <div className={`transition-transform duration-200 ${index < 3 ? "ring-4 ring-yellow-300" : ""} rounded-full`}>
                    <Avatar className="h-14 w-14 md:h-14 md:w-14 border-primary border-4 hover:scale-105 transition bg-transparent">
                      {topAgent.profile_pic ? (
                        <AvatarImage
                          src={`${import.meta.env.VITE_URL}/${topAgent.profile_pic}`}
                          alt={`${topAgent.first_name} ${topAgent.last_name}`}
                          className="rounded-full border border-border object-cover bg-transparent"
                        />
                      ) : null}
                      <AvatarFallback className='font-bold text-2xl bg-[#172554] text-[#eff6ff] '>
                        {topAgent.first_name
                          ? topAgent.first_name.charAt(0).toUpperCase()
                          : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </PopoverTrigger>
                <PopoverContent className='p-4 bg-white shadow-lg rounded-lg'>
                  <div className="text-center">
                    <p className="font-semibold text-lg">{topAgent.first_name} {topAgent.middle_name} {topAgent.last_name}</p>
                    <p className="text-sm text-muted-foreground">{topAgent.email || ''}</p>
                    <p>Total Sales: <span className="text-green-500 text-sm">{currencyFormatter.format(topAgent.totalSales)}</span></p>
                    <p>Total Reserved: <span className="text-green-500 text-sm">+ {topAgent.totalReserved}</span></p>
                  </div>
                </PopoverContent>
              </Popover>
              {/* Agent Info */}
              <div className='text-center mt-2'>
                <p className="text-sm font-bold text-[#172554]">{topAgent.first_name} {topAgent.last_name}</p>
                <p className="text-sm text-blue-700">{formatNumberShort(Number(topAgent.totalSales))}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TopAgent;