import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ViewPropertyProps {
  property: any;
  dateFormatter: Intl.DateTimeFormat;
}

function ViewProperty({ property, dateFormatter }: ViewPropertyProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for selected image

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button className='h-8 w-8 font-medium bg-blue-500 hover:bg-blue-400 text-sm rounded-md'>
            <FontAwesomeIcon icon={faEye} />
          </Button>
        </DialogTrigger>
        <DialogContent className="md:max-w-[400px] p-6 overflow-auto max-h-[95%] bg-white rounded-lg shadow-lg">
          <DialogHeader className='text-start'>
            <DialogTitle className="text-xl font-bold mb-4">View Property Listing</DialogTitle>
            <DialogDescription>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-2">General Information</h3>
                  <p><strong>Category:</strong> {property.category}</p>
                  <p><strong>Date Listed:</strong> {dateFormatter.format(new Date(property.date_listed))}</p>
                  <p><strong>Location:</strong> {property.location}</p>
                  <p><strong>Type of Listing:</strong> {property.type_of_listing}</p>
                  <p><strong>Status:</strong> {property.status}</p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-2">Description of Property</h3>
                  <p><strong>Lot Area:</strong> {property.lot_area} sqm</p>
                  <p><strong>Floor Area:</strong> {property.floor_area} sqm</p>
                  <p><strong>Other Details:</strong> {property.details || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Property Images</h3>
                  <div className="grid grid-cols-5 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 flex-wrap mt-4">
                    {property.property_images && property.property_images.length > 0 ? (
                      property.property_images.map((image: any, index: any) => (
                        <div
                          key={index}
                          className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md shadow-md overflow-hidden cursor-pointer"
                          onClick={() => setSelectedImage(`${import.meta.env.VITE_URL}/${image.images}`)}
                        >
                          <img
                            src={`${import.meta.env.VITE_URL}/${image.images}`}
                            className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
                            alt={`Property Image ${index + 1}`}
                          />
                        </div>
                      ))
                    ) : (
                      <p>No images available</p>
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
    </>
  );
}

export default ViewProperty;