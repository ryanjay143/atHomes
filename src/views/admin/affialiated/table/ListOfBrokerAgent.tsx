import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFileCircleXmark, faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from '../../../../plugin/axios';
import { useEffect, useState } from 'react';
import { formatDateToMMDDYYYY, formatDateToMMDDYYYYDateApproved } from "@/helper/dateUtils";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import UpdateType from '../dialog/UpdateType';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function ListOfBrokerAgent() {
  const [listtofAgents, setAgentList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search input
  const [entriesToShow, setEntriesToShow] = useState<number | 'all'>('all'); // Default to 'all'
  const navigate = useNavigate();

  const agentList = async () => {
    try {
      const response = await axios.get('agent-broker', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      // console.log('API Response:', response);
      // console.log('List of Approved:', response.data.agentList);
      setAgentList(response.data.agentList);
    } catch (error) {

      console.error('Error fetching agent and broker:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetching agent and broker. Please login again.',
        confirmButtonText: 'OK',
      })
      localStorage.clear();
      console.clear();
      navigate('/');
    }
  };

  useEffect(() => {
    agentList();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleEntriesChange = (value: string) => {
    setEntriesToShow(value === 'all' ? 'all' : parseInt(value));
  };

  const filteredAgents = listtofAgents.filter(agent => {
    const acctNumber = `${agent?.user?.acct_number}`.toLowerCase();
    const fullName = `${agent?.personal_info?.first_name} ${agent?.personal_info?.middle_name} ${agent?.personal_info?.last_name} ${agent?.personal_info?.extension_name}`.toLowerCase();
    const agentType = agent?.user?.role === 1 ? 'agent' : agent?.user?.role === 2 ? 'broker' : '';
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      agentType.includes(searchQuery.toLowerCase()) || 
      acctNumber.includes(searchQuery.toLowerCase())
    );
  });

  const displayedAgents = entriesToShow === 'all' ? filteredAgents : filteredAgents.slice(0, entriesToShow);

  return (
  <div className='p-2'>
      <div className='py-2 flex flex-row justify-between gap-4'>
        <Select onValueChange={handleEntriesChange}>
          <SelectTrigger className="w-[120px] border border-primary md:w-28">
            <span className='text-[#172554]'>Show</span>
            <SelectValue placeholder="All" /> {/* Default placeholder to "All" */}
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
        <Input type='text' placeholder='Search' className='w-52 md:w-full' value={searchQuery} onChange={handleSearchChange} />
      </div>
      <div className="fade-in-left">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              {/* <TableHead>Account number</TableHead> */}
              <TableHead>Fullname</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Email address</TableHead>
              <TableHead>Contact number</TableHead>
              <TableHead>Date Approved</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedAgents.length > 0 ? (
              displayedAgents.map((agent: any, index: any) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium border border-[#bfdbfe]">{index + 1}</TableCell>
                  {/* <TableCell className="border border-[#bfdbfe]">{agent.user.acct_number}</TableCell> */}
                  <TableCell className="border border-[#bfdbfe] uppercase">{agent.personal_info.first_name} {agent.personal_info.middle_name} {agent.personal_info.last_name} {agent.personal_info.extension_name}</TableCell>
                  <TableCell className="font-medium border border-[#bfdbfe]">
                    {agent?.user?.role === 1 ? (
                      <span className="inline-flex unlicenseds-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                        Agent
                      </span>
                    ) : agent?.user?.role === 2 ? (
                      <span className="inline-flex unlicenseds-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                        Broker
                      </span>
                    ) : (
                      agent?.user?.role
                    )}
                  </TableCell>
                  <TableCell className="border border-[#bfdbfe]">{agent?.user.email}</TableCell>
                  <TableCell className="border border-[#bfdbfe]">{agent?.personal_info.phone}</TableCell>
                  <TableCell className="border border-[#bfdbfe]">{formatDateToMMDDYYYYDateApproved(agent?.user.updated_at)}</TableCell>
                  <TableCell className="border border-[#bfdbfe]">
                    {(() => {
                      const prc = agent?.prc_liscence_number?.trim();
                      const isUnlicensed =
                        !prc ||
                        prc.toUpperCase() === "N/A" ||
                        prc.toUpperCase() === "NA" ||
                        prc.length < 4 || 
                        prc.toLowerCase() === "n/a" ||
                        prc.toLowerCase() === "na" ||
                        prc.toLowerCase() === "";

                      if (isUnlicensed) {
                        return (
                          <Badge className="bg-red-500 hover:bg-red-500 gap-1">
                            <FontAwesomeIcon icon={faFileCircleXmark} />
                            Unlicensed
                          </Badge>
                        );
                      } else {
                        return (
                          <Badge className="bg-green-500 hover:bg-green-500 gap-1">
                            <FontAwesomeIcon icon={faIdBadge} /> Licensed
                          </Badge>
                        );
                      }
                    })()}
                  </TableCell>
                  <TableCell className="text-right border border-[#bfdbfe]">
                    <div className="flex flex-row gap-1 justify-end">
                      <Dialog>
                        <DialogTrigger>
                          <Button className="w-8 h-8 rounded-md">
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
                                  <p>Account number: {agent?.user.acct_number}</p>
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

                      

                      <UpdateType agent={agent} agentList={agentList} />

                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center border border-[#bfdbfe]"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-row justify-end mt-3'>
        <div>
          <p className='text-[#172554] text-sm w-full'>Showing 1 to {entriesToShow === 'all' ? filteredAgents.length : entriesToShow} of {filteredAgents.length} entries</p>
        </div>
      </div>
    </div>
  );
}

export default ListOfBrokerAgent;