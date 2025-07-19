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
import { useNavigate } from 'react-router-dom';


function SalesEncodingContainer() {
  const [salesEncodings, setSalesEncodings] = useState<any[]>([]);
  const [getAgentBroker, setAgentBroker] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesToShow, setEntriesToShow] = useState<number>(10);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [editDialogOpenId, setEditDialogOpenId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Fetch agents and sales encodings
  useEffect(() => {
    fetchAgent();
  }, []);

  const fetchAgent = async () => {
    try {
      const response = await axios.get('sales-encoding', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setSalesEncodings(
        response.data.salesEncodingAdmin.map((item: any) => ({
          ...item,
          amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount),
        }))
      );
      setAgentBroker(response.data.agents);
      setEntriesToShow(response.data.salesEncodingAdmin.length);
      setSalesEncodings(response.data.salesEncodingAdmin);
      // console.log("List of Sales:", response.data.salesEncoding)
    } catch (error) {
      // console.error('Error fetching data:', error);
       Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetching data. Please login again.',
          confirmButtonText: 'OK',
        })
        localStorage.clear();
        console.clear();
        navigate('/');
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
     sales.client_name.toLowerCase().includes(searchQuery.toLowerCase());

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
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
    <div className="flex flex-col md:flex-row gap-4">
      <div className="ml-72 md:ml-0  gap-2 items-start justify-center mr-5 md:px-2 ">
        <NavigationSalesEncoding />
        <Card className="bg-[#eef2ff] border-b-4 border-primary fade-in-left md:w-[380px]">
          <CardHeader>
            <div className='flex flex-row md:flex-col gap-4 justify-between'>
              <div className='grid grid-cols-4 md:grid-cols-1 gap-4 md:mt-0'>
                <div className="grid w-full gap-1.5">
                  <Label>Category</Label>
                  <Select onValueChange={setCategoryFilter} value={categoryFilter}>
                    <SelectTrigger className="md:w-full">
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
                      <SelectItem value="Block and lot">Block and lot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label>Reservation date</Label>
                  <Input type="date" className="md:w-full" onChange={e => setDateFilter(e.target.value)} />
                </div>
              </div>
              <div className='md:flex md:justify-end md:items-center md:w-full'>
                <AddSales fetchAgent={fetchAgent} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='py-2 flex flex-row justify-between gap-4'>
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
