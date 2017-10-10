void main() {
  float dxx = texture2D(textureJxx, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy).x;
  float dxy = texture2D(textureJxy, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy).x;
  float dyy = texture2D(textureJyy, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy).x;
  float tmp = sqrt(pow(dxx - dyy, 2.) + 4. * dxy * dxy);

  float v2x = 2. * dxy;
  float v2y = dyy - dxx + tmp;

  float mag = sqrt(pow(v2x, 2.) + pow(v2y, 2.));
  v2x = v2x / mag;
  v2y = v2y / mag;

  float v1x = -v2y;
  float v1y = v2x;

  float lambda1 = 0.5 * (dxx + dyy + tmp);
  float lambda2 = 0.5 * (dxx + dyy - tmp);

  if(abs(lambda1) < abs(lambda2)) {
    float currentV1x = v1x;
    v1x = v2x;
    v2x = currentV1x;

    float currentV1y = v1y;
    v1y = v2y;
    v2y = currentV1y;
  }

  gl_FragColor = vec4(v1x, v1y, v2x, v2y);
}