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
    ProgramInfoTrans, ShaderProgramTrans,) {

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
        texture: GL.getUniformLocation(ShaderProgramGlass, "uTexture"),
        normal: GL.getUniformLocation(ShaderProgramGlass, "uNormal"),
        displacement: GL.getUniformLocation(ShaderProgramGlass, "uDisplacement"),
        color: GL.getUniformLocation(ShaderProgramGlass, "objCol"),
        cameraViewDir: GL.getUniformLocation(ShaderProgramGlass, "CameraViewDir"),
        viewPosition: GL.getUniformLocation(ShaderProgramGlass, "viewPos"),
        lightPosition: GL.getUniformLocation(ShaderProgramGlass, "lightPos"),
        lightColor: GL.getUniformLocation(ShaderProgramGlass, "lightColor"),
        lightIntensity: GL.getUniformLocation(ShaderProgramGlass, "lightIntensity"),
        origin: GL.getUniformLocation(ShaderProgramGlass, "Origin"),
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
        texture: GL.getUniformLocation(ShaderProgramScreenRender, "uTexture"),
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
    }



}
//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
export function loadTexture(gl, url, numChans = 4) {
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
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
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
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
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
  export function setPositionAttribute(Object, programInfo, Camera, Light, gl, Time)
{
    
    gl.bindBuffer(gl.ARRAY_BUFFER, Object.vertexBuffer); //Verts
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        3, //num componenets
        gl.FLOAT,
        false, //don't normalize
        0,
        0,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    if ('normalPosition' in programInfo.attribLocations && programInfo.attribLocations.normalPosition >= 0)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, Object.normalBuffer); //Normals
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
        gl.bindBuffer(gl.ARRAY_BUFFER, Object.QuadPosBuffer); //Normals
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
      gl.bindBuffer(gl.ARRAY_BUFFER, Object.textureBuffer); //UV
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
    
    if (programInfo.uniformLocations.lightPosition != null)
    {
        gl.uniform3fv(programInfo.uniformLocations.lightPosition, Light.Pos);
    }
    else if (("lightPosition" in programInfo))
    {console.log("lightPosition Uniform Could Not Be Found!")};
    if (("Color" in Object) && programInfo.uniformLocations.objCol != null)
    {
        gl.uniform4fv(programInfo.uniformLocations.objCol, Object.Color);
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
    if (programInfo.uniformLocations.texture != null && Object.Texture != null)
    {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, Object.Texture);
      gl.uniform1i(programInfo.uniformLocations.texture, 0); 
    }
    else if (("texture" in programInfo))
    {console.log("texture Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.depthTexture != null && Object.DepthTexture != null)
    {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, Object.DepthTexture);
      gl.uniform1i(programInfo.uniformLocations.depthTexture, 1); 
    }
    else if (("depthTexture" in programInfo))
    {console.log("Depth Texture Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.textureBN != null && Object.TextureBN != null)
    {
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, Object.TextureBN);
        gl.uniform1i(programInfo.uniformLocations.texture3D,2);
    }
    else if(("texture3D" in programInfo))
    {console.log("texture3D Uniform Could Not Be Found!")}
    if (programInfo.uniformLocations.texture3D != null && Object.Texture3D != null)
    {
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_3D, Object.Texture3D);
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
        gl.bindTexture(gl.TEXTURE_2D, Object.Normal);
        gl.uniform1i(programInfo.uniformLocations.normal, 4);
    }
    else if(("normal" in programInfo))
    {console.log("normal Uniform Could Not Be Found!")}

    if (programInfo.uniformLocations.displacement != null)
    {
        gl.activeTexture(gl.TEXTURE5);
        gl.bindTexture(gl.TEXTURE_2D, Object.Displacement);
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
        gl.uniform4fv(programInfo.uniformLocations.color,Object.Color);
    }
    else if(("color" in programInfo))
    {console.log("color Uniform Could Not Be Found!")}
    if (programInfo.uniformLocations.origin != null)
    {
        gl.uniform3fv(programInfo.uniformLocations.origin,Object.Position);
    }
    else if(("origin" in programInfo))
    {console.log("origin Uniform Could Not Be Found!")}
    if (programInfo.uniformLocations.objectIndex != null)
    {
        gl.uniform1f(programInfo.uniformLocations.objectIndex,Camera.ObjectIndex);
    }
    else if(("objectIndex" in programInfo))
    {console.log("Object Index Uniform Could Not Be Found!")}

    if (programInfo.uniformLocations.textureScale != null)
    {;
        gl.uniform1f(programInfo.uniformLocations.textureScale,Object.TextureScale);
        console.log(Object.TextureScale);
    }
    else if(("textureScale" in programInfo))
    {console.log("textureScale Uniform Could Not Be Found!")}
    
    if (programInfo.uniformLocations.isHover != null)
    {;
        gl.uniform1f(programInfo.uniformLocations.isHover,Object.isHover);
    }
    else if(("isHover" in programInfo))
    {console.log("isHover Uniform Could Not Be Found!")}


    
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