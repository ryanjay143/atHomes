import { useEffect, useState } from "react";
import axios from "./../../../../plugin/axios";
import { formatDateToMMDDYYYYDateRegistred } from "@/helper/dateUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ViewDetails from "../dialog/ViewDetails";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

function ListOfPendingRegistered() {
  const [pendingRegistered, setPendingRegistered] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [entriesToShow, setEntriesToShow] = useState<number | 'all'>('all'); // Default to 'all'

  // Fetch data from the API
  function getPendingRegistered() {
    axios
      .get("agent-broker", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((e: any) => {
        console.log('API Response:', e.data.pendingAgents); 
        setPendingRegistered(e.data.pendingAgents);
      })
      .catch((e: any) => {
        console.log(e);
      });
  }

  const deleteUser = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this user?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`agent-broker/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });
  
          Swal.fire({
            title: 'Deleted!',
            text: response.data.message,
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
  
          // Refresh the list after deleting the user
          getPendingRegistered();
        } catch (error) {
          console.error('Error deleting user:', error);
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while deleting the user.',
            icon: 'error',
            showConfirmButton: true,
          });
        }
      }
    });
  };

  // Fetch data only once when the component mounts
  useEffect(() => {
    getPendingRegistered();
  }, []);

  const handleEntriesChange = (value: string) => {
    setEntriesToShow(value === 'all' ? 'all' : parseInt(value));
  };

  const filteredPendingRegistered = pendingRegistered.filter(item => {
    const fullName = `${item?.personal_info?.first_name} ${item?.personal_info?.last_name}`.toLowerCase();
    const agentType = item?.user?.role === 1 ? 'agent' : item?.user?.role === 2 ? 'broker' : '';
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      agentType.includes(searchTerm.toLowerCase())
    );
  });

  const displayedPendingRegistered = entriesToShow === 'all' ? filteredPendingRegistered : filteredPendingRegistered.slice(0, entriesToShow);

  return (
    <div className="p-2">
      {/* Search and Select */}
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
        <Input type='text' 
          value={searchTerm} 
          placeholder='Search' 
          className='w-52 md:w-48' 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {/* Table */}
      <div className="fade-in-left">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Fullname</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Email address</TableHead>
              <TableHead>Contact number</TableHead>
              <TableHead>Date Registered</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedPendingRegistered.length > 0 ? (
              displayedPendingRegistered.map((item: any, index: any) => (
                <TableRow key={index}>
                  <TableCell className="font-medium capitalize border border-[#bfdbfe]">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium capitalize border border-[#bfdbfe]">
                    {item?.personal_info?.first_name} {item?.personal_info?.last_name}
                  </TableCell>
                  <TableCell className="border border-[#bfdbfe]">
                    {item?.user?.role === 1 ? (
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                        Agent
                      </span>
                    ) : item?.user?.role === 2 ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                        Broker
                      </span>
                    ) : (
                      item?.user?.role
                    )}
                  </TableCell>
                  <TableCell className="border border-[#bfdbfe]">{item?.user?.email}</TableCell>
                  <TableCell className="border border-[#bfdbfe]">{item?.personal_info?.phone}</TableCell>
                  <TableCell className="border border-[#bfdbfe]">
                    {formatDateToMMDDYYYYDateRegistred(item?.personal_info?.created_at)}
                  </TableCell>
                  <TableCell className="border border-[#bfdbfe]">
                    <div className="flex flex-row gap-1 justify-center">
                      <ViewDetails item={item} getPendingRegistered={getPendingRegistered} />
                      <Button className="w-8 h-8 rounded-md bg-red-500 hover:bg-hover-400" onClick={() => deleteUser(item.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
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

      {/* Pagination */}
      <div className="flex flex-row justify-end mt-3">
        <div>
          <p className="text-[#172554] text-sm w-full">
            Showing 1 to {entriesToShow === 'all' ? filteredPendingRegistered.length : entriesToShow} of {filteredPendingRegistered.length} entries
          </p>
        </div>
      </div>
    </div>
  );
}

export default ListOfPendingRegistered;