import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import axios from '../../../../plugin/axios';
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";


function AddSales({ fetchAgent, identityDetails }: any) {
  const [formData, setFormData] = useState<any>({
    agent_id: identityDetails.id,
    category: '',
    date_on_sale: new Date().toISOString().split('T')[0],
    amount: '',
    location: '',
    remarks: '',
    image: null,
    client_name: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    // Update agent_id whenever identityDetails changes
    setFormData((prevData:any) => ({
      ...prevData,
      agent_id: identityDetails.id,
    }));
  }, [identityDetails]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.agent_id) newErrors.agent_id = 'Agent/Broker is required.';
    if (!formData.category) newErrors.category = 'Category is required.';
    if (!formData.date_on_sale) newErrors.date_on_sale = 'Date of Sale is required.';
    if (!formData.amount) newErrors.amount = 'Amount of Sale is required.';
    if (!formData.location) newErrors.location = 'Location of Property is required.';
    if (!formData.remarks) newErrors.remarks = 'Remarks are required.';
    if (!formData.image) newErrors.image = 'Proof of Transaction is required.';
    if (!formData.client_name) newErrors.client_name = 'Client name is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addSalesSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (loading) return;
    setLoading(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value as string | Blob);
    });

    try {
      await axios.post('user/broker-sales', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      // console.log('Response:', response.data);

      fetchAgent();

      setFormData({
        agent_id: identityDetails.id,
        category: '',
        date_on_sale: new Date().toISOString().split('T')[0],
        amount: '',
        location: '',
        remarks: '',
        image: null,
        client_name: '',
      });
      setAmount('');
      setIsDialogOpen(false);
      setImagePreview(null);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Sales created successfully.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

    } catch (error) {
      console.error('Error submitting form:', error);

      Swal.fire({
        icon: 'error',
        title: 'Failed to create sales encoding',
        text: 'There was an error while saving your sales encoding. Please try again.',
        confirmButtonText: 'Retry',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    setFormData({
      ...formData,
      date_on_sale: selectedDate,
    });
  };

  const handleChangeAmount = (values: any) => {
    const { value } = values;
    setAmount(value);
    setFormData({
      ...formData,
      amount: value,
    });
    if (value === '') {
      setErrors({ amount: 'Amount is required' });
    } else {
      setErrors({});
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setFileError('Invalid file type. Only JPEG, PNG, JPG, and GIF are allowed.');
        setFormData({ ...formData, image: null });
      } else if (file.size > maxSize) {
        setFileError('File size exceeds the maximum limit of 5MB.');
        setFormData({ ...formData, image: null });
      } else {
        setFileError(null);
        setFormData({ ...formData, image: file });
      }
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.onerror = () => {
        setFileError('Failed to read file');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className='h-10'>
            <FontAwesomeIcon icon={faPlus} />
            Add Sales
          </Button>
        </DialogTrigger>
        <DialogContent className="md:w-[90%] overflow-auto max-h-[97%]">
          <DialogHeader>
            <DialogTitle className='text-start'>ADD SALES ENCODING</DialogTitle>
            <DialogDescription>
              <form onSubmit={addSalesSubmit}>
                <div className='text-start flex flex-col gap-4 mt-5'>
                  {false && (
                    <div className="grid  w-full items-start gap-1.5">
                        <Input value={identityDetails.id} />
                    </div>
                    )}
                  <div className="grid w-full items-start gap-1.5">
                    <Label>Category</Label>
                    <Select onValueChange={(value) => handleSelectChange('category', value)}>
                      <SelectTrigger>
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
                    {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label>Client Name</Label>
                    <Input type="text" name="client_name" placeholder='Enter client name' value={formData.client_name} onChange={handleChange} />
                    {errors.client_name && <p className="text-red-500 text-sm">{errors.client_name}</p>}
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label>Reservation Date</Label>
                    <Input type="date" name="date_on_sale" value={formData.date_on_sale} onChange={handleDateChange} />
                    {errors.date_on_sale && <p className="text-red-500 text-sm">{errors.date_on_sale}</p>}
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label>Amount of Sale</Label>
                    <NumericFormat
                      value={amount}
                      thousandSeparator={true}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      allowNegative={false}
                      placeholder="0.00"
                      onValueChange={handleChangeAmount}
                      className="flex h-9 w-full rounded-md border border-primary bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                    {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label>Location of Property</Label>
                    <Input type="text" name="location" placeholder='Enter location of property' onChange={handleChange} />
                    {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label>Remarks:</Label>
                    <Select onValueChange={(value) => handleSelectChange('remarks', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select remarks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sold">Sold</SelectItem>
                        <SelectItem value="Not Sold">Not Sold</SelectItem>
                        <SelectItem value="Pre-Selling">Pre-Selling</SelectItem>
                        <SelectItem value="RFO">Ready for Occupancy - (RFO)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.remarks && <p className="text-red-500 text-sm">{errors.remarks}</p>}
                  </div>

                  <div className="grid w-full gap-1.5">
                    <Label>Upload Proof of Transaction</Label>
                    <Input type="file" name="image" onChange={handleFileChange} />
                    {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
                    {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 max-w-md rounded-md" />}
                  </div>

                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <span>Submitting....</span>
                          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faArrowRight} />
                          Submit
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddSales;