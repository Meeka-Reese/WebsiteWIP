#version 300 es
    precision mediump float;    
    in vec3 Normals;
    in vec3 FragPos;
    out vec4 fragColor;
    uniform float uObjetIndex;

    void main()
    {
        float ObjInd = uObjetIndex / 255.0;
        fragColor = vec4(ObjInd, 0.0,0.0,1.0);
    }