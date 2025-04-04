import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { faArrowRight, faEye, faPen, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navigation from './navigation/NavigationDeveloper';
import axios from "../../../plugin/axios";
import Swal from 'sweetalert2';

const DeveloperContainer = () => {
    const [projects, setProjects] = useState([{ name: '', location: '', contact: '' }]);
    const [newProject, setNewProject] = useState({ name: '', location: '', contact: '' });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [developerData, setDeveloperData] = useState({
        dev_name: '',
        dev_email: '',
        dev_phone: '',
        dev_location: '',
        image: null as File | string | null,
    });
    const [responseData, setResponseData] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [errors, setErrors] = useState({
        dev_name: '',
        dev_email: '',
        dev_phone: '',
        dev_location: '',
        image: '',
        project_name: '',
        project_location: '',
        project_contact: '',
    });
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Add a new project
    const addProject = () => {

        setProjects([...projects, newProject]);
        
        setNewProject({ name: '', location: '', contact: '' });
    };

    // Delete a project
    const deleteProject = (index: number) => {
        const updatedProjects = projects.filter((_, i) => i !== index);
        setProjects(updatedProjects);
    };

    // Handle image selection
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
                setImagePreview(URL.createObjectURL(file));
                setDeveloperData({ ...developerData, image: file });
                setErrors({ ...errors, image: '' });
            } else {
                setErrors({ ...errors, image: 'Please upload a valid image file (jpeg, png, jpg, gif).' });
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Clear the file input
                }
            }
        }
    };

    // Handle image error (fallback to default image)
    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = event.currentTarget;
        target.src = '/path/to/default-image.jpg';
        target.alt = 'Default Image';
    };

    // Remove selected image
    const handleRemoveImage = () => {
        setImagePreview(null);
        setDeveloperData({ ...developerData, image: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Validate form inputs
    const validateForm = () => {
        const newErrors = {
            dev_name: developerData.dev_name ? '' : 'Developer name is required.',
            dev_email: developerData.dev_email ? '' : 'Email address is required.',
            dev_phone: developerData.dev_phone ? '' : 'Phone number is required.',
            dev_location: developerData.dev_location ? '' : 'Location is required.',
            image: developerData.image ? '' : 'Image or logo is required.',
            project_name: newProject.name ? '' : 'Project name is required.',
            project_location: newProject.location ? '' : 'Project location is required.',
            project_contact: newProject.contact ? '' : 'Project contact person is required.',
        };
        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    // Submit developer and project data
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        let updatedProjects = projects;
        if (newProject.name && newProject.location && newProject.contact) {
            updatedProjects = [newProject, ...projects];
        }

        const formData = new FormData();
        formData.append('dev_name', developerData.dev_name);
        formData.append('dev_email', developerData.dev_email);
        formData.append('dev_phone', developerData.dev_phone);
        formData.append('dev_location', developerData.dev_location);
        if (developerData.image) {
            formData.append('image', developerData.image as File);
        }

        updatedProjects.forEach((project, index) => {
            formData.append(`projects[${index}][project_name]`, project.name);
            formData.append(`projects[${index}][project_location]`, project.location);
            formData.append(`projects[${index}][project_contact_person]`, project.contact);
        });

        try {
            const response = await axios.post('developers', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            });

            setIsDialogOpen(false);
            setProjects([]);
            setNewProject({ name: '', location: '', contact: '' });
            setDeveloperData({
                dev_name: '',
                dev_email: '',
                dev_phone: '',
                dev_location: '',
                image: null,
            });
            setImagePreview(null);

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Developer and projects created successfully!',
                confirmButtonText: 'OK',
            });
            setResponseData(response.data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'There was an error submitting the form. Please check your input and try again.',
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <div className='py-5 md:pt-20'>
            <div className='ml-72 md:ml-0 md:w-full gap-2 items-start justify-center mt-5 mr-5 md:px-5'>
                <Navigation />
                <Card className='bg-[#eff6ff] border-b-4 border-primary fade-in-left'>
                    <CardHeader>
                        <div className='flex flex-row justify-end'>
                            <CardTitle className='text-[#172554]'>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className='border border-primary'>
                                            <FontAwesomeIcon icon={faPlus} /> Add Developer
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className='md:pt-10 md:w-[80%] md:h-[80%] w-full max-w-6xl rounded-sm overflow-auto h-svh bg-[#eff6ff]'>
                                        <DialogHeader className='text-start'>
                                            <DialogTitle>Add Developer</DialogTitle>
                                            <p className='text-[#172554]'>Please fill out the form below to add a new housing developer.</p>
                                        </DialogHeader>
                                        <div className='grid grid-cols-4 md:grid-cols-2 md:gap-2 gap-4'>
                                            {/* Developer Form */}
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
                                                <Label className='text-[#172554]'>Image or Logo</Label>
                                                <Input
                                                    type='file'
                                                    accept="image/jpeg, image/png, image/jpg, image/gif"
                                                    onChange={handleImageChange}
                                                    ref={fileInputRef}
                                                />
                                                {errors.image && <p className='text-red-600 text-xs'>{errors.image}</p>}
                                            </div>
                                            {/* Image Preview */}
                                            {imagePreview && (
                                                <div className="mt-2 relative w-36 h-36 group">
                                                    <img
                                                        src={imagePreview}
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
                                        {/* Project Details */}
                                        <div className='mt-5'>
                                            <DialogHeader>
                                                <DialogTitle className='text-start'>Project Details</DialogTitle>
                                            </DialogHeader>

                                            {/* New Project Input Fields */}
                                            <div className='mt-5 grid grid-cols-3 md:grid-cols-1 md:gap-2 gap-4'>
                                                <div>
                                                    <Label className='text-[#172554]'>Project Name <span className='text-red-700'>*</span></Label>
                                                    <Input
                                                        type='text'
                                                        className='uppercase'
                                                        placeholder='Enter project name'
                                                        value={newProject.name}
                                                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                                    />
                                                    {errors.project_name && <p className='text-red-600 text-xs'>{errors.project_name}</p>}
                                                </div>

                                                <div>
                                                    <Label className='text-[#172554]'>Location <span className='text-red-700'>*</span></Label>
                                                    <Input
                                                        type='text'
                                                        placeholder='Enter location'
                                                        value={newProject.location}
                                                        onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                                                    />
                                                    {errors.project_location && <p className='text-red-600 text-xs'>{errors.project_location}</p>}
                                                </div>
                                                <div>
                                                    <Label className='text-[#172554]'>Contact Person <span className='text-red-700'>*</span></Label>
                                                    <Input
                                                        type='text'
                                                        placeholder='Enter contact person'
                                                        value={newProject.contact}
                                                        onChange={(e) => setNewProject({ ...newProject, contact: e.target.value })}
                                                    />
                                                    {errors.project_contact && <p className='text-red-600 text-xs'>{errors.project_contact}</p>}
                                                </div>
                                            </div>

                                        

                                            {/* Existing Projects */}
                                            <div className='mt-5 grid grid-cols-3 md:grid-cols-1 md:gap-2 gap-4'>
                                                {projects.map((project, index) => (
                                                    <React.Fragment key={index}>
                                                        <div>
                                                            <Label className='text-[#172554]'>Project Name</Label>
                                                            <Input
                                                                type='text'
                                                                className='uppercase'
                                                                placeholder='Enter project name'
                                                                value={project.name}
                                                                onChange={(e) => {
                                                                    const updatedProjects = [...projects];
                                                                    updatedProjects[index].name = e.target.value;
                                                                    setProjects(updatedProjects);
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className='text-[#172554]'>Location</Label>
                                                            <Input
                                                                type='text'
                                                                placeholder='Enter location'
                                                                value={project.location}
                                                                onChange={(e) => {
                                                                    const updatedProjects = [...projects];
                                                                    updatedProjects[index].location = e.target.value;
                                                                    setProjects(updatedProjects);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className='flex items-center'>
                                                            <div className='flex-1'>
                                                                <Label className='text-[#172554]'>Contact Person</Label>
                                                                <Input
                                                                    type='text'
                                                                    placeholder='Enter contact person'
                                                                    value={project.contact}
                                                                    onChange={(e) => {
                                                                        const updatedProjects = [...projects];
                                                                        updatedProjects[index].contact = e.target.value;
                                                                        setProjects(updatedProjects);
                                                                    }}
                                                                />
                                                            </div>
                                                            <button
                                                                className='ml-2 mt-6 rounded-md'
                                                                onClick={() => deleteProject(index)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrashCan} className='text-red-600 w-5 h-5' />
                                                            </button>
                                                        </div>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                            {/* Add Project Button */}
                                        <div className='col-span-4 mt-2'>
                                                <Button type="button" className='w-32 h-8' onClick={addProject}>
                                                    <FontAwesomeIcon icon={faPlus} /> Add Project
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className='flex justify-end'>
                                            <DialogFooter>
                                                <div className='flex flex-row gap-2'>
                                                    <DialogClose asChild>
                                                        <button className='bg-red-600 text-accent w-20 h-9 rounded-md'>Cancel</button>
                                                    </DialogClose>
                                                    <Button type="submit" onClick={handleSubmit}>
                                                        <FontAwesomeIcon icon={faArrowRight} /> Submit
                                                    </Button>
                                                </div>
                                            </DialogFooter>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Pagination and Table */}
                        <div className='py-2 flex flex-row justify-between'>
                            <Select>
                                <SelectTrigger className="w-[120px] border border-primary">
                                    <span className='text-[#172554]'>Show</span>
                                    <SelectValue placeholder="10" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="30">30</SelectItem>
                                    <SelectItem value="40">40</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input type='text' placeholder='Search' className='w-52' />
                        </div>
                        <div className='h-full overflow-auto'>
                            <Table className='w-full'>
                                <TableHeader className="sticky top-0 bg-primary">
                                    <TableRow>
                                        <TableHead className="border border-[#bfdbfe] text-accent font-bold bg-primary">Developer name</TableHead>
                                        <TableHead className='border border-[#bfdbfe] text-accent font-bold bg-primary'>Email address</TableHead>
                                        <TableHead className='border border-[#bfdbfe] text-accent font-bold bg-primary'>Phone number</TableHead>
                                        <TableHead className="text-right border border-[#bfdbfe] text-accent font-bold bg-primary">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium border border-[#bfdbfe]">INV001</TableCell>
                                        <TableCell className='border border-[#bfdbfe]'>Paid</TableCell>
                                        <TableCell className='border border-[#bfdbfe]'>Credit Card</TableCell>
                                        <TableCell className="text-right border border-[#bfdbfe]">
                                            <div className='flex flex-row gap-1 justify-end'>
                                                <Button className='w-8 h-8 rounded-xl border border-primary'>
                                                    <FontAwesomeIcon icon={faEye} className='text-[#eff6ff]' />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <div className='flex flex-row justify-between mt-3'>
                                <div>
                                    <p className='text-[#172554] text-sm w-full'>Showing 1 to 10 of 57 entries</p>
                                </div>
                                <div>
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious href="#" />
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink href="#">1</PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationNext href="#" />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DeveloperContainer;