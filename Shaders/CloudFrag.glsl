#version 300 es
    precision mediump float;   
    precision lowp sampler3D; 
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    in vec3 vWorldPos;
    out vec4 fragColor;
    uniform sampler3D uTexture3D;
    uniform sampler2D uTexture;
    uniform sampler2D depthTexture;
    uniform sampler2D uTextureBlueNoise;
    uniform float Time;
    uniform vec3 viewPos;
    uniform vec3 CameraViewDir;  
    uniform vec2 uResolution;   
    //https://momentsingraphics.de/BlueNoise.html



    float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }
    float SampleDensity(vec3 Position, float zTime, vec3 SphereCenter)
    {
        vec2 worldUV = vec2(Position.z*.21012 + 21.2, -Position.x*.2442 + 128.1) * .0005;
        float NoiseAm = .2;
        float DensityThresh = .6 + (rand(Position.xy)*NoiseAm);
        float DensityMult = 1.1;
        float mipMapLevel = 0.0;
        vec3 CloudOffset = vec3(.1,.1,.1);
        float CloudScale = 1.0;
        vec4 CloudNoise = texture(uTexture, worldUV+zTime/500.0);
        vec3 uvw = (Position * CloudScale * .05 *CloudNoise.r + CloudOffset * 1.0) + vec3(0.0,0.0,zTime*2.0);
        vec4 Shape = textureLod(uTexture3D, uvw, mipMapLevel);
        Shape += textureLod(uTexture3D, uvw * 4.0, mipMapLevel);
        Shape -= textureLod(uTexture3D, uvw * .01, mipMapLevel)*.6;
        Shape /= 2.0;
        Shape -= Position.y/40.0;
        Shape -= abs(SphereCenter.x-Position.x)/100.0;
        Shape -= (abs(SphereCenter.z-Position.z)/200.0) - (SphereCenter.z-Position.z)/300.0;
        Shape *= 3.0;
        float density = max(0.0, (Shape.r) - DensityThresh) * DensityMult;
        return density;
    }
    vec2 rayBoxDst(vec3 boundsMin, vec3 boundsMax, vec3 rayOrigin, vec3 invRaydir) {
                // Adapted from: http://jcgt.org/published/0007/03/04/
                vec3 t0 = (boundsMin - rayOrigin) * invRaydir; //set bounds in world space
                vec3 t1 = (boundsMax - rayOrigin) * invRaydir;
                vec3 tmin = min(t0, t1); // sets actual min and max after transform
                vec3 tmax = max(t0, t1);

                float dstA = max(max(tmin.x, tmin.y), tmin.z);
                float dstB = min(tmax.x, min(tmax.y, tmax.z));

                // CASE 1: ray intersects box from outside (0 <= dstA <= dstB)
                // dstA is dst to nearest intersection, dstB dst to far intersection

                // CASE 2: ray intersects box from inside (dstA < 0 < dstB)
                // dstA is the dst to intersection behind the ray, dstB is dst to forward intersection

                // CASE 3: ray misses box (dstA > dstB)

                float dstToBox = max(0.0, dstA);
                float dstInsideBox = max(0.0, dstB - dstToBox);
                return vec2(dstToBox, dstInsideBox);
            }
    vec2 raySphereDst(float radius, vec3 sphereCenter, vec3 rayOrigin, vec3 rayDir, float zTime)
    {
        vec2 worldUV = vec2(sphereCenter.x* 4.3, -sphereCenter.z) * .1; 
        float CloudNoise = texture(uTexture, worldUV).r;
        radius += ((CloudNoise * 2.0) - 1.0) * 20.0;
        // Vector from ray origin to sphere center
        vec3 oc = rayOrigin - sphereCenter;
        
        // Quadratic equation coefficients
        // |rayOrigin + t*rayDir - sphereCenter|^2 = radius^2
        float a = dot(rayDir,rayDir); 
        float b = 2.0 * dot(oc, rayDir);
        float c = dot(oc, oc) - (radius * radius * CloudNoise);
        
        float discriminant = (b * b) - (4.0 * a  * c);
        
        // No intersection
        if (discriminant < 0.0) {
            return vec2(0.0, 0.0);
        }
        
        // Two intersection points
        float sqrtDisc = sqrt(discriminant);
        float t1 = (-b - sqrtDisc) / (2.0 * a); // Near intersection
        float t2 = (-b + sqrtDisc) / (2.0 * a); // Far intersection
        
        // Distance to sphere (0 if inside)
        float dstToSphere = max(0.0, t1);
        // Distance through sphere
        float dstInsideSphere = max(0.0, t2 - dstToSphere);
        return vec2(dstToSphere, dstInsideSphere);
    }
    vec2 rayTorusDst(float InnerRadius, float LoopRadius, vec3 rayOrigin, vec3 rayDir)
    {
       // (x2+y2+z2+A2−B2)2=4A2(x2+y2) equation for point on torus
       float dstInsideTor;
       float dstToTor;
       return vec2(dstToTor,dstInsideTor);
    }
    void main()
    {
        vec2 newUV = vec2((gl_FragCoord.x) / uResolution.x, (gl_FragCoord.y) / (uResolution.y));
        float DepthTexture = texture(depthTexture, newUV).r;
        float near = 0.1;
        float far = 200.0;
        float z = DepthTexture * 2.0 - 1.0;
        float linearDepth = (2.0 * near * far) / (far + near - z * (far - near));
        linearDepth = linearDepth / far;
        

        float DetailSize = 3.0;
        float UVSize = 8.0;
        vec3 DetailOff = vec3(0.1,0.1,0.1);
        float Frame = Time / 8000.0;
       
         //RayMarching
        float CubeSize = 50.0;
        vec3 RayOrigin = viewPos;
        
        vec3 RayDir = normalize(vWorldPos - viewPos);
    
        //RayDir = max(abs(RayDir), vec3(0.0001)) * sign(RayDir);
        vec3 invRayDir = 1.0 / max(abs(RayDir), vec3(0.0001)) * sign(RayDir);
        vec3 BoundsMin = vec3(-CubeSize,-CubeSize,-CubeSize);
        vec3 BoundsMax = vec3(CubeSize,CubeSize,CubeSize);
        
        //vec2 rayMeshInfo = rayBoxDst(BoundsMin,BoundsMax, RayOrigin, invRayDir);
        float Radius = 90.0;
        float InnerRadius = 18.0;
        vec3 Origin = vec3(45.0,0.0,30.0);
        vec2 rayMeshInfo = raySphereDst(Radius, Origin,RayOrigin,RayDir, Frame);
        float distToMesh = rayMeshInfo.x;
        float distInMesh = rayMeshInfo.y;
        if (distInMesh <= 0.0) {
            discard;
        }
        vec2 innerRayMeshInfo = raySphereDst(InnerRadius, Origin, RayOrigin, RayDir, Frame);
        float distToInner = innerRayMeshInfo.x - distToMesh;
        float distSkip = distToInner + innerRayMeshInfo.y; // adding dist inner to make comparing with dstTraveled easier
        float distTraveled = 0.0;
        float numSteps = 128.0;
        float Noise3D1 = texture(uTexture3D, vec3(RayDir.xy, Frame/10.0)).r * .1;
        float Noise3D2 = texture(uTexture3D, vec3(RayDir.xy, Frame/5.0)).r * .1;
        float stepSize = distInMesh / numSteps;
        float stepRandAm = .5;
        float maxStepSize = stepSize * 2.0;
        float minStepSize = stepSize * .25;
        stepSize += (texture(uTextureBlueNoise, UVCord + vec2(Noise3D1, Noise3D2)).r + rand(UVCord) * stepRandAm);
        
        float DistLimit = distInMesh;
        float TotalDensity = 0.0;
        float previousDensity = 0.0;

        float MaxHeight = 12.0;
        float MinHeight = 0.0;
        float DepthMult = 90.0;
        float tile = 4.5;
        float tile2 = 8.0 + (sin(Frame) * 5.0);
        float formuparam = .53 + sin(UVCord.y + Frame * 10.0)*.01;
        float iterations = 6.0;
        float darkmatter = 1.0000;
        float brightness = .00002;
        float saturation = 0.850; 
        float distfading = 0.730;
        float r = 0.0;
        vec3 v = vec3(0.);
        float DistToOrg = length(viewPos - Origin);
        while ((distTraveled < DistLimit))
        {
            if (distTraveled > linearDepth*DepthMult &&  !(linearDepth >= 1.0))
            {
                break;
            }
            vec3 RayPos = RayOrigin + RayDir * (distToMesh + distTraveled);
            if (!(distTraveled > distToInner && distTraveled < distSkip) && !(RayPos.y > MaxHeight) && !(RayPos.y < MinHeight)) // Hole
            {
                float density = SampleDensity(RayPos,Frame,Origin ) * stepSize * (1.0 - (RayPos.y/2.0)/MaxHeight);
                float densityGradient = abs(density - previousDensity);
                if (distToInner == 0.0) {distToInner = .1;}
                stepSize = mix(maxStepSize, minStepSize, densityGradient);
                TotalDensity += density;
                previousDensity = density;
                if (TotalDensity > 1.0)
                {
                    break;
                }
                if (density > 0.01) 
                {
                    float s = stepSize;
                    vec3 p = RayPos;
                    vec3 p2 = RayPos;
                    float fade=1.;

                    p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
                    p2 = abs(vec3(tile2)-mod(p2,vec3(tile2*2.0))); // tiling fold
                    float pa,a=pa=0.;

                    for (float i=0.0; i<iterations; i++) 
                    { 
                        p=abs(p)/dot(p,p)-formuparam; // the magic formula
                        p2=abs(p2)/dot(p2,p2)-formuparam-.1;

                        a+=abs(length(p)-pa + s); // absolute sum of average change
                        a+=abs(length(p2)-pa);
                        pa=length(p);   
                        s+=stepSize;
                    }
                    s*=.5;
                    float dm=max(0.,darkmatter-a*a*.001); //dark matter
                    a*=a*a*a; // add contrast
                    if (r>3.0) fade*=1.-dm; // dark matter, don't render near
                    v+=vec3(dm,dm*.5,0.);
                    v+=fade;
                    v+=vec3(s,s*s*s*s,s*s*s)*a*brightness*fade; // coloring based on distance
                    fade*=distfading; // distance fading
                     r++;   
                }
            }
            distTraveled += stepSize;
            
        }
        float Transmittance = exp(-TotalDensity);
        v=mix(vec3(length(v)),v,saturation); //color adjust
        float colCutoff = .1;
        if (length(v) < colCutoff) {v = vec3(0.0);}
        float GlitterAlpha = Transmittance > .99 ? 0.0 : 1.0;
        vec4 Glitter = vec4(v*.0000001,GlitterAlpha);
    
    
        float QuantizeLevel = 4.0;
        TotalDensity *= QuantizeLevel;
        TotalDensity = floor(TotalDensity);
        TotalDensity /= QuantizeLevel;
        

        vec3 Col = vec3(.01, .25, .28);
        
        
        float Level = (1.0) - Transmittance;
    
        float LightCutoff = .9;
        vec4 Output = vec4(Col,-.05 + ceil((1.0-Transmittance)*5.0)/5.0);
        Glitter.a *= Output.a;
        
        
       fragColor = Output + Glitter;
    }
  