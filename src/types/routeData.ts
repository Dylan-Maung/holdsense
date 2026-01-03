import { Hold } from './hold';
import { Wall } from './wall';

export interface RouteData {
    // Required
    id: string;
    userId: string;
    grade: string;
    gym: string;
    date: string;
    status: 'Flash' | 'Onsight' | 'Project' | 'Redpoint';
    attempts: number;
    color: string;
    holds: Hold[];
    fullRouteImages: Wall[]; // sequence of array used to stitch full route together

    // Optional
    notes?: string;
    setter?: string;
    quality?: number;
}

// Use for Incremental Form Completion
export type RouteDataForm = Partial<RouteData>;