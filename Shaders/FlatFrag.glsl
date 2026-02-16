#version 300 es
    precision mediump float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform sampler2D uTexture;
    void main()
    {
        vec4 texColor = texture(uTexture, UVCord);
        fragColor = texColor;
    }