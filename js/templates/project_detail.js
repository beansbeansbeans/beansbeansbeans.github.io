define(['handlebars'], function(Handlebars) {
return Handlebars.template({"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"project\" id=\"project-"
    + escapeExpression(((helper = helpers.identifier || (depth0 && depth0.identifier)),(typeof helper === functionType ? helper.call(depth0, {"name":"identifier","hash":{},"data":data}) : helper)))
    + "\">\n	<a href=\"#projects/"
    + escapeExpression(((helper = helpers.next || (depth0 && depth0.next)),(typeof helper === functionType ? helper.call(depth0, {"name":"next","hash":{},"data":data}) : helper)))
    + "\" id=\"next\" data-active='"
    + escapeExpression(((helper = helpers.nextActive || (depth0 && depth0.nextActive)),(typeof helper === functionType ? helper.call(depth0, {"name":"nextActive","hash":{},"data":data}) : helper)))
    + "'>\n		<div class=\"project-preview\">"
    + escapeExpression(((helper = helpers.next || (depth0 && depth0.next)),(typeof helper === functionType ? helper.call(depth0, {"name":"next","hash":{},"data":data}) : helper)))
    + "</div>\n		<svg><path d=\"M10.129,22.186 16.316,15.999 10.129,9.812 13.665,6.276 23.389,15.999 13.665,25.725z\"></path></svg>\n	</a>\n	<a href=\"#projects/"
    + escapeExpression(((helper = helpers.previous || (depth0 && depth0.previous)),(typeof helper === functionType ? helper.call(depth0, {"name":"previous","hash":{},"data":data}) : helper)))
    + "\" id=\"previous\" data-active='"
    + escapeExpression(((helper = helpers.previousActive || (depth0 && depth0.previousActive)),(typeof helper === functionType ? helper.call(depth0, {"name":"previousActive","hash":{},"data":data}) : helper)))
    + "'>\n		<div class=\"project-preview\">"
    + escapeExpression(((helper = helpers.previous || (depth0 && depth0.previous)),(typeof helper === functionType ? helper.call(depth0, {"name":"previous","hash":{},"data":data}) : helper)))
    + "</div>\n		<svg><path d=\"M21.871,9.814 15.684,16.001 21.871,22.188 18.335,25.725 8.612,16.001 18.335,6.276z\"></path></svg>\n	</a>\n	<a href=\"#projects\" class=\"back\">back</a>\n	<div class=\"header\">\n		<div class=\"title\">";
  stack1 = ((helper = helpers.title || (depth0 && depth0.title)),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n		<div class=\"blurb\">"
    + escapeExpression(((helper = helpers.blurb || (depth0 && depth0.blurb)),(typeof helper === functionType ? helper.call(depth0, {"name":"blurb","hash":{},"data":data}) : helper)))
    + "</div>\n	</div>\n	<div class=\"project-contents\">\n		";
  stack1 = ((helper = helpers.projectContents || (depth0 && depth0.projectContents)),(typeof helper === functionType ? helper.call(depth0, {"name":"projectContents","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</div>\n	<div class=\"caption\">";
  stack1 = ((helper = helpers.caption || (depth0 && depth0.caption)),(typeof helper === functionType ? helper.call(depth0, {"name":"caption","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n	<div class=\"description\">";
  stack1 = ((helper = helpers.description || (depth0 && depth0.description)),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "</div>\n\n</div>";
},"useData":true});
});