import { useState, useMemo } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function RecentSales({ sales, formatDateToMMDDYYYYDateApproved, currencyFormatter }: any) {
  const [search, setSearch] = useState("");

  // Filter sales based on search query
  const filteredSales = useMemo(() => {
    if (!search.trim()) return sales;
    const lower = search.toLowerCase();
    return sales.filter((sale: any) =>
      [
        sale.category,
        sale.remarks,
        formatDateToMMDDYYYYDateApproved(sale.date_on_sale),
        String(sale.amount)
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );
  }, [search, sales, formatDateToMMDDYYYYDateApproved]);

  return (
    <Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full">
      <CardContent className="flex flex-col h-[400px]">
        {/* Header: Not scrollable */}
        <div className="flex flex-row justify-between items-center py-5 flex-shrink-0">
          <CardTitle>Top 5 Recent Sales</CardTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSales.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                No data available
              </div>
            )}
            {filteredSales.map((sale: any) => (
              <Card
                key={sale.id}
                className="bg-white border border-[#bfdbfe] rounded-xl shadow hover:shadow-lg transition flex flex-col"
              >
                <CardContent className="flex flex-col gap-2 p-4">
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-[11px] font-semibold px-3 py-1 rounded-full mb-1">
                    Reservation Date: {formatDateToMMDDYYYYDateApproved(sale.date_on_sale)}
                  </span>
                  <div className="font-semibold text-lg text-[#172554] truncate">
                    {sale.category}
                  </div>
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-1">
                    {sale.remarks}
                  </span>
                  <div className="flex flex-row justify-between items-end mt-2">
                    <span className="text-xs text-gray-500">Amount</span>
                    <span className="text-lg font-bold text-green-600">
                      {currencyFormatter.format(sale.amount)}
                    </span>
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
              Showing {filteredSales.length === 0 ? 0 : 1} to {filteredSales.length} of {filteredSales.length} entries
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentSales;