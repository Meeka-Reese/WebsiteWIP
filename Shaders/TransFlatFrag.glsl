#version 300 es
    precision mediump float;   
    precision highp sampler3D;   
    precision lowp sampler2DArray;   
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
    uniform vec2 uResolution;
    uniform sampler2DArray weightImage2DArray;



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
    vec3 RotateZ (vec4 Input, float Rad, float Magnitude)
    {   
        mat4 RotationMatZ = mat4 (cos(Rad), -sin(Rad), 0.0, 0.0,
                                  sin(Rad), cos(Rad), 0.0, 0.0,
                                  0.0, 0.0, 1.0, 0.0,
                                  0.0,0.0,0.0,1.0);
        vec3 Result = (RotationMatZ * Input).xyz * Magnitude;
        return Result;
    }
    
    void main()
    {   
        

        float Frame = Time / 8000.0;
        vec3 RotLightPos = RotateX(vec4(lightPos, 1.0), Frame*50.0, 50.0);

        float NoiseSize = 5.0;
        vec3 NoiseUV = vec3(UVCord.x, UVCord.y,1.0) * NoiseSize;
        vec3 NormalMap = texture(uTexture3D, NoiseUV).rgb;
        vec3 NormalizedNorm = normalize(NormalMap + (vDisplVal.xyz * viewPos));
        float ShaderMask = texture(uTexture3D, NoiseUV).r;
        float ShaderMaskCutoff = 1.5 - abs(sin(Frame));
        vec4 Output = vec4(0.0);
        vec4 texColor = texture(uTexture, UVCord);
        if (ShaderMask < ShaderMaskCutoff)
        {
            //diffuse
            float diffAm = 1.0;
            vec3 lightDir = normalize(RotLightPos - FragPos);
            float diff = max(dot(-NormalizedNorm, lightDir), 0.0);
            vec3 diffuse = diff * normalize(vec3(1.0) + lightColor) * (.4 + lightIntensity * diffAm * 2.0);

            //Specular
            float specularStrength = 10.0;
            vec3 viewDir = normalize(viewPos - FragPos);
            vec3 reflectDir = reflect(-lightDir, -NormalizedNorm);
            float spec = pow(max(dot(viewDir, reflectDir), 0.0), 1000.0);
            vec3 specular = specularStrength * spec * vec3(1.0,1.0,1.0);
            texColor.rgb *= diffuse.r + specular.r;

            Output = texColor;
        }
        else
        {
            int Dither = int(gl_FragCoord.y + (gl_FragCoord.x * uResolution.x));
            NormalizedNorm += vec3(Dither);
            //diffuse
            float diffAm = 1.0;
            vec3 lightDir = normalize(RotLightPos - FragPos);
            float diff = max(dot(-NormalizedNorm, lightDir), 0.0);
            vec3 diffuse = diff * normalize(vec3(1.0) + lightColor) * lightIntensity * diffAm;

            //Specular
            float specularStrength = 1.0;
            vec3 viewDir = normalize(viewPos - FragPos);
            vec3 reflectDir = reflect(-lightDir, -NormalizedNorm);
            float spec = pow(max(dot(viewDir, reflectDir), 0.0), 1000.0);
            vec3 specular = specularStrength * spec * vec3(1.0,1.0,1.0);
            vec4 MetalColor = vec4(.8, .6, .9,1.0);
            
            //Ambient
            float ambientAmount = .6;
            vec3 ambient = (MetalColor.rgb) * ambientAmount * lightIntensity;
            Output = vec4(MetalColor.rgb * (diffuse.rgb + specular.rgb + ambient), 1.0);
            Output = Dither % 16 == 0 ? vec4(0.0) : Output;
            Dither = int(gl_FragCoord.y - (gl_FragCoord.x * uResolution.x));
            Output = Dither % 7 == 0 ? vec4(0.0) : Output;
        }
        fragColor = Output;

    }