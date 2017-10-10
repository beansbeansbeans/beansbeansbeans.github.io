vec3 k1y = vec3(0.09375, 0., -0.09375);
vec3 k2y = vec3(0.3125, 0., -0.3125);
vec3 k3y = vec3(0.09375, 0., -0.09375);

vec3 derivative(vec3 upperLeft, vec3 above, vec3 upperRight, vec3 left, vec3 middle, vec3 right, vec3 lowerLeft, vec3 below, vec3 lowerRight) {

  vec3 convolvedValue = vec3(0., 0., 0.);

  convolvedValue = vec3(
    k1y.x * upperLeft.x + k1y.y * above.x + k1y.z * upperRight.x + k2y.x * left.x + k2y.y * middle.x + k2y.z * right.x + k3y.x * lowerLeft.x + k3y.y * below.x + k3y.z * lowerRight.x,
    k1y.x * upperLeft.y + k1y.y * above.y + k1y.z * upperRight.y + k2y.x * left.y + k2y.y * middle.y + k2y.z * right.y + k3y.x * lowerLeft.y + k3y.y * below.y + k3y.z * lowerRight.y,
    k1y.x * upperLeft.z + k1y.y * above.z + k1y.z * upperRight.z + k2y.x * left.z + k2y.y * middle.z + k2y.z * right.z + k3y.x * lowerLeft.z + k3y.y * below.z + k3y.z * lowerRight.z
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

  vec3 uy = derivative(
    upperLeft, above, upperRight,
    left, middle, right,
    lowerLeft, below, lowerRight);

  vec4 newColor = vec4(uy, 1.); 
  gl_FragColor = newColor;
}