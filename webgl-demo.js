//=======================SHADERS=============================
let gVertSourceDef;
let gVertSkybox;
let gVertStar;
let gFragSourceDef;
let gFragSourceFlat;
let gFragSourceCloud;
let gFragSkybox;
let gFragStar;
let gShaderProgramDef;
let gShaderProgramFlat;
let gShaderProgramCloud;
let gShaderProgramSkybox;
let gShaderProgramStar;
let gProgramInfoDef = {};
let gProgramInfoFlat = {};
let gProgramInfoCloud = {};
let gProgramInfoSkybox = {};
let gProgramInfoStar = {};


//Depth
let gDepthFBO;
let gDepthMap;


//Imported functions
import { Move } from './translations.js';
import { Rotate } from './translations.js';
import { Scale } from './translations.js';
import { Normalize } from './Utils.js';
import { ToRadian } from './Utils.js';
import { sleep } from './Utils.js';
import { CameraMove } from './Camera.js';
import { MouseLook } from './Camera.js';
import { GetViewMatrix } from './Camera.js';
import { SinPreComp } from './PreCompWave.js';
import { CosPreComp } from './PreCompWave.js';
import { TanPreComp } from './PreCompWave.js';
import { ArcSinPreComp } from './PreCompWave.js';
import { ArcCosPreComp } from './PreCompWave.js';
import { createNoise3D } from './Externals/simplex-noise.js';
import { SetProgramInfo } from './ShaderFunc.js';
import { loadTexture } from './ShaderFunc.js';
import { setPositionAttribute } from './ShaderFunc.js';
import { createTexture2DFromBuffer } from './ShaderFunc.js';
import { createTexture3DFromBuffer } from './ShaderFunc.js';
import { mat4 } from './Externals/esm/index.js';
import { vec2 } from './Externals/esm/index.js';
import { vec3 } from './Externals/esm/index.js';
import { vec4 } from './Externals/esm/index.js';
import { quat } from './Externals/esm/index.js';
import { GenerateWave } from './GenerateMesh.js';
import { CalculateNormals } from './GenerateMesh.js';
import { GenerateQuad } from './GenerateMesh.js';
import { SphereOfQuad } from './GenerateMesh.js';
import { StarLookAt } from './GenerateMesh.js';
import { CreateWorley3D } from './GenerateNoise.js';


