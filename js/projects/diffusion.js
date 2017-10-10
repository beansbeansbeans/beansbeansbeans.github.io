define(['templates/project_detail', 'project_data', 'lib/diffusion'], function(projectTemplate, projectData, diffusionLibrary) {
  window.diffusionLibrary = diffusionLibrary
  
  var diffusion = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "diffusion",
        title: "<a href='http://fab.cba.mit.edu/classes/MAS.864/people/annyuan/project.html' target='_blank'>diffusion</a>",
        blurb: "Click to inject ink into the image.",
        projectContents: "<div class='demo'><canvas id='anisotropic' width='500' height='500'></canvas><div class='iterations' id='anisotropic_iteration_count'>iterations</div><div class='buttons'><button onclick='diffusionLibrary.play()'>play</button><button onclick='diffusionLibrary.pause()'>pause</button><button onclick='diffusionLibrary.reset()'>reset</button></div></div>",
        caption: "",
        description: "<a class='cta-main' href='http://fab.cba.mit.edu/classes/MAS.864/people/annyuan/project.html' target='_blank'>View project</a><p>This is a project I completed for <a href='http://fab.cba.mit.edu/classes/864.17/' target='_blank'>The Nature of Mathematical Modeling</a>, which I took with Neil Gershenfeld in the spring of 2017. It demonstrates an image processing technique known as anisotropic diffusion, which denoises images while preserving structure and important details.</p>"
      };

      var indexOfProject = -1;
      for(var i=0; i<projectData.length; i++) {
          if(projectData[i].title === data.identifier) {
              indexOfProject = i;
              break;
          }
      }

      if(indexOfProject !== 0) {
          data.previous = projectData[indexOfProject - 1].title;
      } else {
        data.previousActive = "false";
      }
      if(indexOfProject !== (projectData.length - 1)) {
          data.next = projectData[indexOfProject + 1].title;
      } else {
        data.nextActive = "false";
      }

      $("#view").html(projectTemplate(data));

      var canvases = [500].map(function(size) {
        var canvas = document.createElement("canvas")
        var ctx = canvas.getContext("2d")
        canvas.setAttribute("width",size)
        canvas.setAttribute("height",size)

        return {
          canvas: canvas,
          ctx: ctx,
          size: size
        }
      })

      var imageData = {
        color: {}
      }

      var lenaColor = new Image()
      lenaColor.src = "images/project_diffusion/lena_color.jpg"

      lenaColor.onload = function(d) {
        canvases.forEach(function(obj) {
          obj.ctx.drawImage(lenaColor, 0, 0, obj.size, obj.size)

          var data = obj.ctx.getImageData(0, 0, obj.size, obj.size)
          imageData.color[obj.size] = data.data
        })

        diffusionLibrary.loaded(
          document.querySelector("#anisotropic"),
          imageData)
      }
      
      },
      destroy: function() {
        window.clearInterval(this.intervalID);
      }
    };
    return diffusion;
  });