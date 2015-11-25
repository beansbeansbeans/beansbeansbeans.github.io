define(['templates/project_detail', 'project_data'], function(projectTemplate, projectData) {
  var stories = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "stories",
        title: "<a href='https://storiesof.cc' target='_blank'>STORIES</a>",
        blurb: "Concept for a mood tracking social network.",
        projectContents: '<div class="chrome"><div class="chrome-controls"><div class="close"></div><div class="min"></div><div class="max"></div></div><div class="contents"><video src="/video/storiesof.mp4"></video></div></div>',
        caption: "<div class='loading'>Loading video...</div><div class='caption-0'>Browse latest stories.</div><div class='caption-1'>Find stories matching a mood path.</div><div class='caption-2'>Browse a matching story.</div><div class='caption-3'>Show appreciation for the story.</div>",
        description: "<a class='cta-main' href='https://storiesof.cc' target='_blank'>View project</a><p><a href='https://storiesof.cc' target='_blank'>STORIES</a> is a concept for a social network. The site is composed of posts in which users grade their feelings at a  moment in time on a scale of one to 100. A user's posts over time form a story of their feelings. Text is optional, and users can post anonymously. This way, a post is simply an acknowledgment of a user's feelings.</p><p>Users can <a href='https://storiesof.cc/search' target='_blank'>search</a> for stories that follow a certain path by drawing it on the search page. For example, users can search for stories of people feeling sad but then getting happier, or vice versa.</p><br/><div class='section-header'>What's the point?</div><p>I want STORIES to serve as a searchable database of people's feelings.</p><p>We use social media to project the best versions of ourselves to the world. This means that when we're unhappy, it can feel like we're alone in our experience. It can also feel like we'll never bounce back. What if in those moments we could browse stories of people recovering from their unhappiness? STORIES is designed around this use case.</p><br/><div class='section-header'>Technology</div><p>STORIES is built with <a target='_blank' href='https://github.com/Matt-Esch/virtual-dom'>virtual dom</a>, <a target='_blank' href='http://d3js.org/'>d3</a>, <a target='_blank' href='https://nodejs.org/en/'>Node</a>, and <a target='_blank' href='https://mongodb.com'>MongoDB</a>.</p>"
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
      var script = [ 0, 3.5, 13, 16.5 ];
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
    return stories;
  });