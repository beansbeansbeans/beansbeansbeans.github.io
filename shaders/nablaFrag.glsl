vec3 k1 = vec3(0.0751136079541115, 0.123841403152974, 0.0751136079541115);
vec3 k2 = vec3(0.123841403152974, 0.20417995557165813, 0.123841403152974);
vec3 k3 = vec3(0.0751136079541115, 0.123841403152974, 0.0751136079541115);

vec3 imfilter(vec4 upperLeft, vec4 above, vec4 upperRight, vec4 left, vec4 middle, vec4 right, vec4 lowerLeft, vec4 below, vec4 lowerRight) {
  vec3 convolvedValue = vec3(0., 0., 0.);

  convolvedValue = vec3(
    k1.x * upperLeft.r + k1.y * above.r + k1.z * upperRight.r + k2.x * left.r + k2.y * middle.r + k2.z * right.r + k3.x * lowerLeft.r + k3.y * below.r + k3.z * lowerRight.r,
    k1.x * upperLeft.g + k1.y * above.g + k1.z * upperRight.g + k2.x * left.g + k2.y * middle.g + k2.z * right.g + k3.x * lowerLeft.g + k3.y * below.g + k3.z * lowerRight.g,
    k1.x * upperLeft.b + k1.y * above.b + k1.z * upperRight.b + k2.x * left.b + k2.y * middle.b + k2.z * right.b + k3.x * lowerLeft.b + k3.y * below.b + k3.z * lowerRight.b
    );

  return convolvedValue;
}

void main() {
  vec3 modified = imfilter(
    texture2D(textureDiffusionResult, vec2(gl_FragCoord.x - 1., gl_FragCoord.y + 1.) / resolution.xy),
    texture2D(textureDiffusionResult, vec2(gl_FragCoord.x, gl_FragCoord.y + 1.) / resolution.xy),
    texture2D(textureDiffusionResult, vec2(gl_FragCoord.x + 1., gl_FragCoord.y + 1.) / resolution.xy),
    texture2D(textureDiffusionResult, vec2(gl_FragCoord.x - 1., gl_FragCoord.y) / resolution.xy),
    texture2D(textureDiffusionResult, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy),
    texture2D(textureDiffusionResult, vec2(gl_FragCoord.x + 1., gl_FragCoord.y) / resolution.xy),
    texture2D(textureDiffusionResult, vec2(gl_FragCoord.x - 1., gl_FragCoord.y - 1.) / resolution.xy),
    texture2D(textureDiffusionResult, vec2(gl_FragCoord.x, gl_FragCoord.y - 1.) / resolution.xy),
    texture2D(textureDiffusionResult, vec2(gl_FragCoord.x + 1., gl_FragCoord.y - 1.) / resolution.xy));

  gl_FragColor = vec4(modified, 1);
}