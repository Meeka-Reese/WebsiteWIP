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
        this.BorderObjText = null;
        this.DoubleText = null;
        this.LastDispGuess = null;
        this.LastPressGuess = null;
        this.ModelRendText = null;
        this.IterNum = IterNum;
    }
    async SetUpText(CanvasWidth, CanvasHeight)
    {
        console.log(this.Dimensions);
        let ImgBuffer = new Float32Array(this.Dimensions[0] * this.Dimensions[1] * 4);
        let EmptyImgBuffer = new Float32Array(this.Dimensions[0] * this.Dimensions[1] * 4);
        let NoiseBuffer = CreateWorley2D(20, this.Dimensions[0]); //breaks if dimensions x != y
        let NoiseBuffer2 = CreateWorley2D(10, this.Dimensions[0]); //breaks if dimensions x != y
        let DoubleEmptyBuffer = new Float32Array(this.Dimensions[0] * 2 * this.Dimensions[1] * 4);
        let EmptyModelTextBuff = new Float32Array(CanvasWidth * CanvasHeight * 4);

        for (let h = 0; h < this.Dimensions[1]; h++)
        {
            
            for (let w = 0; w < this.Dimensions[0]; w++)
            {
                let i = (w + (h * this.Dimensions[0])) * 4;
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
        // let ImageObj = await loadImageToDataArray(DirCol, 0, 0, this.Dimensions[0], this.Dimensions[1]);
        // let ColAr = ImageObj.data;

        // let BuffAChNum = 4;
        // let BuffBChNum = 4;
       // ColAndNoise = mergeTwoBuffers(ImgBuffer, ColAr, this.Dimensions[0], this.Dimensions[1], BuffAChNum, BuffBChNum); //Converts all to 4 channel rgba
        //Merge Function setup currently for when both buffers are same size
        this.ReadText = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.HoldText = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.WriteText = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.DivergeText = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true); 
        this.PressureText = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true); 
        this.ColorText = await loadTexture(gGL, DirCol, 4);
        this.DoubleText = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.LastDispGuess = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.LastPressGuess = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.ModelRendText = await createTexture2DFromBuffer(gGL, EmptyModelTextBuff, CanvasWidth, CanvasHeight, true);
        this.BorderObjText = await createTexture2DFromBuffer(gGL, EmptyModelTextBuff, CanvasWidth, CanvasHeight, true);
    }
    async RescaleCanvas(CanvasWidth, CanvasHeight, Quality)
    {
        let DirCol = './Textures/GlassNoiseNorm.png';  
        //this.Dimensions = [Math.floor(CanvasWidth * Quality), Math.floor(CanvasHeight * Quality)];//broken
        let DoubleEmptyBuffer = new Float32Array(this.Dimensions[0] * 2 * this.Dimensions[1] * 4);
        let EmptyModelTextBuff = new Float32Array(CanvasWidth * CanvasHeight * 4);
        this.WriteText = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.DivergeText = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true); 
        this.PressureText = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true); 
        this.ColorText = await loadTexture(gGL, DirCol, 4);
        this.DoubleText = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.LastDispGuess = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.LastPressGuess = await createTexture2DFromBuffer(gGL, DoubleEmptyBuffer, this.Dimensions[0] * 2.0, this.Dimensions[1], true);
        this.ModelRendText = await createTexture2DFromBuffer(gGL, EmptyModelTextBuff, CanvasWidth, CanvasHeight, true);
        this.BorderObjText = await createTexture2DFromBuffer(gGL, EmptyModelTextBuff, CanvasWidth, CanvasHeight, true);
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
