import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { faArrowRight, faEye, faPen, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import Navigation from './navigation/NavigationDeveloper'

const DeveloperContainer = () => {
    const [projects, setProjects] = useState([{ name: '', location: '', contact: '' }]);
    const [newProject, setNewProject] = useState({ name: '', location: '', contact: '' });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const addProject = () => {
        setProjects([...projects, newProject]);
        setNewProject({ name: '', location: '', contact: '' });
    };

    const deleteProject = (index:any) => {
        const newProjects = projects.filter((_, i) => i !== index);
        setProjects(newProjects);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = event.currentTarget;
        if (target instanceof HTMLImageElement) {
            target.src = '/path/to/default-image.jpg'; // Ensure this path is correct
            target.alt = 'Default Image'; // Update alt text for fallback
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null); // Clear the image preview
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input value
        }
    };


  return (
    <div className='py-5 md:pt-20'>
        <div className='ml-72 md:ml-0 md:w-full gap-2 items-start justify-center mt-5 mr-5 md:px-5'>
        <Navigation/>
            <Card className='bg-[#eff6ff] border-b-4 border-primary fade-in-left'>
                <CardHeader>
                    <div className='flex flex-row justify-end'>
                        {/* <CardTitle className='text-[#172554]'>List of Accredited Developers</CardTitle> */}
                            <CardTitle className='text-[#172554]'>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className='border border-primary'>
                                        <FontAwesomeIcon icon={faPlus}/> Add Developer
                                    </Button>
                                </DialogTrigger>
                                <div className=''>
                                <DialogContent className='md:pt-10 md:w-[80%] md:h-[80%] w-full max-w-6xl rounded-sm overflow-auto h-svh bg-[#eff6ff] md:overflow-auto'>
                                        <DialogHeader className='text-start'>
                                            <DialogTitle>Add developer</DialogTitle>
                                            <p className='text-[#172554]'>Please fill out the form below to add a new housing developer.</p>
                                        </DialogHeader>
                                        <div className='grid grid-cols-4 md:grid-cols-2 md:gap-2 gap-4'>
                                            <div>
                                                <Label className='text-[#172554]'>
                                                    Developer name <span className='text-red-700'>*</span>
                                                </Label>
                                                <Input type='text' className='uppercase' placeholder='Enter developer name'/>
                                            </div>
                                            <div>
                                                <Label className='text-[#172554]'>
                                                    Email address <span className='text-red-700'>*</span>
                                                </Label>
                                                <Input type='email' placeholder='Enter email'/>
                                            </div>
                                            <div>
                                                <Label className='text-[#172554]'>
                                                    Phone number <span className='text-red-700'>*</span>
                                                </Label>
                                                <Input type='tel' placeholder='Enter phone number'/>
                                            </div>
                                            <div>
                                                <Label className='text-[#172554]'>
                                                    Location <span className='text-red-700'>*</span>
                                                </Label>
                                                <Input type='text' placeholder='Enter location'/>
                                            </div>
                                            <div>
                                                <Label className='text-[#172554]'>Image or Logo</Label>
                                                <Input
                                                    type='file'
                                                    onChange={handleImageChange}
                                                    ref={fileInputRef} // Attach the ref to the input
                                                />
                                            </div>
                                            <div>
                                                {imagePreview && (
                                                    <div className="mt-2 relative w-36 h-36 group">
                                                        <img
                                                            src={imagePreview || '/path/to/default-image.jpg'} // Use default if imagePreview is null
                                                            alt="Full Preview"
                                                            className="max-w-full max-h-[80vh] rounded-md"
                                                            onError={handleImageError} // Attach the error handler here
                                                        />
                                                        <div
                                                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                            onClick={() => setIsImageModalOpen(true)} // Open modal on overlay click
                                                        >
                                                            <span className="text-white text-sm font-semibold">Preview</span>
                                                        </div>
                                                        <button
                                                            onClick={handleRemoveImage} // Remove image and clear input
                                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                            aria-label="Remove image"
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                )}
                                                {isImageModalOpen && (
                                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                        <div className="bg-white p-4 rounded-md relative">
                                                            <button
                                                                onClick={() => setIsImageModalOpen(false)} // Close modal
                                                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                                aria-label="Close preview"
                                                            >
                                                                &times;
                                                            </button>
                                                            <img
                                                                src={imagePreview || '/path/to/default-image.jpg'} // Use default if imagePreview is null
                                                                alt="Full Preview"
                                                                className="max-w-full max-h-[80vh] rounded-md"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
           
                                            
                                        </div>
                                        <div>
                                            <div className='mt-5'>
                                                <DialogHeader>
                                                    <DialogTitle className='text-start'>Project details</DialogTitle>
                                                </DialogHeader>

                                                <div className='mt-5 grid grid-cols-3 md:grid-cols-1 md:gap-2 gap-4'>
                                                    <div>
                                                        <Label className='text-[#172554]'>
                                                            Project Name <span className='text-red-700'>*</span>
                                                        </Label>
                                                        <Input type='text' className='uppercase' placeholder='Enter project name'
                                                            value={newProject.name} onChange={(e) => {
                                                            setNewProject({ ...newProject, name: e.target.value });
                                                            
                                                        }} />
                                                    </div>
                                                    
                                                    <div>
                                                        <Label className='text-[#172554]'>
                                                            Location <span className='text-red-700'>*</span>
                                                        </Label>
                                                        <Input type='text' placeholder='Enter location'
                                                            value={newProject.location} onChange={(e) => {
                                                            setNewProject({ ...newProject, location: e.target.value });
                                                        }} />
                                                    </div>

                                                    <div>
                                                        <Label className='text-[#172554]'>
                                                            Contact person <span className='text-red-700'>*</span>
                                                        </Label>
                                                        <Input type='text' placeholder='Enter contact person'
                                                            value={newProject.contact} onChange={(e) => {
                                                            setNewProject({ ...newProject, contact: e.target.value });
                                                        }} />
                                                    </div>
                                                </div>

                                                <div className='mt-5 grid grid-cols-3 md:grid-cols-1 md:gap-2 gap-4'>
                                                    {projects.map((project, index) => (
                                                        <React.Fragment key={index}>
                                                            <div>
                                                                <Label className='text-[#172554]'>
                                                                    Project Name
                                                                </Label>
                                                                <Input type='text' className='uppercase' placeholder='Enter project name'
                                                                    value={project.name} onChange={(e) => {
                                                                    const newProjects = [...projects];
                                                                    newProjects[index].name = e.target.value;
                                                                    setProjects(newProjects);
                                                                }} />
                                                            </div>
                                                            
                                                            <div>
                                                                <Label className='text-[#172554]'>
                                                                    Location
                                                                </Label>
                                                                <Input type='text' placeholder='Enter location'
                                                                    value={project.location} onChange={(e) => {
                                                                    const newProjects = [...projects];
                                                                    newProjects[index].location = e.target.value;
                                                                    setProjects(newProjects);
                                                                }} />
                                                            </div>

                                                            <div className='flex items-center'>
                                                                <div className='flex-1'>
                                                                    <Label className='text-[#172554]'>
                                                                        Contact person
                                                                    </Label>
                                                                    <Input type='text' placeholder='Enter contact person'
                                                                        value={project.contact} onChange={(e) => {
                                                                        const newProjects = [...projects];
                                                                        newProjects[index].contact = e.target.value;
                                                                        setProjects(newProjects);
                                                                    }} />
                                                                </div>
                                                                <button className='ml-2 mt-6 rounded-md' onClick={() => deleteProject(index)}>
                                                                    <FontAwesomeIcon icon={faTrashCan} className='text-red-600 w-5 h-5'/>
                                                                </button>
                                                            </div>
                                                        </React.Fragment>
                                                    ))}
                                                </div>

                                                

                                                <div className='col-span-4 mt-2'>
                                                    <Button className='w-32 h-8' onClick={addProject}>
                                                        <FontAwesomeIcon icon={faPlus} /> Add Project
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex justify-end'>
                                            <DialogFooter>
                                                <div className='flex flex-row gap-2'>
                                                    <DialogClose asChild>
                                                        <div className="dialog">
                                                            <button className='bg-red-600 text-accent w-20 h-9 rounded-md'>
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </DialogClose>
                                                    <Button type="submit">
                                                        <FontAwesomeIcon icon={faArrowRight} /> Submit
                                                    </Button>
                                                </div>
                                               
                                            </DialogFooter>
                                        </div>
                                        
                                    </DialogContent>
                                </div>
                                  
                            </Dialog>

                            </CardTitle>
                    </div>
                    
                </CardHeader>
                
                <CardContent>
                    <div className='py-2 flex flex-row justify-between'>
                        <Select>
                            <SelectTrigger className="w-[120px] border border-primary">
                                <span className='text-[#172554]'>Show</span>
                                <SelectValue placeholder="10" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">10</SelectItem>
                                <SelectItem value="dark">20</SelectItem>
                                <SelectItem value="darw">30</SelectItem>
                                <SelectItem value="systemwe">40</SelectItem>
                                <SelectItem value="system">50</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input type='text' placeholder='Search' className='w-52 '/>
                    </div>
                    <div className='h-full overflow-auto'>
                        <Table className='w-full'>
                        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                            <TableHeader className="sticky top-0 bg-primary">
                                <TableRow>
                                    <TableHead className="w-[100px] border border-[#bfdbfe] text-accent font-bold bg-primary">Invoice</TableHead>
                                    <TableHead className='border border-[#bfdbfe] text-accent font-bold bg-primary'>Status</TableHead>
                                    <TableHead className='border border-[#bfdbfe] text-accent font-bold bg-primary'>Method</TableHead>
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
                                                <FontAwesomeIcon icon={faEye} className='text-[#eff6ff]'/>
                                            </Button>
                                            <Button className='w-8 h-8 rounded-xl border border-primary'>
                                                <FontAwesomeIcon icon={faPen} className='text-[#eff6ff]'/>
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
  )
}

export default DeveloperContainer
