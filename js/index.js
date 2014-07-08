require.config({
    paths: {
      'jquery': 'lib/jquery',
      'd3': 'lib/d3',
      'fisheye': 'lib/fisheye',
      'handlebars': 'lib/handlebars',
      'underscore': 'lib/underscore'
    },
    shim: {
    	'fisheye': {
    		deps: ['d3.global']
    	},
        'handlebars': {
            exports: 'Handlebars'
        }
    }
});

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
    });

    $(window).on("hashchange", function() {
        router.applyRoute(window.location.hash.split('#')[1]);
    })

    $(document).ready(function() {
        router.applyRoute(window.location.hash.split('#')[1]);
    })
    
});