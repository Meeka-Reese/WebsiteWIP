import { mat4, vec3, vec4, vec2 } from './Externals/esm/index.js';
import {Clamp } from './Utils.js';
export class SoundObject
{
    constructor (Position, Pan, Volume, Sound, Silent, PanNode, EndFuncInd)
    {
        this.Position = Position;
        this.Pan = Pan;
        this.Volume = Volume;
        this.Sound = Sound;
        this.Silent = Silent;
        this.PanNode = PanNode; //Pan node must be attatched to the active track or this won't work
        //PanNode is tpye StereoPannerNode()
        this.EndFuncInd = EndFuncInd;
        this.ActiveSound = Sound;
    }
    SetPan(CameraMat, CurrentTime)
    {
        if (this.PanNode == null){return;}
        let NewPos = vec3.create();
        vec3.transformMat4(NewPos, this.Position, CameraMat);
        this.PanNode.positionX.setTargetAtTime(NewPos[0], CurrentTime, .01);
        this.PanNode.positionY.setTargetAtTime(NewPos[1], CurrentTime, .01);
        this.PanNode.positionZ.setTargetAtTime(NewPos[2], CurrentTime, .01);
    }
    Play(Mode)
    {
        //Mode 0 = oneshot, 1 = looped
        switch(Mode)
        {
            case(0):
            this.ActiveSound.currentTime = 0;
            this.ActiveSound.play();
            break;
            case(1):
            this.ActiveSound.currentTime = 0;
            this.ActiveSound.loop = true;
            this.ActiveSound.play();
            break;
        }
        switch (this.EndFuncInd)
        {
            case(0):
                this.ActiveSound.addEventListener("ended", () => this.OnEndDef());
            break;
            case(1):
                if (this.Silent != null)
                {
                    this.ActiveSound.addEventListener("ended", () => this.OnRandSwitch());
                }
                else
                {
                    console.log("SKIPPED RAND LOOP CAUSE SILENT SAMPLE IS NULL");
                }
            break;
            default:
                this.ActiveSound.addEventListener("ended", () => this.OnEndDef());
            break;
        }
    }
    Pause()
    {
        this.ActiveSound.pause();
    }
    OnEndDef()
    {
        //console.log("EndDef");
    }
    OnRandSwitch()
    {
        console.log("RandEndSwitch");
        let SilentChance = .3;
        let RandNum = Math.random();
        if (RandNum < SilentChance)
        {
            this.ActiveSound = this.Silent;
        }
        else
        {
            this.ActiveSound = this.Sound;
        }
        this.ActiveSound.currentTime = 0;
        this.ActiveSound.play();
    }
}
