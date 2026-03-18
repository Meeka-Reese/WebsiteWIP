#version 300 es
    precision mediump float;    
    in vec3 FragPos;
    in vec2 UVCord;
    in vec3 StarPos;
    out vec4 fragColor;
    uniform float Time;
    uniform sampler2D depthTexture;
    uniform vec2 uResolution;
    void main()
    {
        //Depth For Boat
        float DepthTexture = texture(depthTexture, gl_FragCoord.xy/uResolution).r*3.0;
        float near = 0.1;
        float far = 100.0;
        float z = DepthTexture * 2.0 - 1.0;
        float linearDepth = (2.0 * near * far) / (far + near - z * (far - near));
        linearDepth = linearDepth / far;
        fragColor = texture(depthTexture,gl_FragCoord.xy/uResolution);
        
        if (DepthTexture < 1.0)
        {
            discard;
        }
        //

        float Sec = Time / 1000.0;
        vec2 Center = vec2(.25,.25);
        float ColLevel;
        float CutoffStarLevel;
        float GlowLevel;
        float GlowAm;
        if (mod(StarPos.x+StarPos.y, 2.0) < .7)
        {
            ColLevel = sqrt(pow((Center.x - UVCord.x),2.0) + pow((Center.y - UVCord.y),2.0));
            CutoffStarLevel = sin((.5 * Sec) + StarPos.y) / 16.0;
            if (ColLevel < CutoffStarLevel)
            {
                ColLevel = 1.0;
            }
            else
            {
                ColLevel = 0.0;
            }
            GlowAm = .1 + sin((.5 * Sec) + StarPos.y) / 8.0;
            GlowLevel = sqrt(pow((Center.x - UVCord.x),2.0) + pow((Center.y - UVCord.y),2.0));
            if (GlowLevel < GlowAm)
                {
                    GlowLevel = 1.0;
                }
                else
                {
                    GlowLevel = 0.0;
                }
        }
        else
        {
            ColLevel = sqrt(pow((Center.x - UVCord.x),2.0) * pow((Center.y - UVCord.y),2.0));
            CutoffStarLevel = 0.0006 + (sin(.5 * Sec) * .0005);
            if (ColLevel < CutoffStarLevel)
            {
                ColLevel = 1.0;
            }
            else
            {
                ColLevel = 0.0;
            }
            float ClipSizeSm = .15;
            float ClipSizeBg = .35;
            if (UVCord.x < ClipSizeSm || UVCord.x > ClipSizeBg || UVCord.y < ClipSizeSm || UVCord.y > ClipSizeBg)
            {
                ColLevel = 0.0;
            }
            GlowAm = .1 + (sin(.5 * Sec) * .05);
            GlowLevel = sqrt(pow((Center.x - UVCord.x),2.0) + pow((Center.y - UVCord.y),2.0));
            if (GlowLevel < GlowAm)
                {
                    GlowLevel = 1.0;
                }
                else
                {
                    GlowLevel = 0.0;
                }
        }
        
        vec4 StarCol1 = vec4(1.0, .78, .78,1.0);
        vec4 StarCol2 = vec4(1.0,.89, .88, 1.0);
        vec4 StarCol3 = vec4(1.0,1.0,1.0,1.0);
        vec4 StarCol4 = vec4(.86,.925,.96,1.0);
        vec4 StarCol5 = vec4(.73, .85, .92, 1.0);
        vec4 ActiveStarCol;
        float SelecVal = abs(sin(StarPos.x *23.35) + cos(StarPos.y * 2.332));
        if (SelecVal < .2)
        {
            ActiveStarCol = StarCol1;
        }
        else if (SelecVal < .4)
        {
             ActiveStarCol = StarCol2;
        }
        else if (SelecVal < .6)
        {
             ActiveStarCol = StarCol3;
        }
        else if (SelecVal < .8)
        {
             ActiveStarCol = StarCol4;
        }
        else if (SelecVal < 1.0)
        {
             ActiveStarCol = StarCol5;
        }
        else
        {
             ActiveStarCol = StarCol3;
        }
        vec4 GlowCol = vec4(ActiveStarCol.rgb * GlowLevel, .2 * GlowLevel);
        vec4 texColor = ActiveStarCol * ColLevel;
        if (texColor.r < .1)
        {
            texColor = GlowCol; // Apply bg Glow
        }
        fragColor = texColor;
    }