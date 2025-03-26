import NavigationSalesEncoding from './navigation/NavigationSalesEncoding';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFile, faPen, faPlus, faPrint } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';



function SalesEncodingContainer() {
    const [selectedValueDeveloper, setSelectedValueDeveloper] = useState<any>("");
    const [selectedValueFilterProject, setSelectedFilterProject] = useState<any>("");
    const [selectedDate, setSelectedDate] = useState<any>('');

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
        console.log(event.target.value);
    };

    localStorage.setItem("selectedValueDeveloper", selectedValueDeveloper);
    localStorage.setItem("selectedValueFilterProject", selectedValueFilterProject);
    localStorage.setItem("SelectedDate", selectedDate);


  return (
    <div className='py-5 md:pt-20'>
    <div className='ml-72 md:ml-0 md:w-full gap-2 items-start justify-center mt-5 mr-5 md:px-5'>
    <NavigationSalesEncoding/>
        <Card className='bg-[#eef2ff] border-b-4 border-primary fade-in-left'>
            <CardHeader>
                <div className='flex flex-row justify-between md:justify-none'>
                    <div className='grid grid-cols-4 md:grid-cols-2 gap-4 md:mt-10'>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="Filter Developer">Filter Developer</Label>
                                <Select onValueChange={(value) => {
                                    setSelectedValueDeveloper(value);
                                    console.log(value);
                                }}>
                                <SelectTrigger className="w-[180px] border border-primary">
                                    <SelectValue placeholder="Select developer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select developer</SelectLabel>
                                        <SelectItem value="JOHNDORF VENTURES">JOHNDORF VENTURES</SelectItem>
                                        <SelectItem value="CEBU LANDMASTERS INC">CEBU LANDMASTERS INC</SelectItem>
                                        <SelectItem value="IDC-ITALPINAS">IDC-ITALPINAS</SelectItem>
                                        <SelectItem value="DEVELOPMENT CORP">DEVELOPMENT CORP</SelectItem>
                                        <SelectItem value="PUEBLO DE ORO">PUEBLO DE ORO</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                                </Select>
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="Filter Project">Filter Project</Label>
                                <Select onValueChange={(value) => {
                                    setSelectedFilterProject(value);
                                    console.log(value);
                                }}>
                                <SelectTrigger className="w-[180px] border border-primary">
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select project</SelectLabel>
                                        <SelectItem value="TierraNava Tagoloan">TierraNava Tagoloan</SelectItem>
                                        <SelectItem value="TierraNava Opol">TierraNava Opol</SelectItem>
                                        <SelectItem value="TierraNava Lumbia">TierraNava Lumbia</SelectItem>
                                        <SelectItem value="Navona Court">Navona Court</SelectItem>
                                        <SelectItem value="Villa Castena">Villa Castena</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                                </Select>
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="Filter Reservation date">Filter Reservation date</Label>
                            <Input type="date" 
                                value={selectedDate} 
                                onChange={handleDateChange}
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="Filter Project">Filter Status</Label>
                                <Select onValueChange={(value) => {
                                    setSelectedFilterProject(value);
                                    console.log(value);
                                }}>
                                <SelectTrigger className="w-[180px] border border-primary">
                                    <SelectValue placeholder="Choose status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select status</SelectLabel>
                                        <SelectItem value="TierraNava Tagoloan">Non-Ready for Occupancy (NRFO)</SelectItem>
                                        <SelectItem value="TierraNava Opol">Ready for Occupancy (RFO)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                                </Select>
                        </div>
                    </div>

                    <div className='flex flex-row gap-1'>
                        <div>
                            <Button className='h-10'>
                                <FontAwesomeIcon icon={faPrint} />
                                Print
                            </Button>
                        </div>
                       <div>
                            <button className='bg-red-500 p-2 h-10 rounded-md text-accent'>
                                <FontAwesomeIcon icon={faFile} />
                                <span className='ml-2'>PDF</span>
                            </button>
                          
                       </div>
                      
                    </div>
                </div>
                
            </CardHeader>
            
            <CardContent>
                <div className='py-2 flex flex-row justify-between'>
                        <Select>
                        <SelectTrigger className="w-[120px] border border-primary">
                            <span className='text-[#172554]'>Show</span>
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="40">40</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="all">All</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input type='text' placeholder='Search' className='w-52 '/>
                </div>
                <div className="h-80 overflow-y-auto fade-in-left ">
                    <Table className='w-full'>
                        <TableHeader className="bg-primary text-base h-12 sticky top-0 z-10">
                            <TableRow>
                                <TableHead className="border border-[#bfdbfe] text-accent font-bold bg-primary">Developer Name</TableHead>
                                <TableHead className='border border-[#bfdbfe] text-accent font-bold bg-primary'>Reservation Date</TableHead>
                                <TableHead className='border border-[#bfdbfe] text-accent font-bold bg-primary'>Project Name</TableHead>
                                <TableHead className='border border-[#bfdbfe] text-accent font-bold bg-primary'>Status</TableHead>
                                <TableHead className="text-right border border-[#bfdbfe] text-accent font-bold bg-primary">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium border border-[#bfdbfe]">JOHNDORF VENTURES</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>Feb. 14, 2025</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>TierraNava Tagoloan</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                                        Non-Ready for Occupancy
                                    </span>
                                </TableCell>
                                <TableCell className="text-right border border-[#bfdbfe]">
                                    <div className='flex flex-row gap-1 justify-end'>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faEye} className='text-[#eff6ff]'/>
                                        </Button>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faPen} className='text-[#eff6ff]'/>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium border border-[#bfdbfe]">CEBU LANDMASTERS INC</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>Feb. 14, 2025</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>TierraNava Opol</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>
                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                        Ready for Occupancy
                                    </span>
                                </TableCell>
                                <TableCell className="text-right border border-[#bfdbfe]">
                                    <div className='flex flex-row gap-1 justify-end'>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faEye} className='text-[#eff6ff]'/>
                                        </Button>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faPen} className='text-[#eff6ff]'/>
                                        </Button>
                                    </div>
                                    
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium border border-[#bfdbfe]">JOHNDORF VENTURES</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>Feb. 14, 2025</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>TierraNava Tagoloan</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                                        Non-Ready for Occupancy
                                    </span>
                                </TableCell>
                                <TableCell className="text-right border border-[#bfdbfe]">
                                    <div className='flex flex-row gap-1 justify-end'>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faEye} className='text-[#eff6ff]'/>
                                        </Button>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faPen} className='text-[#eff6ff]'/>
                                        </Button>
                                    </div>
                                    
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium border border-[#bfdbfe]">CEBU LANDMASTERS INC</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>Feb. 14, 2025</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>TierraNava Opol</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>
                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                        Ready for Occupancy
                                    </span>
                                </TableCell>
                                <TableCell className="text-right border border-[#bfdbfe]">
                                    <div className='flex flex-row gap-1 justify-end'>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faEye} className='text-[#eff6ff]'/>
                                        </Button>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faPen} className='text-[#eff6ff]'/>
                                        </Button>
                                    </div>
                                    
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium border border-[#bfdbfe]">JOHNDORF VENTURES</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>Feb. 14, 2025</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>TierraNava Tagoloan</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                                        Non-Ready for Occupancy
                                    </span>
                                </TableCell>
                                <TableCell className="text-right border border-[#bfdbfe]">
                                    <div className='flex flex-row gap-1 justify-end'>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faEye} className='text-[#eff6ff]'/>
                                        </Button>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faPen} className='text-[#eff6ff]'/>
                                        </Button>
                                    </div>
                                    
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium border border-[#bfdbfe]">CEBU LANDMASTERS INC</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>Feb. 14, 2025</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>TierraNava Opol</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>
                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                        Ready for Occupancy
                                    </span>
                                </TableCell>
                                <TableCell className="text-right border border-[#bfdbfe]">
                                    <div className='flex flex-row gap-1 justify-end'>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faEye} className='text-[#eff6ff]'/>
                                        </Button>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faPen} className='text-[#eff6ff]'/>
                                        </Button>
                                    </div>
                                    
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium border border-[#bfdbfe]">JOHNDORF VENTURES</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>Feb. 14, 2025</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>TierraNava Tagoloan</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                                        Non-Ready for Occupancy
                                    </span>
                                </TableCell>
                                <TableCell className="text-right border border-[#bfdbfe]">
                                    <div className='flex flex-row gap-1 justify-end'>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faEye} className='text-[#eff6ff]'/>
                                        </Button>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faPen} className='text-[#eff6ff]'/>
                                        </Button>
                                    </div>
                                    
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium border border-[#bfdbfe]">CEBU LANDMASTERS INC</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>Feb. 14, 2025</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>TierraNava Opol</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>
                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                        Ready for Occupancy
                                    </span>
                                </TableCell>
                                <TableCell className="text-right border border-[#bfdbfe]">
                                    <div className='flex flex-row gap-1 justify-end'>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faEye} className='text-[#eff6ff]'/>
                                        </Button>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faPen} className='text-[#eff6ff]'/>
                                        </Button>
                                    </div>
                                    
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium border border-[#bfdbfe]">CEBU LANDMASTERS INC</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>Feb. 14, 2025</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>TierraNava Opol</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>
                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                        Ready for Occupancy
                                    </span>
                                </TableCell>
                                <TableCell className="text-right border border-[#bfdbfe]">
                                    <div className='flex flex-row gap-1 justify-end'>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faEye} className='text-[#eff6ff]'/>
                                        </Button>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faPen} className='text-[#eff6ff]'/>
                                        </Button>
                                    </div>
                                    
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium border border-[#bfdbfe]">CEBU LANDMASTERS INC</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>Feb. 14, 2025</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>TierraNava Opol</TableCell>
                                <TableCell className='border border-[#bfdbfe]'>
                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                        Ready for Occupancy
                                    </span>
                                </TableCell>
                                <TableCell className="text-right border border-[#bfdbfe]">
                                    <div className='flex flex-row gap-1 justify-end'>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faEye} className='text-[#eff6ff]'/>
                                        </Button>
                                        <Button className='w-8 h-8 rounded-xl border border-primary'>
                                            <FontAwesomeIcon icon={faPen} className='text-[#eff6ff]'/>
                                        </Button>
                                    </div>
                                    
                                </TableCell>
                            </TableRow>
                        </TableBody>
                       
                        
                </Table>
                </div>
                <div className='flex flex-row justify-between mt-3'>
                    <div>
                        <p className='text-[#172554] text-sm w-full'>Showing 1 to 10 of 57 entries</p>
                    </div>
                    <div>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                <PaginationPrevious href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                <PaginationLink href="#">1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                <PaginationNext href="#" />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            
                

            </CardContent>
        </Card>
    </div>
</div>
  )
}

export default SalesEncodingContainer
