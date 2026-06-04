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
        vec2 screenSpace = vec2(((NewCord.x * 1.0)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        vec2 UVL = vec2((screenSpace.x * .5), screenSpace.y);
        vec2 UVR = vec2((screenSpace.x * .5) + .5, screenSpace.y);
        vec4 DVeloText = texture(uTextureScene, UVL);
        vec4 ColText = texture(uTextureScene, UVR);
        ColText *= DVeloText.r;
        fragColor = vec4(vec3(abs(ColText)), 1.0);
    }
