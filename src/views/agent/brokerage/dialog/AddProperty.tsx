import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  faPlus, faTimes, faTag, faCalendarAlt, faMapMarkerAlt, faList, faBuilding, faDollarSign, faImages, faUpload
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../../../../plugin/axios";
import Swal from "sweetalert2";

interface AddPropertyProps {
  isOpen: boolean;
  onClose: () => void;
  fetchPropertiesData: () => void;
}

function formatNumberWithCommas(value: string | number) {
  if (value === undefined || value === null) return '';
  const strValue = value.toString().replace(/\D/g, '');
  return strValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function AddProperty({ onClose, fetchPropertiesData }: AddPropertyProps) {
  const [category, setCategory] = useState('');
  const [dateListed, setDateListed] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [lotArea, setLotArea] = useState('');
  const [floorArea, setFloorArea] = useState('');
  const [otherDetails, setOtherDetails] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rentalRate, setRentalRate] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageTypeError, setImageTypeError] = useState<string | null>(null);

  const handleSellingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (!/^\d*$/.test(rawValue)) return;
    setSellingPrice(rawValue);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageTypeError(null);
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024;

      const invalidFile = fileArray.find(
        (file) =>
          !allowedTypes.includes(file.type) ||
          file.size > maxSize
      );
      if (invalidFile) {
        if (!allowedTypes.includes(invalidFile.type)) {
          setImageTypeError('Only JPG, JPEG, and PNG files are allowed.');
        } else if (invalidFile.size > maxSize) {
          setImageTypeError('Each image must be 5MB or less.');
        }
        setImages([]);
        setImagePreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const filteredFiles = fileArray.filter(
        (newFile) =>
          !images.some(
            (existingFile) =>
              existingFile.name === newFile.name &&
              existingFile.size === newFile.size
          )
      );

      const newImages = [...images, ...filteredFiles];
      setImages(newImages);

      if (filteredFiles.length === 0) return;

      const newPreviews: string[] = [];
      let loadedCount = 0;

      filteredFiles.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            newPreviews[idx] = reader.result as string;
            loadedCount++;
            if (loadedCount === filteredFiles.length) {
              setImagePreviews(prev => [...prev, ...newPreviews]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      newImages.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
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

    if (category === 'Rental Properties' && !rentalRate) {
      newErrors.rentalRate = 'Rental rate is required.';
    }
    if (category === 'Commercial Properties' && !sellingPrice) {
      newErrors.sellingPrice = 'Selling price is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
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

    if (category === 'Rental Properties') {
      formData.append('price_and_rate', rentalRate);
    } else if (category === 'Commercial Properties') {
      formData.append('price_and_rate', sellingPrice);
    } else {
      formData.append('price_and_rate', '');
    }

    images.forEach((image) => {
      formData.append('images[]', image);
    });

    try {
      await axios.post('user/agent-broker', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setIsDialogOpen(false);
      fetchPropertiesData();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Property listing created successfully.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      setCategory('');
      setLotArea('');
      setFloorArea('');
      setOtherDetails('');
      setLocation('');
      setType('');
      setStatus('');
      setImages([]);
      setImagePreviews([]);
      setRentalRate('');
      setSellingPrice('');

      onClose();
    } catch (error) {
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
        <Button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-200 rounded-lg">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Brokerage
        </Button>
      </DialogTrigger>
      <DialogContent className="md:w-[90%] h-full overflow-auto bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border border-blue-200">
        <DialogHeader className="text-start">
          <DialogTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faBuilding} className="text-blue-500" />
            Add New Property Listing
          </DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit} className="space-y-6 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <Label className="font-semibold text-blue-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faTag} className="text-blue-400" />
                    Category
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
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
                      <SelectItem value="For Assumption">For Assumption</SelectItem>
                      {/* <SelectItem value="Block and lot">Block and lot</SelectItem> */}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
                {category === 'Rental Properties' && (
                  <div>
                    <Label className="font-semibold text-blue-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faDollarSign} className="text-green-500" />
                      Rental Rate
                    </Label>
                    <Input
                      type="number"
                      value={rentalRate}
                      onChange={e => setRentalRate(e.target.value)}
                      placeholder='0.00'
                      className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
                    />
                    {errors.rentalRate && <p className="text-red-500 text-xs mt-1">{errors.rentalRate}</p>}
                  </div>
                )}
                {category === 'Commercial Properties' && (
                  <div>
                    <Label className="font-semibold text-blue-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faDollarSign} className="text-green-500" />
                      Selling Price
                    </Label>
                    <Input
                      type="text"
                      value={formatNumberWithCommas(sellingPrice)}
                      onChange={handleSellingPriceChange}
                      placeholder='0.00'
                      className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
                    />
                    {errors.sellingPrice && <p className="text-red-500 text-xs mt-1">{errors.sellingPrice}</p>}
                  </div>
                )}
                <div>
                  <Label className="font-semibold text-blue-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400" />
                    Date Listed
                  </Label>
                  <Input
                    type="date"
                    value={dateListed}
                    onChange={e => setDateListed(e.target.value)}
                    className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
                  />
                  {errors.dateListed && <p className="text-red-500 text-xs mt-1">{errors.dateListed}</p>}
                </div>
                <div>
                  <Label className="font-semibold text-blue-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faDollarSign} className="text-green-500" />
                    Lot Area (sqm)
                  </Label>
                  <Input
                    type="number"
                    min='0'
                    placeholder='e.g. 100'
                    value={lotArea}
                    onChange={e => setLotArea(e.target.value)}
                    className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
                  />
                  {errors.lotArea && <p className="text-red-500 text-xs mt-1">{errors.lotArea}</p>}
                </div>
                <div>
                  <Label className="font-semibold text-blue-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faDollarSign} className="text-green-500" />
                    Floor Area (sqm)
                  </Label>
                  <Input
                    type="number"
                    min='0'
                    placeholder='e.g. 100'
                    value={floorArea}
                    onChange={e => setFloorArea(e.target.value)}
                    className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
                  />
                  {errors.floorArea && <p className="text-red-500 text-xs mt-1">{errors.floorArea}</p>}
                </div>
                <div>
                  <Label className="font-semibold text-blue-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faList} className="text-blue-400" />
                    Other Details
                  </Label>
                  <Textarea
                    value={otherDetails}
                    onChange={e => setOtherDetails(e.target.value)}
                    className="w-full border rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-2 mt-2"
                    rows={3}
                  />
                  {errors.otherDetails && <p className="text-red-500 text-xs mt-1">{errors.otherDetails}</p>}
                </div>
                <div>
                  <Label className="font-semibold text-blue-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-400" />
                    Location
                  </Label>
                  <Input
                    type="text"
                    placeholder='e.g. Cagayan de Oro City, Misamis Oriental'
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>
                <div>
                  <Label className="font-semibold text-blue-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faList} className="text-blue-400" />
                    Type of Listing
                  </Label>
                  <div className="flex space-x-4 mt-2">
                    <Label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="type"
                        value="Exclusive"
                        checked={type === 'Exclusive'}
                        onChange={e => setType(e.target.value)}
                        className="accent-blue-500"
                      />
                      <span>Exclusive</span>
                    </Label>
                    <Label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="type"
                        value="Non-Exclusive"
                        checked={type === 'Non-Exclusive'}
                        onChange={e => setType(e.target.value)}
                        className="accent-blue-500"
                      />
                      <span>Non-Exclusive</span>
                    </Label>
                  </div>
                  {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                </div>
                <div>
                  <Label className="font-semibold text-blue-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBuilding} className="text-blue-400" />
                    Status of Property
                  </Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sold">Sold</SelectItem>
                      <SelectItem value="Not Sold">Not Sold</SelectItem>
                      <SelectItem value="Pre-Selling">Pre-Selling</SelectItem>
                      <SelectItem value="RFO">Ready for Occupancy - (RFO)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                </div>
                <div>
                  <Label className="font-semibold flex items-center gap-1">
                    <FontAwesomeIcon icon={faImages} className="text-indigo-400" />
                    Upload Property Images <span className="text-red-600">*</span>
                    <span className="text-xs font-normal text-red-600 ml-2">
                      (JPG, JPEG, PNG only, max 5MB each)
                    </span>
                  </Label>
                  <label
                    htmlFor="property-image-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-4 bg-white hover:bg-blue-50 cursor-pointer transition-all duration-200 mt-2"
                  >
                    <FontAwesomeIcon icon={faUpload} className="text-blue-400 text-3xl mb-2" />
                    <span className="text-blue-700 font-medium">Click to upload images here</span>
                    <Input
                      id="property-image-upload"
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                  </label>
                  <div className="relative mt-2">
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 pointer-events-none bg-white px-2 rounded"
                      style={{
                        zIndex: 2,
                        background: "white",
                        opacity: 0.85,
                        fontWeight: 500,
                      }}
                    >
                      {images.length === 0
                        ? "No image"
                        : `${images.length} image${images.length > 1 ? "s" : ""}`}
                    </span>
                  </div>
                  {(imageTypeError || errors.images) && (
                    <p className="text-red-500 text-xs mt-1">
                      {imageTypeError || errors.images}
                    </p>
                  )}
                  <div className="grid grid-cols-5 md:grid-cols-4 gap-2 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md shadow-md overflow-hidden cursor-pointer group"
                        title="Click to preview"
                        onClick={() => setSelectedImage(preview)}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                        />
                        <button
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-400 transition"
                          onClick={(e) => handleRemoveImage(index, e)}
                          type="button"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ))}
                  </div>
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
              <DialogFooter className="flex justify-end space-x-2 mt-6">
                <Button type="submit" disabled={loading} className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-lg shadow flex items-center gap-2 px-6 py-2">
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