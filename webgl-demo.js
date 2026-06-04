//Current Bugs Camera rotations issue, Canvas rescaling with vert shader issue


/*
Create FBO for Raycast with Object ID. Have definition of all raycast 
objects and make the rendered texture value be the index of the object
*/
//=======================SHADERS=============================
let gVertSourceDef, gVertSkybox, gVertStar, gVertRaycast, gVertTrans, gVertFlesh, gVertMorph, gVertTreeMorph, gVertGLTFDef, gVertSkyboxHigh;

let gFragSourceWave, gFragSourceFlat, gFragSourceCloud, gFragSkybox, gFragStar, gFragColor,
gFragVolGlow, gFragDef, gFragRaycast, gFragGlass, gFragScreenFlat, gFragTransFlat, gFragFlesh, gFragElenco,
gFragFleshPart, gFragMorph, gFragTreeMorph, gFragScreenBGTrans, gFragPostProcessingFlesh, gFragPostProcessingAndrew, 
gFragToon, gFragPostProcessing, gFragScreenFluidDisp, gFragScreenFluidAdvect, gFragScreenFlatFluid, gFragScreenFluidFindDivergence, gFragScreenFluidPressureSolver,
gFragScreenFluidBorder, gFragScreenFluidPressureCorrect, gFragScreenFluidMouseMove, gFragScreenSplitL, gFragScreenSplitR;


let gShaderProgramDef, gShaderProgramWave, gShaderProgramFlat, gShaderProgramCloud,
gShaderProgramSkybox, gShaderProgramStar, gShaderProgramFleshPart, gShaderProgramColor, gShaderProgramVolGlow,
gShaderProgramRaycast, gShaderProgramGlass, gShaderProgramScreenRender, gShaderProgramScreenImage,
gShaderProgramTrans, gShaderProgramFlesh, gShaderProgramElenco, gShaderProgramMorph, gShaderProgramTreeMorph, gShaderProgramScreenBGTrans, gShaderProgramPostProcessingFlesh, gShaderProgramGLTFDef,
gShaderProgramPostProcessingAndrew, gShaderProgramToon, gShaderProgramPostProcessing, 
gShaderProgramScreenFluidDisp, gShaderProgramScreenFluidAdvect, gShaderProgramScreenFlatFluid, gShaderProgramScreenFluidFindDivergence, gShaderProgramScreenFluidPressureSolver,
gShaderProgramScreenFluidBorder, gShaderProgramScreenFluidPressureCorrect, gShaderProgramScreenFluidMouseMove, 
gShaderProgramScreenSplitL, gShaderProgramScreenSplitR;

let gProgramInfoDef = {};
let gProgramInfoWave = {};
let gProgramInfoFlat = {};
let gProgramInfoCloud = {};
let gProgramInfoSkybox = {};
let gProgramInfoStar = {};
let gProgramInfoFleshPart = {};
let gProgramInfoColor = {};
let gProgramInfoVolGlow = {};
let gProgramInfoRaycast = {};
let gProgramInfoGlass = {};
let gProgramInfoScreenRender = {};
let gProgramInfoScreenImage = {};
let gProgramInfoTrans = {};
let gProgramInfoFlesh = {};
let gProgramInfoElenco = {};
let gProgramInfoMorph = {};
let gProgramInfoTreeMorph = {};
let gProgramInfoScreenBGTrans = {};
let gProgramInfoPostProcessingFlesh = {};
let gProgramInfoGLTFDef = {};
let gProgramInfoPostProcessingAndrew = {};
let gProgramInfoToon = {};
let gProgramInfoPostProcessing = {};
let gProgramInfoScreenFluidDisp = {};
let gProgramInfoScreenFluidAdvect = {};
let gProgramInfoScreenFlatFluid = {};
let gProgramInfoScreenFluidFindDivergence = {};
let gProgramInfoScreenFluidBorder = {};
let gProgramInfoScreenFluidPressureSolver = {};
let gProgramInfoScreenFluidPressureCorrect = {};
let gProgramInfoScreenFluidMouseMove = {};
let gProgramInfoScreenSplitL = {};
let gProgramInfoScreenSplitR = {};

//Depth
let gDepthFBO;
let gDepthMap;
let gMainDepthMap;
let gGlassDepthMap;

//Raycast
let gRaycastFBO;
let gRaycastColecMain = [];
let gRaycastColecTransform = [];
let gRaycastMap;
let gRaycastIndex;
let gRaycastText; // storing in different var to avoid editing binded buff
let gMouseMoved = false;

//Mobile
let gTouchDelta = [0.0,0.0];
let gTouchSpeed = 15.0;

//Transparency and glass and stuff
let gMainFBO;
let gGlassFBO;
let gGlassRendText;
let gRenderText;
let gTexForTransp;

//Bloom fbo
let gBloomDepthMap;
let gBloomRendText;
let gBloomFBO;


//Imported functions
import { Move,Rotate,Scale } from './translations.js';
import { Normalize,ToRadian,lerp,sleep, Transform, Clamp, MobileCheck} from './Utils.js';
import { CameraMove, MouseLook, GetViewMatrix, Camera, CamAniClips, CameraAniClip, CameraAniKey } from './Camera.js';
import { SinPreComp,CosPreComp,TanPreComp,ArcSinPreComp,ArcCosPreComp } from './PreCompWave.js';
import { createNoise3D } from './Externals/simplex-noise.js';
import { SetProgramInfo,loadTexture,setPositionAttribute,createTexture2DFromBuffer,
  createTexture3DFromBuffer,genFBO,genDepthMap,genEmptyTex,ClearFBO,
  loadShaderFiles,initShader, LoadWeightsTXT, RemapToInd} from './ShaderFunc.js';
import { mat4,vec2,vec3,vec4,quat } from './Externals/esm/index.js';
import { GenerateWave,CalculateNormals,GenerateQuad,SphereOfQuad,StarLookAt,PlaceColecOnSurf} from './GenerateMesh.js';
import { CreateWorley3D } from './GenerateNoise.js';
import { LoadOBJ } from './Externals/webgl-obj-loader.js'; 
import { Bone, Armature, LoadBones} from './Armature.js';
import { CharClips } from './Animation.js';
import { PlayAudio, StopAudio, gAudioContext} from './AudioManager.js';
import { MidiObj } from './MidiManager.js';
import * as THREE from 'three';
import { LoadThreeScene, AddAnimation, UpdateModel,UpdateBoneMatrix } from './ChudThreeImplementation.js';
import {SoundObject} from './SoundObject.js';
import { FluidSim2D } from './FluidSim.js';




//=======================GLOBALS=============================
//Scene
let gSceneLoadState = {Main: false, Transform: false, AboutMe: false, LiquidSim: false};
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
let gGlassSphere2;
let gGlassSphere3;
let gCharHead, gCharHair, gAtSign, gMusicNote;
let gScreenSpaceQuad;
let gCrossHair;
let gOpt1, gOpt2, gOpt3; //set up raytracing Options
let gElencoVis;
let gIsLoading = true;
let gConditions = 
{
  AudioInit : false,
}
let gNoise3DText;

//Transformation Scene
let gCharTrans, gCharHairTrans, gFleshGroundL, gFleshGroundR, gFlower
,gScreenSpaceQuadTrans, gPostProcessingQuad, gHomeButton, gPlayButton, gPauseButton, gUIBacking; 
let gCharBoneColec = [];
let gCharArmature;
let gRCDict = new Map();
let gSurfObjColec = [];
let gCompSurfObj;
let gSurfColecVertIndicies = []; //Used to store which verts surface objects are linked with
let gMidiObj;
let gBoneModel;
export let gBoneColec = [];
export let gFlowerColec = [];
let gFleshParticles;
let gTreeColec = [];
export let gAlmondColec = [];
export let gGlobalTempo = 186.62;

//About Me Scene
let gSceneAboutMe = new THREE.Scene();
let gCharMeDict = new Map();
let gCharTextColec;
let gCharMeAniMixer;
let gCharMeAniClips;
let gStar2;
let gStarTransforms = [];
let gCommissionsText, gGameAudioText, gSoundDesignText, gVisualsText, gContactText;

//Fluid Sim Scene
let gFluidSimObj;
let gFluidFBO;
let gFluidRendText;
let gFluidDepthMap;

//
let gPreviousTime;
export let gTimeSinceRun;
let gTimeStart;
let gTime = new Date();
let gCanvas;
let gCycleNum = 0;
let gBoatWaveIndices = [0,0,0,0];
let gBoatRangeIndices = [0,0,0,0];
let gFrameCount = 0;
let gInitLoad = true;

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
let gPreviousMouse;
let gMousePosInit = false;
let gKeysPressed = {};

//CanvasData
let gCanvasWidth;
let gCanvasHeight;
let gCanvasAspect;


//=========GLOBAL AUDIO===========
const SoundTransformSound = document.getElementById("TransformSong");
let Track1 = gAudioContext.createMediaElementSource(SoundTransformSound);
Track1.connect(gAudioContext.destination);
const SoundMainTheme = document.getElementById("MainTheme");
let Track2 = gAudioContext.createMediaElementSource(SoundMainTheme);
let T2PanNode = new PannerNode(gAudioContext);
T2PanNode.refDistance = 10.0;
T2PanNode.panningModel = "equalpower";
T2PanNode.distanceModel = "linear";
T2PanNode.refDistance = 1;
T2PanNode.maxDistance = 1000;
T2PanNode.rolloffFactor = 1.0;
T2PanNode.coneInnerAngle = 360;
T2PanNode.coneOuterAngle = 0;
T2PanNode.coneOuterGain = 0;
Track2.connect(T2PanNode);
T2PanNode.connect(gAudioContext.destination);
let SoundObjPos = vec3.create();
let MainThemeObj = new SoundObject(SoundObjPos, 0, 1, SoundMainTheme, null, T2PanNode, 0);

let AcceptSound = document.getElementById("AcceptClick");

let Track3 = gAudioContext.createMediaElementSource(AcceptSound);
let T3Gain = new GainNode(gAudioContext);
T3Gain.gain.value = .5;
Track3.connect(T3Gain);
T3Gain.connect(gAudioContext.destination);
let AcceptObj = new SoundObject(vec3.create(), 0, 1, AcceptSound, null, null, 0);


let MouseClickSound = document.getElementById("MouseClick");
let Track4 = gAudioContext.createMediaElementSource(MouseClickSound);
let T4Gain = new GainNode(gAudioContext);
T4Gain.gain.value = .5;
Track4.connect(T4Gain);
T4Gain.connect(gAudioContext.destination);
let MouseClickObj =  new SoundObject(vec3.create(), 0, 1, MouseClickSound, null, null, 0);


//=========ABOUT ME SOUND SETUP===================
let gAboutMeSoundObjColec = [];
let AboutMeGain = .5;
let AboutMeEmptySound = document.getElementById("AboutMeEmpty");
let Track5 = gAudioContext.createMediaElementSource(AboutMeEmptySound);
Track5.connect(gAudioContext.destination);


let AboutMeBassSound = document.getElementById("AboutMeBass");
let Track6 = gAudioContext.createMediaElementSource(AboutMeBassSound);
let T6PanNode = new PannerNode(gAudioContext);
let T6Gain = new GainNode(gAudioContext);
T6Gain.gain.value = AboutMeGain;
Track6.connect(T6PanNode);
T6PanNode.connect(T6Gain);
T6Gain.connect(gAudioContext.destination);
let PosBass = vec3.fromValues(0.0,0.0,0.0);
let AboutMeBassObj =  new SoundObject(PosBass, 0, 1, AboutMeBassSound, AboutMeEmptySound, T6PanNode, 1);

let AboutMeBirdTextureSound = document.getElementById("AboutMeBirdTexture");
let Track7 = gAudioContext.createMediaElementSource(AboutMeBirdTextureSound);
let T7PanNode = new PannerNode(gAudioContext);
let T7Gain = new GainNode(gAudioContext);
T7Gain.gain.value = AboutMeGain;
Track7.connect(T7PanNode);
T7PanNode.connect(T7Gain);
T7Gain.connect(gAudioContext.destination);
let PosBirdTexture = vec3.fromValues(-500.0,300.0,0.0);
let AboutMeBirdTextureObj =  new SoundObject(PosBirdTexture, 0, 1, AboutMeBirdTextureSound, AboutMeEmptySound, T7PanNode, 1);

let AboutMeHatSound = document.getElementById("AboutMeHat");
let Track8 = gAudioContext.createMediaElementSource(AboutMeHatSound);
let T8PanNode = new PannerNode(gAudioContext);
let T8Gain = new GainNode(gAudioContext);
T8Gain.gain.value = AboutMeGain;
Track8.connect(T8PanNode);
T8PanNode.connect(T8Gain);
T8Gain.connect(gAudioContext.destination);
let PosHat = vec3.fromValues(100.0,100.0,100.0);
let AboutMeHatObj =  new SoundObject(PosHat, 0, 1, AboutMeHatSound, AboutMeEmptySound, T8PanNode, 1);

let AboutMeKickSound = document.getElementById("AboutMeKick");
let Track9 = gAudioContext.createMediaElementSource(AboutMeKickSound);
let T9PanNode = new PannerNode(gAudioContext);
let T9Gain = new GainNode(gAudioContext);
T9Gain.gain.value = AboutMeGain;
Track9.connect(T9PanNode);
T9PanNode.connect(T9Gain);
T9Gain.connect(gAudioContext.destination);
let PosKick = vec3.fromValues(0.0,0.0,500.0);
let AboutMeKickObj =  new SoundObject(PosKick, 0, 1, AboutMeKickSound, AboutMeEmptySound, T9PanNode, 1);

let AboutMeLeadSound = document.getElementById("AboutMeLead");
let Track10 = gAudioContext.createMediaElementSource(AboutMeLeadSound);
let T10PanNode = new PannerNode(gAudioContext);
let T10Gain = new GainNode(gAudioContext);
T10Gain.gain.value = AboutMeGain;
Track10.connect(T10PanNode);
T10PanNode.connect(T10Gain);
T10Gain.connect(gAudioContext.destination);
let PosLead = vec3.fromValues(0.0,0.0,0.0);
let AboutMeLeadObj =  new SoundObject(PosLead, 0, 1, AboutMeLeadSound, AboutMeEmptySound, T10PanNode, 1);

let AboutMePadSound = document.getElementById("AboutMePad");
let Track11 = gAudioContext.createMediaElementSource(AboutMePadSound);
let T11PanNode = new PannerNode(gAudioContext);
let T11Gain = new GainNode(gAudioContext);
T11Gain.gain.value = AboutMeGain;
Track11.connect(T11PanNode);
T11PanNode.connect(T11Gain);
T11Gain.connect(gAudioContext.destination);
let PosPad = vec3.fromValues(500.0,300.0,300.0);
let AboutMePadObj =  new SoundObject(PosPad, 0, 1, AboutMePadSound, AboutMeEmptySound, T11PanNode, 1);

let AboutMePiano1Sound = document.getElementById("AboutMePiano1");
let Track12 = gAudioContext.createMediaElementSource(AboutMePiano1Sound);
let T12PanNode = new PannerNode(gAudioContext);
let T12Gain = new GainNode(gAudioContext);
T12Gain.gain.value = AboutMeGain;
Track12.connect(T12PanNode);
T12PanNode.connect(T12Gain);
T12Gain.connect(gAudioContext.destination);
let PosPiano1 = vec3.fromValues(-500.0,0.0,0.0);
let AboutMePiano1Obj =  new SoundObject(PosPiano1, 0, 1, AboutMePiano1Sound, AboutMeEmptySound, T12PanNode, 1);

