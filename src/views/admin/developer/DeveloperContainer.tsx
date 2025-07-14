import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navigation from './navigation/NavigationDeveloper';
import axios from "../../../plugin/axios";
import Swal from 'sweetalert2';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AddDeveloper from './children/AddDeveloper';
import AddProject from './children/AddProject';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EditDeveloper from './dialog/EditDeveloper';
import { useNavigate } from 'react-router-dom';

const DeveloperContainer: React.FC = () => {
    const [developerData, setDeveloperData] = useState<any>({
        id: 0,
        dev_name: '',
        dev_email: '',
        dev_phone: '',
        dev_location: '',
        image: null,
        status: 0,
        created_at: '',
        updated_at: '',
    });
    const [projects, setProjects] = useState<{ [key: number]: any[] }>({});
    const [getAllDeveloper, setGetAllDeveloper] = useState<any[]>([]);
    const [entriesToShow, setEntriesToShow] = useState<number>(10); // State for number of entries to show
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogOpenStates, setDialogOpenStates] = useState<{ [key: number]: boolean }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        dev_name: '',
        dev_email: '',
        dev_phone: '',
        dev_location: '',
        image: '',
    });
    const navigate = useNavigate();


    const fetchDevelopers = async () => {
        try {
            const response = await axios.get('developers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                }
            });
            setGetAllDeveloper(response.data.developers);

            // Initialize projects with a default project for each developer
            const initialProjects: { [key: number]: any[] } = {};
            response.data.developers.forEach((developer: any) => {
                initialProjects[developer.id] = [{ id: Date.now(), name: '', location: '', category: '', units: 0, status: '', developer_id: developer.id }];
            });
            setProjects(initialProjects);
        } catch (error) {
            console.error('Error fetching developers:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch developers. Please login again.',
                confirmButtonText: 'OK',
            })
            localStorage.clear();
            console.clear();
            navigate('/atHomes');
        }
    };

    useEffect(() => {
        fetchDevelopers();
    }, []);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
                setDeveloperData({ ...developerData, image: file });
                setErrors({ ...errors, image: '' });
            } else {
                setErrors({ ...errors, image: 'Please upload a valid image file (jpeg, png, jpg, gif).' });
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        }
    };

    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = event.currentTarget;
        target.src = '/path/to/default-image.jpg';
        target.alt = 'Default Image';
    };

    const handleRemoveImage = () => {
        setDeveloperData({ ...developerData, image: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = () => {
        const newErrors = {
            dev_name: developerData.dev_name ? '' : 'Developer name is required.',
            dev_email: developerData.dev_email ? '' : 'Email address is required.',
            dev_phone: developerData.dev_phone ? '' : 'Phone number is required.',
            dev_location: developerData.dev_location ? '' : 'Location is required.',
            image: developerData.image ? '' : 'Image or logo is required.',
        };
        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('dev_name', developerData.dev_name);
        formData.append('dev_email', developerData.dev_email);
        formData.append('dev_phone', developerData.dev_phone);
        formData.append('dev_location', developerData.dev_location);
        if (developerData.image) {
            formData.append('image', developerData.image as File);
        }

        try {
            const response = await axios.post('developers', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            fetchDevelopers();
            setIsDialogOpen(false);
            setDeveloperData({
                id: response.data.id,
                dev_name: '',
                dev_email: '',
                dev_phone: '',
                dev_location: '',
                image: null,
                status: 0,
                created_at: '',
                updated_at: '',
            });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Developer created successfully!',
                showConfirmButton: false,
                timer: 2000,
            });
              
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'There was an error submitting the form. Please check your input and try again.',
                confirmButtonText: 'OK',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const addProject = (developerId: number) => {
        setProjects(prevProjects => ({
            ...prevProjects,
            [developerId]: [...(prevProjects[developerId] || []), { id: Date.now(), name: '', location: '', category: '', units: 0, status: '', developer_id: developerId }]
        }));
    };

    const handleProjectChange = (developerId: number, index: number, field: string, value: string | number) => {
        setProjects(prevProjects => ({
            ...prevProjects,
            [developerId]: prevProjects[developerId].map((project, i) => 
                i === index ? { ...project, [field]: value } : project
            )
        }));
    };

    const removeProject = (developerId: number, index: number) => {
        setProjects(prevProjects => ({
            ...prevProjects,
            [developerId]: prevProjects[developerId].filter((_, i) => i !== index)
        }));
    };

    const validateProjectFields = (developerId: number, index: number): boolean => {
        const project = projects[developerId][index];
        if (!project.name || !project.location || !project.category || project.units <= 0 || !project.status) {
            return false;
        }
        return true;
    };

    const handleSubmitProjects = async (developerId: number) => {
        if (loading) return;
    
        // Validate all project fields before proceeding
        let isValid = true;
        isValid = !projects[developerId].some((_, index) => !validateProjectFields(developerId, index));
    
        if (!isValid) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please correct the errors in the project fields before submitting.',
                confirmButtonText: 'OK',
            });
            return;
        }
    
        setLoading(true);
    
        try {
            await axios.post('admin/addProject', 
                { 
                    projects: projects[developerId].map(project => ({
                        developer_id: developerId,
                        project_name: project.name,
                        project_location: project.location,
                        project_category: project.category,
                        status: project.status,
                        total_units: project.units,
                    })) 
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`, 
                    }
                }
            );
    
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Projects added successfully!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
    
            setDialogOpenStates(prevState => ({
                ...prevState,
                [developerId]: false,
            }));
            setProjects(prevProjects => ({
                ...prevProjects,
                [developerId]: [{ id: Date.now(), name: '', location: '', category: '', units: 0, status: '', developer_id: developerId }]
            }));
        } catch (error) {
            console.error('Error adding projects:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error adding the projects. Please try again.',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleDialogOpen = (developerId: number, isOpen: boolean) => {
        setDialogOpenStates(prevState => ({
            ...prevState,
            [developerId]: isOpen,
        }));
    };

    return (
        <div className="py-3 md:pt-20">
        <div className="ml-72 md:ml-0 md:w-full gap-2 items-start justify-center mr-5 md:px-5 ">
            <Navigation />
            <Card className="bg-[#eef2ff] border-b-4 border-primary fade-in-left">
                <CardHeader>
                    <div className='flex flex-row justify-end'>
                        <CardTitle className='text-[#172554]'>
                            <AddDeveloper
                                developerData={developerData}
                                setDeveloperData={setDeveloperData}
                                isDialogOpen={isDialogOpen}
                                setIsDialogOpen={setIsDialogOpen}
                                isSubmitting={isSubmitting}
                                handleSubmit={handleSubmit}
                                handleImageChange={handleImageChange}
                                handleImageError={handleImageError}
                                handleRemoveImage={handleRemoveImage}
                                errors={errors}
                                fileInputRef={fileInputRef}
                            />
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Pagination and Table */}
                    <div className='py-2 flex flex-row justify-between gap-4'>
                        <Select onValueChange={(value) => setEntriesToShow(value === 'all' ? getAllDeveloper.length : Number(value))}>
                            <SelectTrigger className="w-[120px] border border-primary">
                                <span className='text-[#172554]'>Show</span>
                                <SelectValue placeholder="10" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="30">30</SelectItem>
                                <SelectItem value="40">40</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input 
                            type='text' 
                            placeholder='Search' 
                            className='w-52 md:w-full' 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className='overflow-auto'>
                        <Table className='w-full'>
                            <TableHeader className="sticky top-0 bg-primary">
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Photo</TableHead>
                                    <TableHead>Developer name</TableHead>
                                    <TableHead>Email address</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Phone number</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    getAllDeveloper.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center">No developers found.</TableCell>
                                        </TableRow>
                                    )
                                }
                                {getAllDeveloper
                                    .filter(developer => 
                                        developer.dev_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        developer.dev_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        developer.dev_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        developer.dev_phone.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .slice(0, entriesToShow)
                                    .map((developer, index) => (
                                        <TableRow key={developer.id}>
                                            <TableCell className="font-medium border border-[#bfdbfe]">{index + 1}</TableCell>
                                            <TableCell className="font-medium border border-[#bfdbfe] uppercase">
                                                {developer.dev_name ? (
                                                <img
                                                    src={`${import.meta.env.VITE_URL}/${developer.image}`}
                                                    alt={developer.dev_name}
                                                    className="rounded-full h-10 w-10"
                                                />
                                                ) : (
                                                <Avatar>
                                                    <AvatarImage src="https://github.com/shadcn.png" />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium border border-[#bfdbfe] uppercase">{developer.dev_name}</TableCell>
                                            <TableCell className='border border-[#bfdbfe]'>{developer.dev_email}</TableCell>
                                            <TableCell className='border border-[#bfdbfe]'>{developer.dev_location}</TableCell>
                                            <TableCell className='border border-[#bfdbfe]'>{developer.dev_phone}</TableCell>
                                            <TableCell className="text-right border border-[#bfdbfe]">
                                                <div className='flex flex-row gap-1 justify-end'>
                                                    <AddProject
                                                        developer={developer}
                                                        projects={projects[developer.id] || []}
                                                        dialogOpenState={dialogOpenStates[developer.id] || false}
                                                        toggleDialogOpen={toggleDialogOpen}
                                                        handleProjectChange={handleProjectChange}
                                                        addProject={addProject}
                                                        removeProject={removeProject}
                                                        handleSubmitProjects={handleSubmitProjects}
                                                        loading={loading}
                                                        setLoading={setLoading}
                                                    />

                                                    <Dialog>
                                                    <DialogTrigger>
                                                        <Button className='w-8 h-8 rounded-md' onClick={() => fetchDevelopers()}>
                                                            <FontAwesomeIcon icon={faEye} className='text-[#eff6ff]' />
                                                        </Button>
                                                    </DialogTrigger>
                                                        <DialogContent className='w-full max-w-6xl md:w-[90%] overflow-auto'>
                                                            <DialogHeader>
                                                                <DialogTitle className='text-start mb-10'><span className='uppercase'>{developer.dev_name}</span> Projects</DialogTitle>
                                                                <DialogDescription>
                                                                    
                                                                        <Table>
                                                                            <TableHeader>
                                                                                <TableRow>
                                                                                    <TableHead className="text-accent font-bold bg-primary text-center">#</TableHead>
                                                                                    <TableHead className="text-accent font-bold bg-primary text-center">Project name</TableHead>
                                                                                    <TableHead className="text-accent font-bold bg-primary text-center">Location</TableHead>
                                                                                    <TableHead className="text-accent font-bold bg-primary text-center">Category</TableHead>
                                                                                    <TableHead className="text-accent font-bold bg-primary text-center">Total Units</TableHead>
                                                                                    <TableHead className="text-accent font-bold bg-primary text-center">Total Available</TableHead>
                                                                                    <TableHead className="text-accent font-bold bg-primary text-center">Status</TableHead>
                                                                                </TableRow>
                                                                            </TableHeader>
                                                                            <TableBody>
                                                                                {developer.projects && developer.projects.length > 0 ? (
                                                                                developer.projects.map((project:any, index:any) => (
                                                                                    <TableRow key={project.id}>
                                                                                        <TableCell className='border border-[#bfdbfe]'>{index + 1}</TableCell>
                                                                                        <TableCell className='border border-[#bfdbfe]'>{project.project_name}</TableCell>
                                                                                        <TableCell className='border border-[#bfdbfe]'>{project.project_location}</TableCell>
                                                                                        <TableCell className='border border-[#bfdbfe]'>{project.project_category}</TableCell>
                                                                                        <TableCell className='border border-[#bfdbfe] text-green-500'>{project.total_units}</TableCell>
                                                                                        <TableCell className='border border-[#bfdbfe] text-red-500'>{project.available_units}</TableCell>
                                                                                        <TableCell className='border border-[#bfdbfe]'>{project.status}</TableCell>
                                                                                    </TableRow>
                                                                                ))
                                                                                ) : (
                                                                                    <TableRow>
                                                                                        <TableCell colSpan={7} className="text-center">No projects available.</TableCell>
                                                                                    </TableRow>
                                                                                )}
                                                                            </TableBody>
                                                                        </Table>
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <EditDeveloper developer={developer} fetchDevelopers={fetchDevelopers} />


                                                    
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <div className='flex flex-row justify-end mt-3'>
                            <div>
                                <p className='text-[#172554] text-sm w-full'>Showing 1 to {Math.min(entriesToShow, getAllDeveloper.length)} of {getAllDeveloper.length} entries</p>
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