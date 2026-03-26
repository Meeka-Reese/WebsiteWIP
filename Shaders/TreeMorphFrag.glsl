#version 300 es
    precision mediump float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform sampler2D uTexture;
    uniform float Alpha;
    uniform float Lightness;
    void main()
    {
        vec4 texColor = texture(uTexture, UVCord);
        texColor.a *= Alpha;
        texColor.rgb *= min((Lightness + .2),1.0);
        fragColor = texColor;
    }