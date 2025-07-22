import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { faArrowRight, faPen, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';

function UpdateType({ agent, agentList }: any) {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
  role: agent.user?.role?.toString() ?? '1', // Use ?? instead of ||
});

  const handleUpdateRole = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.put(
        `editType/${agent.user.id}`,
        { role: formData.role },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      agentList();
      setIsDialogOpen(false);

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
      <DialogTrigger>
        <Button
          className='w-8 h-8 rounded-md bg-gradient-to-r from-green-400 to-green-600 shadow hover:from-green-500 hover:to-green-700 transition-all duration-200'
          title="Edit Type">
          <FontAwesomeIcon icon={faPen} className="text-white" />
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[430px] rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-start text-2xl font-bold text-blue-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faUserTag} className="text-blue-500" />
            Edit Type
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-5 mt-6 text-start">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="accnt" className="font-semibold text-blue-900">Account Number</Label>
                <Input
                  type="text"
                  value={agent.user.acct_number}
                  readOnly
                  className="cursor-not-allowed rounded-lg border-blue-200 bg-gray-100"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name" className="font-semibold text-blue-900">Full Name</Label>
                <Input
                  type="text"
                  value={`${agent.personal_info.first_name} ${agent.personal_info.middle_name} ${agent.personal_info.last_name} ${agent.personal_info.extension_name}`}
                  readOnly
                  className="cursor-not-allowed rounded-lg border-blue-200 bg-gray-100"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email" className="font-semibold text-blue-900">Email Address</Label>
                <Input
                  type="email"
                  value={agent.user.email}
                  readOnly
                  className="cursor-not-allowed rounded-lg border-blue-200 bg-gray-100"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="phone" className="font-semibold text-blue-900">Contact Number</Label>
                <Input
                  type="text"
                  value={agent?.personal_info.phone}
                  readOnly
                  className="cursor-not-allowed rounded-lg border-blue-200 bg-gray-100"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="type" className="font-semibold text-blue-900">User Role:</Label>
                <Select
  name="role"
  value={formData.role}
  onValueChange={(value) => setFormData({ ...formData, role: value })}
>
  <SelectTrigger className="h-9 bg-white rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
    <SelectValue placeholder="Select Agent or Broker" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Agent</SelectItem>
    <SelectItem value="2">Broker</SelectItem>
    <SelectItem value="0">Admin</SelectItem>
  </SelectContent>
</Select>
              </div>
              <div className="flex justify-end w-full gap-2 mt-2">
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow hover:from-green-600 hover:to-green-800 flex items-center justify-center gap-2"
                  onClick={handleUpdateRole}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span>Updating...</span>
                      <span className="animate-spin border-2 cursor-not-allowed border-white border-t-transparent rounded-full w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faArrowRight} />
                      <span>Update</span>
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