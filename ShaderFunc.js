export function SetProgramInfo(GL, ProgramInfoDef, ShaderProgramDef, ProgramInfoFlat, ShaderProgramFlat,
    ProgramInfoCloud, ShaderProgramCloud, ProgramInfoSkybox, ShaderProgramSkybox, 
    ProgramInfoStar, ShaderProgramStar) {
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
        time: GL.getUniformLocation(ShaderProgramSkybox, "Time"),
        inverseViewDir: GL.getUniformLocation(ShaderProgramSkybox, "uInverseViewDir"),
        skybox: GL.getUniformLocation(ShaderProgramSkybox, "uSkybox"),
        texture: GL.getUniformLocation(ShaderProgramCloud, "uTexture"),
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

}
//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
export function loadTexture(gl, url, numChans) {
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
  
      // WebGL1 has different requirements for power of 2 images
      // vs. non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
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
        gl.uniform3fv(programInfo.uniformLocations.objCol, Object.Color);
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
    if (programInfo.uniformLocations.texture != null)
    {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, Object.Texture);
      gl.uniform1i(programInfo.uniformLocations.texture, 0); 
    }
    else if (("texture" in programInfo))
    {console.log("texture Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.depthTexture != null && Object.DepthTexture != null)
    {
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, Object.DepthTexture);
      gl.uniform1i(programInfo.uniformLocations.depthTexture, 2); 
    }
    else if (("depthTexture" in programInfo))
    {console.log("Depth Texture Uniform Could Not Be Found!")};
    if (programInfo.uniformLocations.time != null)
    {
        gl.uniform1f(programInfo.uniformLocations.time, Time);
    }
    else if(("time" in programInfo))
    {console.log("time Uniform Could Not Be Found!")}
    if (programInfo.uniformLocations.texture3D != null && Object.Texture3D != null)
    {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_3D, Object.Texture3D);
        gl.uniform1i(programInfo.uniformLocations.texture3D,1);
    }
    else if(("texture3D" in programInfo))
    {console.log("texture3D Uniform Could Not Be Found!")}
    if (programInfo.uniformLocations.resolution != null)
    {
        let Resolution = [Camera.Width, Camera.Height];
        gl.uniform2fv(programInfo.uniformLocations.resolution,Resolution);
    }
    else if(("resolution" in programInfo))
    {console.log("resolution Uniform Could Not Be Found!")}

    
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
