import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { faDownload, faList, faPesoSign, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import axios from '../../../../plugin/axios'
import ViewReceipt from '../dialog/ViewReceipt'

function CardReport() {
  const [salesReport, setSalesReport] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRemarks, setSelectedRemarks] = useState<string>("");
  const [salesReportShow, setsalesReportShow] = useState<string>('all'); // Default is 'all'
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);

  const fetchAgentReport = async () => {
    try {
      const response = await axios.get('user/broker', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setSalesReport(response.data.salesEncodingReport);
    } catch (error) {
      // Handle error if needed
    }
  };

  useEffect(() => {
    fetchAgentReport();
  }, []);

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  const currencyFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  });

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const filteredSalesReport = salesReport.filter((report) => {
    // Date filter
    if (startDate || endDate) {
      const saleDate = new Date(report.date_on_sale);
      saleDate.setHours(0, 0, 0, 0);

      let start: Date | null = null;
      let end: Date | null = null;

      if (startDate) {
        start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (saleDate < start) return false;
      }
      if (endDate) {
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (saleDate > end) return false;
      }
    }
    // Category filter
    if (selectedCategory && report.category !== selectedCategory) return false;
    // Remarks filter
    if (selectedRemarks && report.remarks !== selectedRemarks) return false;
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matches = [
        report.client_name,
        report.category,
        report.remarks,
        report.location,
        report.amount?.toString(),
        report.date_on_sale
      ]
        .filter(Boolean)
        .some(field => field.toLowerCase().includes(query));
      if (!matches) return false;
    }
    return true;
  });

  const formatSalesAmount = (amount: number): string => {
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(2)} M`;
    } else if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(2)} K`;
    } else {
      return currencyFormatter.format(amount);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Always use the value of salesReportShow for slicing
  const displayedSalesReport =
    salesReportShow === 'all'
      ? filteredSalesReport
      : filteredSalesReport.slice(0, parseInt(salesReportShow, 10));

  const totalDisplayedSales = displayedSalesReport.reduce((acc, report) => {
    const amount = parseFloat(report.amount);
    return acc + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Handler for refresh: reset all filters and show entries to "all"
  const handleRefresh = () => {
    setsalesReportShow('all'); // Always reset to 'all'
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setSelectedCategory("");
    setSelectedRemarks("");
  };

  return (
    <div>
      <Card className="bg-[#eef2ff] border-b-4 border-primary min-w-[100px] fade-in-left md:w-[380px]">
        <CardHeader>
          {/* Horizontal Filter Bar with Actions */}
          <div className="w-full flex flex-row md:flex-col md:items-start gap-4">
            {/* Date Range Filter */}
            <div className="flex flex-col w-[700px] md:w-[152px]">
              <Label className="text-xs font-semibold text-blue-900 mb-1">Date Range</Label>
              <div className="flex flex-row gap-2">
                <Input
                  type="date"
                  className="w-full bg-white/80 border border-primary focus:ring-2 focus:ring-blue-300 transition text-xs"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
                <span className="flex items-center text-gray-400">-</span>
                <Input
                  type="date"
                  className="w-full bg-white/80 border border-primary focus:ring-2 focus:ring-blue-300 transition text-xs"
                  placeholder="End Date"
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-row w-full gap-2 md:grid md:grid-cols-3 md:w-full mt-5">
              <Button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleRefresh}
              >
                <FontAwesomeIcon
                  icon={faRefresh}
                  className={`${isHovered ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button className="bg-red-500 text-white hover:bg-red-400 flex items-center gap-2 transition text-xs px-3 py-2 rounded-lg">
                <FontAwesomeIcon icon={faDownload} />
                PDF
              </Button>
              <Button className="bg-green-500 text-white hover:bg-green-400 flex items-center gap-2 transition text-xs px-3 py-2 rounded-lg">
                <FontAwesomeIcon icon={faDownload} />
                Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='py-2 mt-5 flex flex-row justify-between gap-4'>
            <Select value={salesReportShow} onValueChange={setsalesReportShow}>
              <SelectTrigger className="w-[120px] md:w-full border border-primary">
                <span className='text-[#172554]'>Show</span>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type='text'
              placeholder='Search'
              className='w-52 md:w-full'
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div className="fade-in-left ">
            <Table>
              <TableHeader className="bg-primary text-base">
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Client name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Reservation date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedSalesReport.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className='text-center text-sm font-medium text-gray-500'>
                      No record found.
                    </TableCell>
                  </TableRow>
                )}
                {displayedSalesReport.map((report, index) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium border border-[#bfdbfe]">{index + 1}</TableCell>
                    <TableCell className='border border-[#bfdbfe]'>{report.client_name}</TableCell>
                    <TableCell className='border border-[#bfdbfe]'>{report.category}</TableCell>
                    <TableCell className='border border-[#bfdbfe]'>{dateFormatter.format(new Date(report.date_on_sale))}</TableCell>
                    <TableCell className='border border-[#bfdbfe]'>{report.location}</TableCell>
                    <TableCell className='border border-[#bfdbfe]'>{currencyFormatter.format(report.amount)}</TableCell>
                    <TableCell className='border border-[#bfdbfe]'>{report.remarks}</TableCell>
                    <TableCell className="text-right border border-[#bfdbfe]">
                      <ViewReceipt sales={report} dateFormatter={dateFormatter} currencyFormatter={currencyFormatter} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className='flex flex-row  justify-end mt-3'>
            <div>
              <p className='text-[#172554] text-sm w-full'>
                {filteredSalesReport.length === 0
                  ? "Showing 0 entries"
                  : `Showing 1 to ${
                      salesReportShow === 'all'
                        ? filteredSalesReport.length
                        : Math.min(parseInt(salesReportShow) || 0, filteredSalesReport.length)
                    } of ${filteredSalesReport.length} entries`
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-2 gap-3 mt-6 ">
            {/* Total Sales */}
            <div className="flex items-center gap-2 bg-blue-100 border border-blue-300 rounded-full px-4 py-2 shadow-sm">
              <FontAwesomeIcon icon={faPesoSign} className="text-blue-700 h-5" />
              <span className="font-bold text-blue-900 text-base">{formatSalesAmount(totalDisplayedSales)}</span>
              <span className="text-xs text-blue-700 font-semibold ml-1">Total Sales</span>
            </div>
            {/* Total Reservation */}
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 shadow-sm">
              <FontAwesomeIcon icon={faList} className="text-blue-700 h-5" />
              <span className="font-bold text-blue-900 text-base">{displayedSalesReport.length}</span>
              <span className="text-xs text-blue-700 font-semibold ml-1">Total Reservation</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CardReport