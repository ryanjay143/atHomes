import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { faEye, faTag, faList, faBuilding, faImages, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ViewPropertyProps {
  property: any;
  dateFormatter: Intl.DateTimeFormat;
}

// Utility function to format numbers with commas
function formatNumberWithCommas(value: string | number | undefined | null) {
  if (value === undefined || value === null) return '';
  const strValue = value.toString().replace(/[^0-9.]/g, '');
  const [integer, decimal] = strValue.split('.');
  const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decimal !== undefined ? `${formattedInt}.${decimal}` : formattedInt;
}

function ViewProperty({ property, dateFormatter }: ViewPropertyProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const showPrice =
    property.category === "Commercial Properties" ||
    property.category === "Rental Properties";

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button className="h-8 w-8 font-medium bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-sm rounded-md shadow transition-all duration-200">
            <FontAwesomeIcon icon={faEye} />
          </Button>
        </DialogTrigger>
        <DialogContent className="md:w-[90%] p-6 overflow-auto max-h-[95%] bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-2xl border border-blue-200">
          <DialogHeader className="text-start">
            <DialogTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faBuilding} className="text-blue-500" />
              View Property Listing
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-8">
                {/* General Information */}
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faTag} className="text-blue-400" />
                    <h3 className="font-semibold text-lg text-blue-800">General Information</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-gray-700 text-sm">
                    <div><span className="font-semibold">Category:</span> {property.category}</div>
                    <div><span className="font-semibold">Date Listed:</span> {dateFormatter.format(new Date(property.date_listed))}</div>
                    <div><span className="font-semibold">Location:</span> {property.location}</div>
                    <div><span className="font-semibold">Type of Listing:</span> {property.type_of_listing}</div>
                    <div><span className="font-semibold">Status:</span> {property.status}</div>
                    {showPrice && (
                      <div>
                        <span className="font-semibold">Price:</span> ₱{formatNumberWithCommas(property.price_and_rate)}
                      </div>
                    )}
                  </div>
                </div>
                {/* Description */}
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faList} className="text-blue-400" />
                    <h3 className="font-semibold text-lg text-blue-800">Description of Property</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-gray-700 text-sm">
                    <div><span className="font-semibold">Lot Area:</span> {property.lot_area} sqm</div>
                    <div><span className="font-semibold">Floor Area:</span> {property.floor_area} sqm</div>
                    <div><span className="font-semibold">Other Details:</span> {property.details || "N/A"}</div>
                  </div>
                </div>
                {/* Images */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faImages} className="text-indigo-400" />
                    <h3 className="font-semibold text-lg text-blue-800">Property Images</h3>
                  </div>
                  <div className="grid grid-cols-5 md:grid-cols-4 gap-2 mt-2">
                    {property.property_images && property.property_images.length > 0 ? (
                      property.property_images.map((image: any, index: any) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md shadow-md overflow-hidden cursor-pointer group"
                          onClick={() => setSelectedImage(`${import.meta.env.VITE_URL}/${image.images}`)}
                          title="Click to preview"
                        >
                          <img
                            src={`${import.meta.env.VITE_URL}/${image.images}`}
                            className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                            alt={`Property Image ${index + 1}`}
                          />
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs">No images available</span>
                    )}
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Modal for Image Preview */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-[425px] p-4 bg-white rounded-lg shadow-lg flex flex-col items-center">
            <DialogHeader className="text-start w-full">
              <DialogTitle className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faImages} className="text-indigo-400" />
                Image Preview
              </DialogTitle>
              <DialogDescription>
                <img src={selectedImage} alt="Selected Property" className="w-full h-auto rounded-md shadow" />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="w-full flex justify-end mt-2">
              <DialogClose asChild>
                <Button className="bg-red-500 hover:bg-red-400 text-white rounded shadow">
                  <FontAwesomeIcon icon={faTimes} className="mr-1" />
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default ViewProperty;