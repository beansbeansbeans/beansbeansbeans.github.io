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
  vec4 upperLeftRaw = texture2D(textureUx, vec2(gl_FragCoord.x - 1., gl_FragCoord.y + 1.) / resolution.xy);
  float upperLeft = (upperLeftRaw.x * upperLeftRaw.x + upperLeftRaw.y * upperLeftRaw.y + upperLeftRaw.z * upperLeftRaw.z) / 3.;

  vec4 aboveRaw = texture2D(textureUx, vec2(gl_FragCoord.x, gl_FragCoord.y + 1.) / resolution.xy);
  float above = (aboveRaw.x * aboveRaw.x + aboveRaw.y * aboveRaw.y + aboveRaw.z * aboveRaw.z) / 3.;

  vec4 upperRightRaw = texture2D(textureUx, vec2(gl_FragCoord.x + 1., gl_FragCoord.y + 1.) / resolution.xy);
  float upperRight = (upperRightRaw.x * upperRightRaw.x + upperRightRaw.y * upperRightRaw.y + upperRightRaw.z * upperRightRaw.z) / 3.;

  vec4 leftRaw = texture2D(textureUx, vec2(gl_FragCoord.x - 1., gl_FragCoord.y) / resolution.xy);
  float left = (leftRaw.x * leftRaw.x + leftRaw.y * leftRaw.y + leftRaw.z * leftRaw.z) / 3.;

  vec4 middleRaw = texture2D(textureUx, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy);
  float middle = (middleRaw.x * middleRaw.x + middleRaw.y * middleRaw.y + middleRaw.z * middleRaw.z) / 3.;

  vec4 rightRaw = texture2D(textureUx, vec2(gl_FragCoord.x + 1., gl_FragCoord.y) / resolution.xy);
  float right = (rightRaw.x * rightRaw.x + rightRaw.y * rightRaw.y + rightRaw.z * rightRaw.z) / 3.;

  vec4 lowerLeftRaw = texture2D(textureUx, vec2(gl_FragCoord.x - 1., gl_FragCoord.y - 1.) / resolution.xy);
  float lowerLeft = (lowerLeftRaw.x * lowerLeftRaw.x + lowerLeftRaw.y * lowerLeftRaw.y + lowerLeftRaw.z * lowerLeftRaw.z) / 3.;

  vec4 belowRaw = texture2D(textureUx, vec2(gl_FragCoord.x, gl_FragCoord.y - 1.) / resolution.xy);
  float below = (belowRaw.x * belowRaw.x + belowRaw.y * belowRaw.y + belowRaw.z * belowRaw.z) / 3.;

  vec4 lowerRightRaw = texture2D(textureUx, vec2(gl_FragCoord.x + 1., gl_FragCoord.y - 1.) / resolution.xy);
  float lowerRight = (lowerRightRaw.x * lowerRightRaw.x + lowerRightRaw.y * lowerRightRaw.y + lowerRightRaw.z * lowerRightRaw.z) / 3.;

  float modified = imfilter(
    vec3(upperLeft, above, upperRight),
    vec3(left, middle, right),
    vec3(lowerLeft, below, lowerRight));

  gl_FragColor = vec4(modified, 0., 0., 0);
}