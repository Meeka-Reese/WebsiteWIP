#version 300 es
    precision highp float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    uniform sampler2D uTextureScene; //Original text in text slot
    uniform sampler2D uTextureForward; //read from Depth Texture Slot
    uniform sampler2D uTextureBackward; //read from BN text slot
    uniform vec2 uResolution;  
    out vec4 fragColor;
    vec2 UnitSize;

    
    vec3 CorrectAdvect(vec2 UV)
    {
        vec3 Forward  = texture(uTextureForward,  UV).rgb;
        vec3 Backward = texture(uTextureBackward, UV).rgb;
        vec3 Origin   = texture(uTextureScene,    UV).rgb;

        vec3 NewVals = Forward + 0.5 * (Origin - Backward);

    

        vec2 Texel = 1.0 / vec2(textureSize(uTextureScene, 0));
        vec3 N = texture(uTextureScene, UV + vec2( 0,  1) * Texel).rgb;
        vec3 S = texture(uTextureScene, UV + vec2( 0, -1) * Texel).rgb;
        vec3 E = texture(uTextureScene, UV + vec2( 1,  0) * Texel).rgb;
        vec3 W = texture(uTextureScene, UV + vec2(-1,  0) * Texel).rgb;

        vec3 MinVal = min(Origin, min(N, min(S, min(E, W))));
        vec3 MaxVal = max(Origin, max(N,     max(S, max(E, W))));
        vec3 Clamped = clamp(NewVals, MinVal, MaxVal);

        return vec3(Clamped);
    }
    void main()
    {
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        vec2 UVL = vec2((screenSpace.x * .5), screenSpace.y);
        vec2 UVTiled = vec2(mod(UVL.x, .5), UVL.y);
        UnitSize = vec2(1.0 / (uResolution.x), 1.0 / (uResolution.y));
        vec3 Advected = CorrectAdvect(UVL);
        fragColor = vec4(vec3(Advected.rgb), 1.0);
    }
