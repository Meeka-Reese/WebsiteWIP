const vertSource = `#version 300 es
    in vec4 aVertPos;
    in vec3 aNorm;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjMatrix;
    out vec3 Normals;
    out vec3 FragPos;

    void main()
    {
        vec4 ViewPos = uViewMatrix * aVertPos;
        gl_Position = uProjMatrix * uViewMatrix * aVertPos;
        vec4 ProjNormals = uViewMatrix * vec4(aNorm,0.0);
        Normals = ProjNormals.xyz;
        FragPos = ViewPos.xyz;
        
    }

`;
const fragSource = `#version 300 es
    precision mediump float;    
    in vec3 Normals;
    in vec3 FragPos;
    out vec4 fragColor;
    uniform vec3 objCol;
    uniform vec3 lightPos;
    uniform vec3 viewPos;
    uniform vec3 lightColor;
    uniform float lightIntensity;
    void main()
    {
        
        vec3 NormalizedNorm = normalize(Normals);

        

        //Diffuse
        float diffAm = .5;
        vec3 lightDir = normalize(lightPos - FragPos);
        float diff = max(dot(-NormalizedNorm, lightDir), 0.0);
        vec3 diffuse = diff * normalize(objCol + lightColor) * lightIntensity * diffAm;

        //Ambient
        float ambientAmount = .6;
        vec3 ambient = (objCol) * ambientAmount * lightIntensity;
        if (diff > .1 && diff < .5) {ambient = vec3(1.0,1.0,1.0) * ambientAmount * lightIntensity;}
        else if (diff > .7) {ambient = lightColor * ambientAmount * lightIntensity;}

        //Specular
        float specularStrength = .3;
        vec3 viewDir = normalize(viewPos - FragPos);
        vec3 reflectDir = reflect(-lightDir, NormalizedNorm);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 10.0);
        vec3 specular = specularStrength * spec * vec3(1.0,1.0,1.0);
        

        vec3 Comp = ambient + diffuse + specular;
        float CompMag = length(Comp);
        vec3 NormalizedComp = normalize(Comp);
        //Tune
        float numberOfLevels = 1.0;
        float toonLevel = ceil(CompMag * numberOfLevels) / numberOfLevels;
        toonLevel = clamp(toonLevel, 0.2, 1.0);
        Comp = Comp * toonLevel;
        fragColor = vec4(Comp,1.0);
    }
`
//Imported functions
import { Move } from './translations.js';
import { Rotate } from './translations.js';
import { Scale } from './translations.js';
import { Normalize } from './Utils.js';
import { CameraMove } from './Camera.js';
import { MouseLook } from './Camera.js';
import { GetViewMatrix } from './Camera.js';
import { SinPreComp } from './PreCompWave.js';
import { CosPreComp } from './PreCompWave.js';
import { TanPreComp } from './PreCompWave.js';
import { createNoise3D } from './Externals/simplex-noise.js';
//=======================GLOBALS=============================
let gCamera;
let gLight1;
let gSimpleWave;
let gPreviousTime;
let gDeltaTime;
let gTime = new Date();
let gProgramInfo;
let gGL;
let gCycleNum = 0;

//Precomps
let WAVE_BUFFER_SIZE = 4096;
let FloatBitSize = 4; //4 because 32 bit rn
let gSinPreCompBuf = new ArrayBuffer(WAVE_BUFFER_SIZE*FloatBitSize);
let gCosPreCompBuf = new ArrayBuffer(WAVE_BUFFER_SIZE*FloatBitSize);
let gTanPreCompBuf = new ArrayBuffer(WAVE_BUFFER_SIZE*FloatBitSize);
let gSinView = new Float32Array(gSinPreCompBuf);
let gCosView = new Float32Array(gCosPreCompBuf);
let gTanView = new Float32Array(gTanPreCompBuf);
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

