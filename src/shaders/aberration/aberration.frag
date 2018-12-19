//uniform vec2 resolution;
//uniform sampler2D inputBuffer;

uniform float strength;
uniform vec2 directions[3];



void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	vec4 color = inputColor;

  // RED SHIFT 
  color.r = texture2D(inputBuffer, uv+directions[0]*strength).r;
  
  // GREEN SHIFT
  //color.g = texture2D(inputBuffer, uv+directions[1]*strength).g;
  
  // BLUE SHIFT 
  //color.b = texture2D(inputBuffer, uv+directions[2]*strength).b;

	outputColor = vec4(color.rgb, inputColor.a);
}
