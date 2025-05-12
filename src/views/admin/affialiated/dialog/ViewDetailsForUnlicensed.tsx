import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatDateToMMDDYYYY } from "@/helper/dateUtils";

interface Unlicensed {
  personal_info: {
    first_name: string;
    middle_name?: string;
    last_name: string;
    phone: string;
    gender: string;
    complete_address: string;
  };
  user: {
    email: string;
    username: string;
    status: number;
    role: number;
  };
  prc_liscence_number?: string;
  dhsud_registration_number?: string;
  validation_date?: string;
}

function ViewDetailsForUnlicensed({ unlicensed }: { unlicensed: Unlicensed }) {
  return (
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
              <p>Name: {unlicensed?.personal_info?.first_name} {unlicensed?.personal_info?.middle_name} {unlicensed?.personal_info?.last_name}</p>
              <p>Email: {unlicensed?.user?.email}</p>
              <p>Username: {unlicensed?.user?.username}</p>
              <p>Phone: {unlicensed?.personal_info?.phone}</p>
              <p>Gender: {unlicensed.personal_info.gender.charAt(0).toUpperCase() + unlicensed.personal_info.gender.slice(1)}</p>
              <p>Complete Address: {unlicensed.personal_info.complete_address}</p>
              <p>Status: {unlicensed.user.status === 0 ? "Approved" : unlicensed.user.status === 1 ? "Pending" : "Decline"}</p>
            </div>
            <div className="text-start">
              <h2 className="text-lg font-bold ">Identity Information</h2>
              <p>PRC License Number: {unlicensed?.prc_liscence_number || "N/A"}</p>
              <p>DHSUD Registration Number: {unlicensed?.dhsud_registration_number || "N/A"}</p>
              <p>Type: {unlicensed?.user.role === 1 ? "Agent" : unlicensed?.user.role === 2 ? "Broker" : "N/A"}</p>
              <p>Validity Date: {formatDateToMMDDYYYY(unlicensed?.validation_date || "N/A")}</p>
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
  )
}

export default ViewDetailsForUnlicensed
