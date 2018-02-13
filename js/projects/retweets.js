define(['templates/project_detail', 'project_data'], function(projectTemplate, projectData) {
  var retweets = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "retweets",
        title: "<a href='http://web.media.mit.edu/~annyuan/' target='_blank'>retweets</a>",
        blurb: "Visualizing retweet chains of Change.org petitions.",
        projectContents: '<a href="http://web.media.mit.edu/~annyuan/" target="_blank" class="chrome"><div class="chrome-controls"><div class="close"></div><div class="min"></div><div class="max"></div></div><div class="contents"><video src="/video/retweets.mp4"></video></div></a>',
        caption: "",
        description: "<a class='cta-main' href='http://web.media.mit.edu/~annyuan/' target='_blank'>View project</a><p>This visualization shows retweet activity involving certain <a href='https://www.change.org/' target='_blank'>Change.org</a> petitions. To create this visualization we first obtained a network of politically active users on Twitter and colored them red or blue depending on their inferred political ideology. We drew links between nodes if one follows the other. Then we gathered data on retweet activity involving Change.org petitions within this network. By clicking on the petition names in the left-hand sidebar, one can watch how news of different petitions spreads through the network.</p><br/><div class='section-header'>Technology</div><p>WebGL.</p>"
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
      
      },
      destroy: function() {
        window.clearInterval(this.intervalID);
      }
    };
    return retweets;
  });