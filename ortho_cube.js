var canvas;
var gl;
var program;
var vertexShader, fragmentShader;
var compiled;

var axis = [1, 1, 0];
var angle = 0;
var angle2 = 0;
var edist = 50;  //11741
var near = -10000;
var left = -100;
var right = 100;
var topp = 100;
var bot = -100;
var far = 10000;

var NumCubeVertices = 36;
var exIndex = 0;
var tri_verts = [];
var tri_colors = [];
var sph_verts = [];
var cnorm_verts = [];
var snorm_verts = [];
var tex_verts = [];
var sun_texture, star_texture;
var planet_textures = [];
var planetNum = 0;
var pn = 0;

var vColor, vPosition, vPos2;
var M_Loc, C_Loc, C_Per;

// all initializations
window.onload = function init() {
  // get canvas handle
  canvas = document.getElementById("gl-canvas");
  
  // WebGL Initialization
  gl = WebGLUtils.setupWebGL(canvas, { preserveDrawingBuffer: true });
  if (!gl) {
    alert("WebGL isn't available");
  }
  gl.clearColor(0.1, 0.1, 0.1, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  // create shaders, compile and link program
  program = createShaders();
  gl.useProgram(program);

  var va = vec4(0.0, 0.0, -1.0, 1);
  var vb = vec4(0.0, 0.942809, 0.333333, 1);
  var vc = vec4(-0.816497, -0.471405, 0.333333, 1); 
  var vd = vec4(0.816497, -0.471405, 0.333333, 1);  
  tetrahedron(va, vb, vc, vd, 3);

  // buffers to hold cube vertices and its colors
  vBuffer = gl.createBuffer();
  cBuffer = gl.createBuffer();
  sBuffer = gl.createBuffer();
  nBuffer = gl.createBuffer();
  tBuffer = gl.createBuffer();

  // allocate space for points
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(tri_colors), gl.STATIC_DRAW);
  vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(snorm_verts), gl.STATIC_DRAW);
  vNormal = gl.getAttribLocation(program, "vNormal");
  gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  gl.bindBuffer(gl.ARRAY_BUFFER, sBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(sph_verts), gl.STATIC_DRAW);
  vPos2 = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPos2, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPos2);

  gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(tex_verts), gl.STATIC_DRAW );
  vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
  gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray(vTexCoord);

  M_Loc = gl.getUniformLocation(program, "modelViewMatrix");
  C_Loc = gl.getUniformLocation(program, "projectionMatrix");

  gl.enable(gl.DEPTH_TEST);

  var lightPosition = vec4(0.0, 0.0, 0.0, 0.0);
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), lightPosition);
  var shininess = 1.0;
  gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);

  window.onkeydown = function(event) {
    var key = String.fromCharCode(event.keyCode);
    switch (key) {
      case "1": // triangle on 1 press
      pn=1;
        break;

      case "2": // strip on 2 press
      pn=2;
        break;
        
      case "3": // strip on 2 press
      pn=3;
        break;

      case "4": // strip on 2 press
      pn=4;
        break;
      
      case "5": // strip on 2 press
      pn=5;
        break;

      case "6": // strip on 2 press
      pn=6;
        break;

      case "7": // strip on 2 press
      pn=7;
        break;

      case "8": // strip on 2 press
      pn=8;
        break;

      case "9": // strip on 2 press
      pn=9;
        break;

      case "0": // strip on 2 press
      pn=0;
        break;
    }
  }

  image = new Image();
  image.crossOrigin = "";
  image.src = "./Textures/sunmap.jpg";
  image.onload = function() {
    sun_texture = configureTexture(image);
    console.log ("Image Size:" + image.width + "," + image.height);
  }

  image2 = new Image();
  image2.src = "./Textures/mercurymap.jpg";
  image2.onload = function() {
    planet_textures.push(configureTexture(image2));
    console.log ("Image Size:" + image2.width + "," + image2.height);
  }

  image3 = new Image();
  image3.src = "./Textures/venusmap.jpg";
  image3.onload = function() {
    planet_textures.push(configureTexture(image3));
    console.log ("Image Size:" + image3.width + "," + image3.height);
  }

  image4 = new Image();
  image4.src = "./Textures/earthmap.jpg";
  image4.onload = function() {
    planet_textures.push(configureTexture(image4));
    console.log ("Image Size:" + image4.width + "," + image4.height);
  }

  image5 = new Image();
  image5.src = "./Textures/marsmap.jpg";
  image5.onload = function() {
    planet_textures.push(configureTexture(image5));
    console.log ("Image Size:" + image5.width + "," + image5.height);
  }

  image10 = new Image();
  image10.src = "./Textures/jupitermap.jpg";
  image10.onload = function() {
    planet_textures.push(configureTexture(image10));
    console.log ("Image Size:" + image10.width + "," + image10.height);
  }

  image6 = new Image();
  image6.src = "./Textures/saturnmap.jpg";
  image6.onload = function() {
    planet_textures.push(configureTexture(image6));
    console.log ("Image Size:" + image6.width + "," + image6.height);
  }

  image7 = new Image();
  image7.src = "./Textures/uranusmap.jpg";
  image7.onload = function() {
    planet_textures.push(configureTexture(image7));
    console.log ("Image Size:" + image7.width + "," + image7.height);
  }

  image8 = new Image();
  image8.src = "./Textures/neptunemap.jpg";
  image8.onload = function() {
    planet_textures.push(configureTexture(image8));
    console.log ("Image Size:" + image8.width + "," + image8.height);
  }
  
  image9 = new Image();
  image9.src = "./Textures/plutomap.jpg";
  image9.onload = function() {
    planet_textures.push(configureTexture(image9));
    console.log ("Image Size:" + image9.width + "," + image9.height);
  }
  
  render();
};

// all drawing is performed here
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  zoom = parseInt(document.getElementById("zoom").value);
  speed = parseInt(document.getElementById("speed").value);

  var M_sun, M_camera;
  angle += .05*speed;
  angle2 = angle*10;
  var rot = rotation4x4(angle/2, "y");

  M_camera = createOrtho(zoom * -1, zoom, zoom, zoom * -1, far, near);
  var tem = lookAt(axis, [0,0,0], [0,1,0]);
  M_camera = matMult4(M_camera, tem);
  gl.uniformMatrix4fv(C_Loc, false, flatten(transpose4x4(M_camera))); 

  var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
  var lightDiffuse = vec4(0.0, 0.0, 0.0, 1.0);
  var lightSpecular = vec4(0.0, 0.0, 0.0, 1.0);
  var materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
  var materialDiffuse = vec4(0.0, 0.0, 0.0, 1.0);
  var materialSpecular = vec4(0.0, 0.0, 0.0, 1.0);
  ambientProduct = mult(lightAmbient, materialAmbient);
  gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
  specularProduct = mult(lightSpecular, materialSpecular);  
  gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));

  switch (pn) {
    case 1: // triangle on 1 press
    drawPlanet(2*.383, 0, 58.8, 1000, pn-1);
      break;

    case 2: // strip on 2 press
    drawPlanet(2*.949, 0, -244, 1000, pn-1);
      break;
      
    case 3: // strip on 2 press
    drawPlanet(2*1, 0, 1, 1000, pn-1);
      break;

    case 4: // strip on 2 press
    drawPlanet(2*.532, 0, 1.03, 1000, pn-1);
      break;
    
    case 5: // strip on 2 press
    drawPlanet(2*11.21, 0, .415, 1000, pn-1);
      break;

    case 6: // strip on 2 press
    drawPlanet(2*9.45, 0, .445, 1000, pn-1);
    drawRing(4*9.45, 0, .445, 1000, pn-1);
      break;

    case 7: // strip on 2 press
    drawPlanet(2*4.01, 0, -.72, 1000, pn-1);
      break;

    case 8: // strip on 2 press
    drawPlanet(2*3.88, 0, .673, 1000, pn-1);
      break;

    case 9: // strip on 2 press
    drawPlanet(2*.186, 0, 6.41, 1000, pn-1);
      break;

    case 0: // strip on 2 press
    lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
    lightDiffuse = vec4(0.2, 0.2, 0.2, 1.0);
    lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
    materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
    materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
    materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
 
    ambientProduct = mult(lightAmbient, materialAmbient);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    specularProduct = mult(lightSpecular, materialSpecular);  
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    M_sun = scale4x4(5,5,5)
    M_sun = matMult4(M_sun, rot);
    gl.uniformMatrix4fv(M_Loc, false, flatten(transpose4x4(M_sun)));
    gl.bindTexture(gl.TEXTURE_2D, sun_texture);

    gl.drawArrays(gl.TRIANGLES, 0, exIndex);
    drawPlanet(.383, edist*.387, 58.8, .241, 0);    // mercury
    drawPlanet(.949, edist*.723, -244, .615, 1);    // venus
    drawPlanet(1, edist, 1, 1, 2);                  // earth
    drawPlanet(.532, edist*1.52, 1.03, 1.88, 3);    // mars
    drawPlanet(11.21, edist*5.2, .415, 11.9, 4);    // jupiter
    drawPlanet(9.45, edist*9.58, .445, 29.4, 5);    // saturn
    drawRing(19, edist*9.58, .445, 29.4, 5);
    drawPlanet(4.01, edist*19.2, -.72, 83.7, 6);    // uranus
    drawPlanet(3.88, edist*30.05, .673, 163.7, 7);  // neptune
    drawPlanet(.186, edist*39.48, 6.41, 247.9, 8);
      break;
  }
  
  requestAnimFrame(render);
}

