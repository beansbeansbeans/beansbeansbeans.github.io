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
        description: "<div class='section-header'>Overview</div><p><a href='https://oughtness.cc' target='_blank'>Oughtness</a> is a tool for prioritizing causes through crowdsourcing. On the <a href='https://oughtness.cc' target='_blank'>voting</a> page, users are asked to compare two causes at a time in terms of their criticalness or tractability. The <a href='https://oughtness.cc/data' target='_blank'>data</a> page shows the causes ranked by priority according to all the votes collected on the site. Oughtness is inspired by the <a href='http://gif.gf/' target='_blank'>GifGif</a> and <a href='http://pulse.media.mit.edu/' target='_blank'>Place Pulse</a> projects.</p><br/><div class='section-header'>What's the point?</div><p>I built Oughtness in hopes that the data collected through the site could contribute to research on cause prioritization - a field concerned with the question of where humanity should apply its resources in order to achieve the greatest positive impact.</p><br/><div class='section-header'>Methodology</div><p>Oughtness is heavily influenced by <a href='http://www.givewell.org/' target='_blank'>GiveWell</a>, a charity research organization. The twelve causes presented on the site are from their <a href='http://blog.givewell.org/2014/05/22/narrowing-down-u-s-policy-areas/' target='_blank'>list</a> of policy areas most worthy of greater investment, and criticalness and tractability are two criteria from their <a href='https://80000hours.org/2013/12/a-framework-for-strategically-selecting-a-cause/' target='_blank'>framework</a> for evaluating causes.</p><p>I adapted the <a target='_blank' href='https://www.wikipedia.com/en/Analytic_hierarchy_process'>analytic hierarchy process</a> (AHP) in order to derive overall rankings for the causes from pairwise comparison data*. The AHP is a widely used technique for making complex decisions involving multiple alternatives and criteria.</p><p>The slider on the data page carries out the final phase of the AHP: weighting criteria to determine the best alternative. Or more specifically: weighting criticalness versus tractability to determine the cause that most deserves humanity's attention.</p><div class='caveat'>* I'm deviating from the AHP in several ways: (1) I am determining each cause's weight on the Fundamental Scale for Pairwise Comparisons (FSPC) by linearly interpolating from its favorability among voters to the FSPC. For example, if 100% of voters preferred cause A to cause B with respect to dimension Y, then A would be assigned a 9 (the FSPC's highest value). If 50% of voters preferred cause A to cause B with respect to dimension Y, then A would be assigned a 5. (2) In processing the matrices for each dimension, rather than finding each cause's principal right eigenvector, I sum its relative weights.</div>"
      };

      $("#view").html(projectTemplate(data));

      
      },
      destroy: function() {
        window.clearInterval(this.intervalID);
      }
    };
    return oughtness;
  });