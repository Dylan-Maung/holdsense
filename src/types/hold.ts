export interface Hold {
    // Required
    id: string;
    imageUri: string;
    usedBy: 'Hand' | 'Foot' | 'Dual';
    tag: 'Start' | 'Finish' | 'Middle';
    holdType: 'Jug' | 'Crimp' | 'Sloper' | 'Pinch' | 'Volume' | 'Pocket' | 'Edge' | 'Smear';
    dualTexture: boolean;
    orientation: number;
    position: { x: number, y: number, z: number, height: number, width: number}

    // Optional
    color?: string;
}