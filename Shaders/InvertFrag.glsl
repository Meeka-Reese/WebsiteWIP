#version 300 es
    #define CC_CHANNEL_NUM 8
    precision mediump float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform sampler2D uTexture;
    uniform float Alpha;
    uniform vec2 uResolution;
    uniform float ccVals[CC_CHANNEL_NUM];
    void main()
    {
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        vec4 texColor = texture(uTexture, UVCord);
        texColor = vec4(1.0 - texColor.r, 1.0 - texColor.g, 1.0 - texColor.b, 1.0);
        float exp = 0.1;
        texColor = vec4(pow(texColor.r, exp) - .1, pow(texColor.g, exp) + .2, pow(texColor.b, exp) + ccVals[1], 1.0);
        texColor = normalize(texColor);
        fragColor = vec4(texColor.rgb, 1.0);
    }