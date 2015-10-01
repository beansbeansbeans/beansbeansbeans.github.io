define(['templates/project_detail'], function(projectTemplate) {
  var storiesof = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "storiesof",
        title: "storiesof",
        blurb: "",
        projectContents: '<div class="chrome"><div class="chrome-controls"><div class="close"></div><div class="min"></div><div class="max"></div></div><div class="contents"><video autoplay="true" loop src="/video/storiesof.mp4"></video></div></div>',
        caption: "Screenshot from a user's moods on <a href='https://storiesof.cc' target='_blank'>Stories of</a>.",
        description: "<a class='cta-main' href='https://storiesof.cc' target='_blank'>View project</a><p>Social media has become a tool for projecting the best version of ourselves to the world. Someone feeling unhappy may get the impression from their Facebook newsfeed that they're alone in their experience.</p><p>I built <a href='https://storiesof.cc' target='_blank'>Stories of</a> as a way for people to share their moods, good or bad.</p>"
      };

      $("#view").html(projectTemplate(data));

      
      },
      destroy: function() {
        window.clearInterval(this.intervalID);
      }
    };
    return storiesof;
  });