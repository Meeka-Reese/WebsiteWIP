#version 300 es
    precision highp float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform sampler2D uTextureScene;
    uniform vec2 uResolution;  



    float cubicSp (float x, float a, float b, float c, float d) 
    {// 1 dimensional form of cubic spline
        float p = (d-c) - (a-b);
        return p*(x*x*x) + ((a-b)-p)*(x*x) + (c-a)*x + b;
    }

    vec4 cubicSpNoise(vec2 uv)
    {
        // creating cell variables
        vec2 Texel = 1.0 / vec2(textureSize(uTextureScene, 0));
        vec2 c = fract(uv*uResolution);
        // creating arrays for the spline and random values
        vec2 b[4];
        vec4 Output;
        for (int ch = 0; ch < 4; ch++)
        {
            for (int y = 0; y < 4; y++)
            {
                for (int x = 0; x < 4; x++)
                {
                    if (ch == 0) {b[x].x = texture(uTextureScene, uv + (vec2(x,y) * Texel)).r;}
                    else if (ch == 1) {b[x].x = texture(uTextureScene, uv + (vec2(x,y) * Texel)).g;}
                    else if (ch == 2) {b[x].x = texture(uTextureScene, uv + (vec2(x,y) * Texel)).b;}
                    else if (ch == 3) {b[x].x = texture(uTextureScene, uv + (vec2(x,y) * Texel)).a;}
                }
                // applying the random values to the slots of the spline
                // for the active horizontal segment
                b[y].y = cubicSp(c.x,b[0].x,b[1].x,b[2].x,b[3].x);
            }
            float Val = cubicSp(c.y,b[0].y,b[1].y,b[2].y,b[3].y);
            if (ch == 0) {Output.r = Val;}
            else if (ch == 1) {Output.g = Val;}
            else if (ch == 2) {Output.b = Val;}
            else if (ch == 3) {Output.a = Val;}
        }
        
        Output.r = clamp(Output.r, -1.0, 1.0);
        Output.gb = clamp(Output.gb, -1.0, 1.0);
        return Output;
    }

    void main()
    {
        float Ratio = (uResolution.x * .5) / uResolution.y;
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        vec2 UVL = vec2((screenSpace.x * .5), screenSpace.y);
        vec4 spline = cubicSpNoise(UVL);
        fragColor = spline;
    }