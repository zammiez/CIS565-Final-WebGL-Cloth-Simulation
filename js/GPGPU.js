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
    this.pass = function (shader, source, target,cfg) {

        var sourceAttrib = source.attributes['position'];
        if (target.attributes['position'].buffer && sourceAttrib.buffer) {

            //posData = new Float32Array(sourceAttrib.array);
            
            //gl.getBufferSubData(gl.ARRAY_BUFFER,tempData,sourceAttrib.buffer);
            shader.bind(posData,prevposData,cfg);
            prevposData = new Float32Array(posData);

            //gl.enableVertexAttribArray(shader.attributes.a_prevpos);
            //gl.bindBuffer(gl.ARRAY_BUFFER, source.attributes['prev_pos'].buffer);
            //gl.vertexAttribPointer(shader.attributes.a_prevpos, 4, gl.FLOAT, false, 16, 0);

            gl.enableVertexAttribArray(shader.attributes.a_position);
            gl.bindBuffer(gl.ARRAY_BUFFER, sourceAttrib.buffer);
            gl.vertexAttribPointer(shader.attributes.a_position, 4, gl.FLOAT, false, 16, 0);


            gl.getBufferSubData(gl.ARRAY_BUFFER, 0, arrBuffer);
            posData = new Float32Array(arrBuffer);

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
            //gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, null);
            //gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, 0);
        }
    };
};
