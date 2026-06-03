#version 300 es
    precision highp float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    uniform sampler2D uTextureDivergence;
    uniform sampler2D uTexturePrev;
    uniform vec2 uResolution; 
    uniform float DeltaTime; 
    out vec4 fragColor;


    float PressureSolver(vec2 Cords, vec2 UnitSize) 
    {
        vec2 LCords = vec2(Cords.x - UnitSize.x, Cords.y);
        vec2 RCords = vec2(Cords.x + UnitSize.x, Cords.y);
        vec2 TCords = vec2(Cords.x, Cords.y + UnitSize.y);
        vec2 BCords = vec2(Cords.x, Cords.y - UnitSize.y);

        float vC = texture(uTexturePrev, Cords).r; // Current pressure
        
        float vL = (Cords.x - UnitSize.x < 0.0) ? vC : texture(uTexturePrev, LCords).r;
        float vR = (Cords.x + UnitSize.x > 1.0) ? vC : texture(uTexturePrev, RCords).r;
        float vB = (Cords.y - UnitSize.y < 0.0) ? vC : texture(uTexturePrev, BCords).r;
        float vT = (Cords.y + UnitSize.y > 1.0) ? vC : texture(uTexturePrev, TCords).r;

        float Divergence = texture(uTextureDivergence, Cords).r;
        
        float FinalVal = ((vL + vR + vB + vT) - Divergence) / 4.0;
        
        return FinalVal;
    }



    void main()
    {
       // Calculate normalized texture coordinates
    vec2 screenSpace = gl_FragCoord.xy / uResolution;
    vec2 UnitSize = 1.0 / uResolution;
    
    float Pressure = PressureSolver(screenSpace, UnitSize);
    
    // Output pressure into the red channel
    fragColor = vec4(Pressure, 0.0, 0.0, 1.0);
    }
