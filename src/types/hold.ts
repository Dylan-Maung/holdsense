export interface Hold {
    // Required
    id: string;
    imageUri: string;
    usedBy: 'Hand' | 'Foot' | 'Dual';
    tag: 'Start' | 'Finish' | 'Middle';
    holdType: 'Jug' | 'Crimp' | 'Sloper' | 'Pinch' | 'Volume' | 'Pocket';
    dualTexture: boolean;
    orientation: number;
    position: { x: number, y: number, z: number}

    // Optional
    color?: string;
}