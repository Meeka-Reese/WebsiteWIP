#version 300 es
    precision lowp sampler3D;     
    precision mediump float;     
    in vec4 aVertPos;
    in vec3 aNorm;
    in vec2 aUVCord;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjMatrix;
    uniform mat4 uModelMatrix;
    uniform sampler3D uTexture3D;
    uniform float Time;
    out vec3 Normals;
    out vec3 FragPos;
    out vec2 UVCord;
    out vec3 CameraPos;
    out vec3 vWorldPos;
    out vec3 VertPos;
    out vec4 vClipPos;
    out vec4 vDisplVal;

    void main()
    {
        float Frame = Time / 8000.0;
        float NoiseSize = 1.1;
        float NoiseMaskSize = .2;
        vec4 DisplacementTextMask = texture(uTexture3D, vec3(aVertPos.x*NoiseMaskSize, aVertPos.y*NoiseMaskSize, aVertPos.z*NoiseMaskSize + Frame));
        vec4 DisplacementText = texture(uTexture3D, vec3(aVertPos.x*NoiseSize, aVertPos.y*NoiseSize, aVertPos.z*NoiseSize + Frame));
        float MaskCutoff = abs(sin(Frame*2.0))-.35;
        DisplacementText = DisplacementTextMask.r > MaskCutoff ? DisplacementText : vec4(0.0);
        DisplacementText.w = 0.0;
        vDisplVal = DisplacementText;
        VertPos = aVertPos.xyz; 
        vec4 ViewPos = uViewMatrix * uModelMatrix * (aVertPos + (DisplacementText * 5.0));
        vec4 DisplacedPos = aVertPos + DisplacementText;
        vec4 Pos = uProjMatrix * uViewMatrix * uModelMatrix * DisplacedPos;
        gl_Position = Pos;
        vClipPos = Pos;
        vec4 ProjNormals = uViewMatrix * vec4(aNorm,0.0);
        vec4 world = uModelMatrix * aVertPos;
        vWorldPos = world.xyz;
        Normals = ProjNormals.xyz;
        FragPos = ViewPos.xyz;
        UVCord = aUVCord;
        
    }