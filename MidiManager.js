import { SpawnModel, gBoneModelColec } from "./webgl-demo";

export class MidiObj
{
    constructor(Timeline, AllClips)
    {
        this.Player = new MidiPlayer.Player(this.MidiCallback.bind(this));
        this.Timeline = Timeline;
        this.AnimationClips = AllClips;
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
        let PitchNum = 76; //Kick
        switch(EventName)
        {
            case("Note on"):
                console.log("Note on");
                switch(PitchNum)
                {
                    case(76):
                        console.log("Kick");
                        this.Timeline.addAnimationClip(this.AnimationClips.ClipKickL); //Explicitly setting this which is dumb but can restructure if we set up for new models
                        break;
                    case(77):
                        console.log("Tom");
                        let Position = [Math.random()*10.0, 5.0, 2.0];
                        let Rotation = [Math.random() * 90.0, Math.random() * 90.0, Math.random() * 90.0];
                        let Scale = [1.0, 1.0, 1.0];
                        let Dir = './models/Bone.obj';
                        await SpawnModel(Position, Rotation, Scale, Dir, gBoneModelColec);
                        break;
                }

                break;
            
        }
    }

}

