import { gGL } from "./webgl-demo.js";

export function SetProgramInfo(GL, ProgramInfoWave, ShaderProgramWave, ProgramInfoFlat, ShaderProgramFlat,
    ProgramInfoCloud, ShaderProgramCloud, ProgramInfoSkybox, ShaderProgramSkybox, 
    ProgramInfoStar, ShaderProgramStar,
    ProgramInfoColor, ShaderProgramColor, 
    ProgramInfoVolGlow, ShaderProgramVolGlow,
    ProgramInfoDef, ShaderProgramDef,
    ProgramInfoRaycast, ShaderProgramRaycast,
    ProgramInfoGlass, ShaderProgramGlass,
    ProgramInfoScreenRender, ShaderProgramScreenRender,
    ProgramInfoScreenImage, ShaderProgramScreenImage,
    ProgramInfoTrans, ShaderProgramTrans,
    ProgramInfoFlesh, ShaderProgramFlesh,
    ProgramInfoElenco, ShaderProgramElenco,
    ProgramInfoFleshPart, ShaderProgramFleshPart,
    ProgramInfoMorph, ShaderProgramMorph,
    ProgramInfoTreeMorph, ShaderProgramTreeMorph,
    ProgramInfoBloodCloud, ShaderProgramBloodCloud,
    ProgramInfoScreenBGTrans, ShaderProgramScreenBGTrans,
    ProgramInfoPostProcessingFlesh, ShaderProgramPostProcessingFlesh,
    ProgramInfoGLTFDef, ShaderProgramGLTFDef,
    ProgramInfoPostProcessingAndrew, ShaderProgramPostProcessingAndrew,
    ProgramInfoToon, ShaderProgramToon,
    ProgramInfoPostProcessing, ShaderProgramPostProcessing,
    ) {
        //SOON TO DO - REORGANIZE TEXTURES SO THEY USE MULTIPLE TEXTURE SLOTS WITH GENERIC NAMES INSTEAD OF "TEXTUREBN"
    ProgramInfoDef.program = ShaderProgramDef;
    ProgramInfoDef.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramDef, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramDef, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramDef, "aUVCord"),
    };
    ProgramInfoDef.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramDef, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramDef, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramDef, "uModelMatrix"),
        lightPosition: GL.getUniformLocation(ShaderProgramDef, "lightPos"),
        viewPosition: GL.getUniformLocation(ShaderProgramDef, "viewPos"),
        lightColor: GL.getUniformLocation(ShaderProgramDef, "lightColor"),
        lightIntensity: GL.getUniformLocation(ShaderProgramDef, "lightIntensity"),
        objCol: GL.getUniformLocation(ShaderProgramDef,"objCol"),
        time: GL.getUniformLocation(ShaderProgramDef, "Time"),
    };
    
    ProgramInfoWave.program = ShaderProgramWave;
    ProgramInfoWave.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramWave, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramWave, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramWave, "aUVCord"),
    };
    ProgramInfoWave.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramWave, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramWave, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramWave, "uModelMatrix"),
        lightPosition: GL.getUniformLocation(ShaderProgramWave, "lightPos"),
        viewPosition: GL.getUniformLocation(ShaderProgramWave, "viewPos"),
        lightColor: GL.getUniformLocation(ShaderProgramWave, "lightColor"),
        lightIntensity: GL.getUniformLocation(ShaderProgramWave, "lightIntensity"),
        objCol: GL.getUniformLocation(ShaderProgramWave,"objCol"),
        time: GL.getUniformLocation(ShaderProgramWave, "Time"),
        depthTexture: GL.getUniformLocation(ShaderProgramWave, "depthTexture"),
        resolution: GL.getUniformLocation(ShaderProgramWave, "uResolution"),
    };

    ProgramInfoFlat.program = ShaderProgramFlat;
    ProgramInfoFlat.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramFlat, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramFlat, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramFlat, "aUVCord"),
    };
    ProgramInfoFlat.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramFlat, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramFlat, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramFlat, "uModelMatrix"),
        texture: GL.getUniformLocation(ShaderProgramFlat, "uTexture"),
        alpha: GL.getUniformLocation(ShaderProgramFlat, "Alpha"),
    };
    ProgramInfoCloud.program = ShaderProgramCloud;
    ProgramInfoCloud.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramCloud, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramCloud, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramCloud, "aUVCord"),
    };
    ProgramInfoCloud.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramCloud, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramCloud, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramCloud, "uModelMatrix"),
        texture: GL.getUniformLocation(ShaderProgramCloud, "uTexture"),
        textureBN: GL.getUniformLocation(ShaderProgramCloud, "uTextureBlueNoise"),
        texture3D: GL.getUniformLocation(ShaderProgramCloud, "uTexture3D"),
        time: GL.getUniformLocation(ShaderProgramCloud, "Time"),
        cameraViewDir: GL.getUniformLocation(ShaderProgramCloud, "CameraViewDir"),
        viewPosition: GL.getUniformLocation(ShaderProgramCloud, "viewPos"),
        depthTexture: GL.getUniformLocation(ShaderProgramCloud, "depthTexture"),
        resolution: GL.getUniformLocation(ShaderProgramCloud, "uResolution"),
    };
    
    ProgramInfoSkybox.program = ShaderProgramSkybox;
    ProgramInfoSkybox.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramSkybox, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramSkybox, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramSkybox, "aUVCord"),
    };
    ProgramInfoSkybox.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramSkybox, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramSkybox, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramSkybox, "uModelMatrix"),
        time: GL.getUniformLocation(ShaderProgramSkybox, "Time"),
        inverseViewDir: GL.getUniformLocation(ShaderProgramSkybox, "uInverseViewDir"),
        skybox: GL.getUniformLocation(ShaderProgramSkybox, "uSkybox"),
        texture: GL.getUniformLocation(ShaderProgramSkybox, "uTexture"),
        depthTexture: GL.getUniformLocation(ShaderProgramSkybox, "depthTexture"),
        resolution: GL.getUniformLocation(ShaderProgramSkybox, "uResolution"),
    };

    
    ProgramInfoStar.program = ShaderProgramStar;
    ProgramInfoStar.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramStar, "aVertPos"),
        UVPosition: GL.getAttribLocation(ShaderProgramStar, "aUVCord"),
        QuadPos: GL.getAttribLocation(ShaderProgramStar, "aQuadPos"),
    };
    ProgramInfoStar.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramStar, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramStar, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramStar, "uModelMatrix"),
        time: GL.getUniformLocation(ShaderProgramStar, "Time"),
        depthTexture: GL.getUniformLocation(ShaderProgramStar, "depthTexture"),
        resolution: GL.getUniformLocation(ShaderProgramStar, "uResolution"),
    };


    ProgramInfoColor.program = ShaderProgramColor;
    ProgramInfoColor.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramColor, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramColor, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramColor, "aUVCord"),
    };
    ProgramInfoColor.uniformLocations = {
        color: GL.getUniformLocation(ShaderProgramColor, "uColor"),
        modelMatrix: GL.getUniformLocation(ShaderProgramColor, "uModelMatrix"),
    };


    ProgramInfoVolGlow.program = ShaderProgramVolGlow;
    ProgramInfoVolGlow.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramVolGlow, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramVolGlow, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramVolGlow, "aUVCord"),
    };
    ProgramInfoVolGlow.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramVolGlow, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramVolGlow, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramVolGlow, "uModelMatrix"),
        color: GL.getUniformLocation(ShaderProgramVolGlow, "objCol"),
        time: GL.getUniformLocation(ShaderProgramVolGlow, "Time"),
        origin: GL.getUniformLocation(ShaderProgramVolGlow, "Origin"),
        texture: GL.getUniformLocation(ShaderProgramVolGlow, "uTexture"),
        depthTexture: GL.getUniformLocation(ShaderProgramVolGlow, "depthTexture"),
        resolution: GL.getUniformLocation(ShaderProgramVolGlow, "uResolution"),
    };


    ProgramInfoRaycast.program = ShaderProgramRaycast;
    ProgramInfoRaycast.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramRaycast, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramRaycast, "aNorm"),
    };
    ProgramInfoRaycast.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramRaycast, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramRaycast, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramRaycast, "uModelMatrix"),
        objectIndex: GL.getUniformLocation(ShaderProgramRaycast, "uObjetIndex"),
    };


    ProgramInfoGlass.program = ShaderProgramGlass;
    ProgramInfoGlass.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramGlass, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramGlass, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramGlass, "aUVCord"),
    }
    ProgramInfoGlass.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramGlass, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramGlass, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramGlass, "uModelMatrix"),
        depthTexture: GL.getUniformLocation(ShaderProgramGlass, "depthTexture"),
        textureScene: GL.getUniformLocation(ShaderProgramGlass, "uTextureScene"),
        normal: GL.getUniformLocation(ShaderProgramGlass, "uNormal"),
        displacement: GL.getUniformLocation(ShaderProgramGlass, "uDisplacement"),
        color: GL.getUniformLocation(ShaderProgramGlass, "objCol"),
        cameraViewDir: GL.getUniformLocation(ShaderProgramGlass, "CameraViewDir"),
        viewPosition: GL.getUniformLocation(ShaderProgramGlass, "viewPos"),
        lightPosition: GL.getUniformLocation(ShaderProgramGlass, "lightPos"),
        lightColor: GL.getUniformLocation(ShaderProgramGlass, "lightColor"),
        lightIntensity: GL.getUniformLocation(ShaderProgramGlass, "lightIntensity"),
        marchOrigin: GL.getUniformLocation(ShaderProgramGlass, "marchOrigin"),
        time: GL.getUniformLocation(ShaderProgramGlass, "Time"),
        isHover: GL.getUniformLocation(ShaderProgramGlass, "isHover"),
    }


    ProgramInfoScreenRender.program = ShaderProgramScreenRender;
    ProgramInfoScreenRender.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramScreenRender, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramScreenRender, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramScreenRender, "aUVCord"),
    }
    ProgramInfoScreenRender.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramScreenRender, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramScreenRender, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramScreenRender, "uModelMatrix"),
        textureScene: GL.getUniformLocation(ShaderProgramScreenRender, "uTextureScene"),
        resolution: GL.getUniformLocation(ShaderProgramScreenRender, "uResolution"),
        textureScale: GL.getUniformLocation(ShaderProgramScreenRender, "TextScale"),
    }


    ProgramInfoScreenImage.program = ShaderProgramScreenImage;
    ProgramInfoScreenImage.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramScreenImage, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramScreenImage, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramScreenImage, "aUVCord"),
    }
    ProgramInfoScreenImage.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramScreenImage, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramScreenImage, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramScreenImage, "uModelMatrix"),
        texture: GL.getUniformLocation(ShaderProgramScreenImage, "uTexture"),
        resolution: GL.getUniformLocation(ShaderProgramScreenImage, "uResolution"),
        alpha: GL.getUniformLocation(ShaderProgramScreenImage, "Alpha"),

    }

    ProgramInfoTrans.program = ShaderProgramTrans;
    ProgramInfoTrans.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramTrans, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramTrans, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramTrans, "aUVCord"),
    }
    ProgramInfoTrans.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramTrans, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramTrans, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramTrans, "uModelMatrix"),
        texture: GL.getUniformLocation(ShaderProgramTrans, "uTexture"),
        texture3D: GL.getUniformLocation(ShaderProgramTrans, "uTexture3D"),
        time: GL.getUniformLocation(ShaderProgramTrans, "Time"),
        lightPosition: GL.getUniformLocation(ShaderProgramTrans, "lightPos"),
        viewPosition: GL.getUniformLocation(ShaderProgramTrans, "viewPos"),
        lightColor: GL.getUniformLocation(ShaderProgramTrans, "lightColor"),
        lightIntensity: GL.getUniformLocation(ShaderProgramTrans, "lightIntensity"),
        resolution: GL.getUniformLocation(ShaderProgramTrans, "uResolution"),
        origin: GL.getUniformLocation(ShaderProgramTrans, "uOrigin"),
        viewPosition: GL.getUniformLocation(ShaderProgramTrans, "viewPos"),
        weightImage2DArray: GL.getUniformLocation(ShaderProgramTrans, "weightImage2DArray"),
        boneParentIndicies: GL.getUniformLocation(ShaderProgramTrans, "boneParentIndicies"),
        colecItemCount: GL.getUniformLocation(ShaderProgramTrans, "colecItemCount"),
        boneMatrixColec: GL.getUniformLocation(ShaderProgramTrans, "boneMatrixColec"),
        ccVals: GL.getUniformLocation(ShaderProgramTrans, "ccVals"),
    }

    ProgramInfoFlesh.program = ShaderProgramFlesh;
    ProgramInfoFlesh.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramFlesh, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramFlesh, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramFlesh, "aUVCord"),
    }
    ProgramInfoFlesh.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramFlesh, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramFlesh, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramFlesh, "uModelMatrix"),
        lightPosition: GL.getUniformLocation(ShaderProgramFlesh, "lightPos"),
        viewPosition: GL.getUniformLocation(ShaderProgramFlesh, "viewPos"),
        lightColor: GL.getUniformLocation(ShaderProgramFlesh, "lightColor"),
        lightIntensity: GL.getUniformLocation(ShaderProgramFlesh, "lightIntensity"),
        objCol: GL.getUniformLocation(ShaderProgramFlesh,"objCol"),
        time: GL.getUniformLocation(ShaderProgramFlesh, "Time"),
        texture: GL.getUniformLocation(ShaderProgramFlesh, "uTexture"),
        texture3D: GL.getUniformLocation(ShaderProgramFlesh, "uTexture3D"),
        textureBN: GL.getUniformLocation(ShaderProgramFlesh, "uTextureBlueNoise"),
        ccVals: GL.getUniformLocation(ShaderProgramFlesh, "ccVals"),
        uvScale: GL.getUniformLocation(ShaderProgramFlesh, "UVScale"),
        lightness: GL.getUniformLocation(ShaderProgramFlesh, "Lightness"),
    }

    ProgramInfoElenco.program = ShaderProgramElenco;
    ProgramInfoElenco.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramElenco, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramElenco, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramElenco, "aUVCord"),
    }
    ProgramInfoElenco.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramElenco, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramElenco, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramElenco, "uModelMatrix"),
        texture: GL.getUniformLocation(ShaderProgramElenco, "uTexture"),
        resolution: GL.getUniformLocation(ShaderProgramElenco, "uResolution"),
        time: GL.getUniformLocation(ShaderProgramElenco, "Time"),
    }

    ProgramInfoFleshPart.program = ShaderProgramFleshPart;
    ProgramInfoFleshPart.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramFleshPart, "aVertPos"),
        UVPosition: GL.getAttribLocation(ShaderProgramFleshPart, "aUVCord"),
        QuadPos: GL.getAttribLocation(ShaderProgramFleshPart, "aQuadPos"),
    };
    ProgramInfoFleshPart.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramFleshPart, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramFleshPart, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramFleshPart, "uModelMatrix"),
        time: GL.getUniformLocation(ShaderProgramFleshPart, "Time"),
        depthTexture: GL.getUniformLocation(ShaderProgramFleshPart, "depthTexture"),
        resolution: GL.getUniformLocation(ShaderProgramFleshPart, "uResolution"),
    };

    ProgramInfoMorph.program = ShaderProgramMorph;
    ProgramInfoMorph.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramMorph, "aVertPos"),
        targetVertexPosition: GL.getAttribLocation(ShaderProgramMorph, "aTargetVertPos"),
        targetVertexPosition2: GL.getAttribLocation(ShaderProgramMorph, "aTargetVertPos2"),
        targetVertexPosition3: GL.getAttribLocation(ShaderProgramMorph, "aTargetVertPos3"),
        targetVertexPosition4: GL.getAttribLocation(ShaderProgramMorph, "aTargetVertPos4"),
        normalPosition: GL.getAttribLocation(ShaderProgramMorph, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramMorph, "aUVCord"),
    };
    ProgramInfoMorph.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramMorph, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramMorph, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramMorph, "uModelMatrix"),
        texture: GL.getUniformLocation(ShaderProgramMorph, "uTexture"),
        textureBN: GL.getUniformLocation(ShaderProgramMorph, "uTexture2"), //using textureBN rn as alt because I'm going to restructure soon 
        alpha: GL.getUniformLocation(ShaderProgramMorph, "Alpha"),
        time: GL.getUniformLocation(ShaderProgramMorph, "Time"),
        lifeSpan: GL.getUniformLocation(ShaderProgramMorph, "lifeSpan"),
        spawnTime: GL.getUniformLocation(ShaderProgramMorph, "spawnTime"),
    };

    ProgramInfoTreeMorph.program = ShaderProgramTreeMorph;
    ProgramInfoTreeMorph.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramTreeMorph, "aVertPos"),
        targetVertexPosition: GL.getAttribLocation(ShaderProgramTreeMorph, "aTargetVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramTreeMorph, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramTreeMorph, "aUVCord"),
    };
    ProgramInfoTreeMorph.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramTreeMorph, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramTreeMorph, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramTreeMorph, "uModelMatrix"),
        texture: GL.getUniformLocation(ShaderProgramTreeMorph, "uTexture"),
        textureBN: GL.getUniformLocation(ShaderProgramTreeMorph, "uTexture2"), //using textureBN rn as alt because I'm going to restructure soon 
        alpha: GL.getUniformLocation(ShaderProgramTreeMorph, "Alpha"),
        time: GL.getUniformLocation(ShaderProgramTreeMorph, "Time"),
        lightness: GL.getUniformLocation(ShaderProgramTreeMorph, "Lightness"),
    };

    ProgramInfoBloodCloud.program = ShaderProgramBloodCloud;
    ProgramInfoBloodCloud.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramBloodCloud, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramBloodCloud, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramBloodCloud, "aUVCord"),
    };
    ProgramInfoBloodCloud.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramBloodCloud, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramBloodCloud, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramBloodCloud, "uModelMatrix"),
        texture: GL.getUniformLocation(ShaderProgramBloodCloud, "uTexture"),
        textureBN: GL.getUniformLocation(ShaderProgramBloodCloud, "uTextureBlueNoise"),
        texture3D: GL.getUniformLocation(ShaderProgramBloodCloud, "uTexture3D"),
        time: GL.getUniformLocation(ShaderProgramBloodCloud, "Time"),
        cameraViewDir: GL.getUniformLocation(ShaderProgramBloodCloud, "CameraViewDir"),
        viewPosition: GL.getUniformLocation(ShaderProgramBloodCloud, "viewPos"),
        depthTexture: GL.getUniformLocation(ShaderProgramBloodCloud, "depthTexture"),
        resolution: GL.getUniformLocation(ShaderProgramBloodCloud, "uResolution"),
    };

    ProgramInfoScreenBGTrans.program = ShaderProgramScreenBGTrans;
    ProgramInfoScreenBGTrans.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramScreenBGTrans, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramScreenBGTrans, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramScreenBGTrans, "aUVCord"),
    }
    ProgramInfoScreenBGTrans.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramScreenBGTrans, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramScreenBGTrans, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramScreenBGTrans, "uModelMatrix"),
        resolution: GL.getUniformLocation(ShaderProgramScreenBGTrans, "uResolution"),
        texture: GL.getUniformLocation(ShaderProgramScreenBGTrans, "uTexture"),
        time: GL.getUniformLocation(ShaderProgramScreenBGTrans, "Time"),
        textureBN: GL.getUniformLocation(ShaderProgramScreenBGTrans, "CharText"),
        lightness: GL.getUniformLocation(ShaderProgramScreenBGTrans, "Lightness"),
    }

    ProgramInfoPostProcessingFlesh.program = ShaderProgramPostProcessingFlesh;
    ProgramInfoPostProcessingFlesh.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramPostProcessingFlesh, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramPostProcessingFlesh, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramPostProcessingFlesh, "aUVCord"),
    }
    ProgramInfoPostProcessingFlesh.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramPostProcessingFlesh, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramPostProcessingFlesh, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramPostProcessingFlesh, "uModelMatrix"),
        texture: GL.getUniformLocation(ShaderProgramPostProcessingFlesh, "uTexture"),
        resolution: GL.getUniformLocation(ShaderProgramPostProcessingFlesh, "uResolution"),
        time: GL.getUniformLocation(ShaderProgramPostProcessingFlesh, "Time"),
        textureBN: GL.getUniformLocation(ShaderProgramPostProcessingFlesh, "BloomText"),
        ccVals: GL.getUniformLocation(ShaderProgramPostProcessingFlesh, "ccVals"),
        
    }

    ProgramInfoGLTFDef.program = ShaderProgramGLTFDef;
    ProgramInfoGLTFDef.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramGLTFDef, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramGLTFDef, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramGLTFDef, "aUVCord"),
        BoneWeights: GL.getAttribLocation(ShaderProgramGLTFDef, "BoneWeights"),
        WeightInd: GL.getAttribLocation(ShaderProgramGLTFDef, "WeightInd"),
    }
    ProgramInfoGLTFDef.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramGLTFDef, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramGLTFDef, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramGLTFDef, "uModelMatrix"),
        texture: GL.getUniformLocation(ShaderProgramGLTFDef, "uTexture"),
        alpha: GL.getUniformLocation(ShaderProgramGLTFDef, "Alpha"),
        boneParentIndex: GL.getUniformLocation(ShaderProgramGLTFDef, "BoneParentIndex"),
        boneMatrices: GL.getUniformLocation(ShaderProgramGLTFDef, "BoneMatrices"),
        time: GL.getUniformLocation(ShaderProgramGLTFDef, "Time"),
        //add rot scale parent
    };

    ProgramInfoPostProcessingAndrew.program = ShaderProgramPostProcessingAndrew;
    ProgramInfoPostProcessingAndrew.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramPostProcessingAndrew, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramPostProcessingAndrew, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramPostProcessingAndrew, "aUVCord"),
    }
    ProgramInfoPostProcessingAndrew.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramPostProcessingAndrew, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramPostProcessingAndrew, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramPostProcessingAndrew, "uModelMatrix"),
        texture: GL.getUniformLocation(ShaderProgramPostProcessingAndrew, "uTexture"),
        resolution: GL.getUniformLocation(ShaderProgramPostProcessingAndrew, "uResolution"),
        time: GL.getUniformLocation(ShaderProgramPostProcessingAndrew, "Time"),
        textureBN: GL.getUniformLocation(ShaderProgramPostProcessingAndrew, "BloomText"),
        
    }
    ProgramInfoToon.program = ShaderProgramToon; //unused
    ProgramInfoToon.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramToon, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramToon, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramToon, "aUVCord"),
    };
    ProgramInfoToon.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramToon, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramToon, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramToon, "uModelMatrix"),
        lightPosition: GL.getUniformLocation(ShaderProgramToon, "lightPos"),
        viewPosition: GL.getUniformLocation(ShaderProgramToon, "viewPos"),
        lightColor: GL.getUniformLocation(ShaderProgramToon, "lightColor"),
        lightIntensity: GL.getUniformLocation(ShaderProgramToon, "lightIntensity"),
        objCol: GL.getUniformLocation(ShaderProgramToon,"objCol"),
        time: GL.getUniformLocation(ShaderProgramToon, "Time"),
    };

    ProgramInfoPostProcessing.program = ShaderProgramPostProcessing;
    ProgramInfoPostProcessing.attribLocations = {
        vertexPosition: GL.getAttribLocation(ShaderProgramPostProcessing, "aVertPos"),
        normalPosition: GL.getAttribLocation(ShaderProgramPostProcessing, "aNorm"),
        UVPosition: GL.getAttribLocation(ShaderProgramPostProcessing, "aUVCord"),
    }
    ProgramInfoPostProcessing.uniformLocations = {
        projectionMatrix: GL.getUniformLocation(ShaderProgramPostProcessing, "uProjMatrix"),
        ViewMatrix: GL.getUniformLocation(ShaderProgramPostProcessing, "uViewMatrix"),
        modelMatrix: GL.getUniformLocation(ShaderProgramPostProcessing, "uModelMatrix"),
        texture: GL.getUniformLocation(ShaderProgramPostProcessing, "uTexture"),
        resolution: GL.getUniformLocation(ShaderProgramPostProcessing, "uResolution"),
        time: GL.getUniformLocation(ShaderProgramPostProcessing, "Time"),
        textureBN: GL.getUniformLocation(ShaderProgramPostProcessing, "BloomText"),
        outlineCol: GL.getUniformLocation(ShaderProgramPostProcessing, "OutlineCol"),
        outlineCutoff: GL.getUniformLocation(ShaderProgramPostProcessing, "OutlineCutoff"),
        blurAmount: GL.getUniformLocation(ShaderProgramPostProcessing, "BlurAmount"),
        bgCol: GL.getUniformLocation(ShaderProgramPostProcessing, "BGCol"),
    }

}
//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
export function loadTexture(gl, url, numChans = 4, flip = true) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    let srcFormat;
    switch (numChans)
    {
        case (1):
            srcFormat = gl.RED;
            break;
        case (2):
            srcFormat = gl.RG;
            break;
        case (3):
            srcFormat = gl.RGB;
            break;
        case (4):
            srcFormat = gl.RGBA;
            break;
        default:
            console.log("Incorrect numChannels for texture");
            break;
    }
    
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); 
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,            
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel,
    );
  
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flip);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image,
      );
  
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 
      
    };
    image.src = url;
  
    return texture;
  }
  
  
  function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }
  export function setPositionAttribute(Model, programInfo, Camera, Light, gl, Time, Armature = null, MidiManager)
{
    
    gl.bindBuffer(gl.ARRAY_BUFFER, Model.vertexBuffer); //Verts
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        3, //num componenets
        gl.FLOAT,
        false, //don't normalize
        0,
        0,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    if (Model.vertexBuffer2 != null && "targetVertexPosition" in programInfo.attribLocations && programInfo.attribLocations.targetVertexPosition >= 0)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, Model.vertexBuffer2);
        gl.vertexAttribPointer(
            programInfo.attribLocations.targetVertexPosition,
            3, //num componenets
            gl.FLOAT,
            false, //don't normalize
            0,
            0,
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.targetVertexPosition);
    }
    if (Model.vertexBuffer3 != null && "targetVertexPosition2" in programInfo.attribLocations && programInfo.attribLocations.targetVertexPosition2 >= 0)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, Model.vertexBuffer3);
        gl.vertexAttribPointer(
            programInfo.attribLocations.targetVertexPosition2,
            3, //num componenets
            gl.FLOAT,
            false, //don't normalize
            0,
            0,
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.targetVertexPosition2);
    }
    if (Model.vertexBuffer4 != null && "targetVertexPosition3" in programInfo.attribLocations && programInfo.attribLocations.targetVertexPosition3 >= 0)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, Model.vertexBuffer4);
        gl.vertexAttribPointer(
            programInfo.attribLocations.targetVertexPosition3,
            3, //num componenets
            gl.FLOAT,
            false, //don't normalize
            0,
            0,
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.targetVertexPosition3);
    }

    if (Model.vertexBuffer5 != null && "targetVertexPosition4" in programInfo.attribLocations && programInfo.attribLocations.targetVertexPosition4 >= 0)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, Model.vertexBuffer5);
        gl.vertexAttribPointer(
            programInfo.attribLocations.targetVertexPosition4,
            3, //num componenets
            gl.FLOAT,
            false, //don't normalize
            0,
            0,
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.targetVertexPosition4);
    }
  
    
    if ('normalPosition' in programInfo.attribLocations && programInfo.attribLocations.normalPosition >= 0)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, Model.normalBuffer); //Normals
        gl.vertexAttribPointer(
            programInfo.attribLocations.normalPosition,
            3,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.normalPosition);
    }
    if ('QuadPos' in programInfo.attribLocations && programInfo.attribLocations.QuadPos >= 0)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, Model.QuadPosBuffer); //Normals
        gl.vertexAttribPointer(
            programInfo.attribLocations.QuadPos,
            3,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.QuadPos);
    }
    if ("UVPosition" in programInfo.attribLocations && programInfo.attribLocations.UVPosition >= 0)
    {
      gl.bindBuffer(gl.ARRAY_BUFFER, Model.textureBuffer); //UV
      gl.vertexAttribPointer(
        programInfo.attribLocations.UVPosition,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.UVPosition);
    }
    if ("WeightColec1" in programInfo.attribLocations && Armature != null 
    && programInfo.attribLocations.WeightColec1 >= 0 && 
    programInfo.attribLocations.WeightColec2 >= 0 &&
    programInfo.attribLocations.WeightColec3 >= 0 &&
    programInfo.attribLocations.WeightColec4 >= 0 &&
    programInfo.attribLocations.WeightColec5 >= 0 &&
    programInfo.attribLocations.WeightColec6 >= 0)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, Armature.WeightBuffer1); 
        gl.vertexAttribPointer(
            programInfo.attribLocations.WeightColec1,
            4,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.WeightColec1);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, Armature.WeightBuffer2); 
        gl.vertexAttribPointer(
            programInfo.attribLocations.WeightColec2,
            4,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.WeightColec2);

        gl.bindBuffer(gl.ARRAY_BUFFER, Armature.WeightBuffer3);
        gl.vertexAttribPointer(
            programInfo.attribLocations.WeightColec3,
            4,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.WeightColec3);

        gl.bindBuffer(gl.ARRAY_BUFFER, Armature.WeightBuffer4); 
        gl.vertexAttribPointer(
            programInfo.attribLocations.WeightColec4,
            4,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.WeightColec4);

        gl.bindBuffer(gl.ARRAY_BUFFER, Armature.WeightBuffer5);
        gl.vertexAttribPointer(
            programInfo.attribLocations.WeightColec5,
            4,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.WeightColec5);

        gl.bindBuffer(gl.ARRAY_BUFFER, Armature.WeightBuffer6); 
        gl.vertexAttribPointer(
            programInfo.attribLocations.WeightColec6,
            4,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.WeightColec6);
    }
