#version 300 es
    precision mediump float;  
    precision lowp sampler3D;  
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
    uniform sampler3D uTexture3D;
    uniform sampler2D uTextureBlueNoise;
    uniform sampler2D uTexture; // Veins



    void main()
    {
        vec3 BumpMap = texture(uTextureBlueNoise, UVCord).rgb;
        float Frame = Time / 3000.0;
        float Disp = texture(uTexture3D, vec3(UVCord, Frame)).r;
        float FatText = texture(uTexture3D, vec3(UVCord*2.3, (Frame*.25)+UVCord.x + UVCord.y)).r;
        float DarkBloodText = texture(uTexture3D, vec3(UVCord*2.44 + BumpMap.rg, (Frame*.1)+UVCord.x + UVCord.y)).r; //mix in blue noise
        float Veins = texture(uTexture, UVCord + vec2(Disp)*.05).r;
        Veins += abs(sin(Frame * 10.0)) * .5;
        float VeinsThresh = .8;
        vec3 VeinColor = vec3(0.0);
        if (Veins > VeinsThresh) {VeinColor = vec3(.4, 0.1, .7);}

        float DispAm = 1.0;
        vec3 NormalizedNorm = normalize(Normals - BumpMap);
        vec3 Fats = vec3(0.0);
        float FatsThresh = .8;
        float DarkBloodThresh = .75;

        if (FatText > FatsThresh) {Fats = vec3(1.2, 1.1, 1.0);}
        vec3 DarkBlood = vec3(1.0);
        if (DarkBloodText > DarkBloodThresh) {DarkBlood = vec3(.6, 0.0, .3);}

        //Diffuse
        float diffAm = .5;
        vec3 lightDir = normalize(lightPos - FragPos);
        float diff = max(dot(-NormalizedNorm, lightDir), 0.0);
        vec3 diffuse = diff * objCol.rgb * lightIntensity * diffAm;

        //Ambient
        float ambientAmount = .6;
        vec3 ambient = (objCol.rgb) * ambientAmount * lightIntensity;
       

        //Specular
        float specularStrength = 1.0;
        vec3 viewDir = normalize(viewPos - FragPos);
        vec3 reflectDir = reflect(-lightDir, NormalizedNorm + Veins);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 10.0);
        vec3 specular = specularStrength * spec * vec3(1.0,.3,.4);
        
       
        vec3 Comp = max(min((diffuse + ambient + specular),DarkBlood),Fats);
        if (VeinColor.r > 0.0) {Comp = VeinColor;}
        fragColor = vec4((Comp) * Disp * DispAm,objCol.a);
    }