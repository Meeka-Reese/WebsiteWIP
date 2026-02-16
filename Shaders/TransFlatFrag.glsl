#version 300 es
    precision mediump float;   
    precision lowp sampler3D;   
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    in vec4 vDisplVal;
    out vec4 fragColor;
    uniform sampler2D uTexture;
    uniform sampler3D uTexture3D;
    uniform vec3 lightPos;
    uniform vec3 viewPos;
    uniform vec3 lightColor;
    uniform float lightIntensity;
    uniform float Time;


    vec3 RotateX (vec4 Input, float Rad, float Magnitude)
    {
        mat4 RotationMatX = mat4 (1.0, 0.0, 0.0, 0.0,
                             0.0, cos(Rad), -sin(Rad), 0.0,
                             0.0, sin(Rad), cos(Rad), 0.0,
                             0.0, 0.0, 0.0, 1.0);
        vec3 Result = (RotationMatX * Input).xyz * Magnitude;
        return Result;
    }
    vec3 RotateY (vec4 Input, float Rad, float Magnitude)
    {   
        mat4 RotationMatY = mat4 (cos(Rad), 0.0, sin(Rad), 0.0,
                                  0.0, 1.0, 0.0, 0.0,
                                  -sin(Rad), 0.0, cos(Rad), 0.0,
                                  0.0,0.0,0.0,1.0);
        vec3 Result = (RotationMatY * Input).xyz * Magnitude;
        return Result;
    }
    
    void main()
    {
        float Frame = Time / 8000.0;
        vec3 RotLightPos = RotateY(vec4(lightPos, 1.0), Frame*20.0, 500.0);
        float NoiseSize = sin(Frame) * 5.0;
        vec3 NoiseUV = vec3(UVCord.x, UVCord.y,1.0) * NoiseSize;
        vec3 NormalMap = texture(uTexture3D, NoiseUV).rgb;
        vec3 NormalizedNorm = normalize(Normals + vDisplVal.xyz - NormalMap);
        vec4 texColor = texture(uTexture, UVCord);
        //diffuse
        float diffAm = 1.0;
        vec3 lightDir = normalize(RotLightPos - FragPos);
        float diff = max(dot(-NormalizedNorm, lightDir), 0.0);
        vec3 diffuse = diff * normalize(vec3(1.0) + lightColor) * lightIntensity * diffAm;

         //Specular
        float specularStrength = 40.0;
        vec3 viewDir = normalize(viewPos - FragPos);
        vec3 reflectDir = reflect(-lightDir, NormalizedNorm);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 1000.0);
        vec3 specular = specularStrength * spec * vec3(1.0,1.0,1.0);

        texColor.rgb *= diffuse.r + specular.r;
       
        float ColCutoff = .2;
        vec3 RotateDispX = RotateX(vDisplVal, Frame * 4.0, 1.0);
        vec3 RotateDispY = RotateY(vDisplVal, Frame * 20.0, 1.0);
        float AddR = RotateDispX.x > ColCutoff ? RotateDispX.x : 0.0;
        float AddB = RotateDispY.x > ColCutoff ? RotateDispY.x : 0.0;
        vec4 OutCol = texColor + vec4(AddR, 0.0,AddB,0.0);
        float TextCutoff = .7;
        OutCol = vDisplVal.r > TextCutoff ? OutCol : texColor;
        fragColor = OutCol + texColor;

    }