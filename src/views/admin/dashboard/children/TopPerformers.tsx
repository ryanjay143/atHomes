import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from '../../../../plugin/axios';

function TopPerformers() {
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchTopPerformers = async () => {
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
    fetchTopPerformers();
  }, []);

  const currencyFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  });

  // Filter performers based on search query
  const filteredPerformers = useMemo(() => {
    if (!search.trim()) return topPerformers;
    const lower = search.toLowerCase();
    return topPerformers.filter((perf: any) =>
      [
        perf.first_name,
        perf.middle_name,
        perf.last_name,
        perf.extension_name,
        perf.role,
        String(perf.totalReserved),
        String(perf.totalSales)
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );
  }, [search, topPerformers]);

  return (
    <Card className="fade-in-left w-full md:w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 border-0 shadow-xl rounded-2xl relative overflow-hidden">
      <CardContent className="flex flex-col h-[500px]">
        {/* Header: Not scrollable */}
        <div className="flex flex-row justify-between items-center py-5 flex-shrink-0">
          <div>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription className="text-xs text-blue-700 font-medium">of this month</CardDescription>
          </div>
          <Input
            type="text"
            placeholder="Search"
            className="w-52"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Scrollable card grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 ">
            {filteredPerformers.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                No data available
              </div>
            )}
            {filteredPerformers.map((top, index) => (
              <Card
                key={top.id}
                className="bg-white border border-[#bfdbfe] rounded-xl shadow hover:shadow-lg transition"
              >
                <CardContent className="flex flex-col gap-2 p-4">
                  <span className="inline-block bg-blue-100 text-blue-700 text-[11px] font-semibold px-3 py-1 rounded-full mb-1">
                    Rank #{index + 1}
                  </span>
                  <div className="font-semibold text-lg text-[#172554] truncate">
                    {top.first_name} {top.middle_name} {top.last_name} {top.extension_name}
                  </div>
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mb-1">
                    {top.role}
                  </span>
                  <div className="flex flex-row justify-between items-end mt-2">
                    <span className="text-xs text-gray-500">Total Reserved</span>
                    <span className="font-bold text-blue-700">{top.totalReserved}</span>
                  </div>
                  <div className="flex flex-row justify-between items-end">
                    <span className="text-xs text-gray-500">Total Sales</span>
                    <span className="font-bold text-green-700">{currencyFormatter.format(top.totalSales)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Footer: Not scrollable */}
        <div className="flex flex-row justify-end mt-3 flex-shrink-0">
          <div>
            <p className="text-[#172554] text-sm w-full">
              Showing {filteredPerformers.length === 0 ? 0 : 1} to {filteredPerformers.length} of {filteredPerformers.length} entries
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TopPerformers;