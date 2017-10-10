define(['templates/project_detail', 'project_data'], function(projectTemplate, projectData) {
  var schelling = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "schelling",
        title: "<a href='http://web.media.mit.edu/~annyuan/schelling_axelrod/' target='_blank'>schelling</a>",
        blurb: "Experiments with cellular automata.",
        projectContents: '<a href="http://web.media.mit.edu/~annyuan/schelling_axelrod/" target="_blank"><img src="images/project_schelling/schelling.jpg"></a>',
        caption: "This is a screenshot from the simulation. Click to try it out.",
        description: "<a class='cta-main' href='http://web.media.mit.edu/~annyuan/schelling_axelrod/' target='_blank'>View project</a><p>This simulation explores opinion formation. It's inspired by the work of Thomas Schelling on racial segregation, and Robert Axelrod on the dissemination of culture.</p><br/><div class='section-header'>The model</div><p>Agents (pixels) fill 75% of the canvas. They're randomly initialized with 5 features: (1) membership in either group 1 or 0 - which is immutable, and (2)(3)(4)(5) features, with a value from 0 to 255, which can change when agents interact with each other. Agents that fall within a central circular region are initialized with the same values for features 2 through 5.</p><p>Each iteration, agents learn from their spatial neighborhood by selecting a neighbor and adopting one of their features. A neighbor's chance of selection is proportional to their similarity to the agent. Agents can also move elsewhere in their spatial neighborhood to be closer to more similar neighbors.</p><br/><div class='section-header'>Results</div><p>In the figure above, the left panel is colored by group membership (red is 0, blue is 1). The center panel is colored by group membership, but the color is multiplied by a matrix constructed out of the agent's learned feature values. The right panel is colored by one of the agent's learned features (yellow is 0, blue is 255).</p><p>You'll notice that, while agents cluster by both group membership and learned features, group membership almost completely determines where empty space will appear on the lattice. The effect is confirmed by the fact that within the central circular region (where agents were initialized to have the same values for the learnable features), larger group membership-based clusters form. Outside the circle, you see pockets where the diversity of learned features was apparently able to prevent clean separation by group membership.</p><p>If we don't allow agents to learn from each other, we get very different results after 5000 iterations:</p><img src='images/project_schelling/schelling_no_learn.jpg'><p>You still see segregation by group membership and learned features, but the homogeneous regions become very small for group membership (left panel), and even smaller for learned features (right panel).</p><p>If we allow agents to learn, but don't allow them to move, we get this:</p><img src='images/project_schelling/schelling_no_move.jpg' /><p>What's interesting is that for learned features, you see regions of segregation roughly the same size as when agents are allowed to move. Feature values also change much more frequently, which supports the intuition that if you can't find better friends somewhere else, you might as well try to get along with (assimilate to) the people nearby.</p><br/><div class='section-header'>Technology</div><p>WebGL.</p>"
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

      
      
      },
      destroy: function() {
        window.clearInterval(this.intervalID);
      }
    };
    return schelling;
  });