import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { faCheck, faEye, faUser, faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDateToMMDDYYYY } from "@/helper/dateUtils";
import Swal from 'sweetalert2';
import { useState } from 'react';

interface ViewDetailsProps {
  item: any;
  getPendingRegistered: () => void;
}

function ViewDetails({ item, getPendingRegistered }: ViewDetailsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.put(`agent-broker/${item.user.id}`, {
        status: 0
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setIsDialogOpen(false);

      Swal.fire({
        title: 'Success',
        text: response.data.message,
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      getPendingRegistered();

    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Status badge color
  const statusBadge = (status: number) => {
    if (status === 0)
      return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Approved</span>;
    if (status === 1)
      return <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">Pending</span>;
    return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Declined</span>;
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Button className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200">
          <FontAwesomeIcon
            icon={faEye}
            className="text-white"
          />
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
                    <span className="font-semibold">Name:</span> {item?.personal_info?.first_name} {item?.personal_info?.last_name}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span> {item?.user?.email}
                  </div>
                  <div>
                    <span className="font-semibold">Username:</span> {item?.user?.username}
                  </div>
                  <div>
                    <span className="font-semibold">Phone:</span> {item?.personal_info?.phone}
                  </div>
                  <div>
                    <span className="font-semibold">Gender:</span> {item.personal_info.gender.charAt(0).toUpperCase() + item.personal_info.gender.slice(1)}
                  </div>
                  <div>
                    <span className="font-semibold">Complete Address:</span> {item.personal_info.complete_address}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    {statusBadge(item.user.status)}
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
                    <span className="font-semibold">PRC License Number:</span> {item?.prc_liscence_number || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">DHSUD Reg. #:</span> {item?.dhsud_registration_number || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Type:</span> {item?.user.role === 1 ? "Agent" : item?.user.role === 2 ? "Broker" : "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Validity Date:</span> {formatDateToMMDDYYYY(item?.validation_date || "N/A")}
                  </div>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className='flex flex-row gap-2 justify-end'>
            <DialogClose asChild>
              <Button className='bg-red-500 hover:bg-red-400 rounded-lg shadow'>
                Cancel
              </Button>
            </DialogClose>
            <Button className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-lg shadow flex items-center gap-2"
              type="button"
              onClick={updateStatus}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>Approving...</span>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Approve</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewDetails;