import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from '../../../../plugin/axios'
import { useEffect, useState } from 'react';
import { formatDateToMMDDYYYYDateApproved } from "@/helper/dateUtils";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatDateToMMDDYYYY } from "@/helper/dateUtils";




function ListOfBrokerAgent() {
  const [listtofAgents, setAgentList] = useState<any[]>([]);
  
  const agentList = async () => {
    try {
      const response = await axios.get('agent-broker', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      // Log the entire response to see the structure
      console.log('API Response:', response);
      console.log('List of Approved:', response.data.agentList);
      setAgentList(response.data.agentList);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    agentList();
  }, []);


  return (
    <div className='p-2'>
    <div className='py-2 flex flex-row justify-between'>
      <Select>
        <SelectTrigger className="w-[120px] border border-primary md:w-28">
          <span className='text-[#172554]'>Show</span>
          <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">10</SelectItem>
          <SelectItem value="dark">20</SelectItem>
          <SelectItem value="darw">30</SelectItem>
          <SelectItem value="systemwe">40</SelectItem>
          <SelectItem value="system">50</SelectItem>
        </SelectContent>
      </Select>
      <Input type='text' placeholder='Search' className='w-52 md:w-48'/>
    </div>
    <div className="fade-in-left">
      <Table>
      <TableHeader>
        <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Fullname</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Email address</TableHead>
            <TableHead>Contact number</TableHead>
            <TableHead>Date Approved</TableHead>
            <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
        <TableBody>
         {listtofAgents.map((agent:any, index:any) => (
           
            <TableRow key={agent.id}>
              <TableCell className="font-medium border border-[#bfdbfe]">{index + 1}</TableCell>
              <TableCell className="border border-[#bfdbfe]">{agent.personal_info.first_name} {agent.personal_info.middle_name} {agent.personal_info.last_name} {agent.personal_info.extension_name}</TableCell>
              <TableCell className="font-medium border border-[#bfdbfe]">{agent?.user.role === 1 ? "Agent" : agent?.user.role === 2 ? "Broker" : "N/A"}</TableCell>
              <TableCell className="border border-[#bfdbfe]">{agent?.user.email}</TableCell>
              <TableCell className="border border-[#bfdbfe]">{agent?.personal_info.phone}</TableCell>
              <TableCell className="border border-[#bfdbfe]">{formatDateToMMDDYYYYDateApproved(agent?.user.updated_at)}</TableCell>
              <TableCell className="text-right border border-[#bfdbfe]">
                <div className="flex flex-row gap-1 justify-end">
                 

                  <Dialog>
                    <DialogTrigger>
                      <Button className="w-8 h-8 rounded-md border border-primary">
                        <FontAwesomeIcon icon={faEye} className="text-[#eff6ff]" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="md:max-w-[400px]">
                      <DialogHeader>
                        <DialogTitle className="text-start">Agent and Broker Details</DialogTitle>
                        <DialogDescription>
                          <div className="flex flex-col gap-4 mt-5 mb-5">
                            <div className="border-b pb-2 mb-4 text-start">
                              <h2 className="text-lg font-bold">Personal Details</h2>
                              <p>Name: {agent?.personal_info?.first_name} {agent?.personal_info?.middle_name} {agent?.personal_info?.last_name}</p>
                              <p>Email: {agent?.user?.email}</p>
                              <p>Username: {agent?.user?.username}</p>
                              <p>Phone: {agent?.personal_info?.phone}</p>
                              <p>Gender: {agent.personal_info.gender.charAt(0).toUpperCase() + agent.personal_info.gender.slice(1)}</p>
                              <p>Complete Address: {agent.personal_info.complete_address}</p>
                              <p>Status: {agent.user.status === 0 ? "Approved" : agent.user.status === 1 ? "Pending" : "Decline"}</p>
                            </div>
                            <div className="text-start">
                              <h2 className="text-lg font-bold ">Identity Information</h2>
                              <p>PRC License Number: {agent?.prc_liscence_number || "N/A"}</p>
                              <p>DHSUD Registration Number: {agent?.dhsud_registration_number || "N/A"}</p>
                              <p>Type: {agent?.user.role === 1 ? "Agent" : agent?.user.role === 2 ? "Broker" : "N/A"}</p>
                              <p>Validity Date: {formatDateToMMDDYYYY(agent?.validation_date || "N/A")}</p>
                            </div>
                          </div>
                        </DialogDescription>
                        
                          <DialogClose asChild>
                            <Button className='bg-red-500 hover:bg-red-400'>
                              Close
                            </Button>
                          </DialogClose>
                       
                       
                      </DialogHeader>
                    </DialogContent>
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
        <p className='text-[#172554] text-sm w-full'>Showing 1 to {listtofAgents.length} of 57 entries</p>
      </div>
    </div>
  </div>
  
  )
}

export default ListOfBrokerAgent
