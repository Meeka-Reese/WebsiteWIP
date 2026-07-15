#version 300 es
    precision mediump float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform sampler2D uTextureScene;
    uniform vec2 uResolution;  
    float eps = .0001;
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
        vec4 InitColText = texture(uTextureScene, UVR);
        ColText *= DVeloText.r;
        vec3 CHSL = RGB2HSL(ColText.rgb);
        CHSL.b = mod(.8, DVeloText.r * 2.0);
        if (CHSL.b < .1) {CHSL.b = 0.0;}
        ColText.rgb = HSL2RGB(CHSL);
       // if (ColText.r + ColText.g + ColText.b <= .4) {ColText = vec4(1.0);}
        fragColor = vec4(vec3(abs(ColText.rgb)), 1.0);


    }
