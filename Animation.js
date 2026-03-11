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
        this.AnimationClips.push(Clip);
    }
    setKeyframes(Time, ClipsIndToUpdate = [-1])//set to -1 if all should be applied
    {
        this.Keyframes = [];
        let clip;
        for (let i = 0; i < this.AnimationClips.length; i++)
        {
            clip = this.AnimationClips[i];
            if (ClipsIndToUpdate[0] == -1 || ClipsIndToUpdate.includes(i))
            {
                clip.StartTime = Time;
                for (Keyframe in clip.Keyframes)
                {
                    Keyframe.StartTime += Time;
                    Keyframe.Time += Time;
                }
            }
            for (Keyframe in clip.Keyframes)
            {
                this.Keyframes.push(Keyframe);
            }
        }
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

export class AllClips
{
    constructor()
    {
        this.ClipIdle;
        this.setupClips();
    }
    setupClips()
    {
        //=====================IDLE ANIMATION======================
        let IdleColec = [];

        let k1 = new Keyframe(0.0, 1.0, [0.0,0.0,0.0], [10.0,0.0,0.0], [1.0,1.0,1.0], "Torso");
        let k2 = new Keyframe(0.0, 2.0, [0.0,0.0,0.0], [-5.0,0.0,0.0], [1.0,1.0,1.0], "Torso");

        let k3 = new Keyframe(0.0, 1.0, [0.0,0.0,0.0], [0.0,0.0,5.0], [1.0,1.0,1.0], "LShould");
        let k4 = new Keyframe(0.0, 1.7, [0.0,0.0,0.0], [0.0,0.0,-5.0], [1.0,1.0,1.0], "LShould");
        let k5 = new Keyframe(0.0, 1.0, [0.0,0.0,0.0], [0.0,0.0,3.0], [1.0,1.0,1.0], "RShould");
        let k6 = new Keyframe(0.0, 1.9, [0.0,0.0,0.0], [0.0,0.0,-6.0], [1.0,1.0,1.0], "RShould");
        IdleColec.push(k1, k2, k3, k4, k5, k6);
        this.ClipIdle = new AnimationClip(IdleColec, 0.0, 2.0, true);
    }
}
