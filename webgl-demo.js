/*
Create FBO for Raycast with Object ID. Have definition of all raycast 
objects and make the rendered texture value be the index of the object
*/
//=======================SHADERS=============================
let gVertSourceDef, gVertSkybox, gVertStar, gVertRaycast, gVertTrans;

let gFragSourceWave, gFragSourceFlat, gFragSourceCloud, gFragSkybox, gFragStar, gFragColor,
gFragVolGlow, gFragDef, gFragRaycast, gFragGlass, gFragScreenFlat, gFragTransFlat;

let gShaderProgramDef, gShaderProgramWave, gShaderProgramFlat, gShaderProgramCloud,
gShaderProgramSkybox, gShaderProgramStar, gShaderProgramColor, gShaderProgramVolGlow,
gShaderProgramRaycast, gShaderProgramGlass, gShaderProgramScreenRender, gShaderProgramScreenImage,
gShaderProgramTrans;

let gProgramInfoDef = {};
let gProgramInfoWave = {};
let gProgramInfoFlat = {};
let gProgramInfoCloud = {};
let gProgramInfoSkybox = {};
let gProgramInfoStar = {};
let gProgramInfoColor = {};
let gProgramInfoVolGlow = {};
let gProgramInfoRaycast = {};
let gProgramInfoGlass = {};
let gProgramInfoScreenRender = {};
let gProgramInfoScreenImage = {};
let gProgramInfoTrans = {};



//Depth
let gDepthFBO;
let gDepthMap;
let gMainDepthMap;
let gGlassDepthMap;

//Raycast
let gRaycastFBO;
let gRaycastColecMain = [];
let gRaycastColecTransform = [];
let gMainRaycastFuncs = new Map();
let gTransRaycastFuncs = new Map();
let gRaycastMap;
let gRaycastIndex;
let gRaycastText; // storing in different var to avoid editing binded buff
let gCurrentMousePos = [0,0];
let gMouseMoved = false;

//Transparency and glass and stuff
let gMainFBO;
let gGlassFBO;
let gGlassRendText;
let gRenderText;
let gTexForTransp;


//Imported functions
import { Move,Rotate,Scale } from './translations.js';
import { Normalize,ToRadian,sleep } from './Utils.js';
import { CameraMove, MouseLook, GetViewMatrix } from './Camera.js';
import { SinPreComp,CosPreComp,TanPreComp,ArcSinPreComp,ArcCosPreComp } from './PreCompWave.js';
import { createNoise3D } from './Externals/simplex-noise.js';
import { SetProgramInfo,loadTexture,setPositionAttribute,createTexture2DFromBuffer,
  createTexture3DFromBuffer,genFBO,genDepthMap,genEmptyTex,ClearFBO } from './ShaderFunc.js';
import { mat4,vec2,vec3,vec4,quat } from './Externals/esm/index.js';
import { GenerateWave,CalculateNormals,GenerateQuad,SphereOfQuad,StarLookAt } from './GenerateMesh.js';
import { CreateWorley3D } from './GenerateNoise.js';


//=======================GLOBALS=============================
//Scene
let gActiveMainLoop;
let gCamera;
let gLight1, gLight2, gLight3;
let gSimpleWave;
let gBoatMesh;
let gSkybox;
let gNoiseCube;
let gStars;
let gCloudShimmer;
let gMoon;
let gSpellCircle;
let gSpellCircleVolume;
let gSpellCircleOutline;
let gCircleMask;
let gRockWall;
let gGlassSphere;
let gCharHead, gCharHair;
let gScreenSpaceQuad;
let gCrossHair;
let gOpt1, gOpt2, gOpt3; //set up raytracing Options

//Transformation Scene
let gCharTrans, gCharHairTrans;
let gRCDict = new Map();

//
let gPreviousTime;
let gDeltaTime;
let gTimeSinceRun;
let gTimeStart;
let gTime = new Date();
let gGL;
let gCanvas;
let gCycleNum = 0;
let gBoatWaveIndices = [0,0,0,0];
let gBoatRangeIndices = [0,0,0,0];
let gFrameCount = 0;

//Precomps
let WAVE_BUFFER_SIZE = 4096;
let FloatBitSize = 4; //4 because 32 bit rn
let gSinPreCompBuf = new ArrayBuffer(WAVE_BUFFER_SIZE*FloatBitSize);
let gCosPreCompBuf = new ArrayBuffer(WAVE_BUFFER_SIZE*FloatBitSize);
let gTanPreCompBuf = new ArrayBuffer(WAVE_BUFFER_SIZE*FloatBitSize);
let gArcSinPreCompBuf = new ArrayBuffer(WAVE_BUFFER_SIZE*FloatBitSize);
let gArcCosPreCompBuf = new ArrayBuffer(WAVE_BUFFER_SIZE*FloatBitSize);
let gSinView = new Float32Array(gSinPreCompBuf);
let gCosView = new Float32Array(gCosPreCompBuf);
let gTanView = new Float32Array(gTanPreCompBuf);
let gArcSinView = new Float32Array(gArcSinPreCompBuf);
let gArcCosView = new Float32Array(gArcCosPreCompBuf);
//Noisewaves
let Noise3D = createNoise3D();

//input variables
let gDeltaMouse = [0.0,0.0];
let gPreviousMouse;
let gMousePosInit = false;
let gKeysPressed = {};

//CanvasData
let gCanvasWidth;
let gCanvasHeight;




//-----------------------GLOBALS-----------------------------

function makeStruct(keys) {
    if (!keys) return null;
    const k = keys.split(', ');
    const count = k.length;
  
    /** @constructor */
    function constructor() {
      for (let i = 0; i < count; i++) this[k[i]] = arguments[i];
    }
    return constructor;
  }
async function loadShaderFiles(ShaderText, Path)
{
  const ShaderFile = await fetch(Path);
  if (!ShaderFile.ok) throw new Error("Shader File Error Load");
  ShaderText = ShaderFile.text();
  return ShaderText;
}
function initShader(vSource, fSource)
{
    const vertexShader = loadShader(gGL.VERTEX_SHADER, vSource);
    const fragmentShader = loadShader(gGL.FRAGMENT_SHADER, fSource);

    const shaderProgram = gGL.createProgram();
    gGL.attachShader(shaderProgram, vertexShader);
    gGL.attachShader(shaderProgram, fragmentShader);
    gGL.linkProgram(shaderProgram);
    if (!gGL.getProgramParameter(shaderProgram, gGL.LINK_STATUS)) {
        console.error(gGL.getProgramInfoLog(shaderProgram));
    }

    if (!gGL.getProgramParameter(shaderProgram, gGL.LINK_STATUS)) {
        alert(
          `Unable to initialize the shader program: ${gGL.getProgramInfoLog(
            shaderProgram,
          )}`,
        );
        return null;
      }
    
      return shaderProgram;
    
}

