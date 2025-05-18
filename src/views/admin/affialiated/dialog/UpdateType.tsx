
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { faArrowRight, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';

function UpdateType({ agent, agentList }: any) {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    role: agent.user?.role?.toString() || '1',
  });

 const handleUpdateRole = async () => {
  if (loading) return;
  setLoading(true);

  try {
    const response = await axios.put(`editType/${agent.user.id}`, {
      role: formData.role,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    agentList();
    setIsDialogOpen(false);


    // Show success message
    Swal.fire({
      icon: "success",
      title: "Success",
      text: response.data.message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error('Error updating role:', error);

    // Show error message
    Swal.fire({
      icon: "error",
      title: "Oops",
      text: 'Failed to update role. Please try again.',
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
     {agent?.prc_liscence_number !== "" && (
        <DialogTrigger>
          <Button 
            className={`w-8 h-8 rounded-md ${
              agent?.prc_liscence_number === "" 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-green-500 hover:bg-green-400"
            }`}
            disabled={agent?.prc_liscence_number === ""}
          >
            <FontAwesomeIcon icon={faPen} className="text-[#eff6ff]" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='text-start'>Edit Type</DialogTitle>
          <DialogDescription>
            <div className='text-start flex flex-col gap-4 mt-5'>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="accnt">Account number</Label>
                <Input type="text" value={agent.user.acct_number} readOnly className='cursor-not-allowed' />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Fullname</Label>
                <Input type="text" value={`${agent.personal_info.first_name} ${agent.personal_info.middle_name} ${agent.personal_info.last_name} ${agent.personal_info.extension_name}`} readOnly className='cursor-not-allowed' />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input type="email" value={agent.user.email} readOnly className='cursor-not-allowed' />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="phone">Contact number</Label>
                <Input type="text" value={agent?.personal_info.phone} readOnly className='cursor-not-allowed' />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="type">Type</Label>
                <Select
                  name="role"
                  defaultValue={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="h-9 bg-white">
                    <SelectValue placeholder="Select Agent or Broker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Agent</SelectItem>
                    <SelectItem value="2">Broker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex justify-end w-full gap-2'>
                <Button className='w-full bg-green-500 hover:bg-green-400' onClick={handleUpdateRole} disabled={loading}>
                  {loading ? (
                    <>
                        <span>Updating...</span>
                        <span className="animate-spin border-2 cursor-not-allowed border-white border-t-transparent rounded-full w-4 h-4" />
                    </>
                    ) : (
                    <>
                        <FontAwesomeIcon icon={faArrowRight} />
                        <span className='text-[#eff6ff]'>Update</span>
                    </>
                    )}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateType;
