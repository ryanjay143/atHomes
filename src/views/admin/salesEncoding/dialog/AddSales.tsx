import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPlus, faUserTie, faFileInvoiceDollar, faMapMarkerAlt, faCalendarAlt, faFileUpload, faUser, faLocation } from '@fortawesome/free-solid-svg-icons';
import { NumericFormat } from 'react-number-format';

function AddSales({ fetchAgent }: any) {
  const [formData, setFormData] = useState<{
    agent_id: string;
    category: string;
    date_on_sale: string;
    amount: string;
    location: string;
    remarks: string;
    image: File | null;
    client_name: string;
    block_and_lot: string | null; // Always string or null
  }>({
    agent_id: '',
    category: '',
    date_on_sale: new Date().toISOString().split('T')[0],
    amount: '',
    location: '',
    remarks: '',
    image: null,
    client_name: '',
    block_and_lot: null, // Start as null
  });
  const [agentSearch, setAgentSearch] = useState('');

  const [selectedAgentName, setSelectedAgentName] = useState('Choose agent or broker');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [getAgentBroker, setAgentBroker] = useState<any[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [amount, setAmount] = React.useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const filteredAgents = getAgentBroker.filter(agent => {
    const fullName = `${agent.personal_info.first_name} ${agent.personal_info.middle_name} ${agent.personal_info.last_name} ${agent.personal_info.extension_name || ''}`.toLowerCase();
    return fullName.includes(agentSearch.toLowerCase());
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get('sales-encoding', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setAgentBroker(response.data.agents);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, []);

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

  const handleSelectChange = (name: string, value: string) => {
    // If changing category, reset block_and_lot to null if not "Block and lot"
    if (name === 'category') {
      setFormData({
        ...formData,
        category: value,
        block_and_lot: value === 'Block and lot' ? '' : null,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (name === 'agent_id') {
      const selectedAgent = getAgentBroker.find(agent => agent.id === value);
      if (selectedAgent) {
        const fullName = `${selectedAgent.personal_info.first_name} ${selectedAgent.personal_info.middle_name} ${selectedAgent.personal_info.last_name}`;
        setSelectedAgentName(fullName);
      }
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    setFormData({
      ...formData,
      date_on_sale: selectedDate,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBlockAndLotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      block_and_lot: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setFileError('Invalid file type. Only JPEG, PNG, and JPG are allowed.');
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
    // Validate block_and_lot if category is "Block and lot"
    if (formData.category === 'Block and lot' && !formData.block_and_lot) {
      newErrors.block_and_lot = 'Block & Lot is required.';
    }
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
      if (key === "block_and_lot") {
        // Only append if category is "Block and lot" and value is not empty/null
        if (formData.category === "Block and lot" && value) {
          formDataToSend.append(key, value as string);
        } else {
          // If not "Block and lot", append as null (or skip, depending on backend)
          formDataToSend.append(key, '');
        }
      } else if (key === "image") {
        if (value) formDataToSend.append(key, value as Blob);
      } else {
        formDataToSend.append(key, value as string);
      }
    });

    try {
      await axios.post('sales-encoding', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      fetchAgent();

      setFormData({
        agent_id: '',
        category: '',
        date_on_sale: new Date().toISOString().split('T')[0],
        amount: '',
        location: '',
        remarks: '',
        image: null,
        client_name: '',
        block_and_lot: null,
      });
      setAmount('');
      setSelectedAgentName('Choose agent or broker');
      setIsDialogOpen(false);
      setImagePreview(null);
      setAgentSearch('');

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Sales created successfully.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

    } catch (error) {
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

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className='h-10 bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-200 rounded-lg'>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Sales
          </Button>
        </DialogTrigger>
        <DialogContent className="md:w-[90%] max-w-xl h-full md:h-[85%] overflow-auto bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border border-blue-200">
          <DialogHeader>
            <DialogTitle className='text-start text-2xl font-bold text-blue-900 flex items-center gap-2'>
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-blue-500" />
              Add Sales Encoding
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={addSalesSubmit}>
                <div className='text-start flex flex-col gap-6 mt-4'>
                  <div className="grid w-full items-start gap-2">
                    <Label className="font-semibold text-blue-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faUserTie} className="text-blue-400" />
                      Agent/Broker
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange('agent_id', value)}>
                      <SelectTrigger className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        <SelectValue placeholder="Choose agent or broker">{selectedAgentName}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {/* Search input inside dropdown */}
                        <div className="px-2 py-2 sticky top-0 bg-white z-10">
                          <input
                            type="text"
                            placeholder="Search agent..."
                            value={agentSearch}
                            onChange={e => setAgentSearch(e.target.value)}
                            onMouseDown={e => e.stopPropagation()}
                            onClick={e => e.stopPropagation()}
                            onKeyDown={e => e.stopPropagation()}
                            className="w-full px-2 py-1 rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm pr-8"
                          />
                          {agentSearch && (
                            <button
                              type="button"
                              onClick={() => setAgentSearch('')}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600"
                              tabIndex={-1}
                              onMouseDown={e => e.stopPropagation()}
                            >
                              ×
                            </button>
                          )}
                        </div>
                        {filteredAgents.length === 0 ? (
                          <div className="px-2 py-2 text-gray-500 text-sm">No agents found.</div>
                        ) : (
                          filteredAgents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.personal_info.first_name} {agent.personal_info.middle_name} {agent.personal_info.last_name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.agent_id && <p className="text-red-500 text-xs">{errors.agent_id}</p>}
                  </div>

                  <div className="grid w-full items-start gap-2">
                    <Label className="font-semibold text-blue-900">Category</Label>
                    <Select onValueChange={(value) => handleSelectChange('category', value)}>
                      <SelectTrigger className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lot only">Lot only</SelectItem>
                        <SelectItem value="House and lot">House and lot</SelectItem>
                        <SelectItem value="Condominium/Apartment">Condominium/Apartment</SelectItem>
                        <SelectItem value="Commercial Properties">Commercial Properties</SelectItem>
                        <SelectItem value="Rental Properties">Rental Properties</SelectItem>
                        <SelectItem value="Farm Lot">Farm Lot</SelectItem>
                        <SelectItem value="For Assumption">For Assumption</SelectItem>
                        <SelectItem value="Block and lot">Block and lot</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
                  </div>

                  <div className="grid w-full items-center gap-2">
                    <Label className="font-semibold text-blue-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-blue-400" />
                      Client Name
                    </Label>
                    <Input
                      type="text"
                      name="client_name"
                      placeholder='Enter client name'
                      value={formData.client_name}
                      onChange={handleChange}
                      className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    {errors.client_name && <p className="text-red-500 text-xs">{errors.client_name}</p>}
                  </div>

                  {/* Conditionally render Block & Lot input */}
                  {formData.category === 'Block and lot' && (
                    <div className="grid w-full items-center gap-2">
                      <Label className="font-semibold text-blue-900 flex items-center gap-2">
                        <FontAwesomeIcon icon={faLocation} className="text-blue-400" />
                        Block & Lot <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        name="block_and_lot"
                        placeholder='e.g. Block 01, Lot 10'
                        value={formData.block_and_lot || ''}
                        onChange={handleBlockAndLotChange}
                        className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required={formData.category === 'Block and lot'}
                      />
                      {errors.block_and_lot && <p className="text-red-500 text-xs">{errors.block_and_lot}</p>}
                    </div>
                  )}

                  <div className="grid w-full items-center gap-2">
                    <Label className="font-semibold text-blue-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400" />
                      Reservation Date
                    </Label>
                    <Input
                      type="date"
                      name="date_on_sale"
                      value={formData.date_on_sale}
                      onChange={handleDateChange}
                      className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    {errors.date_on_sale && <p className="text-red-500 text-xs">{errors.date_on_sale}</p>}
                  </div>

                  <div className="grid w-full items-center gap-2">
                    <Label className="font-semibold text-blue-900">Amount of Sale</Label>
                    <NumericFormat
                      value={amount}
                      thousandSeparator={true}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      allowNegative={false}
                      placeholder="0.00"
                      onValueChange={handleChangeAmount}
                      className="flex h-9 w-full rounded-lg border border-blue-300 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                    {errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}
                  </div>

                  <div className="grid w-full items-center gap-2">
                    <Label className="font-semibold text-blue-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-400" />
                      Location of Property
                    </Label>
                    <Input
                      type="text"
                      name="location"
                      placeholder='Enter location of property'
                      value={formData.location}
                      onChange={handleChange}
                      className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    {errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}
                  </div>

                  <div className="grid w-full items-center gap-2">
                    <Label className="font-semibold text-blue-900">Remarks</Label>
                    <Select onValueChange={(value) => handleSelectChange('remarks', value)}>
                      <SelectTrigger className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        <SelectValue placeholder="Select remarks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sold">Sold</SelectItem>
                        <SelectItem value="Not Sold">Not Sold</SelectItem>
                        <SelectItem value="Pre-Selling">Pre-Selling</SelectItem>
                        <SelectItem value="RFO">Ready for Occupancy - (RFO)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.remarks && <p className="text-red-500 text-xs">{errors.remarks}</p>}
                  </div>

                  <div className="grid w-full gap-2">
                    <Label className="font-semibold text-blue-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faFileUpload} className="text-blue-400" />
                      Upload Proof of Transaction
                      <span className="text-xs text-red-500 ml-2">(JPEG, PNG, JPG only, max 5MB)</span>
                    </Label>
                    <Input
                      type="file"
                      name="image"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={handleFileChange}
                      className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    {fileError && <p className="text-red-500 text-xs">{fileError}</p>}
                    {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
                    {imagePreview && (
                      <div className="mt-2 flex justify-center">
                        <img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg border border-blue-200 shadow" />
                      </div>
                    )}
                  </div>

                  <DialogFooter className="mt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow hover:from-blue-700 hover:to-blue-900 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span>Submitting...</span>
                          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faArrowRight} />
                          <span>Submit</span>
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