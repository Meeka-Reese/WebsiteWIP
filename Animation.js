import { gTimeSinceRun } from "./webgl-demo.js";
export class Keyframe
{
    constructor(StartTime, Time, Position, Rotation, Scale, BoneName)
    {
        this.StartTime = StartTime;
        this.Time = Time;
        this.Position = Position;
        this.Rotation = Rotation;
        this.Scale = Scale;
        this.BoneName = BoneName;
        this.PreviousPos = null;
        this.PreviousRot = null;
        this.PreviousScale = null;
    }
}
export class Timeline
{
    constructor(StartTime)
    {
        this.AnimationClips = [];
        this.Keyframes = [];
        this.KeyframeMap = new Map();
        this.StartTime = StartTime;
        this.setKeyframes(this.StartTime);
    }
    addAnimationClip(Clip)
    {
        for (let i = 0; i < this.AnimationClips.length; i++)
        {
            if(Clip == this.AnimationClips[i])
            {
                this.AnimationClips.splice(i, 1);
            }
        }
        this.AnimationClips.push(Clip);
        let colec = [];
        let i = 0;
        i += this.AnimationClips.length - 1;
        colec.push(i);
        this.setKeyframes(colec);
      
    }

    clearAniClips()
    {
        this.AnimationClips = [];
        this.KeyframeMap = new Map();
        this.Keyframes = [];
    }
    setKeyframes(clipsToUpdate = [-1])//set to -1 if all should be applied
    {
        // Validate input
    if (!Array.isArray(clipsToUpdate) || clipsToUpdate.length === 0)
    {
        return;
    }

    const updateAll = clipsToUpdate.length === 1 && clipsToUpdate[0] === -1;
    const currentTime = (gTimeSinceRun * 0.001) - this.StartTime;

    //console.log(`setKeyframes called | updateAll: ${updateAll} | clipsToUpdate: [${clipsToUpdate}]`);

    this.Keyframes = [];
    this.KeyframeMap = new Map();

    for (let i = 0; i < this.AnimationClips.length; i++)
    {
        const clip = this.AnimationClips[i];
        const shouldUpdate = updateAll || clipsToUpdate.includes(i) || clip.Looping;

        if (shouldUpdate)
        {
            let PrevStartTime = clip.StartTime;
            clip.StartTime = currentTime;
            for (let k = 0; k < clip.Keyframes.length; k++)
            {
                const kf = clip.Keyframes[k];
                const duration = kf.Time - kf.StartTime;
                kf.StartTime += currentTime - PrevStartTime;
                kf.Time = kf.StartTime + duration;
                kf.PreviousPos = null;
                kf.PreviousRot = null;
                kf.PreviousScale = null;
            }
        }

        for (let k = 0; k < clip.Keyframes.length; k++)
        {
            this.Keyframes.push({ ...clip.Keyframes[k] });
        }
        
    }
    let ActiveBoneName;
    let ActiveKeyframe;
    for (let k = 0; k < this.Keyframes.length; k++)
    {
        ActiveKeyframe = this.Keyframes[k];
        ActiveBoneName = ActiveKeyframe.BoneName;

        if (!this.KeyframeMap.has(ActiveBoneName))
        {
            let KeyframeColec = [this.Keyframes[k]];
            this.KeyframeMap.set(ActiveBoneName, KeyframeColec);
        }
        else
        {
            this.KeyframeMap.get(ActiveBoneName).push(ActiveKeyframe);
        }
    }

    console.log(`setKeyframes complete | total keyframes: ${this.Keyframes.length}`);
    }
}
export class AnimationClip
{
    constructor(Keyframes, StartTime, Duration, Looping)
    {
        this.Keyframes = Keyframes;
        this.StartTime = StartTime;
        this.Duration = Duration;
        this.Looping = Looping; //Boolian, if it's removed after finished
    }
}


