#version 300 es
precision mediump float;    
    in vec4 aVertPos;
    in vec2 aUVCord;
    in vec3 aQuadPos;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjMatrix;
    uniform mat4 uModelMatrix;
    uniform float Time;
    out vec3 FragPos;
    out vec2 UVCord;
    out vec3 StarPos;


    void main()
    {
        float Sec = Time/1000.0;
        float StarPosVar = 2.0;
        vec3 StarFloatAm = vec3(1.0,7.0,1.0);
        vec4 ViewPos = uViewMatrix * uModelMatrix * aVertPos;
        vec4 OutPos = uProjMatrix * uViewMatrix * uModelMatrix * aVertPos;
        vec4 FloatPos = vec4(
                            0.0,
                            sin(Sec * .5 + (aQuadPos.y*StarPosVar)) * StarFloatAm.y,
                            0.0,
                            0.0);
        gl_Position = OutPos + FloatPos;
        FragPos = ViewPos.xyz;
        StarPos = aQuadPos;
        UVCord = aUVCord;
    }