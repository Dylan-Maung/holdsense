export interface Hold {
    // Required
    id: string;
    type: 'Hand' | 'Foot' | 'Dual';
    usage: 'Start' | 'Finish' | 'Middle';
    holdType: 'Jug' | 'Crimp' | 'Sloper' | 'Pinch' | 'Volume' | 'Pocket';
    dualTexture: boolean;
    orientation: number;
    position: { x: number, y: number, z: number}

    // Optional
    color?: string;
}