function lookAt( eye, at, up )
{
    if ( !Array.isArray(eye) || eye.length != 3) {
        throw "lookAt(): first parameter [eye] must be an a vec3";
    }

    if ( !Array.isArray(at) || at.length != 3) {
        throw "lookAt(): first parameter [at] must be an a vec3";
    }

    if ( !Array.isArray(up) || up.length != 3) {
        throw "lookAt(): first parameter [up] must be an a vec3";
    }

    if ( equal(eye, at) ) {
        return mat4();
    }

    var v = normalize( subtract(at, eye) );  // view direction vector
    var n = normalize( cross(v, up) );       // perpendicular vector
    var u = normalize( cross(n, v) );        // "new" up vector

    v = negate( v );

    var result = mat4(
        vec4( n, -dot(n, eye) ),
        vec4( u, -dot(u, eye) ),
        vec4( v, -dot(v, eye) ),
        vec4()
    );

    return result;
}

function createOrtho(l, r, t, b, f, n) {
  var M = identity4();

  M[0][0] = 2 / (r - l);
  M[1][1] = 2 / (t - b);
  M[2][2] = -2 / (f - n);

  M[3][0] = -(r + l) / (r - l);
  M[3][1] = -(t + b) / (t - b);
  M[3][2] = -(f + n) / (f - n);
  M[3][3] = 1;

  return M;
}

function createPersp(l, r, t, b, f, n){
  var M = identity4();

  M[0][0] = 2*n/(r-l);
  M[1][1] = 2*n/(t- b);

  M[2][2] = -(f + n) / (f - n); 
  M[2][3] = -(2*f*n) / (f-n)
  
  M[3][2] = -1;
  M[3][3] = 0;

  return M;
}

function tetrahedron(a, b, c, d, n){
  divideTriangle(a, b, c, n);
  divideTriangle(d, c, b, n);
  divideTriangle(a, d, b, n);
  divideTriangle(a, c, d, n);
}

