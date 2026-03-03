import { mat4,vec3,vec4,quat } from './Externals/esm/index.js';
import { loadTexture, LoadImage } from  './ShaderFunc.js';
import { gGL } from './webgl-demo.js';
import { CreateImageArray } from './ShaderFunc.js';
import { Keyframe, Timeline, Anim1} from './Animation.js';
import { lerp } from './Utils.js';


export class Bone {
    constructor(Position, Scale, Rotation, ParentIndex, WeightMap, WeightMapArray, Index)
    {
        this.Position = Position;
        this.Scale = Scale;
        this.Rotation = Rotation;
        this.ParentIndex = ParentIndex; // Not using children rn, Baking weight maps of children into parents for runtime speed
        this.WeightMap = WeightMap;
        this.WeightMapArray = WeightMapArray;
        let ModelMat = mat4.create();
        this.Index = Index;
    }
    Transform(Position, Scale, Rotation)
    {
        this.Position = Position;
        this.Scale = Scale;
        this.Rotation = Rotation;
        SetUpMat();
    }
    SetUpMat()
    {
        let RotationMatrix = mat4.create();
        let q = quat.create();
        quat.fromEuler(q, Rotation[0], Rotation[1], Rotation[2]);
        mat4.fromQuat(RotationMatrix,q);
        let Pos = vec3.fromValues(Position[0],Position[1],Position[2]);
        let Scale = vec3.fromValues(Scale[0],Scale[1],Scale[2]);
        ModelMat = mat4.fromRotationTranslationScale(ModelMatrix, q, Pos, Scale);
    }
    get Matrix()
    {
        return ModelMat;
    }
    
}
export class Armature{
    constructor(BoneColec, Mesh, BoneStringColec, VertWeightDataColec, StartTime)
    {
        this.BoneColec = BoneColec;
        this.BoneStringColec = BoneStringColec;
        this.Mesh = Mesh;
        this.weightImagesColec = [];
        this.weightArrayArray = [];
        this.weightImage2DArray;
        this.bonePosColec = [];
        this.boneRotColec = [];
        this.boneScaleColec = [];
        this.boneMatrixColec = [];
        this.boneMatrixArray = new Float32Array(0);;
        this.boneParentIndicies = [];
        this.Timeline = new Timeline();
        Anim1(this.Timeline);
        this.StartTime = StartTime;

        this.VertWeightDataColec = VertWeightDataColec;
        this.WeightBuffer1 = null;
        this.WeightBuffer2 = null;
        this.WeightBuffer3 = null;
        this.WeightBuffer4 = null;
        this.WeightBuffer5 = null;
        this.WeightBuffer6 = null;
        this.setUpUniforms();
    }
    async setUpUniforms()
    {
        this.weightImagesColec = [];
        this.bonePosColec = [];
        this.boneRotColec = [];
        this.boneScaleColec = [];
        this.boneParentIndicies = [];
        this.weightArrayArray  = [];


        for (let i = 0; i < this.BoneColec.length; i++)
        {
            this.weightArrayArray.push(this.BoneColec[i].WeightMapArray);
            this.weightImagesColec.push(this.BoneColec[i].WeightMap);
            let Pos = vec3.fromValues(this.BoneColec[i].Position);
            let Rot = vec3.fromValues(this.BoneColec[i].Rotation);
            let Scale = vec3.fromValues(this.BoneColec[i].Scale);
            let RotationMatrix = mat4.create();
            let q = quat.create();
            quat.fromEuler(q, Rot[0], Rot[1], Rot[2]);
            mat4.fromQuat(RotationMatrix,q);
            let ModelMatrix = mat4.create();
            ModelMatrix = mat4.fromRotationTranslationScale(ModelMatrix, q, Pos, Scale);
            this.boneMatrixColec.push(ModelMatrix);

            this.boneParentIndicies.push(this.BoneColec[i].ParentIndex); //unused rn
        }

        this.weightImage2DArray = await CreateImageArray(this.weightArrayArray, 1024, 1024);

    }
    async SetUpWeightBuffer()
    {
        const weightBuff1 = gGL.createBuffer();
        const weightBuff2 = gGL.createBuffer();
        const weightBuff3 = gGL.createBuffer();
        const weightBuff4 = gGL.createBuffer();
        const weightBuff5 = gGL.createBuffer();
        const weightBuff6 = gGL.createBuffer();
        
        gGL.bindBuffer(gGL.ARRAY_BUFFER, weightBuff1); 
        gGL.bufferData(gGL.ARRAY_BUFFER, new Float16Array(VertWeightDataColec[0]), gGL.STATIC_DRAW); 
        gGL.bindBuffer(gGL.ARRAY_BUFFER, weightBuff2); 
        gGL.bufferData(gGL.ARRAY_BUFFER, new Float16Array(VertWeightDataColec[1]), gGL.STATIC_DRAW);
        gGL.bindBuffer(gGL.ARRAY_BUFFER, weightBuff3); 
        gGL.bufferData(gGL.ARRAY_BUFFER, new Float16Array(VertWeightDataColec[2]), gGL.STATIC_DRAW); 
        gGL.bindBuffer(gGL.ARRAY_BUFFER, weightBuff4);
        gGL.bufferData(gGL.ARRAY_BUFFER, new Float16Array(VertWeightDataColec[3]), gGL.STATIC_DRAW);
        gGL.bindBuffer(gGL.ARRAY_BUFFER, weightBuff5);
        gGL.bufferData(gGL.ARRAY_BUFFER, new Float16Array(VertWeightDataColec[4]), gGL.STATIC_DRAW);
        gGL.bindBuffer(gGL.ARRAY_BUFFER, weightBuff6);
        gGL.bufferData(gGL.ARRAY_BUFFER, new Float16Array(VertWeightDataColec[5]), gGL.STATIC_DRAW);

        this.WeightBuffer1 = weightBuff1;
        this.WeightBuffer2 = weightBuff2;
        this.WeightBuffer3 = weightBuff3;
        this.WeightBuffer4 = weightBuff4;
        this.WeightBuffer5 = weightBuff5;
        this.WeightBuffer6 = weightBuff6;

    }

