define(['handlebars'], function(Handlebars) {
return Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n				<a href=\"#log/"
    + escapeExpression(((helper = helpers.previous || (depth0 && depth0.previous)),(typeof helper === functionType ? helper.call(depth0, {"name":"previous","hash":{},"data":data}) : helper)))
    + "\" id=\"previous\">previous</a>\n			";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n				<a href=\"#log/"
    + escapeExpression(((helper = helpers.next || (depth0 && depth0.next)),(typeof helper === functionType ? helper.call(depth0, {"name":"next","hash":{},"data":data}) : helper)))
    + "\" id=\"next\">next</a>\n			";
},"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"log\" id=\"log-"
    + escapeExpression(((helper = helpers.title || (depth0 && depth0.title)),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "\">\n	<a href=\"#log\" class=\"back\">back</a>\n	<div class=\"log-contents\">\n		";
  stack1 = ((helper = helpers.logContents || (depth0 && depth0.logContents)),(typeof helper === functionType ? helper.call(depth0, {"name":"logContents","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		<div class=\"canvas-wrapper\">\n			<canvas id=\"fft\"></canvas>\n			<canvas id=\"letters\" ></canvas>\n		</div>\n		<div class=\"header\">\n			<div class=\"slider\">\n				<div class=\"label\">Guilt: </div>\n				<div class=\"bar\">\n					<div style=\"left: 20%;\" class=\"highlight\"></div>\n				</div>\n			</div>\n		</div>\n		<div id=\"audio\"></div>\n		<div id=\"controls\">\n			";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.previous), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.next), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n			<div id=\"toggler\"></div>\n			<div id=\"time\">\n				<div class=\"elapsed\">0</div>\n				/\n				<div class=\"total\"></div>\n			</div>\n		</div>\n	</div>\n</div>\n";
},"useData":true});
});