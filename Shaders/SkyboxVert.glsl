#version 300 es
    in vec4 aVertPos;
    in vec3 aNorm;
    in vec2 aUVCord;
  
    out vec3 FragPos;
    out vec3 Norm;
    out vec2 UVCord;
   
    void main()
    {
        Norm = aNorm;
        UVCord = aUVCord;
        FragPos = vec3(aVertPos.x,aVertPos.y,1.0);
        gl_Position = vec4(aVertPos.x,aVertPos.y,1.0,aVertPos.w);
    }