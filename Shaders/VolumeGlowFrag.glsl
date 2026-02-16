#version 300 es
    precision mediump float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec3 VertPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform vec4 objCol;
    uniform float Time;
    uniform vec3 Origin;
    uniform sampler2D uTexture;
    uniform sampler2D depthTexture;
    uniform vec2 uResolution;

   
    void main()
    {
        float DepthTexture = texture(depthTexture, gl_FragCoord.xy/uResolution).r;
        float near = 0.1;
        float far = 100.0;
        float z = DepthTexture * 2.0 - 1.0;
        float linearDepth = (2.0 * near * far) / (far + near - z * (far - near));
        linearDepth = linearDepth / far;
        if (DepthTexture < 1.0)
        {
            discard; 
        }

        float Frame = Time / 1000.0;
        float yDif = abs((Origin.y + 10.0) - VertPos.z) * .09;
        yDif = pow(yDif, 10.0); // Contrast
        float Noise = texture(uTexture,vec2(VertPos.x, VertPos.z+Frame) * .005).r * 2.0;
        float ColMult = (1.0 - yDif) * Noise;
        vec4 col = objCol * ColMult;
        col.r += yDif; //redFade
        col.g += (1.0-(yDif*3.0));
        col *= col * col;
        fragColor = vec4(col);
    }