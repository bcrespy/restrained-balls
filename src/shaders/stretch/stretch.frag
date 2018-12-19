//uniform vec2 resolution;
//uniform sampler2D inputBuffer;

uniform vec2 distorsion[10];
uniform float strength;
uniform float appliance;


vec4 invert(in vec4 vect) {
	return vec4(1.0-vect.x, 1.0-vect.y, 1.0-vect.z, 1.0-vect.a);
}


void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	vec4 color = inputColor;

	float x = uv.x * resolution.x;
	float y = uv.y * resolution.y;

	vec4 distColor = vec4(0.0, 0.0, 0.0, 0.0);
	float distStrength = strength / 10.0;


	for (int i = 0; i < 10; i++) {
		distColor+= distStrength * texture2D(inputBuffer, uv+appliance*distorsion[i]);
	}

	color = (1.0-strength)*color+distColor;

	outputColor = vec4(color.rgb, inputColor.a);
}
