#version 300 es
//https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/
    precision mediump float;    
    out vec4 fragColor;
    in vec3 vWorldPos;
    in vec4 vClipPos;
    in vec3 FragPos;
    in vec2 UVCord;
    uniform vec4 objCol;
    uniform vec3 lightPos;
    uniform vec3 viewPos;
    uniform vec3 CameraViewDir;
    uniform vec3 lightColor;
    uniform float lightIntensity;
    uniform sampler2D depthTexture;
    uniform sampler2D uTexture;
    uniform sampler2D uNormal;
    uniform sampler2D uDisplacement;
    uniform vec2 uResolution;
    uniform vec3 Origin;
    uniform float Time;
    uniform float isHover;


    vec4 raySphereDst(float radius, vec3 sphereCenter, vec3 rayOrigin, vec3 rayDir)
    {
        
        vec3 oc = rayOrigin - sphereCenter;
        
        // Quadratic equation coefficients
        // |rayOrigin + t*rayDir - sphereCenter|^2 = radius^2
        float a = dot(rayDir,rayDir); 
        float b = 2.0 * dot(oc, rayDir);
        float c = dot(oc, oc) - (radius * radius);
        
        float discriminant = (b * b) - (4.0 * a  * c);
        
        // No intersection
        if (discriminant < 0.0) {
            return vec4(0.0, 0.0,0.0,0.0);
        }
        
        // Two intersection points
        float sqrtDisc = sqrt(discriminant);
        float t1 = (-b - sqrtDisc) / (2.0 * a); // Near intersection
        
        // Distance to sphere (0 if inside)
        float dstToSphere = max(0.0, t1);

        //Calculate Normal Vector
        vec3 PointOnSphere = rayOrigin + (rayDir * dstToSphere); // won't work if rayDir is not a normalized vector
        vec3 RayFromOrg = PointOnSphere - sphereCenter;
        vec3 Normal = normalize(RayFromOrg);
        return vec4(Normal.xyz, dstToSphere);
    }
    void main()
    {
        float Frame = Time / 10000.0;
        float Radius = 10.0;
        vec3 Center = vec3(0.0,0.0,0.0);
        vec3 rOrg = viewPos;
        vec3 RayDir = normalize(vWorldPos - viewPos);
        vec4 raySphereData = raySphereDst(Radius, Origin,viewPos,RayDir);
        vec3 Normal = raySphereData.xyz;
        float DistToSurf = raySphereData.w;
        float iorRatio = 1.0/1.31;
        vec2 ndc = vClipPos.xy / vClipPos.w;
        vec2 uv  = ndc * 0.5 + 0.5;
        float SphUVAdd = 0.0;
        if (abs(Normal.x) + abs(Normal.y) > 0.0)
        {
            SphUVAdd = Frame;
        }
        vec2 SphereUV = vec2(abs(Normal.x) - SphUVAdd, abs(Normal.y) - SphUVAdd);
        vec4 NormalMap = texture(uNormal, SphereUV);
        vec4 DisplacementMap = texture(uDisplacement,SphereUV);
        Normal += NormalMap.rgb;
        Normal = normalize(Normal);
        if (DistToSurf <= 0.0) {
            discard;
        }
    

        //Diffuse
        float diffAm = .5;
        vec3 lightDir = normalize(lightPos - FragPos);
        float diff = max(dot(-Normal, lightDir), 0.0);
        float diffAlpha = .1;
        vec4 diffuse = vec4(diff * normalize(objCol.rgb + lightColor) * lightIntensity * diffAm, diffAlpha);

        //Ambient
        float ambientAmount = .6;
        float AmibientAlpha = .1;
        vec4 ambient = vec4((objCol.rgb) * ambientAmount * lightIntensity, AmibientAlpha);
       

        //Specular
        float specularStrength = 0.2;
        vec3 viewDir = normalize(viewPos - FragPos);
        vec3 reflectDir = reflect(-lightDir, Normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 10.0);
        float specAlpha = 1.0;
        vec4 specular = vec4(specularStrength * spec * vec3(1.0,1.0,1.0),specAlpha);

        //Specular Pass2
        specularStrength = 0.1;
        viewDir = normalize(viewPos - FragPos);
        lightDir.x *= .5; //Double Specular
        lightDir.y *= 1.4;
        lightDir.z *= .7;
        reflectDir = reflect(-lightDir, Normal);
        spec = pow(max(dot(viewDir, reflectDir), 0.0), 10.0);
        specAlpha = 0.0;
        specular += vec4(specularStrength * spec * vec3(1.0,1.0,1.0),specAlpha);


        vec3 refractVec = refract(RayDir, Normal, iorRatio);
        vec4 color = isHover > 0.0 ? texture(uTexture, uv + refractVec.xy) * 3.5 : texture(uTexture, uv + refractVec.xy);
        vec4 Transp = texture(uTexture, uv);
    
        fragColor = ((Transp*.8 + color * .5) + diffuse + ambient + specular);
        
   
    }
    