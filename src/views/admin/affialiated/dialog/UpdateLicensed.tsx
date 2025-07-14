import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { faArrowRight, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../../../../plugin/axios';
import Swal from 'sweetalert2';

function formatDateToYYYYMMDD(dateString: string): string {
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
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
    
    

    if (!validateFields()) {
      return;

      
    }

    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.put(`editLicense/${unlicensed.id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      // console.log('License updated successfully:', response.data.message);
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
        <Button className="w-8 h-8 rounded-md bg-green-500 hover:bg-green-400">
          <FontAwesomeIcon icon={faPen} />
        </Button>
      </DialogTrigger>
      <DialogContent className='md:w-[90%]'>
        <DialogHeader>
          <DialogTitle className='text-start'>Update License</DialogTitle>
          <DialogDescription>
            <div className='text-start mt-5 grid gap-4 py-4'>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="fullname">Fullname</Label>
                <Input className='cursor-not-allowed' value={`${unlicensed?.personal_info?.first_name} ${unlicensed.personal_info.middle_name} ${unlicensed?.personal_info?.last_name}`} readOnly />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="prc_liscence_number">PRC License Number</Label>
                <Input
                  name="prc_liscence_number"
                  placeholder="Enter PRC License No:"
                  value={formData.prc_liscence_number}
                  onChange={handleChange}
                />
                {errors.prc_liscence_number && <span className="text-red-500 text-sm">{errors.prc_liscence_number}</span>}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="dhsud_registration_number">DHSUD Registration Number</Label>
                <Input
                  name="dhsud_registration_number"
                  placeholder="Enter DHSUD Registration No:"
                  value={formData.dhsud_registration_number}
                  onChange={handleChange}
                />
                {errors.dhsud_registration_number && <span className="text-red-500 text-sm">{errors.dhsud_registration_number}</span>}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="validation_date">Validity Date</Label>
                <Input
                  type="date"
                  name="validation_date"
                  value={formData.validation_date}
                  onChange={handleChange}
                />
                {errors.validation_date && <span className="text-red-500 text-sm">{errors.validation_date}</span>}
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
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className='bg-green-500 hover:bg-green-400' type="button" onClick={handleSubmit} disabled={loading}>

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