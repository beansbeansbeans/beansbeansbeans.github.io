define([], function() {

    var Route = function() {
    	this.route = arguments[0].route;
    	this.fn = arguments[0].fn;
        this.destroyFn = arguments[0].destroyFn;
        this.scope = arguments[0].scope ? arguments[0].scope : null;
    	this.rules = arguments[0].rules ? arguments[0].rules : {};

    	this.routeArguments = [];

    	this.routeParts = this.route.split("/");
    	for(var i=0; i<this.routeParts.length; i++) {
    		var rPart = this.routeParts[i];

    		if(rPart.substr(0,1) == "{") {
    			var rKey = rPart.substr(1, rPart.length - 2);
    			this.routeArguments.push(rKey);
    		}
    	}
    };

    Route.prototype.matches = function(route) {
    	var incomingRouteParts = route.split("/");
    	var routeMatches = true;

    	if(incomingRouteParts.length < this.routeParts.length) {
    		routeMatches = false;
    	} else {
    		for(var i=0; i<incomingRouteParts.length; i++) {
    			var iRp = incomingRouteParts[i],
    				rP = this.routeParts[i];
    			if(typeof rP == 'undefined') {
    				routeMatches = false;
                    break;
    			} else {
    				var cP0 = rP.substr(0, 1);
    				if(cP0!="{") {
    					if(iRp != rP) {
	    					routeMatches = false;
                            break;
    					}
    				} else {
    					routeMatches = true;
    				}
    			}
    		}
    	}

    	return routeMatches;
    };

    Route.prototype.getArgumentsValues = function(route) {
    	var rRouteParts = route.split("/"),
    		rArray = [];

    	for(var i=0; i<this.routeParts.length; i++) {
    		var rP = this.routeParts[i],
    			cP0 = rP.substr(0, 1);
    		if(cP0 == "{") {
    			rArray[rArray.length] = rRouteParts[i];
    		}
    	}

    	return rArray;
    };

    var Router = function() {
    	this.routes = [];
        this.currentRoute = null;
    };

    Router.prototype.registerRoute = function(route, fn, destroyFn) {

    	var scope = {},
            destroyFn = destroyFn ? destroyFn : function() {};

    	return this.routes[this.routes.length] = new Route({
    		route: route,
    		fn: fn,
    		scope: scope,
            destroyFn: destroyFn
    	});

    };

    Router.prototype.applyRoute = function(route) {

        if(this.currentRoute != null) {
            for(var i=0; i<this.routes.length; i++) {
                var sRoute = this.routes[i];
                if (sRoute.matches(this.currentRoute)) {
                    sRoute.destroyFn.apply(sRoute.scope, sRoute.getArgumentsValues(this.currentRoute));
                }
            }
        }

        if(route == undefined) route = "";

        $("#menu .link").removeClass("active");
        $("#menu .link[href=#" + route.split("/")[0] + "]").addClass("active");

    	for(var i=0; i<this.routes.length; i++) {
    		var sRoute = this.routes[i];
    		if (sRoute.matches(route)) {
    			sRoute.fn.apply(sRoute.scope, sRoute.getArgumentsValues(route));
                this.currentRoute = route;
    		}
    	}
    };

    return Router;

});


