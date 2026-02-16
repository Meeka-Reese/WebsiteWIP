#version 300 es
    precision mediump float;   
    in vec4 aVertPos;
    in vec3 aNorm;
    in vec2 aUVCord;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjMatrix;
    uniform mat4 uModelMatrix;
    uniform vec2 uResolution;
    out vec3 FragPos;
    out vec3 Norm;
    out vec2 UVCord;
   
    void main()
    {
        float Ratio = uResolution.x / uResolution.y;
        Norm = aNorm;
        UVCord = aUVCord;
        vec4 ViewPos = uModelMatrix * aVertPos;
        vec4 OutPos = uModelMatrix * aVertPos;
        FragPos = vec3(OutPos.x,OutPos.y,1.0);
        gl_Position = vec4(OutPos.x,OutPos.y * Ratio,0.0,OutPos.w);
    }