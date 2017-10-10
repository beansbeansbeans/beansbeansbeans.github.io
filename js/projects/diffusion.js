define(['templates/project_detail', 'project_data'], function(projectTemplate, projectData) {
  var diffusion = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "diffusion",
        title: "<a href='http://fab.cba.mit.edu/classes/MAS.864/people/annyuan/project.html' target='_blank'>diffusion</a>",
        blurb: "",
        projectContents: "<div class='demo'><canvas id='anisotropic' width='500' height='500'></canvas><div class='iterations' id='anisotropic_iteration_count'>iterations</div><div class='buttons'><button onclick='anisotropic.play()'>play</button><button onclick='anisotropic.pause()'>pause</button><button onclick='anisotropic.reset()'>reset</button></div></div>",
        caption: "Click to inject ink into the image.",
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

      var video = $("video").get(0);
      var script = [ 0, 2, 8.7, 13 ];
      var scriptIndex = 0;
      var hasPlayedOnce = false;

      var loop = function() {
        video.play();
        scriptIndex = 0;
      }.bind(this);

      video.addEventListener("canplaythrough", function() {
        if(!hasPlayedOnce) {
          loop();
          hasPlayedOnce = true;
        }
      });
      video.addEventListener("ended", function() {
        video.load();
        loop();
      });
      video.addEventListener("timeupdate", function() {
        if(video.currentTime > script[scriptIndex]) {
          $(".caption").attr("data-active-caption", scriptIndex);
          scriptIndex++;
        }
      });
      
      },
      destroy: function() {
        window.clearInterval(this.intervalID);
      }
    };
    return diffusion;
  });