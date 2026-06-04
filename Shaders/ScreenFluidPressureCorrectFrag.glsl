#version 300 es
    precision highp float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    uniform sampler2D uTextureScene;
    uniform sampler2D uTexturePressure;
    uniform vec2 uResolution; 
    uniform float DeltaTime; 
    out vec4 fragColor;
    vec2 UnitSize;


    vec2 VelocityCorrect(vec2 Cords, vec2 InitVel) 
    {
        vec2 dx = vec2(UnitSize.x, 0.0);
        vec2 dy = vec2(0.0, UnitSize.y);
        float pLeft  = texture(uTexturePressure, Cords - dx).r;
        float pRight = texture(uTexturePressure, Cords + dx).r;
        float pDown  = texture(uTexturePressure, Cords - dy).r;
        float pUp    = texture(uTexturePressure, Cords + dy).r;

        vec2 pressureGradient = vec2(pRight - pLeft, pUp - pDown) * 0.5;

        vec2 NewVelo = InitVel - pressureGradient;
        return NewVelo;
    }



    void main()
    {
        float TimeScale = 1.0;  
        float DiffAm = 1.0;
        float Ratio = (uResolution.x * .5) / uResolution.y;
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        vec2 UVL = vec2((screenSpace.x * .5), screenSpace.y); 
        UnitSize = vec2(1.0 / (uResolution.x), 1.0 / (uResolution.y));
        float InitalDensity = texture(uTextureScene, UVL).r;
        vec2 InitalVelocities = texture(uTextureScene, UVL).gb;
        vec3 Output = texture(uTextureScene, UVL).rgb;
        if (UVL.x < .5)
        {
            vec2 VeloCorrect = VelocityCorrect(UVL, InitalVelocities);
            Output = vec3(InitalDensity, VeloCorrect);
        }

        fragColor = vec4(vec3(Output), 1.0);
    }
