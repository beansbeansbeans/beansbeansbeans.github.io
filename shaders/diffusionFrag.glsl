void main() {
  float lambda_e = 0.02;

  float grad = texture2D(textureGrad, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy).x;

  vec4 eigenVectors = texture2D(textureEigenVectors, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy);

  float v1x = eigenVectors.x;
  float v1y = eigenVectors.y;
  float v2x = eigenVectors.z;
  float v2y = eigenVectors.w;

  float lambda2 = 1. - exp(-3.31488 / pow(grad / pow(lambda_e, 2.), 4.));

  if(grad < 0.0000000000000001) {
    lambda2 = 1.;
  }

  float dxx = pow(v1x, 2.) + lambda2 * pow(v2x, 2.);
  float dxy = v1x * v1y + lambda2 * v2x * v2y;
  float dyy = pow(v1y, 2.) + lambda2 * pow(v2y, 2.);

  gl_FragColor = vec4(dxx, dxy, dyy, 0);
}