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
    constructor(Keyframes)
    {
        this.Keyframes = Keyframes;
    }
}


export function Anim1(Timeline)
{
    let Keyframes = [];

    let LengthSec = 50.0;
    for (let sec = 0; sec < LengthSec; sec+=2) 
    {
        let Torso1 = new Keyframe(sec - 1.0, sec, [0.0, 0.0, 0.0], [20.0, 3.7, 1.6], [1.0, 1.0, 1.0], "Torso");
        let Torso2 = new Keyframe(sec, sec + 1.0, [0.0, 0.0, 0.0], [0.0, 3.7, 1.6], [1.0, 1.0, 1.0], "Torso");
        Keyframes.push(Torso1);
        Keyframes.push(Torso2);
    }

    Timeline.Keyframes = Keyframes;
    console.log("Timeline Setup");
}