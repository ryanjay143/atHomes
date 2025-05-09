import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationBrokerage from "./navigation/NavigationBrokerage";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import axios from "../../../plugin/axios";
import AddProperty from './dialog/AddProperty';
import ViewProperty from './dialog/ViewProperty';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import EditPropertyDialog from './dialog/EditPropertyDialog';

function BrokerageProperty() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesToShow, setEntriesToShow] = useState<number>(10);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const fetchPropertiesData = async () => {
    try {
      const response = await axios.get('property-listings', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      setProperties(response.data.property);
      console.log("Property:", response.data.property)
    } catch (error) {
      console.error('Error fetching data:', error);
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
    <div className='py-5 md:pt-20'>
      <div className='ml-72 md:ml-0 md:w-full gap-2 items-start justify-center mr-5 md:px-5'>
        <NavigationBrokerage />
        <Card className='bg-[#eef2ff] border-b-4 border-primary fade-in-left'>
          <CardHeader>
            <div className='flex flex-row justify-between'>
              <div className='grid grid-cols-4 md:grid-cols-1 gap-4 md:mt-14'>
                <div className="grid w-full gap-1.5">
                  <Label>Category</Label>
                  <Select onValueChange={setSelectedCategory}>
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
                  <Label>Date Listed</Label>
                  <Input type="date" className="md:w-[340px]" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
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
              <div>
                <AddProperty 
                  isOpen={isDialogOpen}
                  fetchPropertiesData={fetchPropertiesData} 
                  onClose={() => setIsDialogOpen(false)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='py-2 flex flex-row justify-between'>
              <Select onValueChange={value => setEntriesToShow(value === 'all' ? properties.length : parseInt(value, 10))}>
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
                    <TableHead className="border border-[#bfdbfe] md:text-sm text-accent font-bold bg-primary">Category</TableHead>
                    <TableHead className='border border-[#bfdbfe] md:text-sm text-accent font-bold bg-primary'>Date Listed</TableHead>
                    <TableHead className='border border-[#bfdbfe] md:text-sm text-accent font-bold bg-primary'>Location</TableHead>
                    <TableHead className='border border-[#bfdbfe] md:text-sm text-accent font-bold bg-primary'>Type</TableHead>
                    <TableHead className='border border-[#bfdbfe] md:text-sm text-accent font-bold bg-primary'>Status</TableHead>
                    <TableHead className="text-right border border-[#bfdbfe] md:text-sm text-accent font-bold bg-primary">Action</TableHead>
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
                          
                          <Dialog>
                            <DialogTrigger onClick={() => setSelectedProperty(property)}>
                              <Button className='h-8 w-8 font-medium bg-green-500 hover:bg-green-400 text-sm rounded-md'>
                                <FontAwesomeIcon icon={faPen} />
                              </Button>
                            </DialogTrigger>
                            {selectedProperty && (
                              <EditPropertyDialog
                                key={selectedProperty.id} 
                                property={selectedProperty}
                                onClose={() => setSelectedProperty(null)}
                                fetchPropertiesData={fetchPropertiesData}
                              />
                            )}
                          </Dialog>
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
