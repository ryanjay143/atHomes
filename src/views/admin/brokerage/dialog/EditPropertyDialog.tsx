import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
import { faTag, faCalendarAlt, faMapMarkerAlt, faList, faBuilding, faDollarSign, faImages, faUpload, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../../../../plugin/axios";
import Swal from 'sweetalert2';

function formatNumberWithCommas(value: string) {
  const numericValue = value.replace(/\D/g, '');
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function EditPropertyDialog({ property, onClose, fetchPropertiesData }: any) {
  const [category, setCategory] = useState('');
  const [dateListed, setDateListed] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [lotArea, setLotArea] = useState('');
  const [floorArea, setFloorArea] = useState('');
  const [otherDetails, setOtherDetails] = useState('');
  const [priceAndRate, setPriceAndRate] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageTypeError, setImageTypeError] = useState<string | null>(null);

  useEffect(() => {
    if (property) {
      setCategory(property.category || '');
      setDateListed(property.date_listed || '');
      setLocation(property.location || '');
      setType(property.type_of_listing || '');
      setStatus(property.status || '');
      setLotArea(property.lot_area || '');
      setFloorArea(property.floor_area || '');
      setOtherDetails(property.details || '');
      setPriceAndRate(property.price_and_rate ? property.price_and_rate.toString() : '');
      setExistingImages(property.property_images || []);
    }
  }, [property]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (!/^\d*$/.test(rawValue)) return;
    setPriceAndRate(rawValue);
  };

  // Attractive image upload logic: accumulate, prevent duplicates, 5MB limit, show count in input
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageTypeError(null);
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      // Check for invalid type or size
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

      // Prevent duplicates (by name and size)
      const filteredFiles = fileArray.filter(
        (newFile) =>
          !images.some(
            (existingFile) =>
              existingFile.name === newFile.name &&
              existingFile.size === newFile.size
          )
      );

      // Append new unique files to existing images
      const newImages = [...images, ...filteredFiles];
      setImages(newImages);

      // Generate previews for new files and append to existing previews
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

  const handleRemoveImagePreview = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      newImages.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const updatePropertyImages = (updatedImages: any[]) => {
    setExistingImages(updatedImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (loading) return;
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append('category', category);
    formData.append('date_listed', dateListed);
    formData.append('lot_area', lotArea);
    formData.append('floor_area', floorArea);
    formData.append('details', otherDetails);
    formData.append('location', location);
    formData.append('type_of_listing', type);
    formData.append('status', status);
    formData.append('price_and_rate', priceAndRate);

    images.forEach((image) => {
      formData.append('images[]', image);
    });

    try {
      await axios.post(`property-listings/${property.id}?_method=PUT`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      fetchPropertiesData();
      onClose();

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Property listing updated successfully.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error('Error updating property:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId: string, index: number) => {
    try {
      await axios.delete(`property-listings/${imageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const updatedImages = existingImages.filter((_, i) => i !== index);
      updatePropertyImages(updatedImages);
      fetchPropertiesData();
    } catch (error) {
      console.error('Error deleting image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete image.',
      });
    }
  };

  return (
    <DialogContent className="md:w-[90%] overflow-auto h-full p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border border-blue-200">
      <DialogHeader className='text-start'>
        <DialogTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
          <FontAwesomeIcon icon={faBuilding} className="text-blue-500" />
          Edit Brokerage Listing
        </DialogTitle>
        <DialogDescription>
          Make changes to your brokerage here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div>
            <Label className="font-semibold text-blue-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faTag} className="text-blue-400" />
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-2 ">
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

          {(category === "Commercial Properties" || category === "Rental Properties") && (
            <div>
              <Label className="font-semibold text-blue-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faDollarSign} className="text-green-500" />
                {category === "Commercial Properties" ? "Selling Price" : "Rental Rate"}
              </Label>
              <Input
                type="text"
                value={formatNumberWithCommas(priceAndRate?.toString() || "")}
                onChange={handlePriceChange}
                placeholder="0.00"
                className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-2 "
              />
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
              className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-2 "
            />
          </div>
          <div>
            <Label className="font-semibold text-blue-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-400" />
              Location
            </Label>
            <Input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-2 "
            />
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
          </div>
          <div>
            <Label className="font-semibold text-blue-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="text-blue-400" />
              Status of Property
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-2 ">
                <SelectValue placeholder="Select status" />
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
              <FontAwesomeIcon icon={faDollarSign} className="text-green-500" />
              Lot Area (sqm)
            </Label>
            <Input
              type="text"
              value={lotArea}
              onChange={e => setLotArea(e.target.value)}
              className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-2 "
            />
          </div>
          <div>
            <Label className="font-semibold text-blue-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faDollarSign} className="text-green-500" />
              Floor Area (sqm)
            </Label>
            <Input
              type="text"
              value={floorArea}
              onChange={e => setFloorArea(e.target.value)}
              className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-2 "
            />
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
          </div>
          <div>
            <Label className="font-semibold flex items-center gap-1">
              <FontAwesomeIcon icon={faImages} className="text-indigo-400" />
              Update Property Images <span className="text-red-600">*</span>
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
            {imageTypeError && (
              <p className="text-red-500 text-xs mt-1">
                {imageTypeError}
              </p>
            )}
            <div className="grid grid-cols-5 md:grid-cols-3 gap-2 mt-4">
              {/* Existing Images */}
              {existingImages.length > 0 && (
                existingImages.map((image: any, index: number) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md shadow-md overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={`${import.meta.env.VITE_URL}/${image.images}`}
                      className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                      alt={`Property Image ${index + 1}`}
                    />
                    <button
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-400 transition"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteImage(image.id, index);
                      }}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))
              )}

              {/* New Photo */}
              {imagePreviews.length > 0 && imagePreviews.map((preview, index: number) => (
                <div
                  key={index}
                  className="relative w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md shadow-md overflow-hidden cursor-pointer group"
                >
                  <img
                    src={preview}
                    className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                    alt={`Selected Image ${index + 1}`}
                  />
                  <button
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-400 transition"
                    onClick={(e) => handleRemoveImagePreview(index, e)}
                    type="button"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2 mt-6">
          <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-lg shadow flex items-center gap-2 px-6 py-2" disabled={loading}>
            {loading ? (
              <>
                <span>Saving...</span>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
              </>
            ) : (
              <>
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export default EditPropertyDialog;