function GenerateMesh(Object, programInfo) // Being used for wave generation
{
    // Create a buffer for the square's positions.
    const positionBuffer = gGL.createBuffer();
    const indicesBuffer = gGL.createBuffer();


    const RowNum = 70;
    const ColNum = 70;
    Object.RowNum = RowNum;
    Object.ColNum = ColNum;
    const Spacing = 1.0;
    // Now create an array of positions for the square.
    let positions = [];
    let indices = [];

    let PosOffset = Object.Position;
    
    for (let row = 0; row < RowNum; row++)
    {
        for (let col = 0; col < ColNum; col++)
        {
            let xPos = col * Spacing + PosOffset[0];
            let yPos = PosOffset[1];
            let zPos = (row * Spacing) + PosOffset[2];
            positions.push(xPos, yPos, zPos);

            if (!(col + 1 < ColNum && row + 1 < RowNum)) //Kills if point is out of range to create indices
            {
               continue; 
            }
            let i = (ColNum * row) + col;
            indices.push(i, i + 1, i + ColNum); //tri 1
            
            
            indices.push(i+1, i+1+ColNum, i+ColNum); //tri 2
            
        }
    }
    Object.PositionsArray = positions;
    Object.IndicesArray = indices;

    
    

    Object.VertexCount = indices.length;
    gGL.bindBuffer(gGL.ARRAY_BUFFER, positionBuffer); // choose pos buffer as active buffer
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(positions), gGL.STATIC_DRAW); //apply data to active buffer

    gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gGL.bufferData(gGL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gGL.STATIC_DRAW);

    
    Object.Verticies = positionBuffer;
    Object.Indices = indicesBuffer;
    CalculateNormals(Object);
    
    
}
function CalculateNormals(Object)
{
    const normalsBuffer = gGL.createBuffer();
    let positions = Object.PositionsArray;
    let normals = new Array(positions.length).fill(0);
    let vertexCount = Object.VertexCount;
    let indices = Object.IndicesArray;
    for (let Face = 0; Face < indices.length; Face += 3)
    {
        let indA = indices[Face]*3;
        let indB = indices[Face + 1]*3;
        let indC = indices[Face + 2]*3;
        let A = [positions[indA], positions[indA+1], positions[indA+2]];
        let B = [positions[indB], positions[indB+1], positions[indB+2]];
        let C = [positions[indC], positions[indC+1], positions[indC+2]];

        let ABLine = [B[0]-A[0],B[1]-A[1],B[2]-A[2]];
        let ACLine = [C[0]-A[0],C[1]-A[1],C[2]-A[2]];

        let faceNormal = [
            ABLine[1]*ACLine[2] - ABLine[2]*ACLine[1],
            ABLine[2]*ACLine[0] - ABLine[0]*ACLine[2],
            ABLine[0]*ACLine[1] - ABLine[1]*ACLine[0],
        ];

       
        normals[indA]   += faceNormal[0];
        normals[indA+1] += faceNormal[1];
        normals[indA+2] += faceNormal[2];
        
        normals[indB]   += faceNormal[0];
        normals[indB+1] += faceNormal[1];
        normals[indB+2] += faceNormal[2];
        
        normals[indC]   += faceNormal[0];
        normals[indC+1] += faceNormal[1];
        normals[indC+2] += faceNormal[2];
    }
    for (let i = 0; i < vertexCount; i++)
    {
        let normal = [normals[i*3] * 1.0, normals[i*3+1] * 1.0, normals[i*3+2]*1.0];
        normal = Normalize(normal);
        normals[i*3]   = normal[0];
        normals[i*3+1] = normal[1];
        normals[i*3+2] = normal[2];
    }

    gGL.bindBuffer(gGL.ARRAY_BUFFER, normalsBuffer);
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(normals),gGL.STATIC_DRAW);
    Object.Normals = normalsBuffer;
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
    let Positions = WaveObj.PositionsArray;
    let Vert = 0;
    for (let Cord = 0; Cord < WaveObj.PositionsArray.length; Cord+=3)
    {
        let x = Positions[Cord];
        let y = Positions[Cord+1];  
        let z = Positions[Cord+2];
        Positions[Cord+1] = gCosView[(Math.floor(((TimeSec*WaveSpeeds[0]) + (Positions[(Vert*3)+2]*WaveSize[0])/WaveObj.RowNum)*WAVE_BUFFER_SIZE))%WAVE_BUFFER_SIZE]
          * WaveAmp[0] + WaveObj.Position[0]; 

        Positions[Cord+1] += gSinView[(Math.floor((TimeSec*WaveSpeeds[1]) + (Positions[(Vert*3)+2]*WaveSize[1])/(WaveObj.ColNum)*WAVE_BUFFER_SIZE))%WAVE_BUFFER_SIZE]
          * WaveAmp[1] + WaveObj.Position[1];

        Positions[Cord+1] += gSinView[(Math.floor(((TimeSec*WaveSpeeds[2]) + ((Positions[(Vert*3)+2]+Positions[(Vert*3)])*WaveSize[2] * 2.5)/(WaveObj.ColNum))*WAVE_BUFFER_SIZE))%WAVE_BUFFER_SIZE]
          * WaveAmp[2] + WaveObj.Position[1];
        
        Positions[Cord+1] += gSinView[(Math.floor(((TimeSec*WaveSpeeds[3]) + ((Positions[(Vert*3)+2]+Positions[(Vert*3)]+Positions[(Vert*3)+1])*WaveSize[3] * 1.2)/(WaveObj.ColNum))*WAVE_BUFFER_SIZE))%WAVE_BUFFER_SIZE]
          * WaveAmp[3] + WaveObj.Position[1];

        Positions[Cord+1] += Noise3D((Positions[(Vert*3)]+(TimeSec*2.0))*NoiseDetail[0],
        (Positions[(Vert*3)+1]+(TimeSec))*NoiseDetail[1],
        (Positions[(Vert*3)+2]+(TimeSec))*NoiseDetail[2]) * NoiseAmp;
        Vert ++;
    }
    gGL.bindBuffer(gGL.ARRAY_BUFFER, positionBuffer); // choose pos buffer as active buffer
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(Positions), gGL.STATIC_DRAW); //apply data to active buffer
    WaveObj.Verticies = positionBuffer;
    WaveObj.PositionsArray = Positions;

}

