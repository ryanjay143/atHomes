import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "../../../../plugin/axios";
import Swal from 'sweetalert2';

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
      setPriceAndRate(property.price_and_rate || '');
      setExistingImages(property.property_images || []);
    }
  }, [property]);

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
    <DialogContent className="md:max-w-[400px] overflow-auto max-h-[95%] p-6 bg-white rounded-lg shadow-lg">
      <DialogHeader className='text-start'>
        <DialogTitle className="text-xl font-bold">Edit Brokerage Listing</DialogTitle>
        <DialogDescription>
          Make changes to your brokerage here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>Category</Label>
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

          {/* Conditionally render the price or rate input */}
          {(category === "Commercial Properties" || category === "Rental Properties") && (
            <div>
              <Label>{category === "Commercial Properties" ? "Selling Price" : "Rental Rate"}</Label>
              <Input
                type="text"
                value={priceAndRate}
                onChange={e => setPriceAndRate(e.target.value)}
              />
            </div>
          )}

          <div>
            <Label>Date Listed</Label>
            <Input type="date" value={dateListed} onChange={e => setDateListed(e.target.value)} />
          </div>
          <div>
            <Label>Location</Label>
            <Input type="text" value={location} onChange={e => setLocation(e.target.value)} />
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
              <Label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="Non-Exclusive"
                  checked={type === 'Non-Exclusive'}
                  onChange={e => setType(e.target.value)}
                />
                <span>Non-Exclusive</span>
              </Label>
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
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
            <Label>Lot Area (sqm)</Label>
            <Input type="text" value={lotArea} onChange={e => setLotArea(e.target.value)} />
          </div>
          <div>
            <Label>Floor Area (sqm)</Label>
            <Input type="text" value={floorArea} onChange={e => setFloorArea(e.target.value)} />
          </div>
          <div>
            <Label>Other Details</Label>
            <Textarea
              value={otherDetails}
              onChange={e => setOtherDetails(e.target.value)}
              className="w-full border rounded-md p-2"
              rows={3}
            />
          </div>
          <div>
            <Label>Upload / Update Images / Add Images</Label>
            <Input type="file" multiple onChange={handleImageChange} ref={fileInputRef} />

            <div className="grid grid-cols-5 gap-2 mt-2">

              {/* Existing Images */}
              {existingImages.length > 0 && (
                existingImages.map((image: any, index: number) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md shadow-md overflow-hidden cursor-pointer"
                  >
                    <img
                      src={`${import.meta.env.VITE_URL}/${image.images}`}
                      className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
                      alt={`Property Image ${index + 1}`}
                    />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteImage(image.id, index);
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))
              )}

              {/* New Photo */}
              {imagePreviews.length > 0 && imagePreviews.map((preview, index: number) => (
                <div
                  key={index}
                  className="relative w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md shadow-md overflow-hidden cursor-pointer"
                >
                  <img
                    src={preview}
                    className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
                    alt={`Selected Image ${index + 1}`}
                  />
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={(e) => handleRemoveImagePreview(index, e)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white" disabled={loading}>
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