require.config({
    paths: {
      'jquery': 'lib/jquery'
    }
});

require(['jquery', 'router'], function($, Router) {

    $("#menu .link").on("click", function() {
    	if(!$("body").hasClass("open-nav")) {
    		$("nav [id$='nav'].active").removeClass("active");
    		$("nav").find("#" + $(this).attr("id") + "-nav").addClass("active");
    		$("body").addClass("open-nav");
    	} else {
    		if($("nav [id$='nav'].active").attr("id").indexOf($(this).attr("id")) > -1) {
    			$("body").removeClass("open-nav");
    		} else {
    			$("nav [id$='nav'].active").removeClass("active");
    			$("nav").find("#" + $(this).attr("id") + "-nav").addClass("active");
    		}
    	}
    });

    var router = new Router();

    router.registerRoute('projects/{projectid}', function(id) {
    	require(["projects/" + id], function(projectModule) {
    		projectModule.initialize();
    	});
    });

    $("nav a").on("click", function() {
    	$("body").removeClass("open-nav");
    });

    window.onhashchange = function() {
        router.applyRoute(window.location.hash.split('#')[1]);
    }
    
});