async function SetUpScene()
{
  //== Main Scene ==

   //Gen Noise
   gNoiseCube = await LoadOBJ('./models/Cube.obj');
   let ImgSize = 8;
   let ImgBufNoise = await CreateWorley3D(4, ImgSize);
   let Noise3D = await createTexture3DFromBuffer(gGL, ImgBufNoise, ImgSize, ImgSize, ImgSize);
   gNoiseCube.Texture3D = Noise3D;
   gNoiseCube.Texture = await loadTexture(gGL, './Textures/CloudDetailNoise.png',4);
   gNoiseCube.TextureBN = await loadTexture(gGL, './Textures/BlueNoise.png',4);

  gBoatMesh = await LoadOBJ('./models/SailBoat.obj');
  gBoatMesh.Texture = await loadTexture(gGL, './Textures/SailBoat.png',4);

  gMoon = await LoadOBJ('./models/Sphere.obj');
  gMoon.Texture = await loadTexture(gGL, './Textures/Moon.png',4);

  gSpellCircle = await LoadOBJ('./models/SpellCircle.obj');
  gSpellCircle.Color = [0.5,.8,1.0,.3];

  gSpellCircleVolume = await LoadOBJ('./models/SpellCircleVolume.obj');
  gSpellCircleVolume.Texture = await loadTexture(gGL, './Textures/CloudDetailNoise.png',4);

  gSpellCircleOutline = await LoadOBJ('./models/SpellCircle.obj');

  gCircleMask = await LoadOBJ('./models/MaskCircle.obj');
  gCircleMask.Color = [1.0,1.0,1.0,0.0];

  gOpt1 = await LoadOBJ('./models/Arrow.obj');

  gCharHead = await LoadOBJ('./models/CharHead.obj');
  gCharHead.Texture = await loadTexture(gGL, './Textures/Girl.png',4);

 gCharHair = await LoadOBJ('./models/CharHair.obj');
 gCharHair.Texture = await loadTexture(gGL, './Textures/Girl.png',4);


  gGlassSphere = await LoadOBJ('./models/Cube.obj'); // used for volume of raymarch sphere
  gGlassSphere.Normal = await loadTexture(gGL, './Textures/GlassNoiseNorm.png',4);
  gGlassSphere.Displacement = await loadTexture(gGL, './Textures/GlassDisplacement.png',4);

  gCrossHair.Texture = await loadTexture(gGL,'./Textures/crosshair.png',4);

  //== Transform Scene ==
  
  gCharTrans = await LoadOBJ('./models/CharFullBodyUp.obj');
  gCharTrans.Texture = await loadTexture(gGL, './Textures/GirlTextureFull.png',4);
  gCharTrans.Texture3D = Noise3D;

  gCharHairTrans = await LoadOBJ('./models/CharHairTrans.obj');
  gCharHairTrans.Texture = await loadTexture(gGL, './Textures/Girl.png',4);
  gCharHairTrans.Texture3D = Noise3D;

   //==========================SET PARENTING======================================
   //== Main Scene ==
  gCharHead.ParentTrans = gGlassSphere;
    gCharHair.ParentTrans = gCharHead;
  //== Transform Scene ==
  gCharHairTrans.ParentTrans = gCharTrans;
  gCharHairTrans.ParentScale = gCharTrans;
  //==========================SET POSITION======================================
  //== Main Scene ==
  gBoatMesh.Scale = [2.0, 2.0, 2.0];
  gBoatMesh.Rotation = [0.0,0.0,0.0];
  gBoatMesh.Position = [45.0,0.0,35.0];
  gMoon.Position = [10,40,10];
  gMoon.Scale = [1.25,1.25,1.25];
  gMoon.Rotation = [0.0,0.0,0.0];
  gSimpleWave.Position = [0.0,0.0,0.0];
  gSimpleWave.Scale = [1.0,1.0,1.0];
  gNoiseCube.Rotation = [0.0,0.0,0.0];
  gNoiseCube.Position = [50.0,20.0,40.0];
  gNoiseCube.Scale = [70.0,70.0,70.0];
  gStars.Position = [0.0,0.0,0.0];
  gStars.Scale = [1.0,1.0,1.0];
  gStars.Rotation = [0.0,0.0,0.0];
  gSpellCircle.Position = [45.0,1.0,30.0];
  gSpellCircle.Rotation = [90.0,0.0,0.0];
  let SpellCircScale = 45.0;
  gSpellCircle.Scale = [SpellCircScale,SpellCircScale,SpellCircScale];
  gSpellCircle.Color = [.5,.5,.5,1.0];
  gSpellCircleOutline.Position = [1.2,0.0,0.0];
  gSpellCircleOutline.Rotation = [0.0,0.0,0.0];
  let BordScale = 1.04;
  gSpellCircleOutline.Scale = [.24 * BordScale,.42 * BordScale,1.0];
  gSpellCircleOutline.Color = [0.0,0.0,0.0,1.0];
  gSpellCircleVolume.Scale = [SpellCircScale,SpellCircScale,SpellCircScale/8.0];
  gSpellCircleVolume.Position = [45.0,0.0,30.0];
  gSpellCircleVolume.Rotation = [90.0,0.0,0.0];
  gSpellCircleVolume.Color = [0.247, 0.572, 0.988, 1.0];
  let CircScale = 35.0;
  gCircleMask.Scale = [CircScale,CircScale,CircScale*5.0];
  gCircleMask.Color = [0.0,0.0,0.0,1.0];
  gCircleMask.Position = [45.0,45.0,30.0];
  gCircleMask.Rotation = [90.0,0.0,0.0];
  let optSize = 4.0;
  gOpt1.Position = [45.0,2.0,100.0];
  gOpt1.Rotation = [0.0,90.0,0.0];
  gOpt1.Scale = [optSize,optSize,optSize];
  gOpt1.Color = [.7,.7,.7,1.0];
  let gCharSize = 10.0;
  gCharHead.Position = [0.0,-28.0,1.0];
  gCharHead.Rotation = [0.0,180.0,0.0];
  gCharHead.Scale = [gCharSize,gCharSize,gCharSize];
  gCharHair.Position = [0.0,0.0,0.0];
  gCharHair.Rotation = [0.0,0.0,0.0];
  gCharHair.Scale = [gCharSize,gCharSize,gCharSize];
  
  
  let GSphereSize = 15.0;
  gGlassSphere.Position = [45.0,26.0,110.0];
  gGlassSphere.Scale = [GSphereSize,GSphereSize,GSphereSize];
  gGlassSphere.Rotation = [0.0,0.0,0.0];
  //== Transform Scene ==
  let CharTransScale = 10.0;
  gCharTrans.Position = [0.0,0.0,0.0];
  gCharTrans.Scale = [CharTransScale,CharTransScale,CharTransScale];
  gCharTrans.Rotation = [0.0,180.0,0.0];
  gCharHairTrans.Position = [0.0,0.0,0.0];
  gCharHairTrans.Rotation = [0.0,0.0,0.0];
  gCharHairTrans.Scale = [1.0,1.0,1.0];
    //==========================FILL RAYCAST ARRAY======================================
    //== Main Scene ==
    gRaycastColecMain.push(gOpt1);
    gRCDict.set(gOpt1, gGlassSphere);
    //== Transform Scene ==
}
async function LoadOBJ(path)
{
  const ObjLoad = await fetch(path);
  if(!ObjLoad.ok) throw new Error("Failed to load OBJ");
  let ObjText = await ObjLoad.text();
  let obj = new OBJ.Mesh(ObjText);
  OBJ.initMeshBuffers(gGL, obj);
  return obj;
}
function loadShader(type, source) 
{

    const shader = gGL.createShader(type);
  
    gGL.shaderSource(shader, source);

  
    gGL.compileShader(shader);

  
    if (!gGL.getShaderParameter(shader, gGL.COMPILE_STATUS)) {
      alert(
        `An error occurred compiling the shaders: ${gGL.getShaderInfoLog(shader)}`,
      );
      gGL.deleteShader(shader);
      return null;
    }
  
    return shader;
}



