import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NavigationSalesReport from "./navigation/NavigationSalesReport";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faHouseCircleCheck, faHouseCircleXmark, faList, faPesoSign, faPrint, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "../../../plugin/axios";
import ViewReceipt from "../salesEncoding/dialog/ViewReceipt";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Salesreport() {
  const [salesReport, setSalesReport] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rowsToShow, setRowsToShow] = useState<number>(10);
  const [getAgentBroker, setAgentBroker] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRemarks, setSelectedRemarks] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const fetchSalesReport = async () => {
    try {
      const response = await axios.get('sales-encoding', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setSalesReport(response.data.salesEncodingReports);
      setAgentBroker(response.data.agents);
    } catch (error) {
      console.error('Error fetching data:', error);
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
    fetchSalesReport();
  }, []);

  const formatSalesAmount = (amount: number): string => {
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(2)} M`;
    } else if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(2)} K`;
    } else {
      return currencyFormatter.format(amount);
    }
  };

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  const currencyFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleRowsToShowChange = (value: string) => {
    setRowsToShow(value === "all" ? salesReport.length : parseInt(value, 10));
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleAgentChange = (value: string) => {
    setSelectedAgent(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleRemarksChange = (value: string) => {
    setSelectedRemarks(value);
  };

  const filteredSalesReport = salesReport.filter((report) => {
    const fullName = `${report.agent.personal_info.first_name} ${report.agent.personal_info.middle_name} ${report.agent.personal_info.last_name}`.toLowerCase();
    const reportDate = new Date(report.date_on_sale);
    const isWithinDateRange = (!startDate || reportDate >= new Date(startDate)) && (!endDate || reportDate <= new Date(endDate));
    const isAgentMatch = !selectedAgent || report.agent.id === selectedAgent;
    const isCategoryMatch = !selectedCategory || report.category === selectedCategory;
    const isRemarksMatch = !selectedRemarks || report.remarks.toLowerCase() === selectedRemarks.toLowerCase();

    return (
      isWithinDateRange &&
      isAgentMatch &&
      isCategoryMatch &&
      isRemarksMatch &&
      (report.agent.user.acct_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fullName.includes(searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const displayedSalesReport = filteredSalesReport.slice(0, rowsToShow);

  const totalDisplayedSales = displayedSalesReport.reduce((acc, report) => {
    const amount = parseFloat(report.amount);
    return acc + (isNaN(amount) ? 0 : amount);
  }, 0);

  const soldPropertiesCount = displayedSalesReport.filter(report => report.remarks.toLowerCase() === "sold").length;
  const notSoldPropertiesCount = displayedSalesReport.filter(report => report.remarks.toLowerCase() === "not sold").length;

  return (
    <div className='py-5 md:pt-20'>
      <div className='ml-72 md:ml-0 md:w-full gap-2 items-start justify-center mr-5 md:px-5'>
        <NavigationSalesReport />
        <Card className='bg-[#eef2ff] border-b-4 border-primary fade-in-left'>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-4 w-full">
                <div className="grid w-full items-center gap-1.5">
                  <Label>Date Range</Label>
                  <div className="flex space-x-2">
                    <Input type="date" className="w-full md:w-[160px]" placeholder="Start Date" value={startDate} onChange={handleStartDateChange} />
                    <span className="flex items-center">-</span>
                    <Input type="date" className="w-full md:w-[160px]" placeholder="End Date" value={endDate} onChange={handleEndDateChange} />
                  </div>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label>Agent/Broker</Label>
                  <Select onValueChange={handleAgentChange} value={selectedAgent}>
                    <SelectTrigger className="w-full md:w-[340px]">
                      <SelectValue placeholder="Select agent or broker" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAgentBroker.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                           {agent.personal_info.first_name} {agent.personal_info.middle_name} {agent.personal_info.last_name} {agent.personal_info.extension_name}
                        </SelectItem>
                      ))}
                     
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label>Category</Label>
                    <Select onValueChange={handleCategoryChange} value={selectedCategory}>
                      <SelectTrigger>
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
                  <Select onValueChange={handleRemarksChange} value={selectedRemarks}>
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
            <div className="grid grid-cols-4 md:grid-cols-2 gap-2 md:gap-4">
              <div>
                <Card className='max-h-32 border border-b-4 border-primary shadow-md'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className='text-xl font-bold text-primary'>
                        {formatSalesAmount(totalDisplayedSales)}
                      </CardTitle>
                      <div className="bg-primary bg-opacity-10 p-2 rounded-md flex items-center gap-2">
                        <FontAwesomeIcon icon={faPesoSign} className="ml-2 h-10 text-white" />
                      </div>
                    </div>
                    <CardDescription className='font-bold text-primary md:text-xs'>Total Sales</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div>
                <Card className='max-h-32 border border-b-4 border-primary shadow-md'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className='text-xl font-bold text-primary'>
                        {displayedSalesReport.length}
                      </CardTitle>
                      <div className="bg-primary bg-opacity-10 p-2 rounded-md flex items-center gap-2">
                        <FontAwesomeIcon icon={faList} className="ml-2 h-10 text-white" />
                      </div>
                    </div>
                    <CardDescription className='font-bold text-primary md:text-xs'>Total Reservation</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div>
                <Card className='max-h-32 border border-b-4 border-primary shadow-md'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className='text-xl font-bold text-green-500'>
                        {soldPropertiesCount}
                      </CardTitle>
                      <div className="bg-green-500 p-2 rounded-md flex items-center gap-2">
                        <FontAwesomeIcon icon={faHouseCircleCheck} className="ml-2 h-10 text-white" />
                      </div>
                    </div>
                    <CardDescription className='font-bold text-green-500 md:text-xs'>Sold Properties</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div>
                <Card className='max-h-32 border border-b-4 border-primary shadow-md'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className='text-xl font-bold text-red-500'>
                        {notSoldPropertiesCount}
                      </CardTitle>
                      <div className="bg-red-500 p-2 rounded-md flex items-center gap-2">
                        <FontAwesomeIcon icon={faHouseCircleXmark} className="ml-2 h-10 text-white" />
                      </div>
                    </div>
                    <CardDescription className='font-bold text-red-500 md:text-xs'>Not Sold Properties</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
            <div className="flex flex-row md:grid md:grid-cols-2 justify-end items-start md:items-center gap-2 md:gap-4 pt-5">
              <Button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => {
                  setRowsToShow(salesReport.length);
                  setSearchQuery("");
                  setStartDate("");
                  setEndDate("");
                  setSelectedAgent("");
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
            <div className='py-2 mt-5 flex flex-row justify-between'>
              <Select onValueChange={handleRowsToShowChange}>
                <SelectTrigger className="w-[120px] border border-primary">
                  <span className='text-[#172554]'>Show</span>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
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
                className='w-52'
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="fade-in-left ">
              <Table>
                <TableHeader className="bg-primary text-base">
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Account No.</TableHead>
                    <TableHead>Affiliated</TableHead>
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
                      <TableCell colSpan={10} className="text-center">
                        No data found.
                      </TableCell>
                    </TableRow>
                  )}
                  {displayedSalesReport.map((report, index) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium border border-[#bfdbfe]">{index + 1}</TableCell>
                      <TableCell className="font-medium border border-[#bfdbfe]">{report.agent.user.acct_number}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>{report.agent.personal_info.first_name} {report.agent.personal_info.middle_name} {report.agent.personal_info.last_name}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>{report.client_name}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>{report.category}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>{dateFormatter.format(new Date(report.date_on_sale))}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>{report.location}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>{currencyFormatter.format(report.amount)}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>{report.remarks}</TableCell>
                      <TableCell className="text-right border border-[#bfdbfe]">
                        <div className='flex flex-row gap-1 justify-end'>
                          <ViewReceipt sales={report} dateFormatter={dateFormatter} currencyFormatter={currencyFormatter} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className='flex flex-row justify-end mt-3'>
              <div>
                <p className='text-[#172554] text-sm w-full'>
                  Showing 1 to {Math.min(rowsToShow, displayedSalesReport.length)} of {filteredSalesReport.length} entries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Salesreport;