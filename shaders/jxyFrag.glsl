vec3 k1 = vec3(0.0751136079541115, 0.123841403152974, 0.0751136079541115);
vec3 k2 = vec3(0.123841403152974, 0.20417995557165813, 0.123841403152974);
vec3 k3 = vec3(0.0751136079541115, 0.123841403152974, 0.0751136079541115);

float imfilter(vec3 row1, vec3 row2, vec3 row3) {
  float convolvedValue = 0.;

  for(int i=0; i<3; i++) {
    convolvedValue += row1[i] * k1[i];
  }

  for(int i=0; i<3; i++) {
    convolvedValue += row2[i] * k2[i];
  }

  for(int i=0; i<3; i++) {
    convolvedValue += row3[i] * k3[i];
  }

  return convolvedValue;
}

void main() {
  vec4 upperLeftRawX = texture2D(textureUx, vec2(gl_FragCoord.x - 1., gl_FragCoord.y + 1.) / resolution.xy);
  vec4 upperLeftRawY = texture2D(textureUy, vec2(gl_FragCoord.x - 1., gl_FragCoord.y + 1.) / resolution.xy);
  float upperLeft = (upperLeftRawX.x * upperLeftRawY.x + upperLeftRawX.y * upperLeftRawY.y + upperLeftRawX.z * upperLeftRawY.z) / 3.;

  vec4 aboveRawX = texture2D(textureUx, vec2(gl_FragCoord.x, gl_FragCoord.y + 1.) / resolution.xy);
  vec4 aboveRawY = texture2D(textureUy, vec2(gl_FragCoord.x, gl_FragCoord.y + 1.) / resolution.xy);
  float above = (aboveRawX.x * aboveRawY.x + aboveRawX.y * aboveRawY.y + aboveRawX.z * aboveRawY.z) / 3.;

  vec4 upperRightRawX = texture2D(textureUx, vec2(gl_FragCoord.x + 1., gl_FragCoord.y + 1.) / resolution.xy);
  vec4 upperRightRawY = texture2D(textureUy, vec2(gl_FragCoord.x + 1., gl_FragCoord.y + 1.) / resolution.xy);
  float upperRight = (upperRightRawX.x * upperRightRawY.x + upperRightRawX.y * upperRightRawY.y + upperRightRawX.z * upperRightRawY.z) / 3.;

  vec4 leftRawX = texture2D(textureUx, vec2(gl_FragCoord.x - 1., gl_FragCoord.y) / resolution.xy);
  vec4 leftRawY = texture2D(textureUy, vec2(gl_FragCoord.x - 1., gl_FragCoord.y) / resolution.xy);
  float left = (leftRawX.x * leftRawY.x + leftRawX.y * leftRawY.y + leftRawX.z * leftRawY.z) / 3.;

  vec4 middleRawX = texture2D(textureUx, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy);
  vec4 middleRawY = texture2D(textureUy, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy);
  float middle = (middleRawX.x * middleRawY.x + middleRawX.y * middleRawY.y + middleRawX.z * middleRawY.z) / 3.;

  vec4 rightRawX = texture2D(textureUx, vec2(gl_FragCoord.x + 1., gl_FragCoord.y) / resolution.xy);
  vec4 rightRawY = texture2D(textureUy, vec2(gl_FragCoord.x + 1., gl_FragCoord.y) / resolution.xy);
  float right = (rightRawX.x * rightRawY.x + rightRawX.y * rightRawY.y + rightRawX.z * rightRawY.z) / 3.;

  vec4 lowerLeftRawX = texture2D(textureUx, vec2(gl_FragCoord.x - 1., gl_FragCoord.y - 1.) / resolution.xy);
  vec4 lowerLeftRawY = texture2D(textureUy, vec2(gl_FragCoord.x - 1., gl_FragCoord.y - 1.) / resolution.xy);
  float lowerLeft = (lowerLeftRawX.x * lowerLeftRawY.x + lowerLeftRawX.y * lowerLeftRawY.y + lowerLeftRawX.z * lowerLeftRawY.z) / 3.;

  vec4 belowRawX = texture2D(textureUx, vec2(gl_FragCoord.x, gl_FragCoord.y - 1.) / resolution.xy);
  vec4 belowRawY = texture2D(textureUy, vec2(gl_FragCoord.x, gl_FragCoord.y - 1.) / resolution.xy);
  float below = (belowRawX.x * belowRawY.x + belowRawX.y * belowRawY.y + belowRawX.z * belowRawY.z) / 3.;

  vec4 lowerRightRawX = texture2D(textureUx, vec2(gl_FragCoord.x + 1., gl_FragCoord.y - 1.) / resolution.xy);
  vec4 lowerRightRawY = texture2D(textureUy, vec2(gl_FragCoord.x + 1., gl_FragCoord.y - 1.) / resolution.xy);
  float lowerRight = (lowerRightRawX.x * lowerRightRawY.x + lowerRightRawX.y * lowerRightRawY.y + lowerRightRawX.z * lowerRightRawY.z) / 3.;

  float modified = imfilter(
    vec3(upperLeft, above, upperRight),
    vec3(left, middle, right),
    vec3(lowerLeft, below, lowerRight));

  gl_FragColor = vec4(modified, 0., 0., 0);
}