/**
 * @author mrdoob / http://www.mrdoob.com
 */

function simulationCommon() {
    //UBO:
    //http://www.opentk.com/node/2926
    return [
        //'layout(std140) uniform u_tryUBO{',
        //'   vec4 uboTry1;',
        //'   vec4 uboTry2;',
        //'};',
        'uniform float u_timer;',
        'uniform float u_clothWidth;',
        'uniform float u_clothHeight;',
        'uniform float u_wind;',
        //'uniform float mass;',
        'uniform vec2 Str;',
        'uniform vec2 Shr;',
        'uniform vec2 Bnd;',
        'uniform vec4 u_pins;',
        'uniform vec4 u_newPinPos;',

        'uniform sampler2D u_texPos;',
        'uniform sampler2D u_texPrevPos;',
        'float DAMPING = -0.0125;',
        'void sphereCollision(inout vec3 x, vec3 center, float r)',
        '{',
        'r *= 1.01;',
	    'vec3 delta = x - center;',
        'float dist = length(delta);',
        'if (dist < r) {',
        '   x = center + delta*(r / dist);',
        '}',
    '} ',
        'vec2 getNeighbor(int n, out float ks, out float kd)',
        '{',
            //structural springs (adjacent neighbors)
      '	    if (n < 4){ ks = Str[0]; kd = Str[1]; }',	//ksStr, kdStr
      '     if (n == 0)	return vec2(1.0, 0.0);',
      '	    if (n == 1)	return vec2(0.0, -1.0);',
      '	    if (n == 2)	return vec2(-1.0, 0.0);',
      ' 	if (n == 3)	return vec2(0.0, 1.0);',
            //shear springs (diagonal neighbors)
      '     if (n<8) { ks = Shr[0]; kd = Shr[1]; } ',//ksShr,kdShr
      '     if (n == 4) return vec2(1.0, -1.0);',
      '     if (n == 5) return vec2(-1.0, -1.0);',
      '     if (n == 6) return vec2(-1.0, 1.0);',
      '     if (n == 7) return vec2(1.0, 1.0);',
            //bend spring (adjacent neighbors 1 node away)                  //(TODO: far neighbor)
      '     if (n<12) { ks =Bnd[0]; kd = Bnd[1]; }', //ksBnd,kdBnd
      '     if (n == 8)	return vec2(2.0, 0.0);',
      '     if (n == 9) return vec2(0.0, -2.0);',
      '     if (n == 10) return vec2(-2.0, 0.0);',
      '     if (n == 11) return vec2(0.0, 2.0);',
                  //bend spring (adjacent neighbors 1 node away)                  //(TODO: far neighbor)
      '     if (n<16) { ks =Bnd[0]; kd = Bnd[1]; }', //ksBnd,kdBnd
      '     if (n == 12)	return vec2(15.0, 0.0);',
      '     if (n == 13) return vec2(0.0, -15.0);',
      '     if (n == 14) return vec2(-15.0, 0.0);',
      '     if (n == 15) return vec2(0.0, 15.0);',
      '     return vec2(0.0,0.0);',
      '}',

      'vec4 runSimulation(vec4 pos,float v_id) {',
      //'float mass = 0.5;',
      'float xid = float( int(v_id)/int(u_clothWidth));',
      'float yid = v_id - u_clothWidth*xid;',
      //'if(u_newPinPos.w>=1.0 && length(pos.xyz-u_newPinPos.xyz)<0.3 ) pos.w=0.0;',
      //'if(u_newPinPos.w>=1.0 && u_newPinPos.x == v_id ) pos.w=0.0;',
      'bool pinBoolean = (pos.w<=0.0);',//Pin1
      'if(!pinBoolean) {',
      ' pinBoolean = (xid<=1.0)&&(yid<=1.0)&&(u_pins.x>0.0);',
      ' if(u_newPinPos.w==1.0&&pinBoolean) pos.xyz = u_newPinPos.xyz;',
      '}',
      'if(!pinBoolean) pinBoolean = (xid>=u_clothWidth-2.0)&&(yid<=1.0)&&(u_pins.y>0.0);',//Pin2
      'if(!pinBoolean) pinBoolean = (xid<=1.0)&&(yid>=u_clothWidth-2.0)&&(u_pins.z>0.0);',//Pin3
      'if(!pinBoolean) pinBoolean = (xid>=u_clothWidth-2.0)&&(yid>=u_clothWidth-2.0)&&(u_pins.w>0.0);',//Pin4
      'if(pinBoolean) return pos;',
      'vec2 coord;',
      'coord = vec2(yid,u_clothWidth-1.0-xid)*(1.0/u_clothWidth);',
      'float timestep = u_timer;',
      ' vec4 texPos = texture(u_texPos,coord);',
      ' vec4 texPrevPos = texture(u_texPrevPos,coord);',
      'vec3 F = vec3(0.0);',
      //'F.y = -9.8*mass;',
      'F.y = -9.8*pos.w;',
      //'F.y = -0.0*pos.w;',
      ' vec3 vel = (texPos.xyz-texPrevPos.xyz)/timestep;',
      'F+=DAMPING*vel;',
      'F.x+=u_wind*0.3;',
      'F.z+=u_wind*0.7;',

      'float ks, kd;',

      'for (int k = 0; k < 12; k++)',
      '{',
      '	vec2 nCoord = getNeighbor(k, ks, kd);',

      '	float inv_cloth_size = 1.0 / (u_clothWidth);//size of a single patch in world space',
      '	float rest_length = length(nCoord*inv_cloth_size);',

      '	float nxid = xid + nCoord.x;',
      '	float nyid = yid + nCoord.y;',
      '	if (nxid < 0.0 || nxid>(u_clothWidth-1.0) || nyid<0.0 || nyid>(u_clothWidth-1.0)) continue;',
      '	nCoord = vec2(nyid,u_clothWidth-1.0-nxid) / u_clothWidth;',
      '	vec3 posNP = texture(u_texPos, nCoord).xyz;',
      '	vec3 prevNP = texture(u_texPrevPos, nCoord).xyz;',

      '	vec3 v2 = (posNP - prevNP) / timestep;',
      '	vec3 deltaP = pos.xyz - posNP;',
      '	vec3 deltaV = vel - v2;',
      '	float dist = length(deltaP);',
      '	float   leftTerm = -ks * (dist - rest_length);',
      '	float  rightTerm = kd * (dot(deltaV, deltaP) / dist);',
      '	vec3 springForce = (leftTerm + rightTerm)* normalize(deltaP);',
      '	F += springForce;',
      '};',

      'vec3 acc = F/pos.w;', // acc = F/m
      'vel = vel+ acc*timestep;',//v = v0+a*t

      'if(pinBoolean); else pos.xyz += vel*timestep;',
      //'if(pos.y<-3.0) pos.y = -3.0;',//ground
      'sphereCollision(pos.xyz,vec3(0.5,0.45,0.4),0.3);',
      //'if(pos.xyz == texPos.xyz) pos.y+=0.01;else pos.y = texPos.y+0.01;',
      //'pos.x+=0.01;',
    '  return pos;',
      '}',
    ].join('\n');
}
GPGPU2.SimulationShader2 = function (renderer,c_w,c_h) {
  var gl = renderer.context;

  var attributes = {
      a_position: 0,
      a_trytry: 1,
  };

  function createProgram () {

      //Sadly, it seems that WebGL doesn't support gl_VertexID.... T^T
      //http://max-limper.de/tech/batchedrendering.html

      //well....uniform block..
      //https://www.opengl.org/wiki/Interface_Block_(GLSL)
    var vertexShader = gl.createShader( gl.VERTEX_SHADER );
    var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );

    gl.shaderSource(vertexShader, [
       '#version 300 es',
       // '#extension GL_ARB_explicit_attrib_location : require',
       // '#extension GL_ARB_explicit_uniform_location : require',
        'precision ' + renderer.getPrecision() + ' float;',
        //'precision highp float;',
        //'precision mediump float;',
      'in vec4 a_position;',
      'in vec4 a_trytry;',

      'out vec4 v_prevpos;',
      simulationCommon(),

      'void main() {',
      '  vec4 pos = a_position;',
      //'float vid = pos.w;',
      '  v_prevpos = pos;',
      //' pos = runSimulation(pos,vid);',
      ' pos = runSimulation(pos,a_trytry.x);',
     '  // Write new position out',
     '  gl_Position =vec4(pos.xyz,pos.w);',
      '}'
    ].join('\n'));

    gl.shaderSource(fragmentShader, [
      '#version 300 es',
      'precision ' + renderer.getPrecision() + ' float;',
      //'precision highp float;',
      //'precision mediump float;',
      'in vec4 v_prevpos;',
      'void main() {',
        //'gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);',??????
      '}'
    ].join('\n'));

    gl.compileShader( vertexShader );
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error("Shader failed to compile", gl.getShaderInfoLog( vertexShader ));
      return null;
    }

    gl.compileShader( fragmentShader );
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error("Shader failed to compile", gl.getShaderInfoLog( fragmentShader ));
      return null;
    }

    var program = gl.createProgram();

    gl.attachShader( program, vertexShader );
    gl.attachShader( program, fragmentShader );

    gl.deleteShader( vertexShader );
    gl.deleteShader( fragmentShader );

    for (var i in attributes) {
      gl.bindAttribLocation( program, attributes[i], i );
    }
    var maxSepTrans = gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS);

    gl.transformFeedbackVaryings(program, ["gl_Position"], gl.SEPARATE_ATTRIBS);

    gl.linkProgram( program );

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Shader program failed to link", gl.getProgramInfoLog( program ));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  };

  var program = createProgram();

  if (!program) {
    return null;
  }

  var uniforms = {};
  var count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (var i = 0; i < count; i++) {
      uniform = gl.getActiveUniform(program, i);
      name = uniform.name.replace("[0]", "");
      uniforms[name] = gl.getUniformLocation(program, name);
  }

  var timerValue = 0;
  var cWidth = c_w;
  var cHeight = c_h;

  return {
    program: program,

    attributes: attributes,

    bind: function (tempData, prevData, cfg, usrCtrl) {
        //!!! VBO -> Texture ?????
        //http://stackoverflow.com/questions/17262574/packing-vertex-data-into-a-webgl-texture
        //TODO: don't need to re-create texture every frame.....put those into init
        gl.useProgram(program);

        var tempTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tempTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, cWidth, cHeight, 0, gl.RGBA, gl.FLOAT, new Float32Array(tempData));
        gl.bindTexture(gl.TEXTURE_2D, null);

        var tempPrevTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tempPrevTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, cWidth, cHeight, 0, gl.RGBA, gl.FLOAT, new Float32Array(prevData));
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tempTexture);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, tempPrevTexture);

        gl.uniform1i(uniforms.u_texPos, 0);
        gl.uniform1i(uniforms.u_texPrevPos, 1);

        //gl.uniform1f(uniforms.u_timer, 0.003);
        gl.uniform1f(uniforms.u_timer, cfg.getTimeStep());
        gl.uniform1f(uniforms.u_clothWidth, cWidth);
        gl.uniform1f(uniforms.u_clothHeight, cHeight);
        gl.uniform1f(uniforms.u_wind, cfg.getWindForce());

        //gl.uniform1f(uniforms.mass, 0.1);
        gl.uniform2f(uniforms.Str, cfg.getKsString(), -cfg.getKdString());
        gl.uniform2f(uniforms.Shr, cfg.getKsShear(), -cfg.getKdShear());
        gl.uniform2f(uniforms.Bnd, cfg.getKsBend(), -cfg.getKdBend());
        
        gl.uniform4f(uniforms.u_pins, cfg.getPin1(), cfg.getPin2(), cfg.getPin3(), cfg.getPin4());
        gl.uniform4f(uniforms.u_newPinPos, usrCtrl.uniformPins[0], usrCtrl.uniformPins[1], usrCtrl.uniformPins[2], usrCtrl.uniformPins[3]);
        /*
        //UBO:
        //https://www.packtpub.com/books/content/opengl-40-using-uniform-blocks-and-uniform-buffer-objects
        //1. get index of uniform block
        var blockIdx = gl.getUniformBlockIndex(program, "u_tryUBO");
        //2. allocate space for buffer
        var blockSize = gl.getActiveUniformBlockParameter(program, blockIdx, gl.UNIFORM_BLOCK_DATA_SIZE);
        var blockBuffer = gl.createBuffer();
        //3. Query for the offset of each variable within the block
        var names = ["uboTry1", "uboTry2"];
            //var indices = new Int16Array(2);
        var indices = gl.getUniformIndices(program, names);
        var offset = gl.getActiveUniforms(program, indices, gl.UNIFORM_OFFSET);
        debugger;
        //4. Place the data into buffer
        var try1 = [0.1, 0.2, 0.3, 0.4];
        var try2 = [0.5, 0.6, 0.7, 0.8];
        //5. Create the OpenGL buffer object and copy data into it
        //6. bind the buffer object to the uniform block
        
            'layout (std140) uniform u_tryUBO{',
            '   vec4 uboTry1;',
            '   vec4 uboTry2;',
            '};',
        */
    },

    setTimer: function ( timer ) {
      timerValue = timer;
    },


  }

};


