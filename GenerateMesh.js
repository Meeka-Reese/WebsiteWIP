import { Normalize } from './Utils.js';
import { mat4 } from './Externals/esm/index.js';
import { vec3 } from './Externals/esm/index.js';
import { vec4 } from './Externals/esm/index.js';
import { LoadOBJ } from './Externals/webgl-obj-loader.js';
import { gGL } from './webgl-demo.js';
export function GenerateIco(Object, progamInfo)
{
    //Not Finished or being used, likely doing clouds with raymarching. Look to https://www.youtube.com/watch?v=4QOcCGI6xOU&t=314s
    const positionBuffer = gGL.createBuffer();
    const indiciesBuffer = gGL.createBuffer();
    const UVBuffer = gGL.createBuffer(); // Not Implemented yet
    let IcoSize = 1.0;
    let GoldenRatio = 1.61803398875;
    let w = IcoSize; 
    let l = w * GoldenRatio;
    let org = [0.0,0.0,0.0];
    let Verticies = [ //rect on x,y, then z plane
        l/2 + org[0], 0.0 + org[1], w/2 + org[2], //TopLeftX     // 0
        l/2 + org[0], 0.0, + org[1], -w/2 + org[2], // TopRightX // 1
        -l/2 + org[0], 0.0 + org[1], w/2 + org[2], //BotLeftX    // 2
        -l/2 + org[0], 0.0, + org[1], -w/2 + org[2], // BotRightX// 3

        -w/2 + org[0], l/2 + org[1], 0.0 + org[2], //TopLeftY    // 4
        w/2 + org[0], l/2 + org[1], 0.0 + org[2], //TopRightY    // 5
        -w/2 + org[0],-l/2 + org[1], 0.0 + org[2], //BotLeftY    // 6
        w/2 + org[0], -l/2 + org[1], 0.0 + org[2], //BotRightY   // 7

        0.0 + org[0], -w/2 + org[1], l/2 + org[2], //BotBackZ    // 8
        0.0 + org[0], w/2 + org[1], l/2 + org[2], //TopBackZ    // 9
        0.0 + org[0], -w/2 + org[1], -l/2 + org[2], //BotFrontZ   // 10
        0.0 + org[0], w/2 + org[1], -l/2 + org[2], //TopFrontZ   // 11
        
    ]; 
    //winding order is reverse clockwise
    let Indicies = [ //pattern diamonds around rects and then the inbetweens
    2, 3, 4, 
    2, 6, 3,
    1, 0, 5,
    1, 7, 0,

    4, 11, 5,
    4, 5, 9,
    6, 8, 7,
    6, 7, 10,

    0, 9, 2,
    2, 9, 4,
    0, 5, 9,
    9, 5, 11,
    
    8, 6, 2,
    2, 4, 8,
    8, 4, 10,
    4, 11, 10,
    
    1, 3, 7,
    1, 11, 3,
    3, 10, 7,
    10, 3, 11
    ]

}
export function GenerateWave(Object, programInfo) // Being used for wave generation
{
    
    // Create a buffer for the square's positions.
    const positionBuffer = gGL.createBuffer();
    const indicesBuffer = gGL.createBuffer();
    const UVBuffer = gGL.createBuffer();


    const RowNum = 43;
    const ColNum = 43;
    Object.RowNum = RowNum;
    Object.ColNum = ColNum;
    const Spacing = 2.5;
    // Now create an array of positions for the square.
    let positions = [];
    let indices = [];
    let UVs = [];

    let PosOffset = [-8.0,0.0,-20.0];
    
    for (let row = 0; row < RowNum; row++)
    {
        for (let col = 0; col < ColNum; col++)
        {
            let xPos = col * Spacing + PosOffset[0];
            let yPos = PosOffset[1];
            let zPos = (row * Spacing) + PosOffset[2];
            positions.push(xPos, yPos, zPos);
            let UV = [col/ColNum, row/RowNum];
            UVs.push(UV[0],UV[1]);
            if (!(col + 1 < ColNum && row + 1 < RowNum)) //Kills if point is out of range to create indices
            {
               continue; 
            }
            let i = (ColNum * row) + col;
            indices.push(i, i + 1, i + ColNum); //tri 1
            
            
            indices.push(i+1, i+1+ColNum, i+ColNum); //tri 2
            
        }
    }
    Object.PositionsArray = positions;
    Object.IndicesArray = indices;

    
    

    Object.VertexCount = indices.length;
    gGL.bindBuffer(gGL.ARRAY_BUFFER, positionBuffer); // choose pos buffer as active buffer
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(positions), gGL.STATIC_DRAW); //apply data to active buffer

    gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gGL.bufferData(gGL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gGL.STATIC_DRAW);
    
    gGL.bindBuffer(gGL.ARRAY_BUFFER, UVBuffer);
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(UVs), gGL.STATIC_DRAW);

    Object.vertexBuffer = positionBuffer;
    Object.indexBuffer = indicesBuffer;
    Object.textureBuffer = UVBuffer;
    CalculateNormals(Object, gGL);
    
    
}
export function GenerateQuad(Object, size, Origin)
{
    const positionBuffer = gGL.createBuffer();
    const indicesBuffer = gGL.createBuffer();
    const UVBuffer = gGL.createBuffer();
    let positions = [
        -size, size, 0.0, //Top Left 
        size, size, 0.0, //Top Right 
        -size, -size, 0.0, //Bot Left 
        size, -size, 0.0, //Bot Right 
    ];
    Object.PositionsArray = positions;
    let UVs = [
        0, 1, //Top Left
        1, 1, //Top Right
        0, 0, //Bot Left
        1, 0, // Bot Right
    ];
    let indices = [
        2,3, 0, //tri 1
        3,1, 0, //tri 2
    ];
    Object.IndicesArray = indices;
    Object.VertexCount = indices.length;

    gGL.bindBuffer(gGL.ARRAY_BUFFER, positionBuffer); // choose pos buffer as active buffer
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(positions), gGL.STATIC_DRAW); //apply data to active buffer

    gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gGL.bufferData(gGL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gGL.STATIC_DRAW);
    
    gGL.bindBuffer(gGL.ARRAY_BUFFER, UVBuffer);
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(UVs), gGL.STATIC_DRAW);

    Object.vertexBuffer = positionBuffer;
    Object.indexBuffer = indicesBuffer;
    Object.textureBuffer = UVBuffer;
    Object.Position = Origin;
    Object.Scale = [1.0,1.0,1.0];
    Object.Rotation = [0.0,0.0,0.0];
    CalculateNormals(Object, gGL);
    
}


