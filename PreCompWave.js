
export function SinPreComp(SineBufferView,Length)
{
    
    let currentPhase = 0.0;
    let deltaPhase = (Math.PI * 2.0) / Length;

    for (let Sample = 0; Sample < Length; Sample++)
    {
        SineBufferView[Sample] = Math.sin(currentPhase);
        currentPhase += deltaPhase;
    }
}
export function CosPreComp(CosBufferView,Length)
{
    
    let currentPhase = 0.0;
    let deltaPhase = (Math.PI * 2.0) / Length;

    for (let Sample = 0; Sample < Length; Sample++)
    {
        CosBufferView[Sample] = Math.cos(currentPhase);
        currentPhase += deltaPhase;
    }
}
export function TanPreComp(TanBufferView,Length)
{
    
    let currentPhase = 0.0;
    let deltaPhase = (Math.PI * 2.0) / Length;

    for (let Sample = 0; Sample < Length; Sample++)
    {
        TanBufferView[Sample] = Math.tan(currentPhase);
        currentPhase += deltaPhase;
    }
}

export function ArcSinPreComp(ArcSinBufferView, Length)
{
    let currentPhase = -1.0;
    let deltaPhase = (2.0) / Length;

    for (let Sample = 0; Sample < Length; Sample++)
    {
        ArcSinBufferView[Sample] = Math.asin(currentPhase);
        currentPhase += deltaPhase;
    }
}

export function ArcCosPreComp(ArcCosBufferView, Length)
{
    let currentPhase = -1.0;
    let deltaPhase = (2.0) / Length;

    for (let Sample = 0; Sample < Length; Sample++)
    {
        ArcCosBufferView[Sample] = Math.acos(currentPhase);
        currentPhase += deltaPhase;
    }
}
