#version 300 es
    #define CC_CHANNEL_NUM 8
    precision highp float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform sampler2D uTextureScene;
    uniform float ccVals[CC_CHANNEL_NUM];
    uniform vec2 uResolution;  

    void main()
    {
        float GravityAm = .01;
        float Ratio = (uResolution.x * .5) / uResolution.y;
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x * 1.0)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        vec2 UVL = vec2((screenSpace.x * .5), screenSpace.y);
        vec3 DVeloText = texture(uTextureScene, UVL).rgb;
        float DnsFriction = 1.0 + ((1.0 - ccVals[0]) * .1);
        float VelFriction = 1.001;
        vec3 Output = DVeloText;

            Output = vec3(DVeloText.r / DnsFriction, DVeloText.gb / VelFriction);
        
        if (UVL.x < .5){Output.g = clamp(Output.g + GravityAm, -1.0, 1.0);}
        fragColor = vec4(vec3(Output), 1.0);
    }
