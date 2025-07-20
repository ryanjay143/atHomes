import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { faEye, faUser, faIdBadge } from '@fortawesome/free-solid-svg-icons'
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
  // Status badge color
  const statusBadge = (status: number) => {
    if (status === 0)
      return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Approved</span>;
    if (status === 1)
      return <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">Pending</span>;
    return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Declined</span>;
  };

  // Type badge
  const typeBadge = (role: number) => {
    if (role === 1)
      return <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-700/10 ring-inset">Agent</span>;
    if (role === 2)
      return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-600/20 ring-inset">Broker</span>;
    return <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600 ring-1 ring-gray-400/20 ring-inset">N/A</span>;
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200">
          <FontAwesomeIcon icon={faEye} className="text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[420px] rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border border-blue-200">
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
                    <span className="font-semibold">Name:</span> {unlicensed?.personal_info?.first_name} {unlicensed?.personal_info?.middle_name} {unlicensed?.personal_info?.last_name}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span> {unlicensed?.user?.email}
                  </div>
                  <div>
                    <span className="font-semibold">Username:</span> {unlicensed?.user?.username}
                  </div>
                  <div>
                    <span className="font-semibold">Phone:</span> {unlicensed?.personal_info?.phone}
                  </div>
                  <div>
                    <span className="font-semibold">Gender:</span> {unlicensed.personal_info.gender.charAt(0).toUpperCase() + unlicensed.personal_info.gender.slice(1)}
                  </div>
                  <div>
                    <span className="font-semibold">Complete Address:</span> {unlicensed.personal_info.complete_address}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    {statusBadge(unlicensed.user.status)}
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
                    <span className="font-semibold">PRC License Number:</span> {unlicensed?.prc_liscence_number || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">DHSUD Reg. #:</span> {unlicensed?.dhsud_registration_number || "N/A"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Type:</span> {typeBadge(unlicensed?.user.role)}
                  </div>
                  <div>
                    <span className="font-semibold">Validity Date:</span> {formatDateToMMDDYYYY(unlicensed?.validation_date || "N/A")}
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
  )
}

export default ViewDetailsForUnlicensed