import { Normalize, ToRadian, Vec3ArrLerp } from './Utils.js';
import { mat4, vec3, vec4, quat } from './Externals/esm/index.js';
let gSpeed = .11;
let gRotationSpeed = .7;
let gTotalYaw;
let gTotalPitch = 0.0;
let gOrbitalRotSpeed = .1;

export class Camera
{
    
    constructor(Eye, ViewDir, UpDir, Width, Height, ObjectIndex, Mode, OrbitalOrg)
    {
        this.Eye = Eye; //size 3 arr
        this.ViewDir = ViewDir; // size 3 arr
        this.UpDir = UpDir; // size 3 arr
        this.Width = Width;
        this.Height = Height;
        this.ObjectIndex = ObjectIndex;

        this.OutlineCol = [0.0, 0.0, 0.0];
        this.OutlineCutoff = 0.0;
        this.BlurAmount = 0.0;
        this.BGCol = [0.0, 0.0, 0.0];
        this.Mode = Mode; //default 0, 0 is free roaming, 1 is orbital
        this.OrbitalOrg = OrbitalOrg; //just for orbital
        this.Auto = false;
        this.ActiveAniClip = null;
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
    if (Camera.ActiveAniClip != null){return;}
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
            let FBSpeed = 4.0;
            switch(Direction)
            {
                    case(0): //Forward
                    console.log(DeltaMs);
                    Camera.Eye[0] += Camera.ViewDir[0] * gSpeed * DeltaMs * FBSpeed;
                    Camera.Eye[1] += Camera.ViewDir[1] * gSpeed * DeltaMs * FBSpeed;
                    Camera.Eye[2] += Camera.ViewDir[2] * gSpeed * DeltaMs * FBSpeed;
                break;

                case(1): //Backward
                    Camera.Eye[0] -= Camera.ViewDir[0] * gSpeed * DeltaMs * FBSpeed;
                    Camera.Eye[1] -= Camera.ViewDir[1] * gSpeed * DeltaMs * FBSpeed;
                    Camera.Eye[2] -= Camera.ViewDir[2] * gSpeed * DeltaMs * FBSpeed;
                break;
                case(2):
                case(3):
                let RotMat = mat4.create();
                let yAxis = vec3.fromValues(0.0,1.0,0.0);
                let Dir = Direction == 2 ? 1.0 : -1.0;
                let Radian = gOrbitalRotSpeed * DeltaMs * .05* Dir;
                mat4.fromRotation(RotMat, Radian, yAxis);
                let CameraEye = vec4.fromValues(Camera.Eye[0], Camera.Eye[1], Camera.Eye[2], 1.0);
                vec4.transformMat4(CameraEye, CameraEye, RotMat);
                Camera.Eye = [CameraEye[0], CameraEye[1], CameraEye[2]];
                Camera.ViewDir = Normalize([Camera.OrbitalOrg[0]-Camera.Eye[0],Camera.OrbitalOrg[1]-Camera.Eye[1],Camera.OrbitalOrg[2]-Camera.Eye[2]]);
                break;
            }

        break;
    }
}

