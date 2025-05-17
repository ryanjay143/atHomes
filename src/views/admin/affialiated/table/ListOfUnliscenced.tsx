import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from '../../../../plugin/axios';
import { useEffect, useState } from 'react';
import {formatDateToMMDDYYYYDateApproved } from "@/helper/dateUtils";
import ViewDetailsForUnlicensed from '../dialog/ViewDetailsForUnlicensed';
import UpdateLicensed from '../dialog/UpdateLicensed';



function ListOfUnliscenced() {
  const [listOfUnliscencedAgents, setAgentListUnliscenced] = useState<any[]>([]);
  const [entriesToShow, setEntriesToShow] = useState<number | 'all'>('all'); // Default to 'all'
  const [searchQuery, setSearchQuery] = useState<string>('');

  const agentUnliscenced = async () => {
    try {
      const response = await axios.get('agent-broker', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setAgentListUnliscenced(response.data.unlicensed);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    agentUnliscenced();
  }, []);

  const handleEntriesChange = (value: string) => {
    setEntriesToShow(value === 'all' ? 'all' : parseInt(value));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredAgents = listOfUnliscencedAgents.filter(agent => {
    const fullName = `${agent?.personal_info?.first_name} ${agent?.personal_info?.last_name}`.toLowerCase();
    const agentType = agent?.user?.role === 1 ? 'agent' : agent?.user?.role === 2 ? 'broker' : '';
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      agentType.includes(searchQuery.toLowerCase())
    );
  });

  const displayedAgents = entriesToShow === 'all' ? filteredAgents : filteredAgents.slice(0, entriesToShow);

  return (
    <div className='p-2'>
      <div className='py-2 flex flex-row justify-between'>
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
        <Input type='text' placeholder='Search' className='w-52 md:w-48' value={searchQuery} onChange={handleSearchChange} />
      </div>
      <div className="fade-in-left">
        <Table>
          <TableHeader className="bg-primary">
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
            {displayedAgents.length > 0 ? (
              displayedAgents.map((unlicensed: any, index: any) => (
                <TableRow key={unlicensed.id}>
                  <TableCell className="font-medium border border-[#bfdbfe]">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium border border-[#bfdbfe] uppercase">
                    {unlicensed?.personal_info?.first_name} {unlicensed.personal_info.middle_name} {unlicensed?.personal_info?.last_name}
                  </TableCell>
                  <TableCell className='border border-[#bfdbfe]'>
                    {unlicensed?.user?.role === 1 ? (
                      <span className="inline-flex unlicenseds-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                        Agent
                      </span>
                    ) : unlicensed?.user?.role === 2 ? (
                      <span className="inline-flex unlicenseds-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                        Broker
                      </span>
                    ) : (
                      unlicensed?.user?.role
                    )}
                  </TableCell>
                  <TableCell className='border border-[#bfdbfe]'>{unlicensed?.user?.email}</TableCell>
                  <TableCell className='border border-[#bfdbfe]'>{unlicensed?.personal_info?.phone}</TableCell>
                  <TableCell className='border border-[#bfdbfe]'>
                    {formatDateToMMDDYYYYDateApproved(unlicensed?.personal_info?.created_at)}
                  </TableCell>
                  <TableCell className="text-right border border-[#bfdbfe]">
                    <div className="flex flex-row gap-1 justify-end">
                      <ViewDetailsForUnlicensed unlicensed={unlicensed}/>

                      <UpdateLicensed unlicensed={unlicensed} agentUnliscenced={agentUnliscenced}/>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center border border-[#bfdbfe]"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-row justify-end mt-3">
        <div>
          <p className="text-[#172554] text-sm w-full">
            Showing 1 to {entriesToShow === 'all' ? filteredAgents.length : entriesToShow} of {filteredAgents.length} entries
          </p>
        </div>
      </div>
    </div>
  );
}

export default ListOfUnliscenced;