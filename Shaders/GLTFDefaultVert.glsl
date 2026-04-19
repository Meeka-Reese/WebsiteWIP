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
    out vec3 Normals;
    out vec3 FragPos;
    out vec2 UVCord;
    out vec3 CameraPos;
    out vec3 vWorldPos;
    out vec3 VertPos;
    out vec4 vClipPos;

    void GenerateBoneMatricies()
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
        int BoneParent = boneInd;//boneInd as first parent
        while (BoneParent != -1)
        {
            int NewInd = BoneParentIndex[BoneParent];
            BoneHierarchy1[numOfPar1] = NewInd;
            BoneParent = NewInd;
            numOfPar1++;
        }

        int numOfPar2 = 0;
        boneInd =  int(WeightInd.y);
        BoneParent = boneInd;//boneInd as first parent
        while (BoneParent != -1)
        {
            int NewInd = BoneParentIndex[BoneParent];
            BoneHierarchy2[numOfPar2] = NewInd;
            BoneParent = NewInd;
            numOfPar2++;
        }

        int numOfPar3 = 0;
        boneInd =  int(WeightInd.z);
        BoneParent = boneInd;//boneInd as first parent
        while (BoneParent != -1)
        {
            int NewInd = BoneParentIndex[BoneParent];
            BoneHierarchy3[numOfPar3] = NewInd;
            BoneParent = NewInd;
            numOfPar3++;
        }

        int numOfPar4 = 0;
        boneInd =  int(WeightInd.w);
        BoneParent = boneInd;//boneInd as first parent
        while (BoneParent != -1)
        {
            int NewInd = BoneParentIndex[BoneParent];
            BoneHierarchy4[numOfPar4] = NewInd;
            BoneParent = NewInd;
            numOfPar4++;
        }
        //-Create array transform models from parrents. You'll want to multiply the pos rot and scale shift by the weight of the initial bone

        mat4 BoneTransforms1[MAX_HEIRARCHY_SIZE];
        mat4 BoneTransforms2[MAX_HEIRARCHY_SIZE];
        mat4 BoneTransforms3[MAX_HEIRARCHY_SIZE];
        mat4 BoneTransforms4[MAX_HEIRARCHY_SIZE];

        float WeightScale = BoneWeights.x;
        for (int ind = 0; ind < numOfPar1; ind++)
        {
            int BoneIndex = BoneHierarchy1[numOfPar1 - ind];
            mat4 BoneMatrix = BoneMatrices[BoneIndex];
        }

    }

    void main()
    {

        VertPos = aVertPos.xyz; 
        vec4 ViewPos = uViewMatrix * uModelMatrix * aVertPos;
        vec4 Pos = uProjMatrix * uViewMatrix * uModelMatrix * aVertPos;
        gl_Position = Pos;
        vClipPos = Pos;
        vec4 ProjNormals = uViewMatrix * vec4(aNorm,0.0);
        vec4 world = uModelMatrix * aVertPos;
        vWorldPos = world.xyz;
        Normals = ProjNormals.xyz;
        FragPos = ViewPos.xyz;
        UVCord = aUVCord;
        
    }