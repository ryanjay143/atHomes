import { useEffect, useState } from "react";
import axios from "./../../../../plugin/axios";
import { formatDateToMMDDYYYY } from "@/helper/dateUtils";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
        setPendingRegistered(e.data);
        console.log(e.data);
      })
      .catch((e: any) => {
        console.log(e);
      });
  }

  // Fetch data only once when the component mounts
  useEffect(() => {
    getPendingRegistered();
  }, []);

  // Filter data based on the search term
  const filteredData = pendingRegistered.filter((item: any) => {
    const fullname = `${item?.personal_info?.first_name} ${item?.personal_info?.last_name}`.toLowerCase();
    const type =
      item?.user?.role === 1
        ? "agent"
        : item?.user?.role === 2
        ? "broker"
        : item?.user?.role?.toString().toLowerCase();
    const email = item?.user?.email?.toLowerCase();
    const contactNumber = item?.personal_info?.phone?.toLowerCase();
    const dateRegistered = formatDateToMMDDYYYY(
      item?.personal_info?.created_at
    ).toLowerCase();

    return (
      fullname.includes(searchTerm.toLowerCase()) ||
      type.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      contactNumber.includes(searchTerm.toLowerCase()) ||
      dateRegistered.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-2">
      {/* Search and Select */}
      <div className="py-2 mt-10 flex flex-row justify-between">
        <Select>
          <SelectTrigger className="w-[120px] border border-primary">
            <span className="text-[#172554]">Show</span>
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="40">40</SelectItem>
            <SelectItem value="50">50</SelectItem>
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
            {filteredData?.length > 0 ? (
              filteredData?.map((item: any, index: any) => (
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
                    {formatDateToMMDDYYYY(item?.personal_info?.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-1 justify-center">
                      <Button className="w-8 h-8 rounded-xl border border-primary">
                        <FontAwesomeIcon
                          icon={faEye}
                          className="text-[#eff6ff]"
                        />
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
      <div className="flex flex-row justify-between mt-3">
        <div>
          <p className="text-[#172554] text-sm w-full">
            Showing 1 to 10 of {filteredData.length} entries
          </p>
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
    </div>
  );
}

export default ListOfPendingRegistered;