import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faIdBadge, faUser } from '@fortawesome/free-solid-svg-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axios from '../../../../plugin/axios';
import { useEffect, useState } from 'react';
import { formatDateToMMDDYYYYDateApproved, formatDateToMMDDYYYY } from "@/helper/dateUtils";

function ListOfLiscenced() {
  const [listOfAgentsLicensed, setAgentListLicensed] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [entriesToShow, setEntriesToShow] = useState<number | 'all'>('all'); // Default to 'all'

  const agentListLicensed = async () => {
    try {
      const response = await axios.get('agent-broker', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      // console.log('List of Licensed Agent:', response.data.agentsLicensed);
      setAgentListLicensed(response.data.agentsLicensed);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    agentListLicensed();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleEntriesChange = (value: string) => {
    setEntriesToShow(value === 'all' ? 'all' : parseInt(value));
  };

  const filteredAgents = listOfAgentsLicensed.filter(agent => {
    const licensed = `${agent.prc_liscence_number}`.toLowerCase();
    const fullName = `${agent?.personal_info?.first_name} ${agent?.personal_info?.middle_name} ${agent?.personal_info?.last_name} ${agent?.personal_info?.extension_name}`.toLowerCase();
    const agentType = agent?.user?.role === 1 ? 'agent' : agent?.user?.role === 2 ? 'broker' : '';
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      agentType.includes(searchQuery.toLowerCase()) ||
      licensed.includes(searchQuery.toLowerCase())
    );
  });

  const displayedAgents = entriesToShow === 'all' ? filteredAgents : filteredAgents.slice(0, entriesToShow);

  // Status badge color
  const statusBadge = (status: number) => {
    if (status === 0)
      return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Approved</span>;
    if (status === 1)
      return <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">Pending</span>;
    return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Declined</span>;
  };


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
              <TableHead>Licensed No.</TableHead>
              <TableHead>Fullname</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Email address</TableHead>
              <TableHead>Contact number</TableHead>
              <TableHead>Date Approved</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedAgents.length > 0 ? (
              displayedAgents.map((licensed: any, index: any) => (
                <TableRow key={licensed.id}>
                  <TableCell className="font-medium border border-[#bfdbfe]">{index + 1}</TableCell>
                  <TableCell className="border border-[#bfdbfe] uppercase">{licensed.prc_liscence_number}</TableCell>
                  <TableCell className="font-medium border border-[#bfdbfe] uppercase">{licensed.personal_info.first_name} {licensed.personal_info.middle_name} {licensed.personal_info.last_name} {licensed.personal_info.extension_name}</TableCell>
                  <TableCell className="border border-[#bfdbfe]">
                    {licensed?.user?.role === 1 ? (
                      <span className="inline-flex unlicenseds-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                        Agent
                      </span>
                    ) : licensed?.user?.role === 2 ? (
                      <span className="inline-flex unlicenseds-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                        Broker
                      </span>
                    ) : (
                      licensed?.user?.role
                    )}
                  </TableCell>
                  <TableCell className="border border-[#bfdbfe]">{licensed.user.email}</TableCell>
                  <TableCell className="border border-[#bfdbfe]">{licensed.personal_info.phone}</TableCell>
                  <TableCell className="border border-[#bfdbfe]">{formatDateToMMDDYYYYDateApproved(licensed?.user.updated_at)}</TableCell>
                  <TableCell className="text-right border border-[#bfdbfe]">
                    <div className="flex flex-row gap-1 justify-end">
                      <Dialog>
                          <DialogTrigger>
                            <Button className="w-8 h-8 rounded-md border border-primary bg-gradient-to-br from-blue-500 to-blue-700 shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200">
                              <FontAwesomeIcon icon={faEye} className="text-white" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="md:max-w-[400px] rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border border-blue-200">
                            <DialogHeader>
                              <DialogTitle className="text-start text-2xl font-bold text-blue-900 flex items-center gap-2">
                                <FontAwesomeIcon icon={faIdBadge} className="text-blue-500" />
                                Agent & Broker Details
                              </DialogTitle>
                              <DialogDescription>
                                <div className="flex flex-col gap-6 mt-6 mb-4">
                                  {/* Personal Details */}
                                  <div className="border-b pb-4 mb-2 text-start">
                                    <div className="flex items-center gap-2 mb-2">
                                      <FontAwesomeIcon icon={faUser} className="text-blue-400" />
                                      <h2 className="text-lg font-bold text-blue-800">Personal Details</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1 text-sm text-gray-700">
                                      <div>
                                        <span className="font-semibold">Name:</span> {licensed?.personal_info?.first_name} {licensed?.personal_info?.middle_name} {licensed?.personal_info?.last_name}
                                      </div>
                                      <div>
                                        <span className="font-semibold">Email:</span> {licensed?.user?.email}
                                      </div>
                                      <div>
                                        <span className="font-semibold">Username:</span> {licensed?.user?.username}
                                      </div>
                                      <div>
                                        <span className="font-semibold">Phone:</span> {licensed?.personal_info?.phone}
                                      </div>
                                      <div>
                                        <span className="font-semibold">Gender:</span> {licensed.personal_info.gender.charAt(0).toUpperCase() + licensed.personal_info.gender.slice(1)}
                                      </div>
                                      <div>
                                        <span className="font-semibold">Complete Address:</span> {licensed.personal_info.complete_address}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold">Status:</span>
                                        {statusBadge(licensed.user.status)}
                                      </div>
                                    </div>
                                  </div>
                                  {/* Identity Information */}
                                  <div className="text-start">
                                    <div className="flex items-center gap-2 mb-2">
                                      <FontAwesomeIcon icon={faIdBadge} className="text-blue-400" />
                                      <h2 className="text-lg font-bold text-blue-800">Identity Information</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1 text-sm text-gray-700">
                                      <div>
                                        <span className="font-semibold">PRC License Number:</span> {licensed?.prc_liscence_number || "N/A"}
                                      </div>
                                      <div>
                                        <span className="font-semibold">DHSUD Reg. #:</span> {licensed?.dhsud_registration_number || "N/A"}
                                      </div>
                                      <div>
                                        <span className="font-semibold">Type:</span> {licensed?.user.role === 1 ? "Agent" : licensed?.user.role === 2 ? "Broker" : "N/A"}
                                      </div>
                                      <div>
                                        <span className="font-semibold">Validity Date:</span> {formatDateToMMDDYYYY(licensed?.validation_date || "N/A")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogDescription>
                              <DialogClose asChild>
                                <Button className='bg-red-500 hover:bg-red-400 rounded-lg shadow'>
                                  Close
                                </Button>
                              </DialogClose>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
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

export default ListOfLiscenced;