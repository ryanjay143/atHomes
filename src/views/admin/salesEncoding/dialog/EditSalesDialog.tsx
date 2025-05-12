import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import axios from "../../../../plugin/axios";
import { NumericFormat } from 'react-number-format';

interface Agent {
  id: string;
  personal_info: {
    first_name: string;
    middle_name: string;
    last_name: string;
    extension_name?: string;
  };
}

interface SalesEncoding {
  id: number;
  agent: Agent;
  category: string;
  date_on_sale: string;
  amount: number;
  location: string;
  remarks: string;
  image: string;
  client_name: string; // Make client_name optional
}

interface EditSalesDialogProps {
  sales: SalesEncoding;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getAgentBroker: Agent[];
  fetchAgent: () => void;
}

const EditSalesDialog: React.FC<EditSalesDialogProps> = ({
  sales, open, onOpenChange, getAgentBroker, fetchAgent
}) => {
  const defaultImageUrl = `${import.meta.env.VITE_URL}/${sales.image}`; // Default image URL
  const [agentId, setAgentId] = useState(sales.agent?.id ? String(sales.agent.id) : '');
  const [category, setCategory] = useState(sales.category || '');
  const [dateOnSale, setDateOnSale] = useState(sales.date_on_sale?.split('T')[0] || '');
  const [amount, setAmount] = useState(sales.amount.toString() || '');
  const [location, setLocation] = useState(sales.location || '');
  const [preview, setPreview] = useState<string>(defaultImageUrl);
  const [remarks, setRemarks] = useState(sales.remarks || '');
  const [clientName, setClientName] = useState(sales.client_name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // Track the selected image file

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const validExtensions = ['image/jpeg', 'image/png', 'image/gif'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!file.type.startsWith('image/') || !validExtensions.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select a valid image file (JPEG, PNG, or GIF).',
      });
      return;
    }

    if (file.size > maxFileSize) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'The selected file exceeds the maximum size of 5MB.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setPreview(reader.result);
        setImageFile(file); // Set the selected image file
      }
    };
    reader.readAsDataURL(file);
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Invalid File',
      text: 'Please select a valid image file.',
    });
  }
};

  const handleRemoveImage = () => {
    setPreview(defaultImageUrl); // Reset to default image
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
    setImageFile(null); // Clear the image file
  };

  useEffect(() => {
    if (open) {
      setAgentId(sales.agent?.id ? String(sales.agent.id) : '');
      setCategory(sales.category || '');
      setDateOnSale(sales.date_on_sale?.split('T')[0] || '');
      setAmount(sales.amount.toString() || '');
      setLocation(sales.location || '');
      setRemarks(sales.remarks || '');
      setClientName(sales.client_name || '');
      setPreview(defaultImageUrl); // Initialize preview with default image
      setError(null);
      setImageFile(null); // Reset image file
    }
    // eslint-disable-next-line
  }, [open, sales]);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
  
    try {
      // Create a FormData object to handle the payload
      const formData = new FormData();
      formData.append('agent_id', agentId);
      formData.append('category', category);
      formData.append('date_on_sale', dateOnSale);
      formData.append('amount', amount);
      formData.append('location', location);
      formData.append('remarks', remarks);
      formData.append('client_name', clientName);
  
      // Append the image file only if a new one is selected
      if (imageFile) {
        formData.append('image', imageFile); // Append the new image file
      }
  
      // Debugging: Log FormData entries
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      const response = await axios.post(
        `updateSalesEncoding/${sales.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            'Content-Type': 'multipart/form-data', // Ensure the correct content type
          },
        }
      );
  
      if (response.status === 200) {
        onOpenChange(false);
        setAmount('');
        fetchAgent();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Sales encoding updated successfully!',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError('An error occurred while updating.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAmount = (values: any) => {
    const { value } = values;
    setAmount(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[425px] h-full max-h-[700px] overflow-auto">
        <DialogHeader className='text-start'>
          <DialogTitle>Edit Sales Encoding</DialogTitle>
          <DialogDescription>
            Make changes to your sales here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="agent" className="text-start">
                Agent/Broker
              </Label>
              <Select
                value={agentId}
                onValueChange={setAgentId}
              >
                <SelectTrigger className="col-span-3 uppercase ">
                  <SelectValue className='' placeholder="Choose agent or broker" />
                </SelectTrigger>
                <SelectContent>
                  {getAgentBroker.map((agent) => (
                    <SelectItem className='uppercase' key={agent.id} value={String(agent.id)}>
                      {agent.personal_info.first_name} {agent.personal_info.middle_name} {agent.personal_info.last_name} {agent.personal_info.extension_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-start">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lot only">Lot only</SelectItem>
                  <SelectItem value="House and lot">House and lot</SelectItem>
                  <SelectItem value="Condominium/Apartment">Condominium/Apartment</SelectItem>
                  <SelectItem value="Commercial Properties">Commercial Properties</SelectItem>
                  <SelectItem value="Rental Properties">Rental Properties</SelectItem>
                  <SelectItem value="Farm Lot">Farm Lot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client_name" className="text-start">
                Client Name:
              </Label>
              <Input
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date_on_sale" className="text-start">
                Date
              </Label>
              <Input
                type="date"
                value={dateOnSale}
                onChange={e => setDateOnSale(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-start">
                Amount
              </Label>
               <NumericFormat
                  value={amount}
                  thousandSeparator={true}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  allowNegative={false}
                  placeholder="0.00"
                  onValueChange={handleChangeAmount}
                  className="flex h-9 col-span-3 w-full rounded-md border border-primary bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" // Add your input class here
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-start">
                Location:
              </Label>
              <Input
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remarks" className="text-start">
                Remarks:
              </Label>
              <Select value={remarks} onValueChange={setRemarks}>
                <SelectTrigger className='col-span-3'>
                  <SelectValue  placeholder="Select remarks" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Not Sold">Not Sold</SelectItem>
                    <SelectItem value="Pre-Selling">Pre-Selling</SelectItem>
                    <SelectItem value="RFO">Ready for Occupancy - (RFO)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Image" className="text-start">
                Proof of Transaction:
              </Label>
              <Input
                type='file'
                onChange={handleImageChange}
                ref={fileInputRef}
                className="col-span-3"
              />
            </div>
            {preview && (
              <div className="relative mt-4 flex justify-end">
                <img src={preview} alt="Selected Preview" className="h-full object-cover rounded-sm" />
                {preview !== defaultImageUrl && (
                  <Button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 h-8 w-8 bg-red-500 hover:bg-red-400 rounded-full p-1 shadow-md"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-white" />
                  </Button>
                )}
              </div>
            )}
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span>Saving...</span>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faArrowRight} />
                  <span>Save changes</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSalesDialog;