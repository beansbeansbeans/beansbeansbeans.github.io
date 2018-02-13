define(['templates/project_detail', 'project_data'], function(projectTemplate, projectData) {
  var electome = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "electome",
        title: "<a href='http://electome.org' target='_blank'>electome</a>",
        blurb: "Analyzing the conversation around the 2016 US presidential election.",
        projectContents: '<div class="iframe_wrapper"><iframe width="600" height="337" src="https://www.youtube.com/embed/auSNAzKGzdg" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>',
        caption: "",
        description: "<a class='cta-main' href='http://electome.org' target='_blank'>View project</a><p>The Electome is a project by the <a href='https://www.media.mit.edu/groups/social-machines/overview/' target='_blank'>Laboratory for Social Machines at the MIT Media Lab</a>. The Electome surfaced and tracked 2016 U.S. election issues the public cares about. Using machine learning, natural language processing, and network analysis, we explored how the campaign journalism, the messaging of the candidates, and the public’s response in the digital sphere converged to shape the presidential election’s most important narratives as well as its outcome.</p><p>My colleagues and I built a dashboard that enabled journalists to explore the data gathered by the Electome, providing analytics to drive election coverage at leading newsrooms including <a href='https://www.washingtonpost.com/news/the-fix/wp/2016/10/19/trump-is-all-the-talk-on-twitter-in-battleground-states-but-the-focus-on-issues-ranges-widely/' target='_blank'>The Washington Post</a>, <a href='https://www.bloomberg.com/news/articles/2016-05-02/missing-from-2016-race-sense-of-urgency-over-u-s-budget-gaps' target='_blank'>Bloomberg News</a>, and <a href='https://news.vice.com/en_us/article/d3xamx/journalists-and-trump-voters-live-in-separate-online-bubbles-mit-analysis-shows' target='_blank'>Vice News</a>.</p><br/><div class='section-header'>Technology</div><p>The Electome dashboard was built with d3 and React.</p>"
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
    return electome;
  });