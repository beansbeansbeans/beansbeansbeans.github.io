define(['templates/project_detail'], function(projectTemplate) {
  var storiesof = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "storiesof",
        title: "storiesof",
        blurb: "This is an animation of a turning head. Hover over any pixel within the animation to magnify it.",
        projectContents: '<div id="border"><div id="movie"></div></div>',
        caption: "Built with d3js, a fisheye distortion plugin for d3js, and scalable vector graphics.",
        description: "I wanted to try to apply a <a href='http://bost.ocks.org/mike/fisheye/' target='_blank'>Cartesian distortion effect</a> to a pixellated image."
      };

      $("#view").html(projectTemplate(data));

      
      },
      destroy: function() {
        window.clearInterval(this.intervalID);
      }
    };
    return storiesof;
  });