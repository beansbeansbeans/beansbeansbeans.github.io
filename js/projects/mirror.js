define(['templates/project_detail', 'project_data'], function(projectTemplate, projectData) {
  var mirror = {
    intervalID: null,
    initialize: function() {
      var data = {
        identifier: "mirror",
        title: "<a href='http://socialmirror.media.mit.edu/' target='_blank'>mirror</a>",
        blurb: "Exploring social media echo chambers.",
        projectContents: '<a href="http://socialmirror.media.mit.edu/" target="_blank" class="chrome"><div class="chrome-controls"><div class="close"></div><div class="min"></div><div class="max"></div></div><div class="contents"><video src="/video/mirror.mp4"></video></div></a>',
        caption: "",
        description: "<a class='cta-main' href='http://socialmirror.media.mit.edu/' target='_blank'>View project</a><p>Social Mirror is a web application that allows users to explore a sample of their politically-active Twitter connections.  These connections are visually-depicted in the form of a social network.  The network is derived from a sample of 1.1M Twitter users who participated on in the conversation about the US Presidential Election on the platform during summer 2016 (i.e., between June and mid-September 2016).</p><p>The social network is visualized using a 3-d force directed layout algorithm, which positions accounts with more shared social connections closer together and reveals the social structures in the underlying network. Interestingly, the visualized network contains two major clusters: one includes a small, tightly-bound set of politically right-leaning accounts, and the other includes a larger set of both right and left-leaning accounts.  Because of the computational expense of dynamically fetching and building the M-degree Twitter social network centered on an arbitrary Twitter user (for some integer M > 1), we limit use of Social Mirror to only those ~32k accounts in the 4-core of the larger mutual follower network derived from our sample of 1.1M users.</p><br/><div class='section-header'>The user experience</div><p>Upon logging into the application, the user answer a series of questions regarding the nature of her engagement in political discourse on Twitter (details provided in the next section).  Next, the application presents to the user a network visualization of some of their immediate Twitter followers and friends.  It then expands to show the entire ~900 node visualization.  The user is encouraged to explore the network by zooming and rotating it.  She can also hover over and highlight groups of accounts to browse which election-related tweets they made during summer 2016.  The application then asks the user to to locate herself within the network by clicking on the node that she believes represents her Twitter account. After she makes her guess, the tool reveals her ``true'' position and indicates how many degrees away it is from the user's guessed location. Depending on which experimental treatment the user is enrolled in, she may also see: a) a number between 0 and 1, which indicates how politically diverse her connections are with respect to political ideology, and b) a list of suggested accounts to follow that would increase her diversity score. Finally, the user is asked to complete a post-survey which consists of the same questions that they answered at the beginning of the experience.</p><br/><div class='section-header'>Technology</div><p>The application is optimized for the Chrome and Firefox browsers. We used the THREE JavaScript library for WebGL rendering of nodes and edges. We used the JavaScript library Preact, a stripped down version of React, to manage state on the client. The server is a Flask application hosted on AWS.</p>"
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
      var script = [ 0, 2, 8.7, 13 ];
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
      // video.addEventListener("timeupdate", function() {
      //   if(video.currentTime > script[scriptIndex]) {
      //     $(".caption").attr("data-active-caption", scriptIndex);
      //     scriptIndex++;
      //   }
      // });
      
      },
      destroy: function() {
        window.clearInterval(this.intervalID);
      }
    };
    return mirror;
  });