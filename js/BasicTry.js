var gl, gl_draw_buffers;
var width, height;

(function() {
    'use strict';
	
	var canvas,camera,renderer;
    var shaderProgram;
	
	var initExtensions = function() {
        var extensions = gl.getSupportedExtensions();
        console.log(extensions);

        var reqd = [
            'OES_texture_float',
            'OES_texture_float_linear',
            'WEBGL_depth_texture',
            'WEBGL_draw_buffers'
        ];
        for (var i = 0; i < reqd.length; i++) {
            var e = reqd[i];
            if (extensions.indexOf(e) < 0) {
                abort('unable to load extension: ' + e);
            }
        }

        gl.getExtension('OES_texture_float');
        gl.getExtension('OES_texture_float_linear');
        gl.getExtension('WEBGL_depth_texture');

        gl_draw_buffers = gl.getExtension('WEBGL_draw_buffers');
        var maxdb = gl.getParameter(gl_draw_buffers.MAX_DRAW_BUFFERS_WEBGL);
        console.log('MAX_DRAW_BUFFERS_WEBGL: ' + maxdb);
    };
	

	
	var InitGL = function()
	{
		canvas = document.getElementById('canvas');
	    renderer = new THREE.WebGLRenderer({
	               canvas: canvas,
	               preserveDrawingBuffer: false
	           });
		gl = renderer.context;
		
		initExtensions();//???_!!!_change to not using renderer later...
        
		camera = new THREE.PerspectiveCamera(
            45,             // Field of view
            canvas.width / canvas.height, // Aspect ratio
            1.0,            // Near plane
            100             // Far plane
        );
        camera.position.set(-15.5, 1, -1);
		
		//1. fill in positions
		//2. fill in indices
		//3. disable vsync & setup springs
		//4. Setup	* massSpringShader
		//			* particleShader
		//			* renderShader
		//5. create vbo
		//6. setup transform feedback attributes 
	}
	
	var Simulate = function() 
	{
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
		Simulate();
	}
	
	var mainInit = function()
	{
		InitGL();
		requestAnimationFrame(OnRender);
	}
	
    window.handle_load.push(mainInit);
})();
