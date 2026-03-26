#version 300 es
    precision mediump float;   
    in vec4 aVertPos;
    in vec4 aTargetVertPos;
    in vec4 aTargetVertPos2;
    in vec4 aTargetVertPos3;
    in vec4 aTargetVertPos4;
    in vec3 aNorm;
    in vec2 aUVCord;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjMatrix;
    uniform mat4 uModelMatrix;
    uniform float Alpha;
    uniform float lifeSpan;
    uniform float Time;
    uniform float spawnTime;
    out vec3 Normals;
    out vec3 FragPos;
    out vec2 UVCord;
    out vec3 CameraPos;
    out vec3 vWorldPos;
    out vec3 VertPos;
    out vec4 vClipPos;


    void main()
    {
        float Frame = Time * .001;
        float a = Frame - spawnTime;
        float lifeSpanFrac = lifeSpan / 4.0;
        vec4 NewVertPos = vec4(mix(aTargetVertPos.xyz, aTargetVertPos2.xyz, min(a, 1.0)),1.0); 
        NewVertPos = vec4(mix(NewVertPos.xyz, aVertPos.xyz, min(max(a - lifeSpanFrac, 0.0),1.0)),1.0);
        NewVertPos = vec4(mix(NewVertPos.xyz, aTargetVertPos3.xyz, min(max(a - (lifeSpanFrac * 2.0), 0.0),1.0)),1.0);
        NewVertPos = vec4(mix(NewVertPos.xyz, aTargetVertPos4.xyz, min(max(a - (lifeSpanFrac * 3.0), 0.0),1.0)),1.0);
        VertPos = NewVertPos.xyz;
        vec4 ViewPos = uViewMatrix * uModelMatrix * NewVertPos;
        vec4 Pos = uProjMatrix * uViewMatrix * uModelMatrix * NewVertPos;
        gl_Position = Pos;
        vClipPos = Pos;
        vec4 ProjNormals = uViewMatrix * vec4(aNorm,0.0);
        vec4 world = uModelMatrix * NewVertPos;
        vWorldPos = world.xyz;
        Normals = ProjNormals.xyz;
        FragPos = ViewPos.xyz;
        UVCord = aUVCord;
        
    }