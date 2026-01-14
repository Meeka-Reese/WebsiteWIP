#version 300 es
    precision mediump float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    out vec4 fragColor;
    uniform vec3 objCol;
    uniform vec3 lightPos;
    uniform vec3 viewPos;
    uniform vec3 lightColor;
    uniform float lightIntensity;
    //uniform vec2 boatUVPos;
    uniform float Time;

    vec3 drawCircle(vec2 pos, float radius, float width, float power, vec4 color, vec2 BoatUVPos) // taken from https://www.shadertoy.com/view/3tdSRn
    {//change boatuvpos to uniform soon
        float Frequency = .2;
        float FadeStart = .1;
        float fade = pow(length(vec2(pos.x*4.0, pos.y)),.7) - FadeStart;
        if (fade < 0.0) {fade = 0.0;}
        if (pos.y > 0.0)
        {
            float mixLevel = pos.y*80.0;
            pos.y = ((pos.y * 4.0 * mixLevel) + (pos.y * (1.0 - mixLevel)))/2.0;
            fade = fade * ((mixLevel/2.0) + abs(pos.x- 1.0));
        }
        
        float dist1 = length(vec2(pos.x*10.0,pos.y)) - radius/2.0;
        
        dist1 = mod((dist1), Frequency);
        float dist2 = dist1 - radius;
        float intensity = 3.0; 
        dist1 = (dist1 * intensity) - fade;
        vec3 col = color.rgb * dist1;
        return col;
    }
    void main()
    {
        
        vec3 NormalizedNorm = normalize(Normals);

        //Diffuse
        float diffAm = .5;
        vec3 lightDir = normalize(lightPos - FragPos);
        float diff = max(dot(-NormalizedNorm, lightDir), 0.0);
        vec3 diffuse = diff * normalize(objCol + lightColor) * lightIntensity * diffAm;

        //Ambient
        float ambientAmount = .6;
        vec3 ambient = (objCol) * ambientAmount * lightIntensity;
        if (diff > .1 && diff < .5) {ambient = vec3(1.0,1.0,1.0) * ambientAmount * lightIntensity;}
        else if (diff > .9) {ambient = lightColor * ambientAmount * lightIntensity;}
        else if (diff >= .6 && diff <= .8) {ambient = objCol * ambientAmount * .8;}

        //Specular
        float specularStrength = 0.1;
        vec3 viewDir = normalize(viewPos - FragPos);
        vec3 reflectDir = reflect(-lightDir, NormalizedNorm);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 10.0);
        vec3 specular = specularStrength * spec * vec3(1.0,1.0,1.0);
        
        //Boat Trail
        vec2 BoatUVPos = vec2(.48,.54);
        float MaxCircleSize = 1.0;
        float Width = .8;
        float Power = .1;
        vec4 CircleColor = vec4(0.8,1.0,1.0,1.0);
        
        vec3 Circle = drawCircle(vec2(UVCord.x, UVCord.y) - BoatUVPos, Time/1000.0, Width, Power, vec4(1.0,1.0,1.0,1.0),BoatUVPos);
        

        vec3 Comp = ambient + diffuse + specular;
        Comp = Circle.b > .1 ? CircleColor.rgb : Comp;
        float CompMag = length(Comp);
        vec3 NormalizedComp = normalize(Comp);
        //Tune
        float numberOfLevels = 1.0;
        float toonLevel = ceil(CompMag * numberOfLevels) / numberOfLevels;
        toonLevel = clamp(toonLevel, 0.2, 1.0);
        Comp = Comp * toonLevel;
        fragColor = vec4(Comp,1.0);
    }