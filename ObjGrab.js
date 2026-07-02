import {vec2, vec3} from './Externals/esm/index.js';
import { CosPreComp } from './PreCompWave.js';
import { ClampArr3 } from './Utils.js';
let gLastHeldObj = null;
let gLastMousePos = vec2.create();
let gLastMousePercent = vec2.create();
let gObjHeld = false;

export function GrabCheck(RCInd, RCColec)
{
    if (gMouseDown && (RCInd != -1 || gObjHeld))
    {
        console.log("GrabMove");
        if (gLastHeldObj == null){// onclick
            gLastMousePos = vec2.fromValues(gCurrentMousePos[0], gCurrentMousePos[1]);
            gLastMousePercent = vec2.fromValues(gCurrentMousePos[0] / gCanvasWidth, gCurrentMousePos[1] / gCanvasHeight);
            gLastHeldObj = RCColec[RCInd];
        } 
        if (gLastHeldObj == null) {console.error("OBJECT GRAB IS NULL"); return;}
        GrabMove();
    }
    else
    {
        gLastHeldObj = null;
        gObjHeld = false;
    }


}
function GrabMove()
{
    if (gCamera == null || gCamera == undefined) {return;}
    gObjHeld = true;
    //NOT SET UP FOR A ROTATED CAMERA CURRENTLY
    let Dist = vec3.create();
    let camPos = vec3.fromValues(gCamera.Eye[0], gCamera.Eye[1], gCamera.Eye[2]);
    let objPos = vec3.fromValues(gLastHeldObj.Position[0], gLastHeldObj.Position[1], gLastHeldObj.Position[2]);
    vec3.subtract(Dist, camPos, objPos);
    let Depth = objPos[2];

    let MouseDelta = vec2.create();
    vec2.subtract(MouseDelta, gLastMousePos, gCurrentMousePos);

    let HypMax = vec3.create(); 
    console.log(gAspect);
    HypMax[0] = ((Dist[2] * .5) / Math.cos(gFOVDegree * (Math.PI / 180))); 
    HypMax[1] = ((Dist[2] * .5) / Math.sin(gFOVDegree * (Math.PI / 180)));
    //IDK why .7 and .42 works but who cares. Whatever works, works
    HypMax[2] = Depth;
    let HypMin = vec3.create();
    HypMin[0] = HypMax[0] * -1.0;
    HypMin[1] = HypMax[1] * -1.0;
    HypMin[2] = Depth;

    let MinScPos = vec3.create();
    let MaxScPos = vec3.create();
    vec3.add(MinScPos, camPos, HypMin);
    vec3.add(MaxScPos, camPos, HypMax);

    let MousePercent = vec2.fromValues(gCurrentMousePos[0] / gCanvasWidth, gCurrentMousePos[1] / gCanvasHeight);
    let MouseDeltaPercent = vec2.create();
    vec2.sub(MouseDeltaPercent, MousePercent, gLastMousePercent);
    gLastMousePercent = MousePercent;
    let Span = vec3.create();
    vec3.sub(Span, MaxScPos, MinScPos);
    let Disp = vec3.create();
    let DispPer = vec3.fromValues(MouseDeltaPercent[0], MouseDeltaPercent[1], 0.0);
    vec3.multiply(Disp, Span, DispPer);
    let NewObjPos = vec3.create();
    vec3.add(NewObjPos, objPos, Disp);
    //vec3.add(NewObjPos, NewObjPos, camPos);//Offset for camera position

    gLastHeldObj.Position = [NewObjPos[0], NewObjPos[1], NewObjPos[2]];
    //CLAMPING
    /* 
    let ArrMin = [MinScPos[0], MinScPos[1], Depth];
    let ArrMax = [MaxScPos[0], MaxScPos[1], Depth];
    let ClampedPos = ClampArr3(gLastHeldObj.Position, ArrMin,ArrMax);
    if (ClampedPos != NaN) {gLastHeldObj.Position = ClampedPos;}
    console.log(ClampedPos);
    */

}
