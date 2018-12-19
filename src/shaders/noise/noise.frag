//uniform vec2 resolution;
//uniform sampler2D inputBuffer;

uniform float opacity;



void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	vec4 color = inputColor;

  float r = rand(uv*time/2000.0);

	outputColor = vec4(inputColor.rgb + vec3(r,r,r)*opacity, inputColor.a);
}
