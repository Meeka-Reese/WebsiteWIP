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

    void main()
    {
        UVCord = aUVCord;
        float Frame = Time / 8000.0;
        float Disp = texture(uTexture3D, vec3(UVCord, sin(Frame) * .5)).r;
        float DispAm = 1.0;
        float yOffset = -1.0;
        vec4 DispVec = vec4(0.0,(Disp * DispAm) + yOffset, 0.0, 0.0);
        VertPos = aVertPos.xyz + DispVec.xyz; 
        vec4 ViewPos = uViewMatrix * uModelMatrix * aVertPos;
        vec4 Pos = uProjMatrix * uViewMatrix * uModelMatrix * (aVertPos + DispVec);
        gl_Position = Pos;
        vClipPos = Pos;
        vec4 ProjNormals = uViewMatrix * vec4(aNorm,0.0);
        vec4 world = uModelMatrix * aVertPos;
        vWorldPos = world.xyz;
        Normals = ProjNormals.xyz;
        FragPos = ViewPos.xyz;
        
        
    }