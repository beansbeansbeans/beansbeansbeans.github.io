vec3 k1x = vec3(0.09375, 0.3125, 0.09375);
vec3 k2x = vec3(0., 0., 0.);
vec3 k3x = vec3(-0.09375, -0.3125, -0.09375);

uniform float renderFlag;

vec3 derivativeX(vec3 upperLeft, vec3 above, vec3 upperRight, vec3 left, vec3 middle, vec3 right, vec3 lowerLeft, vec3 below, vec3 lowerRight) {

  vec3 convolvedValue = vec3(0., 0., 0.);

  convolvedValue = vec3(
    k1x.x * upperLeft.x + k1x.y * above.x + k1x.z * upperRight.x + k2x.x * left.x + k2x.y * middle.x + k2x.z * right.x + k3x.x * lowerLeft.x + k3x.y * below.x + k3x.z * lowerRight.x,
    k1x.x * upperLeft.y + k1x.y * above.y + k1x.z * upperRight.y + k2x.x * left.y + k2x.y * middle.y + k2x.z * right.y + k3x.x * lowerLeft.y + k3x.y * below.y + k3x.z * lowerRight.y,
    k1x.x * upperLeft.z + k1x.y * above.z + k1x.z * upperRight.z + k2x.x * left.z + k2x.y * middle.z + k2x.z * right.z + k3x.x * lowerLeft.z + k3x.y * below.z + k3x.z * lowerRight.z
    );

  return convolvedValue;
}

vec3 k1y = vec3(0.09375, 0., -0.09375);
vec3 k2y = vec3(0.3125, 0., -0.3125);
vec3 k3y = vec3(0.09375, 0., -0.09375);

vec3 derivativeY(vec3 upperLeft, vec3 above, vec3 upperRight, vec3 left, vec3 middle, vec3 right, vec3 lowerLeft, vec3 below, vec3 lowerRight) {

  vec3 convolvedValue = vec3(0., 0., 0.);

  convolvedValue = vec3(
    k1y.x * upperLeft.x + k1y.y * above.x + k1y.z * upperRight.x + k2y.x * left.x + k2y.y * middle.x + k2y.z * right.x + k3y.x * lowerLeft.x + k3y.y * below.x + k3y.z * lowerRight.x,
    k1y.x * upperLeft.y + k1y.y * above.y + k1y.z * upperRight.y + k2y.x * left.y + k2y.y * middle.y + k2y.z * right.y + k3y.x * lowerLeft.y + k3y.y * below.y + k3y.z * lowerRight.y,
    k1y.x * upperLeft.z + k1y.y * above.z + k1y.z * upperRight.z + k2y.x * left.z + k2y.y * middle.z + k2y.z * right.z + k3y.x * lowerLeft.z + k3y.y * below.z + k3y.z * lowerRight.z
    ); 

  return convolvedValue;
}

vec3 getJ1(vec2 coordinates) {
  float dxx = texture2D(textureDiffusion, coordinates).x;
  vec4 ux = texture2D(textureDiffusionUX, coordinates);
  float dxy = texture2D(textureDiffusion, coordinates).y;
  vec4 uy = texture2D(textureDiffusionUY, coordinates);

  return vec3(
    dxx * ux.x + dxy * uy.x,
    dxx * ux.y + dxy * uy.y,
    dxx * ux.z + dxy * uy.z);
}

vec3 getJ2(vec2 coordinates) {
  float dxy = texture2D(textureDiffusion, coordinates).y;
  vec4 ux = texture2D(textureDiffusionUX, coordinates);
  float dyy = texture2D(textureDiffusion, coordinates).z;
  vec4 uy = texture2D(textureDiffusionUY, coordinates);

  return vec3(
    dxy * ux.x + dyy * uy.x,
    dxy * ux.y + dyy * uy.y,
    dxy * ux.z + dyy * uy.z);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec2 upperLeftUV = vec2(gl_FragCoord.x - 1., gl_FragCoord.y + 1.) / resolution.xy;
  vec2 aboveUV = vec2(gl_FragCoord.x, gl_FragCoord.y + 1.) / resolution.xy;
  vec2 upperRightUV = vec2(gl_FragCoord.x + 1., gl_FragCoord.y + 1.) / resolution.xy;
  vec2 leftUV = vec2(gl_FragCoord.x - 1., gl_FragCoord.y) / resolution.xy;
  vec2 rightUV = vec2(gl_FragCoord.x + 1., gl_FragCoord.y) / resolution.xy;
  vec2 lowerLeftUV = vec2(gl_FragCoord.x - 1., gl_FragCoord.y - 1.) / resolution.xy;
  vec2 belowUV = vec2(gl_FragCoord.x, gl_FragCoord.y - 1.) / resolution.xy;
  vec2 lowerRightUV = vec2(gl_FragCoord.x + 1., gl_FragCoord.y - 1.) / resolution.xy;

  vec3 upperLeftJ1 = getJ1(upperLeftUV);
  vec3 aboveJ1 = getJ1(aboveUV);
  vec3 upperRightJ1 = getJ1(upperRightUV);
  vec3 leftJ1 = getJ1(leftUV);
  vec3 j1 = getJ1(uv);
  vec3 rightJ1 = getJ1(rightUV);
  vec3 lowerLeftJ1 = getJ1(lowerLeftUV);
  vec3 belowJ1 = getJ1(belowUV);
  vec3 lowerRightJ1 = getJ1(lowerRightUV);

  vec3 upperLeftJ2 = getJ2(upperLeftUV);
  vec3 aboveJ2 = getJ2(aboveUV);
  vec3 upperRightJ2 = getJ2(upperRightUV);
  vec3 leftJ2 = getJ2(leftUV);
  vec3 j2 = getJ2(uv);
  vec3 rightJ2 = getJ2(rightUV);
  vec3 lowerLeftJ2 = getJ2(lowerLeftUV);
  vec3 belowJ2 = getJ2(belowUV);
  vec3 lowerRightJ2 = getJ2(lowerRightUV);

  vec3 dj1 = derivativeX(upperLeftJ1, aboveJ1, upperRightJ1,
    leftJ1, j1, rightJ1,
    lowerLeftJ1, belowJ1, lowerRightJ1);

  vec3 dj2 = derivativeY(upperLeftJ2, aboveJ2, upperRightJ2,
    leftJ2, j2, rightJ2,
    lowerLeftJ2, belowJ2, lowerRightJ2);

  vec3 du = vec3(dj1.x + dj2.x, dj1.y + dj2.y, dj1.z + dj2.z);

  vec4 newColor = texture2D( textureDiffusionResult, uv); 

  vec4 diffusedColor = vec4(newColor.x + du.x, newColor.y + du.y, newColor.z + du.z, newColor.w);

  vec4 dyeColor = texture2D( textureDye, uv);

  if(dyeColor.x > 0.) {
    gl_FragColor = vec4(43., 191., 189., 0.);
  } else if(renderFlag > 0.) {
    gl_FragColor = diffusedColor;
  } else {
    gl_FragColor = newColor;
  }
}