let AboutMePiano2Sound = document.getElementById("AboutMePiano2");
let Track13 = gAudioContext.createMediaElementSource(AboutMePiano2Sound);
let T13PanNode = new PannerNode(gAudioContext);
let T13Gain = new GainNode(gAudioContext);
T13Gain.gain.value = AboutMeGain;
Track13.connect(T13PanNode);
T13PanNode.connect(T13Gain);
T13Gain.connect(gAudioContext.destination);
let PosPiano2 = vec3.fromValues(500.0,0.0,0.0);
let AboutMePiano2Obj =  new SoundObject(PosPiano2, 0, 1, AboutMePiano2Sound, AboutMeEmptySound, T13PanNode, 1);

let AboutMeStringsSound = document.getElementById("AboutMeStrings");
let Track14 = gAudioContext.createMediaElementSource(AboutMeStringsSound);
let T14PanNode = new PannerNode(gAudioContext);
let T14Gain = new GainNode(gAudioContext);
T14Gain.gain.value = AboutMeGain;
Track14.connect(T14PanNode);
T14PanNode.connect(T14Gain);
T14Gain.connect(gAudioContext.destination);
let PosStrings = vec3.fromValues(-1000.0,0.0,0.0);
let AboutMeStringsObj =  new SoundObject(PosStrings, 0, 1, AboutMeStringsSound, AboutMeEmptySound, T14PanNode, 1);

let AboutMeVocalChopSound = document.getElementById("AboutMeVocalChop");
let Track15 = gAudioContext.createMediaElementSource(AboutMeVocalChopSound);
let T15PanNode = new PannerNode(gAudioContext);
let T15Gain = new GainNode(gAudioContext);
T15Gain.gain.value = AboutMeGain;
Track15.connect(T15PanNode);
T15PanNode.connect(T15Gain);
T15Gain.connect(gAudioContext.destination);
let PosVocalChops = vec3.fromValues(1000.0,0.0,0.0);
let AboutMeVocalChopObj =  new SoundObject(PosVocalChops, 0, 1, AboutMeVocalChopSound, AboutMeEmptySound, T15PanNode, 1);

let AboutMeTomSound = document.getElementById("AboutMeTom");
let Track16 = gAudioContext.createMediaElementSource(AboutMeTomSound);
let T16PanNode = new PannerNode(gAudioContext);
let T16Gain = new GainNode(gAudioContext);
T16Gain.gain.value = AboutMeGain;
Track16.connect(T16PanNode);
T16PanNode.connect(T16Gain);
T16Gain.connect(gAudioContext.destination);
let PosTom = vec3.fromValues(0.0,0.0,0.0);
let AboutMeTomObj =  new SoundObject(PosTom, 0, 1, AboutMeTomSound, AboutMeEmptySound, T16PanNode, 1);

let AboutMePiano3Sound = document.getElementById("AboutMePiano3");
let Track17 = gAudioContext.createMediaElementSource(AboutMePiano3Sound);
let T17PanNode = new PannerNode(gAudioContext);
let T17Gain = new GainNode(gAudioContext);
T17Gain.gain.value = AboutMeGain;
Track17.connect(T17PanNode);
T17PanNode.connect(T17Gain);
T17Gain.connect(gAudioContext.destination);
let PosPiano3 = vec3.fromValues(0.0,0.0,0.0);
let AboutMePiano3Obj =  new SoundObject(PosPiano3, 0, 1, AboutMePiano3Sound, AboutMeEmptySound, T17PanNode, 1);

gAboutMeSoundObjColec.push(AboutMeBassObj, AboutMeBirdTextureObj, AboutMeHatObj, AboutMeKickObj, AboutMeLeadObj, AboutMePadObj,
  AboutMePiano1Obj, AboutMePiano2Obj, AboutMeStringsObj, AboutMeVocalChopObj, AboutMeTomObj, AboutMePiano3Obj);

  function TriggerAboutMeSong()
  {
    for(let i  = 0; i < gAboutMeSoundObjColec.length; i++)
    {
      gAboutMeSoundObjColec[i].Play(0);
    }
  }
  function StopAboutMeSong()
  {
    for(let i  = 0; i < gAboutMeSoundObjColec.length; i++)
    {
      gAboutMeSoundObjColec[i].Pause();
    }
  }
//-----------------------GLOBALS-----------------------------


export function makeStruct(keys) {
    if (!keys) return null;
    const k = keys.split(', ');
    const count = k.length;
  
    /** @constructor */
    function constructor() {
      for (let i = 0; i < count; i++) this[k[i]] = arguments[i];
    }
    return constructor;
  }
  const Wave = makeStruct("ShaderProgram, vertexBuffer, indexBuffer, VertexCount, normalBuffer, \
    textureBuffer, PosOffset, RowNum, ColNum, PositionsArray, IndicesArray, Color, \
    Position, Rotation, Scale, \
    ParentTrans, ParentScale\
    Texture");
    const Quad = makeStruct("ShaderProgram, vertexBuffer, indexBuffer, VertexCount, normalBuffer, \
    textureBuffer, PositionsArray, IndicesArray, Color, \
    Position, Rotation, Scale, \
    ParentTrans, ParentScale\
    Texture3D, Texture, DepthTexture, TextureBN, PrevTexture");
    const QuadStar = makeStruct("ShaderPrrogram, vertexBuffer, indexBuffer, VertexCount, normalBuffer, \
    textureBuffer, QuadPosBuffer, PositionsArray, IndicesArray, Color, LocalPosArray, QuadPosArray, \
    ParentTrans, ParentScale \
    DepthTexture");


  async function SetUpAboutMeAudio()
  {
    for (let i = 0; i < gAboutMeSoundObjColec.length; i++)
    {
      gAboutMeSoundObjColec[i].PanNode.refDistance = 10.0;
      gAboutMeSoundObjColec[i].PanNode.panningModel = "equalpower";
      gAboutMeSoundObjColec[i].PanNode.distanceModel = "linear";
      gAboutMeSoundObjColec[i].PanNode.refDistance = 1;
      gAboutMeSoundObjColec[i].PanNode.maxDistance = 1500;
      gAboutMeSoundObjColec[i].PanNode.rolloffFactor = 1.0;
      gAboutMeSoundObjColec[i].PanNode.coneInnerAngle = 360;
      gAboutMeSoundObjColec[i].PanNode.coneOuterAngle = 0;
      gAboutMeSoundObjColec[i].PanNode.coneOuterGain = 0;
    }
  }
async function LoadMainScene()
{
  if (gSceneLoadState.Main == true) {return}
  gTime = new Date();
  let initTime = gTime.getTime() * .001;
  //== Main Scene ==
  let LoadTxt = document.getElementById("LoadTxt");
   //Gen Noise
   let ImgSize = 4;
   let ImgBufNoise = await CreateWorley3D(4, ImgSize);

   //===================================TEXTURES========================================
   gNoise3DText = await createTexture3DFromBuffer(gGL, ImgBufNoise, ImgSize, ImgSize, ImgSize);
   LoadTxt.style.color = '#ffb700';
   const [
    BlueNoiseText,
    CloudDetailNoiseText,
    SailBoatText,
    MoonText,
    GirlText,
    CrosshairText,
    GlassNoiseNormText,
    GlassDisplacementText,
] = await Promise.all([
    loadTexture(gGL, './Textures/BlueNoise.png', 4),
    loadTexture(gGL, './Textures/CloudDetailNoise.png', 4),
    loadTexture(gGL, './Textures/SailBoat.png', 4),
    loadTexture(gGL, './Textures/Moon.png', 4),
    loadTexture(gGL, './Textures/Girl.png', 4),
    loadTexture(gGL, './Textures/crosshair.png', 4),
    loadTexture(gGL, './Textures/GlassNoiseNorm.png', 4),
    loadTexture(gGL, './Textures/GlassDisplacement.png', 4),
]);
   const assets = [
    {key: 'cube1', path: './models/Cube.obj'},
    {key: 'sailBoatLP', path: './models/SailBoatLP.obj'},
    {key: 'sphereLP', path: './models/SphereLP.obj'},
    {key: 'spellCircle1LP', path: './models/SpellCircleLP.obj'},
    {key: 'spellCircleVolumeLP', path: './models/SpellCircleVolumeLP.obj'},
    {key: 'maskCircleLP', path: './models/MaskCircleLP.obj'},
    {key: 'arrow1LP', path: './models/ArrowLP.obj'},
    {key: 'charHead', path: './models/CharHead.obj'},
    {key: 'atSign', path: './models/AtSign.obj'},
    {key: 'charHairLP', path: './models/CharHairLP.obj'},
    {key: 'musicNote', path: './models/MusicNote.obj'},
   ];


   const results = await Promise.all(
    assets.map(a => LoadOBJ(gGL, a.path))
);
  const [cube1, sailBoatLP, sphereLP, spellCircle1LP, spellCircleVolumeLP,
        maskCircleLP, arrow1LP, charHead, atSign, charHairLP, musicNote] = results;
   LoadTxt.style.color = '#fbff00';
   gTime = new Date();
   let NewTime = gTime.getTime() * .001;
   let DeltaTime = NewTime - initTime;
   initTime = NewTime;
   console.log("Time to load Models and Textures : " + DeltaTime);
   //===================================OBJECTS========================================
  
   
   gNoiseCube = Object.assign({}, cube1);
   gNoiseCube.Texture3D = gNoise3DText;
   gNoiseCube.Texture = CloudDetailNoiseText;
   gNoiseCube.TextureBN = BlueNoiseText;

  gBoatMesh = sailBoatLP;
  gBoatMesh.Texture = SailBoatText;

  gMoon = sphereLP;
  gMoon.Texture = MoonText;

  gSpellCircle = Object.assign({}, spellCircle1LP);
  gSpellCircle.Color = [0.5,.8,1.0,.3];

  gSpellCircleVolume = spellCircleVolumeLP;
  gSpellCircleVolume.Texture = CloudDetailNoiseText;

  gSpellCircleOutline = Object.assign({}, spellCircle1LP);

  gCircleMask = maskCircleLP;
  gCircleMask.Color = [1.0,1.0,1.0,0.0];

  gOpt1 = Object.assign({}, arrow1LP);

  gOpt2 = Object.assign({}, arrow1LP);

  gOpt3 = Object.assign({}, arrow1LP);

  gCharHead = charHead;
  gCharHead.Texture = GirlText;

 gCharHair = charHairLP;
 gCharHair.Texture = GirlText;

 gAtSign = atSign;

 gMusicNote = musicNote;


  gGlassSphere = Object.assign({}, cube1); // used for volume of raymarch sphere
  gGlassSphere.Normal = GlassNoiseNormText;
  gGlassSphere.Displacement = GlassDisplacementText;

  gGlassSphere2 = Object.assign({}, cube1);
  gGlassSphere2.Normal = GlassNoiseNormText;
  gGlassSphere2.Displacement = GlassDisplacementText;

  gGlassSphere3 = Object.assign({}, cube1);
  gGlassSphere3.Normal = GlassNoiseNormText;
  gGlassSphere3.Displacement = GlassDisplacementText;

  gCrossHair.Texture = CrosshairText;
  
  LoadTxt.style.color = '#aaff00';
  gTime = new Date();
  NewTime = gTime.getTime() * .001;
  DeltaTime = NewTime - initTime;
  initTime = NewTime;
  console.log("Time to load MainScene : " + DeltaTime);
  
gTime = new Date();
NewTime = gTime.getTime() * .001;
  DeltaTime = NewTime - initTime;
  initTime = NewTime;
  console.log("Time to load AboutMeScene : " + DeltaTime);
   //==========================SET PARENTING======================================
  gCharHead.ParentTrans = gGlassSphere;
    gCharHair.ParentTrans = gCharHead;
    gAtSign.ParentTrans = gGlassSphere2;
    gMusicNote.ParentTrans = gGlassSphere3;

  LoadTxt.style.color = '#08c979';
  //==========================SET POSITION======================================
  let BoatScale = 3.0;
  gBoatMesh.Scale = [BoatScale, BoatScale, BoatScale];
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
  gOpt2.Position = [0.0,2.0,85.0];
  gOpt2.Rotation = [0.0,60.0,0.0];
  gOpt2.Scale = [optSize,optSize,optSize];
  gOpt2.Color = [.7,.7,.7,1.0];
  gOpt3.Position = [90.0,2.0,85.0];
  gOpt3.Rotation = [0.0,120.0,0.0];
  gOpt3.Scale = [optSize,optSize,optSize];
  gOpt3.Color = [.7,.7,.7,1.0];

  let gCharSize = 10.0;
  gCharHead.Position = [0.0,-28.0,1.0];
  gCharHead.Rotation = [0.0,180.0,0.0];
  gCharHead.Scale = [gCharSize,gCharSize,gCharSize];
  gCharHair.Position = [0.0,0.0,0.0];
  gCharHair.Rotation = [0.0,0.0,0.0];
  gCharHair.Scale = [gCharSize,gCharSize,gCharSize];
  
  let atScale = 20.0;
  gAtSign.Position = [0.0,0.0,0.0];
  gAtSign.Rotation = [0.0,0.0,0.0];
  gAtSign.Scale = [atScale, atScale, atScale];
  gAtSign.Color = [1.0,1.0,1.0,1.0];

  let gNoteSize = 1.8;
  gMusicNote.Position = [3.0,0.0,0.0];
  gMusicNote.Rotation = [0.0,180.0,0.0];
  gMusicNote.Scale = [gNoteSize, gNoteSize, gNoteSize];
  gMusicNote.Color = [0.0, 0.0,0.0,1.0];
  
  let GSphereSize = 20.0;
  gGlassSphere.Position = [45.0,26.0,110.0];
  gGlassSphere.Scale = [GSphereSize,GSphereSize,GSphereSize];
  gGlassSphere.Rotation = [0.0,0.0,0.0];
 

  gGlassSphere2.Position = [-8.0,26.0,95.0];
  gGlassSphere2.Scale = [GSphereSize,GSphereSize,GSphereSize];
  gGlassSphere2.Rotation = [0.0,0.0,0.0];

  gGlassSphere3.Position = [96.0,26.0,95.0];
  gGlassSphere3.Scale = [GSphereSize,GSphereSize,GSphereSize];
  gGlassSphere3.Rotation = [0.0,0.0,0.0];

    //==========================FILL RAYCAST ARRAY======================================
    //== Main Scene ==
    gRaycastColecMain.push(gOpt1, gOpt2, gOpt3);
    gRCDict.set(gOpt1, gGlassSphere);
    gRCDict.set(gOpt2, gGlassSphere2);
    gRCDict.set(gOpt3, gGlassSphere3);

      gSceneLoadState.Main = true;
}

