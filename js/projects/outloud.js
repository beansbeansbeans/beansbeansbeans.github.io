define(['templates/project_detail'], function(projectTemplate) {
  var outloud = {
    intervalID: null,
    scriptTimeouts: [],
    initialize: function() {
      var data = {
        identifier: "outloud",
        title: "<a href='https://outloud.cc' target='_blank'>OUTLOUD</a>",
        blurb: "Twitter for voice",
        projectContents: '<div class="chrome"><div class="chrome-controls"><div class="close"></div><div class="min"></div><div class="max"></div></div><div class="contents"><video src="/video/outloud.mp4"></video></div></div>',
        caption: "<div class='loading'>Loading video...</div><div class='caption-0'>Explore sounds.</div><div class='caption-1'>Create a live recording.</div><div class='caption-2'>Publish and share.</div>",
        description: "<a class='cta-main' href='https://outloud.cc' target='_blank'>View project</a><p>Podcasting and voicemail are decades-old technologies, yet they are the technological frontier for sharing audio. At the same time, tools abound for sharing images and video on the internet.</p><p>I built <a href='https://outloud.cc' target='_blank'>Outloud</a> to enable people to create and share 20 second audio recordings. Recordings are organized by topic, e.g. 'Jokes', or 'In My Humble Opinion'. Users can record reactions to what they hear on the site, which are appended to the seed post.</p><br/><div class='section-header'>Technology</div><p>Outloud is built with <a target='_blank' href='https://facebook.github.io/react/'>React</a> and <a target='_blank' href='http://rubyonrails.org/'>Rails</a>.</p>"
      };

      $("#view").html(projectTemplate(data));

      var video = $("video").get(0);
      var script = [ 0, 13000, 20000 ];
      var scriptIndex = 0;
      var hasPlayedOnce = false;

      var loop = function() {
        video.play();
        script.forEach(function(d, i) {
          this.scriptTimeouts.push(setTimeout(function() {
            $(".caption").attr("data-active-caption", i);
          }, d));
        }.bind(this));
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
        this.scriptTimeouts.forEach(window.clearTimeout);
      }
    };
    return outloud;
  });