// /"UVPosition" in programInfo.attribLocations && programInfo.attribLocations.UVPosition >= 0
    if ("BoneWeights" in programInfo.attribLocations && programInfo.attribLocations.BoneWeights >= 0 && "Skeleton" in Model)
    {

        gl.bindBuffer(gl.ARRAY_BUFFER, Model.Skeleton.WeightBuff); 
        gl.vertexAttribPointer(
            programInfo.attribLocations.BoneWeights,
            4,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.BoneWeights);
    }
    if ("WeightInd" in programInfo.attribLocations && programInfo.attribLocations.WeightInd >= 0  && "Skeleton" in Model)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, Model.Skeleton.WeightInd); 
        gl.vertexAttribPointer(
            programInfo.attribLocations.WeightInd,
            4,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.WeightInd);
    }
    
    
    if (programInfo.uniformLocations.lightPosition != null)
    {
        gl.uniform3fv(programInfo.uniformLocations.lightPosition, Light.Pos);
    }
    else if (("lightPosition" in programInfo))
    {console.log("lightPosition Uniform Could Not Be Found!")};
    if (("Color" in Model) && programInfo.uniformLocations.objCol != null)
    {
        gl.uniform4fv(programInfo.uniformLocations.objCol, Model.Color);
    }
    else if (("objCol" in programInfo))
    {console.log("objCol Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.viewPosition != null)
    {
        gl.uniform3fv(programInfo.uniformLocations.viewPosition, Camera.Eye);
    }
    else if (("viewPosition" in programInfo))
    {console.log("viewPosition Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.cameraViewDir != null)
    {
        gl.uniform3fv(programInfo.uniformLocations.cameraViewDir, Camera.ViewDir);
    }
    else if ("cameraViewDir" in programInfo)
    {console.log("cameraViewDir Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.lightColor != null)
    {
        gl.uniform3fv(programInfo.uniformLocations.lightColor, Light.Color);
    }
    else if (("lightColor" in programInfo))
    {console.log("lightColor Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.lightIntensity != null)
    {
        gl.uniform1f(programInfo.uniformLocations.lightIntensity, Light.Intensity);
    }
    else if (("lightIntensity" in programInfo))
    {console.log("lightIntensity Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.texture != null && Model.Texture != null)
    {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, Model.Texture);
      gl.uniform1i(programInfo.uniformLocations.texture, 0); 
    }
    else if (("texture" in programInfo)){console.log("texture Uniform Could Not Be Found!");}

    if (programInfo.uniformLocations.textureScene != null && Model.Texture != null)
    {
      gl.activeTexture(gl.TEXTURE6);
      gl.bindTexture(gl.TEXTURE_2D, Model.Texture);
      gl.uniform1i(programInfo.uniformLocations.textureScene, 6); 
    }
    else if (("textureScene" in programInfo))
    {console.log("textureScene Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.depthTexture != null && Model.DepthTexture != null)
    {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, Model.DepthTexture);
      gl.uniform1i(programInfo.uniformLocations.depthTexture, 1); 
    }
    else if (("depthTexture" in programInfo))
    {console.log("Depth Texture Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.textureBN != null && Model.TextureBN != null)
    {
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, Model.TextureBN);
        gl.uniform1i(programInfo.uniformLocations.textureBN,2);
    }
    else if(("texture3D" in programInfo))
    {console.log("texture3D Uniform Could Not Be Found!")}
    if (programInfo.uniformLocations.texture3D != null && Model.Texture3D != null)
    {
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_3D, Model.Texture3D);
        gl.uniform1i(programInfo.uniformLocations.texture3D,3);
    }
    else if(("texture3D" in programInfo))
    {console.log("texture3D Uniform Could Not Be Found!")}
    if (programInfo.uniformLocations.time != null)
    {
        gl.uniform1f(programInfo.uniformLocations.time, Time);
    }
    else if(("time" in programInfo))
    {console.log("time Uniform Could Not Be Found!")}
    if (programInfo.uniformLocations.normal != null)
    {
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, Model.Normal);
        gl.uniform1i(programInfo.uniformLocations.normal, 4);
    }
    else if(("normal" in programInfo))
    {console.log("normal Uniform Could Not Be Found!")}

    if (programInfo.uniformLocations.displacement != null)
    {
        gl.activeTexture(gl.TEXTURE5);
        gl.bindTexture(gl.TEXTURE_2D, Model.Displacement);
        gl.uniform1i(programInfo.uniformLocations.displacement, 5);

    }
    else if(("displacement" in programInfo))
    {console.log("displacement Uniform Could Not Be Found!")}

    if (programInfo.uniformLocations.resolution != null)
    {
        let Resolution = [Camera.Width, Camera.Height];
        gl.uniform2fv(programInfo.uniformLocations.resolution,Resolution);
    }
    else if(("resolution" in programInfo))
    {console.log("resolution Uniform Could Not Be Found!")}
    if (programInfo.uniformLocations.color != null)
    {
        gl.uniform4fv(programInfo.uniformLocations.color,Model.Color);
    }
    else if(("color" in programInfo))
    {console.log("color Uniform Could Not Be Found!")}
    if (programInfo.uniformLocations.marchOrigin != null)
    {
        gl.uniform3fv(programInfo.uniformLocations.marchOrigin,Model.Position);
    }
    else if(("marchOrigin" in programInfo))
    {console.log("marchOrigin Uniform Could Not Be Found!")}
    if (programInfo.uniformLocations.objectIndex != null)
    {
        gl.uniform1f(programInfo.uniformLocations.objectIndex,Camera.ObjectIndex);
    }
    else if(("objectIndex" in programInfo))
    {console.log("Object Index Uniform Could Not Be Found!")}

    if (programInfo.uniformLocations.textureScale != null)
    {;
        gl.uniform1f(programInfo.uniformLocations.textureScale,Model.TextureScale);
        console.log(Model.TextureScale);
    }
    else if(("textureScale" in programInfo))
    {console.log("textureScale Uniform Could Not Be Found!")}
    
    if (programInfo.uniformLocations.isHover != null)
    {;
        gl.uniform1f(programInfo.uniformLocations.isHover,Model.isHover);
    }
    else if(("isHover" in programInfo))
    {console.log("isHover Uniform Could Not Be Found!")}
    
    if (programInfo.uniformLocations.origin != null)
    {;
        gl.uniform3fv(programInfo.uniformLocations.origin,Model.Origin);
    }
    else if(("origin" in programInfo))
    {console.log("Origin Uniform Could Not Be Found!")}

    if (programInfo.uniformLocations.alpha != null)
    {
        let Alpha = "Alpha" in Model ? Model.Alpha : 1.0;
        gl.uniform1f(programInfo.uniformLocations.alpha, Alpha);
    }
    else if(("alpha" in programInfo))
    {console.log("Alpha Uniform Could Not Be Found!")} //ccVals
 
    if (programInfo.uniformLocations.ccVals != null)
    {
        gl.uniform1fv(programInfo.uniformLocations.ccVals, MidiManager.ccVals);
    }
    else if(("alpha" in programInfo))
    {console.log("Alpha Uniform Could Not Be Found!")} 

    if (programInfo.uniformLocations.uvScale != null)
    {
        gl.uniform2fv(programInfo.uniformLocations.uvScale, Model.uvScale);
    }
    else if(("uvScale" in programInfo))
    {console.log("UVScale Uniform Could Not Be Found!")} 

    if (programInfo.uniformLocations.lifeSpan != null)
    {
        gl.uniform1f(programInfo.uniformLocations.lifeSpan, Model.lifeSpan);
    }
    else if(("lifeSpan" in programInfo))
    {console.log("lifeSpan Uniform Could Not Be Found!")} 

    if (programInfo.uniformLocations.spawnTime != null)
    {
        gl.uniform1f(programInfo.uniformLocations.spawnTime, Model.spawnTime);
    }
    else if(("spawnTime" in programInfo))
    {console.log("spawnTime Uniform Could Not Be Found!")} 

    if (programInfo.uniformLocations.lightness != null)
    {
        gl.uniform1f(programInfo.uniformLocations.lightness, Model.lightness);
    }
    else if(("lightness" in programInfo))
    {console.log("lightness Uniform Could Not Be Found!")} 

    //Post Processing
    if (programInfo.uniformLocations.outlineCol != null)
    {
        gl.uniform3fv(programInfo.uniformLocations.outlineCol, Camera.OutlineCol);
    }
    else if(("OutlineCol" in programInfo))
    {console.log("OutlineCol Uniform Could Not Be Found!")} 

    if (programInfo.uniformLocations.bgCol != null)
    {
        gl.uniform3fv(programInfo.uniformLocations.bgCol, Camera.BGCol);
    }
    else if(("OutlineCol" in programInfo))
    {console.log("OutlineCol Uniform Could Not Be Found!")} 

    if (programInfo.uniformLocations.outlineCutoff != null)
    {
        gl.uniform1f(programInfo.uniformLocations.outlineCutoff, Camera.OutlineCutoff);
    }
    else if(("outlineCutoff" in programInfo))
    {console.log("outlineCutoff Uniform Could Not Be Found!")} 

    if (programInfo.uniformLocations.blurAmount != null)
    {
        gl.uniform1f(programInfo.uniformLocations.blurAmount, Camera.BlurAmount);
    }
    else if(("blurAmount" in programInfo))
    {console.log("blurAmount Uniform Could Not Be Found!")} 

    //==== Bone Uniforms ====
    if (Armature != null)
    { 
        if (programInfo.uniformLocations.boneMatrixColec != null)
        {
        gGL.uniformMatrix4fv(
            programInfo.uniformLocations.boneMatrixColec,
            false,
            Armature.boneMatrixArray,
          );
        }


        if (programInfo.uniformLocations.weightImage2DArray != null)
        {;
            gl.activeTexture(gl.TEXTURE7);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, Armature.weightImage2DArray);
            gl.uniform1i(programInfo.uniformLocations.weightImage2DArray,7);
        }
        else if(("weightImage2DArray" in programInfo))
        {
            console.log("weightImage2DArray uniform couldn't be found")
        }

        if (programInfo.uniformLocations.boneParentIndicies != null)
        {;
            gl.uniform1fv(programInfo.uniformLocations.boneParentIndicies,Armature.boneParentIndicies);
        }
        else if(("boneParentIndicies" in programInfo))
        {console.log("boneParentIndicies Uniform Could Not Be Found!")}

        if (programInfo.uniformLocations.colecItemCount != null)
        {;
            gl.uniform1i(programInfo.uniformLocations.colecItemCount,Armature.boneMatrixColec.length);
        }
        else if(("colecItemCount" in programInfo))
        {console.log("colecItemCount Uniform Could Not Be Found!")}
    
    }
    
    //Three JS BONE SHIT

    if (programInfo.uniformLocations.boneMatrices != null && "Skeleton" in Model)
    {
        gl.uniformMatrix4fv(programInfo.uniformLocations.boneMatrices, false, Model.Skeleton.BoneMatrices);
    }
    else if(("boneMatrices" in programInfo))
    {console.log("boneMatrices Uniform Could Not Be Found!")}

    if (programInfo.uniformLocations.boneParentIndex != null && "Skeleton" in Model)
    {
        gl.uniform1i(programInfo.uniformLocations.boneParentIndex,Model.Skeleton.BoneParentsInd);
    }
    else if(("boneParentIndex" in programInfo))
    {console.log("boneParentIndex Uniform Could Not Be Found!")}

    
}

export function createTexture2DFromBuffer(gl, ImgBuffer, width, height)
{
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,                    // level
        gl.RGBA,              // internal format
        width,
        height,
        0,                    // border
        gl.RGBA,              // format
        gl.UNSIGNED_BYTE,     // type
        ImgBuffer             // data
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    return texture;

}
export function createTexture3DFromBuffer(gl, ImgBuffer, width, height, depth)
{
    const texture = gl.createTexture();
    // gl.disable(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL); // invalid enum
    gl.bindTexture(gl.TEXTURE_3D, texture);
    gl.texImage3D(
        gl.TEXTURE_3D,
        0,                    // level
        gl.RGBA,              // internal format
        width,
        height,
        depth,
        0,                    // border
        gl.RGBA,              // format
        gl.UNSIGNED_BYTE,     // type
        ImgBuffer             // data
    );
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    return texture;

}
export function genFBO(gl, DepthMap, ColorMap = null)
{
    const FBO = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, FBO);  
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, DepthMap, 0);
      if (ColorMap != null)
      {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,ColorMap, 0);
      }
      else
      {
        gl.drawBuffers([gl.NONE]);
      }
      return FBO;
}
export function genDepthMap(gl, width, height)
{
  const DepthMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, DepthMap);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, width, 
      height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); 
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);  
    return DepthMap;
}
export function genEmptyTex(gl, width, height)
{
    const Texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, Texture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,                    // level
        gl.RGBA,              // internal format
        width,
        height,
        0,                    // border
        gl.RGBA,              // format
        gl.UNSIGNED_BYTE,     // type
        null             // data
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return Texture;
}
export function ClearFBO(FBO, gl)
{
    gl.bindFramebuffer(gl.FRAMEBUFFER, FBO);
    gl.clear(gl.DEPTH_BUFFER_BIT); 
    gl.clear(gl.COLOR_BUFFER_BIT);
}

export async function loadShaderFiles(ShaderText, Path)
{
  const ShaderFile = await fetch(Path);
  if (!ShaderFile.ok) throw new Error("Shader File Error Load");
  ShaderText = ShaderFile.text();
  return ShaderText;
}
export function loadShader(gl, type, source) 
{

    const shader = gl.createShader(type);
  
    gl.shaderSource(shader, source);

  
    gl.compileShader(shader);

  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
      );
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
}
export function initShader(gl, vSource, fSource)
{

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

   

    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(shaderProgram));
    }

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
          `Unable to initialize the shader program: ${gl.getProgramInfoLog(
            shaderProgram,
          )}`,
        );
        return null;
      }
    
      return shaderProgram;
    
}

