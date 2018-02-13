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
        description: "<a class='cta-main' href='http://electome.org' target='_blank'>View project</a><p>The purpose of TweetVista is to enable users to quickly see the major threads of discussion in a large dataset of Tweets (which would otherwise requiring reading a massive sample of the Tweets). The tool visually separates Tweets into semantically related clusters, and surfaces the most representative Tweet from each cluster.</p><p>TweetVista is a desktop web application best viewed with Google Chrome. Upon loading TweetVista, users see a visualization of election-related Tweets made between May and September 2016. Each illuminated particle represents a Tweet. Tweets are characterized with ~500-dimensional feature vectors learned by an encoder-decoder system, and projected into three dimensions using the t-SNE algorithm. Tweets are colored by the semantic cluster they belong to. Representative Tweets are shown in the right-hand panel.</p><p>Users can visualize other datasets by making a selection within a pop-up menu that appears when they click on the title of the interface. Users can zoom into the cloud of Tweets by using their mouse wheel or trackpad, they can rotate it by dragging along the interface, and they can also pan the cloud’s position by pressing their arrow keys. Users can see the text, author, and date of each Tweet by hovering over it. Users can filter the Tweets shown by content properties such as the civility of the Tweet (e.g., whether the Tweet contains profanity), or properties of the author such as whether the account is verified, the author’s number of followers, statuses, followees, etc. Users can also filter the date range from which data is drawn by manipulating the timeline at the bottom of the interface. They can select a particular pre-defined date interval, or press the “play” icon, which allows them to see the clusters forming over time.</p><br/><div class='section-header'>Technology</div><p>TweetVista is built with THREE.js and React.</p>"
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