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
    uniform vec3 uOrigin;
    uniform vec3 viewPos;

    out vec3 Normals;
    out vec3 FragPos;
    out vec2 UVCord;
    out vec3 vWorldPos;
    out vec3 VertPos;
    out vec4 vClipPos;
    out vec4 vDisplVal;

    void main()
    {
        float Frame = Time / 3000.0;
        vec3 MovedOrigin = vec3(uOrigin.x,1.0 + uOrigin.y, sin(Frame));
        float NoiseSize = 1.1 + sin(Frame);
        float NoiseMaskSize = .2 + sin(Frame);
        float NoiseGainTextSize = .5;
        float NoiseGain = texture(uTexture3D, vec3(-aVertPos.y*NoiseGainTextSize, aVertPos.x*NoiseGainTextSize, aVertPos.z*NoiseGainTextSize + Frame)).r;
        vec4 DisplacementTextMask = texture(uTexture3D, vec3(aVertPos.x*NoiseMaskSize, aVertPos.y*NoiseMaskSize, aVertPos.z*NoiseMaskSize + Frame));
        float DispMagnitude = texture(uTexture3D, vec3(aVertPos.x*NoiseSize, aVertPos.y*NoiseSize, aVertPos.z*NoiseSize + Frame)).r;
        vec4 DispDir = vec4(normalize(aVertPos.xyz - MovedOrigin.xyz),1.0);
        DispMagnitude *= NoiseGain;
        float MaskCutoff = abs(sin(Frame*2.0)) * 2.0;
        DispMagnitude = DisplacementTextMask.r > MaskCutoff * .3 ? DispMagnitude : 0.0;
        DispDir = DisplacementTextMask.r > MaskCutoff ? DispDir : -DispDir;
        
        VertPos = aVertPos.xyz; 
        vec4 ViewPos = uViewMatrix * uModelMatrix * (aVertPos + (DispDir * DispMagnitude));
        vec4 DisplacedPos = aVertPos + DispMagnitude;
        vec4 Pos = uProjMatrix * uViewMatrix * uModelMatrix * DisplacedPos;
        vec4 ProjNormals = uViewMatrix * vec4(aNorm,0.0);
        vec4 world = uModelMatrix * aVertPos;

        vClipPos = Pos;
        vWorldPos = world.xyz;
        Normals = ProjNormals.xyz;
        FragPos = ViewPos.xyz;
        UVCord = aUVCord;
        vDisplVal = vec4(DispDir.xyz * DispMagnitude,1.0);

         gl_Position = Pos;
        
    }