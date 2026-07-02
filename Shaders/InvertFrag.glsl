#version 300 es
    precision mediump float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform sampler2D uTexture;
    uniform float Alpha;
    uniform vec2 uResolution;
    void main()
    {
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        vec4 texColor = texture(uTexture, UVCord);
        texColor = vec4(1.0 - texColor.r, 1.0 - texColor.g, 1.0 - texColor.b, 1.0);
        float exp = 0.1;
        texColor = vec4(pow(texColor.r, exp) - .1, pow(texColor.g, exp) + .3, pow(texColor.b, exp), 1.0);
        texColor = normalize(texColor);
        fragColor = vec4(texColor.rgb, 1.0);
    }