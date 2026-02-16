#version 300 es
    in vec4 aVertPos;
    in vec3 aNorm;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjMatrix;
    uniform mat4 uModelMatrix;
    out vec3 Normals;
    out vec3 FragPos;
   

    void main()
    {
        vec4 ViewPos = uViewMatrix * uModelMatrix * aVertPos;
        gl_Position = uProjMatrix * ViewPos;
        vec4 ProjNormals = uViewMatrix * vec4(aNorm,0.0);
        Normals = ProjNormals.xyz;  
        FragPos = ViewPos.xyz;
    }