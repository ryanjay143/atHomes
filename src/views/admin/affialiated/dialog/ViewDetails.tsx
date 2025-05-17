import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { faCheck, faEye } from '@fortawesome/free-solid-svg-icons';
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

      // Refresh the list after updating the status
      getPendingRegistered();

    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setLoading(false);
  }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Button className="w-8 h-8 rounded-md">
          <FontAwesomeIcon
            icon={faEye}
            className="text-[#eff6ff]"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-start">Agent and Broker Details</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-4 mt-5">
              <div className="border-b pb-2 mb-4 text-start">
                <h2 className="text-lg font-bold">Personal Details</h2>
                <p>Name: {item?.personal_info?.first_name} {item?.personal_info?.last_name}</p>
                <p>Email: {item?.user?.email}</p>
                <p>Username: {item?.user?.username}</p>
                <p>Phone: {item?.personal_info?.phone}</p>
                <p>Gender: {item.personal_info.gender.charAt(0).toUpperCase() + item.personal_info.gender.slice(1)}</p>
                <p>Complete Address: {item.personal_info.complete_address}</p>
                <p>Status: {item.user.status === 0 ? "Approved" : item.user.status === 1 ? "Pending" : "Decline"}</p>
              </div>
              <div className="text-start">
                <h2 className="text-lg font-bold ">Identity Information</h2>
                <p>PRC License Number: {item?.prc_liscence_number || "N/A"}</p>
                <p>DHSUD Registration Number: {item?.dhsud_registration_number || "N/A"}</p>
                <p>Type: {item?.user.role === 1 ? "Agent" : item?.user.role === 2 ? "Broker" : "N/A"}</p>
                <p>Validity Date: {formatDateToMMDDYYYY(item?.validation_date || "N/A")}</p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className='flex flex-row gap-2 justify-end'>
            <DialogClose asChild>
              <Button className='bg-red-500 hover:bg-red-400'>
                Cancel
              </Button>
            </DialogClose>
          
          <Button className="bg-green-500 hover:bg-green-400" type="button" onClick={updateStatus} disabled={loading}>
            
            {loading ? (
                <>
                  <span>Approved...</span>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Approved</span>
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