    ApplyTransform()
    {
        for (let i = 0; i < this.BoneColec.length; i++)
        {
            let Pos = vec3.fromValues(this.BoneColec[i].Position[0], this.BoneColec[i].Position[1], this.BoneColec[i].Position[2]);
            let Rot = vec3.fromValues(this.BoneColec[i].Rotation[0], this.BoneColec[i].Rotation[1], this.BoneColec[i].Rotation[2]);
            let Scale = vec3.fromValues(this.BoneColec[i].Scale[0],this.BoneColec[i].Scale[1],this.BoneColec[i].Scale[2]);
            let RotationMatrix = mat4.create();
            let q = quat.create();
            quat.fromEuler(q, Rot[0], Rot[1], Rot[2]);
            mat4.fromQuat(RotationMatrix,q);
            let ModelMatrix = mat4.create();
            ModelMatrix = mat4.fromRotationTranslationScale(ModelMatrix, q, Pos, Scale);
            this.boneMatrixColec[i] = ModelMatrix;
        }
        const numMatrices = this.boneMatrixColec.length;
        this.boneMatrixArray = new Float32Array(numMatrices * 16);
        
        for (let i = 0; i < numMatrices; i++) {
            const matrix = this.boneMatrixColec[i];
            // Check if matrix is valid
            if (!matrix || matrix.some(isNaN)) {
                console.warn(`Invalid matrix for bone ${i}, using identity`);
                // Set identity matrix for this bone
                for (let j = 0; j < 16; j++) {
                    this.boneMatrixArray[i * 16 + j] = (j % 5 === 0) ? 1 : 0;
                }
            } else {
                this.boneMatrixArray.set(matrix, i * 16);
            }
        }
        

    }
    
