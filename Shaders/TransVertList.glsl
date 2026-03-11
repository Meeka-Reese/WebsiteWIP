#version 300 es
    #define MAX_BONES 24
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

    out vec3 Normals;
    out vec3 FragPos;
    out vec2 UVCord;
    out vec3 vWorldPos;
    out vec3 VertPos;
    out vec4 vClipPos;
    out vec4 vDisplVal;


    float FindWeight(int i)
    {
        float weight = 1.0;
        if (i < 4)
        {
            weight = aWeightColec1[i%4];
        }
        else if (i < 8)
        {
            weight = aWeightColec2[i%4];
        }
        else if (i < 12)
        {
            weight = aWeightColec3[i%4];
        }
        else if (i < 16)
        {
            weight = aWeightColec4[i%4];
        }
        else if (i < 20)
        {
            weight = aWeightColec5[i%4];
        }
        else if (i < 24)
        {
            weight = aWeightColec6[i%4];
        }
        return weight;
    }
    void main()
    {
        UVCord = aUVCord;
        vec4 ArmatureModPos = aVertPos;
         float weightText = 1.0;
        for (int i = 0; i < colecItemCount; i++)
        {
            weightText = FindWeight(i) * 1000.0;
            if (weightText > 0.0001)
            {
                vec4 newArmatureModPos = boneMatrixColec[i] * ArmatureModPos;
                vec4 newPos = mix(ArmatureModPos, newArmatureModPos, weightText);
                ArmatureModPos = newPos;
            }
            
        }
        

     
        float Frame = Time / 3000.0;
        vec3 MovedOrigin = vec3(uOrigin.x,1.0 + uOrigin.y, sin(Frame));
        float NoiseSize = 1.1 + sin(Frame);
        float NoiseMaskSize = .2 + sin(Frame);
        float NoiseGainTextSize = .5;
        float NoiseGain = texture(uTexture3D, vec3(-ArmatureModPos.y*NoiseGainTextSize, ArmatureModPos.x*NoiseGainTextSize, ArmatureModPos.z*NoiseGainTextSize + Frame)).r;
        vec4 DisplacementTextMask = texture(uTexture3D, vec3(ArmatureModPos.x*NoiseMaskSize, ArmatureModPos.y*NoiseMaskSize, ArmatureModPos.z*NoiseMaskSize + Frame));
        float DispMagnitude = texture(uTexture3D, vec3(ArmatureModPos.x*NoiseSize, ArmatureModPos.y*NoiseSize, ArmatureModPos.z*NoiseSize + Frame)).r;
        vec4 DispDir = vec4(normalize(ArmatureModPos.xyz - MovedOrigin.xyz),1.0);
        DispMagnitude *= NoiseGain;
        float MaskCutoff = 1.8 + abs(sin(Frame*2.0)) * 1.4;
        DispMagnitude = DisplacementTextMask.r > MaskCutoff * .3 ? DispMagnitude : 0.0;
        DispDir = DisplacementTextMask.r > MaskCutoff ? DispDir : -DispDir;
        
        VertPos = ArmatureModPos.xyz; 
        vec4 ViewPos = uViewMatrix * uModelMatrix * (ArmatureModPos + (DispDir * DispMagnitude));
        vec4 DisplacedPos = ArmatureModPos + DispMagnitude;
        vec4 Pos = uProjMatrix * uViewMatrix * uModelMatrix * ArmatureModPos;
        vec4 ProjNormals = uViewMatrix * vec4(aNorm,0.0);
        vec4 world = uModelMatrix * ArmatureModPos;

        vClipPos = Pos;
        vWorldPos = world.xyz;
        Normals = ProjNormals.xyz;
        FragPos = ViewPos.xyz;
        vDisplVal = vec4(DispDir.xyz * DispMagnitude,1.0);

         gl_Position = Pos;
        
    }