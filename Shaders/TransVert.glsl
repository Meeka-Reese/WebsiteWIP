#version 300 es
    #define MAX_BONES 24
    #define CC_CHANNEL_NUM 8
    precision lowp sampler3D;     
    precision lowp sampler2DArray;   
    precision mediump float;     
    in vec4 aVertPos;
    in vec3 aNorm;
    in vec2 aUVCord;
    in vec4 aWeightColec1;
    in vec4 aWeightColec2;
    in vec4 aWeightColec3;
    in vec4 aWeightColec4;
    in vec4 aWeightColec5;
    in vec4 aWeightColec6;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjMatrix;
    uniform mat4 uModelMatrix;
    uniform sampler3D uTexture3D;
    uniform float Time;
    uniform vec3 uOrigin;
    uniform vec3 viewPos;
    uniform int colecItemCount;
    uniform mat4 boneMatrixColec[MAX_BONES];
    uniform float boneParentIndicies[MAX_BONES];
    uniform sampler2DArray weightImage2DArray;
    uniform float ccVals[CC_CHANNEL_NUM]; // set to 8

    out vec3 Normals;
    out vec3 FragPos;
    out vec2 UVCord;
    out vec3 vWorldPos;
    out vec3 VertPos;
    out vec4 vClipPos;
    out vec4 vDisplVal;

    float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }
    float FindWeight(vec2 UVCord, int i, float DispAm)
    {
        float w1 = texture(weightImage2DArray, vec3(UVCord.x,UVCord.y, i)).r;
        float w2 = texture(weightImage2DArray, vec3(UVCord.x+DispAm,UVCord.y, i)).r;
        float w3 = texture(weightImage2DArray, vec3(UVCord.x-DispAm,UVCord.y, i)).r;
        float w4 = texture(weightImage2DArray, vec3(UVCord.x,UVCord.y+DispAm, i)).r;
        float w5 = texture(weightImage2DArray, vec3(UVCord.x,UVCord.y-DispAm, i)).r;
        float w6 = texture(weightImage2DArray, vec3(UVCord.x+DispAm,UVCord.y-DispAm, i)).r;
        float w7 = texture(weightImage2DArray, vec3(UVCord.x-DispAm,UVCord.y-DispAm, i)).r;
        float w8 = texture(weightImage2DArray, vec3(UVCord.x+DispAm,UVCord.y+DispAm, i)).r;
        float w9 = texture(weightImage2DArray, vec3(UVCord.x-DispAm,UVCord.y+DispAm, i)).r;
        return max(max(max(max(max(max(max(max(w1, w2),w3),w4),w5),w6),w7),w8),w9);

    }
  
    void main()
    {
        UVCord = aUVCord;
        float Frame = Time / 3000.0;
        float HoverAmount = 1.0;
        float HoverSpeed = 2.0;
        float HoverY = sin(Frame * HoverSpeed) * HoverAmount;
        int IntFrame = int(Frame * 10.0) % colecItemCount;

        //==================ADDING DITHER TO UV========================
        float DitherScaler = .001;
        float RandSignX = rand(UVCord * .3);
        float RandSignY = rand(UVCord * .24);
        float DitherX = rand(UVCord) * DitherScaler;
        float DitherY = rand(UVCord*1.2) * DitherScaler;
        if (mod(RandSignX, 2.0) < 1.0) {DitherX *= -1.0;} //Flip sign randomly
        if (mod(RandSignY, 2.0) < 1.0) {DitherY *= -1.0;} //Flip sign randomly

        //==================FIND ARMATURE DISPLACEMENT====================
        vec4 ArmatureModPos = aVertPos;
         float weightText = 0.0;
         vec2 DitheredUV = vec2(UVCord.x + DitherX, UVCord.y + DitherY);
         float WeightSampDisp = .001;
        for (int i = 0; i < colecItemCount; i++)
        {
            weightText = FindWeight(DitheredUV, i, WeightSampDisp);

            if (weightText > 0.0001)
            {
                vec4 newArmatureModPos = boneMatrixColec[i] * ArmatureModPos;
                vec4 newPos = mix(ArmatureModPos, newArmatureModPos, weightText);
                ArmatureModPos = newPos;
            }
            
        }
        ArmatureModPos.y += HoverY;
        

        //=====================NOISE DISPLACEMENT===========================
        vec3 MovedOrigin = vec3(uOrigin.x,1.0 + uOrigin.y, sin(Frame));
        float NoiseSize = 1.1 + sin(Frame);
        float NoiseMaskSize = .2 + sin(Frame);
        float NoiseGainTextSize = .5;
        float NoiseGain = texture(uTexture3D, vec3(-ArmatureModPos.y*NoiseGainTextSize, ArmatureModPos.x*NoiseGainTextSize, ArmatureModPos.z*NoiseGainTextSize + Frame)).r;
        vec4 DisplacementTextMask = texture(uTexture3D, vec3(ArmatureModPos.x*NoiseMaskSize, ArmatureModPos.y*NoiseMaskSize, ArmatureModPos.z*NoiseMaskSize + Frame));
        //float DispMagnitude = texture(uTexture3D, vec3(ArmatureModPos.x*NoiseSize, ArmatureModPos.y*NoiseSize, ArmatureModPos.z*NoiseSize + Frame)).r;
        float DispMagnitude = ccVals[0] * .2; // using instead to automate
        vec4 DispDir = vec4(normalize(ArmatureModPos.xyz - MovedOrigin.xyz),1.0);
        DispMagnitude *= NoiseGain;
        float MaskCutoff = 1.8 * 1.4;
        DispMagnitude = DisplacementTextMask.r > MaskCutoff * .3 ? DispMagnitude : 0.0;
        DispDir = DisplacementTextMask.r > MaskCutoff ? DispDir : -DispDir;
        
        VertPos = ArmatureModPos.xyz; 
        vec4 ViewPos = uViewMatrix * uModelMatrix * (ArmatureModPos + (DispDir * DispMagnitude));
        vec4 DisplacedPos = ArmatureModPos + DispMagnitude;
        vec4 Pos = uProjMatrix * uViewMatrix * uModelMatrix * (ArmatureModPos + (DispDir * DispMagnitude));
        vec4 ProjNormals = uViewMatrix * vec4(aNorm,0.0);
        vec4 world = uModelMatrix * ArmatureModPos;

        //=====================SEND TO FRAG=================================
        vClipPos = Pos;
        vWorldPos = world.xyz;
        Normals = ProjNormals.xyz;
        FragPos = ViewPos.xyz;
        vDisplVal = vec4(DispDir.xyz * DispMagnitude,1.0);

         gl_Position = Pos;
        
    }