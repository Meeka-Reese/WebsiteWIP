import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {makeStruct, gGL} from './webgl-demo.js';
import {quat, vec3, vec4, mat4} from './Externals/esm/index.js';

const ThreeStruct = makeStruct("Position, Rotation, Scale, vertexBuffer, indexBuffer, VertexCount, normalBuffer, Texture, textureBuffer, Color, Skeleton");
export class GLTFSkeleton
{
    constructor(Bones, BoneParents, WeightBuff, WeightInd, BoneMatrices)
    {
        this.Bones = Bones;
        this.BoneParents = BoneParents;
        this.WeightBuff = WeightBuff;
        this.WeightInd = WeightInd;
        this.BoneMatrices = BoneMatrices;
    }
}

export async function LoadThreeScene(url)
{

  let ObjColec = [];
  let DefaultCol = [1.0,1.0,1.0,1.0];
  let ind = 0;
  const loader = new GLTFLoader() //potentially load async
  const {ModelColec, AniMixer, AniClips, Scene} = await new Promise((resolve, reject)=>
  {

  loader.load(
      url, //'./models/TestChar.glb'
    ( gltf ) => {
      let anMix = new THREE.AnimationMixer(gltf.scene);
      let anClips = gltf.animations;
      let results = new Map();
      const model = gltf.scene;
      let _scene = new THREE.Scene();
      _scene = model;
      model.traverse((child) =>
      {
        let ThreeObj;
        if (child.isMesh)
        { //Convert from three.js data type to my fuck ass data type
          //console.log("Child name is " + child.name);
          ind++;
          let Position = [child.position.x, child.position.y, child.position.z];
          let Rotation = [child.rotation.x, child.rotation.y, child.rotation.z];
          let Scale = [child.scale.x, child.scale.y, child.scale.z];
          let Texture = null; //Setup manually when I've figured out the vertex shit
          let Name = child.name;
        
          

          let VertAr = child.geometry.getAttribute("position").array;

          let IndAr = child.geometry.index.array;
          let VertexCount = IndAr.length; //number of verts loaded 
          let NormAr = child.geometry.getAttribute("normal").array;
          let UVAR = /** @type {THREE.BufferAttribute} */ (child.geometry.getAttribute('uv'));
          if (UVAR != undefined) {UVAR = UVAR.array;} 
    
          let VertBuff = gGL.createBuffer();
          let IndBuff = gGL.createBuffer();
          let NormBuff = gGL.createBuffer();
          let textBuff = gGL.createBuffer();

          gGL.bindBuffer(gGL.ARRAY_BUFFER, VertBuff); // choose pos buffer as active buffer
          gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(VertAr), gGL.STATIC_DRAW); //apply data to active buffer
          gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, IndBuff); // choose pos buffer as active buffer
          gGL.bufferData(gGL.ELEMENT_ARRAY_BUFFER, new Uint16Array(IndAr), gGL.STATIC_DRAW); //apply data to active buffer
          gGL.bindBuffer(gGL.ARRAY_BUFFER, NormBuff); // choose pos buffer as active buffer
          gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(NormAr), gGL.STATIC_DRAW); //apply data to active buffer
          gGL.bindBuffer(gGL.ARRAY_BUFFER, textBuff); // choose pos buffer as active buffer
          gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(UVAR), gGL.STATIC_DRAW); //apply data to active buffer

          ThreeObj = new ThreeStruct(Position, Rotation, Scale, VertBuff, IndBuff, VertexCount, 
          NormBuff, Texture, textBuff, DefaultCol, null, null); //null skeleton and matricies
          if (UVAR != undefined && VertAr != undefined && IndAr != undefined && NormBuff != undefined && textBuff != undefined) 
          {
            results.set(Name, ThreeObj);
          }
        }
        if (child.isSkinnedMesh)
        {
            let Bones = child.skeleton.bones;
            let BoneNames = [];
            let BoneParentsInd = [];
            let WeightArr = child.geometry.getAttribute("skinWeight").array;
            let WeightIndArr = child.geometry.getAttribute("skinIndex").array;
            let WeightBuff = gGL.createBuffer();
            let WeightIndBuff = gGL.createBuffer();
            gGL.bindBuffer(gGL.ARRAY_BUFFER, WeightBuff); // choose pos buffer as active buffer
            gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(WeightArr), gGL.STATIC_DRAW); //apply data to active buffer
            gGL.bindBuffer(gGL.ARRAY_BUFFER, WeightIndBuff); // choose pos buffer as active buffer
            gGL.bufferData(gGL.ARRAY_BUFFER, new Uint16Array(WeightIndArr), gGL.STATIC_DRAW); //apply data to active buffer
            for (let i = 0; i < Bones.length; i++)
            {
                BoneNames.push(Bones[i].name); //easier way to do this?
            }
            for (let i = 0; i < Bones.length; i++)
            {
                let BonePar = Bones[i].parent;
                let Ind = BoneNames.indexOf(BonePar.name);
                BoneParentsInd.push(Ind);
            }
            //Bone Parent indexing starts at 0, -1 if no parent
            //Generate Bone Matricies
            let BoneMatrices = []; //create matrices for all bones  //use uniforms for now   
            let RotationMatrix = mat4.create();
            let q = quat.create();
            let ModelMatrix = mat4.create();
            for (let i = 0; i < Bones.length; i++)
            {
                let Bones = child.skeleton.bones;
                RotationMatrix = mat4.create();
                q = quat.fromValues(Bones[i].quaternion.x, Bones[i].quaternion.y, Bones[i].quaternion.z, Bones[i].quaternion.w);
                mat4.fromQuat(RotationMatrix,q);
                let Pos = vec3.fromValues(Bones[i].position.x,Bones[i].position.y,Bones[i].position.z);
                let Scale = vec3.fromValues(Bones[i].scale.x,Bones[i].scale.y,Bones[i].scale.z);
                ModelMatrix = mat4.fromRotationTranslationScale(ModelMatrix, q, Pos, Scale);
                BoneMatrices.push(ModelMatrix);
            }

            let Skeleton = new GLTFSkeleton(Bones, BoneParentsInd, WeightBuff, WeightIndBuff, BoneMatrices);
            ThreeObj.Skeleton = Skeleton;
            //console.log(ThreeObj);
        }   

    });
      console.log(ind + " Children are meshes and the length of ObjColec is " + results.length);

      resolve({ModelColec: results, AniMixer: anMix, AniClips: anClips, Scene: _scene,});

    },
    ( xhr ) => {
      // called while loading is progressing
      console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
    },
    ( error ) => {
      // called when loading has errors
      console.error( 'An error happened', error );
      reject(error);
    },
  );
});
console.log(typeof ModelColec);
return{ModelMap: ModelColec, AnimationMixer: AniMixer, AnimationClips: AniClips, AniScene: Scene,};
}

