import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen } from '@fortawesome/free-solid-svg-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';


function ListOfLiscenced() {
  return (
    <div className='p-2'>
    <div className='py-2 mt-10 flex flex-row justify-between'>
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
      <Input type='text' placeholder='Search' className='w-52 '/>
    </div>
    <div className='h-full overflow-auto fade-in-left'>
      <Table className='w-full'>
        <TableHeader className="sticky top-0 bg-primary">
          <TableRow>
            <TableHead className="w-[100px] border border-[#bfdbfe] text-accent font-bold bg-primary">Invoice</TableHead>
            <TableHead className='border border-[#bfdbfe] text-accent font-bold bg-primary'>Status</TableHead>
            <TableHead className='border border-[#bfdbfe] text-accent font-bold bg-primary'>Method</TableHead>
            <TableHead className="text-right border border-[#bfdbfe] text-accent font-bold bg-primary">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium border border-[#bfdbfe]">INV001000</TableCell>
            <TableCell className='border border-[#bfdbfe]'>Paid000</TableCell>
            <TableCell className='border border-[#bfdbfe]'>Credit Card000</TableCell>
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
    </div>
    </div>
  )
}

export default ListOfLiscenced
