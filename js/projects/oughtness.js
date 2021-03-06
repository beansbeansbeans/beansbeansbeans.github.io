define(['templates/project_detail', 'project_data'], function(projectTemplate, projectData) {
  var oughtness = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "oughtness",
        title: "<a href='https://oughtness.cc/vote/criticalness-of-defense-policy-vs-education-policy' target='_blank'>Oughtness</a>",
        blurb: "Crowdsourcing cause prioritization",
        projectContents: '<a href="https://oughtness.cc/vote/criticalness-of-defense-policy-vs-education-policy" target="_blank" class="chrome"><div class="chrome-controls"><div class="close"></div><div class="min"></div><div class="max"></div></div><div class="contents"><video src="/video/oughtness.mp4"></video></div></a>',
        caption: "<div class='loading'>Loading video...</div><div class='caption-0'>Vote on the most critical causes.</div><div class='caption-1'>See how others have voted.</div><div class='caption-2'>See priorities change depending on how you weight criticalness versus tractability.</div><div class='caption-3'>Drill down to see how causes compare against each other.</div>",
        description: "<a class='cta-main' href='https://oughtness.cc/vote/criticalness-of-defense-policy-vs-education-policy' target='_blank'>View project</a><p><a href='https://oughtness.cc/vote/criticalness-of-defense-policy-vs-education-policy' target='_blank'>Oughtness</a> is a tool for prioritizing causes through crowdsourcing. On the <a href='https://oughtness.cc/vote/criticalness-of-defense-policy-vs-education-policy' target='_blank'>voting</a> page, users compare two causes at a time in terms of their criticalness or tractability. The <a href='https://oughtness.cc/data' target='_blank'>data</a> page shows the causes ranked by priority based on all the votes collected on the site. Oughtness is inspired by the <a href='http://gif.gf/' target='_blank'>GifGif</a> and <a href='http://pulse.media.mit.edu/' target='_blank'>Place Pulse</a> projects.</p><br/><div class='section-header'>What's the point?</div><p>I hope the data collected through Oughtness can contribute to research on cause prioritization - a field concerned with the question of how humanity should allocate its resources in order to achieve the greatest positive impact. Traditionally, specialized practitioners rely on economic models to estimate priority for each cause in isolation. By contrast, Oughtness asks a crowd of non-specialists—users—to make head-to-head comparisons between causes through questions such as: “Which is more critical, climate change or immigration reform?” There is <a href='http://rationalaltruist.com/2013/04/28/estimates-vs-head-to-head-comparisons/' target='_blank'>evidence</a> that the latter approach to determining priority may have certain advantages.</p><br/><div class='section-header'>Methodology</div><p>Oughtness is heavily influenced by <a href='http://www.givewell.org/' target='_blank'>GiveWell</a>, a charity research organization. The twelve causes presented on the site are from their <a href='http://blog.givewell.org/2014/05/22/narrowing-down-u-s-policy-areas/' target='_blank'>list</a> of policy areas most worthy of greater investment, and criticalness and tractability are two criteria from their <a href='https://80000hours.org/2013/12/a-framework-for-strategically-selecting-a-cause/' target='_blank'>framework</a> for evaluating causes.</p><p>I adapted the <a target='_blank' href='https://en.wikipedia.org/wiki/Analytic_hierarchy_process'>analytic hierarchy process</a> (AHP) in order to derive overall rankings for the causes from pairwise comparison data*. The AHP is a widely used technique for making complex decisions involving multiple alternatives and criteria.</p><p>The slider on the <a target='_blank' href='https://oughtness.cc/data'>data</a> page carries out the final step of the AHP: weighting criteria to determine the best alternative. Or more specifically: weighting criticalness versus tractability to determine the cause that most deserves humanity's attention.</p><br/><div class='section-header'>Technology</div><p>Oughtness is built with <a target='_blank' href='http://d3js.org/'>d3</a>, <a target='_blank' href='https://nodejs.org/en/'>Node</a>, and <a target='_blank' href='https://mongodb.com'>MongoDB</a>.</p><div class='caveat'>* I deviate from the AHP in several ways: (1) I determine each cause's weight on the <a target='_blank' href='http://www.palgrave-journals.com/jba/journal/v4/n3/fig_tab/jba200834t1.html'>Fundamental Scale for Pairwise Comparisons</a> (FSPC) by linearly interpolating from its favorability among voters to the FSPC. For example, if 100% of voters preferred cause A to cause B with respect to dimension Y, then A would be assigned a 9 (the FSPC's highest value). If 50% of voters preferred cause A to cause B with respect to dimension Y, then A would be assigned a 5. (2) In processing the matrices for each dimension, rather than finding each cause's principal right eigenvector, I sum its relative weights.</div>"
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

      var video = $("video").get(0);
      var script = [ 0, 5.5, 9, 14 ];
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
    return oughtness;
  });