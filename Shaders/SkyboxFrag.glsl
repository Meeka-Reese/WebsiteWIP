#version 300 es
    precision mediump float;    
    in vec2 UVCord;
    in vec3 Norm;
    in vec3 FragPos;
    uniform float Time;
    uniform samplerCube uSkybox; //https://webglfundamentals.org/webgl/lessons/webgl-skybox.html
    uniform mat4 uInverseViewDir;
    uniform sampler2D uTexture;
    out vec4 fragColor;
    void main()
    {
        vec3 Col1 = vec3(.32,.66,.93) * .8;
        vec3 Col2 = vec3(.26,.45,.60) * .3;
        vec3 MixedCol = ((Col2 * UVCord.y) + (Col1 * (1.0 - UVCord.y)))/2.0;
        vec4 Outline = texture(uTexture, UVCord);
        fragColor = vec4(MixedCol, 1.0);
        //vec4 t = uInverseViewDir * vec4(FragPos,1.0);
        //fragColor = texture(uSkybox, normalize(t.xyz / t.w));
    }