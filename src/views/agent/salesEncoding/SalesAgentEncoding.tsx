import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AgentSalesNavigation from '../../agent/salesEncoding/navigation/AgentSalesNavigation'
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from '../../../plugin/axios';
import AddSales from '../../agent/salesEncoding/dialog/AddSales'
import ViewReceipt from './dialog/ViewReceipt';
import EditSalesDialog from './dialog/EditSalesDialog';


function SalesAgentEncoding() {
  const [salesEncodings, setSalesEncodings] = useState<any[]>([]);
  const [personalInfo, setPersonalInfo] = useState<any>({});
  const [identityDetails, setIdentityDetails] = useState<any>({});
  const [editDialogOpenId, setEditDialogOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesToShow, setEntriesToShow] = useState<string>('all');

  const fetchAgent = async () => {
    try {
      const response = await axios.get('user/agent-broker', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setSalesEncodings(
        response.data.salesEncoding.map((item: any) => ({
          ...item,
          amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount),
        }))
      );
     
      setPersonalInfo(response.data.personalInfo);
      setIdentityDetails(response.data.identityDetails);

      setSalesEncodings(response.data.salesEncoding);
      // console.log("List of Sales:", response.data.salesEncoding)
      // console.log("Personal Info:", response.data.personalInfo);
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAgent();
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

   const filteredSalesEncodings = salesEncodings.filter((sales) => {
    const matchesSearch =
      sales.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(sales.date_on_sale).toLocaleDateString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      sales.amount.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      sales.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sales.remarks.toLowerCase().includes(searchQuery.toLowerCase()) ||
     sales.client_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const salesEncodingData =
  entriesToShow === 'all'
    ? filteredSalesEncodings
    : filteredSalesEncodings.slice(0, parseInt(entriesToShow, 10));

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="ml-72 md:ml-0  gap-2 items-start justify-center mr-5 md:px-2 ">
        <AgentSalesNavigation />
        <Card className="bg-[#eef2ff] border-b-4 border-primary fade-in-left md:w-[380px]">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-4 justify-between">
              {/* Left: Statistic Card */}
              <div className="flex flex-col items-start bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-2 rounded-lg shadow-sm">
                <span className="text-xs text-blue-700 font-semibold">Total Sales Encodings</span>
                <span className="text-2xl font-bold text-blue-900">{filteredSalesEncodings.length}</span>
              </div>
              {/* Right: Add Sales Button */}
              <div className="flex items-center">
               <AddSales fetchAgent={fetchAgent} personalInfo={personalInfo} identityDetails={identityDetails}/>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='py-2 flex flex-row justify-between gap-4'>
                <Select
                  value={entriesToShow}
                  onValueChange={value => setEntriesToShow(value)}
                >
                  <SelectTrigger className="w-[120px] border border-primary">
                    <span className='text-[#172554]'>Show</span>
                    <SelectValue />
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
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="fade-in-left ">
              <Table className='w-full'>
                <TableHeader className="bg-primary text-base">
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Client name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Reservation Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesEncodingData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className='text-center text-sm font-medium text-gray-500'>
                        No record found.
                      </TableCell>
                    </TableRow>
                  )}
                  {salesEncodingData.map((sales, index) => (
                    <TableRow key={sales.id}>
                      <TableCell className="font-medium border border-[#bfdbfe]">{index + 1}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>{sales.client_name}</TableCell>
                      <TableCell className="font-medium border border-[#bfdbfe]">{sales.category}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>{dateFormatter.format(new Date(sales.date_on_sale))}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>
                        <span>{currencyFormatter.format(sales.amount)}</span>
                      </TableCell>
                      <TableCell className='border border-[#bfdbfe]'>{sales.location}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>{sales.remarks}</TableCell>
                      <TableCell className="text-right border border-[#bfdbfe]">
                        <div className='flex flex-row gap-1 justify-end'>
                          <ViewReceipt sales={sales} dateFormatter={dateFormatter} currencyFormatter={currencyFormatter}/>
                          <Button
                            className='h-8 w-8 font-medium bg-green-500 hover:bg-green-400 text-sm rounded-md'
                            onClick={() => setEditDialogOpenId(sales.id)}
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </Button>
                          <EditSalesDialog
                            sales={sales}
                            open={editDialogOpenId === sales.id}
                            onOpenChange={(open) => setEditDialogOpenId(open ? sales.id : null)}
                            fetchAgent={fetchAgent}
                            identityDetails={identityDetails}
                          />
                         
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
  Showing 1 to {entriesToShow === 'all' ? filteredSalesEncodings.length : Math.min(parseInt(entriesToShow, 10), filteredSalesEncodings.length)} of {filteredSalesEncodings.length} entries
</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SalesAgentEncoding;
