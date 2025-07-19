import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { faArrowLeft, faArrowRight, faMapMarkerAlt, faTag, faCalendarAlt, faImages } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

interface PropertyImage {
  id: number;
  property_id: number;
  images: string;
  created_at: string;
  updated_at: string;
}

interface Property {
  id: number;
  property_images: PropertyImage[];
  name?: string;
  location?: string;
  price?: number;
  created_at?: string;
}

interface PropertyAddedProps {
  topPropoerty: Property[];
}

const PropertyAdded: React.FC<PropertyAddedProps> = ({ topPropoerty }) => {
  const [viewMode, setViewMode] = useState<"recent" | "all">("recent");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[] | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number>(0);

  // Modal for single image preview
  const ImagePreviewModal = ({
    url,
    onClose,
  }: {
    url: string;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative bg-white rounded-xl shadow-2xl p-4 max-w-full max-h-full flex flex-col items-center">
        <button
          className="absolute top-2 right-2 text-white bg-red-500 rounded-full px-3 py-1 text-xl hover:bg-red-400 transition"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={url}
          alt="Preview"
          className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-lg"
        />
      </div>
    </div>
  );

  // Modal for gallery preview
  const GalleryPreviewModal = ({
    images,
    index,
    onClose,
    onPrev,
    onNext,
  }: {
    images: string[];
    index: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
  }) => (
    <div className="fixed inset-0  z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative md:w-[90%] bg-white rounded-xl shadow-2xl p-4 max-w-full max-h-full flex flex-col items-center">
        <button
          className="absolute top-2 right-2 text-white bg-red-500 rounded-full px-3 py-1 text-xl hover:bg-red-400 transition"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex items-center justify-center">
          <button
            className="mr-2 px-3 py-2 text-2xl font-bold text-white bg-primary rounded-full hover:bg-blue-500 transition disabled:opacity-30"
            onClick={onPrev}
            disabled={index === 0}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <img
            src={images[index]}
            alt={`Gallery Preview ${index + 1}`}
            className="max-h-[70vh] max-w-[70vw] rounded-xl shadow-lg"
          />
          <button
            className="ml-4 px-3 py-2 text-2xl font-bold text-white bg-primary rounded-full hover:bg-blue-500 transition disabled:opacity-30"
            onClick={onNext}
            disabled={index === images.length - 1}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2 text-gray-700">
          <FontAwesomeIcon icon={faImages} />
          <span className="font-semibold">{index + 1} / {images.length}</span>
        </div>
        <div className="mt-2 flex gap-2">
          {images.map((img, idx) => (
            <button
              key={img}
              className={`w-4 h-4 rounded-full border-2 ${idx === index ? "border-primary bg-primary" : "border-gray-300 bg-gray-200"} transition`}
              onClick={() => setGalleryIndex(idx)}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-b-4 border-primary w-full md:w-full shadow-xl rounded-2xl h-full">
      <CardContent className="flex flex-col h-[500px]">
        {/* Header: Not scrollable */}
        <div className="py-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 flex-shrink-0">
          <div className="flex flex-row gap-4 items-center">
            <CardTitle className="text-base font-bold text-primary tracking-wide">
              Property Listing
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs md:text-[10px] font-semibold text-green-700 ring-2 ring-green-400/30 shadow">
              <FontAwesomeIcon icon={faTag} className="mr-1" />
              Newly added
            </span>
          </div>

          {/* Toggle Radio Group */}
          <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="property-view"
                value="recent"
                checked={viewMode === "recent"}
                onChange={() => setViewMode("recent")}
                className="form-radio text-blue-600 accent-primary focus:ring-2 focus:ring-blue-400"
              />
              <span className={`ml-2 text-sm md:text-[10px] font-medium transition-colors duration-200 ${
                viewMode === "recent" ? "text-blue-700 font-bold" : "text-gray-700"
              }`}>
                Recently Listed
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="property-view"
                value="all"
                checked={viewMode === "all"}
                onChange={() => setViewMode("all")}
                className="form-radio text-blue-600 accent-primary focus:ring-2 focus:ring-blue-400"
              />
              <span className={`ml-2 text-sm md:text-[10px] font-medium transition-colors duration-200 ${
                viewMode === "all" ? "text-blue-700 font-bold" : "text-gray-700"
              }`}>
                View All
              </span>
            </label>
          </div>
        </div>
       
        {/* Scrollable grid area with fixed height, 3 columns on desktop */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {topPropoerty.map((property, index) => {
              const images = property.property_images || [];
              const displayImages = images.slice(0, 3);
              const extraCount = images.length - 3;
              const allImageUrls = images.map(img => `${import.meta.env.VITE_URL}/${img.images}`);

              return (
                <Card
                  className="flex flex-col h-full bg-white border border-primary rounded-xl shadow-md hover:shadow-xl transition"
                  key={property.id}
                >
                  <CardHeader className="pb-0">
                    <div className="flex items-center justify-center w-full">
                      {displayImages.length > 0 ? (
                        <div className="flex flex-row gap-3 py-3 w-full justify-center">
                          {displayImages.map((image, idx) => (
                            <div
                              key={image.id}
                              className="relative w-24 h-24 bg-gray-100 flex items-center justify-center rounded-xl shadow-md overflow-hidden cursor-pointer group"
                              onClick={() => {
                                if (idx === 2 && extraCount > 0) {
                                  setGalleryImages(allImageUrls);
                                  setGalleryIndex(0);
                                } else {
                                  setPreviewUrl(`${import.meta.env.VITE_URL}/${image.images}`);
                                }
                              }}
                              title={idx === 2 && extraCount > 0 ? "View all images" : "Click to preview"}
                            >
                              <img
                                src={`${import.meta.env.VITE_URL}/${image.images}`}
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                alt={`Property Image ${idx + 1}`}
                              />
                              {/* Overlay for +N on the third image if there are more */}
                              {idx === 2 && extraCount > 0 && (
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                  <span className="text-white font-bold text-lg drop-shadow-lg">
                                    +{extraCount}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-xl shadow-md">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 justify-between">
                    {/* Property Details */}
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                        <FontAwesomeIcon icon={faTag} className="text-primary" />
                        {property.name || `Property #${index + 1}`}
                      </div>
                      {property.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-400" />
                          <span className="font-medium">Location:</span> <span className="md:text-[12px] md:font-bold">{property.location}</span>
                        </div>
                      )}
                      {property.price && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FontAwesomeIcon icon={faTag} className="text-green-500" />
                          <span className="font-medium">Price:</span> <span className="text-green-700 font-bold">₱{property.price.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FontAwesomeIcon icon={faImages} className="text-indigo-400" />
                        <span className="font-medium">Images:</span> {images.length}
                      </div>
                      {property.created_at && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                          <span className="font-medium">Date created:</span> {new Date(property.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        {/* Single Image Preview Modal */}
        {previewUrl && (
          <ImagePreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
        )}
        {/* Gallery Preview Modal */}
        {galleryImages && (
          <GalleryPreviewModal
            images={galleryImages}
            index={galleryIndex}
            onClose={() => setGalleryImages(null)}
            onPrev={() => setGalleryIndex(idx => Math.max(0, idx - 1))}
            onNext={() =>
              setGalleryIndex(idx =>
                galleryImages && idx < galleryImages.length - 1 ? idx + 1 : idx
              )
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyAdded;