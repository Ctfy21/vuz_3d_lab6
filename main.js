var vertexShaderSource = `#version 300 es 

in vec4 a_position;

void main() {
    gl_Position = a_position;
}`;

var fragmentShaderSource = `#version 300 es 

precision highp float;

out vec4 outColor;

void main()
{
    outColor = vec4(1, 0, 0.5, 1);
}`;

function createShader(gl, type, source) {
    var shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success){
        return shader
    }

    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader){
    var program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    var success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if(success){
        return program
    }

    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
}

function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

function main(){
    var gl = document.getElementById("canvasWebGL").getContext("webgl2")
    if(!gl){
        console.log("WebGL initializing error")
        return
    }

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    var program = createProgram(gl, vertexShader, fragmentShader)

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position")

    var positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // THREE 2D POINTS
    var positions = [
        0, 0, 
        0, 0.5, 
        0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    var vao = gl.createVertexArray()

    gl.bindVertexArray(vao)

    gl.enableVertexAttribArray(positionAttributeLocation)

    var size = 2
    var type = gl.FLOAT
    var normalize = false
    var stride = 0
    var offset = 0

    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

    resizeCanvasToDisplaySize(gl.canvas)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindVertexArray(vao);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
}

main();