async function LoadTransformScene()
{
  if (gSceneLoadState.Transform == true) {return}
   //Clear screen to solid color
  gActiveMainLoop = LoadLoop;
  document.getElementById("Gif").style.opacity = 1.0;
  document.getElementById("LoadTxt").style.opacity = 1.0;

  gTime = new Date();
  let initTime = gTime.getTime() * .001;
  let LoadTxt = document.getElementById("LoadTxt");

  const [
    GirlText,
    GirlFullText,
    GlassNoiseNormText,
    GlassDisplacementText,
    VeinsText,
    FlowerBloomText,
    VeinTree1Text,
    VeinTree2Text,
] = await Promise.all([
    loadTexture(gGL, './Textures/Girl.png', 4),
    loadTexture(gGL, './Textures/GirlTextureFull.png', 4),
    loadTexture(gGL, './Textures/GlassNoiseNorm.png', 4),
    loadTexture(gGL, './Textures/GlassDisplacement.png', 4),
    loadTexture(gGL, './Textures/Veins.png', 4),
    loadTexture(gGL, './Textures/FlowerBloom.png', 4),
    loadTexture(gGL, './Textures/VeinTreeThin.png', 4),
    loadTexture(gGL, './Textures/VeinTreeThin2.png', 4),
]);
   const assets = [
    {key: 'charFullBodyUp', path: './models/CharFullBodyLP.obj'},
    {key: 'charHairTrans', path: './models/CharHairTrans.obj'},
    {key: 'fleshCube', path: './models/FleshCube.obj'},
    {key: 'flowerBloom', path: './models/FlowerBloom.obj'},
    {key: 'flowerStem', path: './models/FlowerStem.obj'},
    {key: 'flowerBud', path: './models/FlowerBud.obj'},
    {key: 'flowerWilting', path: './models/FlowerWilting.obj'},
    {key: 'home', path: './models/Home.obj'},
    {key: 'play', path: './models/Play.obj'},
    {key: 'pause', path: './models/Pause.obj'},
    {key: 'uiBacking', path: './models/UIBacking.obj'},
    {key: 'veinThick1', path: './models/VeinsThick.obj'},
    {key: 'veinThin1', path: './models/VeinsThin.obj'},
   ];


   const results = await Promise.all(
    assets.map(a => LoadOBJ(gGL, a.path))
);
  const [charFullBodyUp, charHairTrans, fleshCube, 
        flowerBloom, flowerStem, flowerBud, flowerWilting, home, play, pause, uiBacking, veinThick1,
      veinThin1] = results;
  gCharTrans = charFullBodyUp;

  //======MODEL AND TEXT ASSIGN ==========  
  gCharTrans.Texture = GirlFullText;
  gCharTrans.Texture3D = gNoise3DText;

  gCharHairTrans = charHairTrans;
  gCharHairTrans.Texture = GirlText;
  gCharHairTrans.Texture3D = gNoise3DText;
  gFleshGroundL = fleshCube;
  gFleshGroundL.Texture3D = gNoise3DText;
  gFleshGroundL.TextureBN = GlassNoiseNormText;
  gFleshGroundL.Texture = VeinsText;
  gFleshGroundR = fleshCube;
  gFleshGroundR.Texture3D = gNoise3DText;
  gFleshGroundR.TextureBN = GlassNoiseNormText;
  gFleshGroundR.Texture = VeinsText;
  gFleshParticles.DepthTexture = VeinsText;

  gFlower = flowerBloom;
  let Target = flowerStem;
  let Target2 = flowerBud;
  let gTarget3 = flowerWilting;
  gFlower.vertexBuffer2 = Target.vertexBuffer;
  gFlower.vertexBuffer3 = Target2.vertexBuffer;
  gFlower.vertexBuffer4 = gTarget3.vertexBuffer;
  gFlower.Texture = FlowerBloomText;
  gFlower.TextureBN = FlowerBloomText;

  gHomeButton = home;
  gPlayButton = play;
  gPauseButton = pause;
  gUIBacking = uiBacking;


  let LocTreeColec = new Array(11);

  LocTreeColec[0] = Object.assign({}, veinThin1); //Vein opt 1
  LocTreeColec[0].TextureBN = VeinTree1Text; //need to set morph
  LocTreeColec[0].Texture = VeinTree1Text;
  LocTreeColec[0].vertexBuffer2 = Object.assign({}, veinThick1).vertexBuffer;
  LocTreeColec[1] = Object.assign({}, veinThin1); // Vein opt 2
  LocTreeColec[1].TextureBN = VeinTree2Text; //need to set morph
  LocTreeColec[1].Texture = VeinTree2Text;
  LocTreeColec[1].vertexBuffer2 = Object.assign({}, veinThick1).vertexBuffer;
  LocTreeColec[2] = Object.assign({}, veinThin1); // Vein opt 2
  LocTreeColec[2].TextureBN = VeinTree2Text; //need to set morph
  LocTreeColec[2].Texture = VeinTree1Text;
  LocTreeColec[2].vertexBuffer2 = Object.assign({}, veinThick1).vertexBuffer;
  LocTreeColec[3] = Object.assign({}, veinThin1); // Vein opt 2
  LocTreeColec[3].TextureBN = VeinTree2Text; //need to set morph
  LocTreeColec[3].Texture = VeinTree2Text;
  LocTreeColec[3].vertexBuffer2 = Object.assign({}, veinThick1).vertexBuffer;
  LocTreeColec[4] = Object.assign({}, veinThin1); // Vein opt 2
  LocTreeColec[4].TextureBN = VeinTree2Text; //need to set morph
  LocTreeColec[4].Texture = VeinTree1Text;
  LocTreeColec[4].vertexBuffer2 = Object.assign({}, veinThick1).vertexBuffer;
  LocTreeColec[5] = Object.assign({}, veinThin1); // Vein opt 2
  LocTreeColec[5].TextureBN = VeinTree2Text; //need to set morph
  LocTreeColec[5].Texture = VeinTree2Text;
  LocTreeColec[5].vertexBuffer2 = Object.assign({}, veinThick1).vertexBuffer;
  LocTreeColec[6] = Object.assign({}, veinThin1); // Vein opt 2
  LocTreeColec[6].TextureBN = VeinTree2Text; //need to set morph
  LocTreeColec[6].Texture = VeinTree1Text;
  LocTreeColec[6].vertexBuffer2 = Object.assign({}, veinThick1).vertexBuffer;
  LocTreeColec[7] = Object.assign({}, veinThin1); // Vein opt 2
  LocTreeColec[7].TextureBN = VeinTree2Text; //need to set morph
  LocTreeColec[7].Texture = VeinTree2Text;
  LocTreeColec[7].vertexBuffer2 = Object.assign({}, veinThick1).vertexBuffer;
  LocTreeColec[8] = Object.assign({}, veinThin1); // Vein opt 2
  LocTreeColec[8].TextureBN = VeinTree2Text; //need to set morph
  LocTreeColec[8].Texture = VeinTree1Text;
  LocTreeColec[8].vertexBuffer2 = Object.assign({}, veinThick1).vertexBuffer;
  LocTreeColec[9] = Object.assign({}, veinThin1); // Vein opt 2
  LocTreeColec[9].TextureBN = VeinTree2Text; //need to set morph
  LocTreeColec[9].Texture = VeinTree2Text;
  LocTreeColec[9].vertexBuffer2 = Object.assign({}, veinThick1).vertexBuffer;
  LocTreeColec[10] = Object.assign({}, veinThin1); // Vein opt 2
  LocTreeColec[10].TextureBN = VeinTree2Text; //need to set morph
  LocTreeColec[10].Texture = VeinTree1Text;
  LocTreeColec[10].vertexBuffer2 = Object.assign({}, veinThick1).vertexBuffer;

  gScreenSpaceQuadTrans.Texture = GlassDisplacementText;
  gScreenSpaceQuadTrans.TextureBN = GirlFullText;

  //======= SET PARENTING ===================
  gCharHairTrans.ParentTrans = gCharTrans;
  gCharHairTrans.ParentScale = gCharTrans;
  gHomeButton.ParentTrans = gUIBacking;
  gHomeButton.ParentScale = gUIBacking;
  gPauseButton.ParentTrans = gUIBacking;
  gPauseButton.ParentScale = gUIBacking;
  gPlayButton.ParentTrans = gUIBacking;
  gPlayButton.ParentScale = gUIBacking;
//======= SET POSITIONS ===================
let CharTransScale = 14.0;
gCharTrans.Position = [0.0,10.0,0.0];
gCharTrans.Scale = [CharTransScale,CharTransScale,CharTransScale];
gCharTrans.Rotation = [0.0,180.0,0.0];
gCharHairTrans.Position = [0.0,0.0,0.0];
gCharHairTrans.Rotation = [0.0,0.0,0.0];
gCharHairTrans.Scale = [1.0,1.0,1.0];
let FleshGroundScale = 130.0;
gFleshGroundL.Position = [0.0,-145.0,-100.0];
gFleshGroundL.Rotation = [0.0,-20.0,0.0];
gFleshGroundL.Scale = [FleshGroundScale*1.1,FleshGroundScale * .4,FleshGroundScale];
gFleshGroundL.Color = [.8,0.0,.4, 1.0];
gFleshGroundL.uvScale = [5.0, 5.0];
gFleshGroundR.Position = [0.0,-150.0,-120.0];
gFleshGroundR.Rotation = [0.0, -60.0,0.0];
gFleshGroundR.Scale = [FleshGroundScale * 1.1,FleshGroundScale * .4,FleshGroundScale];
gFleshGroundR.Color = [.8,0.0,.25, 1.0];
gFleshGroundR.uvScale = [5.0, 5.0];
let FleshPartScale = 1.0;
gFleshParticles.Position = [0.0,90.0,0.0];
gFleshParticles.Rotation = [0.0,0.0,0.0];
gFleshParticles.Scale = [FleshPartScale,FleshPartScale * 4.0,FleshPartScale];
gFlower.Position = [0.0,0.0,30.0];
gFlower.Rotation = [0.0,0.0,0.0];
gFlower.Scale = [3.0, 3.0, 3.0];

let UIScale = 10.0;
gHomeButton.Position = [0.0, 0.0, 2.75];
gHomeButton.Rotation = [0.0, 0.0, 0.0];
gHomeButton.Scale = [1.0, 1.0, 1.0];
gHomeButton.Color = [.8, .8, .8, 1.0];

gPlayButton.Position = [0.0, 0.0, .75];
gPlayButton.Rotation = [0.0, 0.0, 0.0];
gPlayButton.Scale = [1.0, 1.0, 1.0];
gPlayButton.Color = [0.0, .8, .8, 1.0];

gPauseButton.Position = [0.0, 0.0, -2.0];
gPauseButton.Rotation = [0.0, 0.0, 0.0];
gPauseButton.Scale = [1.0, 1.0, 1.0];
gPauseButton.Color = [.8, .8, .8, 1.0];

gUIBacking.Position = [160.0,0.0,0.0];
gUIBacking.Rotation = [0.0,90.0,0.0];
gUIBacking.Scale = [UIScale, UIScale, UIScale];
gUIBacking.Color = [.8, .1, .2, 1.0];




//==========TREES==========
let TreeScale = 20.0;
let T1Scale = TreeScale * 1.0;
LocTreeColec[0].Position = [-150.0,-110.0,0.0];
LocTreeColec[0].Rotation = [0.0,0.0,20.0];
LocTreeColec[0].Scale = [T1Scale, T1Scale, T1Scale];
LocTreeColec[0].Color = [.8,0.0,0.1, 1.0];

let T2Scale = TreeScale * .8;
LocTreeColec[1].Position = [-130.0,-110.0,60.0];
LocTreeColec[1].Rotation = [30.0,50.0,50.0];
LocTreeColec[1].Scale = [T2Scale, T2Scale, T2Scale];
LocTreeColec[1].Color = [.8,0.0,0.1, 1.0];

let T3Scale = TreeScale * 1.2;
LocTreeColec[2].Position = [-90.0,-110.0,100.0];
LocTreeColec[2].Rotation = [60.0,-120.0,20.0];
LocTreeColec[2].Scale = [T3Scale, T3Scale, T3Scale];
LocTreeColec[2].Color = [.8,0.0,0.1, 1.0];

let T4Scale = TreeScale * .6;
LocTreeColec[3].Position = [-90.0,-75.0,100.0];
LocTreeColec[3].Rotation = [60.0,20.0,20.0];
LocTreeColec[3].Scale = [T4Scale, T4Scale, T4Scale];
LocTreeColec[3].Color = [.8,0.0,0.1, 1.0];

let T5Scale = TreeScale * 1.5;
LocTreeColec[4].Position = [-110.0,-80.0,100.0];
LocTreeColec[4].Rotation = [20.0,0.0,-10.0];
LocTreeColec[4].Scale = [T5Scale, T5Scale, T5Scale];
LocTreeColec[4].Color = [.8,0.0,0.1, 1.0];

let T6Scale = TreeScale * 1.8;
LocTreeColec[5].Position = [-20.0,-70.0,120.0];
LocTreeColec[5].Rotation = [20.0,-30.0,-10.0];
LocTreeColec[5].Scale = [T6Scale, T6Scale, T6Scale];
LocTreeColec[5].Color = [.8,0.0,0.1, 1.0];

let T7Scale = TreeScale * 1.3;
LocTreeColec[6].Position = [45.0,-100.0,100.0];
LocTreeColec[6].Rotation = [40.0,-10.0,-10.0];
LocTreeColec[6].Scale = [T7Scale, T7Scale, T7Scale];
LocTreeColec[6].Color = [.8,0.0,0.1, 1.0];

let T8Scale = TreeScale * .95;
LocTreeColec[7].Position = [80.0,-100.0,80.0];
LocTreeColec[7].Rotation = [10.0,10.0,-10.0];
LocTreeColec[7].Scale = [T8Scale, T8Scale, T8Scale];
LocTreeColec[7].Color = [.8,0.0,0.1, 1.0];

let T9Scale = TreeScale * .6;
LocTreeColec[8].Position = [120.0,-100.0,75.0];
LocTreeColec[8].Rotation = [30.0,-10.0,-10.0];
LocTreeColec[8].Scale = [T9Scale, T9Scale, T9Scale];
LocTreeColec[8].Color = [.8,0.0,0.1, 1.0];

let T10Scale = TreeScale * .7;
LocTreeColec[9].Position = [120.0,-90.0,85.0];
LocTreeColec[9].Rotation = [-20.0,-30.0,-40.0];
LocTreeColec[9].Scale = [T10Scale, T10Scale, T10Scale];
LocTreeColec[9].Color = [.8,0.0,0.1, 1.0];

let T11Scale = TreeScale * .9;
LocTreeColec[10].Position = [40.0,-80.0,100.0];
LocTreeColec[10].Rotation = [-10.0,-10.0,-10.0];
LocTreeColec[10].Scale = [T11Scale, T11Scale, T11Scale];
LocTreeColec[10].Color = [.8,0.0,0.1, 1.0];

for (let i = 0; i < LocTreeColec.length; i++)
{
  gTreeColec.push(LocTreeColec[i]);
}
  //==== Armature Setup ====== 
  
  let CharBoneImageNameColec = ["Torso", "Chest", "LShould", "LForearm", "LArm", "LHand", "RShould", "RForearm",
                                "RArm", "RHand", "Head", "WaistL", "ThighL", "CalfL", "FootL", "WaistR", "ThighR",
                                "CalfR", "FootR", "Head.001"];
  let CharBoneParentsColec = ["null", "Torso", "Chest", "LShould", "LForearm", "LArm", "Chest", "RShould",
                              "RForearm", "RArm", "Chest", "Torso", "WaistL", "ThighL", "CalfL", "Torso", "WaistR",
                              "ThighR", "CalfR", "Head"];

  //let VertWeightDataColec = await LoadWeightsTXT('./WeightTxt/',CharBoneImageNameColec, gCharTrans);   
  let VertWeightDataColec = null; // set to null rn to not load                       
  console.log(CharBoneImageNameColec.length + " " + CharBoneParentsColec.length);
  let BoneData = await LoadBones("./WeightImagesUpsc/",CharBoneImageNameColec, CharBoneParentsColec);
  gCharBoneColec = BoneData.colec;

  gCharBoneColec[0].Origin = vec3.fromValues(0.0, 0.0, 0.0); //Torso
  gCharBoneColec[1].Origin = vec3.fromValues(0.0, 1.0, 0.0); //Chest
  gCharBoneColec[2].Origin = vec3.fromValues(-1.0, 2.0, 0.0); //LShould
  gCharBoneColec[3].Origin = vec3.fromValues(-1.0, 1.0, 0.0); //LForearm
  gCharBoneColec[4].Origin = vec3.fromValues(-1.0, 0.0, 0.0); //LArm
  gCharBoneColec[5].Origin = vec3.fromValues(-1.0, -1.0, 0.0); //LHand
  gCharBoneColec[6].Origin = vec3.fromValues(1.0, 2.0, 0.0); //RShould
  gCharBoneColec[7].Origin = vec3.fromValues(1.0, 1.0, 0.0); //RForearm
  gCharBoneColec[8].Origin = vec3.fromValues(1.0, 0.0, 0.0); //RArm
  gCharBoneColec[9].Origin = vec3.fromValues(1.0, -1.0, 0.0); //RHand
  gCharBoneColec[10].Origin = vec3.fromValues(0.0, 3.0, 0.0); //Head
  gCharBoneColec[11].Origin = vec3.fromValues(-1.0, -.5, 0.0); //WaistL
  gCharBoneColec[12].Origin = vec3.fromValues(-1.0, -1.0, 0.0); //ThighL
  gCharBoneColec[13].Origin = vec3.fromValues(-1.0, -1.5, 0.0); //CalfL
  gCharBoneColec[14].Origin = vec3.fromValues(-1.0, -2.0, 0.0); //FootL
  gCharBoneColec[15].Origin = vec3.fromValues(1.0, -.5, 0.0); //WaistR
  gCharBoneColec[16].Origin = vec3.fromValues(1.0, -1.0, 0.0); //ThighR
  gCharBoneColec[17].Origin = vec3.fromValues(1.0, -1.5, 0.0); //CalfR
  gCharBoneColec[18].Origin = vec3.fromValues(1.0, -2.0, 0.0); //FootR
  gCharBoneColec[19].Origin = vec3.fromValues(0.0, 4.0, 0.0); //Head.001


  let CharStringColec = [];
  CharStringColec = BoneData.stringColec;
  let AllCharClips = new CharClips();
  await AllCharClips.setupClips();
  gCharArmature = new Armature(gCharBoneColec, gCharTrans, CharStringColec, VertWeightDataColec, gTimeSinceRun * .001, AllCharClips);
  await gCharArmature.setUpUniforms();
  gMidiObj = new MidiObj(gCharArmature.Timeline, AllCharClips);
  await gMidiObj.LoadFile('./MidiFiles/RetimedTrigger.mid');
  LoadTxt.style.color = '#09e2ed';

  //=========== RAYCAST SETUP =========================
  gRaycastColecTransform.push(gHomeButton, gPauseButton, gPlayButton);

  //Surface Mapping
  let MinDist = 1.0;
  let NumObj = 500; // Make this one mesh
  let ModelMat = mat4.create();
  SetUpModelMatrix(ModelMat, gCharTrans);
  await PlaceColecOnSurf(gCharTrans.vertices, gCharTrans.vertexNormals,ModelMat,'./models/Cube.obj', 
  MinDist,NumObj, gSurfObjColec, gSurfColecVertIndicies);


  gTime = new Date();
  let NewTime = gTime.getTime() * .001;
  let DeltaTime = NewTime - initTime;
  initTime = NewTime;
  console.log("Time to load Trans Scene : " + DeltaTime);

  gSceneLoadState.Transform = true;
}
async function LoadAboutMe()
{
    if (gSceneLoadState.AboutMe == true) {return}
     //Clear screen to solid color
    gActiveMainLoop = LoadLoop;
    document.getElementById("Gif").style.opacity = 1.0;
    document.getElementById("LoadTxt").style.opacity = 1.0;
   

    gTime = new Date();
    let initTime = gTime.getTime() * .001;
    let LoadTxt = document.getElementById("LoadTxt");
    LoadTxt.style.color = 'ffb700';

    const [
      EarRingText,
      BodyText,
      HairText,
      ShirtText,
      ShoeText,
      SkirtText,
      SocksText,
      ShoeLaceText,
    ] = await Promise.all([
      loadTexture(gGL, './Textures/CharMeTexts/EarRing.png', 4, false),
      loadTexture(gGL, './Textures/CharMeTexts/Body.png', 4, false),
      loadTexture(gGL, './Textures/CharMeTexts/Hair.png', 4, false),
      loadTexture(gGL, './Textures/CharMeTexts/Shirt.png', 4, false),
      loadTexture(gGL, './Textures/CharMeTexts/Shoe.png', 4, false),
      loadTexture(gGL, './Textures/CharMeTexts/Skirt.png', 4, false),
      loadTexture(gGL, './Textures/CharMeTexts/Socks.png', 4, false),
      loadTexture(gGL, './Textures/CharMeTexts/ShoeLace.png', 4, false),
    ]);
    const assets = [
      {key: 'commissionsText', path: './models/CommissionsText.obj'},
      {key: 'gameAudioText', path: './models/GameAudioText.obj'},
      {key: 'soundDesignText', path: './models/SoundDesignText.obj'},
      {key: 'visualsText', path: './models/VisualsText.obj'},
      {key: 'contactText', path: './models/ContactText.obj'},
      {key: 'star', path: './models/Star.obj'},
    ];


    const results = await Promise.all(
      assets.map(a => LoadOBJ(gGL, a.path))
  );
    const [commissionsText, gameAudioText, soundDesignText, visualsText, contactText, star] = results;
    LoadTxt.style.color = 'fbff00';
    gSceneLoadState.AboutMe = true;

  ({ ModelMap: gCharMeDict, AnimationMixer: gCharMeAniMixer, AnimationClips: gCharMeAniClips, AniScene: gSceneAboutMe} = await LoadThreeScene('./models/CharTest3.glb'));
  //console.log(gCharMeDict);
  //Skirt, Body, EarRing, Hair, Shirt, ShoeL, ShoeR, Socks, ShoeLaceL, ShoeLaceR

  gCharMeDict.get("Skirt").Texture =  SkirtText;
  gCharMeDict.get("Body").Texture =  BodyText;
  gCharMeDict.get("EarRing").Texture =  EarRingText;
  gCharMeDict.get("Hair").Texture =  HairText;
  gCharMeDict.get("Shirt").Texture =  ShirtText;
  gCharMeDict.get("ShoeL").Texture =  ShoeText;
  gCharMeDict.get("ShoeR").Texture =  ShoeText;
  gCharMeDict.get("Socks").Texture =  SocksText;
  gCharMeDict.get("ShoeLaceL").Texture =  ShoeLaceText;
  gCharMeDict.get("ShoeLaceR").Texture =  ShoeLaceText;

  gStar2 = star;
  gCharMeDict.forEach((val, key) =>
  {
    if (key != "Body")
    {
      val.ParentTrans = gCharMeDict.get("Body");
      val.ParentScale = gCharMeDict.get("Body");
    }
  })
  gCharMeDict.get("Body").Rotation[1] = 180.0;

  gCommissionsText = commissionsText;
  gGameAudioText = gameAudioText;
  gSoundDesignText = soundDesignText;
  gVisualsText = visualsText;
  gContactText = contactText;
  LoadTxt.style.color = 'aaff00';
  let StarScale = 2.0;
    gStar2.Position = [-20.0,0.0,0.0];
    gStar2.Rotation = [90.0,0.0,0.0];
    gStar2.Scale = [StarScale, StarScale, StarScale];
    gStar2.Color = [1.0, 1.0, 1.0, 1.0];

    let TextSize = 34.0;
    let TextColor = [.6,.2,.8,1.0];
    gCommissionsText.Position = [350.0, 100.0,0.0];
    gCommissionsText.Rotation = [0.0,180.0,0.0];
    gCommissionsText.Scale = [TextSize, TextSize, TextSize];
    gCommissionsText.Color = TextColor;
    gGameAudioText.Position = [330, 40.0,0.0];
    gGameAudioText.Rotation = [0.0,180.0,0.0];
    gGameAudioText.Scale = [TextSize, TextSize, TextSize];
    gGameAudioText.Color = [.4, .2, .5, 1.0];
    gSoundDesignText.Position = [320, -80.0,0.0];
    gSoundDesignText.Rotation = [0.0,180.0,0.0];
    gSoundDesignText.Scale = [TextSize, TextSize, TextSize];
    gSoundDesignText.Color = [0.0, .65, .4, 1.0];
    gVisualsText.Position = [340, -170.0,0.0];
    gVisualsText.Rotation = [0.0,180.0,0.0];
    gVisualsText.Scale = [TextSize, TextSize, TextSize];
    gVisualsText.Color = [.2, .4, .5, 1.0];
    gContactText.Position = [-60, 50.0,0.0];
    gContactText.Rotation = [0.0,180.0,0.0];
    gContactText.Scale = [TextSize, TextSize, TextSize];
    gContactText.Color = TextColor;
    LoadTxt.style.color = '08c979';


    let StarNum = 70;
    let RandMagPos = 400.0;
    let RandMagRot = 180.0;
    let RandScale = 1.0;
    for (let i = 0; i< StarNum; i++)
    {
      let Pole = [Math.random() < .5 ? -1.0 : 1.0, Math.random() < .5 ? -1.0 : 1.0, Math.random() < .5 ? -1.0 : 1.0];
      let Pos = [gStar2.Position[0] + (Math.random() * RandMagPos * Pole[0]), gStar2.Position[1] + (Math.random() * RandMagPos * Pole[1]), gStar2.Position[2] + (Math.random() * RandMagPos * Pole[2])];
      let Rot = [gStar2.Rotation[0], gStar2.Rotation[1] + (Math.random() * RandMagRot),gStar2.Rotation[2]];
      let Scale = [gStar2.Scale[0] * (.5 + (Math.random() * RandScale)), gStar2.Scale[1] * (.5 + (Math.random() * RandScale)), gStar2.Scale[2] * (.5 + (Math.random() * RandScale))];
      let StarTrans = new Transform(Pos, Rot, Scale);
      gStarTransforms.push(StarTrans);
    }
    gSceneLoadState.AboutMe = true;
}
async function LoadFluidSim()
{
  if (gSceneLoadState.LiquidSim == true) {return}
  //Clear screen to solid color
  gActiveMainLoop = LoadLoop;
  document.getElementById("Gif").style.opacity = 1.0;
  document.getElementById("LoadTxt").style.opacity = 1.0;

  gTime = new Date();
  let initTime = gTime.getTime() * .001;
  let LoadTxt = document.getElementById("LoadTxt");
  LoadTxt.style.color = 'ffb700';
  let ScreenSpaceOrigin = [0.0,0.0,0.0];
  let FluidSimQuad = new Quad(gShaderProgramSkybox, null, null,0,null,null,[],[],[1.0,1.0,1.0,1.0],
    [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0], null, null, null, null, null, null, null);
  GenerateQuad(FluidSimQuad,1.0,ScreenSpaceOrigin); 
  let SimDim = [950, 512];
  let StartVals = [255, 255, 255, 255];
  let IterNum = 20;
  gFluidSimObj = new FluidSim2D(FluidSimQuad, SimDim, StartVals, IterNum);
  await gFluidSimObj.SetUpText();
  await gFluidSimObj.UpdateText();
  console.log(gFluidSimObj);

  //Make sure load is cleared if not caught in load loop
  document.getElementById("Gif").style.opacity = 0.0;
  document.getElementById("LoadTxt").style.opacity = 0.0;
  gGL.clearColor(0.0, 0.0, 0.0, 0.0); //Pink
  gGL.clear(gGL.COLOR_BUFFER_BIT); //Command to clear buffer bit and fill with clear color


  gSceneLoadState.LiquidSim = true;

}




