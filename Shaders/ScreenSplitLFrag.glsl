#version 300 es
    precision mediump float;    
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform sampler2D uTextureScene;
    uniform vec2 uResolution;  
    void main()
    {
        float Ratio = (uResolution.x * .5) / uResolution.y;
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x * 2.0)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        vec4 texColor = texture(uTextureScene, screenSpace);

        fragColor = vec4(texColor);
    }
