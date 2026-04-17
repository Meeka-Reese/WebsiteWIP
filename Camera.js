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
    let RotationSpeed = gRotationSpeed * gSpeed;
    let WorldUp = [0.0, 1.0, 0.0];

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
  
    
    
   