export function MouseLook(Camera, DeltaMouse)
{
    if (Camera.ActiveAniClip != null){return;}
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
export class CameraAniClip
{
    constructor(Speed, Keyframes, ConnectedCamera = null)
    {
        this.Speed = Speed; //not implemented currently
        this.Keyframes = Keyframes;
        this.ConnectedCamera = ConnectedCamera;
        this.Running = false;
        this.LastTime = 0.0;
        this.RunTime = 0.0;
        this.PrevKey;
        this.HeldKey;
        this.StartTime = 0.0;
    }
    Run(CurrentTime) //Trigger Run at Start of Debug. First Cycle of Update Cam Will run
    //After that trogger updatecam through the animationloop. 
    {
        if (this.ConnectedCamera == null) {console.error("NO CAMERA CONNECTED TO ANIMATION CLIP"); return;}
        this.ConnectedCamera.Auto = true;
        this.Running = true;
        this.PrevKey = new CameraAniKey(0.0, this.ConnectedCamera.ViewDir, this.ConnectedCamera.Eye);
        this.HeldKey = new CameraAniKey(0.0, this.ConnectedCamera.ViewDir, this.ConnectedCamera.Eye);
        this.StartTime = CurrentTime;
        this.UpdateCam(CurrentTime);
        this.ConnectedCamera.UpDir = [0.0, 1.0, 0.0];
    }
    UpdateCam(CurrentTime)
    {
        let ClosestKey;
        let Time = (CurrentTime - this.StartTime);
        //console.log(this.Keyframes);
        //console.log("Time " + Time + " Current Time " + CurrentTime + " Start Time " + this.StartTime);
        let ClosestDelta = 9999999.9;
        let CurrentDelta;
        for(let i = 0; i < this.Keyframes.length; i++)
        {
            CurrentDelta = this.Keyframes[i].TimeCode - Time;
            if (this.Keyframes[i].TimeCode > Time && CurrentDelta < ClosestDelta)
            {
                ClosestDelta = CurrentDelta;
                ClosestKey = this.Keyframes[i];
            }
        }
        if (ClosestKey != this.PrevKey) {this.HeldKey = this.PrevKey; 
            if (!this.HeldKey.SmoothTrans)
            {
                let FocusPoint = this.HeldKey.FocusPoint;
                let EyePos = this.HeldKey.Eye;
                this.ConnectedCamera.ViewDir = this.HeldKey.Eye; 
                this.ConnectedCamera.ViewDir = Normalize([FocusPoint[0] - EyePos[0], FocusPoint[1] - EyePos[1], FocusPoint[2] - EyePos[2]]); 
                console.log("JumpCut");
                //Set pos if non smooth transition
            }} //Swap when closest keyframe changes
        if (ClosestKey == undefined)
        {
            console.log("CAMERA ANI DONE AND STOPPED");
            this.Stop();
            return;
        }
        
        let Alpha = (Time - this.HeldKey.TimeCode) / (ClosestKey.TimeCode - this.HeldKey.TimeCode);
        if (!ClosestKey.SmoothTrans) {Alpha = 0.0;} 
        // console.log("Alpha is " + Alpha + " And Time is " + Time);
        // console.log(ClosestKey);
        let FocusPoint = Vec3ArrLerp(this.HeldKey.FocusPoint, ClosestKey.FocusPoint, Alpha);
        let EyePos = Vec3ArrLerp(this.HeldKey.Eye, ClosestKey.Eye, Alpha);
        this.ConnectedCamera.ViewDir = Normalize([FocusPoint[0] - EyePos[0], FocusPoint[1] - EyePos[1], FocusPoint[2] - EyePos[2]]);
        this.ConnectedCamera.Eye = EyePos;
        this.PrevKey = ClosestKey; 
    }
    Pause()
    {
        this.ConnectedCamera.Auto = false;
        this.Running = false;
    }
    Stop()
    {
        this.ConnectedCamera.Auto = false;
        this.Running = false;
        this.ConnectedCamera.ActiveAniClip = null; //remove active ani clip from queue when done
    }
}
export class CameraAniKey
{
    constructor(TimeCode, Eye, FocusPoint, SmoothTrans)
    {
        this.TimeCode = TimeCode; //in relation to 0 being start of movement
        this.FocusPoint = FocusPoint;
        this.Eye = Eye;
        this.SmoothTrans = SmoothTrans;
    }
}




//==========================CAMERA ANIMATION CLIPS=======================================
//the connected camera is set as null by init but should be set to camera whenever it is connected
export let CamAniClips = [];
let KeyframeColec = [];
let TCPose = {
    FrontFar: {Eye: [49.0,219.0,-669.0], FocusPoint: [0.0,5.0,0.0]},
    Front: {Eye: [-50.96, 67.3, -80.2], FocusPoint: [0.0,25.0,0.0]},
    Back: {Eye: [-119.96, 67.3, 350.2], FocusPoint: [0.0,20.0,0.0]},
    BackRight: {Eye: [200.96, 67.3, 300.2], FocusPoint: [0.0,10.0,0.0]},
    BackLeft: {Eye: [-220.96, 67.3, 300.2], FocusPoint: [0.0,10.0,0.0]},
    FrontMid: {Eye: [-119.96, 67.3, -340.2], FocusPoint: [0.0,20.0,0.0]},
    Close: {Eye: [118.0, 40.0, -105.0], FocusPoint: [0.0,20.0,0.0]},
    Close2: {Eye: [118.0, 40.0, -150.0], FocusPoint: [0.0,20.0,0.0]},
    BackClose: {Eye: [118.0, 40.0, 60.0], FocusPoint: [0.0,20.0,0.0]},
    TopRightFar: {Eye: [-223, 86.5, -599], FocusPoint: [0.0,5.0,0.0]},
    Bottom: {Eye: [56, 3.6, -133], FocusPoint: [0.0,-10.0,0.0]},
    SideRight: {Eye: [-161.6, 44.6, -11.3], FocusPoint: [0.0,5.0,0.0]},
    SideRight2: {Eye: [0.6, 70.6, -60.3], FocusPoint: [0.0,5.0,0.0]},
    BottomLeft: {Eye: [75.9, -64.5, -48.7], FocusPoint: [0.0,5.0,0.0]},
    FrontClose: {Eye: [0.0, 50.0, -78.0], FocusPoint: [0.0,5.0,0.0]},
    Veins: {Eye: [-306, 12, 65], FocusPoint: [0.0,5.0,0.0]},
    Veins2: {Eye: [-250, 40, 140], FocusPoint: [0.0,5.0,0.0]},
};

KeyframeColec.push(new CameraAniKey(0.01, TCPose.Veins2.Eye, TCPose.Veins2.FocusPoint, false)); //Start
KeyframeColec.push(new CameraAniKey(21.0, TCPose.Front.Eye, TCPose.Front.FocusPoint, true)); //Kick and drums
KeyframeColec.push(new CameraAniKey(63.0, TCPose.FrontMid.Eye, TCPose.FrontMid.FocusPoint, true)); //Little movement
KeyframeColec.push(new CameraAniKey(82.8, TCPose.TopRightFar.Eye, TCPose.TopRightFar.FocusPoint, true)); //Crop
KeyframeColec.push(new CameraAniKey(93.35, TCPose.Front.Eye, TCPose.Front.FocusPoint, true)); //Crop
KeyframeColec.push(new CameraAniKey(124.6, TCPose.BackClose.Eye, TCPose.BackClose.FocusPoint, true)); //Crop
KeyframeColec.push(new CameraAniKey(124.7, TCPose.TopRightFar.Eye, TCPose.TopRightFar.FocusPoint, false)); //impacts
KeyframeColec.push(new CameraAniKey(124.8, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //impacts //little off
KeyframeColec.push(new CameraAniKey(126.5, TCPose.TopRightFar.Eye, TCPose.TopRightFar.FocusPoint, true)); //impacts
KeyframeColec.push(new CameraAniKey(127.5, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //impacts
KeyframeColec.push(new CameraAniKey(128.8, TCPose.TopRightFar.Eye, TCPose.TopRightFar.FocusPoint, true)); //impacts
KeyframeColec.push(new CameraAniKey(130.0, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //impacts
KeyframeColec.push(new CameraAniKey(131.4, TCPose.TopRightFar.Eye, TCPose.TopRightFar.FocusPoint, true)); //impacts
KeyframeColec.push(new CameraAniKey(132.7, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //impacts //also little off
KeyframeColec.push(new CameraAniKey(134.0, TCPose.TopRightFar.Eye, TCPose.TopRightFar.FocusPoint, true)); //impacts
KeyframeColec.push(new CameraAniKey(135.3, TCPose.Bottom.Eye, TCPose.Bottom.FocusPoint, false)); //Bells flower pose time offset just for fluid motion
KeyframeColec.push(new CameraAniKey(145.0, TCPose.FrontMid.Eye, TCPose.FrontMid.FocusPoint, true));
KeyframeColec.push(new CameraAniKey(156.0, TCPose.Veins2.Eye, TCPose.Veins2.FocusPoint, true));
KeyframeColec.push(new CameraAniKey(167.0, TCPose.Back.Eye, TCPose.Back.FocusPoint, true)); // need further back option instead
KeyframeColec.push(new CameraAniKey(179.9, TCPose.BackLeft.Eye, TCPose.BackLeft.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(180.0, TCPose.Back.Eye, TCPose.Back.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(180.3, TCPose.Veins2.Eye, TCPose.Veins2.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(180.5, TCPose.SideRight.Eye, TCPose.SideRight.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(180.75, TCPose.FrontMid.Eye, TCPose.FrontMid.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(182.6, TCPose.Close.Eye, TCPose.Close.FocusPoint, true)); 

KeyframeColec.push(new CameraAniKey(182.7, TCPose.Bottom.Eye, TCPose.Bottom.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(182.9, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(183.2, TCPose.Back.Eye, TCPose.Back.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(183.75, TCPose.SideRight.Eye, TCPose.SideRight.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(185.2, TCPose.Front.Eye, TCPose.Front.FocusPoint, true)); 

KeyframeColec.push(new CameraAniKey(185.3, TCPose.FrontMid.Eye, TCPose.FrontMid.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(185.4, TCPose.Close2.Eye, TCPose.Close2.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(185.5, TCPose.Bottom.Eye, TCPose.Bottom.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(185.7, TCPose.SideRight2.Eye, TCPose.SideRight2.FocusPoint, false)); //glitch down
KeyframeColec.push(new CameraAniKey(186.0, TCPose.FrontFar.Eye, TCPose.FrontFar.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(187.97, TCPose.Back.Eye, TCPose.Back.FocusPoint, true)); 

KeyframeColec.push(new CameraAniKey(188.0, TCPose.Veins2.Eye, TCPose.Veins2.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(188.2, TCPose.Front.Eye, TCPose.Front.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(188.3, TCPose.BottomLeft.Eye, TCPose.BottomLeft.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(188.55, TCPose.Close.Eye, TCPose.Close.FocusPoint, true)); //enterance
KeyframeColec.push(new CameraAniKey(190.5, TCPose.BackClose.Eye, TCPose.BackClose.FocusPoint, true)); 

KeyframeColec.push(new CameraAniKey(190.6, TCPose.SideRight.Eye, TCPose.SideRight.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(190.8, TCPose.Veins.Eye, TCPose.Veins.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(191.0, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(191.2, TCPose.Back.Eye, TCPose.Back.FocusPoint, true)); //enterance
KeyframeColec.push(new CameraAniKey(193.15, TCPose.Close.Eye, TCPose.Close.FocusPoint, true)); 

KeyframeColec.push(new CameraAniKey(193.25, TCPose.Bottom.Eye, TCPose.Bottom.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(193.9, TCPose.FrontFar.Eye, TCPose.FrontFar.FocusPoint, true)); //enterance 
KeyframeColec.push(new CameraAniKey(195.8, TCPose.Close2.Eye, TCPose.Close2.FocusPoint, true)); 

KeyframeColec.push(new CameraAniKey(195.9, TCPose.Veins2.Eye, TCPose.Veins2.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(196.1, TCPose.Front.Eye, TCPose.Front.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(196.3, TCPose.BottomLeft.Eye, TCPose.BottomLeft.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(197.2, TCPose.FrontMid.Eye, TCPose.FrontMid.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(198.4, TCPose.BottomLeft.Eye, TCPose.BottomLeft.FocusPoint, true)); 

KeyframeColec.push(new CameraAniKey(198.4, TCPose.SideRight.Eye, TCPose.SideRight.FocusPoint, true)); //glitch //stutter
KeyframeColec.push(new CameraAniKey(198.8, TCPose.BottomLeft.Eye, TCPose.BottomLeft.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(199.6, TCPose.FrontMid.Eye, TCPose.FrontMid.FocusPoint, true)); //enterance
KeyframeColec.push(new CameraAniKey(201.0, TCPose.BackRight.Eye, TCPose.BackRight.FocusPoint, true)); 

KeyframeColec.push(new CameraAniKey(201.1, TCPose.SideRight.Eye, TCPose.SideRight.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(201.4, TCPose.Back.Eye, TCPose.Back.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(201.5, TCPose.Veins.Eye, TCPose.Veins.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(201.7, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(203.65, TCPose.Close2.Eye, TCPose.Close2.FocusPoint, true)); 

KeyframeColec.push(new CameraAniKey(203.75, TCPose.Bottom.Eye, TCPose.Bottom.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(204.4, TCPose.FrontFar.Eye, TCPose.FrontFar.FocusPoint, true)); //enterance
KeyframeColec.push(new CameraAniKey(206.25, TCPose.SideRight2.Eye, TCPose.SideRight2.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(206.35, TCPose.Veins2.Eye, TCPose.Veins2.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(206.6, TCPose.Front.Eye, TCPose.Front.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(206.7, TCPose.BottomLeft.Eye, TCPose.BottomLeft.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(207.0, TCPose.FrontMid.Eye, TCPose.FrontMid.FocusPoint, true)); //enterance
KeyframeColec.push(new CameraAniKey(208.9, TCPose.Close.Eye, TCPose.Close.FocusPoint, true)); 

KeyframeColec.push(new CameraAniKey(209.0, TCPose.SideRight.Eye, TCPose.SideRight.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(209.15, TCPose.Back.Eye, TCPose.Back.FocusPoint, true)); //glitch 
KeyframeColec.push(new CameraAniKey(209.2, TCPose.Veins.Eye, TCPose.Veins.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(209.5, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(209.66, TCPose.Close2.Eye, TCPose.Close2.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(211.53, TCPose.Bottom.Eye, TCPose.Bottom.FocusPoint, true)); 

KeyframeColec.push(new CameraAniKey(211.63, TCPose.FrontFar.Eye, TCPose.FrontFar.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(211.88, TCPose.SideRight2.Eye, TCPose.SideRight2.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(212.0, TCPose.Veins2.Eye, TCPose.Veins2.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(212.3, TCPose.Front.Eye, TCPose.Front.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(214.17, TCPose.BottomLeft.Eye, TCPose.BottomLeft.FocusPoint, true)); 

KeyframeColec.push(new CameraAniKey(214.27, TCPose.FrontMid.Eye, TCPose.FrontMid.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(214.9, TCPose.Close.Eye, TCPose.Close.FocusPoint, true)); //enterance
KeyframeColec.push(new CameraAniKey(216.8, TCPose.SideRight.Eye, TCPose.SideRight.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(216.9, TCPose.Back.Eye, TCPose.Back.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(217.2, TCPose.Veins.Eye, TCPose.Veins.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(217.3, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(217.5, TCPose.Close2.Eye, TCPose.Close2.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(219.43, TCPose.Bottom.Eye, TCPose.Bottom.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(219.53, TCPose.Close2.Eye, TCPose.Close2.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(219.7, TCPose.SideRight2.Eye, TCPose.SideRight2.FocusPoint, true)); //glitch 
KeyframeColec.push(new CameraAniKey(220.0, TCPose.Veins2.Eye, TCPose.Veins2.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(220.2, TCPose.Front.Eye, TCPose.Front.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(222.0, TCPose.BottomLeft.Eye, TCPose.BottomLeft.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(222.1, TCPose.FrontMid.Eye, TCPose.FrontMid.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(222.3, TCPose.Close.Eye, TCPose.Close.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(222.4, TCPose.SideRight.Eye, TCPose.SideRight.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(222.5, TCPose.Back.Eye, TCPose.Back.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(222.65, TCPose.Veins.Eye, TCPose.Veins.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(222.8, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(224.65, TCPose.Close2.Eye, TCPose.Close2.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(224.75, TCPose.Bottom.Eye, TCPose.Bottom.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(225.0, TCPose.FrontFar.Eye, TCPose.FrontFar.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(225.1, TCPose.SideRight2.Eye, TCPose.SideRight2.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(225.4, TCPose.Veins2.Eye, TCPose.Veins2.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(227.25, TCPose.Front.Eye, TCPose.Front.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(227.35, TCPose.BottomLeft.Eye, TCPose.BottomLeft.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(227.7, TCPose.FrontMid.Eye, TCPose.FrontMid.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(227.8, TCPose.Close.Eye, TCPose.Close.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(227.95, TCPose.Veins.Eye, TCPose.Veins.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(228.0, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(228.05, TCPose.Close2.Eye, TCPose.Close2.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(228.08, TCPose.Bottom.Eye, TCPose.Bottom.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(229.9, TCPose.BackClose.Eye, TCPose.BackClose.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(230.0, TCPose.SideRight2.Eye, TCPose.SideRight2.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(230.4, TCPose.Veins2.Eye, TCPose.Veins2.FocusPoint, true)); //glitch 
KeyframeColec.push(new CameraAniKey(230.45, TCPose.Front.Eye, TCPose.Front.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(230.7, TCPose.BottomLeft.Eye, TCPose.BottomLeft.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(232.5, TCPose.Front.Eye, TCPose.Front.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(232.6, TCPose.Close.Eye, TCPose.Close.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(232.9, TCPose.SideRight.Eye, TCPose.SideRight.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(233.0, TCPose.Back.Eye, TCPose.Back.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(233.17, TCPose.Veins.Eye, TCPose.Veins.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(233.3, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(235.05, TCPose.Close2.Eye, TCPose.Close2.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(235.15, TCPose.Bottom.Eye, TCPose.Bottom.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(235.4, TCPose.FrontFar.Eye, TCPose.FrontFar.FocusPoint, true)); //glitch 
KeyframeColec.push(new CameraAniKey(235.5, TCPose.SideRight2.Eye, TCPose.SideRight2.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(235.7, TCPose.Veins2.Eye, TCPose.Veins2.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(235.9, TCPose.Front.Eye, TCPose.Front.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(237.75, TCPose.BottomLeft.Eye, TCPose.BottomLeft.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(237.85, TCPose.FrontMid.Eye, TCPose.FrontMid.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(238.1, TCPose.Close.Eye, TCPose.Close.FocusPoint, true)); //glitch 
KeyframeColec.push(new CameraAniKey(238.16, TCPose.SideRight.Eye, TCPose.SideRight.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(238.4, TCPose.Back.Eye, TCPose.Back.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(238.55, TCPose.Veins.Eye, TCPose.Veins.FocusPoint, true)); //enterance
KeyframeColec.push(new CameraAniKey(240.4, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(240.5, TCPose.Close2.Eye, TCPose.Close2.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(241.1, TCPose.Bottom.Eye, TCPose.Bottom.FocusPoint, true)); //glitch 
KeyframeColec.push(new CameraAniKey(241.2, TCPose.FrontFar.Eye, TCPose.FrontFar.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(243.05, TCPose.SideRight2.Eye, TCPose.SideRight2.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(243.15, TCPose.Veins2.Eye, TCPose.Veins2.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(243.4, TCPose.Front.Eye, TCPose.Front.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(243.6, TCPose.BottomLeft.Eye, TCPose.BottomLeft.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(243.75, TCPose.FrontMid.Eye, TCPose.FrontMid.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(245.65, TCPose.Close.Eye, TCPose.Close.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(245.75, TCPose.SideRight.Eye, TCPose.SideRight.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(246.0, TCPose.Back.Eye, TCPose.Back.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(246.2, TCPose.Veins.Eye, TCPose.Veins.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(246.36, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(246.42, TCPose.Close2.Eye, TCPose.Close2.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(246.45, TCPose.Front.Eye, TCPose.Front.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(248.35, TCPose.BottomLeft.Eye, TCPose.BottomLeft.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(248.45, TCPose.FrontMid.Eye, TCPose.FrontMid.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(249.05, TCPose.Close.Eye, TCPose.Close.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(249.1, TCPose.SideRight.Eye, TCPose.SideRight.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(250.95, TCPose.Back.Eye, TCPose.Back.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(251.05, TCPose.Veins.Eye, TCPose.Veins.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(251.3, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(251.5, TCPose.Close2.Eye, TCPose.Close2.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(251.7, TCPose.Bottom.Eye, TCPose.Bottom.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(253.5, TCPose.Front.Eye, TCPose.Front.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(253.6, TCPose.SideRight2.Eye, TCPose.SideRight2.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(253.92, TCPose.FrontMid.Eye, TCPose.FrontMid.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(254.0, TCPose.Close2.Eye, TCPose.Close2.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(254.3, TCPose.Bottom.Eye, TCPose.Bottom.FocusPoint, true)); //enterance
KeyframeColec.push(new CameraAniKey(256.2, TCPose.Close.Eye, TCPose.Close.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(256.3, TCPose.SideRight2.Eye, TCPose.SideRight2.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(256.55, TCPose.Veins2.Eye, TCPose.Veins2.FocusPoint, false)); //glitch 
KeyframeColec.push(new CameraAniKey(256.7, TCPose.Front.Eye, TCPose.Front.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(257.0, TCPose.BottomLeft.Eye, TCPose.BottomLeft.FocusPoint, false)); //enterance
KeyframeColec.push(new CameraAniKey(258.8, TCPose.BackLeft.Eye, TCPose.BackLeft.FocusPoint, true));

KeyframeColec.push(new CameraAniKey(258.9, TCPose.Close.Eye, TCPose.Close.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(259.15, TCPose.SideRight.Eye, TCPose.SideRight.FocusPoint, true)); //glitch 
KeyframeColec.push(new CameraAniKey(259.2, TCPose.Back.Eye, TCPose.Back.FocusPoint, false)); //glitch
KeyframeColec.push(new CameraAniKey(259.3, TCPose.Veins.Eye, TCPose.Veins.FocusPoint, true)); //glitch
KeyframeColec.push(new CameraAniKey(259.6, TCPose.FrontClose.Eye, TCPose.FrontClose.FocusPoint, false)); //enterance

KeyframeColec.push(new CameraAniKey(261.0, TCPose.Veins.Eye, TCPose.Veins.FocusPoint, true)); //ending start
KeyframeColec.push(new CameraAniKey(286.0, TCPose.BottomLeft.Eye, TCPose.BottomLeft.FocusPoint, true)); //end

let TransformSongClip = new CameraAniClip(1.0, KeyframeColec, null);
CamAniClips.push(TransformSongClip);
    
    
   