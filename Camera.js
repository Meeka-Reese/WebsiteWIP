import { Normalize } from './Utils.js';
import { ToRadian } from './Utils.js';
let gSpeed = .1;
let gRotationSpeed = .15;
let gTotalYaw;
let gTotalPitch;
export function CameraMove(Camera, Direction, DeltaMs)
{
    //Forward = 0
    //Backwards = 1
    //Left = 2  
    //Right = 3 const Camera = makeStruct("Eye, ViewDir, UpDir");
    let CrossProduct;
    switch(Direction)
    {
        case(0):
            Camera.Eye[0] += Camera.ViewDir[0] * gSpeed * DeltaMs;
            Camera.Eye[1] += Camera.ViewDir[1] * gSpeed * DeltaMs;
            Camera.Eye[2] += Camera.ViewDir[2] * gSpeed * DeltaMs;
        break;

        case(1):
            Camera.Eye[0] -= Camera.ViewDir[0] * gSpeed * DeltaMs;
            Camera.Eye[1] -= Camera.ViewDir[1] * gSpeed * DeltaMs;
            Camera.Eye[2] -= Camera.ViewDir[2] * gSpeed * DeltaMs;
        break;

        case(2):
        CrossProduct = Normalize(math.cross(Camera.ViewDir, Camera.UpDir));
        Camera.Eye[0] -= CrossProduct[0] * gSpeed * DeltaMs;
        Camera.Eye[1] -= CrossProduct[1] * gSpeed * DeltaMs;
        Camera.Eye[2] -= CrossProduct[2] * gSpeed * DeltaMs;
        break;

        case(3):
        CrossProduct = Normalize(math.cross(Camera.ViewDir, Camera.UpDir));
        Camera.Eye[0] += CrossProduct[0] * gSpeed * DeltaMs;
        Camera.Eye[1] += CrossProduct[1] * gSpeed * DeltaMs;
        Camera.Eye[2] += CrossProduct[2] * gSpeed * DeltaMs;
        break;

        default:
            console.error("INVALID MOVE DIRECTION : " + Direction);
        break;
    }
}

export function MouseLook(Camera, DeltaMouse)
{
    let RotationSpeed = .1;
    let yaw = -DeltaMouse[0] * gRotationSpeed;
    gTotalYaw += yaw;
    let pitch = -DeltaMouse[1] * gRotationSpeed;
    gTotalPitch += pitch;
    if (gTotalPitch > 89.9|| gTotalPitch < -89.9)
    {
        pitch = 0;
    }

   // Yaw (left/right) - rotate around world up axis
    let yawRotation = mat4.create(); // Create identity matrix
    let WorldUp = [0.0,1.0,0.0];
    let radYaw = ToRadian(yaw);
    mat4.fromRotation(yawRotation, radYaw, WorldUp);

// Calculate camera's right vector
    let rightVector = Normalize(math.cross(Camera.ViewDir, Camera.UpDir));

// Pitch (up/down) - rotate around camera's right axis
    let pitchRotation = mat4.create();
    let radPitch = ToRadian(pitch);
    mat4.fromRotation(pitchRotation, radPitch, rightVector);

    //Combine Rotation
    let CombinedRotation = mat4.create();
    mat4.multiply(CombinedRotation, pitchRotation, yawRotation);
    // Apply rotations to view direction
    let viewDir4 = [Camera.ViewDir[0], Camera.ViewDir[1], Camera.ViewDir[2], 0.0];
    let newViewDir = vec4.create();
    vec4.transformMat4(newViewDir, viewDir4, CombinedRotation);

    // Update camera's view direction (normalize and convert back to vec3)
    Camera.ViewDir = Normalize([newViewDir[0], newViewDir[1], newViewDir[2]]);
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
  
    
    
   