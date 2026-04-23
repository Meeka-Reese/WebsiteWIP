#version 300 es
    #define CC_CHANNEL_NUM 8
    precision mediump float;    
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform sampler2D uTexture;
    uniform sampler2D BloomText;
    uniform float Time;
    uniform vec2 uResolution;
    uniform float BlurAmount;
    uniform vec3 OutlineCol;
    uniform float OutlineCutoff;
    uniform vec3 BGCol;
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

    void make_kernel(inout vec4 n[9], sampler2D tex, vec2 coord)
    {
        float Frame = Time * .001;
        float w = 5.0 / uResolution.x;
        float h = 5.0 / uResolution.y;

        n[0] = texture(tex, coord + vec2( -w, -h));
        n[1] = texture(tex, coord + vec2(0.0, -h));
        n[2] = texture(tex, coord + vec2(  w, -h));
        n[3] = texture(tex, coord + vec2( -w, 0.0));
        n[4] = texture(tex, coord);
        n[5] = texture(tex, coord + vec2(  w, 0.0));
        n[6] = texture(tex, coord + vec2( -w, h));
        n[7] = texture(tex, coord + vec2(0.0, h));
        n[8] = texture(tex, coord + vec2(  w, h));

        n[0] *= 2.0;
        n[1] *= 2.0;
        n[2] *= 2.0;
        n[3] *= 2.0;
        n[4] *= 2.0;
        n[5] *= 2.0;
        n[6] *= 2.0;
        n[7] *= 2.0;
        n[8] *= 2.0;

    }

    void Blur(inout vec4 Blurred, sampler2D tex, vec2 coord)
    {   
        float BlurSpread = 10.0;
        float r1 = rand(coord) * BlurSpread;
        float r2 = rand(coord*1.1) * BlurSpread;
        float w = (r1 / (uResolution.x * .5)); // lower res text 
        float h = (r2 / (uResolution.y * .5));
        vec4 n[9];
        n[0] = texture(tex, coord + vec2( -w, -h));
        n[1] = texture(tex, coord + vec2(0.0, -h));
        n[2] = texture(tex, coord + vec2(  w, -h));
        n[3] = texture(tex, coord + vec2( -w, 0.0));
        n[4] = texture(tex, coord);
        n[5] = texture(tex, coord + vec2(  w, 0.0));
        n[6] = texture(tex, coord + vec2( -w, h));
        n[7] = texture(tex, coord + vec2(0.0, h));
        n[8] = texture(tex, coord + vec2(  w, h));

        Blurred += n[0] * (1.0/16.0);
        Blurred += n[1] * (1.0/8.0);
        Blurred += n[2] * (1.0/16.0);
        Blurred += n[3] * (1.0/8.0);
        Blurred += n[4] * (1.0/4.0);
        Blurred += n[5] * (1.0/8.0);
        Blurred += n[6] * (1.0/16.0);
        Blurred += n[7] * (1.0/8.0);
        Blurred += n[8] * (1.0/16.0);
    }


    void main()
    {
        float Frame = Time * .0001;


        vec2 screenSpace = vec2((gl_FragCoord.x/(uResolution.x)), 
        (gl_FragCoord.y/(uResolution.y)));
        vec2 halfScreenSpace = vec2(((gl_FragCoord.x * .5/(uResolution.x))), 
        (gl_FragCoord.y * .5/(uResolution.y)));
        vec3 Displacement = texture(uTexture, screenSpace).rgb;
        float rCutoff = .5;
        float gCutoff = .5;
        float bCutoff = .5;
        if (Displacement.r < rCutoff) {Displacement.r = 0.0;}
        if (Displacement.g < gCutoff) {Displacement.g = 0.0;}
        if (Displacement.b < bCutoff) {Displacement.b = 0.0;}
        Displacement.r += Displacement.b;
        float DispAm = 0.0;
        vec4 ScreenText = texture(uTexture, screenSpace);
        vec3 HSL = RGB2HSL(ScreenText.rgb);
        vec3 NewRGB = HSL2RGB(HSL); 
        vec4 n[9];
        make_kernel(n, uTexture, screenSpace);
        vec4 sobel_edge_h = n[2] + (2.0*n[5]) + n[8] - (n[0] + (2.0*n[3]) + n[6]);
        vec4 sobel_edge_v = n[0] + (2.0*n[1]) + n[2] - (n[6] + (2.0*n[7]) + n[8]);
        vec4 sobel = sqrt((sobel_edge_h * sobel_edge_h) + (sobel_edge_v * sobel_edge_v));
        float MaxSobelCol = max(max(sobel.r, sobel.g), sobel.b);
        sobel.r = MaxSobelCol; // Make sure we're focusing on red colors
        sobel.g *= .5;
        sobel.b *= .7;
        vec3 Background = vec3(0.0,0.0,0.0);
        if (sobel.r > OutlineCutoff) 
        {
            sobel.rgb = OutlineCol;
        }
        else
        {
            sobel.rgb = vec3(0.0,0.0,0.0);
            if (ScreenText.a < eps)
            {
                Background = BGCol;
            }
        }
        vec4 BlurVec = vec4(0.0);
        Blur(BlurVec, BloomText, halfScreenSpace);
        BlurVec *= BlurAmount;
        vec3 Comp = NewRGB + (BlurVec.rgb) + (sobel.rgb) + Background; 
        float FinCutoff = 0.0; // Kill colors
        if (((Comp.r + Comp.g + Comp.b) / 3.0) < FinCutoff) {Comp = vec3(0.0);}
        
        fragColor = vec4(Comp, 1.0);
    }