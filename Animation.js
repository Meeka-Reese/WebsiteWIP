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
    }
}
export class Timeline
{
    constructor(AnimationClips, StartTime)
    {
        this.AnimationClips = AnimationClips;
        this.Keyframes = [];
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

    for (let i = 0; i < this.AnimationClips.length; i++)
    {
        const clip = this.AnimationClips[i];
        const shouldUpdate = updateAll || clipsToUpdate.includes(i) || clip.Looping;

        if (shouldUpdate)
        {
            clip.StartTime = currentTime;

            for (let k = 0; k < clip.Keyframes.length; k++)
            {
                const kf = clip.Keyframes[k];
                const duration = kf.Time - kf.StartTime;
                kf.StartTime = currentTime;
                kf.Time = currentTime + duration;
            }
        }

        for (let k = 0; k < clip.Keyframes.length; k++)
        {
            this.Keyframes.push({ ...clip.Keyframes[k] });
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
        this.ClipKickL;
    }
    async setupClips()
    {
        //=====================IDLE ANIMATION======================
        let k1, k2, k3, k4;
        let IdleColec = [];
        k1 = new Keyframe(0.0, 1.0, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k2 = new Keyframe(0.0, 2.0, [0.0,0.0,0.0], [-10.0,0.0,0.0], [1.0,1.0,1.0], "Torso");

        IdleColec.push(k1, k2);
        this.ClipIdle = new AnimationClip(IdleColec, 0.0, 2.0, true);

        let ReachOutColec = [];

        k1 = new Keyframe(0.0, 0.0, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        k2 = new Keyframe(0.5, 10.0, [0.0,1.0,3.0], [-90.0,0.0,0.0], [1.0,1.0,1.0], "LShould");
        ReachOutColec.push(k1, k2);
        this.ClipReachOut = new AnimationClip(ReachOutColec, 0.0, 5.0, false);

        let KickLColec = [];

        k1 = new Keyframe(0.0, 0.0, [5.0,0.0,-5.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k2 = new Keyframe(0.5, 1.0, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        k3 = new Keyframe(0.0, 0.0, [-5.0,0.0,5.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Head");
        k4 = new Keyframe(0.5, 1.0, [0.0,0.0,0.0], [0.0,0.0,0.0], [1.0,1.0,1.0], "Head");
        
        KickLColec.push(k1, k2, k3, k4);
        this.ClipKickL = new AnimationClip(KickLColec, 0.0, 1.0, false);
    }
}