function setPositionAttribute(Object, programInfo, Camera, Light)
{
    
    gGL.bindBuffer(gGL.ARRAY_BUFFER, Object.Verticies); //Verts
    gGL.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        3, //num componenets
        gGL.FLOAT,
        false, //don't normalize
        0,
        0,
    );
    gGL.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gGL.bindBuffer(gGL.ARRAY_BUFFER, Object.Normals); //Normals
    gGL.vertexAttribPointer(
        programInfo.attribLocations.normalPosition,
        3,
        gGL.FLOAT,
        false,
        0,
        0
    );
    gGL.enableVertexAttribArray(programInfo.attribLocations.normalPosition);
    if (programInfo.uniformLocations.lightPosition != null)
    {
        gGL.uniform3fv(programInfo.uniformLocations.lightPosition, Light.Pos);
    }
    else{console.log("lightPosition Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.objCol != null)
    {
        gGL.uniform3fv(programInfo.uniformLocations.objCol, Object.Color);
    }
    else{console.log("objCol Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.viewPosition != null)
    {
        gGL.uniform3fv(programInfo.uniformLocations.viewPosition, Camera.Eye);
    }
    else{console.log("viewPosition Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.lightColor != null)
    {
        gGL.uniform3fv(programInfo.uniformLocations.lightColor, Light.Color);
    }
    else{console.log("lightColor Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.lightIntensity != null)
    {
        gGL.uniform1f(programInfo.uniformLocations.lightIntensity, Light.Intensity);
    }
    else{console.log("lightIntensity Uniform Could Not Be Found!")};
    


}
function DrawCallSetup()
{
    gGL.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gGL.clearDepth(1.0); // Clear everything
    gGL.enable(gGL.DEPTH_TEST); // Enable depth testing
    gGL.depthFunc(gGL.LEQUAL); // Near things obscure far things
      
    // Clear the canvas before we start drawing on it.
      
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
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
      
        // note: glMatrix always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
      
        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        let modelViewMatrix = mat4.create();
        modelViewMatrix = GetViewMatrix(Camera);
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
        mat4.translate(
          modelViewMatrix, // destination matrix
          modelViewMatrix, // matrix to translate
          [0.0,0.0,-6.0],
        ); // amount to translate
      
        
      
        // Tell WebGL to use our program when drawing
        gGL.useProgram(programInfo.program);

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        setPositionAttribute(Object, programInfo, Camera, Light);
      
        // Set the shader uniforms
        gGL.uniformMatrix4fv(
          programInfo.uniformLocations.projectionMatrix,
          false,
          projectionMatrix,
        );
        gGL.uniformMatrix4fv(
          programInfo.uniformLocations.modelViewMatrix,
          false,
          modelViewMatrix,
        );
      
        {
          gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, Object.Indices); //This needs to be the last active buffer 
          
          const offset = 0;
          let vertexCount = Object.VertexCount;
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
function MainLoop()
{
    gTime = new Date();
    gDeltaTime = gTime.getTime() - gPreviousTime;
    gPreviousTime = gTime.getTime();
    Input();
    MouseLook(gCamera, gDeltaMouse);
    gDeltaMouse = [0.0,0.0];
    WaveUpdateMesh(gSimpleWave)
    if ((gCycleNum %2) == 0) {CalculateNormals(gSimpleWave);}
    DrawCallSetup();
    Draw(gProgramInfo, gSimpleWave, gCamera, gLight1);
    requestAnimationFrame(MainLoop);
    gCycleNum++;
}


main();

function main() {
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
  const shaderProgram = initShader(vertSource,fragSource);

  gProgramInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gGL.getAttribLocation(shaderProgram, "aVertPos"),
      normalPosition: gGL.getAttribLocation(shaderProgram, "aNorm"),
    },
    uniformLocations: {
      projectionMatrix: gGL.getUniformLocation(shaderProgram, "uProjMatrix"),
      modelViewMatrix: gGL.getUniformLocation(shaderProgram, "uViewMatrix"),
      lightPosition: gGL.getUniformLocation(shaderProgram, "lightPos"),
      viewPosition: gGL.getUniformLocation(shaderProgram, "viewPos"),
      lightColor: gGL.getUniformLocation(shaderProgram, "lightColor"),
      lightIntensity: gGL.getUniformLocation(shaderProgram, "lightIntensity"),
      objCol: gGL.getUniformLocation(shaderProgram,"objCol"),
    },
  };
  
    SinPreComp(gSinView,WAVE_BUFFER_SIZE);
    CosPreComp(gCosView,WAVE_BUFFER_SIZE);
    TanPreComp(gTanView, WAVE_BUFFER_SIZE);


    const Wave = makeStruct("ShaderProgram, Verticies, Indices, VertexCount, Normals, UVCords, RowNum, ColNum, Position, PositionsArray, IndiciesArray, Color");
    gSimpleWave = new Wave(shaderProgram, 0,0,0,[], [],0,0,[0.0,0.0,0.0],[], [], [.1,.5,1.0]);
    const Camera = makeStruct("Eye, ViewDir, UpDir");
    gCamera = new Camera([0.0,0.0,0.0],[0.0,0.0,1.0],[0.0,1.0,0.0]);
    const Light = makeStruct("Pos, Color, Intensity");
    gLight1 = new Light([0.0,1.0,-1.0],[1.0, 0.863, 0.537],1.5);
    GenerateMesh(gSimpleWave, gProgramInfo);
    gPreviousTime = gTime.getTime();
    //Set up Input
    document.addEventListener("keydown", (e) => {
      gKeysPressed[e.key] = true;
    });
  
    document.addEventListener("keyup", (e) => {
      gKeysPressed[e.key] = false;
    });
    document.onmousemove = CalcMouseDelta;
    
    MainLoop();
    
   
}



//==========================NEXT TASKS==========================
//Add Pointer Lock
//Load Boat obj parts and texture