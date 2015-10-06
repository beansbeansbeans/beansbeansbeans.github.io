define(['templates/project_detail'], function(projectTemplate) {
  var storiesof = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "storiesof",
        title: "<a href='https://storiesof.cc' target='_blank'>STORIESOF</a>",
        blurb: "Concept for a mood tracking social network.",
        projectContents: '<div class="chrome"><div class="chrome-controls"><div class="close"></div><div class="min"></div><div class="max"></div></div><div class="contents"><video src="/video/storiesof.mp4"></video></div></div>',
        caption: "<div class='loading'>Loading video...</div><div class='caption-0'>Browse latest stories.</div><div class='caption-1'>Find stories matching a mood path.</div><div class='caption-2'>Browse a matching story.</div><div class='caption-3'>Show appreciation for the story.</div>",
        description: "<a class='cta-main' href='https://storiesof.cc' target='_blank'>View project</a><p>Social media has become a tool for projecting the best and happiest versions of ourselves to the world. It's gotten to a point where if one is feeling low, the endless narrative of people enjoying themselves that makes up his social media feeds can almost seem mocking.</p><p>I built Stories of as a concept for a social network where users rate their moods over time to build 'stories'. Text is optional - the stories' emphasis is on the user's raw mood ratings and their trajectory. Users can search for stories that follow a certain path by drawing it on the search page.</p><p>I thought that a collection of mood histories showing how people's outlooks peak and valley and peak again could be valuable to people feeling unhappy. Such people often have trouble imagining themselves feeling back to normal again, and I wondered whether seeing evidence of other people bouncing back could help them escape from that destructive line of thought. </p><br/><div class='section-header'>Technology</div><p>Storiesof is built with <a target='_blank' href='https://github.com/Matt-Esch/virtual-dom'>virtual dom</a>, <a target='_blank' href='http://d3js.org/'>d3</a>, <a target='_blank' href='https://nodejs.org/en/'>Node</a>, and <a target='_blank' href='https://mongodb.com'>MongoDB</a>.</p>"
      };

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
    return storiesof;
  });