function WaveUpdateMesh(WaveObj)
{ 
    let WaveAmp = [.6,1.2,.4, .2];
    let WaveSize = [3.5,2.6,2.0, 7.6];
    let WaveSpeeds = [1.2,1.35,2.2, 1.4];
    let NoiseDetail = [.3, .2,.3];
    let NoiseAmp = .5;
    let TimeSec = gTime.getTime() * .001;
    const positionBuffer = WaveObj.vertexBuffer;
    let PosOffset = WaveObj.PosOffset;
    let Vert = 0;
    let Positions = WaveObj.PositionsArray;
    let WaveDipAm = 0.5;
    
    
    for (let Cord = 0; Cord < WaveObj.PositionsArray.length; Cord+=3)
    {
        let x = Positions[Cord];
        let y = Positions[Cord+1];  
        let z = Positions[Cord+2];
        
        // Calculate wave position
        Positions[Cord+1] = gCosView[(Math.floor(((TimeSec*WaveSpeeds[0]) + (z*WaveSize[0])/WaveObj.RowNum)*WAVE_BUFFER_SIZE))%WAVE_BUFFER_SIZE]
          * WaveAmp[0] + PosOffset[0]; 

        Positions[Cord+1] += gSinView[(Math.floor((TimeSec*WaveSpeeds[1]) + (z*WaveSize[1])/(WaveObj.ColNum)*WAVE_BUFFER_SIZE))%WAVE_BUFFER_SIZE]
          * WaveAmp[1] + PosOffset[1];

        Positions[Cord+1] += gSinView[(Math.floor(((TimeSec*WaveSpeeds[2]) + ((z+x)*WaveSize[2] * 2.5)/(WaveObj.ColNum))*WAVE_BUFFER_SIZE))%WAVE_BUFFER_SIZE]
          * WaveAmp[2] + PosOffset[1];
        
        Positions[Cord+1] += gSinView[(Math.floor(((TimeSec*WaveSpeeds[3]) + ((z+x+y)*WaveSize[3] * 1.2)/(WaveObj.ColNum))*WAVE_BUFFER_SIZE))%WAVE_BUFFER_SIZE]
          * WaveAmp[3] + PosOffset[1];

        Positions[Cord+1] += Noise3D((Positions[(Vert*3)]+(TimeSec*2.0))*NoiseDetail[0],
        (y+(TimeSec))*NoiseDetail[1],
        (z+(TimeSec))*NoiseDetail[2]) * NoiseAmp;
        
        // Calculate current vertex's grid position
        let currentCol = Vert % WaveObj.ColNum;
        let currentRow = Math.floor(Vert / WaveObj.ColNum);
        // Check if vertex is within boat range
        if (currentCol > gBoatRangeIndices[0] && currentCol < gBoatRangeIndices[1] && 
            currentRow > gBoatRangeIndices[2] && currentRow < gBoatRangeIndices[3])
        {
          Positions[Cord+1] = y >= gBoatMesh.Position[1] ? gBoatMesh.Position[1] - WaveDipAm : y;
        }
        
        Vert++;
    }
    
    gGL.bindBuffer(gGL.ARRAY_BUFFER, positionBuffer);
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(Positions), gGL.STATIC_DRAW);
    WaveObj.vertexBuffer = positionBuffer;
    WaveObj.PositionsArray = Positions;
}
function CalculateBoatRot()
{
  let RotateXAmp = 1.5;
  let RotateZAmp = 10.0;
  let BoatHeightOff = -2.0;
  let Point1 = gSimpleWave.PositionsArray[(gBoatWaveIndices[0]*3)+1];
  let Point2 = gSimpleWave.PositionsArray[(gBoatWaveIndices[1]*3)+1];
  let Point3 = gSimpleWave.PositionsArray[(gBoatWaveIndices[2]*3)+1];
  let Point4 = gSimpleWave.PositionsArray[(gBoatWaveIndices[3]*3)+1];
  gBoatMesh.Position[1] = BoatHeightOff + (Point1 + Point2 + Point3 + Point4) / 4.0;
  gBoatMesh.Rotation[0] =  ((Point2 + Point4) - (Point1 + Point3)) * RotateXAmp;
  gBoatMesh.Rotation[2] =  ((Point3 + Point4) - (Point1 + Point2)) * RotateZAmp;

}
function BoatWaveIndexFind()
{
  let width = 3.4;
  let length = 10;
  let Offset = [-1.2,-2];
  gBoatWaveIndices[0] = FindClosest([-width + Offset[0], length + Offset[1]]);
  gBoatWaveIndices[1] = FindClosest([-width + Offset[0], -length + Offset[1]]);
  gBoatWaveIndices[2] = FindClosest([width + Offset[0], length + Offset[1]]);
  gBoatWaveIndices[3] = FindClosest([width + Offset[0], -length + Offset[1]]);
  // Calculate boat range in grid coordinates (col, row)
  gBoatRangeIndices = [0,0,0,0]; // colMin, colMax, rowMin, rowMax
    
  // Extract col and row from each boat wave index
  let point0Col = gBoatWaveIndices[0] % gSimpleWave.ColNum;
  let point0Row = Math.floor(gBoatWaveIndices[0] / gSimpleWave.ColNum);
  
  let point1Col = gBoatWaveIndices[1] % gSimpleWave.ColNum;
  let point1Row = Math.floor(gBoatWaveIndices[1] / gSimpleWave.ColNum);
  
  let point2Col = gBoatWaveIndices[2] % gSimpleWave.ColNum;
  let point2Row = Math.floor(gBoatWaveIndices[2] / gSimpleWave.ColNum);
  
  let point3Col = gBoatWaveIndices[3] % gSimpleWave.ColNum;
  let point3Row = Math.floor(gBoatWaveIndices[3] / gSimpleWave.ColNum);

  // Find min/max for columns and rows
  gBoatRangeIndices[0] = Math.min(point0Col, point1Col, point2Col, point3Col); // colMin
  gBoatRangeIndices[1] = Math.max(point0Col, point1Col, point2Col, point3Col); // colMax
  gBoatRangeIndices[2] = Math.min(point0Row, point1Row, point2Row, point3Row); // rowMin
  gBoatRangeIndices[3] = Math.max(point0Row, point1Row, point2Row, point3Row); // rowMax
}
function FindClosest(Offset)
{
  let ClosestIndex;
  let CurrentClosestDist = 999999999;
  let LookCord = vec2.fromValues(gBoatMesh.Position[0] + Offset[0], gBoatMesh.Position[2] + Offset[1]); //Top Left of Boat
  for (let i = 0; i < gSimpleWave.VertexCount; i++)
  {
    let x = gSimpleWave.PositionsArray[i * 3];
    let z = gSimpleWave.PositionsArray[(i * 3)+2]
    let Positon = vec2.fromValues(x,z);
    let Distance = vec2.squaredDistance(LookCord, Positon);
    if (Distance < CurrentClosestDist)
    {
      CurrentClosestDist = Distance;
      ClosestIndex = i;
    }
  }
  return ClosestIndex;
}


