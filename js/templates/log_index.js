define(['handlebars'], function(Handlebars) {
return Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n	    <li>\n	    	<a href=\"#log/"
    + escapeExpression(((helper = helpers.title || (depth0 && depth0.title)),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "\">\n	    		<div class=\"title\">"
    + escapeExpression(((helper = helpers.title || (depth0 && depth0.title)),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n	    		<div class=\"description\">&mdash; "
    + escapeExpression(((helper = helpers.description || (depth0 && depth0.description)),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper)))
    + " &mdash;</div>\n    		</a>\n	    </li>\n    ";
},"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<nav>\n  <div class=\"explanation\">This is a log of my media consumption.</div>\n	";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n</nav>";
},"useData":true});
});