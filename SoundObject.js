import { mat4, vec3, vec4, vec2 } from './Externals/esm/index.js';
import {Clamp } from './Utils.js';
export class SoundObject
{
    constructor (Position, Pan, Volume, Sound, PanNode)
    {
        this.Position = Position;
        this.Pan = Pan;
        this.Volume = Volume;
        this.Sound = Sound;
        this.PanNode = PanNode; //Pan node must be attatched to the active track or this won't work
        //PanNode is tpye StereoPannerNode()
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
            this.Sound.currentTime = 0;
            this.Sound.play();
            break;
            case(1):
            this.Sound.currentTime = 0;
            this.Sound.loop = true;
            this.Sound.play();
            break;
        }
    }
    Pause()
    {
        this.Sound.pause();
    }
}
