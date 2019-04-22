



//Read the data
d3.csv("csv/IVPDatasetHeatmap.csv", function (data) {
	// set the dimensions and margins of the graph
	var margin = { top: 80, right: 40, bottom: 80, left: 90 },
		width = 1250 - margin.left - margin.right,
		height = 650 - margin.top - margin.bottom;
	// append the svg object to the body of the page
	var svg = d3.select("#heatmapPricePointCountry")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	// Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
	//Column
	var myGroups = d3.map(data, function (d) { return d.iso; }).keys()
	myGroups.sort();
	//Row
	var myVars = d3.map(data, function (d) { return d.point; }).keys()

	// Build X scales and axis:
	var x = d3.scaleBand()
		.range([0, width])
		.domain(myGroups)
		.padding(0.05);
	svg.append("g")
		.style("font-size", 15)
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).tickSize(0))
		.select(".domain").remove()

	// Build Y scales and axis:
	var y = d3.scaleBand()
		.range([height, 0])
		.domain(myVars)
		.padding(0.05);
	svg.append("g")
		.style("font-size", 15)
		.call(d3.axisLeft(y).tickSize(0))
		.select(".domain").remove()

	// Build color scale
	var myColor = d3.scaleSequential()
		.interpolator(d3.interpolateRdYlGn)
		.domain([100, 0])

	//Build legend
	var linear = d3.scaleSequential()
		.interpolator(d3.interpolateRdYlGn)
		.domain([100, 0]);

	svg.append("g")
		.attr("class", "legendLinear")
		.style("opacity", 0.8)
		.attr("transform", "translate(550,-50)");

	var legendLinear = d3.legendColor()
		.shapeWidth(50)
		.cells(11)
		//.labels(["<10","11-20","21-30","31-40","41-50","51-60","61-70","71-80","81-90","91-100",">100"])
		.labels([">100", "91-100", "81-90", "71-80", "61-70", "51-60", "41-50", "31-40", "21-30", "11-20", "<10"])
		.orient('horizontal')
		.ascending(1)
		.scale(linear);

	svg.select(".legendLinear")
		.style("font-size", "14px")
		.call(legendLinear);

	// create a tooltip
	var Tooltip = d3.select("body")
		.append("div")
		.style("opacity", 0)
		.style("position", "absolute")
		.attr("class", "tooltip")
		.style("z-index", "10")
		.style("background-color", "white")
		.style("border", "solid")
		.style("border-width", "2px")
		.style("border-radius", "5px")
		.style("padding", "5px")

	// Three function that change the tooltip when user hover / move / leave a cell
	var mouseover = function (d) {
		Tooltip
			.style("opacity", 1)
		d3.select(this)
			.style("stroke", "black")
			.style("opacity", 1)
	}
	var mousemove = function (d) {
		Tooltip
			.html("<strong>" + d.name + "</strong><br>Wine rating:" + d.point + "<br>Average price of wine: " + d.average_price)
			.style("left", (d3.mouse(this)[0]) + "px")
			.style("top", (d3.mouse(this)[1] - 30) + "px")
	}
	var mouseleave = function (d) {
		Tooltip
			.style("opacity", 0)
		d3.select(this)
			.style("stroke", "none")
			.style("opacity", 0.8)
	}

	// add the squares
	svg.selectAll()
		.data(data, function (d) { return d.iso + ':' + d.point; })
		.enter()
		.append("rect")
		.attr("x", function (d) { return x(d.iso) })
		.attr("y", function (d) { return y(d.point) })
		.attr("rx", 4)
		.attr("ry", 4)
		.attr("width", x.bandwidth())
		.attr("height", y.bandwidth())
		.style("fill", function (d) {
			if (d.average_price == 0) {
				return "#1C1C1C";
			} else {
				return myColor(d.average_price);
			}
		})
		.style("stroke-width", 4)
		.style("stroke", "none")
		.style("opacity", 0.8)
		.on("mouseover", mouseover)
		.on("mousemove", mousemove)
		.on("mouseleave", mouseleave)


	// Add subtitle to graph
	svg.append("text")
		.attr("x", 420)
		.attr("y", -20)
		.attr("text-anchor", "right")
		.style("font-size", "14px")
		.text("Average price (USD)");

	svg.append("text")
		.attr("x", 35)
		.attr("y", -height / 2)
		.attr("text-anchor", "middle")
		.style("font-size", "14px")
		.style("writing-mode", "tb-rl")
		.style("transform", "rotate(-180deg)")
		.text("Wine Rating");

	svg.append("text")
		.attr("x", (width) / 2)
		.attr("y", height + 35)
		.attr("text-anchor", "bottom")
		.style("font-size", "14px")
		.text("Country");
})

// Add title to graph
//svg.append("text")
//.attr("x", 0)
//.attr("y", -50)
//.attr("text-anchor", "left")
//.style("font-size", "22px")
//.text("A d3.js heatmap");

