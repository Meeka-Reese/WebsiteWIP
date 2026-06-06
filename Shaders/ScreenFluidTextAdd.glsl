#version 300 es
    precision highp float;    
    in vec3 Normals;
    in vec3 FragPos;
    in vec2 UVCord;
    uniform sampler2D uTextureScene;
    uniform sampler2D uTextureModel;
    uniform vec2 uResolution;  
    uniform float DeltaTime; 
    out vec4 fragColor;
    vec2 UnitSize = vec2(0.0,0.0);


    bool BorderCheck(vec2 UV)
        {
            if (UV.x - UnitSize.x < 0.0 || UV.x + UnitSize.x > 1.0 ||
            UV.y - UnitSize.y < 0.0 || UV.y + UnitSize.y > 1.0)
            {
                return true;
            }
            else{
                return false;
            }
        }
    void main()
    {
        float TimeScale = 5.0;
        vec2 NewCord = gl_FragCoord.xy;
        vec2 screenSpace = vec2(((NewCord.x)/(uResolution.x)), 
        (NewCord.y/(uResolution.y)));
        if (BorderCheck(screenSpace)) {discard;}
        UnitSize = vec2(1.0 / (uResolution.x), 1.0 / (uResolution.y));
        vec2 UVL = vec2((screenSpace.x * .5), screenSpace.y);
        float Den = texture(uTextureScene, UVL).r;
        vec2 Velo = texture(uTextureScene, UVL).gb;
        vec4 Model = texture(uTextureModel, vec2(screenSpace.x, screenSpace.y));
        Model.gb = (Model.gb - .5) * 10.0;
        
        float AddAmDen = 20.0 * DeltaTime * TimeScale;
        float AddAmVelo = 10.0 * DeltaTime * TimeScale;
        vec3 Output = vec3(Den, Velo) + vec3(Model.r * AddAmDen, Model  .gb * AddAmVelo);
        if (Model.a == 0.0) {Output = vec3(Den, Velo);}
        fragColor = vec4(vec3(Output), 1.0);
    }