GPGPU.SimulationShader = function (maxColliders) {

    if (!maxColliders) maxColliders = 8;

    var material = new THREE.ShaderMaterial({
        uniforms: {
            tPrevPos: { type: "t", value: texture },
            tPositions: { type: "t", value: texture },
            origin: { type: "t", value: texture },
            timer: { type: "f", value: 0 },
            isStart: { type: "i", value: 1 },
        },

        vertexShader: [
          'varying vec2 vUv;',

          'void main() {',
          '  vUv = vec2(uv.x, 1.0 - uv.y);',
          '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
          '}',
        ].join('\n'),

        fragmentShader: [
          'varying vec2 vUv;',

          'uniform sampler2D tPrevPos;',
          'uniform sampler2D tPositions;',
          'uniform sampler2D origin;',
          'uniform float timer;',
          'uniform int isStart;',

          'void main() {',
          '  vec4 pos = texture2D( tPositions, vUv );',
          '  vec4 prevpos = texture2D( tPrevPos, vUv );',

          'vec3 vel = pos.xyz-prevpos.xyz;',
          //'  pos.w = 0.0;',
          'vec3 F = vec3(0.0,9.8*0.1,0.0);',//later: mass

          'if(isStart==1)',
          '     pos = vec4(texture2D( origin, vUv ).xyz, 0.0);',
          'else {',
          '     vel.y-=9.8*0.01;',
          '     pos.y+=0.01*vel.y;',
          '};',
          '  // Write new position out',
          '  gl_FragColor = pos;',
          '}',
        ].join('\n'),
    });

    return {

        material: material,

        setPositionsTexture: function (positions) {

            material.uniforms.tPositions.value = positions;

            return this;

        },

        setPrevPosTexture: function (positions) {

            material.uniforms.tPrevPos.value = positions;

            return this;

        },
        setOriginsTexture: function (origins) {

            material.uniforms.origin.value = origins;
            return this;
        },

        setTimer: function (timer) {

            material.uniforms.timer.value = timer;

            return this;

        },
        
        setStart: function (isStart) {

            material.uniforms.isStart.value = isStart;

        return this;

    }
    }

};
