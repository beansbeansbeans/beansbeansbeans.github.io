uniform sampler2D textureDyePixels;

void main() {
  vec4 userInput = texture2D( textureDyePixels, gl_FragCoord.xy / resolution.xy );
  vec4 previousDye = texture2D( textureDye, gl_FragCoord.xy / resolution.xy );
  vec4 nextColor = vec4(0., 0., 0., 0.);

  if(userInput.x > 0. || previousDye.x > 0.) {
    if(userInput.x > 0.) {
      nextColor = userInput;
    } else if(previousDye.x > 0.) {
      nextColor = previousDye;
    }

    // do we need to determine next / previous?
    if(nextColor.y < 1.) {
      vec4 eigenValues = texture2D( textureEigenValues, gl_FragCoord.xy / resolution.xy );
      vec4 eigenVectors = texture2D( textureEigenVectors, gl_FragCoord.xy / resolution.xy );

      vec2 vec = vec2(eigenVectors.y, eigenVectors.x);

      if(eigenValues.y > eigenValues.x) {
        vec = vec2(eigenVectors.w, eigenVectors.z);
      }

      vec2 nextPosition = vec2(vec.x, vec.y);
      vec2 nextCoord = vec2(gl_FragCoord.x + nextPosition.x, gl_FragCoord.y + nextPosition.y) / resolution.xy;
      vec4 nextEigenVectors = texture2D(textureEigenVectors, nextCoord); 
      vec2 nextEigenValues = texture2D(textureEigenValues, nextCoord).xy;
      vec2 nextVector = vec2(nextEigenVectors.y, nextEigenVectors.x);

      if(nextEigenValues.y > nextEigenValues.x) {
        nextVector = vec2(nextEigenVectors.w, nextEigenVectors.z);
      }

      vec2 next = vec2(0.5 * vec.x + 0.5 * nextVector.x, 0.5 * vec.y + 0.5 * nextVector.y);

      if(next.x < -0.5 && next.y > 0.5) {
        nextColor.y = 7.;
      } else if(next.x > -0.5 && next.x < 0.5 && next.y > 0.5) {
        nextColor.y = 2.;
      } else if(next.x > 0.5 && next.y > 0.5) {
        nextColor.y = 1.;
      } else if(next.x > 0.5 && next.y < 0.5 && next.y > -0.5) {
        nextColor.y = 4.;
      } else if(next.x > 0.5 && next.y < -0.5) {
        nextColor.y = 3.;
      } else if(next.x > -0.5 && next.x < 0.5 && next.y < -0.5) {
        nextColor.y = 6.;
      } else if(next.x < -0.5 && next.y < -0.5) {
        nextColor.y = 5.;
      } else {
        nextColor.y = 8.;
      }
    }
  } else {
    // here check whether we should be advected to. 
    if(abs(texture2D( textureDye, vec2(gl_FragCoord.x - 1., gl_FragCoord.y + 1.) / resolution.xy ).y - 5.) < 0.01 ) {
      nextColor.x = 1.;
    } else if(abs(texture2D( textureDye, vec2(gl_FragCoord.x, gl_FragCoord.y + 1.) / resolution.xy ).y - 6.) < 0.01 ) {
      nextColor.x = 1.;
    } else if(abs(texture2D( textureDye, vec2(gl_FragCoord.x + 1., gl_FragCoord.y + 1.) / resolution.xy ).y - 7.) < 0.01 ) {
      nextColor.x = 1.;
    } else if(abs(texture2D( textureDye, vec2(gl_FragCoord.x + 1., gl_FragCoord.y) / resolution.xy ).y - 8.) < 0.01 ) {
      nextColor.x = 1.;
    } else if(abs(texture2D( textureDye, vec2(gl_FragCoord.x + 1., gl_FragCoord.y - 1.) / resolution.xy ).y - 1.) < 0.01 ) {
      nextColor.x = 1.;
    } else if(abs(texture2D( textureDye, vec2(gl_FragCoord.x, gl_FragCoord.y - 1.) / resolution.xy ).y - 2.) < 0.01 ) {
      nextColor.x = 1.;
    } else if(abs(texture2D( textureDye, vec2(gl_FragCoord.x - 1., gl_FragCoord.y - 1.) / resolution.xy ).y - 3.) < 0.01 ) {
      nextColor.x = 1.;
    } else if(abs(texture2D( textureDye, vec2(gl_FragCoord.x - 1., gl_FragCoord.y) / resolution.xy ).y - 4.) < 0.01 ) {
      nextColor.x = 1.;
    }
  }

  gl_FragColor = nextColor;
}