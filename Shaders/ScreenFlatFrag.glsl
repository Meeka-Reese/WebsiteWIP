#version 300 es
    precision mediump float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform sampler2D uTextureScene;
    uniform vec2 uResolution;  
    void main()
    {

        vec2 screenSpace = vec2((gl_FragCoord.x/(uResolution.x)), 
        (gl_FragCoord.y/(uResolution.y)));
        vec4 texColor = texture(uTextureScene, screenSpace);
        fragColor = texColor;
    }