function SetUpModelMatrix(ModelMatrix, Object)
{
  let RotationMatrix = mat4.create();
  let q = quat.create();
  let ParentMatrix = mat4.create();
  quat.fromEuler(q, Object.Rotation[0], Object.Rotation[1], Object.Rotation[2]);
  mat4.fromQuat(RotationMatrix,q);
  let Pos = vec3.fromValues(Object.Position[0],Object.Position[1],Object.Position[2]);
  let Scale = vec3.fromValues(Object.Scale[0],Object.Scale[1],Object.Scale[2]);
  ModelMatrix = mat4.fromRotationTranslationScale(ModelMatrix, q, Pos, Scale);

  let ParentTrans = Object.ParentTrans;
  let ParentScale = Object.ParentScale;
  while (ParentTrans|| ParentScale)
  {
    q = quat.create();
    if (ParentTrans != null)
    {
      
      quat.fromEuler(q, ParentTrans.Rotation[0], ParentTrans.Rotation[1], ParentTrans.Rotation[2]);
      mat4.fromQuat(RotationMatrix,q);
      Pos = vec3.fromValues(ParentTrans.Position[0], ParentTrans.Position[1],ParentTrans.Position[2]);
    }
    else
    {
      quat.fromEuler(q, 0.0, 0.0, 0.0);
      mat4.fromQuat(RotationMatrix,q);
      Pos = vec3.fromValues(0.0, 0.0,0.0);
    }
    
    if (ParentScale != null)
    {
      Scale = vec3.fromValues(ParentScale.Scale[0],ParentScale.Scale[1],ParentScale.Scale[2]);
    }
    else
    {
      Scale = vec3.fromValues(1.0,1.0,1.0);
    }
    ParentMatrix = mat4.fromRotationTranslationScale(ParentMatrix, q, Pos, Scale);
    ModelMatrix = mat4.multiply(ModelMatrix, ParentMatrix, ModelMatrix);
    ParentTrans = ParentTrans.ParentTrans;
    ParentScale = ParentScale == null ? null : ParentScale.ParentScale;
  }
  
}
function DrawCallSetup()
{
    gGL.clearColor(0.00, 0.00, 0.00, 0.0); 
    gGL.clearDepth(1.0);
    gGL.enable(gGL.DEPTH_TEST); 
    gGL.depthFunc(gGL.LEQUAL); 
    gGL.enable(gGL.CULL_FACE);
    gGL.enable(gGL.BLEND);
    gGL.cullFace(gGL.FRONT);
    gGL.blendFunc(gGL.SRC_ALPHA, gGL.ONE_MINUS_SRC_ALPHA);

      
    gGL.clear(gGL.COLOR_BUFFER_BIT | gGL.DEPTH_BUFFER_BIT);
}
function Draw(programInfo, Object, Camera, Light)
{
      
        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.
      
        const fieldOfView = (45 * Math.PI) / 180; // in radians
        const aspect = gGL.canvas.clientWidth / gGL.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 10000.0;
         // Tell WebGL to use our program when drawing
         gGL.useProgram(programInfo.program);

         
          const projectionMatrix = mat4.create();
        
          // note: glMatrix always has the first argument
          // as the destination to receive the result.
          mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        
          // Set the drawing position to the "identity" point, which is
          // the center of the scene.
          
          let ViewMatrix = mat4.create();
          ViewMatrix = GetViewMatrix(Camera);
          let ModelMatrix = mat4.create();
          SetUpModelMatrix(ModelMatrix, Object);
          
          mat4.translate(
            ViewMatrix, // destination matrix
            ViewMatrix, // matrix to translate
            [0.0,0.0,-6.0],
          ); // amount to translate
        
          // Set the shader uniforms
          gGL.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix,
          );
          gGL.uniformMatrix4fv(
            programInfo.uniformLocations.ViewMatrix,
            false,
            ViewMatrix,
          );
          gGL.uniformMatrix4fv(
            programInfo.uniformLocations.modelMatrix,
            false,
            ModelMatrix,
          );
         
        
          // Tell WebGL how to pull out the positions from the position
         // buffer into the vertexPosition attribute.
         setPositionAttribute(Object, programInfo, Camera, Light, gGL, gTimeSinceRun);
      
        {
          gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, Object.indexBuffer); //This needs to be the last active buffer 
          
          const offset = 0;
          if (!("VertexCount" in Object || "indexBuffer" in Object))
          {
            console.log("No vert number could be found");
            return;
          }
          let vertexCount = "VertexCount" in Object ? Object.VertexCount : Object.indexBuffer.numItems; 
          
          gGL.drawElements(gGL.TRIANGLES, vertexCount, gGL.UNSIGNED_SHORT, offset);
        }
      
}
function getMousePixel(event) {
  const rect = gGL.canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio;

  const cssX = event.clientX - rect.left;
  const cssY = event.clientY - rect.top;

  const pixelX = Math.floor(cssX * dpr);
  const pixelY = Math.floor((rect.height - cssY) * dpr - 1);

  return [pixelX, pixelY];
}

