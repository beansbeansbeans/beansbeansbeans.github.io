define(['lib/d3', 'underscore', 'templates/project_detail'], function(d3, _, projectTemplate) {
	var hiveplot = {
		initialize: function() {
			var data = {
				identifier: "hiveplot",
				title: "Hiveplot",
				blurb: "This is a visualization of dependencies in a CSS library. Each node represents a variable, mixin, or class, and each line represents a dependency. Hover over any node to see its name and dependencies.",
				projectContents: '<div id="hiveplot"><div id="changeTransition"><div class="collapser">Sort nodes <span>&#x25BC;</span></div><ul><li><a data-sort="natural" class="active">Natural</a></li><li><a data-sort="import">Import count</a></li></ul></div><div id="filters"><div class="collapser">Filter nodes <span>&#x25BC;</span></div><ul></ul></div><div id="chart"></div></div>',
				caption: "Built with d3js, a hiveplot graph plugin for d3js, and scalable vector graphics.",
				description: "This visualization is based on <a href='http://bost.ocks.org/mike/hive/' target='_blank'>Mike Bostock's implementation</a>.<br/><br/>Each node represents a variable, mixin, or class, and each line represents a dependency. You can hover over any node to see its name and dependencies. Nodes on the vertical axis have no dependents, nodes on the lower left-hand axis have no dependencies, and nodes on the lower right-hand axes have both. <br/><br/>By default, nodes are listed in the order of their appearance in the library. You can change this by selecting 'Import count' in the 'Sort nodes' dropdown menu, which will list nodes in the order of their dependencies count.<br/><br/>By default, nodes representing all stylistic categories (font-size, color, etc.) are shown. You can change this by unchecking categories in the 'Filter nodes' dropdown menu."
			};

			$("#view").html(projectTemplate(data));

			$(".collapser").on("click", function(e) {
			  e.stopPropagation();
			  $(this).parent().toggleClass("open")
			})
			$("html").on("click", function(event) {
			  var clicktarget = $(event.target);
			  if(!clicktarget.attr("data-sort") && ($("#changeTransition").hasClass("open") || $("#filters").hasClass("open"))) {
			    $("#changeTransition, #filters").removeClass("open")
			  }
			})
			$("#changeTransition a").click(function(e) {
			  e.preventDefault();
			  $("#changeTransition a").removeClass("active")
			  $(this).toggleClass("active")
			})
			d3.selection.prototype.moveToFront = function() {
			  return this.each(function(){
			    this.parentNode.appendChild(this);
			  });
			};
			var width = 1000,
			    height = 1000,
			    innerRadius = 20,
			    outerRadius = 550,
			    majorAngle = 2 * Math.PI / 3,
			    minorAngle = 1 * Math.PI / 12;
			var angle = d3.scale.ordinal()
			    .domain(["target", "source-target", "target-source", "source"])
			    .range([2 * majorAngle, majorAngle - minorAngle, majorAngle + minorAngle, 0]);
			var radius = d3.scale.linear()
			    .range([innerRadius, outerRadius]);
			var svg = d3.select("#chart").append("svg")
			    .attr("width", width)
			    .attr("height", height)
			  .append("g")
			    .attr("transform", "translate(250, 500)");
			d3.json("/js/projects/hiveplot.json", function(nodes) {
			  var nodesByName = {},
			      links = [],
			      formatNumber = d3.format(",d"),
			      newNodesByType = [],
			      checkedNodes = [],
			      currentlyVisibleNodes = [],
			      allPakages = [],
			      newNodesByType = [];
			  // Convert the import lists into links with sources and targets.
			  nodes.forEach(function(source) {
			    source.connectors = [];
			    nodesByName[source.name] = source;
			    if (source.imports) {
			      source.imports.forEach(function(targetName) {
			        var target = nodesByName[targetName];
			        if (!source.source) source.connectors.push(source.source = {node: source, degree: 0});
			        if (!target.target) target.connectors.push(target.target = {node: target, degree: 0});
			        links.push({source: source.source, target: target.target});
			      });
			    }
			  });
			  //if the node does not have a page value and is not the object of any import, remove it - problem is they are labeled "source" but are really "target"
			  // Determine the type of each node, based on incoming and outgoing links.
			  nodes.forEach(function(node) {
			    if (node.source && node.target) {
			      node.type = node.source.type = "target-source";
			      node.target.type = "source-target";
			    } else if (node.source && node.name.charAt(0) !== "%" && node.name.charAt(0) !== "$") {
			      node.type = node.source.type = "source";
			    } else if (node.target) {
			      node.type = node.target.type = "target";
			      allPakages.push(node.pakage[0])
			    } else {
			      node.type = "target";
			      node.unused = "true";
			    }
			  });
			  allPakages = _.uniq(allPakages)
			  allPakages.forEach(function(d, i) {
			    allPakages[i] = {};
			    allPakages[i].key = d;
			    allPakages[i].values = [];
			  })
			  // Construct an index by node name.
			  nodes.forEach(function(d) {
			    if (!d.pakage) {
			      d.pakage = []
			    }
			    if (!d.imports) {
			      d.imports = []
			    }
			    function populatePakage(importArray) {
			      importArray.forEach(function(singleImport, i) {
			        if (nodesByName[singleImport].pakage.length > 0) { //if that import is a primitive
			          d.pakage.push.apply(d.pakage, nodesByName[singleImport].pakage) //then copy its pakage over into the node
			        }
			        else {
			          populatePakage(singleImport.imports)
			        }
			      })
			    }
			    if (d.imports.length > 0) {
			      populatePakage(d.imports)
			    }
			    d.pakage = _.uniq(d.pakage);
			    allPakages.forEach(function(pakage, index) {
			      if (d.pakage.indexOf(pakage.key) !== -1) {
			        allPakages[index].values.push(d)
			      }  
			    })
			  });
			  currentlyVisibleNodes = nodes;
			  var nodesByType = d3.nest()
			      .key(function(d) { return d.type; })
			      .sortKeys(d3.ascending)
			      .sortValues(function(a, b) { return d3.ascending })
			      .entries(nodes);
			  var nodesByPakage = d3.nest()
			          .key(function(d) { return d.pakage; })
			          .sortKeys(d3.ascending)
			          .entries(nodes);
			  allPakages.forEach(function(d, i) {
			    $("#filters ul").append('<li><a class="active" data-sort="' + allPakages[i].key + '"> ' + allPakages[i].key + '</a></li>')
			  })
			  // Duplicate the target-source axis as source-target.
			  nodesByType.push({key: "source-target", values: nodesByType[2].values});
			  // Compute the rank for each type, with padding between pakages.
			  nodesByType.forEach(function(type) {
			    var count = 0;
			    type.values.forEach(function(d, i) {
			      if (!d.unused) {
			        d.index = count++;
			      }
			      else {
			        d.index = 0
			      }
			    });
			    type.count = count - 1;
			  });
			  // Set the radius domain.
			  radius.domain(d3.extent(nodes, function(d) { return d.index; }));
			  // Draw the axes.
			  svg.selectAll(".axis")
			      .data(nodesByType)
			    .enter().append("line")
			      .attr("class", "axis")
			      .attr("transform", function(d) { return "rotate(" + degrees(angle(d.key)) + ")"; })
			      .attr("x1", radius(-2))
			      .attr("x2", function(d) { return radius(d.count + 2) });
			  var flattenedLinks = [];
			  for (var k=0; k<links.length; k++) {
			    var linkArray = [];
			    if (links[k].source.node.index !== 0) {
			      linkArray.push(links[k]);
			      flattenedLinks.push(linkArray)
			    }
			  }
			  var flattenedNodes = [];
			  for (var i=0; i < nodes.length; i++) {
			    var connectors = nodes[i].connectors
			    for (var j=0; j < connectors.length; j++) {
			      var subArray = [];
			      if (nodes[i].index !== 0) {
			        subArray.push(connectors[j])
			        flattenedNodes.push(subArray)
			      }
			    }
			  }
			  draw();
			  // Draw the nodes. Note that each node can have up to two connectors,
			  // representing the source (outgoing) and target (incoming) links.
			  function draw() {
			    svg.append("g")
			      .attr("class", "links");
			    var linkGs = svg.select(".links").selectAll(".link")
			      .data(flattenedLinks);
			    linkGs.enter().append("g");
			    linkGs
			      .attr("class", "link")
			      .on("mouseover", linkMouseover)
			      .on("mouseout", mouseout)
			      .selectAll("path");
			    linkGs.exit().remove();
			    var linkPaths = linkGs.selectAll("path")
			           .data(function(d, i) { return d });
			    linkPaths.enter().append("path")
			    linkPaths
			      .transition().duration(500).attr("d", link()
			        .angle(function(d) { return angle(d.type) })
			        .radius(function(d) { return radius(d.node.index)}))
			    linkPaths.exit().remove();
			    svg.append("g")
			      .attr("class", "nodes");
			    var nodeGs = svg.select(".nodes").selectAll(".node").data(flattenedNodes);
			    var enter = nodeGs.enter().append("g")
			      .attr("transform", function(d) {
			        d[0].savedAngle = degrees(angle(d[0].type));
			        return "rotate(" + degrees(angle(d[0].type)) + "), translate(" + radius(d[0].node.index) + ")";
			      });
			    nodeGs
			      .attr("class", "node")
			      .transition().duration(500).attr("transform", function(d) { return "rotate(" + degrees(angle(d[0].type)) + "), translate(" + radius(d[0].node.index) + ")"; });
			    nodeGs
			      .on("mouseover", nodeMouseover)
			      .on("mouseout", mouseout);
			    nodeGs.exit()
			      .style("opacity", 1)
			      .transition()
			      .duration(500)
			      .style("opacity", 0)
			      .remove();
			    svg.selectAll(".node")
			        .data(flattenedNodes)  
			      .selectAll("circle")
			        .data(function(d) { return d })
			      .enter().append("circle")
			        .style("stroke", "white")
			        .style("fill", "#333")
			        .style("opacity", 1)
			        .attr("r", 3.5);
			    var nodeRect = svg.selectAll(".node").data(flattenedNodes).selectAll("rect").data(function(d) {
			      return d
			    })
			    nodeRect.enter().append("rect")
			      .attr("height", 25)
			      .attr("y", -10)
			      .attr("x", 25)
			      .style("fill", "#e766a5");
			    nodeRect
			      .attr("transform", function(d) { return "rotate(" + (-1) * degrees(angle(d.type)) + ")"});
			    nodeRect.exit().remove();
			    var nodeText = svg.selectAll(".node").data(flattenedNodes).selectAll("text").data(function(d) { return d });
			    nodeText.enter().append("text")
			      .attr("y", 6)
			      .attr("x", 35)
			      .attr("fill", "#FFF");
			    nodeText
			      .text(function(d) { return d.node.name })
			      .attr("transform", function(d) {
			        return "rotate(" + (-1) * degrees(angle(d.type)) + ")"; 
			      });
			    nodeText.exit().remove();
			    var nodeTriangle = svg.selectAll(".node").data(flattenedNodes).selectAll("polygon").data(function(d) { return d })
			    nodeTriangle.enter().append("polygon")
			      .attr("fill", "#e766a5")
			      .attr("points", "25,-7 25,7 18,0");
			    nodeTriangle
			      .attr("transform", function(d) { return "rotate(" + (-1) * degrees(angle(d.type)) + ")"});
			    nodeTriangle.exit().remove();
			    enter.selectAll("*")
			      .style("opacity", 0)
			      .transition()
			      .duration(500)
			      .style("opacity", 1);
			  }
			  // Highlight the link and connected nodes on mouseover.
			  function linkMouseover(d) {
			    svg.selectAll(".link").classed("active", function(p) { return p === d; });
			    svg.selectAll(".node").classed("active", function(p, j) { return p[0] === d[0].source || p[0] === d[0].target; })
			    d3.selectAll(".node.active").select("rect").attr("width", function(d) {
			      return this.nextSibling.getBBox().width + 50
			      })
			    d3.selectAll(".node.active, .link.active").moveToFront();
			  }
			  // Highlight the node and connected links on mouseover.
			  function nodeMouseover(d) {
			    svg.selectAll(".link").classed("active", function(p) { 
			      return p[0].source === d[0] && p[0].source.node.index !== 0 || p[0].target === d[0] && p[0].source.node.index !== 0; });
			    d3.select(this).classed("active", true);
			    d3.selectAll(".node:not(.active)").classed("active", function(q) {
			      if (q[0].node.index !== 0 && q[0].node.imports.indexOf(d[0].node.name) !== -1 || d[0].node.imports.indexOf(q[0].node.name) !== -1) {
			        switch (d[0].type) {
			          case "target": 
			            return q[0].type !== "source-target"
			          case "source": 
			            return q[0].type !== "target-source"
			          case "source-target": 
			            return q[0].type !== "source-target" && q[0].type !== "target"
			          case "target-source": 
			            return q[0].type !== "target-source" && q[0].type !== "source"
			          default: 
			            return q
			        }
			      }
			    });
			    d3.selectAll(".node.active").select("rect").attr("width", function(d) {
			      return this.nextSibling.getBBox().width + 20
			      })
			    d3.selectAll(".node.active, .link.active").moveToFront();
			  }
			  // Clear any highlighted nodes or links.
			  function mouseout() {
			    svg.selectAll(".active").classed("active", false);
			  }
			  function sortNodes() {
			    switch ($("#changeTransition .active").attr("data-sort")) {
			      case "natural": 
			        nodesByType = d3.nest()
			          .key(function(d) { return d.type; })
			          .sortKeys(d3.ascending)
			          .sortValues(function(a, b) { return d3.ascending })
			          .entries(currentlyVisibleNodes);
			        break;
			      case "import": 
			        nodesByType = d3.nest()
			          .key(function(d) { return d.type; })
			          .sortKeys(d3.ascending)
			          .sortValues(function(a, b) { return d3.ascending(a.imports.length, b.imports.length)})
			          .entries(currentlyVisibleNodes);
			        break;
			      default: 
			        nodesByType = d3.nest()
			          .key(function(d) { return d.type; })
			          .sortKeys(d3.ascending)
			          .entries(currentlyVisibleNodes);
			    }
			  }
			  d3.selectAll("#changeTransition a").on("click", function() {
			    nodesByType = [];
			    sortNodes();
			    nodesByType.forEach(function(type) {
			      var count = 0;
			      type.values.forEach(function(d, i) {
			        if (!d.unused) {
			          d.index = count++;
			        }
			        else {
			          d.index = 0
			        }
			      });
			      type.count = count - 1;
			    });
			    d3.selectAll(".node").transition().duration(500).attr("transform", function(d) { return "rotate(" + degrees(angle(d[0].type)) + "), translate(" + radius(d[0].node.index) + ")"; });
			    d3.selectAll(".link path").transition().duration(500).attr("d", link()
			      .angle(function(d) { return angle(d.type) })
			      .radius(function(d) { return radius(d.node.index)}));
			  });
			  d3.selectAll("#filters a").on("click", function() {
			    var checkedValues = [],
			        newNodeSet = [];
			    $(this).toggleClass("active")
			    $("#filters a.active").each(function() {
			      var checkboxValue = $(this).attr("data-sort");
			      allPakages.forEach(function(d, i) {
			        if (allPakages[i].key == checkboxValue) {
			          checkedValues.push(i);
			        }
			      })
			    })
			    var recreateData = function(nodeSet) {
			      // recreate the links array out of only nodeSet nodes
			      links = [];
			      nodeSet.forEach(function(source) {
			        source.imports.forEach(function(targetName) {
			          var target = nodesByName[targetName];
			          if (nodeSet.indexOf(target) !== -1) {
			            if (!source.source) source.connectors.push(source.source = {node: source, degree: 0});
			            if (!target.target) target.connectors.push(target.target = {node: target, degree: 0});
			            links.push({source: source.source, target: target.target});
			          }
			        });
			      });
			      // create array nodesThatShouldAppear out of source/target nodes of links array
			      var nodesThatShouldAppear = [];
			      newNodesByType = [];
			      links.forEach(function(d, i) {
			        if (nodesThatShouldAppear.indexOf(links[i].source) < 0) {
			          nodesThatShouldAppear.push(links[i].source);
			        }
			        if (nodesThatShouldAppear.indexOf(links[i].target) < 0) {
			          nodesThatShouldAppear.push(links[i].target);
			        }
			      });
			      // copy contents of nodesThatShouldAppear into newNodesByType
			      // THE BUG (where nodes go missing): 
			      // newNodesByType is losing nodes from nodesByType
			      nodesThatShouldAppear.forEach(function(d, i) {
			        newNodesByType.push(nodesThatShouldAppear[i].node)
			      })
			      newNodesByType = _.uniq(newNodesByType)
			      // set the currently visible nodes for sake of sorting
			      currentlyVisibleNodes = newNodesByType;
			      // reset nodesByType in order to sort they by currently active key
			      nodesByType = [];
			      sortNodes();
			      nodesByType.forEach(function(type) {
			        var count = 0;
			        type.values.forEach(function(d, i) {
			          d.index = count++ ; 
			        });
			        type.count = count - 1;
			      });
			      flattenedLinks = [];
			      for (k=0; k<links.length; k++) {
			        var linkArray = [];
			        linkArray.push(links[k]);
			        flattenedLinks.push(linkArray)
			      }
			      flattenedNodes = [];
			      for (i=0; i < nodeSet.length; i++) {
			        var connectors = nodeSet[i].connectors
			        for (j=0; j < connectors.length; j++) {
			          var subArray = [];
			          subArray.push(connectors[j]);
			          if (nodesThatShouldAppear.indexOf(subArray[0]) > 0) {
			            flattenedNodes.push(subArray)
			          }
			        }
			      }
			      radius.domain(d3.extent(nodeSet, function(d) { return d.index; }));
			      if (outerRadius / d3.extent(nodeSet, function(d) { return d.index; })[1] * nodesByType[0].values.length > 470) {
			        while(outerRadius / d3.extent(nodeSet, function(d) { return d.index; })[1] * nodesByType[0].values.length > 480) {
			          outerRadius --;
			        }
			        radius.range([innerRadius, outerRadius])
			      }
			      else {
			        outerRadius = 550;
			        radius.range([innerRadius, outerRadius])
			      }
			    }
			    checkedValues.forEach(function(d, i) {
			      allPakages[d].values.forEach(function(node, i) {
			        if (!node.unused) {
			          newNodeSet.push(node)
			        }
			      })
			    })
			    newNodeSet = _.uniq(newNodeSet);
			    recreateData(newNodeSet);
			    draw();
			  })
			});
			// A shape generator for Hive links, based on a source and a target.
			function link() {
			  var source = function(d) { return d.source; },
			      target = function(d) { return d.target; },
			      angle = function(d) { return d.angle; },
			      startRadius = function(d) { return d.radius; },
			      endRadius = startRadius,
			      arcOffset = -Math.PI / 2;
			  function link(d, i) {
			    var s = node(source, this, d, i),
			        t = node(target, this, d, i),
			        x;
			    if (t.a < s.a) x = t, t = s, s = x;
			    if (t.a - s.a > Math.PI) s.a += 2 * Math.PI;
			    var a1 = s.a + (t.a - s.a) / 3,
			        a2 = t.a - (t.a - s.a) / 3;
			    return s.r0 - s.r1 || t.r0 - t.r1
			        ? "M" + Math.cos(s.a) * s.r0 + "," + Math.sin(s.a) * s.r0
			        + "L" + Math.cos(s.a) * s.r1 + "," + Math.sin(s.a) * s.r1
			        + "C" + Math.cos(a1) * s.r1 + "," + Math.sin(a1) * s.r1
			        + " " + Math.cos(a2) * t.r1 + "," + Math.sin(a2) * t.r1
			        + " " + Math.cos(t.a) * t.r1 + "," + Math.sin(t.a) * t.r1
			        + "L" + Math.cos(t.a) * t.r0 + "," + Math.sin(t.a) * t.r0
			        + "C" + Math.cos(a2) * t.r0 + "," + Math.sin(a2) * t.r0
			        + " " + Math.cos(a1) * s.r0 + "," + Math.sin(a1) * s.r0
			        + " " + Math.cos(s.a) * s.r0 + "," + Math.sin(s.a) * s.r0
			        : "M" + Math.cos(s.a) * s.r0 + "," + Math.sin(s.a) * s.r0
			        + "C" + Math.cos(a1) * s.r1 + "," + Math.sin(a1) * s.r1
			        + " " + Math.cos(a2) * t.r1 + "," + Math.sin(a2) * t.r1
			        + " " + Math.cos(t.a) * t.r1 + "," + Math.sin(t.a) * t.r1;
			  }
			  function node(method, thiz, d, i) {
			    var node = method.call(thiz, d, i),
			        a = +(typeof angle === "function" ? angle.call(thiz, node, i) : angle) + arcOffset,
			        r0 = +(typeof startRadius === "function" ? startRadius.call(thiz, node, i) : startRadius),
			        r1 = (startRadius === endRadius ? r0 : +(typeof endRadius === "function" ? endRadius.call(thiz, node, i) : endRadius));
			    return {r0: r0, r1: r1, a: a};
			  }
			  link.source = function(_) {
			    if (!arguments.length) return source;
			    source = _;
			    return link;
			  };
			  link.target = function(_) {
			    if (!arguments.length) return target;
			    target = _;
			    return link;
			  };
			  link.angle = function(_) {
			    if (!arguments.length) return angle;
			    angle = _;
			    return link;
			  };
			  link.radius = function(_) {
			    if (!arguments.length) return startRadius;
			    startRadius = endRadius = _;
			    return link;
			  };
			  link.startRadius = function(_) {
			    if (!arguments.length) return startRadius;
			    startRadius = _;
			    return link;
			  };
			  link.endRadius = function(_) {
			    if (!arguments.length) return endRadius;
			    endRadius = _;
			    return link;
			  };
			  return link; }
			function degrees(radians) {
			  return radians / Math.PI * 180 - 90;
			}
		},
		teardown: function() {
			
		}
	}
	return hiveplot;
});