export interface Developer {
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

export interface Project {
    id: number;
    name: string;
    location: string;
    category: string;
    units: number;
    status: string;
    developer_id?: number; 
}