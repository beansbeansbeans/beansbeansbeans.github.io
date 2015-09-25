define(['templates/project_detail'], function(projectTemplate) {
  var oughtness = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "oughtness",
        title: "oughtness",
        blurb: "",
        projectContents: '<a href="https://oughtness.cc" target="_blank" id="screenshot"><div id="image"></div><div class="cta">View project</div></a>',
        caption: "Simplified version of <a href='https://oughtness.cc' target='_blank'>Oughtness's</a> voting page.",
        description: "<a class='cta-main' href='https://oughtness.cc' target='_blank'>View project</a><p>Inspired by the <a href='http://gif.gf/' target='_blank'>GifGif</a> and <a href='http://pulse.media.mit.edu/' target='_blank'>Place Pulse</a> projects, I built <a href='https://oughtness.cc' target='_blank'>Oughtness</a> as a tool for measuring the qualities of criticalness and tractability in causes deemed worthy of global attention by <a href='http://www.givewell.org/' target='_blank'>GiveWell</a>, a charity research organization.</p><p>Users are asked to compare two causes at a time in terms of their criticalness or tractability. Votes are collected and visualized on the <a href='https://oughtness.cc/data' target='_blank'>data</a> page, where users can see the causes ranked by priority.</p>"
      };

      $("#view").html(projectTemplate(data));

      
      },
      destroy: function() {
        window.clearInterval(this.intervalID);
      }
    };
    return oughtness;
  });