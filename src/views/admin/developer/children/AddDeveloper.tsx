import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';

// Define the Developer interface if not imported
interface Developer {
    id: number;
    dev_name: string;
    dev_email: string;
    dev_phone: string;
    dev_location: string;
    image: string | File | null;
    status: number;
    created_at: string;
    updated_at: string;
}

interface AddDeveloperProps {
    developerData: Developer;
    setDeveloperData: React.Dispatch<React.SetStateAction<Developer>>;
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
                <Button className='border border-primary' disabled={isSubmitting}>
                    <FontAwesomeIcon icon={faPlus} /> Add Developer
                </Button>
            </DialogTrigger>
            <DialogContent className='md:pt-10 md:w-[80%] md:h-[80%] rounded-sm overflow-auto bg-[#eff6ff]'>
                <DialogHeader className='text-start'>
                    <DialogTitle>Add Developer</DialogTitle>
                    <p className='text-[#172554] md:text-sm'>Please fill out the form below to add a new housing developer.</p>
                </DialogHeader>
                <div className='grid grid-cols-1 md:grid-cols-1 md:gap-2 gap-4'>
                    <div>
                        <Label className='text-[#172554]'>Developer Name <span className='text-red-700'>*</span></Label>
                        <Input
                            type="text"
                            className="uppercase"
                            placeholder="Enter developer name"
                            value={developerData.dev_name}
                            onChange={(e) => setDeveloperData({ ...developerData, dev_name: e.target.value })}
                        />
                        {errors.dev_name && <p className='text-red-600 text-xs'>{errors.dev_name}</p>}
                    </div>
                    <div>
                        <Label className='text-[#172554]'>Email Address <span className='text-red-700'>*</span></Label>
                        <Input
                            type="email"
                            placeholder="Enter email"
                            value={developerData.dev_email}
                            onChange={(e) => setDeveloperData({ ...developerData, dev_email: e.target.value })}
                        />
                        {errors.dev_email && <p className='text-red-600 text-xs'>{errors.dev_email}</p>}
                    </div>
                    <div>
                        <Label className='text-[#172554]'>Phone Number <span className='text-red-700'>*</span></Label>
                        <Input
                            type="tel"
                            placeholder="Enter phone number"
                            value={developerData.dev_phone}
                            onChange={(e) => setDeveloperData({ ...developerData, dev_phone: e.target.value })}
                        />
                        {errors.dev_phone && <p className='text-red-600 text-xs'>{errors.dev_phone}</p>}
                    </div>
                    <div>
                        <Label className='text-[#172554]'>Location <span className='text-red-700'>*</span></Label>
                        <Input
                            type="text"
                            placeholder="Enter location"
                            value={developerData.dev_location}
                            onChange={(e) => setDeveloperData({ ...developerData, dev_location: e.target.value })}
                        />
                        {errors.dev_location && <p className='text-red-600 text-xs'>{errors.dev_location}</p>}
                    </div>
                    <div>
                        <Label className='text-[#172554]'>Image or Logo <span className='text-red-700'>*</span></Label>
                        <Input
                            type='file'
                            accept="image/jpeg, image/png, image/jpg, image/gif"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                        />
                        {errors.image && <p className='text-red-600 text-xs'>{errors.image}</p>}
                    </div>
                    {/* Image Preview */}
                    {developerData.image && (
                        <div className="mt-2 relative w-36 h-36 group">
                            <img
                                src={developerData.image instanceof File ? URL.createObjectURL(developerData.image) : developerData.image}
                                alt="Preview"
                                className="max-w-full max-h-[80vh] rounded-md"
                                onError={handleImageError}
                            />
                            <button
                                onClick={handleRemoveImage}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                aria-label="Remove image"
                            >
                                &times;
                            </button>
                        </div>
                    )}
                </div>

                {/* Submit and Cancel Buttons */}
                <div className='flex justify-end'>
                    <DialogFooter>
                        <div className='flex flex-row gap-2'>
                            <DialogClose asChild>
                                <Button className='bg-red-600 hover:bg-red-500 text-accent w-20 h-9 rounded-md' disabled={isSubmitting}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span>Submitting...</span>
                                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faArrowRight} />
                                        Submit
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddDeveloper;