#version 300 es
    precision mediump float;    
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform sampler2D uTexture;
    uniform float Time;
    uniform vec2 uResolution;
    const float eps = 0.001;

    float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }
    //Set up 2 glitch effects

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
        float H = HSL.r;
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
                T1 = (L + S) – (L * S);
            }
            T2 = (2.0 * L) - T1;
            float TempR = H + (1.0/3.0);
            float TempG = H;
            float TempB = H - (1.0/3.0);
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
                R = T2 + (T1 – T2) * 6.0 * TempR;
            }
            else if (2.0 * TempR < 1.0)
            {
                R = T1;
            }
            else if (3.0 * TempR < 2.0)
            {
                R = T2 + (T1 – T2) * (0.666 – TempR) * 6.0;
            }
            else
            {
                R = T2;
            }
            //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
            if (6.0 * TempG < 1.0) 
            {
                G = T2 + (T1 – T2) * 6.0 * TempG;
            }
            else if (2.0 * TempG < 1.0)
            {
                G = T1;
            }
            else if (3.0 * TempG < 2.0)
            {
                G = T2 + (T1 – T2) * (0.666 – TempG) * 6.0;
            }
            else
            {
                G = T2;
            }
            //BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
            if (6.0 * TempB < 1.0) 
            {
                B = T2 + (T1 – T2) * 6.0 * TempB;
            }
            else if (2.0 * TempB < 1.0)
            {
                B = T1;
            }
            else if (3.0 * TempB < 2.0)
            {
                B = T2 + (T1 – T2) * (0.666 – TempB) * 6.0;
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
        float Frame = Time * .0001;
        float Ar = uResolution.x / uResolution.y;

        vec2 NewUV = vec2(UVCord.x, .615 + (UVCord.y * Ar));
        vec4 ScreenText = texture(uTexture, NewUV);
        vec3 HSL = RGB2HSL(ScreenText.rgb);
        HSL.r = mod(HSL.r + Frame, 1.0);
        vec3 NewRGB = HSL2RGB(HSL);
        
        fragColor = vec4(NewRGB, 1.0);
    }