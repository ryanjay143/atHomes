import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "../../../plugin/axios";

import BrokerageNavigation from '../../broker/brokerage/navigation/BrokerageNavigation'

import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import AddProperty from './dialog/Addproperty';
import ViewProperty from './dialog/ViewProperty';


function BrokerageProperty() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesToShow, setEntriesToShow] = useState<number>(10);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const navigate = useNavigate();

  const fetchPropertiesData = async () => {
    try {
      const response = await axios.get('user/broker', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setProperties(response.data.property);
      // console.log("Property:", response.data.property)
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

  useEffect(() => {
    fetchPropertiesData();
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesCategory = selectedCategory === 'all' || property.category === selectedCategory;
    const matchesDate = !selectedDate || new Date(property.date_listed).toISOString().split('T')[0] === selectedDate;
    const matchesStatus = selectedStatus === 'all' || property.status === selectedStatus;
    const matchesSearch = property.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          property.type_of_listing.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          property.status.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDate && matchesStatus && matchesSearch;
  });

  const propertiesToDisplay = filteredProperties.slice(0, entriesToShow);

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  return (
     <div className="flex flex-col md:flex-row gap-4">
      <div className="ml-72 md:ml-0  gap-2 items-start justify-center mr-5 md:px-2 ">
        <BrokerageNavigation />
        <Card className="bg-[#eef2ff] border-b-4 border-primary min-w-[100px] fade-in-left md:w-[380px]">
       
          <CardHeader>
            <div className='flex flex-row md:flex-col gap-4 justify-between'>
              <div className='grid grid-cols-4 md:grid-cols-1 gap-4 md:mt-0'>
                <div className="grid w-full gap-1.5">
                  <Label>Category</Label>
                  <Select onValueChange={setSelectedCategory}>
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
                  <Label>Date Listed</Label>
                  <Input type="date" className="md:w-full" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label>Filter Status</Label>
                  <Select onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Sold">Sold</SelectItem>
                        <SelectItem value="Not Sold">Not Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='md:flex md:justify-end md:items-center md:w-full'>
                <AddProperty
                  isOpen={isDialogOpen}
                  fetchPropertiesData={fetchPropertiesData} 
                  onClose={() => setIsDialogOpen(false)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='py-2 flex flex-row justify-between gap-4'>
              <Select onValueChange={value => setEntriesToShow(value === 'all' ? properties.length : parseInt(value, 10))}>
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
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="fade-in-left ">
              <Table>
                <TableHeader className="bg-primary text-base">
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date Listed</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propertiesToDisplay.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className='text-center text-sm font-medium text-gray-500'>
                        No record found.
                      </TableCell>
                    </TableRow>
                  )}
                  {propertiesToDisplay.map((property, index) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium border border-[#bfdbfe]">{index + 1}</TableCell>
                      <TableCell className="font-medium border border-[#bfdbfe]">{property.category}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>{dateFormatter.format(new Date(property.date_listed))}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>{property.location}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>{property.type_of_listing}</TableCell>
                      <TableCell className='border border-[#bfdbfe]'>
                        {property.status === 'Sold' ? (
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                            {property.status}
                          </span>
                        ) : property.status === 'Not Sold' ? (
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                            {property.status}
                          </span>
                        ) : property.status === 'Pre-Selling' ? (
                          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-700/10 ring-inset">
                            {property.status}
                          </span>
                        ) : property.status === 'RFO' ? (
                          <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset">
                            Ready for Occupancy
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-right border border-[#bfdbfe]">
                        <div className='flex flex-row gap-1 justify-end'>
                          <ViewProperty property={property} dateFormatter={dateFormatter} />
                          
                          
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
                  Showing 1 to {propertiesToDisplay.length} of {properties.length} entries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BrokerageProperty;
