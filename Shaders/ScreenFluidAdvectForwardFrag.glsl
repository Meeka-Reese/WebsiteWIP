#version 300 es
    precision highp float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    uniform sampler2D uTextureScene;
    uniform vec2 uResolution;  
    uniform float DeltaTime; 
    out vec4 fragColor;
    vec2 UnitSize;

    
    vec3 FindAdvectVal(vec2 screenSpace, float InitDense, vec2 InitVel, float DiffAm, float Time)
    {

        vec2 Scaler = vec2(UnitSize.x * .45, UnitSize.y*.7);
        vec2 velocityInUV = clamp(((InitVel * Time * DiffAm) / uResolution), -Scaler, Scaler);
        
        vec2 ForwardUV = screenSpace + velocityInUV;
        
        vec2 halfPixel = 0.5 / uResolution;
        ForwardUV = vec2(clamp(ForwardUV.x, 0.0, 1.0),clamp(ForwardUV.y, 0.0, 1.0));

        vec3 NewVals= texture(uTextureScene, ForwardUV).rgb;
        
        return NewVals;
    }
    void main()
    {
        float Noise = 1.0 + abs(sin(DeltaTime * 2.0));
        float TimeScale = 100.3 * Noise;  
        float DiffAm = 1.0;
        float Ratio = (uResolution.x * .5) / uResolution.y;
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        vec2 UVL = vec2((screenSpace.x * .5), screenSpace.y);
        vec2 UVTiled = vec2(mod(UVL.x, .5), UVL.y);
        UnitSize = vec2(1.0 / (uResolution.x), 1.0 / (uResolution.y));
        float InitalDensity = texture(uTextureScene, UVTiled).r;
        vec2 InitalVelocities = texture(uTextureScene, UVTiled).gb;
        vec3 Advected = FindAdvectVal(UVL, InitalDensity, InitalVelocities, DiffAm, DeltaTime * TimeScale);
    
        fragColor = vec4(vec3(Advected.rgb), 1.0);
    }
