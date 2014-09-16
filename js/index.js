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

require(['jquery', 'router', 'loader'], function($, Router, Loader) {

    var router = new Router(),
        initialize = function(module) {
            if(module.needsLoading) {
                $("html").addClass("loading");
                var el, imageCounter = 0;
                module.preloadAssets.forEach(function(d) {
                    el = document.createElement('img');
                    el.setAttribute('src', 'images/' + d);
                    $("#stash").append(el);
                    $(el).on("load", function() {
                        imageCounter++;
                        if(imageCounter == module.preloadAssets.length) {
                            module.needsLoading = false;
                            $("html").removeClass("loading");
                            module.initialize();
                        }
                    })
                })
            } else {
                $("html").removeClass("loading");
                module.initialize();
            }
        };

    router.registerRoute('projects/{projectid}', function(id) {
    	require(["projects/" + id], function(projectModule) {
    		initialize(projectModule);
    	});
    }, function(id) {
        require(["projects/" + id], function(projectModule) {
            if(projectModule.destroy) projectModule.destroy();
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
    }, function(id) {
        require(["log/" + id], function(logModule) {
            if(logModule.destroy) logModule.destroy();
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
        router.applyRoute(window.location.hash.split('#')[1]);
    });

    $(document).ready(function() {
        router.applyRoute(window.location.hash.split('#')[1]);
    })

});
