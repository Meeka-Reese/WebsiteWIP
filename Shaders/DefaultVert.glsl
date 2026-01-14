#version 300 es
    in vec4 aVertPos;
    in vec3 aNorm;
    in vec2 aUVCord;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjMatrix;
    uniform mat4 uModelMatrix;
    out vec3 Normals;
    out vec3 FragPos;
    out vec2 UVCord;
    out vec3 CameraPos;
    out vec3 vWorldPos;

    void main()
    {
        vec4 ViewPos = uViewMatrix * uModelMatrix * aVertPos;
        gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * aVertPos;
        vec4 ProjNormals = uViewMatrix * vec4(aNorm,0.0);
        vec4 world = uModelMatrix * aVertPos;
        vWorldPos = world.xyz;
        Normals = ProjNormals.xyz;
        FragPos = ViewPos.xyz;
        UVCord = aUVCord;
        
    }