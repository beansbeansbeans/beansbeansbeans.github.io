define(['handlebars'], function(Handlebars) {
return Handlebars.template({"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"log\" id=\"log-"
    + escapeExpression(((helper = helpers.title || (depth0 && depth0.title)),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "\">\n	<a href=\"#log\" class=\"back\">back</a>\n	<div class=\"title date\">"
    + escapeExpression(((helper = helpers.date || (depth0 && depth0.date)),(typeof helper === functionType ? helper.call(depth0, {"name":"date","hash":{},"data":data}) : helper)))
    + "</div>\n	<div class=\"log-contents\">\n		";
  stack1 = ((helper = helpers.logContents || (depth0 && depth0.logContents)),(typeof helper === functionType ? helper.call(depth0, {"name":"logContents","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n		<div class=\"canvas-wrapper\">\n			<canvas id=\"fft\"></canvas>\n			<canvas id=\"letters\" ></canvas>\n		</div>\n		<div class=\"header\">\n			<div class=\"slider\">\n				<div class=\"label\">wastefulness: </div>\n				<div class=\"bar\">\n					<div class=\"color\"></div>\n					<div class=\"color\"></div>\n					<div class=\"color\"></div>\n					<div class=\"color\"></div>\n					<div class=\"color\"></div>\n				</div>\n			</div>\n		</div>\n		<div id=\"audio\"></div>\n		<div id=\"controls\">\n			<a href=\"#log/"
    + escapeExpression(((helper = helpers.previous || (depth0 && depth0.previous)),(typeof helper === functionType ? helper.call(depth0, {"name":"previous","hash":{},"data":data}) : helper)))
    + "\" id=\"previous\"><svg><path d=\"M21.871,9.814 15.684,16.001 21.871,22.188 18.335,25.725 8.612,16.001 18.335,6.276z\"></path></svg></a>\n			<div class=\"playing\" id=\"toggler\">\n				<svg>\n					<circle stroke-dasharray=\"0 1000\" r=\"23\" cx=\"24\" cy=\"24\"></circle>\n					<path id=\"play_path\" d=\"M11.166,23.963L22.359,17.5c1.43-0.824,1.43-2.175,0-3L11.166,8.037c-1.429-0.826-2.598-0.15-2.598,1.5v12.926C8.568,24.113,9.737,24.789,11.166,23.963z\"></path>\n					<path id=\"pause_path\" d=\"M5.5,5.5h20v20h-20z\"></path>\n				</svg>\n				<div class=\"pause-mask\"></div>\n			</div>\n			<a href=\"#log/"
    + escapeExpression(((helper = helpers.next || (depth0 && depth0.next)),(typeof helper === functionType ? helper.call(depth0, {"name":"next","hash":{},"data":data}) : helper)))
    + "\" id=\"next\"><svg><path d=\"M10.129,22.186 16.316,15.999 10.129,9.812 13.665,6.276 23.389,15.999 13.665,25.725z\"></path></svg></a>\n		</div>\n	</div>\n</div>\n";
},"useData":true});
});