import { createTexture2DFromBuffer, mergeTwoBuffers, loadTexture, loadImageToDataArray} from './ShaderFunc.js';
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
        this.DoubleText = null;
        this.LastDispGuess = null;
        this.LastPressGuess = null;
        this.IterNum = IterNum;
    }
    async SetUpText()
    {
        console.log(this.Dimensions);
        let ImgBuffer = new Float32Array(this.Dimensions[0] * this.Dimensions[1] * 4);
        let EmptyImgBuffer = new Float32Array(this.Dimensions[0] * this.Dimensions[1] * 4);
        let NoiseBuffer = CreateWorley2D(20, this.Dimensions[0]); //breaks if dimensions x != y
        let NoiseBuffer2 = CreateWorley2D(10, this.Dimensions[0]); //breaks if dimensions x != y
        let DoubleEmptyBuffer = new Float32Array(this.Dimensions[0] * 2 * this.Dimensions[1] * 4);
        let ColAndNoise = new Float32Array(this.Dimensions[0] * 2 * this.Dimensions[1] * 4);

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
        let DirCol = './Textures/GlassNoiseNorm.png';  
        let ImageObj = await loadImageToDataArray(DirCol, 0, 0, this.Dimensions[0], this.Dimensions[1]);
        let ColAr = ImageObj.data;

        let BuffAChNum = 4;
        let BuffBChNum = 4;
        ColAndNoise = mergeTwoBuffers(ImgBuffer, ColAr, this.Dimensions[0], this.Dimensions[1], BuffAChNum, BuffBChNum); //Converts all to 4 channel rgba
        //Merge Function setup currently for when both buffers are same size
        this.ReadText = await createTexture2DFromBuffer(gGL, ColAndNoise, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.HoldText = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.WriteText = await createTexture2DFromBuffer(gGL, ColAndNoise, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.DivergeText = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true); 
        this.PressureText = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true); 
        this.ColorText = await loadTexture(gGL, DirCol, 4);
        this.DoubleText = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.LastDispGuess = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.LastPressGuess = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
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
/*Next Steps, 
Work for tomorrow. Shouldnt be too crazy hopefully. If anythings confusing
Set up more steps. No one can defeat me when I have a 500 step plan.
Okay bye and Goodmorning

Change of plan, no splitting. Render everything into write buffers that are 2x length 
and split for logic in each shader
-Merge Image Buffer function that sets buffers side by side Row A(0), Row B(0), Row A(1), Row (B1) ect... √
-Apply fluid shader logic to color texture
    -Disp maybe simple averaging but I think nothing for now
    -Border Leave alone. We'll crop out the border on final render
    -Advect swap pixel vaalues with the same logic as advect for density and velo
    -UnDiverge No change
        -Find Divergence
        -Solve Pressure
        -Apply Correction (Render these three normally. 
            Everything should be set up so no change is needed)
    -Final Render - Render Color multiplied by density. Crop out edge pixels
    -Mouse Apply no changes
    (for ones with no change, still need to do uv.x * 2.0 to target left or (uv.x * 2.0) - 1.0 to target right)


FIX THIS
-Rename Quad Variables to be more vague for multipurpose
-Should we remove unused textures? 
-Also Lowkey we can move shader loading to a different script for org
-Please swap textures to webp for load times
*/