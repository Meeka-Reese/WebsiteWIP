#version 300 es
    precision highp float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    uniform sampler2D uTextureScene;
    uniform sampler2D uTexturePrev;
    uniform vec2 uResolution;  
    uniform float DeltaTime; 
    out vec4 fragColor;
    vec2 UnitSize = vec2(0.0,0.0);


    bool BorderCheck(vec2 UV)
        {
            if (UV.x - UnitSize.x < 0.0 || UV.x + UnitSize.x > .5 ||
            UV.y - UnitSize.y < 0.0 || UV.y + UnitSize.y > 1.0)
            {
                return true;
            }
            else{
                return false;
            }
        }
    float rand(vec2 co){
            return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
        }
    vec3 Difuse(vec2 Cords, float InitVal, vec2 InitVel, float DiffAm, float TimeStep)
    {
        bool IsBorder = BorderCheck(Cords);
        if (IsBorder) {return vec3(InitVal, InitVel);}
        float a = DiffAm * TimeStep;
        float N[4];
        vec2 NV[4];
        float NumEl = 4.0;
        vec2 LCords = vec2(Cords.x - UnitSize.x, Cords.y);
        float vL = texture(uTexturePrev, LCords).r;
        vec2 vvelL = texture(uTexturePrev, LCords).gb;
        N[0] = vL;
        NV[0] = vvelL;
        vec2 RCords = vec2(Cords.x + UnitSize.x, Cords.y);
        float vR = texture(uTexturePrev, RCords).r;
        vec2 vvelR = texture(uTexturePrev, RCords).gb;
        N[1] = vR;
        NV[1] = vvelR;
        vec2 TCords = vec2(Cords.x, Cords.y + UnitSize.y);
        float vT = texture(uTexturePrev, TCords).r;
        vec2 vvelT = texture(uTexturePrev, TCords).gb;
        N[2] = vT;
        NV[2] = vvelT;
        vec2 BCords = vec2(Cords.x, Cords.y - UnitSize.y);
        vec2 vvelB = texture(uTexturePrev, BCords).gb;
        float vB = texture(uTexturePrev, BCords).r;
        N[3] = vB;
        NV[3] = vvelB;
        
        float FinalVal = (InitVal + a * (N[0] + N[1] + N[2] + N[3])) / (1.0 + (4.0 * a));
        float FinalVX = (InitVel.x + a * (NV[0].x + NV[1].x + NV[2].x + NV[3].x)) / (1.0 + (4.0 * a));
        float FinalVY = (InitVel.y + a * (NV[0].y + NV[1].y + NV[2].y + NV[3].y)) / (1.0 + (4.0 * a));
        return vec3(FinalVal, FinalVX, FinalVY);
    }
    void main()
    {
        float DiffAm = 0.1;
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        vec2 UVR = vec2(screenSpace.x - .5, screenSpace.y);
        vec2 UVL = vec2((screenSpace.x * .5), screenSpace.y);
        UnitSize = vec2(1.0 / (uResolution.x), 1.0 / (uResolution.y));
        float initVal = texture(uTextureScene, UVL).r;
        vec2 Velo = texture(uTextureScene, UVL).gb;
        vec3 Dispersed = Difuse(UVL, initVal, Velo, DiffAm, DeltaTime *.1);

        vec3 Output = Dispersed;
      
        fragColor = vec4(vec3(Output), 1.0);
    }
