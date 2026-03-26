#version 300 es
    precision mediump float;    
    in vec3 FragPos;
    out vec4 fragColor;
    uniform sampler2D uTexture;
    uniform sampler2D CharText;
    uniform float Time;
    uniform float Lightness;

    float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }
    void main()
    {
        float Frame = Time * .0001;
        float Off = .000001;
        vec2 UVCoord = vec2(FragPos.x * 4.0, FragPos.y * 2.0);
        float N1 = rand(UVCoord);
        vec2 DispUV1 = texture(uTexture, UVCoord + vec2(Frame * 1.0)).rg;
        vec3 CharText = texture(CharText, UVCoord + (DispUV1 * vec2(sin(Frame))) + vec2(Frame * .24)).rgb;
        vec2 DispUV2 = texture(uTexture, CharText.rg).rg;
        vec3 Text = texture(uTexture, DispUV2).rgb;
        
        
        vec3 Col1 = vec3(0.265, 0.000, 0.001);
        vec3 Col2 = vec3(0.412, 0.176, 0.161);
        vec3 Col3 = vec3(0.82, 0.596, 0.533);
        vec3 Col = vec3(0.0);
        float Cut = .16;
        Col = Text.r > Cut ? Col3 : Col2;
        Col = Text.r > Cut * 2.5 ? Col1 : Col;
        float Light = max(((Lightness * .3)),.01);
        fragColor = vec4(Col * Light,1.0);
    }