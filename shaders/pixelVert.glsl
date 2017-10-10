attribute vec2 reference;
varying vec4 vColor;
uniform sampler2D textureColor;

void main() {
  vec4 color = texture2D(textureColor, reference);
  vColor = vec4(color.x / 255., color.y / 255., color.z / 255., 1.);

  gl_PointSize = 1.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}