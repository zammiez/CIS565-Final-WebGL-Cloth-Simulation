var gl, gl_draw_buffers;
var width, height;
var massSpringShader = {};
var particleShader = {};
var renderShader = {};
var ext;

var vaoUpdateID = [];
var vaoRenderID = [];
var vboID_Pos = [];
var vboID_PrePos = [];
var vboIndices;
var texPosID = [];
var texPrePosID = [];

window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
};

(function() {
    'use strict';
	
	var canvas,camera,renderer;
    //var shaderProgram;
	
	var createVBO = function(gl)
	{
		//LATER!!! : X,indices
	    var verts = [
	         0.0,  1.0,  0.0,
	        -1.0, -1.0,  0.0,
	         1.0, -1.0,  0.0
	    ];
	    var indices = [
	         1.0,  1.0,  0.0,
	        -1.0,  1.0,  0.0,
	         1.0, -1.0,  0.0,
	        -1.0, -1.0,  0.0
	    ];
		// VAO : http://blog.tojicode.com/2012/10/oesvertexarrayobject-extension.html
		ext = gl.getExtension("OES_vertex_array_object"); // Vendor prefixes may apply!  
		//1. Generate VAOs
		vaoUpdateID[0] = ext.createVertexArrayOES(); 
		vaoUpdateID[1] = ext.createVertexArrayOES(); 
		vaoRenderID[0] = ext.createVertexArrayOES(); 
		vaoRenderID[1] = ext.createVertexArrayOES();
		
		//2. Generate VBOs
		vboIndices = gl.createBuffer();
		for(var i=0;i<2;i++){
			vboID_Pos[i] = gl.createBuffer();
			vboID_PrePos[i] = gl.createBuffer();
			texPosID[i] = gl.createBuffer();
			texPrePosID[i] = gl.createBuffer();
		}
		
		//3. Set Update VAO
		for(var i=0;i<2;i++){
			ext.bindVertexArrayOES(vaoUpdateID[i]);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vboID_Pos[i]);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW); 
			gl.enableVertexAttribArray(0);
			gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);//? what para... 3 or 4???? really confused.
			//gl.vertexAttribPointer(prog.a_position,3,gl.FLOAT,false,0,0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vboID_PrePos[i]);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW); 
			gl.enableVertexAttribArray(1);
			gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);//? what para: 3 or 4?
			ext.bindVertexArrayOES(null);
		}
		
		//4. Set Render VAO
		for(var i=0;i<2;i++){
			ext.bindVertexArrayOES(vaoRenderID[i]);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vboID_Pos[i]);
			gl.enableVertexAttribArray(0);
			gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);//? what para
			
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vboIndices);
			if(i==0)
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Float32Array(indices),gl.STATIC_DRAW);//???!!! indices
		}
		
		//5. Create Grid VAO/VBO		 
	}	
	
	var InitGL = function()
	{
		function getShader(gl, id) {
	
		    var shaderScript = document.getElementById(id);
		    if (!shaderScript) {
		        return null;
		    }
 
		    var str = "";
		    var k = shaderScript.firstChild;
		    while (k) {
		        if (k.nodeType == 3) {
		            str += k.textContent;
		        }
		        k = k.nextSibling;
		    }

		    var shader;
		    if (shaderScript.type == "x-shader/x-fragment") {
		        shader = gl.createShader(gl.FRAGMENT_SHADER);
		    } else if (shaderScript.type == "x-shader/x-vertex") {
		        shader = gl.createShader(gl.VERTEX_SHADER);
		    } else {
		        return null;
		    }
		    gl.shaderSource(shader, str);
		    gl.compileShader(shader);

		    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		        alert(gl.getShaderInfoLog(shader));
		        return null;
		    }

		    return shader;
		}
		
		var CreateAndLinkProg = function(crntShader,gl,vsid,fsid)
		{
			crntShader.vs = getShader(gl,vsid);//?? Prototype?
			crntShader.fs = getShader(gl,fsid);
			crntShader.prog = gl.createProgram();
			if(crntShader.vs!=null) gl.attachShader(crntShader.prog,crntShader.vs);
			if(crntShader.fs!=null) gl.attachShader(crntShader.prog,crntShader.fs);
			gl.linkProgram(crntShader.prog);
			
		    if (!gl.getProgramParameter(crntShader.prog, gl.LINK_STATUS)) {
		        alert("Could not initialise shaders");
		    }
			return crntShader;
		}
		
		canvas = document.getElementById('canvas');
	    try {
	        gl = canvas.getContext("experimental-webgl");
	        gl.viewportWidth = canvas.width;
	        gl.viewportHeight = canvas.height;
	    } catch (e) {
	    }
	    if (!gl) {
	        alert("Could not initialise WebGL, sorry :-(");
	    }
		
		//4. SetUp
		CreateAndLinkProg(massSpringShader,gl,"massSpring-SpringVP","shader-fs");
	
		gl.useProgram(massSpringShader.prog);
		//!!!???Below Change Later...
		massSpringShader.prog.vertexPositionAttribute = gl.getAttribLocation(massSpringShader.prog, "aVertexPosition");
	    gl.enableVertexAttribArray(massSpringShader.prog.vertexPositionAttribute);
	    massSpringShader.prog.pMatrixUniform = gl.getUniformLocation(massSpringShader.prog, "uPMatrix");
	    massSpringShader.prog.mvMatrixUniform = gl.getUniformLocation(massSpringShader.prog, "uMVMatrix");
		
		createVBO(gl);
		//1. fill in positions
		//2. fill in indices
		//3. disable vsync & setup springs
		//4. Setup	* massSpringShader
		//			* particleShader
		//			* renderShader
		//5. create vbo
		//6. setup transform feedback attributes 
	}
	
	var Simulate = function(shaderProgram) 
	{
		function drawScene() {
			gl.useProgram(shaderProgram);
			
			var mvMatrix = mat4.create();
			var pMatrix = mat4.create();
			
			function setMatrixUniforms(shaderProgram) {
			    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
			    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
			}
			
		    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

		    mat4.identity(mvMatrix);

		    mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
			
			//ext.bindVertexArrayOES(vaoRenderID[0]); 
			ext.bindVertexArrayOES(vaoUpdateID[0]); 
			setMatrixUniforms(shaderProgram);
		    //gl.drawElements(gl.TRIANGLES, 1, gl.UNSIGNED_SHORT, 0);  
			//gl.drawArrays(gl.TRIANGLES, 0, 3);
		    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
			
			//debugger;
			ext.bindVertexArrayOES(null);  
 /*
		    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
		    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		    setMatrixUniforms();
		    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
	*/	
		}
		drawScene();
		//1. Use massSpringShader
		//   Active..Bind..etc
		//	 Begin Transform Feedback
		//		glDarwArrays
		//   End Transform Feedback
		
		//2. Use renderShader
		
		//3. Use particleShader
	}
	
	var OnRender = function()
	{
		//...
		Simulate(massSpringShader.prog);
		//debugger;
		requestAnimationFrame(OnRender);
	}
	
	window.mainInit = function()
	{
		InitGL();
		
	    gl.clearColor(0.0, 0.0, 0.0, 1.0);
	    gl.enable(gl.DEPTH_TEST);
		
		//Simulate(massSpringShader.prog);
		requestAnimationFrame(OnRender);
	}
	
   // window.handle_load.push(mainInit);
})();
