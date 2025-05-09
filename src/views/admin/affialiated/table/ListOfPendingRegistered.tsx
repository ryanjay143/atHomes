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
  const [pendingRegistered, setPendingRegistered] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // Fetch data from the API
  function getPendingRegistered() {
    axios
      .get("agent-broker", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then((e: any) => {
        console.log('API Response:', e.data.agent); // Log the response
        setPendingRegistered(e.data.agent);
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
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
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

  return (
    <div className="p-2">
      {/* Search and Select */}
      <div className="py-2 flex flex-row justify-between">
        <Select>
          <SelectTrigger className="w-[120px] border border-primary">
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
        <Input
          type="text"
          placeholder="Search"
          className="w-52"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
      </div>

      {/* Table */}
      <div className="fade-in-left">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead>Fullname</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Email address</TableHead>
              <TableHead>Contact number</TableHead>
              <TableHead>Date Registered</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingRegistered?.length > 0 ? (
              pendingRegistered?.map((item: any, index: any) => (
                <TableRow key={index}>
                  <TableCell className="font-medium capitalize">
                    {item?.personal_info?.first_name} {item?.personal_info?.last_name}
                  </TableCell>
                  <TableCell>
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
                  <TableCell>{item?.user?.email}</TableCell>
                  <TableCell>{item?.personal_info?.phone}</TableCell>
                  <TableCell>
                    {formatDateToMMDDYYYYDateRegistred(item?.personal_info?.created_at)}
                  </TableCell>
                  <TableCell>
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
                  colSpan={6}
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
            Showing 1 to 10 of {pendingRegistered.length} entries
          </p>
        </div>
      </div>
    </div>
  );
}

export default ListOfPendingRegistered;