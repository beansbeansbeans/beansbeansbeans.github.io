define(['templates/project_detail', 'project_data'], function(projectTemplate, projectData) {
  var wwit = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "wwit",
        title: "<a href='http://whatwouldittake.cc' target='_blank'>wwit</a>",
        blurb: "What would it take to change your mind?",
        projectContents: '<div class="chrome"><div class="chrome-controls"><div class="close"></div><div class="min"></div><div class="max"></div></div><div class="contents"><video src="/video/wwit.mp4"></video></div></div>',
        caption: "<div class='loading'>Loading video...</div><div class='caption-0'>State your belief.</div><div class='caption-1'>Ask yourself what it would take to change your mind.</div><div class='caption-2'>Consider opposing evidence.</div><div class='caption-3'>Change your belief, and see how public opinion has evolved.</div><div class='caption-4'>Change your belief, and see how public opinion has evolved.</div>",
        description: "<a class='cta-main' href='http://whatwouldittake.cc' target='_blank'>View project</a><p>Project overview contents.</p><br/><div class='section-header'>What's the point?</div><p>The point.</p><br/><div class='section-header'>Technology</div><p>WWIT is built with <a target='_blank' href='https://github.com/Matt-Esch/virtual-dom'>virtual dom</a>, <a target='_blank' href='http://d3js.org/'>d3</a>, <a target='_blank' href='https://nodejs.org/en/'>Node</a>, and <a target='_blank' href='https://mongodb.com'>MongoDB</a>.</p>"
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
    return wwit;
  });