#version 300 es
    precision highp float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    uniform sampler2D uTextureScene;
    uniform vec2 uResolution;  
    uniform float DeltaTime; 
    out vec4 fragColor;
    vec2 UnitSize;

   int BorderCheck(vec2 UV)
        {
            //Corners 
            if (UV.x - UnitSize.x < 0.0 && UV.y - UnitSize.y < 0.0) {return 4;}//BottomLeft
            else if (UV.x - UnitSize.x < 0.0 && UV.y + UnitSize.y > 1.0) {return 5;}//TopLeft
            else if (UV.x + UnitSize.x > 1.0 && UV.y - UnitSize.y < 0.0) {return 6;}//BottomRight
            else if (UV.x + UnitSize.x > 1.0 && UV.y + UnitSize.y > 1.0) {return 7;}//TopRight
            
            if (UV.x - UnitSize.x < 0.0)
            {
                return 0;
            }
            else if (UV.x + UnitSize.x > 1.0)
            {
                return 1;
            }
            else if (UV.y - UnitSize.y < 0.0)
            {
                return 2;
            }
            else if (UV.y + UnitSize.y > 1.0)
            {
                return 3;
            }
            else{
                return -1;
            }
        }
    vec3 UpdateBorder(float InitDense, vec2 InitVelo, vec2 screenSpace)
    {
        int BorderResult = BorderCheck(screenSpace);
        float NewDense = 0.0;
        vec2 NewVelo = vec2(0.0);
        if (BorderResult == -1){return vec3(InitDense, InitVelo);}
        else if (BorderResult == 0)
        {
            vec3 AdjVal = texture(uTextureScene, vec2(screenSpace.x + UnitSize.x, screenSpace.y)).rgb;
            NewDense = AdjVal.r;
            NewVelo = vec2(AdjVal.g * -1.0, AdjVal.b);
        }
        else if (BorderResult == 1)
        {
            vec3 AdjVal = texture(uTextureScene, vec2(screenSpace.x - UnitSize.x, screenSpace.y)).rgb;
            NewDense = AdjVal.r;
            NewVelo = vec2(AdjVal.g * -1.0, AdjVal.b);
        }
        else if (BorderResult == 2)
        {
            vec3 AdjVal = texture(uTextureScene, vec2(screenSpace.x , screenSpace.y + UnitSize.y)).rgb;
            NewDense = AdjVal.r;
            NewVelo = vec2(AdjVal.g, AdjVal.b * -1.0);
        }
        else if (BorderResult == 3)
        {
            vec3 AdjVal = texture(uTextureScene, vec2(screenSpace.x , screenSpace.y - UnitSize.y)).rgb;
            NewDense = AdjVal.r;
            NewVelo = vec2(AdjVal.g, AdjVal.b * -1.0);
        }   
        else if (BorderResult == 4)//Bottom Left Corner
        {
            vec3 AdjVal = texture(uTextureScene, vec2(screenSpace.x + UnitSize.x , screenSpace.y + UnitSize.y)).rgb;
            NewDense = AdjVal.r;
            NewVelo = vec2(AdjVal.g * -1.0, AdjVal.b * -1.0);
        }   
        else if (BorderResult == 5)//Top Left Corner
        {
            vec3 AdjVal = texture(uTextureScene, vec2(screenSpace.x + UnitSize.x , screenSpace.y - UnitSize.y)).rgb;
            NewDense = AdjVal.r;
            NewVelo = vec2(AdjVal.g * -1.0, AdjVal.b * -1.0);
        }   
        else if (BorderResult == 6)//Bottom Right Corner
        {
            vec3 AdjVal = texture(uTextureScene, vec2(screenSpace.x - UnitSize.x , screenSpace.y + UnitSize.y)).rgb;
            NewDense = AdjVal.r;
            NewVelo = vec2(AdjVal.g * -1.0, AdjVal.b * -1.0);
        }   
        else if (BorderResult == 7)//Top Right Corner
        {
            vec3 AdjVal = texture(uTextureScene, vec2(screenSpace.x - UnitSize.x , screenSpace.y - UnitSize.y)).rgb;
            NewDense = AdjVal.r;
            NewVelo = vec2(AdjVal.g * -1.0, AdjVal.b * -1.0);
        }   
        return (vec3(NewDense, NewVelo));

    }



    void main()
    {
        float TimeScale = 1.0;  
        float DiffAm = 1.0;
        float Ratio = (uResolution.x * .5) / uResolution.y;
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        UnitSize = vec2(1.0 / uResolution.x, 1.0 / uResolution.y);
        float InitalDensity = texture(uTextureScene, screenSpace).r;
        vec2 InitalVelocities = texture(uTextureScene, screenSpace).gb;
        vec3 NewBorder = UpdateBorder(InitalDensity,InitalVelocities, screenSpace);
        fragColor = vec4(vec3(NewBorder), 1.0);
    }
