define(['handlebars'], function(Handlebars) {
return Handlebars.template({"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"log\" id=\"log-"
    + escapeExpression(((helper = helpers.title || (depth0 && depth0.title)),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "\">\n	<a href=\"#log\" class=\"back\">back</a>\n	<div class=\"log-contents\">\n		";
  stack1 = ((helper = helpers.logContents || (depth0 && depth0.logContents)),(typeof helper === functionType ? helper.call(depth0, {"name":"logContents","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n		<div class=\"canvas-wrapper\">\n			<canvas id=\"fft\"></canvas>\n			<canvas id=\"letters\" ></canvas>\n		</div>\n		<div class=\"header\">\n			<div class=\"slider\">\n				<div class=\"label\">Guilt: </div>\n				<div class=\"bar\">\n					<div style=\"left: 20%;\" class=\"highlight\"></div>\n				</div>\n			</div>\n		</div>\n		<div id=\"audio\"></div>\n		<div id=\"controls\">\n			<a href=\"#log/"
    + escapeExpression(((helper = helpers.previous || (depth0 && depth0.previous)),(typeof helper === functionType ? helper.call(depth0, {"name":"previous","hash":{},"data":data}) : helper)))
    + "\" id=\"previous\"><svg><path d=\"M21.871,9.814 15.684,16.001 21.871,22.188 18.335,25.725 8.612,16.001 18.335,6.276z\"></path></svg></a>\n			<div id=\"toggler\"></div>\n			<div id=\"time\">\n				<div class=\"elapsed\">0</div>\n				/\n				<div class=\"total\"></div>\n			</div>\n			<a href=\"#log/"
    + escapeExpression(((helper = helpers.next || (depth0 && depth0.next)),(typeof helper === functionType ? helper.call(depth0, {"name":"next","hash":{},"data":data}) : helper)))
    + "\" id=\"next\"><svg><path d=\"M10.129,22.186 16.316,15.999 10.129,9.812 13.665,6.276 23.389,15.999 13.665,25.725z\"></path></svg></a>\n		</div>\n	</div>\n</div>\n";
},"useData":true});
});