export function CalculateNormals(Object)
{
    const normalsBuffer = gGL.createBuffer();
    let positions = Object.PositionsArray;
    let normals = new Array(positions.length).fill(0);
    let vertexCount = Object.VertexCount;
    let indices = Object.IndicesArray;
    for (let Face = 0; Face < indices.length; Face += 3)
    {
        let indA = indices[Face]*3;
        let indB = indices[Face + 1]*3;
        let indC = indices[Face + 2]*3;
        let A = [positions[indA], positions[indA+1], positions[indA+2]];
        let B = [positions[indB], positions[indB+1], positions[indB+2]];
        let C = [positions[indC], positions[indC+1], positions[indC+2]];

        let ABLine = [B[0]-A[0],B[1]-A[1],B[2]-A[2]];
        let ACLine = [C[0]-A[0],C[1]-A[1],C[2]-A[2]];

        let faceNormal = [
            ABLine[1]*ACLine[2] - ABLine[2]*ACLine[1],
            ABLine[2]*ACLine[0] - ABLine[0]*ACLine[2],
            ABLine[0]*ACLine[1] - ABLine[1]*ACLine[0],
        ];

       
        normals[indA]   += faceNormal[0];
        normals[indA+1] += faceNormal[1];
        normals[indA+2] += faceNormal[2];
        
        normals[indB]   += faceNormal[0];
        normals[indB+1] += faceNormal[1];
        normals[indB+2] += faceNormal[2];
        
        normals[indC]   += faceNormal[0];
        normals[indC+1] += faceNormal[1];
        normals[indC+2] += faceNormal[2];
    }
    for (let i = 0; i < vertexCount; i++)
    {
        let normal = [normals[i*3] * 1.0, normals[i*3+1] * 1.0, normals[i*3+2]*1.0];
        normal = Normalize(normal);
        normals[i*3]   = normal[0];
        normals[i*3+1] = normal[1];
        normals[i*3+2] = normal[2];
    }

    gGL.bindBuffer(gGL.ARRAY_BUFFER, normalsBuffer);
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(normals),gGL.STATIC_DRAW);
    Object.normalBuffer = normalsBuffer;
}
export function SphereOfQuad(Origin, Radius,StarSize, Mesh, NumberofMesh, SinPreComp, CosPreComp,ArcSinPreComp,ArcCosPreComp,WaveTableSize,
    isHemi, RandomAm, Camera)
{
    const positionBuffer = gGL.createBuffer();
    const indicesBuffer = gGL.createBuffer();
    const UVBuffer = gGL.createBuffer();
    const QuadPosBuffer = gGL.createBuffer();
    let positions = [];
    let indices = [];
    let UVs = [];
    let QuadPos = [];
    let size = StarSize;
    let TableResize = WaveTableSize/(Math.PI * 2.0);
    let a = 4.0 * Math.PI/ NumberofMesh;
    let d = Math.sqrt(a);
    let num_phi = Math.round(Math.PI / d);
    let Iterations = 0;
    let d_phi = Math.PI / num_phi;
    let d_theta = a / d_phi;
    let HeightCut = isHemi ? 2.0 : 1.0; //For half sphere
    for (let m = 0; m < num_phi; ++m) { //Width
        let phi = Math.PI * (m + 0.5) / num_phi;
        let num_theta = Math.round(2 * Math.PI * SinPreComp[Math.floor(phi*TableResize)] / d_theta);
        for (let n = 0; n < num_theta/HeightCut; ++n) { //Height
            let RandVec = vec3.fromValues(
                ((Math.random() * 2.0) - 1.0) * RandomAm,
                ((Math.random() * 2.0) - 1.0) * RandomAm,
                ((Math.random() * 2.0) - 1.0) * RandomAm);
            RandVec[1] = isHemi ? 1.0 : RandVec[1]; //Turn off y rand transform if hemi
            let theta = 2 * Math.PI * n / num_theta;
            let i1 = Math.floor(phi*TableResize);
            let i2 = Math.floor(theta*TableResize);
            let p = vec3.fromValues((Radius * RandVec[0]) * SinPreComp[i1] * CosPreComp[i2],
                                    (Radius * RandVec[1]) * SinPreComp[i1] * SinPreComp[i2],
                                    (Radius * RandVec[2]) * CosPreComp[i1]);
            let Transform = vec3.create();
            vec3.add(Transform, p, Origin);

            QuadPos.push(Transform[0],Transform[1],Transform[2]);//by 4 for attribute so each vert has quad pos
            QuadPos.push(Transform[0],Transform[1],Transform[2]);
            QuadPos.push(Transform[0],Transform[1],Transform[2]);
            QuadPos.push(Transform[0],Transform[1],Transform[2]);
            //Create Quad Verts
            let halfSize = size * 0.5;
            let localQuad = [
                -halfSize, -halfSize, 0,  // Bottom left
                 halfSize, -halfSize, 0,  // Bottom right
                -halfSize,  halfSize, 0,  // Top left
                 halfSize,  halfSize, 0   // Top right
            ];
            //Rotation for lookat Origin
            let UpVector = vec3.fromValues(0.0,1.0,0.0);
            let rotationMatrix = mat4.create();
            mat4.targetTo(rotationMatrix, Transform, Camera.Eye, vec3.fromValues(0, 1, 0));
            for (let Vertex = 0; Vertex < localQuad.length; Vertex+=3)
            {
                let x = localQuad[Vertex];
                let y = localQuad[Vertex + 1];
                let z = localQuad[Vertex + 2];
                let localVertex = vec3.fromValues(x,y,z);
                Mesh.LocalPosArray.push(x,y,z);
                let worldPos = vec3.create();
                vec3.transformMat4(worldPos, localVertex, rotationMatrix);
                positions.push(worldPos[0],worldPos[1],worldPos[2]);
            }
            
            //Create Quad Indicies
            let baseIdx = Iterations * 4;
            indices.push(
                baseIdx, baseIdx+1, baseIdx+2,     // Triangle 1: 
                baseIdx+1, baseIdx, baseIdx+3      // Triangle 2: 
            );
            //Create Quad UV
            //let randUVSwitch = Math.random();
            let randUVSwitch = 0.0; // Set rn just to make easier for shader. Change later
            if (randUVSwitch < .5)
            {
                UVs.push( 
                    0, .5, //Top Left
                    .5, 0, //Top Right
                    0, 0, //Bot Left
                    .5, .5, // Bot Right
                );
            }
            else
            {
                UVs.push(
                    .5, 1.0, //Top Left
                    1.0, 1.0, //Top Right
                    .5, .5, //Bot Left
                    1.0, .5, // Bot Right
                );
            }
            Iterations++;
            
        }
    }
    Mesh.VertexCount = indices.length;
    Mesh.PositionsArray = positions;
    Mesh.QuadPosArray = QuadPos;

    gGL.bindBuffer(gGL.ARRAY_BUFFER, positionBuffer); // choose pos buffer as active buffer
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(positions), gGL.STATIC_DRAW); //apply data to active buffer

    gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gGL.bufferData(gGL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gGL.STATIC_DRAW);
    
    gGL.bindBuffer(gGL.ARRAY_BUFFER, UVBuffer);
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(UVs), gGL.STATIC_DRAW);

    gGL.bindBuffer(gGL.ARRAY_BUFFER, QuadPosBuffer);
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(QuadPos), gGL.STATIC_DRAW);

    Mesh.vertexBuffer = positionBuffer;
    Mesh.indexBuffer = indicesBuffer;
    Mesh.textureBuffer = UVBuffer;
    Mesh.QuadPosBuffer = QuadPosBuffer;
    Mesh.Position = Origin;
    Mesh.Scale = [1.0,1.0,1.0];
    Mesh.Rotation = [0.0,0.0,0.0];

}
export function StarLookAt(Object, Camera)
{
    const positionBuffer = gGL.createBuffer();
    let LocVert = Object.LocalPosArray;
    let positions = [];
    let UpVector = vec3.fromValues(0.0,1.0,0.0);
    let rotationMatrix = mat4.create();
    let Transform = vec3.create();
    
    for (let pos = 0; pos < LocVert.length; pos+=3)  
    {
        let VertInd = pos / 3;
        if ((VertInd % 4) == 0)
        {
            let quadIndex = Math.floor(VertInd) * 3;
            Transform = vec3.fromValues(
                Object.QuadPosArray[quadIndex],
                Object.QuadPosArray[quadIndex + 1],
                Object.QuadPosArray[quadIndex + 2]
            );
            mat4.targetTo(rotationMatrix, Transform, Camera.Eye, UpVector);
        }
        
        let Localx = LocVert[pos];
        let Localy = LocVert[pos + 1];
        let Localz = LocVert[pos + 2];
        let localVertex = vec3.fromValues(Localx, Localy, Localz);

        let worldPos = vec3.create();
        vec3.transformMat4(worldPos, localVertex, rotationMatrix);
        positions.push(worldPos[0], worldPos[1], worldPos[2]);
    }
    
    Object.PositionsArray = positions;
    gGL.bindBuffer(gGL.ARRAY_BUFFER, positionBuffer);
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(positions), gGL.STATIC_DRAW);
    Object.vertexBuffer = positionBuffer;
}

