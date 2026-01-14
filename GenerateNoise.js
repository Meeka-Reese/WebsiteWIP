import { vec2 } from './Externals/esm/index.js';
import { vec3 } from './Externals/esm/index.js';

export function CreateWorley3D(NumCellPreAxis, PixelsNum)
{ 
    const directions = [
        [-1, -1, 0], [0, -1,0], [1, -1,0],  
        [-1,  0,0],          [1,  0,0],  
        [-1,  1,0], [0,  1,0], [1,  1,0],
        [-1, -1, -1], [0, -1,-1], [1, -1,-1],  
        [-1,  0,-1],  [0,0,-1]        [1, 0,-1],  
        [-1,  1,-1], [0,  1,-1], [1,  1,-1],      
        [-1, -1, 1], [0, -1,1], [1, -1,1],  
        [-1,  0,1],  [0,0,1]        [1,  0,1],  
        [-1,  1,1], [0,  1,1], [1,  1,1],     
    ];
    let Points = [];
    let CellSize = vec3.fromValues(1.0/NumCellPreAxis, 1.0/NumCellPreAxis, 1.0/NumCellPreAxis);
    let RandOffset = vec3.create();
    let InitPos = vec3.create();
    let Position = vec3.create();
    let maxDist = Math.sqrt(3)/NumCellPreAxis;
    for (let z = 0; z < NumCellPreAxis; z++)
    {
        for (let y = 0; y < NumCellPreAxis; y++) //Taking more so It's tileabled and seemless
        {
            for (let x = 0; x < NumCellPreAxis; x++) 
            {
                    vec3.set(RandOffset,Math.random(), Math.random(), Math.random());
                    vec3.set(InitPos, x,y,z);
                    let Position = vec3.create();
                    vec3.add(Position, InitPos, RandOffset);
                    vec3.multiply(Position, Position, CellSize);
                    Points.push(Position);
            }
        }
    }
    //Calc pixels
    let NumCells = Points.length;
    let PixelPerCell = PixelsNum/NumCellPreAxis;
    let Imgbuffer = new Uint8ClampedArray(PixelsNum * PixelsNum * PixelsNum* 4);
    let Distances = [];
    let ind = 0;
    let MinDist = Infinity;
    for (let z = 0; z < PixelsNum; z++)
    {
        for (let y = 0; y < PixelsNum; y++)
        {
            for (let x = 0; x < PixelsNum; x++)
            {
                let CellCord = [Math.floor((x)/PixelPerCell), Math.floor((y)/PixelPerCell), Math.floor(z/PixelPerCell)];
                let CellIndM = CellCord[0] + (CellCord[1] * (NumCellPreAxis) + (CellCord[2] * NumCellPreAxis * NumCellPreAxis));
                let PixelPos = vec3.fromValues(x/PixelsNum, y/PixelsNum, z/PixelsNum);
                let cellX = CellCord[0];
                let cellY = CellCord[1];
                let cellZ = CellCord[2];
                MinDist = Infinity;
                //center square
                let difx = PixelPos[0] - Points[CellIndM][0];
                let dify = PixelPos[1] - Points[CellIndM][1];
                let difz = PixelPos[2] - Points[CellIndM][2];
                let dist = (difx * difx) + (dify * dify) + (difz * difz);
                MinDist = Math.min(MinDist, dist);
                //Adjacent
                for (let dz = -1; dz <= 1; dz++)
                {
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            let nx = (CellCord[0] + dx + NumCellPreAxis) % NumCellPreAxis;
                            let ny = (CellCord[1] + dy + NumCellPreAxis) % NumCellPreAxis;
                            let nz = (CellCord[2] + dz + NumCellPreAxis) % NumCellPreAxis;
                            let CellInd = nx + (ny * NumCellPreAxis) + (nz * NumCellPreAxis * NumCellPreAxis);
                        
                            let point = vec3.clone(Points[CellInd]);
                            
                            if (CellCord[0] + dx < 0) point[0] -= 1.0; // Wrapped left
                            if (CellCord[0] + dx >= NumCellPreAxis) point[0] += 1.0; // Wrapped right
                            if (CellCord[1] + dy < 0) point[1] -= 1.0; // Wrapped top
                            if (CellCord[1] + dy >= NumCellPreAxis) point[1] += 1.0; // Wrapped bottom
                            if (CellCord[2] + dz < 0) point[2] -= 1.0; // Warpped Front
                            if (CellCord[2] + dz >= NumCellPreAxis) point[2] += 1.0; // Wrapped Back
                        
                            let difx = PixelPos[0] - point[0];
                            let dify = PixelPos[1] - point[1];
                            let difz = PixelPos[2] - point[2];
                            let dist = (difx * difx) + (dify * dify) + (difz * difz);
                            MinDist = Math.min(MinDist, dist);

                            
                        }
                    }
                }
                //maxDist = Math.max(maxDist, MinDist);
                Distances.push(MinDist);

                let distMin = Math.sqrt(MinDist);
                let Normalized = distMin / maxDist;
                let color = (1.0 - Normalized) * 255 | 0; 
                let i4 = ind << 2; 
                Imgbuffer[i4] = color;     // R
                Imgbuffer[i4+ 1] = color; // G
                Imgbuffer[i4 + 2] = color; // B
                Imgbuffer[i4 + 3] = 255;   // A
                ind++;

            }
        }
    }
    
    return Imgbuffer;
}

