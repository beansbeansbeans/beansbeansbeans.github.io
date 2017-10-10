// textureUx, textureUy

void main() {
  vec3 ux = vec3(texture2D(textureUx, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy));
  vec3 uy = vec3(texture2D(textureUy, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy));

  float grad = (pow(ux.x, 2.) + pow(uy.x, 2.) + pow(ux.y, 2.) + pow(uy.y, 2.) + pow(ux.z, 2.) + pow(uy.z, 2.)) / 3.;

  gl_FragColor = vec4(grad, 0., 0., 0);
}