#version 300 es
    precision highp float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform sampler2D uTextureScene;
    uniform vec2 uResolution;  

    void main()
    {
        float Ratio = (uResolution.x * .5) / uResolution.y;
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x * 1.0)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        vec2 UVL = vec2((screenSpace.x * .5), screenSpace.y);
        vec3 DVeloText = texture(uTextureScene, UVL).rgb;
        float DnsFriction = 1.0005;
        float VelFriction = 1.0001;
        
        vec3 Output = vec3(DVeloText.r / DnsFriction, DVeloText.gb / VelFriction);
        fragColor = vec4(vec3(Output), 1.0);
    }
