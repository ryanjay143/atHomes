import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { faEye, faMapMarkerAlt, faTag } from '@fortawesome/free-solid-svg-icons';
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
    const [entriesToShow, setEntriesToShow] = useState<number>(10);
    const [searchQuery, setSearchQuery] = useState<string>('');
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
            navigate('/');
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
        <div className="flex flex-col md:flex-row gap-4">
            <div className="ml-72 md:ml-0 gap-2 items-start justify-center mr-5 md:px-2">
                <Navigation />
                <Card className="bg-[#eef2ff] border-b-4 border-primary fade-in-left md:w-[380px]">

 <CardHeader>
                    <div className="flex flex-wrap items-center gap-4 justify-between">
                        {/* Statistic Card (Left) */}
                        <div className="flex flex-col items-start bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-2 rounded-lg shadow-sm">
                            <span className="text-xs text-blue-700 font-semibold">Total Developers</span>
                            <span className="text-2xl font-bold text-blue-900">{getAllDeveloper.length}</span>
                        </div>
                        {/* Add Developer Button (Right) */}
                        <div className="flex items-center">
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
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Pagination and Table */}
                    <div className='flex flex-col md:flex-row md:justify-between justify-between gap-4'>
                        <div className='py-2 flex flex-row justify-between gap-4'>
                            <Select onValueChange={(value) => setEntriesToShow(value === 'all' ? getAllDeveloper.length : Number(value))}>
                                <SelectTrigger className="w-[120px] border border-primary md:w-28">
                                    <span className='text-[#172554]'>Show</span>
                                    <SelectValue placeholder="All" />
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
                            <Input type='text' placeholder='Search' className='w-52 md:w-full' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                    </div>
                    {/* Responsive Table: horizontal scroll only on small screens */}
                    <div className="w-full overflow-x-auto md:overflow-x-visible">
                        <Table>
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

                                                    {/* Project Card Dialog */}
                                                    <Dialog>
                                                        <DialogTrigger>
                                                            <Button className='w-8 h-8 rounded-md' onClick={() => fetchDevelopers()}>
                                                                <FontAwesomeIcon icon={faEye} className='text-[#eff6ff]' />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className='w-full max-w-3xl md:w-[90%]'>
                                                            <DialogHeader>
                                                                <DialogTitle className='text-start mb-8'>
                                                                    <span className='uppercase'>{developer.dev_name}</span> Projects
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    {developer.projects && developer.projects.length > 0 ? (
                                                                        <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
                                                                            {developer.projects.map((project: any, index: number) => (
                                                                                <div
                                                                                    key={project.id}
                                                                                    className="bg-white rounded-lg shadow border border-blue-200 p-4 flex flex-col gap-2 hover:shadow-lg transition"
                                                                                >
                                                                                    <div className="flex items-center justify-between mb-1">
                                                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                                                                                            #{index + 1}
                                                                                        </span>
                                                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                                                                            project.status === 'Active'
                                                                                                ? 'bg-green-100 text-green-700'
                                                                                                : project.status === 'Inactive'
                                                                                                    ? 'bg-red-100 text-red-700'
                                                                                                    : 'bg-gray-100 text-gray-700'
                                                                                        }`}>
                                                                                            {project.status}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="font-bold text-base text-blue-900 truncate">
                                                                                        {project.project_name}
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                                                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-400" />
                                                                                        <span>{project.project_location}</span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                                                                        <FontAwesomeIcon icon={faTag} className="text-blue-400" />
                                                                                        <span>{project.project_category}</span>
                                                                                    </div>
                                                                                    <div className="flex flex-row justify-between mt-1">
                                                                                        <div className="flex flex-col items-center">
                                                                                            <span className="text-[10px] text-gray-500">Total Units</span>
                                                                                            <span className="font-bold text-green-600 text-sm">{project.total_units}</span>
                                                                                        </div>
                                                                                        <div className="flex flex-col items-center">
                                                                                            <span className="text-[10px] text-gray-500">Available</span>
                                                                                            <span className="font-bold text-red-500 text-sm">{project.available_units}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-center text-gray-500 py-8">No projects available.</div>
                                                                    )}
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