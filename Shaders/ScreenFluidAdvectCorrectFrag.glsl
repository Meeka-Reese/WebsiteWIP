#version 300 es
    precision highp float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    uniform sampler2D uTextureScene; //Original text in text slot
    uniform sampler2D uTextureForward; //read from Depth Texture Slot
    uniform sampler2D uTextureBackward; //read from BN text slot
    uniform vec2 uResolution; 
    uniform float Time;
    out vec4 fragColor;
    vec2 UnitSize;
    const float eps = 0.001;


vec3 RGB2HSL (vec3 RGB)
    {
        //using this for hsl https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
        float Max = max(max(RGB.r, RGB.g),RGB.b);
        float Min = min(min(RGB.r, RGB.g),RGB.b);
        float L = (Max + Min) / 2.0;
        float S = 0.0;
        float H = 0.0;
        if (Max != Min)
        {
            if (L <= .5)
            {
                S = (Max-Min)/(Max+Min);
            }
            else
            {
                S = (Max-Min)/(2.0-Max-Min);
            }

            if (Max - RGB.r < eps)
            {
                H = (RGB.g-RGB.b)/(Max-Min);
            }
            else if (Max - RGB.g < eps)
            {
                H = 2.0 + (RGB.b-RGB.r)/(Max-Min);
            }
            else if (Max - RGB.b < eps)
            {
                H = 4.0 + (RGB.r-RGB.g)/(Max-Min);
            }
        }
        H *= 60.0; //Turn to unit circle for hue
        vec3 HSL = vec3(H, S, L);
        return HSL;
    }

    vec3 HSL2RGB (vec3 HSL)
    {
        float R = 0.0; 
        float G = 0.0;
        float B = 0.0;
        float H = mod(HSL.r, 360.0);
        float S = HSL.g;
        float L = HSL.b;
        if (S == 0.0) //Grey scale
        {
            R = L;
            G = L;
            B = L;
        }
        else //Color
        {
            float T1 = 0.0;
            float T2 = 0.0;
            float Hp = H / 360.0;
            if (L < 0.5)
            {
                T1 = L * (1.0+S);
            }
            else
            {
                T1 = (L + S) - (L * S);
            }
            T2 = (2.0 * L) - T1;
            float TempR = Hp + (1.0/3.0);
            float TempG = Hp;
            float TempB = Hp - (1.0/3.0);
            //Make sure in range of 0 - 1
            TempR = TempR > 1.0 ? TempR - 1.0 : TempR;
            TempR = TempR < 0.0 ? TempR + 1.0 : TempR;
            TempG = TempG > 1.0 ? TempG - 1.0 : TempG;
            TempG = TempG < 0.0 ? TempG + 1.0 : TempG;
            TempB = TempB > 1.0 ? TempB - 1.0 : TempB;
            TempB = TempB < 0.0 ? TempB + 1.0 : TempB;
            //RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
            if (6.0 * TempR < 1.0) 
            {
                R = T2 + (T1 - T2) * 6.0 * TempR;
            }
            else if (2.0 * TempR < 1.0)
            {
                R = T1;
            }
            else if (3.0 * TempR < 2.0)
            {
                R = T2 + (T1 - T2) * (0.666 - TempR) * 6.0;
            }
            else
            {
                R = T2;
            }
            //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
            if (6.0 * TempG < 1.0) 
            {
                G = T2 + (T1 - T2) * 6.0 * TempG;
            }
            else if (2.0 * TempG < 1.0)
            {
                G = T1;
            }
            else if (3.0 * TempG < 2.0)
            {
                G = T2 + (T1 - T2) * (0.666 - TempG) * 6.0;
            }
            else
            {
                G = T2;
            }
            //BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
            if (6.0 * TempB < 1.0) 
            {
                B = T2 + (T1 - T2) * 6.0 * TempB;
            }
            else if (2.0 * TempB < 1.0)
            {
                B = T1;
            }
            else if (3.0 * TempB < 2.0)
            {
                B = T2 + (T1 - T2) * (0.666 - TempB) * 6.0;
            }
            else
            {
                B = T2;
            }
        }   

        vec3 RGB = vec3(R,G,B);
        return RGB;
    }
    
    vec3 CorrectAdvect(vec2 UV)
    {
        vec3 Forward  = texture(uTextureForward,  UV).rgb;
        vec3 Backward = texture(uTextureBackward, UV).rgb;
        vec3 Origin   = texture(uTextureScene,    UV).rgb;

        vec3 NewVals = Forward + 0.5 * (Origin - Backward);

    

        vec2 Texel = 1.0 / vec2(textureSize(uTextureScene, 0));
        vec3 N = texture(uTextureScene, UV + vec2(0,  Texel.y)).rgb;
        vec3 S = texture(uTextureScene, UV + vec2(0, -Texel.y)).rgb;
        vec3 E = texture(uTextureScene, UV + vec2(Texel.x, 0)).rgb;
        vec3 W = texture(uTextureScene, UV + vec2(-Texel.x,  0)).rgb;

        vec3 MinVal = min(Origin, min(N, min(S, min(E, W))));
        vec3 MaxVal = max(Origin, max(N, max(S, max(E, W))));
        vec3 Clamped = clamp(NewVals, MinVal, MaxVal);
       // if (Clamped != NewVals) {Clamped = Forward;}
        if (UV.x > .5) {
            vec3 CLHSL = RGB2HSL(Clamped);
            CLHSL.r += (sin(Clamped.r) + sin(Clamped.b)) * .01;
            CLHSL.b = .5;
            Clamped = HSL2RGB(CLHSL);
            Clamped = clamp(Clamped, 0.0, 1.0);
            }
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
