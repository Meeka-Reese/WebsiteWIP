import { createTexture2DFromBuffer} from './ShaderFunc.js';
import { CreateWorley2D } from './GenerateNoise.js';
export class FluidSim2D
{
    constructor(ScreenQuad, Dimensions, StartingRGBA, IterNum)
    {
        this.ScreenQuad = ScreenQuad;
        this.Dimensions = [Dimensions[0] + 2, Dimensions[1] + 2];
        this.StartingRGBA = StartingRGBA;
        this.ReadText = null;
        this.WriteText = null;
        this.HoldText = null;
        this.DivergeText = null;
        this.PressureText = null;
        this.IterNum = IterNum;
    }
    async SetUpText()
    {
        console.log(this.Dimensions);
        let ImgBuffer = new Float32Array(this.Dimensions[0] * this.Dimensions[1] * 4);
        let EmptyImgBuffer = new Float32Array(this.Dimensions[0] * this.Dimensions[1] * 4);
        let NoiseBuffer = CreateWorley2D(20, this.Dimensions[0]); //breaks if dimensions x != y
        let NoiseBuffer2 = CreateWorley2D(10, this.Dimensions[0]); //breaks if dimensions x != y
        

        for (let h = 0; h < this.Dimensions[1]; h++)
        {
            
            for (let w = 0; w < this.Dimensions[0]; w++)
            {
                let i = (w + (h * this.Dimensions[0])) * 4;
                let RandVal =  Math.random();
                let VorNoiseX = -(NoiseBuffer[i]);
                let VorNoiseY = (NoiseBuffer2[i]) * 2.0;
                ImgBuffer[i] = NoiseBuffer[i];
                ImgBuffer[i+1] = VorNoiseX;
                ImgBuffer[i+2] = VorNoiseY
                ImgBuffer[i+3] = this.StartingRGBA[3];
                EmptyImgBuffer[i] = 0.0;
                EmptyImgBuffer[i+1] = 0.0;
                EmptyImgBuffer[i+2] = 0.0
                EmptyImgBuffer[i+3] = 0.0;
            }
        }
        this.ReadText = await createTexture2DFromBuffer(gGL, ImgBuffer, this.Dimensions[0], this.Dimensions[1], true);
        this.HoldText = await createTexture2DFromBuffer(gGL, ImgBuffer, this.Dimensions[0], this.Dimensions[1], true);
        this.WriteText = await createTexture2DFromBuffer(gGL, ImgBuffer, this.Dimensions[0], this.Dimensions[1], true);
        this.DivergeText = await createTexture2DFromBuffer(gGL, EmptyImgBuffer, this.Dimensions[0], this.Dimensions[1], true); 
        this.PressureText = await createTexture2DFromBuffer(gGL, EmptyImgBuffer, this.Dimensions[0], this.Dimensions[1], true); 
    }
    UpdateIter()
    {
        if (this.WriteText == null) {console.error("FLUID TEXT IS NULL"); return;}
        this.ScreenQuad.PrevTexture = this.WriteText; //Past text after swap
    }
    async UpdateText()
    {
    
        this.ScreenQuad.Texture = this.ReadText; // Current
        this.ScreenQuad.PrevTexture = this.WriteText; //Past text after swap
    }
    SwapText()
    {
        let temp = this.ReadText;
        this.ReadText = this.WriteText;
        this.WriteText = temp;
    }
    SwapText2(a, b)
    {
        return [b,a];
    }
}