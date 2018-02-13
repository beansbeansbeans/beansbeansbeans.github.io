define(['templates/project_detail', 'project_data'], function(projectTemplate, projectData) {
  var som = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "som",
        title: "<a href='http://collectivedebate.mit.edu/results/moralitymap' target='_blank'>som</a>",
        blurb: "A self-organizing map of morality.",
        projectContents: '<a href="http://collectivedebate.mit.edu/results/moralitymap" target="_blank" class="chrome"><div class="chrome-controls"><div class="close"></div><div class="min"></div><div class="max"></div></div><div class="contents"><video src="/video/som.mp4"></video></div></a>',
        caption: "",
        description: "<a class='cta-main' href='http://collectivedebate.mit.edu/results/moralitymap' target='_blank'>View project</a><p>In this visualization users see how a <a href='https://en.wikipedia.org/wiki/Self-organizing_map' target='_blank'>self organizing map</a> learns in real time to project patterns from a high-dimensional space onto a two-dimensional lattice of neurons. The training data comes from ~4k users’ moral matrices collected through the Collective Debate site. A <a href='https://en.wikipedia.org/wiki/Moral_foundations_theory' target='_blank'>moral matrix</a> consists of five numbers that indicate how much importance a user assigns to the five moral foundations (harm, purity, fairness, authority, ingroup, and purity, as identified by the psychologist Jonathan Haidt) when assessing right and wrong.</p><p>After the map has finished training it inflates with data to reveal a three-dimensional histogram of where users fall in the moral landscape. The visualization enables users to see how their own moral matrix compares to those of the prototypical liberal and conservative, as well as to the moral matrices of users who either supported or opposed the claim that differences in professional outcomes in computer science between men and women are primarily the product of socialization. </p><br/><div class='section-header'>Technology</div><p>The latice is visualized with WebGL. The computations for the self-organizing map are carried out on GPU shaders.</p>"
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
    return som;
  });