export function AddAnimation(ModelColec, AniMixer, AniClip)
{
    let action = AniMixer.clipAction(AniClip);
    action.play();
    return AniMixer;
}
export async function UpdateModel(Scene, ModelDict)
{
    const ModelColec = await new Promise((resolve, reject) => 
    {
        try {
        let TextureBuffDict = new Map();//Fill texture with buffer stored in model dict
        ModelDict.forEach((value, key) =>
        {
            let Buff = value.Texture;
            let Name = key;
            TextureBuffDict.set(Name, Buff);
        })
        let results = new Map();
        let DefaultCol = [1.0,1.0,1.0,1.0];
        let ind = 0;
        Scene.traverse((child) =>
      {
        if (child.isMesh)
        { //Convert from three.js data type to my fuck ass data type
        //   console.log("Child name is " + child.name);
          ind++;
          let Position = [child.position.x, child.position.y, child.position.z];
          let Rotation = [child.rotation.x, child.rotation.y, child.rotation.z];
          let Scale = [child.scale.x, child.scale.y, child.scale.z];
          let Name = child.name;
          let Texture = TextureBuffDict.get(Name); //Setup manually when I've figured out the vertex shit
          
        
          let VertAr = child.geometry.getAttribute("position").array;

          let IndAr = child.geometry.index.array;
          let VertexCount = IndAr.length; //number of verts loaded 
          let NormAr = child.geometry.getAttribute("normal").array;
          let UVAR = /** @type {THREE.BufferAttribute} */ (child.geometry.getAttribute('uv'));
          if (UVAR != undefined) {UVAR = UVAR.array;} 
    
          let VertBuff = gGL.createBuffer();
          let IndBuff = gGL.createBuffer();
          let NormBuff = gGL.createBuffer();
          let textBuff = gGL.createBuffer();

          gGL.bindBuffer(gGL.ARRAY_BUFFER, VertBuff); // choose pos buffer as active buffer
          gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(VertAr), gGL.STATIC_DRAW); //apply data to active buffer
          gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, IndBuff); // choose pos buffer as active buffer
          gGL.bufferData(gGL.ELEMENT_ARRAY_BUFFER, new Uint16Array(IndAr), gGL.STATIC_DRAW); //apply data to active buffer
          gGL.bindBuffer(gGL.ARRAY_BUFFER, NormBuff); // choose pos buffer as active buffer
          gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(NormAr), gGL.STATIC_DRAW); //apply data to active buffer
          gGL.bindBuffer(gGL.ARRAY_BUFFER, textBuff); // choose pos buffer as active buffer
          gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(UVAR), gGL.STATIC_DRAW); //apply data to active buffer

          let ThreeObj = new ThreeStruct(Position, Rotation, Scale, VertBuff, IndBuff, VertexCount, 
          NormBuff, Texture, textBuff, DefaultCol);
          if (UVAR != undefined && VertAr != undefined && IndAr != undefined && NormBuff != undefined && textBuff != undefined) 
          {
            results.set(Name, ThreeObj);
          }
        }
    });
        resolve(results);
    }
    catch(error)
    {
        reject(error);
    }
});
      return {Dict: ModelColec};
}