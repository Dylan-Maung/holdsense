import { Hold } from './hold';

export interface Route {
    // Required
    id: string;
    userId: string;
    grade: string;
    gym: string;
    date: string;
    status: 'Flash' | 'Onsight' | 'Project' | 'Sent';
    quality: number;
    holds: Hold[];
    fullRouteImages?: string[]; // sequence of array used to stitch full route together
    attempts: number;

    // Optional
    notes?: string;
    setter?: string;

    // wall info
    type: 'Overhang' | 'Slab' | 'Vertical'
    topOut: boolean;
    angle: number; 

    // Optional
    name?: string;
}