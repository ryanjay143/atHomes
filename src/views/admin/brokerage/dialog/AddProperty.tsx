import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { faPlusCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../../../../plugin/axios";
import Swal from "sweetalert2";

interface AddPropertyProps {
  isOpen: boolean;
  onClose: () => void;
  fetchPropertiesData: () => void;
}

function AddProperty({ onClose, fetchPropertiesData }: AddPropertyProps) {
  const [category, setCategory] = useState('');
  const [dateListed, setDateListed] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });
  const [lotArea, setLotArea] = useState('');
  const [floorArea, setFloorArea] = useState('');
  const [otherDetails, setOtherDetails] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [images, setImages] = useState<File[]>([]); // Use an array of File objects
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // State for image previews
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImages(fileArray);
      const previews: string[] = [];
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            previews.push(reader.result as string);
            setImagePreviews([...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      newImages.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files; // Update the file input with the new files
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const newErrors: { [key: string]: string } = {};

    if (!category) newErrors.category = 'Category is required.';
    if (!dateListed) newErrors.dateListed = 'Date listed is required.';
    if (!lotArea) newErrors.lotArea = 'Lot area is required.';
    if (!floorArea) newErrors.floorArea = 'Floor area is required.';
    if (!otherDetails) newErrors.otherDetails = 'Other details are required.';
    if (!location) newErrors.location = 'Location is required.';
    if (!type) newErrors.type = 'Type of listing is required.';
    if (!status) newErrors.status = 'Status is required.';
    if (images.length === 0) newErrors.images = 'At least one image is required.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // Stop submission if there are errors
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('category', category);
    formData.append('date_listed', dateListed);
    formData.append('lot_area', lotArea);
    formData.append('floor_area', floorArea);
    formData.append('details', otherDetails);
    formData.append('location', location);
    formData.append('type_of_listing', type);
    formData.append('status', status);

    images.forEach((image) => {
      formData.append('images[]', image);
    });

    try {
      const response = await axios.post('property-listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
     
      setIsDialogOpen(false);
      fetchPropertiesData();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Property listing created successfully.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      console.log('Property listing created successfully:', response.data);

      // Reset form fields after successful submission
      setCategory('');
      setLotArea('');
      setFloorArea('');
      setOtherDetails('');
      setLocation('');
      setType('');
      setStatus('');
      setImages([]);
      setImagePreviews([]);
     
      onClose();
    } catch (error) {
      console.error('Error creating property listing:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error creating the property listing. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
        <Button className="">
            <FontAwesomeIcon icon={faPlusCircle} />
            Add Property
        </Button>
        </DialogTrigger>
        <DialogContent className="md:max-w-[400px] overflow-auto max-h-[95%]">
        <DialogHeader className="text-start">
            <DialogTitle>Add New Property Listing</DialogTitle>
            <DialogDescription>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                <div>
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
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
                    </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                </div>
                <div>
                    <Label>Date Listed</Label>
                    <Input
                    type="date"
                    value={dateListed}
                    onChange={e => setDateListed(e.target.value)}
                    />
                    {errors.dateListed && <p className="text-red-500 text-sm">{errors.dateListed}</p>}
                </div>
                <div>
                    <Label>Lot Area (sqm)</Label>
                    <Input type="number" value={lotArea} onChange={e => setLotArea(e.target.value)} />
                    {errors.lotArea && <p className="text-red-500 text-sm">{errors.lotArea}</p>}
                </div>
                <div>
                    <Label>Floor Area (sqm)</Label>
                    <Input type="number" value={floorArea} onChange={e => setFloorArea(e.target.value)} />
                    {errors.floorArea && <p className="text-red-500 text-sm">{errors.floorArea}</p>}
                </div>
                <div>
                    <Label>Other Details</Label>
                    <Textarea
                    value={otherDetails}
                    onChange={e => setOtherDetails(e.target.value)}
                    className="w-full border rounded-md p-2"
                    rows={3}
                    />
                    {errors.otherDetails && <p className="text-red-500 text-sm">{errors.otherDetails}</p>}
                </div>
                <div>
                    <Label>Location</Label>
                    <Input type="text" value={location} onChange={e => setLocation(e.target.value)} />
                    {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                </div>
                <div>
                    <Label>Type of Listing</Label>
                    <div className="flex space-x-4">
                    <Label className="flex items-center space-x-2">
                        <input
                        type="radio"
                        name="type"
                        value="Exclusive"
                        checked={type === 'Exclusive'}
                        onChange={e => setType(e.target.value)}
                        />
                        <span>Exclusive</span>
                    </Label>
                    <label className="flex items-center space-x-2">
                        <input
                        type="radio"
                        name="type"
                        value="Non-Exclusive"
                        checked={type === 'Non-Exclusive'}
                        onChange={e => setType(e.target.value)}
                        />
                        <span>Non-Exclusive</span>
                    </label>
                    </div>
                    {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                </div>
                <div>
                    <Label>Status of Property</Label>
                    <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Sold">Sold</SelectItem>
                        <SelectItem value="Not Sold">Not Sold</SelectItem>
                    </SelectContent>
                    </Select>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                </div>
                <div>
                    <Label>Upload Property Images</Label>
                    <Input type="file" multiple onChange={handleImageChange} ref={fileInputRef} />
                    {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
                    <div className="flex space-x-2 mt-2">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md shadow-md overflow-hidden cursor-pointer"
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
                            onClick={() => setSelectedImage(preview)}
                          />
                          <button
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                            onClick={(e) => handleRemoveImage(index, e)}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Modal for Image Preview */}
                    {selectedImage && (
                      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                        <DialogContent className="max-w-[425px] p-4 bg-white rounded-lg shadow-lg">
                          <DialogHeader className='text-start'>
                            <DialogTitle className="text-xl font-bold mb-4">Image Preview</DialogTitle>
                            <DialogDescription>
                              <img src={selectedImage} alt="Selected Property" className="w-full h-auto rounded-md" />
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    )}
                </div>
                </div>
                <DialogFooter className="flex justify-end space-x-2">
                <Button type="submit" disabled={loading}>
                    {loading ? (
                    <>
                        <span>Submitting...</span>
                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                    </>
                    ) : (
                    <>
                        <span>Submit</span>
                    </>
                    )}
                </Button>
                </DialogFooter>
            </form>
            </DialogDescription>
        </DialogHeader>
        </DialogContent>
    </Dialog>
  );
}

export default AddProperty;