function divideTriangle(a, b, c, count){
  if (count > 0) {
    var ab = normalize(mix(a, b, 0.5), true);
    var ac = normalize(mix(a, c, 0.5), true);
    var bc = normalize(mix(b, c, 0.5), true);

    divideTriangle(a, ab, ac, count-1);
    divideTriangle(ab, b, bc, count-1);
    divideTriangle(bc, c, ac, count-1);
    divideTriangle(ab, bc, ac, count-1);
  } else {
    triangle(a, b, c);
  }
}

function triangle(a, b, c){
  var u,v;

  sph_verts.push(a);
  sph_verts.push(b);
  sph_verts.push(c);
  
  snorm_verts.push(a);
  snorm_verts.push(b);
  snorm_verts.push(c);   

  tex_verts.push(uvMap(a[0],a[1],a[2]));
  tex_verts.push(uvMap(b[0],b[1],b[2]));
  tex_verts.push(uvMap(c[0],c[1],c[2]));

  exIndex+=3;
}

function drawPlanet(s,di,dl,yl,i){
  M = identity4();
  scale = scale4x4(s,s,s);
  trans = transl4x4(di, 0, 0);
  rot = rotation4x4(angle/yl,"y");
  M = matMult4(M, rot);
  M = matMult4(M, trans);
  M = matMult4(M, scale);
  rot = rotation4x4(angle2/dl,"y");
  M = matMult4(M, rot);
  gl.uniformMatrix4fv(M_Loc, false, flatten(transpose4x4(M)));
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture( gl.TEXTURE_2D, planet_textures[i]);
  gl.drawArrays(gl.TRIANGLES, 0, exIndex);
}

function drawRing(s,di,dl,yl,i){
  M = identity4();
  scale = scale4x4(s,.5,s);
  trans = transl4x4(di, 0, 0);
  rot = rotation4x4(angle/yl,"y");
  M = matMult4(M, rot);
  M = matMult4(M, trans);
  M = matMult4(M, scale);
  rot = rotation4x4(angle2/(dl*15),"y");
  M = matMult4(M, rot);
  gl.uniformMatrix4fv(M_Loc, false, flatten(transpose4x4(M)));
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture( gl.TEXTURE_2D, planet_textures[4]);
  gl.drawArrays(gl.TRIANGLES, 0, exIndex);
}

function uvMap(dx,dy,dz){
  var u,v;

  u = 0.5 + (Math.atan2(dz,dx)/(2*Math.PI));
  v = 0.5 - (Math.asin(dy)/Math.PI);

  return [u,v];
}

// function that does all shader initializations and
// returns the compiled shader program
function createShaders() {
  // Create program object
  program = gl.createProgram();

  //  Load vertex shader
  vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, myVertexShader);
  gl.compileShader(vertexShader);
  gl.attachShader(program, vertexShader);
  compiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
  if (!compiled) {
    console.error(gl.getShaderInfoLog(vertexShader));
  }

  //  Load fragment shader
  fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, myFragmentShader);
  gl.compileShader(fragmentShader);
  gl.attachShader(program, fragmentShader);
  compiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
  if (!compiled) {
    console.error(gl.getShaderInfoLog(fragmentShader));
  }

  //  Link program
  gl.linkProgram(program);
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    console.error(gl.getProgramInfoLog(program));
  }
  return program;
}

function identity4() {
  var m = [];
  m = [
    [1.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0],
    [0.0, 0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0, 1.0]
  ];

  return m;
}
function transpose4x4(m) {
  var result = [];

  result.push([m[0][0], m[1][0], m[2][0], m[3][0]]);
  result.push([m[0][1], m[1][1], m[2][1], m[3][1]]);
  result.push([m[0][2], m[1][2], m[2][2], m[3][2]]);
  result.push([m[0][3], m[1][3], m[2][3], m[3][3]]);

  return result;
}

function configureTexture( image ) {
  texture = gl.createTexture();
  gl.bindTexture( gl.TEXTURE_2D, texture);
//	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 
       gl.RGB, gl.UNSIGNED_BYTE, image );
  gl.generateMipmap( gl.TEXTURE_2D );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                    gl.NEAREST_MIPMAP_LINEAR );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

return texture;
}