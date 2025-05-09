import React, { useState } from 'react';
import { Developer, Project } from '../../../../helper/developer'; // Adjust the path as necessary
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { faPlus, faArrowRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface AddProjectProps {
    developer: Developer;
    projects: Project[];
    dialogOpenState: boolean;
    toggleDialogOpen: (developerId: number, isOpen: boolean) => void;
    handleProjectChange: (developerId: number, index: number, field: string, value: string | number) => void;
    addProject: (developerId: number) => void;
    removeProject: (developerId: number, index: number) => void;
    handleSubmitProjects: (developerId: number) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const AddProject: React.FC<AddProjectProps> = ({
    developer,
    projects,
    dialogOpenState,
    loading,
    toggleDialogOpen,
    handleProjectChange,
    addProject,
    removeProject,
    handleSubmitProjects,
}) => {
    const [errors, setErrors] = useState<{ [key: number]: { [index: number]: { [field: string]: string } } }>({});

    const validateProjectFields = (developerId: number, index: number) => {
        const project = projects[index];
        const newErrors: { [field: string]: string } = {};

        if (!project.name) newErrors.name = 'Project name is required.';
        if (!project.location) newErrors.location = 'Location is required.';
        if (!project.category) newErrors.category = 'Category is required.';
        if (project.units <= 0) newErrors.units = 'Total units must be greater than 0.';
        if (!project.status) newErrors.status = 'Status is required.';

        setErrors(prevErrors => ({
            ...prevErrors,
            [developerId]: {
                ...prevErrors[developerId],
                [index]: newErrors,
            },
        }));

        return Object.keys(newErrors).length === 0;
    };

    const validateAllProjects = (developerId: number) => {
        let isValid = true;
        projects.forEach((_, index) => {
            if (!validateProjectFields(developerId, index)) {
                isValid = false;
            }
        });
        return isValid;
    };

    const handleSubmit = (developerId: number) => {
        if (validateAllProjects(developerId)) {
            handleSubmitProjects(developerId);
        }
    };

    return (
        <Dialog open={dialogOpenState} onOpenChange={(isOpen) => toggleDialogOpen(developer.id, isOpen)}>
            <DialogTrigger>
                <Button className='w-8 h-8 rounded-md bg-green-500 hover:bg-green-400' >
                    <FontAwesomeIcon icon={faPlus} className='text-[#eff6ff]' />
                </Button>
            </DialogTrigger>
            <DialogContent className='w-full max-w-7xl overflow-auto h-full'>
                <DialogHeader>
                    <DialogTitle className='text-start'>Add Projects for <span className='uppercase'>{developer.dev_name}</span></DialogTitle>
                    <DialogDescription>
                        {/* Descriptive Labels */}
                        <div className='mb-4 text-start mt-4 grid grid-cols-2'>
                            <div className='flex items-center mb-2'>
                                <div className='w-8 h-3 bg-blue-500 mr-2'></div>
                                <p className='text-xs'>Planning – Still in blueprint or permit phase.</p>
                            </div>
                            <div className='flex items-center mb-2'>
                                <div className='w-8 h-3 bg-yellow-500 mr-2'></div>
                                <p className='text-xs'>Pre-Development – Site clearing and initial groundwork.</p>
                            </div>
                            <div className='flex items-center mb-2'>
                                <div className='w-8 h-3 bg-orange-500 mr-2'></div>
                                <p className='text-xs'>Ongoing – Construction is actively in progress.</p>
                            </div>
                            <div className='flex items-center mb-2'>
                                <div className='w-8 h-3 bg-green-500 mr-2'></div>
                                <p className='text-xs'>Ready for Occupancy (RFO) – Units are ready to be moved into.</p>
                            </div>
                            <div className='flex items-center mb-2'>
                                <div className='w-8 h-3 bg-gray-500 mr-2'></div>
                                <p className='text-xs'>Completed – Fully finished and turned over.</p>
                            </div>
                        </div>

                        <div className='mt-5 '>
                            {projects.map((project, index) => (
                                <div key={project.id} className='grid grid-cols-5 gap-4 mb-4'>
                                    <div className="hidden">
                                        <Input 
                                            type="text" 
                                            value={developer.id}
                                        />
                                    </div>
                                    <div className="grid w-full items-center text-start gap-1.5">
                                        <Label>Project Name</Label>
                                        <Input 
                                            type="text" 
                                            placeholder='Enter project' 
                                            value={project.name}
                                            onChange={(e) => handleProjectChange(developer.id, index, 'name', e.target.value)}
                                        />
                                        {errors[developer.id]?.[index]?.name && <p className="text-red-500 text-xs">{errors[developer.id]?.[index]?.name}</p>}
                                    </div>

                                    <div className="grid w-full items-center text-start gap-1.5">
                                        <Label>Location</Label>
                                        <Input 
                                            type="text" 
                                            placeholder='Enter location' 
                                            value={project.location}
                                            onChange={(e) => handleProjectChange(developer.id, index, 'location', e.target.value)}
                                        />
                                        {errors[developer.id]?.[index]?.location && <p className="text-red-500 text-xs">{errors[developer.id][index].location}</p>}
                                    </div>

                                    <div className="grid w-full items-center text-start gap-1.5">
                                        <Label>Category</Label>
                                        <Select onValueChange={(value) => handleProjectChange(developer.id, index, 'category', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Lot only">Lot only</SelectItem>
                                                <SelectItem value="House and lot">House and lot</SelectItem>
                                                <SelectItem value="Condominium/Apartment">Condominium/Apartment</SelectItem>
                                                <SelectItem value="Commercial Building">Commercial Building</SelectItem>
                                                <SelectItem value="Rental Building">Rental Building</SelectItem>
                                                <SelectItem value="Farm Lot">Farm Lot</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors[developer.id]?.[index]?.category && <p className="text-red-500 text-xs">{errors[developer.id][index].category}</p>}
                                    </div>

                                    <div className="grid w-full items-center text-start gap-1.5">
                                        <Label>Total Units</Label>
                                        <Input 
                                            type="number" 
                                            min='0' 
                                            placeholder='0' 
                                            onFocus={(e) => e.target.placeholder = ''}
                                            onChange={(e) => handleProjectChange(developer.id, index, 'units', Number(e.target.value))}
                                        />
                                        {errors[developer.id]?.[index]?.units && <p className="text-red-500 text-xs">{errors[developer.id][index].units}</p>}
                                    </div>

                                    <div className="grid w-full items-center text-start gap-1.5">
                                        <Label>Status</Label>
                                        <div className='flex flex-row gap-2'>
                                            <Select onValueChange={(value) => handleProjectChange(developer.id, index, 'status', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Planning">Planning</SelectItem>
                                                    <SelectItem value="Pre-Development">Pre-Development</SelectItem>
                                                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                                                    <SelectItem value="Ready for Occupancy">Ready for Occupancy</SelectItem>
                                                    <SelectItem value="Completed">Completed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors[developer.id]?.[index]?.status && <p className="text-red-500 text-xs">{errors[developer.id][index].status}</p>}
                                            {index !== 0 && (
                                                <Button className='bg-red-500 hover:bg-red-400' onClick={() => removeProject(developer.id, index)}>
                                                    <FontAwesomeIcon icon={faTrash} className='text-[#eff6ff]' />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
  
                            <div className="flex justify-start mt-4">
                                <Button onClick={() => addProject(developer.id)} className='mt-4' disabled={loading}>
                                    <FontAwesomeIcon icon={faPlus} className='text-[#eff6ff]' />
                                    Add Project
                                </Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex justify-end mt-4 flex-row  gap-2">
                        <DialogClose asChild>
                            <Button className='mt-4 bg-red-500 hover:bg-red-400' disabled={loading}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={() => handleSubmit(developer.id)} className='mt-4 bg-green-500 hover:bg-green-400' disabled={loading}>
                            {loading ? (
                                <>
                                    <span>Submitting...</span>
                                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faArrowRight} className='text-[#eff6ff]' />
                                    <span>Submit</span>
                                </>
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddProject;