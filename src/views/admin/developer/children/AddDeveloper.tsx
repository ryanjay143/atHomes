import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowRight, faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';

interface AddDeveloperProps {
  developerData: any;
  setDeveloperData: React.Dispatch<React.SetStateAction<any>>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  handleSubmit: (event: React.FormEvent) => void;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageError: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  handleRemoveImage: () => void;
  errors: {
    dev_name: string;
    dev_email: string;
    dev_phone: string;
    dev_location: string;
    image: string;
  };
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const AddDeveloper: React.FC<AddDeveloperProps> = ({
  developerData,
  setDeveloperData,
  isDialogOpen,
  setIsDialogOpen,
  isSubmitting,
  handleSubmit,
  handleImageChange,
  handleImageError,
  handleRemoveImage,
  errors,
  fileInputRef,
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className='border border-primary bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-200' disabled={isSubmitting}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Developer
        </Button>
      </DialogTrigger>
      <DialogContent className='md:pt-10 h-full md:w-[90%] md:max-w-xl overflow-auto bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border border-blue-200'>
        <DialogHeader className='text-start mb-2'>
          <DialogTitle className="text-2xl font-bold text-blue-900">Add Developer</DialogTitle>
          <p className='text-blue-800 md:text-sm mt-1'>Please fill out the form below to add a new housing developer.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-5'>
            <div>
              <Label className='text-blue-900 font-semibold'>Developer Name <span className='text-red-700'>*</span></Label>
              <Input
                type="text"
                className="uppercase rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
                placeholder="Enter developer name"
                value={developerData.dev_name}
                onChange={(e) => setDeveloperData({ ...developerData, dev_name: e.target.value })}
                autoFocus
              />
              {errors.dev_name && <p className='text-red-600 text-xs mt-1'>{errors.dev_name}</p>}
            </div>
            <div>
              <Label className='text-blue-900 font-semibold'>Email Address <span className='text-red-700'>*</span></Label>
              <Input
                type="email"
                className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
                placeholder="Enter email"
                value={developerData.dev_email}
                onChange={(e) => setDeveloperData({ ...developerData, dev_email: e.target.value })}
              />
              {errors.dev_email && <p className='text-red-600 text-xs mt-1'>{errors.dev_email}</p>}
            </div>
            <div>
              <Label className='text-blue-900 font-semibold'>Phone Number <span className='text-red-700'>*</span></Label>
              <Input
                type="tel"
                className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
                placeholder="Enter phone number"
                value={developerData.dev_phone}
                onChange={(e) => setDeveloperData({ ...developerData, dev_phone: e.target.value })}
              />
              {errors.dev_phone && <p className='text-red-600 text-xs mt-1'>{errors.dev_phone}</p>}
            </div>
            <div>
              <Label className='text-blue-900 font-semibold'>Location <span className='text-red-700'>*</span></Label>
              <Input
                type="text"
                className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-1"
                placeholder="Enter location"
                value={developerData.dev_location}
                onChange={(e) => setDeveloperData({ ...developerData, dev_location: e.target.value })}
              />
              {errors.dev_location && <p className='text-red-600 text-xs mt-1'>{errors.dev_location}</p>}
            </div>
            <div>
              <Label className='text-blue-900 font-semibold'>Image or Logo <span className='text-red-700'>*</span></Label>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="dev-image-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-4 bg-white hover:bg-blue-50 cursor-pointer transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faUpload} className="text-blue-400 text-3xl mb-2" />
                  <span className="text-blue-700 font-medium">Click to upload image here</span>
                  <span className="text-xs text-gray-500 mt-1">(JPEG, PNG, JPG only, max 5MB)</span>
                  <Input
                    id="dev-image-upload"
                    type='file'
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
                {errors.image && <p className='text-red-600 text-xs mt-1'>{errors.image}</p>}
              </div>
              {/* Image Preview */}
              {developerData.image && (
                <div className="mt-3 relative w-36 h-36 group mx-auto">
                  <img
                    src={developerData.image instanceof File ? URL.createObjectURL(developerData.image) : developerData.image}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border-2 border-blue-200 shadow-md"
                    onError={handleImageError}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-500 transition"
                    aria-label="Remove image"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Submit and Cancel Buttons */}
          <DialogFooter className="mt-6">
            <div className='flex flex-row gap-2 w-full justify-end'>
              <DialogClose asChild>
                <Button
                  type="button"
                  className='bg-red-600 hover:bg-red-500 text-white w-24 h-10 rounded-lg shadow'
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white w-32 h-10 rounded-lg shadow hover:from-blue-700 hover:to-blue-900 flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeveloper;