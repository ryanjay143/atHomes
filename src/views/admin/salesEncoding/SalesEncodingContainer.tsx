import { useEffect, useState } from 'react';
import NavigationSalesEncoding from './navigation/NavigationSalesEncoding';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
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
import { Label } from '@/components/ui/label';
import axios from "../../../plugin/axios";
import AddSales from './dialog/AddSales';
import ViewReceipt from './dialog/ViewReceipt';
import EditSalesDialog from './dialog/EditSalesDialog';
import Swal from 'sweetalert2';

// Types
interface Agent {
  id: string;
  personal_info: {
    first_name: string;
    middle_name: string;
    last_name: string;
    extension_name?: string;
  };
}

interface SalesEncoding {
  id: number;
  agent: Agent;
  category: string;
  date_on_sale: string;
  amount: number;
  location: string;
  remarks: string;
  image: string;
  client_name: string; // Add client_name to the SalesEncoding interface
}

function SalesEncodingContainer() {
  const [salesEncodings, setSalesEncodings] = useState<SalesEncoding[]>([]);
  const [getAgentBroker, setAgentBroker] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesToShow, setEntriesToShow] = useState<number>(10);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [editDialogOpenId, setEditDialogOpenId] = useState<number | null>(null);

  // Fetch agents and sales encodings
  useEffect(() => {
    fetchAgent();
  }, []);

  const fetchAgent = async () => {
    try {
      const response = await axios.get('sales-encoding', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setSalesEncodings(
        response.data.salesEncoding.map((item: any) => ({
          ...item,
          amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount),
        }))
      );
      setAgentBroker(response.data.agents);
      setEntriesToShow(response.data.salesEncoding.length);
      setSalesEncodings(response.data.salesEncoding);
      console.log("List of Sales:", response.data.salesEncoding)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Filtering logic
  const filteredSalesEncodings = salesEncodings.filter((sales) => {
    const matchesSearch =
      sales.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(sales.date_on_sale).toLocaleDateString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      sales.amount.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      sales.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sales.remarks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${sales.agent.personal_info.first_name} ${sales.agent.personal_info.middle_name} ${sales.agent.personal_info.last_name} ${sales.agent.personal_info?.extension_name || ''}`.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter && categoryFilter !== "all" ? sales.category === categoryFilter : true;
    const matchesDate = dateFilter ? sales.date_on_sale.split('T')[0] === dateFilter : true;

    return matchesSearch && matchesCategory && matchesDate;
  });

  const salesEncodingData = filteredSalesEncodings.slice(0, entriesToShow);

  // Formatters
  const currencyFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  });
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

const handleDelete = async (id: number) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Sale cant be revert — feel free to make a new one.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`sales-encoding/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Sales encoding has been deleted.',
        timer: 1500,
        showConfirmButton: false,
      });
      fetchAgent(); 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to delete sales encoding.',
      });
    }
  }
};

  return (
    <div className='py-5 md:pt-20'>
      <div className='ml-72 md:ml-0 md:w-full gap-2 items-start justify-center mr-5 md:px-5'>
        <NavigationSalesEncoding />
        <Card className='bg-[#eef2ff] border-b-4 border-primary fade-in-left'>
          <CardHeader>
            <div className='flex flex-row justify-between'>
              <div className='grid grid-cols-4 md:grid-cols-1 gap-4 md:mt-14'>
                <div className="grid w-full gap-1.5">
                  <Label>Category</Label>
                  <Select onValueChange={setCategoryFilter} value={categoryFilter}>
                    <SelectTrigger className="md:w-[340px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
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
                  <Label>Reservation date</Label>
                  <Input type="date" className="md:w-[340px]" onChange={e => setDateFilter(e.target.value)} />
                </div>
              </div>
              <div>
                <AddSales fetchAgent={fetchAgent} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='py-2 flex flex-row justify-between'>
              <Select onValueChange={value => setEntriesToShow(value === 'all' ? filteredSalesEncodings.length : parseInt(value, 10))}>
                <SelectTrigger className="w-[120px] border border-primary">
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
                className='w-52'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="h-80 overflow-y-auto fade-in-left ">
              <Table className='w-full'>
                <TableHeader className="bg-primary text-base">
                  <TableRow>
                    <TableHead className="border border-[#bfdbfe] md:text-sm text-accent font-bold bg-primary">#</TableHead>
                    <TableHead className="border border-[#bfdbfe] md:text-sm text-accent font-bold bg-primary">Client name</TableHead>
                    <TableHead className="border border-[#bfdbfe] md:text-sm text-accent font-bold bg-primary">Category</TableHead>
                    <TableHead className='border border-[#bfdbfe] md:text-sm text-accent font-bold bg-primary'>Date</TableHead>
                    <TableHead className='border border-[#bfdbfe] md:text-sm text-accent font-bold bg-primary'>Amount</TableHead>
                    <TableHead className='border border-[#bfdbfe] md:text-sm text-accent font-bold bg-primary'>Location</TableHead>
                    <TableHead className='border border-[#bfdbfe] md:text-sm text-accent font-bold bg-primary'>Remarks</TableHead>
                    <TableHead className="text-right border border-[#bfdbfe] md:text-sm text-accent font-bold bg-primary">Action</TableHead>
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
                            getAgentBroker={getAgentBroker}
                            fetchAgent={fetchAgent}
                          />
                          <Button
                            className='h-8 w-8 font-medium bg-red-500 hover:bg-red-400 text-sm rounded-md'
                            onClick={() => handleDelete(sales.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
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
                  Showing 1 to {Math.min(entriesToShow, filteredSalesEncodings.length)} of {filteredSalesEncodings.length} entries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SalesEncodingContainer;