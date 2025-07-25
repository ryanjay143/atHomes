import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTimes, faFileInvoiceDollar, faUser, faCalendarAlt, faMoneyBillWave, faMapMarkerAlt, faFileUpload } from '@fortawesome/free-solid-svg-icons';
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
  client_name: string;
  block_and_lot?: string; // <-- Add this field
}

interface EditSalesDialogProps {
  sales: SalesEncoding;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fetchAgent: () => void;
  identityDetails: { id: string };
}

const EditSalesDialog: React.FC<EditSalesDialogProps> = ({
  sales, open, onOpenChange, fetchAgent, identityDetails,
}) => {
  const defaultImageUrl = `${import.meta.env.VITE_URL}/${sales.image}`;
  const [category, setCategory] = useState(sales.category || '');
  const [dateOnSale, setDateOnSale] = useState(sales.date_on_sale?.split('T')[0] || '');
  const [amount, setAmount] = useState(sales.amount.toString() || '');
  const [location, setLocation] = useState(sales.location || '');
  const [preview, setPreview] = useState<string>(defaultImageUrl);
  const [remarks, setRemarks] = useState(sales.remarks || '');
  const [clientName, setClientName] = useState(sales.client_name || '');
  const [blockAndLot, setBlockAndLot] = useState(sales.block_and_lot || ''); // <-- Add state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCategory(sales.category || '');
      setDateOnSale(sales.date_on_sale?.split('T')[0] || '');
      setAmount(sales.amount.toString() || '');
      setLocation(sales.location || '');
      setRemarks(sales.remarks || '');
      setClientName(sales.client_name || '');
      setBlockAndLot(sales.block_and_lot || ''); // <-- Reset on open
      setPreview(defaultImageUrl);
      setError(null);
      setImageFile(null);
      setImageError(null);
    }
    // eslint-disable-next-line
  }, [open, sales]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxFileSize = 5 * 1024 * 1024; // 5MB

      if (!file.type.startsWith('image/') || !validExtensions.includes(file.type)) {
        setImageError('Please select a valid image file (JPEG, PNG, or JPG).');
        return;
      }

      if (file.size > maxFileSize) {
        setImageError('The selected file exceeds the maximum size of 5MB.');
        return;
      }

      setImageError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreview(reader.result);
          setImageFile(file);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setImageError('Please select a valid image file.');
    }
  };

  const handleRemoveImage = () => {
    setPreview(defaultImageUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    // Validation
    if (category === 'Block and lot' && !blockAndLot) {
      setError('Block & Lot is required.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('agent_id', identityDetails.id);
      formData.append('category', category);
      formData.append('date_on_sale', dateOnSale);
      formData.append('amount', amount);
      formData.append('location', location);
      formData.append('remarks', remarks);
      formData.append('client_name', clientName);

      // Only append block_and_lot if category is "Block and lot"
      if (category === 'Block and lot') {
        formData.append('block_and_lot', blockAndLot);
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.post(
        `updateSalesEncodingBroker/${sales.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            'Content-Type': 'multipart/form-data',
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
          timerProgressBar: true,
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

  // When category changes, clear blockAndLot if not Block and lot
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    if (value !== 'Block and lot') {
      setBlockAndLot('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:w-[90%] h-full md:h-[800px] overflow-auto bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border border-blue-200">
        <DialogHeader className="text-start">
          <DialogTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-blue-500" />
            Edit Sales Encoding
          </DialogTitle>
          <DialogDescription>
            <span className="text-blue-800 md:text-sm mt-1">Make changes to your sales here. Click save when you're done.</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
            <div>
              <Label className="font-semibold text-blue-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-blue-400" />
                Category
              </Label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lot only">Lot only</SelectItem>
                  <SelectItem value="House and lot">House and lot</SelectItem>
                  <SelectItem value="Condominium/Apartment">Condominium/Apartment</SelectItem>
                  <SelectItem value="Commercial Properties">Commercial Properties</SelectItem>
                  <SelectItem value="Rental Properties">Rental Properties</SelectItem>
                  <SelectItem value="Farm Lot">Farm Lot</SelectItem>
                  <SelectItem value="Block and lot">Block and lot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Block & Lot input, only show if category is Block and lot */}
            {category === 'Block and lot' && (
              <div>
                <Label className="font-semibold text-blue-900 flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-400" />
                  Block &amp; Lot <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  value={blockAndLot}
                  onChange={e => setBlockAndLot(e.target.value)}
                  placeholder="e.g. Block 01, Lot 10"
                  className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
                  required={category === 'Block and lot'}
                  autoFocus
                />
              </div>
            )}
            <div>
              <Label className="font-semibold text-blue-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-blue-400" />
                Client Name
              </Label>
              <Input
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
              />
            </div>
            <div>
              <Label className="font-semibold text-blue-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400" />
                Date
              </Label>
              <Input
                type="date"
                value={dateOnSale}
                onChange={e => setDateOnSale(e.target.value)}
                className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
              />
            </div>
            <div>
              <Label className="font-semibold text-blue-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500" />
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
                className="flex h-9 w-full rounded-lg border border-blue-300 bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>
            <div>
              <Label className="font-semibold text-blue-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-400" />
                Location
              </Label>
              <Input
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
              />
            </div>
            <div>
              <Label className="font-semibold text-blue-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-blue-400" />
                Remarks
              </Label>
              <Select value={remarks} onValueChange={setRemarks}>
                <SelectTrigger className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1">
                  <SelectValue placeholder="Select remarks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sold">Sold</SelectItem>
                  <SelectItem value="Not Sold">Not Sold</SelectItem>
                  <SelectItem value="Pre-Selling">Pre-Selling</SelectItem>
                  <SelectItem value="RFO">Ready for Occupancy - (RFO)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-semibold text-blue-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileUpload} className="text-blue-400" />
                Proof of Transaction
                <span className="text-xs text-red-500 ml-2">(JPEG, PNG, JPG only, max 5MB)</span>
              </Label>
              <Input
                type='file'
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
              />
              {imageError && (
                <p className="text-red-500 text-xs mt-1">{imageError}</p>
              )}
            </div>
            {preview && (
              <div className="relative mt-4 flex justify-center">
                <img src={preview} alt="Selected Preview" className="max-h-48 object-cover rounded-lg border border-blue-200 shadow" />
                {preview !== defaultImageUrl && (
                  <Button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 h-8 w-8 bg-red-500 hover:bg-red-400 rounded-full p-1 shadow-md"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-white" />
                  </Button>
                )}
              </div>
            )}
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading} className='w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-lg shadow flex items-center justify-center gap-2'>
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