    ApplyAnimation(CurrentTime)
    {
        let ActiveBone;
        let DeltaTime = CurrentTime - this.StartTime;
        for (let i = 0; i < this.Timeline.Keyframes.length; i++)
        {
            let keyframe = this.Timeline.Keyframes[i];
            if (DeltaTime > Keyframe.Time || DeltaTime < keyframe.StartTime) {continue;}
            //console.log("Updating Animation, Current Time is : " + DeltaTime + "keyframe Time is : " + keyframe.Time);
            let Alpha = keyframe.Time != 0 ? Math.min((DeltaTime - keyframe.StartTime) / (keyframe.Time - keyframe.StartTime), 1) : 1;
            let ActiveBoneIndex = this.BoneStringColec.indexOf(keyframe.BoneName);
            ActiveBone = this.BoneColec[ActiveBoneIndex];
            let CurrentPos = vec3.fromValues(ActiveBone.Position[0], ActiveBone.Position[1], ActiveBone.Position[2]);
            let TargetPos = vec3.fromValues(keyframe.Position[0], keyframe.Position[1], keyframe.Position[2]);
            let OutPos = vec3.create();
            OutPos = vec3.lerp(OutPos, CurrentPos, TargetPos, Alpha);

            let CurrentRot = vec3.fromValues(ActiveBone.Rotation[0], ActiveBone.Rotation[1], ActiveBone.Rotation[2]);
            let TargetRot = vec3.fromValues(keyframe.Rotation[0], keyframe.Rotation[1], keyframe.Rotation[2]);
            let OutRot = vec3.create();
            OutRot = vec3.lerp(OutRot, CurrentRot, TargetRot, Alpha);

            let CurrentScale = vec3.fromValues(ActiveBone.Scale[0], ActiveBone.Scale[1], ActiveBone.Scale[2]);
            let TargetScale = vec3.fromValues(keyframe.Scale[0], keyframe.Scale[1], keyframe.Scale[2]);
            let OutScale = vec3.create();
            OutScale = vec3.lerp(OutScale, CurrentScale, TargetScale, Alpha);

            ActiveBone.Position = [OutPos[0], OutPos[1], OutPos[2]];
            ActiveBone.Rotation = [OutRot[0], OutRot[1], OutRot[2]];
            ActiveBone.Scale = [OutScale[0], OutScale[1], OutScale[2]];
        }
        this.ApplyTransform();
    }
}

export async function LoadBones(MainDirectory, ImageNameColec, ParentColec) //Works specifically with png
{
    if (ImageNameColec.length != ParentColec.length) {
        console.log("Bone colec and Parent Colec Different Sizes");
        return -1;
    }
    let TotalDirectory = MainDirectory;
    let BoneColec = [];
    let BoneStringColec = [];
    let Pos = [0.0,0.0,0.0];
    let Scale = [1.0,1.0,1.0];
    let Rot = [0.0,0.0,0.0];
    for (let i = 0; i < ImageNameColec.length; i++)
    {
        TotalDirectory = MainDirectory + ImageNameColec[i] + ".png";
        let WeightMap = await loadTexture(gGL, TotalDirectory);
        let WeightMapArray = await LoadImage(TotalDirectory);
        let BoneInst = new Bone(Pos, Scale, Rot, null, WeightMap, WeightMapArray.pixels, i);
        BoneColec.push(BoneInst);//ImageNameColec[i], 
        BoneStringColec.push(ImageNameColec[i]);
    }
    let Parent = "";
    for (let i = 0; i < ParentColec.length; i++)
    { 
        BoneColec[i].ParentIndex = BoneStringColec.indexOf(ParentColec[i]);
    }
    let OutObj = new Object();
    OutObj.colec = BoneColec;
    OutObj.stringColec = BoneStringColec;
    return OutObj;
    
}

