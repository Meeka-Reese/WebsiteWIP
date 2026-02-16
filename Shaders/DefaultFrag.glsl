#version 300 es
    precision mediump float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform vec4 objCol;
    uniform vec3 lightPos;
    uniform vec3 viewPos;
    uniform vec3 lightColor;
    uniform float lightIntensity;
    uniform float Time;



    void main()
    {
        
        vec3 NormalizedNorm = normalize(Normals);

        //Diffuse
        float diffAm = .5;
        vec3 lightDir = normalize(lightPos - FragPos);
        float diff = max(dot(-NormalizedNorm, lightDir), 0.0);
        vec3 diffuse = diff * normalize(objCol.rgb + lightColor) * lightIntensity * diffAm;

        //Ambient
        float ambientAmount = .6;
        vec3 ambient = (objCol.rgb) * ambientAmount * lightIntensity;
       

        //Specular
        float specularStrength = 0.1;
        vec3 viewDir = normalize(viewPos - FragPos);
        vec3 reflectDir = reflect(-lightDir, NormalizedNorm);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 10.0);
        vec3 specular = specularStrength * spec * vec3(1.0,1.0,1.0);
        
       
        vec3 Comp = diffuse + ambient + specular;
        fragColor = vec4(Comp,objCol.a);
    }