function CalcMouseDelta(event)
{

  if (document.pointerLockElement === gCanvas) {
    
    gDeltaMouse = [
      event.movementX || event.mozMovementX || 0, 
      event.movementY || event.mozMovementY || 0
    ];
    gCurrentMousePos = [gCanvasWidth / 2.0, gCanvasHeight / 2.0];
  } else {
    
    let CurrentPos = [event.pageX, event.pageY];
    gCurrentMousePos = getMousePixel(event);
    
    if (!gMousePosInit) {
      gPreviousMouse = CurrentPos;
      gMousePosInit = true;
      gDeltaMouse = [0, 0]; // Prevent jump on first movement
      return; 
    }
    
    gDeltaMouse = [CurrentPos[0] - gPreviousMouse[0], CurrentPos[1] - gPreviousMouse[1]];

    gPreviousMouse = CurrentPos;
  }
  
}
function Input()
{
    //Forward = 0
    //Backwards = 1
    //Left = 2
    //Right = 3 const Camera = makeStruct("Eye, ViewDir, UpDir");
    let Direction = -1;
    if (gKeysPressed['w']){Direction = 0; CameraMove(gCamera, Direction, gDeltaTime);}
    if (gKeysPressed['s']){Direction = 1; CameraMove(gCamera, Direction, gDeltaTime);}
    if (gKeysPressed['a']){Direction = 2; CameraMove(gCamera, Direction, gDeltaTime);}
    if (gKeysPressed['d']){Direction = 3; CameraMove(gCamera, Direction, gDeltaTime);}
}
function CheckRaycast(SelectColor, DeselectColor)
{
  let MousePos = [gCurrentMousePos[0], gCurrentMousePos[1]]; //flip y to turn from mouse to screen space
  //console.log("x " + MousePos[0] + "y " + MousePos[1]);
  const MousePixel = new Uint8Array(4); // Read single pixel
  gGL.bindFramebuffer(gGL.FRAMEBUFFER, gRaycastFBO);
  gGL.readPixels(
    MousePos[0], MousePos[1],  // pixel coordinates
      1, 1,            // 1x1 pixel
      gGL.RGBA,
      gGL.UNSIGNED_BYTE,
      MousePixel
  );
 
  let ObjIndex = (MousePixel[0] - 1); // -1 for indexing against array
  gRaycastIndex = ObjIndex;
  for (let Obj of gRaycastColecMain)//reset all to deselect color
  {
    Obj.Color = DeselectColor;
    let DispObj = gRCDict.get(Obj);
    if (DispObj != null && "isHover" in DispObj){DispObj.isHover = 0.0;}
  }
  if (ObjIndex == -1) {return null;}

  let ObjSelec = gRaycastColecMain[ObjIndex];
  ObjSelec.Color = SelectColor;
  let DispObj = gRCDict.get(ObjSelec);
  if (DispObj != null && "isHover" in DispObj){DispObj.isHover = 1.0;}

}
function RaycastClick(Obj)
{
  switch(Obj){
    case gOpt1:
      gActiveMainLoop = TransformationLoop;
      break;
    default:
      break;
  }
}
function ClickFunc(event)
{
  console.log("Raycast Index is : " + gRaycastIndex);
  //== Request Pointer Lock ==
  console.log("Click detected, requesting pointer lock...");
  
  gCanvas.requestPointerLock = gCanvas.requestPointerLock ||
                              gCanvas.mozRequestPointerLock ||
                              gCanvas.webkitRequestPointerLock;
  
  if(document.activeElement == document.getElementById("Body"))
  {
    if (gCanvas.requestPointerLock) {
      gCanvas.requestPointerLock();
    } else {
      console.error("Pointer Lock API not supported");
    }
  }
  else
  {
    console.log(document.activeElement.id)
  }


document.addEventListener('pointerlockerror', () => {
  console.error("Pointer lock error!");
}, false);

  //== Raycast Check ==
  if (gRaycastIndex != -1)
  {
    console.log("Raycast hit with index : " 
    + gRaycastIndex);
    let rcObj;
    switch (gActiveMainLoop)
    {
      case MainLoop:
        gCamera.Eye = [0.0,0.0,0.0];
        gCamera.ViewDir = [0.0,0.0,1.0];
        rcObj = gRaycastColecMain[gRaycastIndex];
        break;
      case TransformationLoop:
        gCamera.Eye = [0.0,0.0,0.0];
        gCamera.ViewDir = [0.0,0.0,1.0];
        rcObj = gRaycastColecTransform[gRaycastIndex];
        break;
    }
    if (rcObj != null) {RaycastClick(rcObj);}
  }

}


