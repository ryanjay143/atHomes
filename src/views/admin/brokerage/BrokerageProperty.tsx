import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationBrokerage from "./navigation/NavigationBrokerage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "../../../plugin/axios";
import AddProperty from './dialog/AddProperty';
import ViewProperty from './dialog/ViewProperty';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import EditPropertyDialog from './dialog/EditPropertyDialog';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function BrokerageProperty() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesToShow, setEntriesToShow] = useState<number>(10);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const navigate = useNavigate();

  const fetchPropertiesData = async () => {
    try {
      const response = await axios.get('property-listings', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setProperties(response.data.property);
      // console.log("Property:", response.data.property)
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
        navigate('/');
    }
  };

  useEffect(() => {
    fetchPropertiesData();
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          property.type_of_listing.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          property.status.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
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
        <NavigationBrokerage />
        <Card className="bg-[#eef2ff] border-b-4 border-primary fade-in-left md:w-[380px]">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-4 justify-between">
              {/* Statistic Card (Left) */}
              <div className="flex flex-col items-start bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-2 rounded-lg shadow-sm">
                <span className="text-xs text-blue-700 font-semibold">Total Properties</span>
                <span className="text-2xl font-bold text-blue-900">{properties.length}</span>
              </div>
              {/* Add Property Button (Right) */}
              <div className="flex items-center">
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
                          
                          <Dialog>
                            <DialogTrigger onClick={() => setSelectedProperty(property)}>
                              <Button className='h-8 w-8 rounded-md font-medium bg-green-500 hover:bg-green-400 text-sm'>
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
                         <Button
                            className='h-8 w-8 rounded-md font-medium bg-red-500 hover:bg-red-400 text-sm flex items-center justify-center'
                            onClick={async () => {
                              const result = await Swal.fire({
                                icon: 'warning',
                                title: 'Are you sure?',
                                text: 'This action will permanently delete the property. Continue?',
                                showCancelButton: true,
                                confirmButtonText: 'Yes, delete it!',
                                cancelButtonText: 'Cancel',
                                confirmButtonColor: '#d33',
                                cancelButtonColor: '#3085d6',
                              });

                              if (result.isConfirmed) {
                                try {
                                  const response = await axios.delete(`property-listings/${property.id}`, {
                                    headers: {
                                      'Content-Type': 'application/json',
                                      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                                    },
                                  });
                                  Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    text: response.data.message,
                                    timerProgressBar: true,
                                    timer: 2000,
                                    showConfirmButton: false,
                                  });
                                  fetchPropertiesData();
                                } catch (error) {
                                  console.error('Error deleting property:', error);
                                  Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Failed to delete property. Please try again.',
                                    confirmButtonText: 'OK',
                                  });
                                }
                              }
                            }}
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
