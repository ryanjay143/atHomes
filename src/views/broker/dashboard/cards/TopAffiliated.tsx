import { useState, useMemo } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface TopPerformer {
  id: string | number
  first_name: string
  middle_name?: string
  last_name: string
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
        String(top.totalReserved),
        String(top.totalSales)
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(lower)
    )
  }, [search, topPerformers])

  return (
    <div>
      <Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full h-full max-h-full">
        <CardContent>
          <div>
            <div className='py-5 flex flex-row justify-between items-center'>
              <CardTitle>Top Affiliated Rankings</CardTitle>
              <Input
                type='text'
                placeholder='Search'
                className='w-52'
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Table>
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
                {filteredPerformers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No data available</TableCell>
                  </TableRow>
                )}
                {filteredPerformers.map((top, index) => (
                  <TableRow key={top.id}>
                    <TableCell className="font-medium border border-[#bfdbfe]">{index + 1}</TableCell>
                    <TableCell className="font-medium border border-[#bfdbfe]">
                      {top.first_name} {top.middle_name} {top.last_name} {top.extension_name}
                    </TableCell>
                    <TableCell className="font-medium border border-[#bfdbfe]">{top.role}</TableCell>
                    <TableCell className="font-medium border border-[#bfdbfe]">{top.totalReserved}</TableCell>
                    <TableCell className="font-medium border border-[#bfdbfe]">{currencyFormatter.format(top.totalSales)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className='flex flex-row justify-end mt-3'>
              <div>
                <p className='text-[#172554] text-sm w-full'>
                  Showing {filteredPerformers.length === 0 ? 0 : 1} to {filteredPerformers.length} of {filteredPerformers.length} entries
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TopAffiliated