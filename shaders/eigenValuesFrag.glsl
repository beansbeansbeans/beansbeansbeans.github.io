void main() {
  float dxx = texture2D(textureJxx, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy).x;
  float dxy = texture2D(textureJxy, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy).x;
  float dyy = texture2D(textureJyy, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy).x;
  float tmp = sqrt(pow(dxx - dyy, 2.) + 4. * dxy * dxy);

  float lambda1 = 0.5 * (dxx + dyy + tmp);
  float lambda2 = 0.5 * (dxx + dyy - tmp);

  float mu1 = lambda1;
  float mu2 = lambda2;

  if(abs(lambda1) < abs(lambda2)) {
    mu1 = lambda2;
    mu2 = lambda1;
  }

  gl_FragColor = vec4(mu1, mu2, 1., 1.);
}