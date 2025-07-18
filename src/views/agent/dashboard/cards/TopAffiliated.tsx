import { useState, useMemo } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { faMedal, faUserTie, faClipboardList, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TopPerformer {
  id: string | number
  first_name: string
  middle_name?: string
  last_name: string
  profile_pic?: string
  extension_name?: string
  role: string
  totalReserved: number | string
  totalSales: number
}

interface TopAffiliatedProps {
  topPerformers: TopPerformer[]
  currencyFormatter: Intl.NumberFormat
}

function TopAffiliated({ topPerformers, currencyFormatter }: TopAffiliatedProps) {
  const [search, setSearch] = useState('')

  // Filter performers based on search query
  const filteredPerformers = useMemo(() => {
    if (!search.trim()) return topPerformers
    const lower = search.toLowerCase()
    return topPerformers.filter(top =>
      [
        top.first_name,
        top.middle_name,
        top.last_name,
        top.extension_name,
        top.role,
        top.profile_pic,
        String(top.totalReserved),
        String(top.totalSales)
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(lower)
    )
  }, [search, topPerformers])

  // Badge color for top 3
  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-green-400 text-white";
    if (rank === 2) return "bg-gray-300 text-gray-800";
    if (rank === 3) return "bg-orange-400 text-white";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full">
      <CardContent className="flex flex-col h-[400px]">
        {/* Header: Not scrollable */}
        <div className="py-5 flex flex-row justify-between items-center flex-shrink-0">
          <CardTitle>Top Affiliated Rankings</CardTitle>
          <Input
            type='text'
            placeholder='Search'
            className='w-52'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Scrollable card grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 h-full">
            {filteredPerformers.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                No data available
              </div>
            )}
            {filteredPerformers.map((top, index) => (
              <Card
                key={top.id}
                className="flex flex-col h-full bg-white border border-[#bfdbfe] rounded-xl shadow hover:shadow-lg transition"
              >
                <CardContent className="flex flex-col gap-2 p-4 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow ${getRankBadge(index + 1)}`}>
                      <FontAwesomeIcon icon={faMedal} className="mr-1" />
                      Rank {index + 1}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      <FontAwesomeIcon icon={faUserTie} className="mr-1" />
                      {top.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                    {top.profile_pic ? (
                      <img
                        src={`${import.meta.env.VITE_URL}/${top.profile_pic}`}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base border-2 border-primary">
                        {`${top.first_name?.charAt(0) ?? ""}${top.last_name?.charAt(0) ?? ""}`}
                      </div>
                    )}
                    <span>
                      {top.first_name} {top.middle_name ? top.middle_name + " " : ""}
                      {top.last_name} {top.extension_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FontAwesomeIcon icon={faClipboardList} className="text-green-500" />
                    <span className="font-medium">Total Reserved:</span>
                    <span className="font-bold">{top.totalReserved}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-indigo-400" />
                    <span className="font-medium">Total Sales:</span>
                    <span className="font-bold text-green-700">{currencyFormatter.format(top.totalSales)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Footer: Not scrollable */}
        <div className='flex flex-row justify-end mt-3 flex-shrink-0'>
          <div>
            <p className='text-[#172554] text-sm w-full'>
              Showing {filteredPerformers.length === 0 ? 0 : 1} to {filteredPerformers.length} of {filteredPerformers.length} entries
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TopAffiliated