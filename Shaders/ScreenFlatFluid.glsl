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
        float Ratio = (uResolution.x * .5) / uResolution.y;
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        vec4 texColor = texture(uTextureScene, screenSpace);
        vec3 Col = vec3(texColor.r * .75, texColor.r * .25, texColor.r * .5);
        fragColor = vec4(vec3(abs(Col)), 1.0);
    }