async function FrameCount()
{
  while(true)
  {
    await sleep(1000);
    console.log("Frame : " + gFrameCount);
    gFrameCount = 0;
  }
}
const MainLoop = ()=>
{
    gTime = new Date();
    let newTime = gTime.getTime();
    gDeltaTime = newTime- gPreviousTime;
    gTimeSinceRun = newTime - gTimeStart;
    gPreviousTime = newTime;

    Input();
    MouseLook(gCamera, gDeltaMouse);
    if (gFrameCount % 2 == 0)
    {
      WaveUpdateMesh(gSimpleWave);
      CalculateNormals(gSimpleWave, gGL);
      CalculateBoatRot();
    }
    
      //Animation
      gSpellCircle.Rotation[1] += gDeltaTime * .002; //Spell Volume Rotate
      gSpellCircleVolume.Rotation[1] = gSpellCircle.Rotation[1];
      gSpellCircleVolume.Scale[2] = 1.0 + (4.0 * Math.sin(gTime/800.0));//Spell Volume pulse



      //======================RENDER RAYCAST============================
      ClearFBO(null, gGL);
      ClearFBO(gMainFBO, gGL);
      ClearFBO(gRaycastFBO, gGL);
      ClearFBO(gGlassFBO, gGL);

      gGL.bindFramebuffer(gGL.FRAMEBUFFER, gRaycastFBO);
      gGL.viewport(0, 0, gCanvasWidth, gCanvasHeight);
      gGL.enable(gGL.DEPTH_TEST);
      gGL.enable(gGL.CULL_FACE);
      let SelectColor = [1.0,1.0,1.0,1.0];
      let DeselectColor = [.2,.2,.2,1.0];
      let ObjIndex = 1; //start indexing at 1
      for(let obj of gRaycastColecMain)
      {
        gCamera.ObjectIndex = ObjIndex;
        Draw(gProgramInfoRaycast,obj,gCamera,gLight1); 
        ObjIndex++;
      }
      gRaycastText = gRaycastMap;
      gMouseMoved = Math.abs(gDeltaMouse[0]) + Math.abs(gDeltaMouse[1]) >= .001 ? true : false;
      if (gMouseMoved) {CheckRaycast(SelectColor, DeselectColor); console.log("MouseMove");}
      gDeltaMouse = [0.0,0.0];

      

      //======================RENDER DEPTH============================
      gGL.bindFramebuffer(gGL.FRAMEBUFFER, gDepthFBO);  
      gGL.viewport(0, 0, gCanvasWidth, gCanvasHeight);
      gGL.enable(gGL.DEPTH_TEST);    
      gGL.clear(gGL.DEPTH_BUFFER_BIT); 
      gGL.disable(gGL.CULL_FACE);

      Draw(gProgramInfoFlat, gBoatMesh, gCamera, gLight1);
      Draw(gProgramInfoFlat, gMoon, gCamera, gLight1);
      gGL.bindFramebuffer(gGL.FRAMEBUFFER, gMainFBO);  
      gNoiseCube.DepthTexture = gDepthMap;
      gStars.DepthTexture = gDepthMap;
      gSkybox.DepthTexture = gDepthMap;
      gSpellCircleVolume.DepthTexture = gDepthMap;
      gSpellCircle.DepthTexture = gDepthMap;
  
    //
    DrawCallSetup();

    //======================RENDER NORMALPASS============================
    
    gGL.disable(gGL.CULL_FACE);
    gGL.disable(gGL.DEPTH_TEST); 
    gGL.depthMask(false);
    Draw(gProgramInfoSkybox,gSkybox,gCamera,gLight1); 
    gGL.enable(gGL.DEPTH_TEST); 
    gGL.depthMask(true);
    Draw(gProgramInfoDef, gCircleMask, gCamera, gLight1);  
    Draw(gProgramInfoWave, gSimpleWave, gCamera, gLight1);
    gGL.enable(gGL.CULL_FACE);
    
    Draw(gProgramInfoFlat, gBoatMesh, gCamera, gLight1);
    gGL.depthMask(false);
    gGL.disable(gGL.DEPTH_TEST); 
    Draw(gProgramInfoWave,gSpellCircle, gCamera, gLight1);
    gGL.disable(gGL.CULL_FACE);
    Draw(gProgramInfoVolGlow,gSpellCircleVolume, gCamera, gLight1);
    gGL.depthMask(true);
    gGL.enable(gGL.DEPTH_TEST); 
    Draw(gProgramInfoDef, gOpt1, gCamera,gLight1);
    gGL.enable(gGL.CULL_FACE);
    Draw(gProgramInfoFlat, gMoon, gCamera, gLight1);
    
    
    StarLookAt(gGL, gStars, gCamera);
    Draw(gProgramInfoStar, gStars, gCamera, gLight1);
    gGL.depthMask(false);
    gGL.disable(gGL.DEPTH_TEST); 
    Draw(gProgramInfoCloud, gNoiseCube, gCamera, gLight1);
    gGL.enable(gGL.DEPTH_TEST);
    gGL.depthMask(true);
    

    gScreenSpaceQuad.Texture = gRenderText;
    gGlassSphere.Texture = gRenderText;
    gGL.bindFramebuffer(gGL.FRAMEBUFFER, gGlassFBO); 
    gGL.viewport(0, 0, gCanvasWidth, gCanvasHeight);
    gGL.disable(gGL.CULL_FACE);
    gGL.disable(gGL.DEPTH_TEST);
    Draw(gProgramInfoScreenRender, gScreenSpaceQuad, gCamera, gLight1);
    gGL.enable(gGL.CULL_FACE);
    Draw(gProgramInfoGlass, gGlassSphere, gCamera, gLight3);
    gGL.cullFace(gGL.BACK);
    gGL.enable(gGL.DEPTH_TEST);
    Draw(gProgramInfoFlat, gCharHead, gCamera, gLight1);
    Draw(gProgramInfoFlat, gCharHair, gCamera, gLight1);
    gGL.disable(gGL.DEPTH_TEST);
    gScreenSpaceQuad.Texture = gGlassRendText;
    gGL.bindFramebuffer(gGL.FRAMEBUFFER, null); 
    gGL.disable(gGL.CULL_FACE);
    Draw(gProgramInfoScreenRender, gScreenSpaceQuad, gCamera, gLight1);
    Draw(gProgramInfoScreenImage, gCrossHair, gCamera, gLight1);
    
  

    gFrameCount++;
    gCycleNum++;
    requestAnimationFrame(gActiveMainLoop);
}
const TransformationLoop = ()=>
{
  gTime = new Date();
  let newTime = gTime.getTime();
  gDeltaTime = newTime- gPreviousTime;
  gTimeSinceRun = newTime - gTimeStart;
  gPreviousTime = newTime;

  Input();
  MouseLook(gCamera, gDeltaMouse);
  if (gFrameCount % 2 == 0)
  {
    WaveUpdateMesh(gSimpleWave);
    CalculateNormals(gSimpleWave, gGL);
    CalculateBoatRot();
  }
  //Animation

  //======================RENDER RAYCAST============================
  ClearFBO(null, gGL);
  ClearFBO(gMainFBO, gGL);
  ClearFBO(gRaycastFBO, gGL);
  ClearFBO(gGlassFBO, gGL);

  gGL.bindFramebuffer(gGL.FRAMEBUFFER, gRaycastFBO);
  gGL.viewport(0, 0, gCanvasWidth, gCanvasHeight);
  gGL.enable(gGL.DEPTH_TEST);
  gGL.enable(gGL.CULL_FACE);
  let SelectColor = [1.0,1.0,1.0,1.0];
  let DeselectColor = [.2,.2,.2,1.0];
  let ObjIndex = 1; //start indexing at 1
  for(let obj of gRaycastColecTransform)
  {
    gCamera.ObjectIndex = ObjIndex;
    Draw(gProgramInfoRaycast,obj,gCamera,gLight1); 
    ObjIndex++;
  }
  gRaycastText = gRaycastMap;
  gMouseMoved = Math.abs(gDeltaMouse[0]) + Math.abs(gDeltaMouse[1]) >= .001 ? true : false;
  if (gMouseMoved) {CheckRaycast(SelectColor, DeselectColor); console.log("MouseMove");}
  gDeltaMouse = [0.0,0.0];

  

  //======================RENDER DEPTH============================
  gGL.bindFramebuffer(gGL.FRAMEBUFFER, gDepthFBO);  
  gGL.viewport(0, 0, gCanvasWidth, gCanvasHeight);
  gGL.enable(gGL.DEPTH_TEST);    
  gGL.clear(gGL.DEPTH_BUFFER_BIT); 
  gGL.disable(gGL.CULL_FACE); 

  //Render models for depth pass
  gGL.bindFramebuffer(gGL.FRAMEBUFFER, gMainFBO);  
  //Set depth texture

//
DrawCallSetup();

//======================RENDER NORMALPASS============================
gGL.bindFramebuffer(gGL.FRAMEBUFFER, null);
gGL.cullFace(gGL.BACK);
Draw(gProgramInfoTrans, gCharTrans, gCamera, gLight1);
Draw(gProgramInfoTrans, gCharHairTrans, gCamera, gLight1);



gFrameCount++;
gCycleNum++;
requestAnimationFrame(gActiveMainLoop);
}

