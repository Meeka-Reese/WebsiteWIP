import { Normalize } from './Utils.js';
import { ToRadian } from './Utils.js';
import { mat4 } from './Externals/esm/index.js';
import { vec3 } from './Externals/esm/index.js';
import { vec4 } from './Externals/esm/index.js';
import { quat } from './Externals/esm/index.js';
let gSpeed = .11;
let gRotationSpeed = .7;
let gTotalYaw;
let gTotalPitch = 0.0;
let gOrbitalRotSpeed = .1;

export class Camera
{
    
    constructor(Eye, ViewDir, UpDir, Width, Height, ObjectIndex, Mode, OrbitalOrg)
    {
        this.Eye = Eye;
        this.ViewDir = ViewDir;
        this.UpDir = UpDir;
        this.Width = Width;
        this.Height = Height;
        this.ObjectIndex = ObjectIndex;

        this.OutlineCol = [0.0, 0.0, 0.0];
        this.OutlineCutoff = 0.0;
        this.BlurAmount = 0.0;
        this.BGCol = [0.0, 0.0, 0.0];
        this.Mode = Mode; //default 0, 0 is free roaming, 1 is orbital
        this.OrbitalOrg = OrbitalOrg; //just for orbital
    }

    setPostProcessing(outCol, outCut, blurAmount, bgCol)
    {
        this.OutlineCol = outCol;
        this.OutlineCutoff = outCut;
        this.BlurAmount = blurAmount;
        this.BGCol = bgCol;
    }

}
export function CameraMove(Camera, Direction, DeltaMs)
{
    let WorldUp = [0.0, 1.0, 0.0];
    //Forward = 0
    //Backwards = 1
    //Left = 2  
    //Right = 3 const Camera = makeStruct("Eye, ViewDir, UpDir");
    switch (Camera.Mode)
    {
        case(0): //free roam
        let CrossProduct;
        switch(Direction)
        {
            case(0): //Forward
                Camera.Eye[0] += Camera.ViewDir[0] * gSpeed * DeltaMs;
                Camera.Eye[1] += Camera.ViewDir[1] * gSpeed * DeltaMs;
                Camera.Eye[2] += Camera.ViewDir[2] * gSpeed * DeltaMs;
            break;

            case(1): //Backward
                Camera.Eye[0] -= Camera.ViewDir[0] * gSpeed * DeltaMs;
                Camera.Eye[1] -= Camera.ViewDir[1] * gSpeed * DeltaMs;
                Camera.Eye[2] -= Camera.ViewDir[2] * gSpeed * DeltaMs;
            break;

            case(2)://Left
            CrossProduct = Normalize(math.cross(Camera.ViewDir, Camera.UpDir));
            Camera.Eye[0] -= CrossProduct[0] * gSpeed * DeltaMs;
            Camera.Eye[1] -= CrossProduct[1] * gSpeed * DeltaMs;
            Camera.Eye[2] -= CrossProduct[2] * gSpeed * DeltaMs;
            break;

            case(3)://Right
            CrossProduct = Normalize(math.cross(Camera.ViewDir, Camera.UpDir));
            Camera.Eye[0] += CrossProduct[0] * gSpeed * DeltaMs;
            Camera.Eye[1] += CrossProduct[1] * gSpeed * DeltaMs;
            Camera.Eye[2] += CrossProduct[2] * gSpeed * DeltaMs;
            break;

            default:
                console.error("INVALID MOVE DIRECTION : " + Direction);
            break;
        }
        break;

        case(1): //rotary
        console.log("runCamMove");
            if (Direction == 0 || Direction == 1) {break;} //only accept left or right
            let RotMat = mat4.create();
            let yAxis = vec3.fromValues(0.0,1.0,0.0);
            let Dir = Direction == 2 ? 1.0 : -1.0;
            let Radian = gOrbitalRotSpeed * DeltaMs * .05* Dir;
            mat4.fromRotation(RotMat, Radian, yAxis);
            let CameraEye = vec4.fromValues(Camera.Eye[0], Camera.Eye[1], Camera.Eye[2], 1.0);
            vec4.transformMat4(CameraEye, CameraEye, RotMat);
            Camera.Eye = [CameraEye[0], CameraEye[1], CameraEye[2]];
            Camera.ViewDir = [Camera.OrbitalOrg[0]-Camera.Eye[0],Camera.OrbitalOrg[1]-Camera.Eye[1],Camera.OrbitalOrg[2]-Camera.Eye[2]];
        break;
    }
}

export function MouseLook(Camera, DeltaMouse)
{
    let RotationSpeed = gRotationSpeed * gSpeed;
    let WorldUp = [0.0, 1.0, 0.0];
    switch(Camera.Mode)
    {
        case(0): //free roam

            // === YAW ===
            let yaw = -DeltaMouse[0] * RotationSpeed;
            gTotalYaw += yaw;

            let yawRotation = mat4.create();
            mat4.fromRotation(yawRotation, ToRadian(yaw), WorldUp);

            let viewDir4 = [Camera.ViewDir[0], Camera.ViewDir[1], Camera.ViewDir[2], 0.0];
            let afterYaw = vec4.create();
            vec4.transformMat4(afterYaw, viewDir4, yawRotation);
            Camera.ViewDir = Normalize([afterYaw[0], afterYaw[1], afterYaw[2]]);

            let rightVector = Normalize(math.cross(Camera.ViewDir, WorldUp));
            Camera.UpDir = Normalize(math.cross(rightVector, Camera.ViewDir));

            // === PITCH ===
            let pitch = -DeltaMouse[1] * RotationSpeed;
            gTotalPitch += pitch;

            // Clamp before applying
            if (gTotalPitch > 89.0)
            {
                pitch -= (gTotalPitch - 89.0);
                gTotalPitch = 89.0;
            }
            else if (gTotalPitch < -89.0)
            {
                pitch -= (gTotalPitch + 89.0);
                gTotalPitch = -89.0;
            }

            let pitchRotation = mat4.create();
            mat4.fromRotation(pitchRotation, ToRadian(pitch), rightVector);

            let afterPitch = vec4.create();
            let viewDir4b = [Camera.ViewDir[0], Camera.ViewDir[1], Camera.ViewDir[2], 0.0];
            vec4.transformMat4(afterPitch, viewDir4b, pitchRotation);
            Camera.ViewDir = Normalize([afterPitch[0], afterPitch[1], afterPitch[2]]);

            rightVector = Normalize(math.cross(Camera.ViewDir, WorldUp));
            Camera.UpDir = Normalize(math.cross(rightVector, Camera.ViewDir));
        break;
        
    }
}
export function GetViewMatrix(Camera)
{

    let Model = mat4.create();
    let eyeV3 = vec3.fromValues(Camera.Eye[0],Camera.Eye[1],Camera.Eye[2]);
    let viewDirV3 = vec3.fromValues(Camera.ViewDir[0],Camera.ViewDir[1],Camera.ViewDir[2]);
    let center = vec3.create();
    vec3.add(center, eyeV3, viewDirV3);
    
    mat4.lookAt(Model, Camera.Eye, center, Camera.UpDir);
    return Model;
}
  
    
    
   