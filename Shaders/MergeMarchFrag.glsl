#version 300 es
    precision highp float;   
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    in vec3 vWorldPos;
    out vec4 fragColor;
    uniform sampler2D uDist1;
    uniform sampler2D uDist2;
    uniform float Time;
    uniform vec3 viewPos;
    uniform vec3 CameraViewDir;  
    uniform vec2 uResolution;   

    float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main()
    {
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));

        float D1 = texture(uDist1, screenSpace).r;
        float D2 = texture(uDist2, screenSpace).r;

        float near = 0.1;
        float far = 20.0;
        float z1 = D1 * 2.0 - 1.0;
        float lD1 = (2.0 * near * far) / (far + near - z1 * (far - near));
        lD1 = lD1 / far;
        float z2 = D2 * 2.0 - 1.0;
        float lD2 = (2.0 * near * far) / (far + near - z2 * (far - near));
        lD2 = lD2 / far;
        

        float Dist = 1.0 - (min(lD1, lD2) * 1.3);
        if (Dist < .02) {Dist = 0.0;}
        Dist = abs(Dist) * 3.0;
        Dist = max(Dist, 0.0);
        Dist = min(Dist, 1.0);
        
        
        float Alpha = Dist > .1 ? 1.0 : 0.0;
        vec4 Output = vec4(vec3(Dist),Alpha);
        
        
       fragColor = Output;
    }
  