import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AgentBrokerageNavigation from '../../agent/brokerage/navigation/AgentBrokerageNavigation'

function AgentBrokerage() {
  

  return (
    <div className='py-5 md:pt-20'>
      <div className='ml-72 md:ml-0 md:w-full gap-2 items-start justify-center mr-5 md:px-5'>
        <AgentBrokerageNavigation />
        <Card className='bg-[#eef2ff] border-b-4 border-primary fade-in-left'>
          <CardHeader>
            <div className='flex flex-row justify-between'>
              <div className='grid grid-cols-4 md:grid-cols-1 gap-4 md:mt-14'>
                <div className="grid w-full gap-1.5">
                  <Label>Category</Label>
                  <Select>
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
                  <Input type="date" className="md:w-[340px]"/>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label>Filter Status</Label>
                  <Select>
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
            </div>
          </CardHeader>
          <CardContent>
            <div className='py-2 flex flex-row justify-between'>
              <Select>
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
                  
                 
                    <TableRow>
                      <TableCell className="font-medium border border-[#bfdbfe]"></TableCell>
                      <TableCell className="font-medium border border-[#bfdbfe]"></TableCell>
                      <TableCell className='border border-[#bfdbfe]'></TableCell>
                      <TableCell className='border border-[#bfdbfe]'></TableCell>
                      <TableCell className='border border-[#bfdbfe]'></TableCell>
                      <TableCell className='border border-[#bfdbfe]'>
                       
                      </TableCell>
                      <TableCell className="text-right border border-[#bfdbfe]">
                        
                        
                      </TableCell>
                    </TableRow>
                 
                </TableBody>
              </Table>
            </div>
            <div className='flex flex-row justify-end mt-3'>
              <div>
                <p className='text-[#172554] text-sm w-full'>
                  Showing 1 to 10 of 50 entries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AgentBrokerage;
