#version 300 es
    precision highp float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    uniform sampler2D uTextureScene;
    uniform vec2 uResolution;  
    uniform float DeltaTime; 
    out vec4 fragColor;
    vec2 UnitSize = vec2(0.0,0.0);

   bool BorderCheck(vec2 UV)
    {
        if (UV.x - UnitSize.x < 0.0 || UV.x + UnitSize.x > 1.0 ||
        UV.y - UnitSize.y < 0.0 || UV.y + UnitSize.y > 1.0)
        {
            return true;
        }
        else{
            return false;
        }
    }
    float FindDivergence(vec2 InitVelo, vec2 screenSpace)
    {
        bool IsBorder = BorderCheck(screenSpace);
        if (IsBorder) {return 0.0;}
        vec2 TotalUnDiverge = vec2(0.0);
        vec2 uvU = vec2(screenSpace.x - UnitSize.x, screenSpace.y);
        vec2 uvU1 = vec2(screenSpace.x + UnitSize.x, screenSpace.y);
        vec2 uvV = vec2(screenSpace.x, screenSpace.y - UnitSize.y);
        vec2 uvV1 = vec2(screenSpace.x, screenSpace.y + UnitSize.y);
        float U = texture(uTextureScene, uvU).g;
        float U1 = texture(uTextureScene, uvU1).g;
        float V = texture(uTextureScene, uvV).b;
        float V1 = texture(uTextureScene, uvV1).b;
        float D = (U1 - U) + (V1 - V);
        return D;
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
        float Divergence = FindDivergence(InitalVelocities, UVL);
        fragColor = vec4(vec3(Divergence, Divergence, Divergence), 1.0);
    }
