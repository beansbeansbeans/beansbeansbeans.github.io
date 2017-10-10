vec3 k1x = vec3(0.09375, 0.3125, 0.09375);
vec3 k2x = vec3(0., 0., 0.);
vec3 k3x = vec3(-0.09375, -0.3125, -0.09375);

vec3 derivative(vec3 upperLeft, vec3 above, vec3 upperRight, vec3 left, vec3 middle, vec3 right, vec3 lowerLeft, vec3 below, vec3 lowerRight) {

  vec3 convolvedValue = vec3(0., 0., 0.);

  convolvedValue = vec3(
    k1x.x * upperLeft.x + k1x.y * above.x + k1x.z * upperRight.x + k2x.x * left.x + k2x.y * middle.x + k2x.z * right.x + k3x.x * lowerLeft.x + k3x.y * below.x + k3x.z * lowerRight.x,
    k1x.x * upperLeft.y + k1x.y * above.y + k1x.z * upperRight.y + k2x.x * left.y + k2x.y * middle.y + k2x.z * right.y + k3x.x * lowerLeft.y + k3x.y * below.y + k3x.z * lowerRight.y,
    k1x.x * upperLeft.z + k1x.y * above.z + k1x.z * upperRight.z + k2x.x * left.z + k2x.y * middle.z + k2x.z * right.z + k3x.x * lowerLeft.z + k3x.y * below.z + k3x.z * lowerRight.z
    );

  return convolvedValue;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec3 upperLeft = vec3(texture2D(textureColor, vec2(gl_FragCoord.x - 1., gl_FragCoord.y + 1.) / resolution.xy));
  vec3 above = vec3(texture2D(textureColor, vec2(gl_FragCoord.x, gl_FragCoord.y + 1.) / resolution.xy));
  vec3 upperRight = vec3(texture2D(textureColor, vec2(gl_FragCoord.x + 1., gl_FragCoord.y + 1.) / resolution.xy));

  vec3 left = vec3(texture2D(textureColor, vec2(gl_FragCoord.x - 1., gl_FragCoord.y) / resolution.xy));
  vec3 middle = vec3(texture2D(textureColor, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy));
  vec3 right = vec3(texture2D(textureColor, vec2(gl_FragCoord.x + 1., gl_FragCoord.y) / resolution.xy));

  vec3 lowerLeft = vec3(texture2D(textureColor, vec2(gl_FragCoord.x - 1., gl_FragCoord.y - 1.) / resolution.xy));
  vec3 below = vec3(texture2D(textureColor, vec2(gl_FragCoord.x, gl_FragCoord.y - 1.) / resolution.xy));
  vec3 lowerRight = vec3(texture2D(textureColor, vec2(gl_FragCoord.x + 1., gl_FragCoord.y - 1.) / resolution.xy));

  vec3 ux = derivative(
    upperLeft, above, upperRight,
    left, middle, right,
    lowerLeft, below, lowerRight);

  vec4 newColor = vec4(ux, 1.); 
  gl_FragColor = newColor;
}