import { SpawnModel, gBoneModelColec } from "./webgl-demo.js";

export class MidiObj
{
    constructor(Timeline, AllClips)
    {
        this.Player = new MidiPlayer.Player(this.MidiCallback.bind(this));
        this.Timeline = Timeline;
        this.AnimationClips = AllClips;
        this.ccVals = new Array(8);
    }
    async LoadFile(dir)
    {
        const Response = await fetch(dir);
        const Buffer = await Response.arrayBuffer();
        this.Player.loadArrayBuffer(Buffer);
        console.log("Midi Buffer Loaded");
    }
    StartMidi()
    {
        this.Player.play();
        console.log("Midi clip starting");
    }
    StopMidi()
    {
        this.Player.stop();
    }
    async MidiCallback(event)
    {
        let EventName = event.name;
        let PitchNum = event.noteNumber;
        let CCNum = event.number;
        //console.log(event);
        switch(EventName)
        {
            case("Note on"):
                console.log("Note on");
                switch(PitchNum)
                {
                    case(60):
                        console.log("Kick");
                        this.Timeline.addAnimationClip(this.AnimationClips.ClipKickL); //Explicitly setting this which is dumb but can restructure if we set up for new models
                        break;
                    case(61):
                        console.log("Tom");
                        let Position = [-30.0 + Math.random()*60.0, -60.0 + Math.random()*60.0, -30.0 + Math.random()*60.0];
                        let Rotation = [Math.random() * 90.0, Math.random() * 90.0, Math.random() * 90.0];
                        let Size = 3.0;
                        let Scale = [Size, Size, Size];
                        let Dir = './models/Bone.obj';
                        let TextDir = "./Textures/Bone.png";
                        await SpawnModel(Position, Rotation, Scale, Dir, gBoneModelColec, TextDir, null);
                        break;
                    case(62):
                        console.log("Reach");
                        this.Timeline.addAnimationClip(this.AnimationClips.ClipReachOut);
                        break;
                }

                break;
            case("Controller Change"):
                switch(CCNum)
                {
                    case(1):
                        this.ccVals[0] = event.value / 127.0;
                        break;
                }
            break;
            
            
        }
    }

}

