import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { faDownload, faPrint, faRefresh } from '@fortawesome/free-solid-svg-icons'
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
  const [salesReportShow, setsalesReportShow] = useState<string>('all');
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
      // console.log('Sales Report:', response.data.salesEncodingReport);
     

     
    } catch (error) {
      // console.error('Error fetching data:', error);
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
    // Add more fields as needed
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


   const totalDisplayedSales = (salesReportShow === 'all' ? filteredSalesReport : filteredSalesReport.slice(0, parseInt(salesReportShow) || 0))
    .reduce((acc, report) => {
      const amount = parseFloat(report.amount);
      return acc + (isNaN(amount) ? 0 : amount);
    }, 0);


    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };



  return (
    <div>
        <Card className='bg-[#eef2ff] border-b-4 border-primary fade-in-left'>

            <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
              <div className="grid grid-cols-3 md:grid-cols-1 gap-4 md:gap-4 w-full">
                <div className="grid w-full items-center gap-1.5">
                  <Label>Date Range</Label>
                  <div className="flex gap-2 md:gap-4 md:flex-col">
                    <Input type="date" className="w-full" placeholder="Start Date" value={startDate} onChange={handleStartDateChange}/>
                    <span className="flex items-center md:hidden sm:hidden">-</span>
                    <Input type="date" className="w-full" placeholder="End Date" value={endDate} onChange={handleEndDateChange}/>
                  </div>
                </div>
                <div className="grid w-full items-center gap-1.5 2xl:w-[310px] 2xl:ml-10 md:ml-0 xs:ml-0 xs:w-full">
                  <Label>Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='xl:w-full md:w-full border border-primary'>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lot only">Lot only</SelectItem>
                        <SelectItem value="House and lot">House and lot</SelectItem>
                        <SelectItem value="Condominium/Apartment">Condominium/Apartment</SelectItem>
                        <SelectItem value="Commercial Properties">Commercial Properties</SelectItem>
                        <SelectItem value="Rental Properties">Rental Properties</SelectItem>
                        <SelectItem value="Farm Lot">Farm Lot</SelectItem>
                      </SelectContent>
                    </Select>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label>Remarks</Label>
                  <Select value={selectedRemarks} onValueChange={setSelectedRemarks}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select remarks" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Sold">Sold</SelectItem>
                        <SelectItem value="Not Sold">Not Sold</SelectItem>
                        <SelectItem value="Pre-Selling">Pre-Selling</SelectItem>
                        <SelectItem value="RFO">Ready for Occupancy - (RFO)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
        <CardContent>
            <div className="flex flex-row md:grid md:grid-cols-2 justify-end items-start md:items-center gap-2 md:gap-4 pt-5">
                <Button
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => {
                  setsalesReportShow(salesReport.length.toString());
                  setSearchQuery("");
                  setStartDate("");
                  setEndDate("");
                  setSelectedCategory("");
                  setSelectedRemarks("");
                }}
                >
                    <FontAwesomeIcon
                  icon={faRefresh}
                  className={`${isHovered ? "animate-spin" : ""}`}
                />
                    Refresh list
                </Button>
                <Button className="bg-red-500 text-white hover:bg-red-400 hover:text-white">
                    <FontAwesomeIcon icon={faDownload} />
                    Export to PDF
                </Button>
                <Button className="bg-green-500 text-white hover:bg-green-400 hover:text-white">
                    <FontAwesomeIcon icon={faDownload} />
                    Export to Excel
                </Button>
                <Button>
                    <FontAwesomeIcon icon={faPrint} />
                    Print Report
                </Button>
            </div>

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
                  {(salesReportShow === 'all' ? filteredSalesReport : filteredSalesReport.slice(0, parseInt(salesReportShow))).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className='text-center text-sm font-medium text-gray-500'>
                        No record found.
                      </TableCell>
                    </TableRow>
                  )}
                  {(salesReportShow === 'all' ? filteredSalesReport : filteredSalesReport.slice(0, parseInt(salesReportShow))).map((report, index) => (
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
            <div className='flex flex-row  justify-between mt-3'>
            <h2 className='text-[#172554] text-sm w-full mt-1'>
              Total Displayed Sales: {currencyFormatter.format(totalDisplayedSales)}
            </h2>
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
                  </CardContent>
                    
                  </Card>
              </div>
            )
}

export default CardReport
