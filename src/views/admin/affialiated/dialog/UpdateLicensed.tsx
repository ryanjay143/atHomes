import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { faArrowRight, faPen, faIdBadge, faCalendarAlt, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../../../../plugin/axios';
import Swal from 'sweetalert2';

function formatDateToYYYYMMDD(dateString: string): string {
  // Accepts "dd-mm-yyyy" or "yyyy-mm-dd" and returns "yyyy-mm-dd"
  if (!dateString) return "";
  if (dateString.includes('-')) {
    const parts = dateString.split('-');
    if (parts[0].length === 4) return dateString; // already yyyy-mm-dd
    // else dd-mm-yyyy
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateString;
}

interface Unlicensed {
  id: string;
  personal_info: {
    first_name: string;
    middle_name: string;
    last_name: string;
  };
  validation_date?: string;
  user?: {
    role?: number;
  };
}

interface UpdateLicensedProps {
  unlicensed: Unlicensed;
  agentUnliscenced: () => void;
}

function UpdateLicensed({ unlicensed, agentUnliscenced }: UpdateLicensedProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    prc_liscence_number: '',
    dhsud_registration_number: '',
    validation_date: unlicensed.validation_date ? formatDateToYYYYMMDD(unlicensed.validation_date) : '',
    role: unlicensed.user?.role?.toString() || '1',
  });

  const [errors, setErrors] = useState({
    prc_liscence_number: '',
    dhsud_registration_number: '',
    validation_date: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error when user starts typing
  };

  const validateFields = () => {
    const newErrors = {
      prc_liscence_number: formData.prc_liscence_number ? '' : 'PRC License Number is required.',
      dhsud_registration_number: formData.dhsud_registration_number ? '' : 'DHSUD Registration Number is required.',
      validation_date: formData.validation_date ? '' : 'Validity Date is required.',
    };
    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.put(`editLicense/${unlicensed.id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      agentUnliscenced();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error('Error updating license:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update license. Please try again.",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-8 h-8 rounded-md bg-gradient-to-r from-green-400 to-green-600 shadow hover:from-green-500 hover:to-green-700 transition-all duration-200">
          <FontAwesomeIcon icon={faPen} className="text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[420px] rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-start text-2xl font-bold text-blue-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faIdBadge} className="text-blue-500" />
            Update License
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-6 mt-6 mb-4">
              <div className="border-b pb-4 mb-2 text-start">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faUserTie} className="text-blue-400" />
                  <h2 className="text-lg font-bold text-blue-800">Personal Details</h2>
                </div>
                <div className="grid grid-cols-1 gap-1 text-sm text-gray-700">
                  <div>
                    <span className="font-semibold">Full Name:</span>{" "}
                    {`${unlicensed?.personal_info?.first_name} ${unlicensed.personal_info.middle_name} ${unlicensed?.personal_info?.last_name}`}
                  </div>
                </div>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="prc_liscence_number" className="font-semibold text-blue-900 text-start">PRC License Number</Label>
                <Input
                  name="prc_liscence_number"
                  placeholder="Enter PRC License No:"
                  value={formData.prc_liscence_number}
                  onChange={handleChange}
                  className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                {errors.prc_liscence_number && <span className="text-red-500 text-xs">{errors.prc_liscence_number}</span>}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="dhsud_registration_number" className="font-semibold text-blue-900 text-start">DHSUD Registration Number</Label>
                <Input
                  name="dhsud_registration_number"
                  placeholder="Enter DHSUD Registration No:"
                  value={formData.dhsud_registration_number}
                  onChange={handleChange}
                  className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                {errors.dhsud_registration_number && <span className="text-red-500 text-xs">{errors.dhsud_registration_number}</span>}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="validation_date" className="font-semibold text-blue-900 text-start">Validity Date</Label>
                <div className="relative">
                  <Input
                    type="date"
                    name="validation_date"
                    value={formData.validation_date}
                    onChange={handleChange}
                    className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-10"
                  />
                  <FontAwesomeIcon icon={faCalendarAlt} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
                </div>
                {errors.validation_date && <span className="text-red-500 text-xs">{errors.validation_date}</span>}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="type" className="font-semibold text-blue-900 text-start">Type</Label>
                <Select
                  name="role"
                  defaultValue={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="h-9 bg-white rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                    <SelectValue placeholder="Select Agent or Broker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Agent</SelectItem>
                    <SelectItem value="2">Broker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className='bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-lg shadow flex items-center gap-2'
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span>Saving...</span>
                <span className="animate-spin border-2 cursor-not-allowed border-white border-t-transparent rounded-full w-4 h-4" />
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faArrowRight} />
                <span>Save changes</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateLicensed;