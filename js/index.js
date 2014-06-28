require.config({
    paths: {
      'jquery': 'lib/jquery'
    },
    shim: {

    }
});

require(['jquery'], function() {
    
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
    
});