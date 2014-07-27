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

    var router = new Router(),
        initialize = function(module) {
            module.initialize();
        };

    router.registerRoute('projects/{projectid}', function(id) {
    	require(["projects/" + id], function(projectModule) {
    		initialize(projectModule);
    	});
    });

    router.registerRoute('projects', function() {
        require(["projects"], function(projects) {
            initialize(projects);
        });
    });

    router.registerRoute('log/{logid}', function(id) {
        require(["log/" + id], function(logModule) {
            initialize(logModule);
        });
    });

    router.registerRoute('log', function() {
        require(["log"], function(log) {
            initialize(log);
        });
    });

    router.registerRoute('', function() {
        require(["home"], function(home) {
            initialize(home);
        });
    }, function() {
        require(["home"], function(home) {
            home.destroy();
        });
    });

    $(window).on("hashchange", function() {
        $("#view").addClass("faded");
        router.applyRoute(window.location.hash.split('#')[1]);
    });

    $(document).ready(function() {
        router.applyRoute(window.location.hash.split('#')[1]);
    })

});
