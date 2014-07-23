require.config({
    paths: {
      'jquery': 'lib/jquery',
      'd3': 'lib/d3',
      'fisheye': 'lib/fisheye',
      'handlebars': 'lib/handlebars',
      'underscore': 'lib/underscore',
      'paper': 'lib/paper'
    },
    shim: {
    	'fisheye': {
    		deps: ['d3.global']
    	},
        'handlebars': {
            exports: 'Handlebars'
        },
        'paper': {
            exports: 'paper'
        }
    }
});

var requestAnimationFrame = window.requestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame;

define("d3.global", ["d3"], function(_) {
	d3 = _;
});

require(['jquery', 'router'], function($, Router) {

    var router = new Router();

    router.registerRoute('projects/{projectid}', function(id) {
    	require(["projects/" + id], function(projectModule) {
    		projectModule.initialize();
    	});
    });

    router.registerRoute('projects', function() {
        require(["projects"], function(projects) {
            projects.initialize();
        });
    });

    router.registerRoute('', function() {
        require(["home"], function(home) {
            home.initialize();
        });
    }, function() {
        require(["home"], function(home) {
            home.destroy();
        });
    });

    $(window).on("hashchange", function() {
        router.applyRoute(window.location.hash.split('#')[1]);
    })

    $(document).ready(function() {
        router.applyRoute(window.location.hash.split('#')[1]);
    })
    
});

// TO FADE TRANSITION BETWEEN VIEWS:
// 
// 1) Refactor registerRoute stuff above to a single function
// 2) On hashchange, show the spinner, fade out the current view
// 3) Within the refactored registerRoute function, before calling initialize, hide the spinner and fade in the new view