export async function LoadImage(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; 
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            // Flip the image vertically when drawing
            ctx.translate(0, canvas.height);
            ctx.scale(1, -1);
            ctx.drawImage(img, 0, 0);
            
            const pixels = ctx.getImageData(0, 0, img.width, img.height).data;
            
            // Restore transform
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            
            resolve({ pixels: new Uint8Array(pixels.buffer), width: img.width, height: img.height });
        };
        img.onerror = reject;
        img.src = path;
    });
}

export async function CreateImageArray(ImageColec, width, height) {
    const layerCount = ImageColec.length;
    console.log("Layer count is " + layerCount);

    const weightTextureArray = gGL.createTexture();
    gGL.bindTexture(gGL.TEXTURE_2D_ARRAY, weightTextureArray);
    
    gGL.texStorage3D(
        gGL.TEXTURE_2D_ARRAY,
        1,
        gGL.RGBA8,
        width,
        height,
        layerCount
    );
    
    let error = gGL.getError();
    console.log("After texStorage3D error:", error);
    gGL.pixelStorei(gGL.UNPACK_FLIP_Y_WEBGL, false);
    gGL.pixelStorei(gGL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gGL.pixelStorei(gGL.UNPACK_ALIGNMENT, 1);  
    gGL.pixelStorei(gGL.UNPACK_ROW_LENGTH, 0);
    gGL.pixelStorei(gGL.UNPACK_IMAGE_HEIGHT, 0);
    gGL.pixelStorei(gGL.UNPACK_SKIP_PIXELS, 0);
    gGL.pixelStorei(gGL.UNPACK_SKIP_ROWS, 0);
    gGL.pixelStorei(gGL.UNPACK_SKIP_IMAGES, 0);

    for (let i = 0; i < ImageColec.length; i++) {
        
        gGL.texSubImage3D(
            gGL.TEXTURE_2D_ARRAY,
            0,
            0, 0, i,
            width,
            height,
            1,
            gGL.RGBA,
            gGL.UNSIGNED_BYTE,  // For Uint8Array
            ImageColec[i]
        );
        
    }
 
     gGL.texParameteri(gGL.TEXTURE_2D_ARRAY, gGL.TEXTURE_MIN_FILTER, gGL.NEAREST);
    gGL.texParameteri(gGL.TEXTURE_2D_ARRAY, gGL.TEXTURE_MAG_FILTER, gGL.NEAREST);
    gGL.texParameteri(gGL.TEXTURE_2D_ARRAY, gGL.TEXTURE_WRAP_S, gGL.CLAMP_TO_EDGE);
    gGL.texParameteri(gGL.TEXTURE_2D_ARRAY, gGL.TEXTURE_WRAP_T, gGL.CLAMP_TO_EDGE);

    return weightTextureArray;
}


export async function LoadWeightsTXT(Directory, BoneNameColec, Obj)
{
    const promises = BoneNameColec.map((boneName) => 
        fetch(Directory + boneName + ".txt")
        .then((res) => res.text())
        .then((text) => {
        let lines = text.split(/\r?\n/);
        let numlines = lines.map(line => parseFloat(line));
        return numlines
        })
        .catch((e) => {console.error(e); return [];})
    );
    const WeightColec = (await Promise.all(promises));
    if (WeightColec.length <= 0) {console.error("TEXT FILE AT " + Directory + " COULD NOT LOAD!"); return -1;}
    let Rows = WeightColec.length;
    let ActiveInd;
    if (Obj.originalIndicies.length == 0){console.log("INDICIES COLECTION NOT FILLED!");}
    else{console.log("Rows Length is " + Rows + " indicies length is " + Obj.originalIndicies.length)}
    let ReMappedWeightColec = new Array(Rows).fill().map(() => []);
    for (let r = 0; r < Rows; r ++)
    {
        for (let i = 0; i < Obj.originalIndicies.length;  i++)
        {
            ActiveInd = Obj.originalIndicies[i];
            ReMappedWeightColec[r][i] = WeightColec[r][ActiveInd];
        }
    }
    let Cols = ReMappedWeightColec[0].length;
    let WeightsForBuffColec = new Array(6).fill().map(() => []);
    let MaxBoneCount = 24;
    const WeightAttArr = new Array(Rows * Cols);
    let ind = 0;
    for (let c = 0; c < Cols; c++)
    {
        for (let r = 0; r < Rows; r++)
        {
            ind = Math.floor(r / 4.0); 
            WeightsForBuffColec[ind].push(ReMappedWeightColec[r][c]);
        }
        for (let r2 = 0; r2 < MaxBoneCount - Rows; r2 ++)
        {
            ind = Math.floor(((Rows / 4)) + (r2 * .25));
            WeightsForBuffColec[ind].push(-1.0)
        }
    }
    
    return WeightsForBuffColec 
}

export function RemapToInd(Indicies, Array)
{
    let ReMappedArray;
    for (let i = 0; i< Indicies.length; i++)
    {
        let NewIndex = Indicies[i];
        let NewValue = Array[NewIndex - 1];
        ReMappedArray.push(NewValue);
    }
    return ReMappedArray;
}