//=======================GLOBALS=============================
//Scene
let gCamera;
let gLight1;
let gSimpleWave;
let gBoatMesh;
let gSkybox;
let gNoiseCube;
let gStars;
let gCloudShimmer;
let gMoon;
let gSpellCircle;
//
let gPreviousTime;
let gDeltaTime;
let gTimeSinceRun;
let gTimeStart;
let gTime = new Date();
let gGL;
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
function genFBODepth()
{
    gDepthFBO = gGL.createFramebuffer();
    gDepthMap = gGL.createTexture();
    gGL.bindTexture(gGL.TEXTURE_2D, gDepthMap);
    gGL.texImage2D(gGL.TEXTURE_2D, 0, gGL.DEPTH_COMPONENT24, gCanvasWidth, 
      gCanvasHeight, 0, gGL.DEPTH_COMPONENT, gGL.UNSIGNED_INT, null);
      gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MIN_FILTER, gGL.NEAREST);
      gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MAG_FILTER, gGL.NEAREST);
      gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_S, gGL.REPEAT); 
      gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_T, gGL.REPEAT);  
    
      gGL.bindFramebuffer(gGL.FRAMEBUFFER, gDepthFBO);  
      gGL.framebufferTexture2D(gGL.FRAMEBUFFER, gGL.DEPTH_ATTACHMENT, gGL.TEXTURE_2D, gDepthMap, 0);
      gGL.drawBuffers([gGL.NONE]);
}
async function SetUpScene()
{
   //Gen Noise
   const CubeMeshText = await LoadOBJ('./models/Cube.obj');
   gNoiseCube = new OBJ.Mesh(CubeMeshText);
   OBJ.initMeshBuffers(gGL, gNoiseCube);
   let ImgSize = 32;
   let ImgBufNoise = await CreateWorley3D(4, ImgSize);
   gNoiseCube.Texture3D = await createTexture3DFromBuffer(gGL, ImgBufNoise, ImgSize, ImgSize, ImgSize);
   gNoiseCube.Texture = await loadTexture(gGL, './Textures/CloudDetailNoise.png',4);
  const BoatMeshText = await LoadOBJ('./models/SailBoat.obj');
  gBoatMesh = new OBJ.Mesh(BoatMeshText);
  OBJ.initMeshBuffers(gGL, gBoatMesh);
  gBoatMesh.Texture = await loadTexture(gGL, './Textures/SailBoat.png',4);
  const SphereText = await LoadOBJ('./models/Sphere.obj');
  gMoon = new OBJ.Mesh(SphereText);
  OBJ.initMeshBuffers(gGL, gMoon);
  gMoon.Texture = await loadTexture(gGL, './Textures/Moon.png',4);
  gSkybox.Texture = await loadTexture(gGL, './Textures/ScreenOutline.png',4);
  const SpellCircleText = await LoadOBJ('./models/SpellCircle.obj');



  //Set Positions
  gBoatMesh.Scale = [2.0, 2.0, 2.0];
  gBoatMesh.Rotation = [0.0,0.0,0.0];
  gBoatMesh.Position = [35.0,0.0,35.0];
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
}
async function LoadOBJ(path)
{
  const ObjLoad = await fetch(path);
  if(!ObjLoad.ok) throw new Error("Failed to load OBJ");
  return await ObjLoad.text();

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
    const positionBuffer = gGL.createBuffer();
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
  quat.fromEuler(q, Object.Rotation[0], Object.Rotation[1], Object.Rotation[2]);
  mat4.fromQuat(RotationMatrix,q);
  let Pos = vec3.fromValues(Object.Position[0],Object.Position[1],Object.Position[2]);
  let Scale = vec3.fromValues(Object.Scale[0],Object.Scale[1],Object.Scale[2]);
  ModelMatrix = mat4.fromRotationTranslationScale(ModelMatrix, q, Pos, Scale);
}
function DrawCallSetup()
{
    gGL.clearColor(0.06, 0.09, 0.16, 1.0); 
    gGL.clearDepth(1.0);
    gGL.enable(gGL.DEPTH_TEST); 
    gGL.depthFunc(gGL.LEQUAL); 
    gGL.enable(gGL.CULL_FACE);
    gGL.enable(gGL.BLEND);
    gGL.cullFace(gGL.FRONT);
    gGL.blendFunc(gGL.SRC_ALPHA, gGL.ONE_MINUS_SRC_ALPHA);

      
    gGL.clear(gGL.COLOR_BUFFER_BIT | gGL.DEPTH_BUFFER_BIT);
}
function Draw(programInfo, Object, Camera, Light, LoadedMesh = false, ScreenQuad = false)
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

         if (!ScreenQuad)
         {
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
         }
         else //for skybox render
         {
          let ViewMatrix = mat4.create();
          let inverseViewMatrix = mat4.create();
          ViewMatrix = GetViewMatrix(Camera);
          mat4.invert(inverseViewMatrix,ViewMatrix);
          gGL.uniformMatrix4fv(
            programInfo.uniformLocations.inverseViewDir,
            false,
            ViewMatrix,
          );

         }
          // Tell WebGL how to pull out the positions from the position
         // buffer into the vertexPosition attribute.
         setPositionAttribute(Object, programInfo, Camera, Light, gGL, gTimeSinceRun);
      
        {
          gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, Object.indexBuffer); //This needs to be the last active buffer 
          
          const offset = 0;
          let vertexCount = LoadedMesh ? Object.indexBuffer.numItems : Object.VertexCount; 
          
          gGL.drawElements(gGL.TRIANGLES, vertexCount, gGL.UNSIGNED_SHORT, offset);
        }
      
}
function CalcMouseDelta(event)
{
  let CurrentPos = [event.pageX, event.pageY];
  if (!gMousePosInit)
  {
    gPreviousMouse = CurrentPos;
    gMousePosInit = true;
  }
  gDeltaMouse = [CurrentPos[0] - gPreviousMouse[0], CurrentPos[1] - gPreviousMouse[1]];
  gPreviousMouse = CurrentPos;
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
async function FrameCount()
{
  while(true)
  {
    await sleep(1000);
    console.log("Frame : " + gFrameCount);
    gFrameCount = 0;
  }
}
function MainLoop()
{
    gTime = new Date();
    let newTime = gTime.getTime();
    gDeltaTime = newTime- gPreviousTime;
    gTimeSinceRun = newTime - gTimeStart;
    gPreviousTime = newTime;
    
    Input();
    MouseLook(gCamera, gDeltaMouse);
    gDeltaMouse = [0.0,0.0];
    WaveUpdateMesh(gSimpleWave);
    CalculateNormals(gSimpleWave, gGL);
    CalculateBoatRot();
    

      //Render Depth
      gGL.bindFramebuffer(gGL.FRAMEBUFFER, gDepthFBO);  
      gGL.viewport(0, 0, gCanvasWidth, gCanvasHeight);
      gGL.enable(gGL.DEPTH_TEST);
      gGL.clear(gGL.DEPTH_BUFFER_BIT);   
      gGL.disable(gGL.CULL_FACE);
      //Draw(gProgramInfoDef, gSimpleWave, gCamera, gLight1, false);
      Draw(gProgramInfoFlat, gBoatMesh, gCamera, gLight1, true, false);
      Draw(gProgramInfoFlat, gMoon, gCamera, gLight1, true, false);
      gGL.bindFramebuffer(gGL.FRAMEBUFFER, null);  
      gNoiseCube.DepthTexture = gDepthMap;
      gStars.DepthTexture = gDepthMap;
  
    //
    DrawCallSetup();

    //Normal Render Pass
    gGL.disable(gGL.CULL_FACE);
    Draw(gProgramInfoSkybox,gSkybox,gCamera,gLight1,false, true);
    Draw(gProgramInfoDef, gSimpleWave, gCamera, gLight1, false, false);
    Draw(gProgramInfoFlat, gBoatMesh, gCamera, gLight1, true, false);
    Draw(gProgramInfoFlat, gMoon, gCamera, gLight1, true, false);
    gGL.enable(gGL.CULL_FACE);
    gGL.depthMask(false);
    gGL.disable(gGL.DEPTH_TEST); 
    StarLookAt(gGL, gStars, gCamera);
    Draw(gProgramInfoStar, gStars, gCamera, gLight1, false,false);
    Draw(gProgramInfoCloud, gNoiseCube, gCamera, gLight1, true, false);
    gGL.enable(gGL.DEPTH_TEST);
    gGL.depthMask(true);
    gFrameCount++;
    gCycleNum++;
    requestAnimationFrame(MainLoop);
}


main();

async function main() {
  const canvas = document.querySelector("#gl-canvas");
  gCanvasWidth = canvas.width;
  gCanvasHeight = canvas.height;
  // Initialize the GL context
  gGL = canvas.getContext("webgl2");
  

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
  //Frag
  gFragSourceDef = await loadShaderFiles(gFragSourceDef, './Shaders/DefaultFrag.glsl');
  gFragSourceFlat = await loadShaderFiles(gFragSourceFlat, './Shaders/FlatFrag.glsl');
  gFragSourceCloud = await loadShaderFiles(gFragSourceCloud, './Shaders/CloudFrag.glsl');
  gFragSkybox = await loadShaderFiles(gFragSkybox, './Shaders/SkyboxFrag.glsl');
  gFragStar = await loadShaderFiles(gFragStar, './Shaders/StarFrag.glsl');

  gShaderProgramDef = initShader(gVertSourceDef,gFragSourceDef);
  gShaderProgramFlat = initShader(gVertSourceDef,gFragSourceFlat);
  gShaderProgramCloud = initShader(gVertSourceDef,gFragSourceCloud);
  gShaderProgramSkybox = initShader(gVertSkybox,gFragSkybox);
  gShaderProgramStar = initShader(gVertStar, gFragStar);

  SetProgramInfo(gGL, 
    gProgramInfoDef, gShaderProgramDef,
     gProgramInfoFlat, gShaderProgramFlat, 
     gProgramInfoCloud, gShaderProgramCloud,
     gProgramInfoSkybox, gShaderProgramSkybox,
     gProgramInfoStar, gShaderProgramStar,
     );
  
    SinPreComp(gSinView,WAVE_BUFFER_SIZE);
    CosPreComp(gCosView,WAVE_BUFFER_SIZE);
    TanPreComp(gTanView, WAVE_BUFFER_SIZE);
    ArcSinPreComp(gArcSinView, WAVE_BUFFER_SIZE);
    ArcCosPreComp(gArcCosView, WAVE_BUFFER_SIZE);


    const Wave = makeStruct("ShaderProgram, vertexBuffer, indexBuffer, VertexCount, normalBuffer, \
    textureBuffer, PosOffset, RowNum, ColNum, PositionsArray, IndicesArray, Color, \
    Position, Rotation, Scale, \
    Texture");
    const Quad = makeStruct("ShaderProgram, vertexBuffer, indexBuffer, VertexCount, normalBuffer, \
    textureBuffer, PositionsArray, IndicesArray, Color, \
    Position, Rotation, Scale, \
    Texture3D, Texture");
    const QuadStar = makeStruct("ShaderProgram, vertexBuffer, indexBuffer, VertexCount, normalBuffer, \
    textureBuffer, QuadPosBuffer, PositionsArray, IndicesArray, Color, LocalPosArray, QuadPosArray, DepthTexture");
    
    gSkybox = new Quad(gShaderProgramSkybox, null, null,0,null,null,null,[],[],[1.0,1.0,1.0,1.0],
    [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0],null, null);
    let SkyboxOrigin = [0.0,0.0,0.0];
    GenerateQuad(gSkybox,gGL,1.0,SkyboxOrigin);
    

    gSimpleWave = new Wave(gShaderProgramDef, 0,0,0,[], [],[0.0,0.0,0.0],0,0,[], [], 
      [.1,.5,1.0], [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0], null);
    GenerateWave(gSimpleWave, gProgramInfoDef, gGL);
    const Camera = makeStruct("Eye, ViewDir, UpDir, Width, Height");
    gCamera = new Camera([0.0,0.0,0.0],[0.0,0.0,1.0],[0.0,1.0,0.0], gCanvasWidth, gCanvasHeight);
    const Light = makeStruct("Pos, Color, Intensity");
    gLight1 = new Light([0.0,1.0,-1.0],[1.0, 0.863, 0.537],1.5);
    
    //=======================Star Sphere==============================
    gStars = new QuadStar(gShaderProgramFlat, null, null,0,null,null,[],[],[1.0,1.0,1.0,1.0],
      [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0],[],[],null);
    
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
    document.onmousemove = CalcMouseDelta;



    genFBODepth();
    await SetUpScene();
    

    BoatWaveIndexFind();
    MainLoop();
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
*/
