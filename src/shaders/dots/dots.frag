//uniform vec2 resolution;

uniform float pointSize;
uniform float gap;
uniform bool inverted;
uniform bool invertAll;
uniform float greyscale;
uniform float contrast;


vec4 invert (in vec4 vect) {
	return vec4(1.0-vect.x, 1.0-vect.y, 1.0-vect.z, 1.0-vect.a);
}

vec4 greyscaleF (in vec4 color) {
	float gs = (color.r+color.g+color.b)/3.0;
	return vec4(gs, gs, gs, color.a);
}


void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	vec4 color = inputColor;

	float x = uv.x * resolution.x;
	float y = uv.y * resolution.y;

	if (mod(x, gap+pointSize) < pointSize && x > gap && x < resolution.x-gap
		&& mod(y, gap+pointSize) < pointSize && y > gap && y < resolution.y-gap) {
		color= invert(color);
	}

	if (inverted && x > resolution.x/2.0 - 200.0 && x < resolution.x/2.0 + 200.0
	  && y > resolution.y/2.0 - 20.0 && y < resolution.y/2.0 + 20.0) {
		color = invert(color);
	}

	if (invertAll) {
		color = invert(color);
	}

	vec4 grey = greyscaleF(color);

	color = mix(color, grey, greyscale);

	color = color * contrast;

	outputColor = vec4(color.rgb, inputColor.a);
}
