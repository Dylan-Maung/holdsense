export interface Wall {
    // Required
    id: string;
    imageUri: string;
    type: 'Overhang' | 'Slab' | 'Vertical';
    topOut: boolean;
    angle: number;

    // Optional
    name?: string;
}