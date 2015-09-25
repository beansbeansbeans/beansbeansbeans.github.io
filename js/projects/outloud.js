define(['templates/project_detail'], function(projectTemplate) {
  var outloud = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "outloud",
        title: "outloud",
        blurb: "",
        projectContents: '<a href="https://outloud.cc" target="_blank" id="screenshot"><div id="image"></div><div class="cta">View project</div></a>',
        caption: "Screenshot from <a href='https://outloud.cc' target='_blank'>Outloud's</a> recording page.",
        description: "<a class='cta-main' href='https://outloud.cc' target='_blank'>View project</a><p>Podcasting and voicemail are decades-old technologies, yet they are the technological frontier for sharing audio. At the same time, tools abound for sharing images and video on the internet.</p><p>I built <a href='https://outloud.cc' target='_blank'>Outloud</a> to enable people to create and share 20 second recordings. Recordings are organized by topic, e.g. 'Jokes', or 'In My Humble Opinion'. Users can record reactions to what they hear on the site, which are then appended to the seed post.</p>"
      };

      $("#view").html(projectTemplate(data));

      
      },
      destroy: function() {
        window.clearInterval(this.intervalID);
      }
    };
    return outloud;
  });