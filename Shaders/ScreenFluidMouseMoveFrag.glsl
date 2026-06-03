#version 300 es
    precision highp float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    uniform sampler2D uTextureScene;
    uniform vec2 uResolution; 
    uniform float DeltaTime; 
    uniform vec2 MousePos;
    uniform vec2 MouseVel;
    out vec4 fragColor;
    vec2 UnitSize;


    void main()
    {
        float MarginOfError = .1;
        float MinVelo = .001;
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        UnitSize = vec2(1.0 / (uResolution.x), 1.0 / (uResolution.y));
        float Density = texture(uTextureScene, screenSpace).r;
        vec2 Velo = texture(uTextureScene, screenSpace).gb;

        //y = ((x - xc) * -slope) + yc
        float Y = ((screenSpace.x - MousePos.x) * -(MouseVel.y/MouseVel.x)) + MousePos.y;
        //x = (y - yc / -slope) + xc
        float X = ((screenSpace.y - MousePos.y) / -(MouseVel.y/MouseVel.x)) + MousePos.x;
        if (abs(MouseVel.x + MouseVel.y) > MinVelo && 
        (abs(Y-screenSpace.y) <= MarginOfError) || abs(X-screenSpace.x) <= MarginOfError)
        {
            float Dist = distance(screenSpace, MousePos); 
            if (Dist < abs(MouseVel.x + MouseVel.y))
                {
                    Velo = vec2(MouseVel.x, -MouseVel.y) * uResolution;
                    Velo = vec2(clamp(Velo.x, -10.0, 10.0), clamp(Velo.y, -10.0, 10.0));
                    Density += .1;
                    Density = clamp(Density, 0.0, 1.0);
                }

        }
        fragColor = vec4(vec3(Density, Velo), 1.0);
    }
