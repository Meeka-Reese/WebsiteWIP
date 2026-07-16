import { SpawnModel, gBoneColec, gFlowerColec, gAlmondColec, gGlobalTempo } from "./webgl-demo.js";

export class MidiObj
{
    constructor(CallbackFunc, Members)
    { 
        this.MidiCallback = CallbackFunc;
        this.Members = Members;
        for (let i = 0; i < this.Members.ccVals.length; i++) //init vals for array
        {
            this.Members.ccVals[i] = 0.0;
        }
        this.Player = new MidiPlayer.Player(this.MidiCallback.bind(this, this.Members));
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
    async StopMidi()
    {
        this.Player.pause();
    }
    async MidiCallback(event)
    {
        console.log("NO MIDI CALLBACK SET");
    }

    

}

export const TransCallback = async (Members, event)=>
{
    let EventName = event.name;
    let PitchNum = event.noteNumber;
    let CCNum = event.number;
    switch(EventName)
    {
        case("Note on"):
            console.log("Note on");
            switch(PitchNum)
            {
                case(0):
                    Members.Timeline.clearAniClips();
                    break;
                case(60):
                    console.log("Kick");
                    let RandIndex = Math.floor(Math.random() * Members.AnimationClips.PoseColec.length);
                    if (RandIndex == Members.PreviousRandInd) {RandIndex = RandIndex+1 < Members.AnimationClips.PoseColec.length ? RandIndex+1 : RandIndex-1}
                    Members.PreviousRandInd = RandIndex;
                    console.log("RandIndesx is " + RandIndex);  
                    Members.Timeline.addAnimationClip(Members.AnimationClips.PoseColec[RandIndex]); //Explicitly setting this which is dumb but can restructure if we set up for new models
                    break;
                case(61):
                    console.log("Tom");
                    let PosBone = [-30.0 + Math.random()*60.0, -40.0 + Math.random()*60.0, -30.0 + Math.random()*60.0];
                    let RotBone = [Math.random() * 90.0, Math.random() * 90.0, Math.random() * 90.0];
                    let SizeBone = 3.0;
                    let ScaleBone = [SizeBone, SizeBone, SizeBone];
                    let DirBone = './models/Bone.obj';
                    let TextDirBone = "./Textures/Bone.png";
                    let lifeSpanBone = 5.0;
                    await SpawnModel(PosBone, RotBone, ScaleBone, DirBone, gBoneColec, TextDirBone, lifeSpanBone,  null);
                    break;
                case(62):
                    console.log("Reach");
                    Members.Timeline.addAnimationClip(Members.AnimationClips.ClipReachOut);
                    break;
                case(63):
                    console.log("Flower Spawn");
                    let PosFlower = [-100.0 + Math.random()*200.0, -70.0 + Math.random()*10.0, 100.0 + (Math.random()*100.0)];
                    if (Members.LastAlmondXZ != [0.0,0.0])
                    {
                        PosFlower = [Members.LastAlmondXZ[0], PosFlower[1], Members.LastAlmondXZ[1]]; 
                        Members.LastAlmondXZ = [0.0,0.0];
                    }
                    let RotRandMagFlower = 10.0;
                    let RotFlower = [Math.random() * RotRandMagFlower, Math.random() * RotRandMagFlower, Math.random() * RotRandMagFlower];
                    let SizeFlower = 4.0;
                    let ScaleFlower = [SizeFlower, SizeFlower, SizeFlower];
                    let lifeSpanFlower = 4.0;
                    let DirFlower = './models/FlowerBloom.obj';
                    let Dir2Flower = './models/FlowerStem.obj';
                    let Dir3Flower = './models/FlowerBud.obj';
                    let Dir4Flower = './models/FlowerWilting.obj';
                    let Dir5Flower = './models/FlowerDead.obj';
                    let TextDirFlower = './Textures/FlowerBloom.png';
                    await SpawnModel(PosFlower, RotFlower, ScaleFlower, DirFlower, gFlowerColec, TextDirFlower,lifeSpanFlower,
                        Dir2Flower, Dir3Flower, Dir4Flower, Dir5Flower);
                    break;
                case(64):
                    let PosAlmond = [-100.0 + Math.random()*200.0, 180.0 + Math.random()*6.0, 0.0 + Math.random()*130.0];
                    Members.LastAlmondXZ = [PosAlmond[0], PosAlmond[2]];
                    let RotRandMagAlmond = 5.0;
                    let RotAlmond = [Math.random() * RotRandMagAlmond, Math.random() * RotRandMagAlmond, Math.random() * RotRandMagAlmond];
                    let SizeAlmond = 5.0;
                    let ScaleAlmond = [SizeAlmond, SizeAlmond, SizeAlmond];
                    let lifeSpanAlmond = 1.0 / (gGlobalTempo / 60.0); // 1 beat at global bpm
                    let DirAlmond = './models/Almond.obj';
                    let TextDirAlmond = './Textures/Almond.png';
                    await SpawnModel(PosAlmond, RotAlmond, ScaleAlmond, DirAlmond, gAlmondColec, TextDirAlmond, lifeSpanAlmond,  null);
                    break;
                case(65):
                    console.log("WalkCycle" + Members.AnimationClips.ClipWalkCycle.Keyframes.length);
                    Members.Timeline.addAnimationClip(Members.AnimationClips.ClipWalkCycle);
                    break;
                case(66):
                    console.log("RunCycle");
                    Members.Timeline.addAnimationClip(Members.AnimationClips.ClipRunCycle);
                    break;
            }

            break;
        case("Controller Change"):
            Members.ccVals[CCNum - 1] = event.value / 127.0;
        break;
        
        
    }
}

export const SeaCallback = async (Members, event)=>
{
    let EventName = event.name;
    let PitchNum = event.noteNumber;
    let CCNum = event.number;
    switch(EventName)
    {
        case("Note on"):
            console.log("Note on");
            switch(PitchNum)
            {
                
            }

            break;
        case("Controller Change"):
            Members.ccVals[CCNum - 1] = event.value / 127.0;
        break;
        
        
    }
}


