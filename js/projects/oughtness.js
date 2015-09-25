define(['templates/project_detail'], function(projectTemplate) {
  var oughtness = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "oughtness",
        title: "oughtness",
        blurb: "",
        projectContents: '<a href="https://storiesof.cc" target="_blank" id="screenshot"><div id="image"></div><div class="cta">View project</div></a>',
        caption: "Screenshot from a user's moods on <a href='https://storiesof.cc' target='_blank'>Stories of</a>.",
        description: "<a class='cta-main' href='https://storiesof.cc' target='_blank'>View project</a><p>Social media has become a tool for putting our best face forward. We use Facebook to share happy moments and successes, keeping the bad news to ourselves. Someone feeling low may get the impression from their social media feeds that they're alone in their experience.</p><p>I built <a href='https://storiesof.cc' target='_blank'>Stories of</a> as a way for people to share their moods, good or bad.</p>"
      };

      $("#view").html(projectTemplate(data));

      
      },
      destroy: function() {
        window.clearInterval(this.intervalID);
      }
    };
    return oughtness;
  });