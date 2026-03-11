#version 300 es
    precision mediump float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform sampler2D uTexture;
    uniform float Time;
    void main()
    {
        float Frame = Time / 1000.0;
        float Ramp = 1.0 - (mod(Frame*8.0, 2.05) / 2.05); // set to 123 bpm 
        vec2 ModUVCord = UVCord;
        float TexLowVal = .8;
        float AlphaAdd = .2;
        if (mod(Frame, 2.0) > 1.5) {ModUVCord *= vec2(20.0 + tan(2.0*sin(pow(abs(sin(Frame)),4.0 * UVCord.y)))); TexLowVal = .65; AlphaAdd = .05;}
        vec4 texColor = texture(uTexture, vec2((ModUVCord.x - (.5*sin(Frame * .05)))*(5.0 + sin(Frame * .1)), (ModUVCord.y + (Frame * .01)) * 2.0));
        float RCutoff = abs(sin(Frame));
        float GCutoff = abs(sin(Frame * 1.1));
        float BCutoff = abs(sin(Frame * .7));
        vec4 Col1 = vec4(0.086, 0.18, 0.26, 1.0);
        vec4 Col2 = vec4(0.47, 0.33, 0.50, 1.0);
        vec4 Col3 = vec4(1.0, .67, .55, 1.0);
        vec4 Col4 = vec4(1.0,1.0,.98, 1.0);
        if (texColor.r > RCutoff)
        {
            texColor = Col1;
        }
        if (texColor.g > GCutoff)
        {
            texColor = Col2;
        }
        if (texColor.b > BCutoff)
        {
             texColor = Col3;
        }
        float DivSize = .11 - (abs(sin(Frame * .1) * .1));
        float GapWidth = .9;
        if (mod(UVCord.x - (abs(sin(Frame * .1) * .5)), DivSize) >  DivSize * GapWidth|| mod(UVCord.y - (abs(sin(Frame * .1) * .5)), DivSize) > DivSize * GapWidth || mod(UVCord.x + UVCord.y, .05) > .01)
        {
            texColor *= TexLowVal + Ramp;
            texColor.a += AlphaAdd;
        }
        
        fragColor = texColor;
    }