export async function PlaceColecOnSurf(TargetVertColec, TargetNormalsColec, TargetModelMat, ObjDir, MinDist, NumObj, ObjColec, VertIndColec)
{

    let TargetSize = TargetVertColec.length / 3.0;
    let PrevObjPos = vec4.fromValues(0.0,0.0,0.0,0.0);
    let ObjPos = vec4.create();
    let ObjNormals = [];
    let Distance;
    let DistanceFromPrev;
    let ObjectScale = 1.0;
    for (let i = 0; i < NumObj; i++)
    {
        let VertIndex = Math.floor((Math.random() * TargetSize)) - 4; 
        if (TargetVertColec.length - 1 < ((VertIndex * 3) + 2) || ((VertIndex * 3) + 2) < 0)
        {
            console.log("Invalid Index for index value " + ((VertIndex * 3) + 2) + "Colec length is " + TargetVertColec.length);
            continue;
        }
        ObjPos = [TargetVertColec[VertIndex * 3], TargetVertColec[(VertIndex * 3) + 1], TargetVertColec[(VertIndex * 3) + 2], 1];
        ObjPos = vec4.transformMat4(ObjPos, ObjPos, TargetModelMat);
        DistanceFromPrev = Math.abs((ObjPos[0] - PrevObjPos[0]) + (ObjPos[1] - PrevObjPos[1]) + (ObjPos[2] - PrevObjPos[2])) / 3.0;
        
        //Min distance not implemeneted

        VertIndColec.push(VertIndex);
        ObjNormals = [TargetNormalsColec[VertIndex * 3.0], TargetNormalsColec[(VertIndex * 3.0) + 1.0], TargetNormalsColec[(VertIndex * 3.0) + 2]];
        if (TargetNormalsColec.length - 1 < ((VertIndex * 3) + 2) || ((VertIndex * 3) + 2) < 0)
        {
            console.log("Invalid Index for index value " + ((VertIndex * 3) + 2) + "Colec length is " + TargetNormalsColec.length);
            continue;
        }
        let instance = await LoadOBJ(gGL, ObjDir);
        if (instance == null) {console.log("Could not load Instance");}
        instance.Position = [ObjPos[0], ObjPos[1],ObjPos[2]];
        instance.Scale = [ObjectScale,ObjectScale,ObjectScale]; //Stand in
        instance.Rotation = ObjNormals; // retreive normals to allign
        instance.Color = [1.0,1.0,1.0,1.0];
        ObjColec.push(instance);
        PrevObjPos = ObjPos;
    }

}