export async function SpawnModel(Position, Rotation, Scale, Dir, ModelColec, TextDir, lifeSpan, 
  SecondDir = null, ThirdDir = null, FourthDir = null, FithDir = null,)
{
  let Model = await LoadOBJ(gGL, Dir);
  if (SecondDir != null)
  {
    let Model2 = await LoadOBJ(gGL, SecondDir);
    Model.vertexBuffer2 = Model2.vertexBuffer;
    Model.TextureBN = await loadTexture(gGL, TextDir, 4);
  }
  if (ThirdDir != null)
  {
    let Model3 = await LoadOBJ(gGL, ThirdDir);
    Model.vertexBuffer3 = Model3.vertexBuffer;
  }
  if (FourthDir != null)
  {
    let Model4 = await LoadOBJ(gGL, FourthDir);
    Model.vertexBuffer4 = Model4.vertexBuffer;
  }
  if (FithDir != null)
  {
    let Model5 = await LoadOBJ(gGL, FithDir);
    Model.vertexBuffer5 = Model5.vertexBuffer;
  }
  Model.Texture = await loadTexture(gGL, TextDir, 4);
  Model.Position = Position;
  Model.Rotation = Rotation;
  Model.Scale = Scale;
  Model.Color = [1.0,1.0,1.0,1.0];
  Model.spawnTime = gTimeSinceRun * .001;
  Model.lifeSpan = lifeSpan;
  Model.Alpha = 1.0;
  Model.StartY = Model.Position[1];
  ModelColec.push(Model);
}
function WaveUpdateMesh(WaveObj, Speed)
{ 
    let WaveAmp = [1.6,2.2,1.4, 1.2];
    let WaveSize = [.3,.26,.2, .76];
    let WaveSpeeds = [.7 * Speed,1.1 * Speed,1.5 * Speed, .8 * Speed];
    let NoiseDetail = [.3, .2,.3];
    let NoiseAmp = .5;
    let TimeSec = gTime.getTime() * .001 * Speed;
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
function Draw(programInfo, Object, Camera, Light, Armature = null, MidiObject = null)
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
         setPositionAttribute(Object, programInfo, Camera, Light, gGL, gTimeSinceRun, Armature, MidiObject); 
      
        
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
function touchHandler(e) //For Mobile
{
  if (e.touches) {
    gTouchDelta[0] = ((e.touches[0].pageX / gCanvasWidth) - .5) * gTouchSpeed * gCanvasAspect;
    gTouchDelta[1] = (((e.touches[0].pageY * 2.0) / gCanvasHeight) - .5) * gTouchSpeed;
    console.log(e.touches[0].pageX + " " +  gCanvasWidth);
    e.preventDefault();
  }
}
function Input() //For Computer
{
    //Forward = 0
    //Backwards = 1
    //Left = 2
    //Right = 3 const Camera = makeStruct("Eye, ViewDir, UpDir");
    let Direction = -1;
    if (gKeysPressed['w']){Direction = 0; CameraMove(gCamera, Direction, DeltaTime);}
    if (gKeysPressed['s']){Direction = 1; CameraMove(gCamera, Direction, DeltaTime);}
    if (gKeysPressed['a']){Direction = 2; CameraMove(gCamera, Direction, DeltaTime);}
    if (gKeysPressed['d']){Direction = 3; CameraMove(gCamera, Direction, DeltaTime);}
    if (gKeysPressed['p'] && gActiveMainLoop == TransformationLoop){PlayTransformSong();}
    if (gKeysPressed['y'] && !gConditions.AudioInit) { document.getElementById("PlayMusic").style.opacity = 0.0; if (gAudioContext.state == "suspended" ){gAudioContext.resume();} AcceptObj.Play(0); MainThemeObj.Play(1); gConditions.AudioInit = true;}
    if (gKeysPressed['n']) { document.getElementById("PlayMusic").style.opacity = 0.0;}
    if (gKeysPressed['Tab'] && document.pointerLockElement === gCanvas){document.exitPointerLock();gKeysPressed['Tab'] = false;} // so I don't leave zoom callws :(
    if (gKeysPressed['h'] && (gActiveMainLoop == AboutMeLoop || gActiveMainLoop == FluidVisLoop)) {document.getElementById("GoHome").style.opacity = 0.0; GoHome();}
    if (gKeysPressed['x'] && gActiveMainLoop == TransformationLoop) {document.getElementById("ExitCam").style.opacity = 0.0; gCamera.ActiveAniClip = null;} //exit camera animation
    if (gKeysPressed['i'] && gActiveMainLoop == TransformationLoop) {document.getElementById("ExitCam").style.opacity = 0.0;} //Hide Exit Message


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
  //console.log(gRaycastIndex);

  for (let Obj of gRaycastColecMain)//reset all to deselect color
    {
      Obj.Color = DeselectColor;
      let DispObj = gRCDict.get(Obj);
      if (DispObj != null && "isHover" in DispObj){DispObj.isHover = 0.0;}
    }

    for (let Obj of gRaycastColecTransform)//reset all to deselect color
    {
      Obj.Color = DeselectColor;
      let DispObj = gRCDict.get(Obj);
      if (DispObj != null && "isHover" in DispObj){DispObj.isHover = 0.0;}
    }


  if (gActiveMainLoop == MainLoop)
  {
    if (ObjIndex == -1) {return null;}

    let ObjSelec = gRaycastColecMain[ObjIndex];
    if (ObjSelec == undefined) {return null;}
    ObjSelec.Color = SelectColor;
    let DispObj = gRCDict.get(ObjSelec);
    if (DispObj != null && "isHover" in DispObj){DispObj.isHover = 1.0;}
}
else if(gActiveMainLoop == TransformationLoop)
{
  if (ObjIndex == -1) {return null;}

  let ObjSelec = gRaycastColecTransform[ObjIndex];
  //console.log(ObjSelec);
  //console.log("Index " + ObjIndex + " Raycast Colec " + gRaycastColecTransform.length);
  ObjSelec.Color = SelectColor;
  let DispObj = gRCDict.get(ObjSelec);
  if (DispObj != null && "isHover" in DispObj){DispObj.isHover = 1.0;}
}
  
  

}
async function RaycastClick(Obj)
{
  let DeselectColor = [.2,.2,.5,1.0];
  gRaycastIndex = -1;
  for (let Obj of gRaycastColecTransform)//reset all to deselect color
    {
      Obj.Color = DeselectColor;
    }
  switch(Obj){
    case gOpt1:
      if (gSceneLoadState.Transform == false) {await LoadTransformScene();}
      gActiveMainLoop = TransformationLoop;
      console.log("ENTERING TRANSFORMATION LOOP");
      gCamera.Eye[2] = -150.0;
      gCamera.Eye[1] = 25.0;
      gCharArmature.StartTime = gTimeSinceRun * .001;
      SoundMainTheme.currentTime = 0;
      SoundMainTheme.pause();
      SoundTransformSound.pause();
      SoundTransformSound.currentTime = 0;
      gMidiObj.StartMidi();
      gMidiObj.StopMidi();
      gCharArmature.Timeline.clearAniClips();
      document.getElementById("PlayMusic").style.opacity = 0.0;
      break;
    case gOpt2:
      if (gSceneLoadState.AboutMe == false) {await LoadAboutMe();}
      gCamera.Mode = 1;
      gActiveMainLoop = AboutMeLoop;
      gCamera.Eye[2] = -550.0;
      gCamera.Eye[1] = 0.0;
      gCamera.UpDir = [0.0,1.0,0.0];
      SoundMainTheme.currentTime = 0;
      SoundMainTheme.pause();
      SoundTransformSound.pause();
      SoundTransformSound.currentTime = 0;
      document.getElementById("PlayMusic").style.opacity = 0.0;
      document.getElementById("GoHome").style.opacity = 1.0;
      let Speed = .7;
      gCharMeAniMixer = AddAnimation(gSceneAboutMe, gCharMeAniMixer, gCharMeAniClips[0], Speed);
      TriggerAboutMeSong();
      break;
    case gOpt3:
      if (gSceneLoadState.LiquidSim == false) {await LoadFluidSim();}
      document.exitPointerLock();
      gActiveMainLoop = FluidVisLoop;
      gCamera.Eye = [0.0,0.0,0.0];
      SoundMainTheme.currentTime = 0;
      SoundMainTheme.pause();
      document.getElementById("PlayMusic").style.opacity = 0.0;

      break;
    case gHomeButton:
        document.getElementById("ExitCam").style.opacity = 0.0;
        GoHome();
      break
    case gPauseButton:
      document.getElementById("ExitCam").style.opacity = 0.0;
      console.log("Pausing");
      SoundTransformSound.pause();
      //Sound1.currentTime = 0;
      gMidiObj.StopMidi();
      break
    case gPlayButton:
      //document.getElementById("ExitCam").style.opacity = 1.0;
      console.log("Playing");
      PlayTransformSong();
      break
    case gCamAniOn: //not set up yet
      gCamera.ActiveAniClip = CamAniClips[0]; //Step 1 attatch camera aniclip to camera
      CamAniClips[0].ConnectedCamera = gCamera; //Step 2 assign attatched camera to ani clip
      break;
    default:
      break;
  }
}
function GoHome()
{
      gCamera.Mode = 0;
      gCamera.Eye = [0.0,10.0,0.0];
      gCamera.ViewDir = [0.0,0.0,1.0];
      if (gActiveMainLoop == AboutMeLoop) {StopAboutMeSong();}
      gActiveMainLoop = MainLoop;
      console.log("ENTERING MAIN LOOP");
      SoundTransformSound.pause();
      SoundTransformSound.currentTime = 0;
      if (gMidiObj != undefined) {gMidiObj.StopMidi()};
      SoundMainTheme.pause();
      SoundMainTheme.currentTime = 0;
      SoundMainTheme.play();
}
async function PlayTransformSong()
{
  //Woops I broke the animation with the loading :(
    await gMidiObj.StopMidi(); 
    SoundTransformSound.pause();
    //Sound1.currentTime = 0;
    SoundTransformSound.play();
    gMidiObj.StartMidi();
    gCamera.ActiveAniClip = CamAniClips[0];
    CamAniClips[0].ConnectedCamera = gCamera;
    //gCapturer.start();
    //gIsRecording = true; //Turnon to enable recording

}
function ClickFunc(event)
{
  MouseClickObj.Pause();
  MouseClickObj.Play(0); //Mouse click sound
  if (gAudioContext.state == "suspended" ){gAudioContext.resume();}
  console.log("Raycast Index is : " + gRaycastIndex);
  //== Request Pointer Lock ==
  console.log("Click detected, requesting pointer lock...");
  
  gCanvas.requestPointerLock = gCanvas.requestPointerLock ||
                              gCanvas.mozRequestPointerLock ||
                              gCanvas.webkitRequestPointerLock;
  
  if(document.activeElement == document.getElementById("Body"))
  {
    if (gCanvas.requestPointerLock && !gIsMobile && gActiveMainLoop != FluidVisLoop) {
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
        gCamera.Eye = [0.0,10.0,0.0];
        gCamera.ViewDir = [0.0,0.0,1.0];
        rcObj = gRaycastColecMain[gRaycastIndex];
        break;
      case TransformationLoop:
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
    DeltaTime = newTime - gPreviousTime;
    gTimeSinceRun = newTime - gTimeStart;
    gPreviousTime = newTime;

    Input();
    gMouseMoved = Math.abs(gDeltaMouse[0]) + Math.abs(gDeltaMouse[1]) >= .001 ? true : false;
    let LocDeltMouse = gIsMobile ? gTouchDelta : gDeltaMouse; //Mobile touch not set up yet 
    MouseLook(gCamera, LocDeltMouse);
    if (gFrameCount % 2 == 0)
    {
      WaveUpdateMesh(gSimpleWave, 1.0);
      CalculateNormals(gSimpleWave);
      CalculateBoatRot();
    }
    
      //Animation
      gSpellCircle.Rotation[1] += DeltaTime * .002; //Spell Volume Rotate
      gSpellCircleVolume.Rotation[1] = gSpellCircle.Rotation[1];
      gSpellCircleVolume.Scale[2] = 1.0 + (4.0 * Math.sin(gTime/800.0));//Spell Volume pulse
      gAtSign.Rotation[1] += DeltaTime * .25;
      let ViewMat = GetViewMatrix(gCamera);
      
      MainThemeObj.SetPan(ViewMat, gAudioContext.currentTime);


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
      let DeselectColor = [.2,.2,.5,1.0];
      let ObjIndex = 1; //start indexing at 1
      for(let obj of gRaycastColecMain)
      {
        gCamera.ObjectIndex = ObjIndex;
        Draw(gProgramInfoRaycast,obj,gCamera,gLight1); 
        ObjIndex++;
      }
      gRaycastText = gRaycastMap;
      if (gMouseMoved) {CheckRaycast(SelectColor, DeselectColor);}
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
    gGL.disable(gGL.CULL_FACE);
    
    Draw(gProgramInfoFlat, gBoatMesh, gCamera, gLight1);
    gGL.enable(gGL.CULL_FACE);
    gGL.depthMask(false);
    gGL.disable(gGL.DEPTH_TEST); 
    Draw(gProgramInfoWave,gSpellCircle, gCamera, gLight1);
    gGL.disable(gGL.CULL_FACE);
    Draw(gProgramInfoVolGlow,gSpellCircleVolume, gCamera, gLight1);
    gGL.depthMask(true);
    gGL.enable(gGL.DEPTH_TEST); 
    Draw(gProgramInfoDef, gOpt1, gCamera,gLight1);
    Draw(gProgramInfoDef, gOpt2, gCamera,gLight1);
    Draw(gProgramInfoDef, gOpt3, gCamera,gLight1);
    gGL.enable(gGL.CULL_FACE);
    Draw(gProgramInfoFlat, gMoon, gCamera, gLight1);
    
    
    StarLookAt(gStars, gCamera);
    Draw(gProgramInfoStar, gStars, gCamera, gLight1);
    gGL.depthMask(false);
    gGL.disable(gGL.DEPTH_TEST); 
    Draw(gProgramInfoCloud, gNoiseCube, gCamera, gLight1); //set fog as deactive for now
    //cause changing image type to float32 made it super inefficient
    gGL.enable(gGL.DEPTH_TEST);
    gGL.depthMask(true);
    

    gScreenSpaceQuad.Texture = gRenderText;
    gGlassSphere.Texture = gRenderText;
    gGlassSphere2.Texture = gRenderText;
    gGlassSphere3.Texture = gRenderText;
    gGL.bindFramebuffer(gGL.FRAMEBUFFER, gGlassFBO);   
    gGL.viewport(0, 0, gCanvasWidth, gCanvasHeight);
    gGL.disable(gGL.CULL_FACE);
    gGL.disable(gGL.DEPTH_TEST);
    Draw(gProgramInfoScreenRender, gScreenSpaceQuad, gCamera, gLight1);
    gGL.enable(gGL.CULL_FACE);
    Draw(gProgramInfoGlass, gGlassSphere, gCamera, gLight3);
    Draw(gProgramInfoGlass, gGlassSphere2, gCamera, gLight3);
    Draw(gProgramInfoGlass, gGlassSphere3, gCamera, gLight3);
    gGL.cullFace(gGL.BACK);
    gGL.enable(gGL.DEPTH_TEST);
    Draw(gProgramInfoFlat, gCharHead, gCamera, gLight1);
    Draw(gProgramInfoFlat, gCharHair, gCamera, gLight1);
    Draw(gProgramInfoDef, gAtSign, gCamera, gLight1);
    Draw(gProgramInfoColor, gMusicNote, gCamera, gLight1);
    gGL.disable(gGL.DEPTH_TEST);
    
    gScreenSpaceQuad.Texture = gGlassRendText;
    gGL.bindFramebuffer(gGL.FRAMEBUFFER, null); 
    gGL.disable(gGL.CULL_FACE);
    Draw(gProgramInfoScreenRender, gScreenSpaceQuad, gCamera, gLight1);
    if (document.pointerLockElement === gCanvas)
    {
      Draw(gProgramInfoScreenImage, gCrossHair, gCamera, gLight1);
    }
   
    
  
    gFrameCount++;
    gCycleNum++;
    
    if (gActiveMainLoop != MainLoop) {gInitLoad = true;}
    else {gInitLoad = false;}
    requestAnimationFrame(gActiveMainLoop);
}

//===================================================================================
//===================================================================================
//===================================================================================
const TransformationLoop = ()=>
{
  gTime = new Date();
  let newTime = gTime.getTime();
  DeltaTime = newTime - gPreviousTime;
  gTimeSinceRun = newTime - gTimeStart;
  gPreviousTime = newTime;
  if (gIsRecording) {gCaptureTime += DeltaTime * .001}
  

  Input();
  let LocDeltMouse = gIsMobile ? gTouchDelta : gDeltaMouse; //Mobile touch not set up yet 
  MouseLook(gCamera, LocDeltMouse);
  //Animation
  gCharArmature.ApplyAnimation(gTimeSinceRun * .001);
  gScreenSpaceQuadTrans.lightness = gMidiObj.ccVals[1];
  for (let i = 0; i < gTreeColec.length; i++)
  {
    gTreeColec[i].lightness = gMidiObj.ccVals[1];
  }
  gFleshGroundL.lightness = gMidiObj.ccVals[1];
  gFleshGroundR.lightness = gMidiObj.ccVals[1];
  gFleshParticles.Position[1] = -300.0 + (Math.abs(gSinView[Math.floor(gTimeSinceRun * .24) % WAVE_BUFFER_SIZE]) + gCharTrans.Position[1]) * 50.0;
  //console.log(" Elapsed Time " + SoundTransformSound.currentTime);
  if (gCamera.ActiveAniClip != null) //Camera Animation
      {
        if (gCamera.ActiveAniClip.Running == false)
        {
          gCamera.ActiveAniClip.Run(newTime * .001)
        }
        else
        {
          gCamera.ActiveAniClip.UpdateCam(newTime * .001);
        }
      }
  //======================RENDER RAYCAST============================
  ClearFBO(null, gGL);
  ClearFBO(gMainFBO, gGL);
  ClearFBO(gRaycastFBO, gGL);
  ClearFBO(gGlassFBO, gGL);
  ClearFBO(gBloomFBO, gGL);
  

  gGL.bindFramebuffer(gGL.FRAMEBUFFER, gRaycastFBO);
  gGL.viewport(0, 0, gCanvasWidth, gCanvasHeight);
  gGL.enable(gGL.DEPTH_TEST);
  gGL.enable(gGL.CULL_FACE);
  let SelectColor = [1.0,1.0,1.0,1.0];
  let DeselectColor = [.2,.3,.4,1.0];
  let ObjIndex = 1; //start indexing at 1
  for(let obj of gRaycastColecTransform)
  {
    gCamera.ObjectIndex = ObjIndex;
    Draw(gProgramInfoRaycast,obj,gCamera,gLight1); 
    ObjIndex++;
  }
  gRaycastText = gRaycastMap;
  gMouseMoved = Math.abs(gDeltaMouse[0]) + Math.abs(gDeltaMouse[1]) >= .001 ? true : false;
  if (gInitLoad || gMouseMoved) {CheckRaycast(SelectColor, DeselectColor);}
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
  gGL.clear(gGL.DEPTH_BUFFER_BIT); 
  //

  //======================RENDER BLOOM============================
  gGL.bindFramebuffer(gGL.FRAMEBUFFER, gBloomFBO);
  gGL.viewport(0, 0, gCanvasWidth/2.0, gCanvasHeight/2.0);
  gGL.enable(gGL.DEPTH_TEST);    
  gGL.clear(gGL.DEPTH_BUFFER_BIT); 
  gGL.enable(gGL.CULL_FACE); 
  Draw(gProgramInfoTrans, gCharTrans, gCamera, gLight1, gCharArmature, gMidiObj);
  Draw(gProgramInfoTrans, gCharHairTrans, gCamera, gLight1, null, gMidiObj);
  gGL.bindFramebuffer(gGL.FRAMEBUFFER, gMainFBO);  
  gPostProcessingQuad.TextureBN = gBloomRendText;
  gGL.viewport(0, 0, gCanvasWidth, gCanvasHeight);

  DrawCallSetup();

  //======================RENDER NORMALPASS============================
  gGL.cullFace(gGL.BACK);
  gGL.disable(gGL.CULL_FACE);
  gGL.disable(gGL.DEPTH_TEST);
  Draw(gProgramInfoScreenBGTrans,gScreenSpaceQuadTrans,gCamera, gLight1);
  gGL.enable(gGL.DEPTH_TEST);
  gGL.clear(gGL.DEPTH_BUFFER_BIT)
  Draw(gProgramInfoTrans, gCharTrans, gCamera, gLight1, gCharArmature, gMidiObj);
  Draw(gProgramInfoTrans, gCharHairTrans, gCamera, gLight1, null, gMidiObj);
  gGL.disable(gGL.CULL_FACE);
  Draw(gProgramInfoFlesh, gFleshGroundL, gCamera, gLight1, null, gMidiObj);
  Draw(gProgramInfoFlesh, gFleshGroundR, gCamera, gLight1, null, gMidiObj);
  gGL.enable(gGL.CULL_FACE);

  

  gGL.enable(gGL.CULL_FACE);
  gGL.cullFace(gGL.FRONT);
  let VertIndex;
  let ModelMatrix;
  let Pos = [0.0,0.0,0.0,0.0];
  let ScanY = gSinView[gTime % WAVE_BUFFER_SIZE] * 30;
  let ScanWidth = 3;
  let ScanYUpd = gSinView[(gTime * 10) % WAVE_BUFFER_SIZE] * 10;
  let ScanYUpdWidth = 2;
  if (gFrameCount % 2 == 0) //update surf obj positions
  {
    for (let i = 0; i < gSurfObjColec.length; i++)
    {
      ModelMatrix = mat4.create();
      VertIndex = Math.floor((Math.random() * gCharTrans.vertices.length / 3) - 4); 
      SetUpModelMatrix(ModelMatrix, gCharTrans);
      Pos = vec4.fromValues(gCharTrans.vertices[VertIndex*3], gCharTrans.vertices[VertIndex*3 + 1], gCharTrans.vertices[VertIndex*3 + 2], 1);
      Pos = vec4.transformMat4(Pos, Pos, ModelMatrix);
      if (!(Math.abs(Pos[0] - ScanYUpd) < ScanYUpdWidth)) {continue;}
      gSurfObjColec[i].Position = [Pos[0], Pos[1], Pos[2]];
    }
  }
  for (let i = 0; i < gSurfObjColec.length; i++) //Cubes
    {
    if (Math.abs(gSurfObjColec[i].Position[1] - ScanY) < ScanWidth) {continue;}
        //Draw(gProgramInfoDef, gSurfObjColec[i], gCamera, gLight1); //not running cubes rn
    }

  let ActiveBone;
  let age;
  for (let i = 0; i < gBoneColec.length; i++) //Bones
  {
    ActiveBone = gBoneColec[i];
    age = ActiveBone.spawnTime + ActiveBone.lifeSpan;
    ActiveBone.Alpha = .9 - (((gTimeSinceRun * .001) - ActiveBone.spawnTime) / ActiveBone.lifeSpan);
    Draw(gProgramInfoFlat, ActiveBone, gCamera, gLight1);
    if (age < (gTimeSinceRun * .001))
    {
      gBoneColec.splice(i, 1);
    }
  }
  gGL.disable(gGL.CULL_FACE);
  let ActiveFlower;
  for (let i = 0; i < gFlowerColec.length; i++)
  {
    ActiveFlower = gFlowerColec[i];
    age = ActiveFlower.spawnTime + ActiveFlower.lifeSpan;
    //ActiveFlower.Alpha = .9 - (((gTimeSinceRun * .001) - ActiveFlower.spawnTime) / ActiveFlower.lifeSpan);
    Draw(gProgramInfoMorph, ActiveFlower, gCamera, gLight1);
    if (age < (gTimeSinceRun * .001))
    {
      gFlowerColec.splice(i, 1);
    }
  }
  let ActiveAlmond;
  let GoalY = -50.0; // Yn
  let StartY; //Y0
  let N = 1.5;
  let t;
  for (let i=0; i < gAlmondColec.length; i++)
  {
    ActiveAlmond = gAlmondColec[i];
    StartY = ActiveAlmond.StartY;
    t = ((gTimeSinceRun* .001) - ActiveAlmond.spawnTime) / ActiveAlmond.lifeSpan;
    //ActiveAlmond.Position[1] = StartY * Math.pow(Math.pow((GoalY / StartY), (1/N)), t);
    ActiveAlmond.Position[1] = lerp(StartY, GoalY, t);
    if (t >= 1.0) {gAlmondColec.splice(i,1);} //t is above 1 when lifespan is filled
    Draw(gProgramInfoFlat, ActiveAlmond, gCamera, gLight1);
    gInitLoad = false;
  }

  


  for (let i = 0; i < gTreeColec.length; i++)
  {
    Draw(gProgramInfoTreeMorph, gTreeColec[i], gCamera, gLight1);
  }
  
    StarLookAt(gFleshParticles, gCamera);
    Draw(gProgramInfoFleshPart, gFleshParticles, gCamera, gLight1);
    if (gCamera.ActiveAniClip == null) //hide if playing camera animation
    {
      Draw(gProgramInfoDef, gHomeButton, gCamera,gLight1);
      Draw(gProgramInfoDef, gPauseButton, gCamera,gLight1);
      Draw(gProgramInfoDef, gPlayButton, gCamera,gLight1);
      Draw(gProgramInfoDef, gUIBacking, gCamera,gLight1);
    }
    
    gGL.disable(gGL.DEPTH_TEST);
    
    gPostProcessingQuad.Texture = gRenderText;
    
    gGL.bindFramebuffer(gGL.FRAMEBUFFER, null);  
    gGL.viewport(0, 0, gCanvasWidth, gCanvasHeight);
    Draw(gProgramInfoPostProcessingFlesh, gPostProcessingQuad, gCamera, gLight1, null, gMidiObj);
    gGL.enable(gGL.DEPTH_TEST);
    
    if (document.pointerLockElement === gCanvas && gCamera.ActiveAniClip == null) //hide if playing camera ani or no pointerlock
    {
      Draw(gProgramInfoScreenImage, gCrossHair, gCamera, gLight1);
    }

  gFrameCount++;
  gCycleNum++;
  if (gIsRecording){gCapturer.capture(gCanvas);}
  
  if (gCamera.ActiveAniClip == null && gIsRecording)
  {
    gIsRecording = false;
    gCapturer.stop();
    gCapturer.save();
  }
  if (gActiveMainLoop != TransformationLoop) {gInitLoad = true;}
    else {gInitLoad = false;}
  requestAnimationFrame(gActiveMainLoop);
}


//===================================================================================
//===================================================================================
//===================================================================================

//===================================================================================
//===================================================================================
//===================================================================================
//
//===================================================================================
//===================================================================================
//===================================================================================
const AboutMeLoop = async ()=>
{
  gTime = new Date();
    let newTime = gTime.getTime();
    DeltaTime = newTime - gPreviousTime;
    gTimeSinceRun = newTime - gTimeStart;
    gPreviousTime = newTime;

    Input();
    gMouseMoved = Math.abs(gDeltaMouse[0]) + Math.abs(gDeltaMouse[1]) >= .001 ? true : false;
    let LocDeltMouse = gIsMobile ? gTouchDelta : gDeltaMouse; //Mobile touch not set up yet 
    MouseLook(gCamera, LocDeltMouse);
    
      //Animation
      let initPos = gGameAudioText.Position[0];
      gGameAudioText.Position[0] = initPos + .5 * gSinView[Math.floor((gTimeSinceRun * 4.0)%WAVE_BUFFER_SIZE)];
      let initSPos = gSoundDesignText.Position[0];
      gSoundDesignText.Position[0] = initSPos + .6 * gCosView[Math.floor((gTimeSinceRun * 40.0)%WAVE_BUFFER_SIZE)];
      let initRot = gVisualsText.Rotation[0];
      let initSize =  gVisualsText.Scale[0];
        gVisualsText.Rotation[0] = initRot + .2 * gSinView[Math.floor((gTimeSinceRun * 1.0)%WAVE_BUFFER_SIZE)];
      gVisualsText.Scale[1] = 30.0 + initSize + 40.0 * gSinView[Math.floor((gTimeSinceRun)%WAVE_BUFFER_SIZE)];
      //({Dict: gCharMeDict} = await UpdateModel(gSceneAboutMe, gCharMeDict)); //sets skeleton as undefined
      gCharMeAniMixer.update(DeltaTime * .001);
      gSceneAboutMe.updateMatrix();         
      gSceneAboutMe.updateMatrixWorld(); 
      //Update Music pan pos
      let ViewMat = GetViewMatrix(gCamera);
      let RandMag = 50.0;
      for(let i  = 0; i < gAboutMeSoundObjColec.length; i++)
      {
        gAboutMeSoundObjColec[i].SetPan(ViewMat, gAudioContext.currentTime);
      }

      UpdateBoneMatrix(gSceneAboutMe, gCharMeDict);
      //======================RENDER RAYCAST============================
      ClearFBO(null, gGL);
      ClearFBO(gMainFBO, gGL);
      ClearFBO(gRaycastFBO, gGL);
      ClearFBO(gGlassFBO, gGL);
      ClearFBO(gBloomFBO, gGL);

      gGL.bindFramebuffer(gGL.FRAMEBUFFER, gRaycastFBO);
      gGL.viewport(0, 0, gCanvasWidth, gCanvasHeight);
      gGL.enable(gGL.DEPTH_TEST);
      gGL.enable(gGL.CULL_FACE);
      gGL.cullFace(gGL.FRONT);
      let SelectColor = [1.0,1.0,1.0,1.0];
      let DeselectColor = [.2,.2,.5,1.0];
      let ObjIndex = 1; //start indexing at 1
      // for(let obj of gRaycastColecMain) //set up for this loop soon. currently set for main loop
      // {
      //   gCamera.ObjectIndex = ObjIndex;
      //   Draw(gProgramInfoRaycast,obj,gCamera,gLight1); 
      //   ObjIndex++;
      // }
      gRaycastText = gRaycastMap;
      if (gMouseMoved) {CheckRaycast(SelectColor, DeselectColor);}
      gDeltaMouse = [0.0,0.0];

      

      //======================RENDER DEPTH============================
      gGL.bindFramebuffer(gGL.FRAMEBUFFER, gDepthFBO);  
      gGL.viewport(0, 0, gCanvasWidth, gCanvasHeight);
      gGL.enable(gGL.DEPTH_TEST);    
      gGL.clear(gGL.DEPTH_BUFFER_BIT); 
      gGL.enable(gGL.CULL_FACE);


      gGL.bindFramebuffer(gGL.FRAMEBUFFER, gMainFBO);  
      //Set depth maps
  
    //======================BLOOM PASS============================
    gGL.bindFramebuffer(gGL.FRAMEBUFFER, gBloomFBO);
    gGL.viewport(0, 0, gCanvasWidth/2.0, gCanvasHeight/2.0);
    gGL.enable(gGL.DEPTH_TEST);    
    gGL.clear(gGL.DEPTH_BUFFER_BIT); 
    gGL.enable(gGL.CULL_FACE); 
    let FloatMag = 100.0;
    let FloatSpeed = .1;
    gCharMeDict.forEach((val, key) =>
      {
        Draw(gProgramInfoGLTFDef, val, gCamera,gLight1);
      }); 
    for (let i = 0; i < gStarTransforms.length; i++)
    {
      gStar2.Position = gStarTransforms[i].getPos();
      let FloatAmount = gSinView[Math.floor(Math.abs(gStar2.Position[0]) * WAVE_BUFFER_SIZE) % WAVE_BUFFER_SIZE] + gCosView[Math.floor(Math.abs(gStar2.Position[2]) * WAVE_BUFFER_SIZE) % WAVE_BUFFER_SIZE];
      FloatAmount *= FloatMag;
      gStar2.Position[1] = gStarTransforms[i].getPos()[1] + (FloatAmount * gSinView[Math.floor(gTimeSinceRun * FloatSpeed) % WAVE_BUFFER_SIZE]);
      gStar2.Rotation = gStarTransforms[i].getRot();
      gStar2.Scale = gStarTransforms[i].getScale();
      Draw(gProgramInfoDef, gStar2, gCamera, gLight1);
    }
    Draw(gProgramInfoDef, gCommissionsText, gCamera, gLight1);
    Draw(gProgramInfoDef, gGameAudioText, gCamera, gLight1);
    Draw(gProgramInfoDef, gSoundDesignText, gCamera, gLight1);
    Draw(gProgramInfoDef, gVisualsText, gCamera, gLight1);
    Draw(gProgramInfoDef, gContactText, gCamera, gLight1);


    
    gGL.bindFramebuffer(gGL.FRAMEBUFFER, gMainFBO);  
    gGL.disable(gGL.DEPTH_TEST);
    gPostProcessingQuad.TextureBN = gBloomRendText;
    gGL.viewport(0, 0, gCanvasWidth, gCanvasHeight);

    //
    DrawCallSetup();

    //======================RENDER NORMALPASS============================
    gGL.disable(gGL.DEPTH_TEST);
    gGL.disable(gGL.CULL_FACE);

    //===Star Float===  
    for (let i = 0; i < gStarTransforms.length; i++)
    {
      gStar2.Position = gStarTransforms[i].getPos();
      let FloatAmount = gSinView[Math.floor(Math.abs(gStar2.Position[0]) * WAVE_BUFFER_SIZE) % WAVE_BUFFER_SIZE] + gCosView[Math.floor(Math.abs(gStar2.Position[2]) * WAVE_BUFFER_SIZE) % WAVE_BUFFER_SIZE];
      FloatAmount *= FloatMag;
      gStar2.Position[1] = gStarTransforms[i].getPos()[1] + (FloatAmount * gSinView[Math.floor(gTimeSinceRun * FloatSpeed) % WAVE_BUFFER_SIZE]);
      gStar2.Rotation = gStarTransforms[i].getRot();
      gStar2.Scale = gStarTransforms[i].getScale();
      Draw(gProgramInfoDef, gStar2, gCamera, gLight1);
    }
    gGL.enable(gGL.DEPTH_TEST); 
    gGL.enable(gGL.CULL_FACE);
    gGL.cullFace(gGL.BACK);
    Draw(gProgramInfoDef, gCommissionsText, gCamera, gLight1);
    Draw(gProgramInfoDef, gGameAudioText, gCamera, gLight1);
    Draw(gProgramInfoDef, gSoundDesignText, gCamera, gLight1);
    Draw(gProgramInfoDef, gVisualsText, gCamera, gLight1);
    Draw(gProgramInfoDef, gContactText, gCamera, gLight1);
    gGL.disable(gGL.CULL_FACE);

    //============

    gCharMeDict.forEach((val, key) =>
      {
        Draw(gProgramInfoGLTFDef, val, gCamera,gLight1);
       // console.log(gGL.getError());
      }); 
    
    gPostProcessingQuad.Texture = gRenderText;
    gGL.bindFramebuffer(gGL.FRAMEBUFFER, null);  
    Draw(gProgramInfoPostProcessing, gPostProcessingQuad, gCamera, gLight1, null, null);
    gFrameCount++;
    gCycleNum++;
    if (gActiveMainLoop != AboutMeLoop) {gInitLoad = true;}
    else {gInitLoad = false;}
    requestAnimationFrame(gActiveMainLoop);
}
//=======================FLUID VIS=======================================
//=======================FLUID VIS=======================================
//=======================FLUID VIS=======================================
const FluidVisLoop = ()=> 
{
  //Next Step- Set up mouse influence on fluid sim
  //Save Mouse Position and mouse velocity to shader
  //Take v number of tiles behind and turn their velocity into Mouse Direction
  //Place this before UnDiverge in Mouse Fluid Shader
  gGL.disable(gGL.BLEND);
  gTime = new Date();
    let newTime = gTime.getTime();
    DeltaTime = newTime - gPreviousTime;
    gTimeSinceRun = newTime - gTimeStart;
    gPreviousTime = newTime;
    
    DrawCallSetup();
    gGL.disable(gGL.CULL_FACE);
    Input();
    ClearFBO(null, gGL);
    ClearFBO(gMainFBO, gGL);
    ClearFBO(gRaycastFBO, gGL);
    ClearFBO(gGlassFBO, gGL);
    ClearFBO(gFluidFBO, gGL);

   
    //Commented out for debug
    gGL.bindFramebuffer(gGL.FRAMEBUFFER, gFluidFBO);
    gGL.viewport(0, 0, gFluidSimObj.Dimensions[0] * 2.0, gFluidSimObj.Dimensions[1]);
    gCamera.Width = gFluidSimObj.Dimensions[0]; //Changing to temp scaled down for fluid sim
    gCamera.Height = gFluidSimObj.Dimensions[1];
    let ResRatio = [(gCamera.Width) / gCanvasWidth, gCamera.Height / gCanvasHeight];
    gScaledMousePos = [(gCurrentMousePos[0] * ResRatio[0]) / gCamera.Width, (gCurrentMousePos[1] * ResRatio[1]) / gCamera.Height];
    gScaledDeltaMouse = [(gDeltaMouse[0] * ResRatio[0]) / gCamera.Width, (gDeltaMouse[1] * ResRatio[1]) / gCamera.Height];

    

    // ===========Fluid Density Pass===========
    for (let iter = 0; iter < gFluidSimObj.IterNum; iter++)
    {
      Draw(gProgramInfoScreenFluidDisp, gFluidSimObj.ScreenQuad, gCamera, gLight1);

      gGL.activeTexture(gGL.TEXTURE9);
      gGL.bindTexture(gGL.TEXTURE_2D, gFluidSimObj.WriteText);

      gGL.copyTexSubImage2D(gGL.TEXTURE_2D, 0,0, 0, 0, 0, gFluidSimObj.Dimensions[0] * 2.0, gFluidSimObj.Dimensions[1]);
      gFluidSimObj.UpdateIter();
      gFluidSimObj.SwapText();
    }
    gFluidSimObj.UpdateText(); 
    // =============BORDER UPD===================
    Draw(gProgramInfoScreenFluidBorder, gFluidSimObj.ScreenQuad, gCamera, gLight1);
    //Save to readText
    gGL.activeTexture(gGL.TEXTURE9); 
    gGL.bindTexture(gGL.TEXTURE_2D, gFluidSimObj.WriteText);
    gGL.copyTexSubImage2D(gGL.TEXTURE_2D, 0,0, 0, 0, 0, gFluidSimObj.Dimensions[0] * 2.0, gFluidSimObj.Dimensions[1]);

    gFluidSimObj.SwapText();
    gFluidSimObj.UpdateText(); 
    //=============ADVECT===================
    //Apply velocity field to densitys 
    
    Draw(gProgramInfoScreenFluidAdvect, gFluidSimObj.ScreenQuad, gCamera, gLight1);
    //Save to readText
    gGL.activeTexture(gGL.TEXTURE9); 
    gGL.bindTexture(gGL.TEXTURE_2D, gFluidSimObj.WriteText);
    gGL.copyTexSubImage2D(gGL.TEXTURE_2D, 0,0, 0, 0, 0, gFluidSimObj.Dimensions[0] * 2.0, gFluidSimObj.Dimensions[1]);

    gFluidSimObj.SwapText();
    gFluidSimObj.UpdateText(); 
    //=============BORDER UPD===================
    Draw(gProgramInfoScreenFluidBorder, gFluidSimObj.ScreenQuad, gCamera, gLight1);
    //Save to readText
    gGL.activeTexture(gGL.TEXTURE9); 
    gGL.bindTexture(gGL.TEXTURE_2D, gFluidSimObj.WriteText);
    gGL.copyTexSubImage2D(gGL.TEXTURE_2D, 0,0, 0, 0, 0, gFluidSimObj.Dimensions[0] * 2.0, gFluidSimObj.Dimensions[1]);

    gFluidSimObj.SwapText();
    gFluidSimObj.UpdateText(); 

    //============ MOUSE MOVEMENT===================
    Draw(gProgramInfoScreenFluidMouseMove, gFluidSimObj.ScreenQuad, gCamera, gLight1);
    //Save to readText
    gGL.activeTexture(gGL.TEXTURE9); 
    gGL.bindTexture(gGL.TEXTURE_2D, gFluidSimObj.WriteText);
    gGL.copyTexSubImage2D(gGL.TEXTURE_2D, 0,0, 0, 0, 0, gFluidSimObj.Dimensions[0] * 2.0, gFluidSimObj.Dimensions[1]);

    gFluidSimObj.SwapText();
    gFluidSimObj.UpdateText(); 

    //=============UnDiverge===================
  
    // //Gen Divergence
    Draw(gProgramInfoScreenFluidFindDivergence, gFluidSimObj.ScreenQuad, gCamera, gLight1);

    gGL.activeTexture(gGL.TEXTURE9);
    gGL.bindTexture(gGL.TEXTURE_2D, gFluidSimObj.DivergeText);

    gGL.copyTexSubImage2D(gGL.TEXTURE_2D, 0,0, 0, 0, 0, gFluidSimObj.Dimensions[0] * 2.0, gFluidSimObj.Dimensions[1]);

    gFluidSimObj.ScreenQuad.TextureBN = gFluidSimObj.DivergeText; // set to texturebn just to not have an extra member for the struct
    [gFluidSimObj.ReadText, gFluidSimObj.HoldText] = gFluidSimObj.SwapText2(gFluidSimObj.ReadText, gFluidSimObj.HoldText); //save Dense and velo text in Hold
    // //Pressure Solve
    for (let iter = 0; iter < gFluidSimObj.IterNum; iter++)
    {
        Draw(gProgramInfoScreenFluidPressureSolver, gFluidSimObj.ScreenQuad, gCamera, gLight1);

        gGL.activeTexture(gGL.TEXTURE9);
        gGL.bindTexture(gGL.TEXTURE_2D, gFluidSimObj.WriteText);

        gGL.copyTexSubImage2D(gGL.TEXTURE_2D, 0,0, 0, 0, 0, gFluidSimObj.Dimensions[0] * 2.0, gFluidSimObj.Dimensions[1]);
        gFluidSimObj.UpdateIter();
        gFluidSimObj.SwapText();

    }

    // //Velocity Correction
    [gFluidSimObj.PressureText, gFluidSimObj.ReadText] = gFluidSimObj.SwapText2(gFluidSimObj.PressureText, gFluidSimObj.ReadText); // Steal last value from iter loop to use for pressure text
    gFluidSimObj.ScreenQuad.TextureBN = gFluidSimObj.PressureText; // For use in next shader compute
    [gFluidSimObj.ReadText, gFluidSimObj.HoldText] = gFluidSimObj.SwapText2(gFluidSimObj.ReadText, gFluidSimObj.HoldText); //Bring Density and velo back to Main txt
    gFluidSimObj.UpdateText(); //update screenquad values //

    Draw(gProgramInfoScreenFluidPressureCorrect, gFluidSimObj.ScreenQuad, gCamera, gLight1);
    
    gGL.activeTexture(gGL.TEXTURE9);
    gGL.bindTexture(gGL.TEXTURE_2D, gFluidSimObj.WriteText);

    gGL.copyTexSubImage2D(gGL.TEXTURE_2D, 0,0, 0, 0, 0, gFluidSimObj.Dimensions[0] * 2.0, gFluidSimObj.Dimensions[1]);
    gFluidSimObj.SwapText();
    gFluidSimObj.UpdateText(); 

   // ============Render Normal Pass========================
    gGL.viewport(0, 0, gCanvasWidth, gCanvasHeight);
    gGL.bindFramebuffer(gGL.FRAMEBUFFER, null);
    gCamera.Width = gCanvasWidth;
    gCamera.Height = gCanvasHeight;
    Draw(gProgramInfoScreenFlatFluid, gFluidSimObj.ScreenQuad, gCamera, gLight3);
    gFrameCount++;
    gCycleNum++;
    if (gActiveMainLoop != FluidVisLoop) {gInitLoad = true;}
    else {gInitLoad = false;}
    requestAnimationFrame(gActiveMainLoop);

}
//=======================LOAD LOOP=======================================
//=======================LOAD LOOP=======================================
//=======================LOAD LOOP=======================================
const LoadLoop = ()=>
{
  //Clear screen to solid color
  gGL.clearColor(.8, .5, .65, 1.0); //Pink
  gGL.clear(gGL.COLOR_BUFFER_BIT); //Command to clear buffer bit and fill with clear color
  if (gActiveMainLoop != LoadLoop)
  {
    document.getElementById("Gif").style.opacity = 0.0;
    document.getElementById("LoadTxt").style.opacity = 0.0;
    gGL.clearColor(0.0, 0.0, 0.0, 0.0); //Pink
    gGL.clear(gGL.COLOR_BUFFER_BIT | gGL.DEPTH_BUFFER_BIT); //Command to clear buffer bit and fill with clear color
  }
  requestAnimationFrame(gActiveMainLoop);
}

function ResizeCanvas(gl, canvas)
{
  const dpr = window.devicePixelRatio || 1;
  const displayWidth  = Math.floor(canvas.clientWidth  * dpr);
  const displayHeight = Math.floor(canvas.clientHeight * dpr);

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
    

    gl.viewport(0, 0, displayWidth, displayHeight);
    gCanvasWidth  = displayWidth;
    gCanvasHeight = displayHeight;

    if (gCamera != null) {
      gCamera.Width  = gCanvasWidth;
      gCamera.Height = gCanvasHeight;
    }

    if (gRenderText != null) {
      console.log("resize fbo");
   
      gRenderText    = genEmptyTex(gGL, gCanvasWidth, gCanvasHeight);
      gMainDepthMap  = genDepthMap(gGL, gCanvasWidth, gCanvasHeight);
      gMainFBO       = genFBO(gGL, gMainDepthMap, gRenderText);
    
      if (gActiveMainLoop == MainLoop)
      {
        gGlassRendText = genEmptyTex(gGL, gCanvasWidth, gCanvasHeight);
        gGlassDepthMap = genDepthMap(gGL, gCanvasWidth, gCanvasHeight);
        gGlassFBO      = genFBO(gGL, gGlassDepthMap, gGlassRendText);
      }
      gDepthMap = genDepthMap(gGL, gCanvasWidth, gCanvasHeight);
      gDepthFBO = genFBO(gGL, gDepthMap);
      gRaycastMap    = genEmptyTex(gGL, gCanvasWidth, gCanvasHeight);
      gRaycastFBO    = genFBO(gGL, gDepthMap, gRaycastMap);
    
      gBloomRendText = genEmptyTex(gGL, gCanvasWidth, gCanvasHeight);
      gBloomDepthMap = genDepthMap(gGL, gCanvasWidth, gCanvasHeight);
      gBloomFBO      = genFBO(gGL, gBloomDepthMap, gBloomRendText);
    }
  
    
    
    gCanvasAspect = gCanvasHeight / gCanvasWidth;
  }
}
main();

async function main() {
  gIsMobile = MobileCheck();
  if (gIsMobile) 
  {
    document.getElementById("GoHome").style.opacity = 0.0;
    document.getElementById("LoadTxt").style.opacity = 0.0;
    document.getElementById("MobileInfo").style.opacity = 1.0;
    return;
  }
  let LoadTxt = document.getElementById("LoadTxt");
  LoadTxt.style.color = '#990000'; 
  document.getElementById("Gif").style.opacity = 1.0;
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
  gGL.getExtension('EXT_color_buffer_float');
  const extLinearFloat = gGL.getExtension("OES_texture_float_linear");
if (!extLinearFloat) {
    console.error("Your browser/hardware does not support linear filtering for 32-bit float textures!");
}
  //Clear screen to solid color
  gGL.clearColor(.8, .5, .65, 1.0); //Pink
  gGL.clear(gGL.COLOR_BUFFER_BIT); //Command to clear buffer bit and fill with clear color

  //Load glsl file text content
  //Vert
  gVertSourceDef = await loadShaderFiles(gVertSourceDef, './Shaders/DefaultVert.glsl');
  gVertSkybox = await loadShaderFiles(gVertSkybox, './Shaders/SkyboxVert.glsl');
  gVertStar = await loadShaderFiles(gVertStar, './Shaders/StarVert.glsl');
  gVertRaycast = await loadShaderFiles(gVertRaycast, './Shaders/RaycastVert.glsl');
  gVertTrans = await loadShaderFiles(gVertTrans, './Shaders/TransVert.glsl');
  gVertFlesh = await loadShaderFiles(gVertFlesh, './Shaders/FleshVert.glsl');
  gVertMorph = await loadShaderFiles(gVertMorph, './Shaders/MorphVert.glsl');
  gVertTreeMorph = await loadShaderFiles(gVertTreeMorph, './Shaders/TreeMorphVert.glsl');
  gVertGLTFDef = await loadShaderFiles(gVertGLTFDef, './Shaders/GLTFDefaultVert.glsl');
  gVertSkyboxHigh = await loadShaderFiles(gVertGLTFDef, './Shaders/SkyboxHighVert.glsl');
  //Frag
  gFragSourceWave = await loadShaderFiles(gFragSourceWave, './Shaders/WaveFrag.glsl');
  gFragSourceFlat = await loadShaderFiles(gFragSourceFlat, './Shaders/FlatFrag.glsl');
  gFragSourceCloud = await loadShaderFiles(gFragSourceCloud, './Shaders/CloudFrag.glsl');
  gFragSkybox = await loadShaderFiles(gFragSkybox, './Shaders/SkyboxFrag.glsl');
  gFragStar = await loadShaderFiles(gFragStar, './Shaders/StarFrag.glsl');
  gFragFleshPart = await loadShaderFiles(gFragFleshPart, './Shaders/FleshPartFrag.glsl');
  gFragColor = await loadShaderFiles(gFragColor, './Shaders/ColorFrag.glsl');
  gFragVolGlow = await loadShaderFiles(gFragVolGlow, './Shaders/VolumeGlowFrag.glsl');
  gFragDef = await loadShaderFiles(gFragDef, './Shaders/DefaultFrag.glsl');
  gFragRaycast = await loadShaderFiles(gFragRaycast, './Shaders/RaycastFrag.glsl');
  gFragGlass = await loadShaderFiles(gFragGlass, './Shaders/GlassFrag.glsl');
  gFragScreenFlat = await loadShaderFiles(gFragScreenFlat, './Shaders/ScreenFlatFrag.glsl');
  gFragTransFlat = await loadShaderFiles(gFragTransFlat,'./Shaders/TransFlatFrag.glsl');
  gFragFlesh = await loadShaderFiles(gFragFlesh, './Shaders/FleshFrag.glsl');
  gFragMorph = await loadShaderFiles(gFragMorph, './Shaders/MorphFrag.glsl');
  gFragTreeMorph = await loadShaderFiles(gFragTreeMorph, './Shaders/TreeMorphFrag.glsl');
  gFragScreenBGTrans = await loadShaderFiles(gFragScreenBGTrans, './Shaders/ScreenBGFrag.glsl');
  gFragPostProcessingFlesh = await loadShaderFiles(gFragPostProcessingFlesh, './Shaders/PostProcessingFleshFrag.glsl');
  gFragPostProcessingAndrew = await loadShaderFiles(gFragPostProcessingAndrew, './Shaders/PostProcessingAndrewFrag.glsl');
  gFragToon = await loadShaderFiles(gFragToon, './Shaders/ToonFrag.glsl');//unused
  gFragPostProcessing = await loadShaderFiles(gFragPostProcessing, './Shaders/PostProcessingFrag.glsl');
  gFragScreenFluidDisp = await loadShaderFiles(gFragScreenFluidDisp, './Shaders/ScreenFluidDispFrag.glsl');
  gFragScreenFluidAdvect = await loadShaderFiles(gFragScreenFluidAdvect, './Shaders/ScreenFluidAdvectFrag.glsl');
  gFragScreenFlatFluid = await loadShaderFiles(gFragScreenFlatFluid, './Shaders/ScreenFlatFluid.glsl');
  gFragScreenFluidFindDivergence = await loadShaderFiles(gFragScreenFluidFindDivergence, './Shaders/ScreenFluidFindDivergenceFrag.glsl');
  gFragScreenFluidPressureSolver = await loadShaderFiles(gFragScreenFluidPressureSolver, './Shaders/ScreenFluidPressureSolverFrag.glsl');
  gFragScreenFluidBorder = await loadShaderFiles(gFragScreenFluidBorder, './Shaders/ScreenFluidBorderFrag.glsl');
  gFragScreenFluidPressureCorrect = await loadShaderFiles (gFragScreenFluidPressureCorrect, './Shaders/ScreenFluidPressureCorrectFrag.glsl');
  gFragScreenFluidMouseMove = await loadShaderFiles (gFragScreenFluidMouseMove, './Shaders/ScreenFluidMouseMoveFrag.glsl');
  gFragScreenSplitL = await loadShaderFiles(gFragScreenSplitL, './Shaders/ScreenSplitLFrag.glsl');
  gFragScreenSplitR = await loadShaderFiles(gFragScreenSplitR, './Shaders/ScreenSplitRFrag.glsl');

  gShaderProgramWave = initShader(gGL, gVertSourceDef,gFragSourceWave);
  gShaderProgramFlat = initShader(gGL, gVertSourceDef,gFragSourceFlat);
  gShaderProgramCloud = initShader(gGL, gVertSourceDef,gFragSourceCloud);
  gShaderProgramSkybox = initShader(gGL, gVertSkybox,gFragSkybox);
  gShaderProgramColor = initShader(gGL, gVertSourceDef, gFragColor);
  gShaderProgramStar = initShader(gGL, gVertStar, gFragStar);
  gShaderProgramFleshPart = initShader(gGL, gVertStar, gFragFleshPart);
  gShaderProgramVolGlow = initShader(gGL, gVertSourceDef, gFragVolGlow);
  gShaderProgramDef = initShader(gGL, gVertSourceDef, gFragDef);
  gShaderProgramRaycast = initShader(gGL, gVertRaycast, gFragRaycast);
  gShaderProgramGlass = initShader(gGL, gVertSourceDef, gFragGlass);
  gShaderProgramScreenRender = initShader(gGL, gVertSkybox, gFragScreenFlat);
  gShaderProgramScreenImage = initShader(gGL, gVertSkybox, gFragSourceFlat);
  gShaderProgramTrans = initShader(gGL, gVertTrans, gFragTransFlat);
  gShaderProgramFlesh = initShader(gGL, gVertFlesh, gFragFlesh);
  gShaderProgramMorph = initShader(gGL, gVertMorph, gFragMorph);
  gShaderProgramTreeMorph = initShader(gGL, gVertTreeMorph, gFragTreeMorph);
  gShaderProgramScreenBGTrans = initShader(gGL, gVertSkybox, gFragScreenBGTrans);
  gShaderProgramPostProcessingFlesh = initShader(gGL, gVertSkybox, gFragPostProcessingFlesh);
  gShaderProgramGLTFDef = initShader(gGL, gVertGLTFDef, gFragSourceFlat);
  gShaderProgramPostProcessingAndrew = initShader(gGL, gVertSkybox, gFragPostProcessingAndrew);
  gShaderProgramToon = initShader(gGL, gVertSourceDef, gFragToon);
  gShaderProgramPostProcessing = initShader(gGL, gVertSkybox, gFragPostProcessing);
  gShaderProgramScreenFluidDisp = initShader(gGL, gVertSkyboxHigh, gFragScreenFluidDisp);
  gShaderProgramScreenFluidAdvect = initShader(gGL, gVertSkyboxHigh, gFragScreenFluidAdvect);
  gShaderProgramScreenFlatFluid = initShader(gGL, gVertSkybox, gFragScreenFlatFluid);
  gShaderProgramScreenFluidFindDivergence = initShader(gGL, gVertSkyboxHigh, gFragScreenFluidFindDivergence);
  gShaderProgramScreenFluidPressureSolver = initShader(gGL, gVertSkyboxHigh, gFragScreenFluidPressureSolver);
  gShaderProgramScreenFluidBorder = initShader(gGL, gVertSkyboxHigh, gFragScreenFluidBorder);
  gShaderProgramScreenFluidPressureCorrect = initShader(gGL, gVertSkyboxHigh, gFragScreenFluidPressureCorrect);
  gShaderProgramScreenFluidMouseMove = initShader(gGL, gVertSkyboxHigh, gFragScreenFluidMouseMove);
  gShaderProgramScreenSplitL = initShader(gGL, gVertSkyboxHigh, gFragScreenSplitL);
  gShaderProgramScreenSplitR = initShader(gGL, gVertSkyboxHigh, gFragScreenSplitR);
  //Shaders done
  LoadTxt.style.color = '#ff0000'; 
  


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
     gProgramInfoFlesh, gShaderProgramFlesh,
     gProgramInfoFleshPart, gShaderProgramFleshPart,
     gProgramInfoMorph, gShaderProgramMorph,
     gProgramInfoTreeMorph, gShaderProgramTreeMorph,
     gProgramInfoScreenBGTrans, gShaderProgramScreenBGTrans,
     gProgramInfoPostProcessingFlesh, gShaderProgramPostProcessingFlesh,
     gProgramInfoGLTFDef, gShaderProgramGLTFDef,
     gProgramInfoPostProcessingAndrew, gShaderProgramPostProcessingAndrew,
     gProgramInfoToon, gShaderProgramToon,
     gProgramInfoPostProcessing, gShaderProgramPostProcessing,
     gProgramInfoScreenFluidDisp, gShaderProgramScreenFluidDisp,
     gProgramInfoScreenFluidAdvect, gShaderProgramScreenFluidAdvect,
     gProgramInfoScreenFlatFluid, gShaderProgramScreenFlatFluid,
     gProgramInfoScreenFluidFindDivergence, gShaderProgramScreenFluidFindDivergence,
     gProgramInfoScreenFluidBorder, gShaderProgramScreenFluidBorder,
     gProgramInfoScreenFluidPressureSolver, gShaderProgramScreenFluidPressureSolver,
     gProgramInfoScreenFluidPressureCorrect, gShaderProgramScreenFluidPressureCorrect,
     gProgramInfoScreenFluidMouseMove, gShaderProgramScreenFluidMouseMove,
     gProgramInfoScreenSplitL, gShaderProgramScreenSplitL,
     gProgramInfoScreenSplitR, gShaderProgramScreenSplitR,
     );
  
    SinPreComp(gSinView,WAVE_BUFFER_SIZE);
    CosPreComp(gCosView,WAVE_BUFFER_SIZE);
    TanPreComp(gTanView, WAVE_BUFFER_SIZE);
    ArcSinPreComp(gArcSinView, WAVE_BUFFER_SIZE);
    ArcCosPreComp(gArcCosView, WAVE_BUFFER_SIZE);
    //Precomps set
    LoadTxt.style.color = '#ff2f00'; 

    
    //=====Main Scene======
    gSkybox = new Quad(gShaderProgramSkybox, null, null,0,null,null,[],[],[1.0,1.0,1.0,1.0],
    [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0], null, null, null, null, null, null, null);
    let SkyboxOrigin = [0.0,0.0,0.0];
    GenerateQuad(gSkybox,1.0,SkyboxOrigin);  

    gScreenSpaceQuad = new Quad(gShaderProgramSkybox, null, null,0,null,null,[],[],[1.0,1.0,1.0,1.0],
      [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0], null, null, null, null, null, null, null);
    let ScreenSpaceOrigin = [0.0,0.0,0.0];
    GenerateQuad(gScreenSpaceQuad,1.0,ScreenSpaceOrigin);  


    //=========Trans=============
    gScreenSpaceQuadTrans = new Quad(gShaderProgramSkybox, null, null,0,null,null,[],[],[1.0,1.0,1.0,1.0],
      [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0], null, null, null, null, null, null, null);
      GenerateQuad(gScreenSpaceQuadTrans,1.0,ScreenSpaceOrigin);  

    gPostProcessingQuad = new Quad(gShaderProgramSkybox, null, null,0,null,null,[],[],[1.0,1.0,1.0,1.0],
      [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0], null, null, null, null, null, null, null);
    GenerateQuad(gPostProcessingQuad,1.0,ScreenSpaceOrigin);  

    gCrossHair = new Quad(gShaderProgramSkybox, null, null,0,null,null,[],[],[1.0,1.0,1.0,1.0],
      [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0], null, null, null, null, null, null, null);
    let CrossHairOrigin = [0.0,0.0,0.0];
    GenerateQuad(gCrossHair,.02,CrossHairOrigin);  
    

    gSimpleWave = new Wave(gShaderProgramWave, 0,0,0,[], [],[0.0,0.0,0.0],0,0,[], [], 
      [.1,.5,1.0,1.0], [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0], null, null, null);
    GenerateWave(gSimpleWave, gProgramInfoWave);
    gCamera = new Camera([0.0,10.0,0.0],[1.0,0.0,1.0],[0.0,1.0,0.0], gCanvasWidth, gCanvasHeight, 0, 0, [0.0, 0.0, 0.0]);
    gCamera.setPostProcessing([0.0,0.0,0.0], 0.9, 0.15, [0.6, 0.2, 0.4]);
    const Light = makeStruct("Pos, Color, Intensity");
    gLight1 = new Light([0.0,1.0,-1.0],[1.0, 0.863, 0.537],1.5);
    gLight2 = new Light([0.0,1.0,-1.0],[1.0, 0.863, 0.537],1.0);
    gLight3 = new Light([10.0,-100.0,-50.0],[.4, 0.863, 0.837],1.0);
    
    //=======================Star Sphere==============================
    gStars = new QuadStar(gShaderProgramFlat, null, null,0,null,null,[],[],[1.0,1.0,1.0,1.0],
      [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0],[],[],null,null,null);
    
    let StarSphereOrigin = vec3.fromValues(0.0,30.0,40.0);
    let StarSphereRadius = 100.0;
    let NumStarSphere = 2000;
    let isHemiSphere = true;
    let RandRadAm = 2.0;
    let StarSize = 1.5;
    SphereOfQuad(StarSphereOrigin,StarSphereRadius,StarSize,gStars,NumStarSphere, 
      gSinView, gCosView,gArcSinView,gArcCosView, WAVE_BUFFER_SIZE, isHemiSphere, RandRadAm,
      gCamera);


      let FleshSphereOrigin = vec3.fromValues(0.0,-60.0,0.0);
      let FleshSphereRadius = 50.0;
      let NumPartSphere = 1000;
      let FleshisHemiSphere = true;
      let FleshRandRadAm = 2.0;
      let FleshPartSize = 4.0;
      gFleshParticles = new QuadStar(gShaderProgramFlat, null, null,0,null,null,[],[],[1.0,1.0,1.0,1.0],
        [0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0],[],[],null,null,null);
        SphereOfQuad(FleshSphereOrigin,FleshSphereRadius,FleshPartSize,gFleshParticles,NumPartSphere, 
          gSinView, gCosView,gArcSinView,gArcCosView, WAVE_BUFFER_SIZE, FleshisHemiSphere, FleshRandRadAm,
          gCamera);

    //Model structs init
    LoadTxt.style.color = '#ff5e00'; 
    //----------------------------------------------------------------
  
    gPreviousTime = gTime.getTime();
    gTimeStart = gPreviousTime;
    //Set up Input
    document.addEventListener("keydown", (e) => {
      let lowerLet = e.key.toLowerCase(); //accept caps lock and lower case
      gKeysPressed[lowerLet] = true;
    });
  
    document.addEventListener("keyup", (e) => {
      let lowerLet = e.key.toLowerCase();
      gKeysPressed[lowerLet] = false;
    });
    document.addEventListener("mousemove", CalcMouseDelta);
    document.addEventListener("click", (e) => ClickFunc(e));
    document.addEventListener("click", (e) => gAudioContext.resume());


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
    gBloomDepthMap = genDepthMap(gGL, gCanvasWidth, gCanvasHeight);
    gBloomRendText = genEmptyTex(gGL, gCanvasWidth, gCanvasHeight);
    gBloomFBO = genFBO(gGL, gBloomDepthMap, gBloomRendText);
    gFluidDepthMap = genDepthMap(gGL, gCanvasWidth, gCanvasHeight);
    gFluidRendText = genEmptyTex(gGL, gCanvasWidth, gCanvasHeight, true);
    gFluidFBO = genFBO(gGL, gFluidDepthMap, gFluidRendText);
    
    //FBO set
    LoadTxt.style.color = '#ed7300'; 

    gTime = new Date();
    let newTime = gTime.getTime();
    DeltaTime = newTime- gPreviousTime;
    gTimeSinceRun = newTime - gTimeStart;
    gPreviousTime = newTime;
    await LoadMainScene();
    await SetUpAboutMeAudio();
    //Scene Setup
    LoadTxt.style.color = '#0aff2f'; 
    

    BoatWaveIndexFind();
    gActiveMainLoop = MainLoop;
    gIsLoading = false;



    gActiveMainLoop();
    document.getElementById("Gif").style.opacity = 0.0;
    document.getElementById("GoHome").style.opacity = 0.0;
    document.getElementById("LoadTxt").style.opacity = 0.0;
    if (!gIsMobile) {document.getElementById("PlayMusic").style.opacity = 1.0;}
    FrameCount();
    console.log(gIsMobile);
    if (gIsMobile)
    {
      gCanvas.addEventListener("touchstart", touchHandler);
      gCanvas.addEventListener("touchmove", touchHandler);
    }
    
   
}



//==========================NEXT TASKS==========================
/*Shader Toy Inspo
Fix armature,
make sampler2d's only bind once at start of frame
*/
