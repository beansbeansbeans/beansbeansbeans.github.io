define(['templates/project_detail', 'project_data'], function(projectTemplate, projectData) {
  var outloud = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "outloud",
        title: "<a href='https://outloud.cc' target='_blank'>OUTLOUD</a>",
        blurb: "Twitter for voice",
        projectContents: '<a href="https://outloud.cc" target="_blank" class="chrome"><div class="chrome-controls"><div class="close"></div><div class="min"></div><div class="max"></div></div><div class="contents"><video src="/video/outloud.mp4"></video></div><div class="volume"><div class="volume-off"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="30" height="30" viewBox="0 0 512 512" enable-background="new 0 0 30 30" xml:space="preserve"><path id="audio-5-icon" d="M132.158,333.387h-57.69c-15.446,0-27.968-12.521-27.968-27.969v-98.835  c0-15.448,12.521-27.97,27.968-27.97h57.69V333.387z M163.593,171.676v168.648l135.169,77.824V93.852L163.593,171.676z   M465.5,298.845l-42.859-42.854l42.854-42.856l-23.042-23.027l-42.847,42.853l-42.854-42.848l-23.037,23.023l42.86,42.858  l-42.855,42.861l23.023,23.037l42.865-42.867l42.864,42.862L465.5,298.845z"/></svg></div><div class="volume-on"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="30" height="30" viewBox="0 0 512 512" enable-background="new 0 0 30 30" xml:space="preserve"><path id="audio-4-icon" d="M135.704,333.428H77.983C62.529,333.428,50,320.898,50,305.443v-98.886  c0-15.455,12.529-27.984,27.983-27.984h57.721V333.428z M167.154,171.633v168.736l135.238,77.863V93.768L167.154,171.633z   M339.991,196.806c15.102,15.134,24.425,36.036,24.385,59.11c-0.026,23.066-9.407,43.943-24.544,59.041l24.828,24.914  c21.512-21.453,34.856-51.133,34.902-83.915c0.049-32.788-13.195-62.474-34.646-83.984L339.991,196.806z M383.61,153.345  c26.229,26.295,42.393,62.565,42.331,102.636c-0.054,40.068-16.371,76.35-42.666,102.58l25.443,25.545  c32.829-32.752,53.212-78.061,53.281-128.091c0.077-50.026-20.1-95.293-52.839-128.119L383.61,153.345z"/></svg></div></div></a>',
        caption: "<div class='loading'>Loading video...</div><div class='caption-0'>Explore sounds.</div><div class='caption-1'>Create a live recording.</div><div class='caption-2'>Publish and share.</div>",
        description: "<a class='cta-main' href='https://outloud.cc' target='_blank'>View project</a><p>Podcasting and voicemail are decades-old technologies, yet they are the technological frontier for sharing audio. At the same time, tools abound for sharing images and video on the internet.</p><p>I built <a href='https://outloud.cc' target='_blank'>Outloud</a> with a friend to enable people to create and share audio recordings. Recordings are capped at 20 seconds. Users can tag their recordings by topic, e.g. <a href='https://outloud.cc/streams/18' target='_blank'>'Jokes'</a>, or <a href='https://outloud.cc/streams/21' target='_blank'>'In My Humble Opinion'</a>. Users can also publish <a href='https://outloud.cc/posts/320' target='_blank'>reactions</a> to what they hear.</p><br/><div class='section-header'>Technology</div><p>Outloud is built with <a target='_blank' href='https://facebook.github.io/react/'>React</a> and <a target='_blank' href='http://rubyonrails.org/'>Rails</a>.</p>"
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
      var script = [ 0, 13, 20 ];
      var scriptIndex = 0;
      var hasPlayedOnce = false;
      var sound = true;

      var toggleSound = function(e) {
        if(e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if(sound) {
          $(".volume-on").addClass("hide");
          $(".volume-off").removeClass("hide");
          video.muted = false;
        } else {
          $(".volume-on").removeClass("hide");
          $(".volume-off").addClass("hide");
          video.muted = true;
        }

        sound = !sound;
      }

      toggleSound();

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

      $(".volume").get(0).addEventListener("click", toggleSound);
      
      },
      destroy: function() {
        window.clearInterval(this.intervalID);
      }
    };
    return outloud;
  });