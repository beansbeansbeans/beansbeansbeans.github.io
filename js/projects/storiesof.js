define(['templates/project_detail'], function(projectTemplate) {
  var storiesof = {
    intervalID: null,
    scriptTimeouts: [],
    initialize: function() {
      var data = {
        identifier: "storiesof",
        title: "storiesof",
        blurb: "",
        projectContents: '<div class="chrome"><div class="chrome-controls"><div class="close"></div><div class="min"></div><div class="max"></div></div><div class="contents"><video src="/video/storiesof.mp4"></video></div></div>',
        caption: "<div class='loading'>Loading video...</div><div class='caption-0'>Browse latest stories.</div><div class='caption-1'>Draw a mood path to find matching stories.</div><div class='caption-2'>Browse through the story.</div><div class='caption-3'>Show appreciation for the story.</div>",
        description: "<a class='cta-main' href='https://storiesof.cc' target='_blank'>View project</a><p>Social media has become a tool for projecting the best version of ourselves to the world. Someone feeling unhappy may get the impression from their Facebook newsfeed that they're alone in their experience.</p><p>I built <a href='https://storiesof.cc' target='_blank'>Stories of</a> as a way for people to share their moods, good or bad.</p>"
      };

      $("#view").html(projectTemplate(data));

      var video = $("video").get(0);
      var script = [ 0, 3000, 10000, 13000 ];
      var scriptIndex = 0;

      var loop = function() {
        video.play();
        script.forEach(function(d, i) {
          this.scriptTimeouts.push(setTimeout(function() {
            $(".caption").attr("data-active-caption", i);
          }, d));
        }.bind(this));
      }.bind(this);

      video.addEventListener("canplaythrough", loop);
      video.addEventListener("ended", loop);
      
      },
      destroy: function() {
        window.clearInterval(this.intervalID);
        this.scriptTimeouts.forEach(window.clearTimeout);
      }
    };
    return storiesof;
  });