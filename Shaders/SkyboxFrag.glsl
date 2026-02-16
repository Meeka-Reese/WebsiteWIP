#version 300 es
    precision mediump float;    
    in vec2 UVCord;
    in vec3 Norm;
    in vec3 FragPos;
    uniform float Time;
    uniform samplerCube uSkybox; //https://webglfundamentals.org/webgl/lessons/webgl-skybox.html
    uniform mat4 uInverseViewDir;
    uniform sampler2D uTexture;
    uniform sampler2D depthTexture;
    uniform vec2 uResolution;
    out vec4 fragColor;
    void main()
    {
        float DepthTexture = texture(depthTexture, gl_FragCoord.xy/uResolution).r;
        float near = 0.1;
        float far = 100.0;
        float z = DepthTexture * 2.0 - 1.0;
        float linearDepth = (2.0 * near * far) / (far + near - z * (far - near));
        linearDepth = linearDepth / far;
        if (DepthTexture < 1.0)
        {
            //discard; //Disabled for now
        }
        vec3 Col1 = vec3(.32,.66,.93) * .8;
        vec3 Col2 = vec3(.26,.45,.60) * .3; //19.89, 34.425, 45.9
        vec3 MixedCol = ((Col2 * UVCord.y) + (Col1 * (1.0 - UVCord.y)))/2.0;
        vec4 Outline = texture(uTexture, UVCord);
        fragColor = vec4(MixedCol, 1.0);

    }