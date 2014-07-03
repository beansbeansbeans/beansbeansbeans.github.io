define(['handlebars'], function(Handlebars) {
return Handlebars.template({"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "<div class=\"project\">\n	\n	<div class=\"header\">\n		<div class=\"title\">"
    + escapeExpression(((helper = helpers.title || (depth0 && depth0.title)),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n		<div class=\"blurb\">"
    + escapeExpression(((helper = helpers.blurb || (depth0 && depth0.blurb)),(typeof helper === functionType ? helper.call(depth0, {"name":"blurb","hash":{},"data":data}) : helper)))
    + "</div>\n	</div>\n	<div class=\"project-contents\">\n		<canvas></canvas>\n		<div class=\"caption\">"
    + escapeExpression(((helper = helpers.caption || (depth0 && depth0.caption)),(typeof helper === functionType ? helper.call(depth0, {"name":"caption","hash":{},"data":data}) : helper)))
    + "</div>\n	</div>\n	<div class=\"description\">"
    + escapeExpression(((helper = helpers.description || (depth0 && depth0.description)),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper)))
    + "</div>\n	\n</div>";
},"useData":true});
});