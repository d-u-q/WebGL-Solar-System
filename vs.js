var myVertexShader = `
	
	attribute vec4 vPosition;
	attribute vec4 vNormal; 
	attribute vec4 vColor;
	attribute vec2 vTexCoord;
	varying vec3 N, L, E;
	uniform mat4 modelViewMatrix;
  	uniform mat4 projectionMatrix;
	uniform vec4 lightPosition;
	
	varying vec4 fColor;
	varying highp vec2 fTexCoord;

	void main() {
		vec3 pos = -(modelViewMatrix * vPosition).xyz;
	  	vec3 light = lightPosition.xyz;
	   	L = normalize(light - pos);
		E = -pos;
		N = normalize((modelViewMatrix * vNormal).xyz);
		
		gl_Position = projectionMatrix * modelViewMatrix * vPosition;
		fColor = vColor;
		fTexCoord = vTexCoord;
}
		
`;
