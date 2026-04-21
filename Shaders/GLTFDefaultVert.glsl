#version 300 es
#define MAX_BONES 64
#define MAX_HEIRARCHY_SIZE 8
    in vec4 aVertPos;
    in vec3 aNorm;
    in vec2 aUVCord;
    in vec4 BoneWeights;
    in vec4 WeightInd;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 BoneMatrices[MAX_BONES];
    uniform int BoneParentIndex[MAX_BONES];
    uniform float Time;
    out vec3 Normals;
    out vec3 FragPos;
    out vec2 UVCord;
    out vec3 CameraPos;
    out vec3 vWorldPos;
    out vec3 VertPos;
    out vec4 vClipPos;

    mat4 scale(float x, float y, float z){
    return mat4(
        vec4(x,   0.0, 0.0, 0.0),
        vec4(0.0, y,   0.0, 0.0),
        vec4(0.0, 0.0, z,   0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    );
}

    vec4 GenerateBoneMatricies()
    {
        //Bone Parent indexing starts at 0, -1 if no parent
        //What I need 
        //-cycle through first effected bone and create array of bone indexes that parrent that bone in order or heirarchy
        //Done 
        //-Create array transform models from parrents. You'll want to multiply the pos rot and scale shift by the weight of the initial bone
        //-Apply transformation by the parent to the first child and then cycle through and do the same with the other three

        int BoneHierarchy1[MAX_BONES];
        int BoneHierarchy2[MAX_BONES];
        int BoneHierarchy3[MAX_BONES];
        int BoneHierarchy4[MAX_BONES];

        int numOfPar1 = 0; 
        highp int boneInd = int(WeightInd.x);
        int BoneParent = BoneParentIndex[boneInd];//boneInd as first parent
        BoneHierarchy1[numOfPar1] = boneInd;
        numOfPar1++;
        int KillNum = MAX_HEIRARCHY_SIZE;
        while (int(BoneParent) != -1 && numOfPar1 < KillNum)
        {
            int NewInd = BoneParentIndex[BoneParent];
            BoneHierarchy1[numOfPar1] = BoneParent;
            BoneParent = NewInd;
            numOfPar1++;
        }

        int numOfPar2 = 0;
        boneInd =  int(WeightInd.y);
        BoneParent = BoneParentIndex[boneInd];//boneInd as first parent
        BoneHierarchy2[numOfPar2] = boneInd;
        numOfPar2++;
        while (int(BoneParent) != -1 && numOfPar2 < KillNum)   
        {
            int NewInd = BoneParentIndex[BoneParent];
            BoneHierarchy2[numOfPar2] = BoneParent;
            BoneParent = NewInd;
            numOfPar2++;
        }

        int numOfPar3 = 0;
        boneInd =  int(WeightInd.z);
        BoneParent = BoneParentIndex[boneInd];//boneInd as first parent
        BoneHierarchy3[numOfPar3] = boneInd;
        numOfPar3++;
        while (int(BoneParent) != -1 && numOfPar3 < KillNum)
        {
            int NewInd = BoneParentIndex[BoneParent];
            BoneHierarchy3[numOfPar3] = BoneParent;
            BoneParent = NewInd;
            numOfPar3++;
        }

        int numOfPar4 = 0;
        boneInd = int(WeightInd.w);
        BoneParent = BoneParentIndex[boneInd];//boneInd as first parent
        BoneHierarchy4[numOfPar4] = boneInd;
        numOfPar4++;
        while (int(BoneParent) != -1 && numOfPar4 < KillNum)
        {
            int NewInd = BoneParentIndex[BoneParent];
            BoneHierarchy4[numOfPar4] = BoneParent;
            BoneParent = NewInd;
            numOfPar4++;
        }
        //-Create array transform models from parrents. You'll want to multiply the pos rot and scale shift by the weight of the initial bone

        vec4 Pos = aVertPos;
        vec4 FinalPos = vec4(vec3(0.0),1.0);
        //   if (BoneWeights.x > 0.0)
        // {
        //     mat4 ChainedMat1 = mat4(1.0);
        //     for (int ind = 0; ind < numOfPar1; ind++)
        //     {
        //         int BoneIndex = BoneHierarchy1[ind];
        //         mat4 BoneMatrix = BoneMatrices[BoneIndex];
        //         ChainedMat1 = BoneMatrix * ChainedMat1;
        //     }
        //     FinalPos += BoneWeights.x * (ChainedMat1 * Pos);
        // } //old method not needed but saving j incase
       FinalPos += BoneWeights.x * (BoneMatrices[int(WeightInd.x)] * Pos);
       FinalPos += BoneWeights.y * (BoneMatrices[int(WeightInd.y)] * Pos);
       FinalPos += BoneWeights.z * (BoneMatrices[int(WeightInd.z)] * Pos);
       FinalPos += BoneWeights.w * (BoneMatrices[int(WeightInd.w)] * Pos);
        return vec4(FinalPos.xyz, 1.0);

    }

    void main()
    {   
        float Frame = Time * .001;
        vec4 ArmatureUpdPos = GenerateBoneMatricies(); //this line causes blank screen from error
        //ArmatureUpdPos = mix(ArmatureUpdPos, aVertPos, abs(sin(Frame)));
        VertPos = ArmatureUpdPos.xyz; 
        vec4 ViewPos = uViewMatrix * uModelMatrix * ArmatureUpdPos;
        vec4 Pos = uProjMatrix * uViewMatrix * uModelMatrix * ArmatureUpdPos;
        gl_Position = Pos;
        vClipPos = Pos;
        vec4 ProjNormals = uViewMatrix * vec4(aNorm,0.0);
        vec4 world = uModelMatrix * ArmatureUpdPos;
        vWorldPos = world.xyz;
        Normals = ProjNormals.xyz;
        FragPos = ViewPos.xyz;
        UVCord = aUVCord;
        
    }