export class CharClips
{
    constructor()
    {
        this.ClipIdle;
        this.ClipReachOut;
        this.ClipWalkCycle;
        this.ClipRunCycle;
        this.ClipKickL;
        this.PoseColec;
    }
    async setupClips()
    {
        // "Torso", "Chest", "LShould", "LForearm", "LArm", "LHand", "RShould", "RForearm",
        //                         "RArm", "RHand", "Head", "WaistL", "ThighL", "CalfL", "FootL", "WaistR", "ThighR",
        //                         "CalfR", "FootR", "Head.001"
        //=====================IDLE ANIMATION======================
        let k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15, k16, k17, k18, k19, k20, k21, k22, k23, k24,
        k25, k26, k27, k28, k29, k30, k31, k32, k33, k34, k35, k36, k37, k38, k39, k40, k41, k42, k43, k44, k45, k46, k47,
        k48, k49, k50, k51, k52, k53, k54, k55, k56, k57, k58, k59, k60, k61, k62, k63, k64, k65, k66, k67, k68, k69, k70,
        k71, k72, k73, k74, k75, k76, k77, k78, k79, k80, k81, k82, k83, k84, k85, k86, k87, k88, k89, k90;
        let kN1, kN2, kN3, kN4, kN5, kN6, kN7, kN8, kN9, kN10, kN11; //for loop over of nearest keyframe
        let IdleColec = [];
        k1 = new Keyframe(0.0, 1.0, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k2 = new Keyframe(0.0, 2.0, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "Torso");

        IdleColec.push(k1, k2);
        this.ClipIdle = new AnimationClip(IdleColec, 0.0, 2.0, true);

        let ReachOutColec = [];

        k1 = new Keyframe(0.0, 0.0, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k2 = new Keyframe(0.5, 10.0, [0.0,0.0,0.0], [-70.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        ReachOutColec.push(k1, k2);
        this.ClipReachOut = new AnimationClip(ReachOutColec, 0.0, 10.0, false);

        let WalkCyleColec = [];
        let Ws = .1; //Walk Speed

        //Loop Around Pos
      //Loop Around Pos
        kN1  = new Keyframe(-1*Ws, -1*Ws, [0.0,0.0,0.0], [-30.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
        kN2  = new Keyframe(-1*Ws, -1*Ws, [0.0,0.0,0.0], [5.0,0.0,0.0],   [1.0,1.0,1.0], "ThighL");
        kN3  = new Keyframe(-1*Ws, -1*Ws, [0.0,0.0,0.0], [10.0,0.0,0.0],  [1.0,1.0,1.0], "RShould");
        kN4  = new Keyframe(-1*Ws, -1*Ws, [0.0,0.0,0.0], [-5.0,0.0,0.0],  [1.0,1.0,1.0], "LShould");
        kN5  = new Keyframe(-1*Ws, -1*Ws, [0.0,0.2,0.0], [-5.0,0.0,0.0],  [1.0,1.0,1.0], "Torso");
        kN6  = new Keyframe(-1*Ws, -1*Ws, [0.0,0.0,0.0], [20.0,0.0,0.0],  [1.0,1.0,1.0], "CalfR");
        kN7  = new Keyframe(-1*Ws, -1*Ws, [0.0,0.0,0.0], [5.0,0.0,0.0],   [1.0,1.0,1.0], "CalfL");
        kN8  = new Keyframe(-1*Ws, -1*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0],   [1.0,1.0,1.0], "RForearm");
        kN9  = new Keyframe(-1*Ws, -1*Ws, [0.0,0.0,0.0], [-5.0,0.0,0.0],  [1.0,1.0,1.0], "LForearm");
        kN10 = new Keyframe(-1*Ws, -1*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0],   [1.0,1.0,1.0], "FootR");
        kN11 = new Keyframe(-1*Ws, -1*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0],   [1.0,1.0,1.0], "FootL");

       //Pose 1
       k1 = new Keyframe(Ws*.5, Ws*2, [0.0,0.0,0.0], [-40.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
       k2 = new Keyframe(Ws*.5, Ws*2, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
       k3 = new Keyframe(Ws*.5, Ws*2, [0.0,0.0,0.0], [20.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
       k4 = new Keyframe(Ws*.5, Ws*2, [0.0,0.0,0.0], [-20.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
       k5 = new Keyframe(Ws*.5, Ws*2, [0.0,0.0,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
       k6 = new Keyframe(Ws*.5, Ws*2, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
       k7 = new Keyframe(Ws*.5, Ws*2, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
       k8 = new Keyframe(Ws*.5, Ws*2, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
       k9 = new Keyframe(Ws*.5, Ws*2, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
       k10 = new Keyframe(Ws*.5, Ws*2, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
       k11 = new Keyframe(Ws*.5, Ws*2, [0.0,0.0,0.0], [5.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
       //Pose2
       k12  = new Keyframe(Ws*2, 3*Ws, [0.0,0.0,0.0], [-30.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
       k13  = new Keyframe(Ws*2, 3*Ws, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
       k14 = new Keyframe(Ws*2, 3*Ws, [0.0,0.0,0.0], [30.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
       k15 = new Keyframe(Ws*2, 3*Ws, [0.0,0.0,0.0], [-30.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
       k16 = new Keyframe(Ws*2, 3*Ws, [0.0,0.0,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
       k17 = new Keyframe(Ws*2, 3*Ws, [0.0,0.0,0.0], [30.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
       k18 = new Keyframe(Ws*2, 3*Ws, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
       k19 = new Keyframe(Ws*2, 3*Ws, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
       k20 = new Keyframe(Ws*2, 3*Ws, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
       k21 = new Keyframe(Ws*2, 3*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
       k22 = new Keyframe(Ws*2, 3*Ws, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
       //Pose3
       k23 = new Keyframe(3*Ws, 4*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
       k24 = new Keyframe(3*Ws, 4*Ws, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
       k25 = new Keyframe(3*Ws, 4*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
       k26 = new Keyframe(3*Ws, 4*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
       k27 = new Keyframe(3*Ws, 4*Ws, [0.0,0.0,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
       k28 = new Keyframe(3*Ws, 4*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
       k29 = new Keyframe(3*Ws, 4*Ws, [0.0,0.0,0.0], [90.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
       k30 = new Keyframe(3*Ws, 4*Ws, [0.0,0.0,0.0], [-2.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
       k31 = new Keyframe(3*Ws, 4*Ws, [0.0,0.0,0.0], [-2.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
       k32 = new Keyframe(3*Ws, 4*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
       k33 = new Keyframe(3*Ws, 4*Ws, [0.0,0.0,0.0], [5.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
       //Pose4
       k34 = new Keyframe(4*Ws, 5*Ws, [0.0,0.0,0.0], [30.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
       k35 = new Keyframe(4*Ws, 5*Ws, [0.0,0.0,0.0], [-20.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
       k36 = new Keyframe(4*Ws, 5*Ws, [0.0,0.0,.1], [-5.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
       k37 = new Keyframe(4*Ws, 5*Ws, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
       k38 = new Keyframe(4*Ws, 5*Ws, [0.0,0.2,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
       k39 = new Keyframe(4*Ws, 5*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
       k40 = new Keyframe(4*Ws, 5*Ws, [0.0,0.0,0.0], [80.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
       k41 = new Keyframe(4*Ws, 5*Ws, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
       k42 = new Keyframe(4*Ws, 5*Ws, [0.0,0.0,0.0], [-20.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
       k43 = new Keyframe(4*Ws, 5*Ws, [0.0,0.0,0.0], [5.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
       k44 = new Keyframe(4*Ws, 5*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
       //Pose5
       k45 = new Keyframe(5*Ws, 6*Ws, [0.0,0.0,0.0], [40.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
       k46 = new Keyframe(5*Ws, 6*Ws, [0.0,0.0,0.0], [-30.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
       k47 = new Keyframe(5*Ws, 6*Ws, [0.0,0.0,.2], [-10.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
       k48 = new Keyframe(5*Ws, 6*Ws, [0.0,0.0,0.0], [15.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
       k49 = new Keyframe(5*Ws, 6*Ws, [0.0,0.0,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
       k50 = new Keyframe(5*Ws, 6*Ws, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
       k51 = new Keyframe(5*Ws, 6*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
       k52 = new Keyframe(5*Ws, 6*Ws, [0.0,0.0,0.0], [-15.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
       k53 = new Keyframe(5*Ws, 6*Ws, [0.0,0.0,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
       k54 = new Keyframe(5*Ws, 6*Ws, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
       k55 = new Keyframe(5*Ws, 6*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
       //Pose6
       k56  = new Keyframe(6*Ws, 7*Ws, [0.0,0.0,0.0], [20.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
       k57  = new Keyframe(6*Ws, 7*Ws, [0.0,0.0,0.0], [-30.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
       k58 = new Keyframe(6*Ws, 7*Ws, [0.0,0.0,.3], [-30.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
       k59 = new Keyframe(6*Ws, 7*Ws, [0.0,0.0,0.0], [30.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
       k60 = new Keyframe(6*Ws, 7*Ws, [0.0,-0.2,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
       k61 = new Keyframe(6*Ws, 7*Ws, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
       k62 = new Keyframe(6*Ws, 7*Ws, [0.0,0.0,0.0], [30.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
       k63 = new Keyframe(6*Ws, 7*Ws, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
       k64 = new Keyframe(6*Ws, 7*Ws, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
       k65 = new Keyframe(6*Ws, 7*Ws, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
       k66 = new Keyframe(6*Ws, 7*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
       //Pose7
       k67 = new Keyframe(7*Ws, 8*Ws, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
       k68 = new Keyframe(7*Ws, 8*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
       k69 = new Keyframe(7*Ws, 8*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
       k70 = new Keyframe(7*Ws, 8*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
       k71 = new Keyframe(7*Ws, 8*Ws, [0.0,0.1,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
       k72 = new Keyframe(7*Ws, 8*Ws, [0.0,0.0,0.0], [40.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
       k73 = new Keyframe(7*Ws, 8*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
       k74 = new Keyframe(7*Ws, 8*Ws, [0.0,0.0,0.0], [-2.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
       k75 = new Keyframe(7*Ws, 8*Ws, [0.0,0.0,0.0], [-2.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
       k76 = new Keyframe(7*Ws, 8*Ws, [0.0,0.0,0.0], [5.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
       k77 = new Keyframe(7*Ws, 8*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
       //Pose8
       k78 = new Keyframe(8*Ws, 9*Ws, [0.0,0.0,0.0], [-30.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
       k79 = new Keyframe(8*Ws, 9*Ws, [0.0,0.0,0.0], [5.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
       k80 = new Keyframe(8*Ws, 9*Ws, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
       k81 = new Keyframe(8*Ws, 9*Ws, [0.0,0.0,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
       k82 = new Keyframe(8*Ws, 9*Ws, [0.0,0.2,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
       k83 = new Keyframe(8*Ws, 9*Ws, [0.0,0.0,0.0], [20.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
       k84 = new Keyframe(8*Ws, 9*Ws, [0.0,0.0,0.0], [5.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
       k85 = new Keyframe(8*Ws, 9*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
       k86 = new Keyframe(8*Ws, 9*Ws, [0.0,0.0,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
       k87 = new Keyframe(8*Ws, 9*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
       k88 = new Keyframe(8*Ws, 9*Ws, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
   

        WalkCyleColec.push(kN1, kN2, kN3, kN4, kN5, kN6, kN7, kN8, kN9, kN10, kN11, k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15, k16, k17, k18, k19, k20, k21, k22, k23, k24,
            k25, k26, k27, k28, k29, k30, k31, k32, k33, k34, k35, k36, k37, k38, k39, k40, k41, k42, k43, k44, k45, k46, k47,
            k48, k49, k50, k51, k52, k53, k54, k55, k56, k57, k58, k59, k60, k61, k62, k63, k64, k65, k66, k67, k68, k69, k70,
            k71, k72, k73, k74, k75, k76, k77, k78, k79, k80, k81, k82, k83, k84, k85, k86, k87, k88);
        
        this.ClipWalkCycle = new AnimationClip(WalkCyleColec, 0.0, Ws*9, true);

        let Rs = .06;
        let RunCycleColec = [];
         //Loop Around Pos
         kN1  = new Keyframe(-1*Rs, -1*Rs, [0.0,0.0,0.0], [-45.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
         kN2  = new Keyframe(-1*Rs, -1*Rs, [0.0,0.0,0.0], [20.0,0.0,0.0],   [1.0,1.0,1.0], "ThighL");
         kN3  = new Keyframe(-1*Rs, -1*Rs, [0.0,0.0,0.0], [20.0,0.0,0.0],  [1.0,1.0,1.0], "RShould");
         kN4  = new Keyframe(-1*Rs, -1*Rs, [0.0,0.0,0.0], [-15.0,0.0,0.0],  [1.0,1.0,1.0], "LShould");
         kN5  = new Keyframe(-1*Rs, -1*Rs, [0.0,0.4,0.0], [-5.0,0.0,0.0],  [1.0,1.0,1.0], "Torso");
         kN6  = new Keyframe(-1*Rs, -1*Rs, [0.0,0.0,0.0], [30.0,0.0,0.0],  [1.0,1.0,1.0], "CalfR");
         kN7  = new Keyframe(-1*Rs, -1*Rs, [0.0,0.0,0.0], [15.0,0.0,0.0],   [1.0,1.0,1.0], "CalfL");
         kN8  = new Keyframe(-1*Rs, -1*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0],   [1.0,1.0,1.0], "RForearm");
         kN9  = new Keyframe(-1*Rs, -1*Rs, [0.0,0.0,0.0], [-5.0,0.0,0.0],  [1.0,1.0,1.0], "LForearm");
         kN10 = new Keyframe(-1*Rs, -1*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0],   [1.0,1.0,1.0], "FootR");
         kN11 = new Keyframe(-1*Rs, -1*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0],   [1.0,1.0,1.0], "FootL");
 
        //Pose 1
        k1 = new Keyframe(Rs*.5, Rs*2, [0.0,0.0,0.0], [-55.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
        k2 = new Keyframe(Rs*.5, Rs*2, [0.0,0.0,0.0], [25.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
        k3 = new Keyframe(Rs*.5, Rs*2, [0.0,0.0,0.0], [30.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
        k4 = new Keyframe(Rs*.5, Rs*2, [0.0,0.0,0.0], [-30.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k5 = new Keyframe(Rs*.5, Rs*2, [0.0,0.0,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k6 = new Keyframe(Rs*.5, Rs*2, [0.0,0.0,0.0], [20.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
        k7 = new Keyframe(Rs*.5, Rs*2, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
        k8 = new Keyframe(Rs*.5, Rs*2, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
        k9 = new Keyframe(Rs*.5, Rs*2, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
        k10 = new Keyframe(Rs*.5, Rs*2, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
        k11 = new Keyframe(Rs*.5, Rs*2, [0.0,0.0,0.0], [5.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
        //Pose 2
        k12  = new Keyframe(Rs*2, 3*Rs, [0.0,0.0,0.0], [-40.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
        k13  = new Keyframe(Rs*2, 3*Rs, [0.0,0.0,0.0], [20.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
        k14 = new Keyframe(Rs*2, 3*Rs, [0.0,0.0,0.0], [40.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
        k15 = new Keyframe(Rs*2, 3*Rs, [0.0,0.0,0.0], [-40.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k16 = new Keyframe(Rs*2, 3*Rs, [0.0,0.0,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k17 = new Keyframe(Rs*2, 3*Rs, [0.0,0.0,0.0], [40.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
        k18 = new Keyframe(Rs*2, 3*Rs, [0.0,0.0,0.0], [20.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
        k19 = new Keyframe(Rs*2, 3*Rs, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
        k20 = new Keyframe(Rs*2, 3*Rs, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
        k21 = new Keyframe(Rs*2, 3*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
        k22 = new Keyframe(Rs*2, 3*Rs, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
        //Pose3
        k23 = new Keyframe(3*Rs, 4*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
        k24 = new Keyframe(3*Rs, 4*Rs, [0.0,0.0,0.0], [-25.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
        k25 = new Keyframe(3*Rs, 4*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
        k26 = new Keyframe(3*Rs, 4*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k27 = new Keyframe(3*Rs, 4*Rs, [0.0,0.0,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k28 = new Keyframe(3*Rs, 4*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
        k29 = new Keyframe(3*Rs, 4*Rs, [0.0,0.0,0.0], [100.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
        k30 = new Keyframe(3*Rs, 4*Rs, [0.0,0.0,0.0], [-2.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
        k31 = new Keyframe(3*Rs, 4*Rs, [0.0,0.0,0.0], [-2.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
        k32 = new Keyframe(3*Rs, 4*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
        k33 = new Keyframe(3*Rs, 4*Rs, [0.0,0.0,0.0], [5.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
        //Pose4
        k34 = new Keyframe(4*Rs, 5*Rs, [0.0,0.0,0.0], [45.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
        k35 = new Keyframe(4*Rs, 5*Rs, [0.0,0.0,0.0], [-35.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
        k36 = new Keyframe(4*Rs, 5*Rs, [0.0,0.0,.1], [-15.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
        k37 = new Keyframe(4*Rs, 5*Rs, [0.0,0.0,0.0], [20.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k38 = new Keyframe(4*Rs, 5*Rs, [0.0,0.4,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k39 = new Keyframe(4*Rs, 5*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
        k40 = new Keyframe(4*Rs, 5*Rs, [0.0,0.0,0.0], [90.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
        k41 = new Keyframe(4*Rs, 5*Rs, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
        k42 = new Keyframe(4*Rs, 5*Rs, [0.0,0.0,0.0], [-20.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
        k43 = new Keyframe(4*Rs, 5*Rs, [0.0,0.0,0.0], [5.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
        k44 = new Keyframe(4*Rs, 5*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
        //Pose5
        k45 = new Keyframe(5*Rs, 6*Rs, [0.0,0.0,0.0], [55.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
        k46 = new Keyframe(5*Rs, 6*Rs, [0.0,0.0,0.0], [-45.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
        k47 = new Keyframe(5*Rs, 6*Rs, [0.0,0.0,.2], [-20.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
        k48 = new Keyframe(5*Rs, 6*Rs, [0.0,0.0,0.0], [25.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k49 = new Keyframe(5*Rs, 6*Rs, [0.0,0.0,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k50 = new Keyframe(5*Rs, 6*Rs, [0.0,0.0,0.0], [20.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
        k51 = new Keyframe(5*Rs, 6*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
        k52 = new Keyframe(5*Rs, 6*Rs, [0.0,0.0,0.0], [-15.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
        k53 = new Keyframe(5*Rs, 6*Rs, [0.0,0.0,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
        k54 = new Keyframe(5*Rs, 6*Rs, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
        k55 = new Keyframe(5*Rs, 6*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
        //Pose6
        k56  = new Keyframe(6*Rs, 7*Rs, [0.0,0.0,0.0], [40.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
        k57  = new Keyframe(6*Rs, 7*Rs, [0.0,0.0,0.0], [-55.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
        k58 = new Keyframe(6*Rs, 7*Rs, [0.0,0.0,.3], [-40.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
        k59 = new Keyframe(6*Rs, 7*Rs, [0.0,0.0,0.0], [40.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k60 = new Keyframe(6*Rs, 7*Rs, [0.0,-0.4,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k61 = new Keyframe(6*Rs, 7*Rs, [0.0,0.0,0.0], [20.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
        k62 = new Keyframe(6*Rs, 7*Rs, [0.0,0.0,0.0], [40.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
        k63 = new Keyframe(6*Rs, 7*Rs, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
        k64 = new Keyframe(6*Rs, 7*Rs, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
        k65 = new Keyframe(6*Rs, 7*Rs, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
        k66 = new Keyframe(6*Rs, 7*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
        //Pose7
        k67 = new Keyframe(7*Rs, 8*Rs, [0.0,0.0,0.0], [-25.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
        k68 = new Keyframe(7*Rs, 8*Rs, [0.0,0.0,0.0], [15.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
        k69 = new Keyframe(7*Rs, 8*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
        k70 = new Keyframe(7*Rs, 8*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k71 = new Keyframe(7*Rs, 8*Rs, [0.0,0.2,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k72 = new Keyframe(7*Rs, 8*Rs, [0.0,0.0,0.0], [50.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
        k73 = new Keyframe(7*Rs, 8*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
        k74 = new Keyframe(7*Rs, 8*Rs, [0.0,0.0,0.0], [-2.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
        k75 = new Keyframe(7*Rs, 8*Rs, [0.0,0.0,0.0], [-2.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
        k76 = new Keyframe(7*Rs, 8*Rs, [0.0,0.0,0.0], [5.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
        k77 = new Keyframe(7*Rs, 8*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootL");
        //Pose8
        k78 = new Keyframe(8*Rs, 9*Rs, [0.0,0.0,0.0], [-45.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
        k79 = new Keyframe(8*Rs, 9*Rs, [0.0,0.0,0.0], [20.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
        k80 = new Keyframe(8*Rs, 9*Rs, [0.0,0.0,0.0], [20.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
        k81 = new Keyframe(8*Rs, 9*Rs, [0.0,0.0,0.0], [-15.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k82 = new Keyframe(8*Rs, 9*Rs, [0.0,0.4,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k83 = new Keyframe(8*Rs, 9*Rs, [0.0,0.0,0.0], [30.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
        k84 = new Keyframe(8*Rs, 9*Rs, [0.0,0.0,0.0], [15.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
        k85 = new Keyframe(8*Rs, 9*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
        k86 = new Keyframe(8*Rs, 9*Rs, [0.0,0.0,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
        k87 = new Keyframe(8*Rs, 9*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootR");
        k88 = new Keyframe(8*Rs, 9*Rs, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "FootL");


        RunCycleColec.push(kN1, kN2, kN3, kN4, kN5, kN6, kN7, kN8, kN9, kN10, kN11, k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15, k16, k17, k18, k19, k20, k21, k22, k23, k24,
            k25, k26, k27, k28, k29, k30, k31, k32, k33, k34, k35, k36, k37, k38, k39, k40, k41, k42, k43, k44, k45, k46, k47,
            k48, k49, k50, k51, k52, k53, k54, k55, k56, k57, k58, k59, k60, k61, k62, k63, k64, k65, k66, k67, k68, k69, k70,
            k71, k72, k73, k74, k75, k76, k77, k78, k79, k80, k81, k82, k83, k84, k85, k86, k87, k88);
        
        this.ClipRunCycle = new AnimationClip(RunCycleColec, 0.0, Rs*9, true);



        let KickLColec = [];

        k1 = new Keyframe(0.0, 0.0, [5.0,0.0,-5.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k2 = new Keyframe(0.5, 1.0, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k3 = new Keyframe(0.0, 0.0, [-5.0,0.0,5.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Head");
        k4 = new Keyframe(0.5, 1.0, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Head");
        
        KickLColec.push(k1, k2, k3, k4);
        
        this.PoseColec = [];
        let Pose = [];
        k1 = new Keyframe(0.0, 0.05, [0.0,0.0,1.0], [40.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k2 = new Keyframe(0.0, 0.05, [0.0,0.0,1.0], [40.0,0.0,0.0], [1.0,1.0,1.0], "Head");
        k3 = new Keyframe(0.1, .2, [0.0,0.0,1.0], [40.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k4 = new Keyframe(0.1, 0.2, [0.0,0.0,1.0], [40.0,0.0,0.0], [1.0,1.0,1.0], "Head");
        k5 = new Keyframe(0.3, 0.35, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k6 = new Keyframe(0.3, 0.35, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Head");
        Pose.push(k1, k2, k3, k4, k5, k6);
        let poseClip = new AnimationClip(Pose, 0.0, 0.4, false);
        this.PoseColec.push(poseClip);
        Pose = [];
        k1 = new Keyframe(0.0, 0.05, [0.0,0.0,1.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k2 = new Keyframe(0.0, .05, [0.0,0.0,0.0], [0.0,0.0,-20.0], [1.0,5.0,1.0], "ThighL");
        k3 = new Keyframe(0.0, .05, [0.0,0.0,0.0], [0.0,0.0,20.0], [1.0,5.0,1.0], "ThighR");
        k4 = new Keyframe(0.1, 0.2, [0.0,0.0,1.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k5 = new Keyframe(0.1, .2, [0.0,0.0,0.0], [0.0,0.0,-20.0], [1.0,5.0,1.0], "ThighL");
        k6 = new Keyframe(0.1, .2, [0.0,0.0,0.0], [0.0,0.0,20.0], [1.0,5.0,1.0], "ThighR");
        k7 = new Keyframe(0.3, 0.35, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k8 = new Keyframe(0.3, .35, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
        k9 = new Keyframe(0.3, .35, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
        Pose.push(k1, k2, k3, k4, k5, k6, k7, k8, k9);
        poseClip = new AnimationClip(Pose, 0.0, 0.4, false);
        this.PoseColec.push(poseClip);

        Pose = [];
        k1 = new Keyframe(0.0, 0.05, [0.0,0.0,0.0], [45.0,90.0,0.0], [1.0,1.0,1.0], "LShould");
        k2 = new Keyframe(0.0, 0.05, [0.0,0.0,0.0], [45.0,90.0,0.0], [2.0,2.0,2.0], "LForearm");
        k3 = new Keyframe(0.0, 0.05, [0.0,0.0,0.0], [45.0,-90.0,0.0], [1.0,1.0,1.0], "RShould");
        k4 = new Keyframe(0.0, 0.05, [0.0,0.0,0.0], [45.0,-90.0,0.0], [2.0,2.0,2.0], "RForearm");
        k5 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [45.0,90.0,0.0], [1.0,1.0,1.0], "LShould");
        k6 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [45.0,90.0,0.0], [2.0,2.0,2.0], "LForearm");
        k7 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [45.0,-90.0,0.0], [1.0,1.0,1.0], "RShould");
        k8 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [45.0,-90.0,0.0], [2.0,2.0,2.0], "RForearm");
        k9 = new Keyframe(0.3, 0.35, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k10 = new Keyframe(0.3, 0.35, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
        k11 = new Keyframe(0.3, 0.35, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
        k12 = new Keyframe(0.3, 0.35, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "RForearm");
        Pose.push(k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12);
        poseClip = new AnimationClip(Pose, 0.0, 0.4, false);
        this.PoseColec.push(poseClip);

        Pose = [];
        k1 = new Keyframe(0.0, 0.05, [0.0,-3.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k2 = new Keyframe(0.0, 0.05, [0.0,-2.0,0.0], [50.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
        k3 = new Keyframe(0.0, 0.05, [0.0,-2.0,0.0], [50.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
        k4 = new Keyframe(0.0, 0.05, [0.0,-2.0,0.0], [-50.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
        k5 = new Keyframe(0.0, 0.05, [0.0,-2.0,0.0], [-50.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
        k6 = new Keyframe(0.0, 0.05, [0.0,0.0,0.0], [50.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k7= new Keyframe(0.0, 0.05, [0.0,0.0,0.0], [50.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
        k8 = new Keyframe(0.0, 0.05, [0.0,0.0,0.0], [0.0,40.0,0.0], [1.0,1.0,1.0], "LForearm");
        k9 = new Keyframe(0.0, 0.05, [0.0,0.0,0.0], [0.0,40.0,0.0], [1.0,1.0,1.0], "RForearm");
        k10 = new Keyframe(0.1, 0.2, [0.0,-3.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k11 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [50.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
        k12 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [50.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
        k13 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [-50.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
        k14 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [-50.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
        k15 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [50.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k16= new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [50.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
        k17 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [0.0,40.0,0.0], [1.0,1.0,1.0], "LForearm");
        k18 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [0.0,40.0,0.0], [1.0,1.0,1.0], "RForearm");
        k19 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k20 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
        k21 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
        k22 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
        k23 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
        k24 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k25= new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
        k26 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
        k27 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,4.0,0.0], [1.0,1.0,1.0], "RForearm");

        Pose.push(k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15, k16, k17, k18, k19, k20, k21, k22, k23, k24,
            k25, k26, k27);
        poseClip = new AnimationClip(Pose, 0.0, 0.5, false);
        this.PoseColec.push(poseClip);

        Pose = [];
        k1 = new Keyframe(0.0, 0.05, [0.0,-3.0,0.0], [0.0,0.0,0.0], [.1,.1,.1], "Torso");
        k2 = new Keyframe(0.0, 0.05, [0.0,-2.0,0.0], [50.0,0.0,0.0], [.1,.1,.1], "ThighL");
        k3 = new Keyframe(0.0, 0.05, [0.0,-2.0,0.0], [50.0,0.0,0.0], [.1,.1,.1], "ThighR");
        k4 = new Keyframe(0.0, 0.05, [0.0,-2.0,0.0], [-50.0,0.0,0.0], [.1,.1,.1], "CalfL");
        k5 = new Keyframe(0.0, 0.05, [0.0,-2.0,0.0], [-50.0,0.0,0.0], [.1,.1,.1], "CalfR");
        k6 = new Keyframe(0.0, 0.05, [0.0,0.0,0.0], [50.0,0.0,0.0], [.1,.1,.1], "LShould");
        k7= new Keyframe(0.0, 0.05, [0.0,0.0,0.0], [50.0,0.0,0.0], [.1,.1,.1], "RShould");
        k8 = new Keyframe(0.0, 0.05, [0.0,0.0,0.0], [0.0,40.0,0.0], [.1,.1,.1], "LForearm");
        k9 = new Keyframe(0.0, 0.05, [0.0,0.0,0.0], [0.0,40.0,0.0], [.1,.1,.1], "RForearm");
        k10 = new Keyframe(0.1, 0.2, [0.0,-3.0,0.0], [0.0,0.0,0.0], [.1,.1,.1], "Torso");
        k11 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [50.0,0.0,0.0], [.1,.1,.1], "ThighL");
        k12 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [50.0,0.0,0.0], [.1,.1,.1], "ThighR");
        k13 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [-50.0,0.0,0.0], [.1,.1,.1], "CalfL");
        k14 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [-50.0,0.0,0.0], [.1,.1,.1], "CalfR");
        k15 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [50.0,0.0,0.0], [.1,.1,.1], "LShould");
        k16= new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [50.0,0.0,0.0], [.1,.1,.1], "RShould");
        k17 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [0.0,40.0,0.0], [.1,.1,.1], "LForearm");
        k18 = new Keyframe(0.1, 0.2, [0.0,0.0,0.0], [0.0,40.0,0.0], [.1,.1,.1], "RForearm");
        k19 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k20 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "ThighL");
        k21 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "ThighR");
        k22 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "CalfL");
        k23 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "CalfR");
        k24 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k25= new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
        k26 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "LForearm");
        k27 = new Keyframe(0.4, 0.45, [0.0,0.0,0.0], [0.0,4.0,0.0], [1.0,1.0,1.0], "RForearm");
        Pose.push(k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15, k16, k17, k18, k19, k20, k21, k22, k23, k24,
            k25, k26, k27);
        poseClip = new AnimationClip(Pose, 0.0, 0.5, false);
        this.PoseColec.push(poseClip);

        Pose = [];
        k1 = new Keyframe(0.0, .05, [0.0,0.0,0.0], [-40.0,0.0,0.0], [2.0,2.0,2.0], "LShould");
        k2 = new Keyframe(0.1, .3, [0.0,0.0,0.0], [-90.0,0.0,0.0], [2.0,2.0,2.0], "LShould");
        k3 = new Keyframe(0.2, .35, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        Pose.push(k1, k2, k3);
        poseClip = new AnimationClip(Pose, 0.0, 0.4, false);
        this.PoseColec.push(poseClip);

        Pose = [];
        k1 = new Keyframe(0.0, .05, [0.0,0.0,0.0], [-40.0,0.0,0.0], [2.0,2.0,2.0], "RShould");
        k2 = new Keyframe(0.1, .3, [0.0,0.0,0.0], [-90.0,0.0,0.0], [2.0,2.0,2.0], "RShould");
        k3 = new Keyframe(0.2, .35, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "RShould");
        Pose.push(k1, k2, k3);
        poseClip = new AnimationClip(Pose, 0.0, 0.4, false);
        this.PoseColec.push(poseClip);


        this.ClipKickL = new AnimationClip(KickLColec, 0.0, 1.0, false);

    }
}
