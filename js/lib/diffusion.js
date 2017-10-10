define(['lib/THREE', 'lib/gpucomputationrenderer'], function(THREE, GPUComputationRenderer) {
  var playing = false, iterationCounter, iterations = 0, rafID = null, size = 500, canvas, imageData
  
  var scene = new THREE.Scene(), gpuCompute
  var camera = new THREE.PerspectiveCamera(size - 60, 1, 0.1, 1000)
  var renderer

  var loader = new THREE.FileLoader()
  var shaderFiles = ['nablaFrag', 'pixelFrag', 'pixelVert', 'uxFrag', 'uyFrag', 'jxxFrag', 'jxyFrag', 'jyyFrag', 'eigenVectorsFrag', 'eigenValuesFrag', 'gradFrag', 'diffusionFrag', 'diffusionResultFrag', 'diffusionUXFrag', 'diffusionUYFrag', 'dyeFrag']
  var shaders = {}
  var loadedShaderCount = 0
  var points = size * size
  var referencesArray = new Float32Array(points * 2)
  var references = new THREE.BufferAttribute(referencesArray, 2)
  var verticesArray = new Float32Array(points * 3)
  var vertices = new THREE.BufferAttribute(verticesArray, 3)
  var colorVariable, diffusionResultVariable, uxVariable, uyVariable, jxxVariable, jxyVariable, jyyVariable, eigenVectorsVariable, gradVariable, diffusionVariable, diffusionUXVariable, diffusionUYVariable, dyeVariable, textureDyePixels, textureDyePixelsArray, dyeUniforms, eigenValuesVariable

  var pointsGeometry = new THREE.BufferGeometry()
  pointsGeometry.addAttribute("position", vertices)
  pointsGeometry.addAttribute("reference", references)

  var pointsMaterial, pointsUniforms = {
    textureColor: { value: null }
  }

  var cycles = 5

  document.addEventListener("click", function(e) {
    var canvasRect = canvas.getBoundingClientRect()
    var canvasOffsetLeft = canvasRect.left
    var canvasOffsetTop = canvasRect.top

    var x = Math.round(e.clientX - canvasOffsetLeft)
    var y = Math.round(e.clientY - canvasOffsetTop)

    if (x > 1 && x < size - 1 && y > 1 && y < size - 1) {
      textureDyePixelsArray[(((size - y) * size) + x) * 4] = 1
    }

    textureDyePixels.needsUpdate = true

    iterations = 0
  })

  function render() {
    for(var i=0; i<cycles; i++) {
      if(i === cycles - 1) {
        diffusionResultVariable.material.uniforms.renderFlag.value = 1
      } else {
        diffusionResultVariable.material.uniforms.renderFlag.value = 0
      }
      
      gpuCompute.compute()
    }

    pointsUniforms.textureColor.value = gpuCompute.getCurrentRenderTarget( diffusionResultVariable ).texture        

    renderer.render(scene, camera)

    if(playing) {
      rafID = requestAnimationFrame(render)
      iterations++        
    }

    iterationCounter.innerHTML = iterations + " iterations"
  }

  function initialize() {
    pointsMaterial = new THREE.ShaderMaterial({
      vertexShader: shaders.pixelVert,
      fragmentShader: shaders.pixelFrag,
      uniforms: pointsUniforms
    })

    for(let i=0; i<points; i++) {
      var y = Math.floor(i / size)
      var x = i % size

      verticesArray[i * 3] = -(size / 2) + x
      verticesArray[i * 3 + 1] = -(size / 2) + y
      verticesArray[i * 3 + 2] = size - 298

      referencesArray[i * 2] = x / size
      referencesArray[i * 2 + 1] = y / size
    }

    gpuCompute = new GPUComputationRenderer(size, size, renderer)

    var textureNewPixels = gpuCompute.createTexture()

    var textureNewPixelsArray = textureNewPixels.image.data
    for(var i=0; i<textureNewPixelsArray.length / 4; i++) {
      var y = size - Math.floor(i / size) - 1
      var x = i % size

      textureNewPixelsArray[i * 4 + 0] = imageData.color[size][(y * size + x) * 4];
      textureNewPixelsArray[i * 4 + 1] = imageData.color[size][(y * size + x) * 4 + 1];
      textureNewPixelsArray[i * 4 + 2] = imageData.color[size][(y * size + x) * 4 + 2];
      textureNewPixelsArray[i * 4 + 3] = 1;
    }

    colorVariable = gpuCompute.addVariable("textureColor", shaders.nablaFrag, textureNewPixels)

    uxVariable = gpuCompute.addVariable("textureUx", shaders.uxFrag, gpuCompute.createTexture())

    gpuCompute.setVariableDependencies(uxVariable, [colorVariable])

    uyVariable = gpuCompute.addVariable("textureUy", shaders.uyFrag, gpuCompute.createTexture())

    gpuCompute.setVariableDependencies(uyVariable, [colorVariable])

    jxxVariable = gpuCompute.addVariable("textureJxx", shaders.jxxFrag, gpuCompute.createTexture())

    gpuCompute.setVariableDependencies(jxxVariable, [uxVariable])

    jxyVariable = gpuCompute.addVariable("textureJxy", shaders.jxyFrag, gpuCompute.createTexture())

    gpuCompute.setVariableDependencies(jxyVariable, [uxVariable, uyVariable])

    jyyVariable = gpuCompute.addVariable("textureJyy", shaders.jyyFrag, gpuCompute.createTexture())

    gpuCompute.setVariableDependencies(jyyVariable, [uyVariable])

    eigenVectorsVariable = gpuCompute.addVariable("textureEigenVectors", shaders.eigenVectorsFrag, gpuCompute.createTexture())

    gpuCompute.setVariableDependencies(eigenVectorsVariable, [jxxVariable, jxyVariable, jyyVariable])

    eigenValuesVariable = gpuCompute.addVariable("textureEigenValues", shaders.eigenValuesFrag, gpuCompute.createTexture())

    gpuCompute.setVariableDependencies(eigenValuesVariable, [jxxVariable, jxyVariable, jyyVariable])

    gradVariable = gpuCompute.addVariable("textureGrad", shaders.gradFrag, gpuCompute.createTexture())

    gpuCompute.setVariableDependencies(gradVariable, [uxVariable, uyVariable])

    diffusionVariable = gpuCompute.addVariable("textureDiffusion", shaders.diffusionFrag, gpuCompute.createTexture())

    gpuCompute.setVariableDependencies(diffusionVariable, [gradVariable, eigenVectorsVariable])

    textureDyePixels = gpuCompute.createTexture()
    textureDyePixelsArray = textureDyePixels.image.data

    dyeVariable = gpuCompute.addVariable("textureDye", shaders.dyeFrag, gpuCompute.createTexture())

    dyeUniforms = dyeVariable.material.uniforms
    dyeUniforms.textureDyePixels = {
      value: textureDyePixels
    }

    diffusionUXVariable = gpuCompute.addVariable("textureDiffusionUX", shaders.diffusionUXFrag, gpuCompute.createTexture())
    
    diffusionUYVariable = gpuCompute.addVariable("textureDiffusionUY", shaders.diffusionUYFrag, gpuCompute.createTexture())

    diffusionResultVariable = gpuCompute.addVariable("textureDiffusionResult", shaders.diffusionResultFrag, textureNewPixels)

    gpuCompute.setVariableDependencies(dyeVariable, [ dyeVariable, eigenValuesVariable, eigenVectorsVariable ])

    gpuCompute.setVariableDependencies(colorVariable, [diffusionResultVariable])

    gpuCompute.setVariableDependencies(diffusionUXVariable, [diffusionResultVariable])
    
    gpuCompute.setVariableDependencies(diffusionUYVariable, [diffusionResultVariable])

    gpuCompute.setVariableDependencies(diffusionResultVariable, [diffusionResultVariable, diffusionVariable, diffusionUXVariable, diffusionUYVariable, dyeVariable])

    diffusionResultVariable.material.uniforms.renderFlag = {
      value: 0
    }

    gpuCompute.init()

    camera.position.z = size

    scene.add(new THREE.Points(pointsGeometry, pointsMaterial))

    play()
  }

  var play = function() {
    playing = true
    rafID = requestAnimationFrame(render)
  }

  return {
    loaded: function(cnvs, img) {
      imageData = img

      canvas = cnvs
      canvas.setAttribute("width", size)
      canvas.setAttribute("height", size)

      renderer = new THREE.WebGLRenderer({ canvas: cnvs })
      renderer.setClearColor("white")

      shaderFiles.forEach(function(shader) {
        loader.load('shaders/' + shader + '.glsl', function(data) {
          shaders[shader] = data
          loadedShaderCount++

          if(loadedShaderCount === shaderFiles.length) {
            initialize()
          }
        })
      })

      iterationCounter = document.querySelector("#anisotropic_iteration_count")
    },
    play: function() {
      play()
    },
    pause: function() {
      playing = false
      window.cancelAnimationFrame(rafID)
    },
    reset: function() {
      playing = false
      window.cancelAnimationFrame(rafID)

      delete gpuCompute

      iterations = 0
      iterationCounter.innerHTML = "0 iterations"
      initialize()
      render()
    }
  }
})