function ResizeCanvas(gl, canvas)
{
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
  console.log("Resizing");
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gCanvasWidth = canvas.width;
    gCanvasHeight = canvas.height;
    if (gCamera != null) //Fails during init cause gcamera not set yet
    {
      gCamera.Width = gCanvasWidth;
      gCamera.Height = gCanvasHeight;
    }
  }
}
main();

async function main() {
  const canvas = document.querySelector("#gl-canvas");
  // Initialize the GL context
  gGL = canvas.getContext("webgl2",
  {
    alpha: true
  });
  ResizeCanvas(gGL, canvas);
  window.addEventListener('resize', () => ResizeCanvas(gGL, canvas));
  gCanvas = document.querySelector("#gl-canvas");

  // Only continue if WebGL is available and working
  if (gGL === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it.",
    );
    return;
  }

  // Set clear color to black, fully opaque
  gGL.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gGL.clear(gGL.COLOR_BUFFER_BIT);

  //Load glsl file text content
  //Vert
  gVertSourceDef = await loadShaderFiles(gVertSourceDef, './Shaders/DefaultVert.glsl');
  gVertSkybox = await loadShaderFiles(gVertSkybox, './Shaders/SkyboxVert.glsl');
  gVertStar = await loadShaderFiles(gVertStar, './Shaders/StarVert.glsl');
  gVertRaycast = await loadShaderFiles(gVertRaycast, './Shaders/RaycastVert.glsl');
  gVertTrans = await loadShaderFiles(gVertTrans, './Shaders/TransVert.glsl');
  //Frag
  gFragSourceWave = await loadShaderFiles(gFragSourceWave, './Shaders/WaveFrag.glsl');
  gFragSourceFlat = await loadShaderFiles(gFragSourceFlat, './Shaders/FlatFrag.glsl');
  gFragSourceCloud = await loadShaderFiles(gFragSourceCloud, './Shaders/CloudFrag.glsl');
  gFragSkybox = await loadShaderFiles(gFragSkybox, './Shaders/SkyboxFrag.glsl');
  gFragStar = await loadShaderFiles(gFragStar, './Shaders/StarFrag.glsl');
  gFragColor = await loadShaderFiles(gFragColor, './Shaders/ColorFrag.glsl');
  gFragVolGlow = await loadShaderFiles(gFragVolGlow, './Shaders/VolumeGlowFrag.glsl');
  gFragDef = await loadShaderFiles(gFragDef, './Shaders/DefaultFrag.glsl');
  gFragRaycast = await loadShaderFiles(gFragRaycast, './Shaders/RaycastFrag.glsl');
  gFragGlass = await loadShaderFiles(gFragGlass, './Shaders/GlassFrag.glsl');
  gFragScreenFlat = await loadShaderFiles(gFragScreenFlat, './Shaders/ScreenFlatFrag.glsl');
  gFragTransFlat = await loadShaderFiles(gFragTransFlat,'./Shaders/TransFlatFrag.glsl');

  gShaderProgramWave = initShader(gVertSourceDef,gFragSourceWave);
  gShaderProgramFlat = initShader(gVertSourceDef,gFragSourceFlat);
  gShaderProgramCloud = initShader(gVertSourceDef,gFragSourceCloud);
  gShaderProgramSkybox = initShader(gVertSkybox,gFragSkybox);
  gShaderProgramColor = initShader(gVertSkybox, gFragColor);
  gShaderProgramStar = initShader(gVertStar, gFragStar);
  gShaderProgramVolGlow = initShader(gVertSourceDef, gFragVolGlow);
  gShaderProgramDef = initShader(gVertSourceDef, gFragDef);
  gShaderProgramRaycast = initShader(gVertRaycast, gFragRaycast);
  gShaderProgramGlass = initShader(gVertSourceDef, gFragGlass);
  gShaderProgramScreenRender = initShader(gVertSkybox, gFragScreenFlat);
  gShaderProgramScreenImage = initShader(gVertSkybox, gFragSourceFlat);
  gShaderProgramTrans = initShader(gVertTrans, gFragTransFlat);
  


  SetProgramInfo(gGL, 
    gProgramInfoWave, gShaderProgramWave,
     gProgramInfoFlat, gShaderProgramFlat, 
     gProgramInfoCloud, gShaderProgramCloud,
     gProgramInfoSkybox, gShaderProgramSkybox,
     gProgramInfoStar, gShaderProgramStar,
     gProgramInfoColor, gShaderProgramColor,
     gProgramInfoVolGlow, gShaderProgramVolGlow,
     gProgramInfoDef, gShaderProgramDef,
     gProgramInfoRaycast, gShaderProgramRaycast,
     gProgramInfoGlass, gShaderProgramGlass,
     gProgramInfoScreenRender, gShaderProgramScreenRender,
     gProgramInfoScreenImage, gShaderProgramScreenImage,
     gProgramInfoTrans, gShaderProgramTrans,
     );
  
    SinPreComp(gSinView,WAVE_BUFFER_SIZE);
    CosPreComp(gCosView,WAVE_BUFFER_SIZE);
    TanPreComp(gTanView, WAVE_BUFFER_SIZE);
    ArcSinPreComp(gArcSinView, WAVE_BUFFER_SIZE);
    ArcCosPreComp(gArcCosView, WAVE_BUFFER_SIZE);


    const Wave = makeStruct("ShaderProgram, vertexBuffer, indexBuffer, VertexCount, normalBuffer, \
    textureBuffer, PosOffset, RowNum, ColNum, PositionsArray, IndicesArray, Color, \
    Position, Rotation, Scale, \
    ParentTrans, ParentScale\
    Texture");
    const Quad = makeStruct("ShaderProgram, vertexBuffer, indexBuffer, VertexCount, normalBuffer, \
    textureBuffer, PositionsArray, IndicesArray, Color, \
    Position, Rotation, Scale, \
    ParentTrans, ParentScale\
    Texture3D, Texture, DepthTexture");
    const QuadStar = makeStruct("ShaderPrrogram, vertexBuffer, indexBuffer, VertexCount, normalBuffer, \
    textureBuffer, QuadPosBuffer, PositionsArray, IndicesArray, Color, LocalPosArray, QuadPosArray, \
    ParentTrans, ParentScale \
    DepthTexture");
    
    gSkybox = new Quad(gShaderProgramSkybox, null, null,0,null,null,[],[],[1.0,1.0,1.0,1.0],
    [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0], null, null, null, null, null);
    let SkyboxOrigin = [0.0,0.0,0.0];
    GenerateQuad(gSkybox,gGL,1.0,SkyboxOrigin);  
    gScreenSpaceQuad = new Quad(gShaderProgramSkybox, null, null,0,null,null,[],[],[1.0,1.0,1.0,1.0],
      [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0], null, null, null, null, null);
    let ScreenSpaceOrigin = [0.0,0.0,0.0];
    GenerateQuad(gScreenSpaceQuad,gGL,1.0,ScreenSpaceOrigin);  
    gCrossHair = new Quad(gShaderProgramSkybox, null, null,0,null,null,[],[],[1.0,1.0,1.0,1.0],
      [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0], null, null, null, null, null);
    let CrossHairOrigin = [0.0,0.0,0.0];
    GenerateQuad(gCrossHair,gGL,.05,CrossHairOrigin);  
    

    gSimpleWave = new Wave(gShaderProgramWave, 0,0,0,[], [],[0.0,0.0,0.0],0,0,[], [], 
      [.1,.5,1.0,1.0], [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0], null, null, null);
    GenerateWave(gSimpleWave, gProgramInfoWave, gGL);
    const Camera = makeStruct("Eye, ViewDir, UpDir, Width, Height, ObjectIndex");
    gCamera = new Camera([0.0,0.0,0.0],[0.0,0.0,1.0],[0.0,1.0,0.0], gCanvasWidth, gCanvasHeight, 0);
    const Light = makeStruct("Pos, Color, Intensity");
    gLight1 = new Light([0.0,1.0,-1.0],[1.0, 0.863, 0.537],1.5);
    gLight2 = new Light([0.0,1.0,-1.0],[1.0, 0.863, 0.537],1.0);
    gLight3 = new Light([10.0,-100.0,-50.0],[.4, 0.863, 0.837],1.0);
    
    //=======================Star Sphere==============================
    gStars = new QuadStar(gShaderProgramFlat, null, null,0,null,null,[],[],[1.0,1.0,1.0,1.0],
      [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0],[],[],null,null,null);
    
    let StarSphereOrigin = vec3.fromValues(40.0,20.0,40.0);
    let StarSphereRadius = 100.0;
    let NumStarSphere = 5000;
    let isHemiSphere = true;
    let RandRadAm = 2.0;
    let StarSize = 1.0;
    SphereOfQuad(gGL,StarSphereOrigin,StarSphereRadius,StarSize,gStars,NumStarSphere, 
      gSinView, gCosView,gArcSinView,gArcCosView, WAVE_BUFFER_SIZE, isHemiSphere, RandRadAm,
      gCamera);

    //----------------------------------------------------------------
    
  
    gPreviousTime = gTime.getTime();
    gTimeStart = gPreviousTime;
    //Set up Input
    document.addEventListener("keydown", (e) => {
      gKeysPressed[e.key] = true;
    });
  
    document.addEventListener("keyup", (e) => {
      gKeysPressed[e.key] = false;
    });
    document.addEventListener("mousemove", CalcMouseDelta);
    document.addEventListener("click", (e) => ClickFunc(e));


    gDepthMap = genDepthMap(gGL, gCanvasWidth, gCanvasHeight);
    gDepthFBO = genFBO(gGL, gDepthMap);
    gRaycastMap = genEmptyTex(gGL, gCanvasWidth, gCanvasHeight);
    gRaycastFBO = genFBO(gGL, gDepthMap, gRaycastMap);
    gRenderText = genEmptyTex(gGL, gCanvasWidth, gCanvasHeight);
    gMainDepthMap = genDepthMap(gGL, gCanvasWidth, gCanvasHeight);
    gMainFBO = genFBO(gGL, gMainDepthMap, gRenderText);
    gGlassRendText = genEmptyTex(gGL, gCanvasWidth, gCanvasHeight);
    gGlassDepthMap = genDepthMap(gGL, gCanvasWidth, gCanvasHeight);
    gGlassFBO = genFBO(gGL, gGlassDepthMap, gGlassRendText);
    
    await SetUpScene();
    

    BoatWaveIndexFind();
    gActiveMainLoop = MainLoop;
    gActiveMainLoop();
    FrameCount();
    
   
}



//==========================NEXT TASKS==========================
/*Shader Toy Inspo
https://www.shadertoy.com/view/3XdyzH
https://www.shadertoy.com/view/3X3czH
https://www.shadertoy.com/view/WcGBDt
https://www.shadertoy.com/view/3cGfzt
https://www.shadertoy.com/view/3cKBWR
https://www.shadertoy.com/view/3cyfzy
https://www.shadertoy.com/view/WcVfRy
https://www.shadertoy.com/view/WfGfWw
https://www.shadertoy.com/view/WfyBWh


WAVEMARCH GLASS
https://www.shadertoy.com/view/flfyRS -- Try this one
https://www.shadertoy.com/view/XsSGDh -- Simple option
*/

