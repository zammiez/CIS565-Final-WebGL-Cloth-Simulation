/**
 * @author mrdoob / http://www.mrdoob.com
 */


var GPGPU2 = function (renderer,cloth_w,cloth_h) {
    var gl = renderer.context;
    var transformFeedback = gl.createTransformFeedback();
    var arrBuffer = new ArrayBuffer(cloth_w * cloth_h * 4 * 4);
    var posData = new Float32Array(cloth_w * cloth_h * 4);
    var prevposData = new Float32Array(cloth_w * cloth_h * 4);
    this.init = function (data)
    {
        posData = new Float32Array(data);
        prevposData = new Float32Array(data);
    }
    this.pass = function (shader, source, target, cfg, usrCtrl) {

        var sourceAttrib = source.attributes['position'];
        if (target.attributes['position'].buffer && sourceAttrib.buffer) {

            //posData = new Float32Array(sourceAttrib.array);
            
            //gl.getBufferSubData(gl.ARRAY_BUFFER,tempData,sourceAttrib.buffer);
            
            shader.bind(posData, prevposData, cfg, usrCtrl);
            prevposData = new Float32Array(posData);

            gl.enableVertexAttribArray(shader.attributes.a_trytry);
            gl.bindBuffer(gl.ARRAY_BUFFER, source.attributes['trytry'].buffer);
            gl.vertexAttribPointer(shader.attributes.a_trytry, 4, gl.FLOAT, false, 16, 0);

            gl.enableVertexAttribArray(shader.attributes.a_position);
            gl.bindBuffer(gl.ARRAY_BUFFER, sourceAttrib.buffer);
            gl.vertexAttribPointer(shader.attributes.a_position, 4, gl.FLOAT, false, 16, 0);

            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, target.attributes['position'].buffer);
            //gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, target.attributes['prev_pos'].buffer);

            gl.enable(gl.RASTERIZER_DISCARD);
            gl.beginTransformFeedback(gl.POINTS);

            gl.drawArrays(gl.POINTS, 0, sourceAttrib.length / sourceAttrib.itemSize);

            gl.endTransformFeedback();
            gl.disable(gl.RASTERIZER_DISCARD);

            // Unbind the transform feedback buffer so subsequent attempts
            // to bind it to ARRAY_BUFFER work.
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);

            gl.bindBuffer(gl.ARRAY_BUFFER, target.attributes['position'].buffer);
            gl.getBufferSubData(gl.ARRAY_BUFFER, 0, arrBuffer);
            posData = new Float32Array(arrBuffer);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            //gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, null);
            //gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, 0);
        }
    };
};

var GPGPU = function (renderer) {

    var camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);

    var scene = new THREE.Scene();

    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1));
    scene.add(mesh);

    var velTexture = new THREE.WebGLRenderTarget(cloth_w, cloth_h, {
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        stencilBuffer: false
    });

    var prevVelTexture = velTexture.clone();

    /*
    this.render = function (_scene, _camera, target) {
        renderer.render(_scene, _camera, target, true);
    };
    */

    this.initVel = function (shader) {
        //Initialze Velocity
        mesh.material = shader.initVelMat;
        renderer.render(scene, camera, velTexture, false);
        renderer.render(scene, camera, prevVelTexture, false);
    };

    this.pass = function (shader, target) {

        //this.initVel(shader);

        shader.setPrevVelocityTexture( prevVelTexture);
        mesh.material = shader.updateVelMat;
        renderer.render(scene, camera, velTexture, false);

        shader.setVelocityTexture(velTexture);
        mesh.material = shader.material;
        renderer.render(scene, camera, target, false);

        var a = velTexture;
        velTexture = prevVelTexture;
        prevVelTexture = a;

        //renderer.render(scene, camera, target, false);
       
    };
    /*
    this.out = function (shader) {
        mesh.material = shader.material;
        renderer.render(scene, camera);
    };
    */
};
